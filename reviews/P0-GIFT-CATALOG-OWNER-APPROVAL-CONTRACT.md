# P0 Gift Catalog — Owner Approval Contract

Status: **DRAFT / NOT APPROVED / NOT ACTIVATABLE**.

Source text, index matches, and engineering-generated IDs are not owner approval. Do not populate approval fields on the owner's behalf.

## Required deliverables

For each of the six gift natures, record:

- Owner-approved immutable nature key and display label.
- Exactly 100 items with owner-approved stable IDs.
- Item text and resolvable source provenance locator.
- Reviewed source kind and action/verb classification.
- Reviewed side/category, phase, and release-vs-reframe classification where applicable.
- Explicit human decision for missing or ambiguous source runs, locators, or unsupported channels/verbs.
- Reviewer, approval date, version, and checksum of the frozen bank.
- Deterministic mapping from each nature to the four client tracks, including tie-break/fallback behavior.

## Validation rules

A bank is not ready unless all pass:

1. Exactly 100 unique stable IDs per nature; no generated placeholders.
2. No duplicate IDs within/across natures unless explicitly permitted by the contract.
3. Every item has non-empty text and a resolvable source locator.
4. Provenance ambiguities have recorded human decisions; no silent first-match selection.
5. Source-kind/action values belong to the approved finite contract.
6. Release/reframe and phase fields derive from reviewed evidence.
7. Owner approval is tied to a specific checksum/version.
8. All six natures map deterministically to one of four tracks under explicit tested rules.
9. Tests reject missing/duplicate IDs, unknown nature/track values, unapproved versions, and incomplete banks.
10. Unapproved banks cannot be activated, issued, or attached to live accounts.

## Known audit gaps to re-verify

Previous source crosswalk found exact index ID/title matches for 150/150 rows and source locators for 376/376; this does not establish semantic approval. The audit also found 143/150 explicit source runs, 7 with none, 55 with multiple candidates, 43 lacking source kind/verb, 13 using “Say” outside the six-channel contract, and no final stable pattern IDs or reviewed-side/phase/release-reframe fields for the 150-row sample.

Re-verify these findings against the current source revision before release. Do not infer approvals from them.

## Owner decisions required

- [ ] Approve the six nature names and immutable keys.
- [ ] Approve exactly 100 items per nature with stable IDs and frozen checksums.
- [ ] Resolve source-run and provenance ambiguities.
- [ ] Approve the finite source-kind/action vocabulary.
- [ ] Approve release/reframe and phase classifications.
- [ ] Approve the six-to-four track mapping and tie-break rules.
- [ ] Approve versioning, replacement, revocation, and rollback behavior.
- [ ] Confirm unapproved/withdrawn content cannot be issued or resurrected.

## Evidence to attach

- Frozen manifest JSON for all six banks.
- Validation report and deterministic mapping contract tests.
- Provenance exception register with reviewer decisions.
- Approval record containing approver, date, version, and checksums.
- CI run URL and exact commit SHA.
- Redacted proof that server-side issuance rejects unapproved manifests.

## Release rule

Engineering may prepare schemas, validators, synthetic fixtures, and tests. Engineering must not invent production IDs, fill missing content, decide ambiguous source classifications, or mark a bank approved. P0 remains blocked until all owner decisions and evidence are complete.