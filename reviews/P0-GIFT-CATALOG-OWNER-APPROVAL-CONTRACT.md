# P0 Gift Catalog — Owner Approval Contract

Status: **DRAFT / NOT APPROVED / NOT ACTIVATABLE**.

This contract prevents source text, index matches, or engineering-generated IDs from being treated as owner-approved release content. Do not populate approval fields on the owner's behalf.

## 1. Required deliverables

For each of the six gift natures, the release record must contain:

- Nature key and display label.
- Owner-approved, immutable stable IDs for exactly 100 items.
- Item text and source provenance locator.
- Source kind and action/verb classification.
- Reviewed side/category, phase, and release-vs-reframe classification where applicable.
- Explicit decision for any item with no source run, multiple possible source runs, ambiguous locator, or unsupported channel/verb.
- Reviewer, approval date, version, and checksum of the frozen bank.
- Deterministic mapping from each gift nature to the four client tracks, including tie-break/fallback behavior.

## 2. Validation rules

A bank cannot be marked ready unless all rules pass:

1. Exactly 100 unique stable IDs per nature; no generated placeholders.
2. No duplicate IDs within or across natures unless the contract explicitly permits them.
3. Every item has non-empty text and a source locator resolvable to the reviewed source.
4. Every provenance ambiguity has a recorded human decision; no silent first-match selection.
5. Source kind and action/verb values belong to the approved finite contract.
6. Release/reframe and phase fields are populated only from reviewed source evidence.
7. Every bank has owner approval tied to a specific checksum/version.
8. All six natures map deterministically to one of the four tracks under explicit, tested rules.
9. Tests prove rejection of missing IDs, duplicate IDs, unknown nature/track values, unapproved versions, and incomplete banks.
10. Unapproved banks remain unavailable to activation, issuance, and live account attach.

## 3. Known audit gaps to resolve

Previous source crosswalk found exact index ID/title matches for 150/150 rows and source locators for 376/376, but these matches do not establish semantic approval. The audit also found only 143/150 explicit source runs, 7 with none, 55 with multiple candidates, 43 lacking source kind/verb, 13 using “Say” outside the six-channel contract, and no final stable pattern IDs or reviewed-side/phase/release-reframe fields for the 150-row sample.

Treat those figures as audit findings to re-verify against the current source revision before release; do not infer approvals from them.

## 4. Owner decisions required

- [ ] Approve the six nature names and immutable nature keys.
- [ ] Approve exactly 100 items per nature, with stable IDs and frozen checksums.
- [ ] Resolve all source-run and provenance ambiguities.
- [ ] Approve the finite source-kind/action vocabulary.
- [ ] Approve release/reframe and phase classifications.
- [ ] Approve the six-to-four track mapping and tie-break rules.
- [ ] Approve versioning, replacement, revocation, and rollback behavior.
- [ ] Confirm unapproved/withdrawn content cannot be issued or resurrected.

## 5. Evidence to attach

- Frozen manifest JSON for all six banks.
- Validation report and deterministic mapping contract tests.
- Provenance exception register with reviewer decisions.
- Approval record containing approver, date, version, and checksums.
- CI run URL and exact commit SHA.
- Redacted proof that server-side issuance rejects unapproved manifests.

## Release rule

Engineering may prepare schemas, validators, fixtures, and tests against synthetic fixtures. Engineering must not invent production IDs, fill missing content, decide ambiguous source classifications, or mark a bank approved. P0 remains blocked until all owner decisions and evidence above are complete.