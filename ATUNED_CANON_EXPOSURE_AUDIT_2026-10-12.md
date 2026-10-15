# ATÜNED Public Runtime Canon Exposure Audit

**Refresh:** 12 October 2026 UTC  
**Code PR:** [Reboot-OS #35](https://github.com/rebootos-sourcce/Reboot-OS/pull/35)  
**Current code head:** `48313941da1338e2cd0ec1d5d9cd4d9b2d5c6bdf`
**State:** PR #35 remains draft/open/unmerged. Parent server suite passed 147/147; current head server/smoke checks are in progress. Previous Cloudflare build `4493054d-55c0-4cef-8edf-8d002103aaeb` failed; latest build `0b27be84-ebb9-4d97-b20b-eba999fdcebc` is in progress. No production change occurred.

## Finding

Before this patch, `GET /v1/canon` returned the public runtime manifest and `GET /v1/canon/:table` could read any table named in that manifest. `CANON_TIER` was empty, so absent entries defaulted to tier zero. The source migration is generated from `atuned/data/canon.sqlite` and is separate from the protected `canon_vault.sqlite` reviewed here.

No current leak of the recovered protected vault is established. It was not shown to be the database behind the runtime public routes, and it has not been imported. The current finding is a public-runtime boundary and content-classification gap, not proof of an active protected-vault disclosure.

## What the patch protects

PR #35 recomputes source-compatible content fingerprints before returning public rows. `test/canon-public.test.mjs` covers same-row-count BANDS mutation, unlisted tables, and metadata/row-count mutation. The parent server workflow passed 147/147; current head `48313941da1338e2cd0ec1d5d9cd4d9b2d5c6bdf` is being revalidated.

The canonicalization source is `atuned/test/tools/canon.py`: SHA-256 of UTF-8 JSON encoded with sorted keys and `ensure_ascii=False`, truncated to 16 hex characters. Local reproduction of BANDS matches the committed `a40ba9c5e1dfb8d3`. This validates the implementation path and fixture compatibility; it does not approve the meaning or public suitability of any table.

## Current exact-head validation

- Parent server workflow [#38333258827](https://github.com/rebootos-sourcce/Reboot-OS/actions/runs/38333258827): **147 tests passed, 0 failed** on `9a1949b061d3e0c8758c700867ef654758e221b9`. Latest head is running its own suite.
- The latest two smoke checks on head `48313941da1338e2cd0ec1d5d9cd4d9b2d5c6bdf` are in progress; older detailed smoke counts are historical.
- The server workflow successfully dry-ran `wrangler deploy --dry-run` under both candidate names `atuned-api` and `atuned-os`. It did not deploy. A read-only health GET returned HTTP 200 at `https://atuned-api.lance-o-powell.workers.dev/v1/health` and 404 at `https://atuned-os.lance-o-powell.workers.dev/v1/health`. This supports checking the Cloudflare service-name/root/config alignment but is not proof of the build-failure cause.
- Prior Cloudflare build [4493054d-55c0-4cef-8edf-8d002103aaeb](https://dash.cloudflare.com/b34a8a4f24d5ac71f7b386c240a6da90/workers/services/view/atuned-os/production/builds/4493054d-55c0-4cef-8edf-8d002103aaeb) failed; latest build [0b27be84-ebb9-4d97-b20b-eba999fdcebc](https://dash.cloudflare.com/b34a8a4f24d5ac71f7b386c240a6da90/workers/services/view/atuned-os/production/builds/0b27be84-ebb9-4d97-b20b-eba999fdcebc) is in progress. If it fails, authenticated logs are required; do not bypass.

## Protected vault recovery — verified locally, not deployed

The earlier handoff statement that the SQLite vault was missing is superseded. A paginated Library inventory across 808 items located `canon_vault.sqlite` (3,346,432 bytes; SHA-256 `9c2cd7b610c1e7b1d056646047988b67d0f52368139952bcc2782b930056915e`). It was opened in read-only mode and returned `PRAGMA integrity_check = ok`, no foreign-key violations, no orphan statement/source/block references, and no block item-count mismatches.

Counts verified from the database: 2,900 canonical limiting-belief statements (all sniff-eligible), 2,700 canonical embodied truths (excluded from sniff matching), 72 exact-duplicate groups, 496 topics, four source records, 58 limiting blocks, 54 truth blocks and 52 paired 50/50 blocks. Its 2,900 FTS rows map to the 2,900 eligible limiting statements through rowid. Raw source-file size, MD5 and SHA-256 matched the vault metadata for all four recoverable source artifacts.

**Isolation rule:** preserve this vault as protected local/server-side source. Do not bundle its statement corpus or FTS index into the public client, import it into runtime tables, or write it to production/Supabase without source-authority classification, authenticated access controls, owner approval, and negative tests proving public endpoints cannot return it.

## Current remaining risk

1. Eight entries are now excluded from public responses due to explicit proposed, unresolved, not-yet-dictated, or vault-labeled descriptions: `INFERRED`, `SPLITPROP`, `SPLITASK`, `LADDERASK`, `DICTSTRUCT`, `ARCH12`, `LAWSX`, and `RARE`. This does not prove that `RARE` originated in the protected database. The remaining 119 allowlisted entries still need source-authority/public-suitability classification.
2. Independently review that source-compatible content-fingerprint validation covers the full runtime allowlist, keep the mutation and negative-access tests, and classify every exposed table before any new source is added.
3. No fixed starter-gift bank is approved: the 560-row work queue still contains zero stable product pattern IDs, zero owner-approved rows, zero reviewed line splits, and zero selected manifest members. The 100-per-nature requirement is not yet content-complete.
4. The current-release browser → Worker → Supabase write/read/reload journey remains 0/1 independently verified.
5. The recovered local gateway imports `source_service.SourceService`, which was not found in the Library or current Reboot-OS server source directory. It also lacks a complete trusted account-identity contract. It is not ready to deploy or port as-is.

## Remaining acceptance conditions

1. Obtain and resolve the current Cloudflare build’s first failing log step.
2. Preserve exact-head server, smoke and negative-access tests; investigate the target mismatch without bypassing Cloudflare checks.
3. Complete source-authority/public-suitability review of the remaining 119 allowlisted runtime entries; maintain quarantine of eight flagged entries and verify protected-vault separation.
4. Keep the recovered vault local/server-only until access isolation is proven and import is explicitly approved.
5. Review source lines into stable, source-grounded IDs, sentence boundaries and correct release/reframe metadata; obtain explicit approval before creating or activating each exact 100-item category bank.
6. Prove a persisted current-release journey on a disposable, approved non-production environment.

**Measurements:** source manifest 127 entries; public allowlist 119; quarantined entries 8; parent server tests 147/147; current exact-head checks pending; protected-vault integrity and four source hashes verified locally; stable product IDs 0; owner-approved gift rows 0; deployed isolation 0/1.  
**Confidence:** 0.99 in parent test and local vault-integrity/source-hash evidence; source authority for the remaining public entries, deployed isolation, Cloudflare diagnosis, and overall release readiness remain unverified.