# ATÜNED Account Deletion and Restore Runbook

**Status:** Operating draft; current end-to-end deletion and restore behavior is not proven by this pack.  
**Risk:** A successful browser confirmation is not evidence that all server, vendor, log and backup copies were deleted.

## 1. Required behavior

- Deletion request must be authenticated or proportionately verified.
- Before confirming completion, the system must enumerate the account's known stores and dependent records.
- Every delete step must be idempotent, auditable and retryable.
- Partial failures remain visible to the operator and user; do not issue a false “all data removed” receipt.
- The restore promise in current Terms is not approved until the 90-day backup period, access restrictions, restore procedure and no-resurrection behavior have been tested.
- No profile sync or new data-store path may be enabled without updating this map and its consent/privacy assessment.

## 2. Execution sequence

1. Confirm request identity and explain the scope currently offered by the product.
2. Record a deletion request ID and freeze nonessential processing for the target account while it is being handled, where supported.
3. Enumerate account ID, auth record, profile, user story/release/reframe/verification records, usage grants and ledger links, first-visit/session/attachment/challenge rows, consent evidence, billing identifiers, audit/log references, exports and vendor copies.
4. Decide with counsel which records must be retained for legal/accounting/security reasons; preserve the minimum required evidence and sever unnecessary account/content links where appropriate.
5. Delete/disable the account in the authoritative live application store.
6. Delete related content and dependent rows in transaction-safe order; record per-table result. If a linked entitlement/ledger must be retained, define its pseudonymous linkage, purpose and retention separately.
7. Clear client-local storage only through the documented client path; tell the user that browser exports and other downloaded copies are outside server deletion.
8. Issue vendor-side deletion requests where applicable and record the response or remaining provider retention.
9. Mark live-store deletion complete only after all required systems return verified results.
10. If backup restore is a supported feature, verify backup retention/expiry, operator access and restore source before invoking it. Restore must require authorization, retain an audit record, and not silently revive deleted consent, active subscriptions or third-party sharing.
11. Run a no-resurrection check against every sync/restore/import job so a deleted record is not re-created from a stale replica, cache, delayed event or payment webhook.
12. Provide a receipt with separate states for local, live, vendors and backup retention. State any legally retained record or incomplete provider confirmation.

## 3. Required tests

- Unknown account / unauthenticated request fails safely.
- Repeated deletion request is idempotent.
- Failure injected into each store leaves status partial and retryable.
- Orphaned attachment/challenge/session record is detected.
- Ledger or consent records handled according to approved retention decision.
- Browser local-storage deletion is not represented as server deletion.
- Vendor failure does not report full completion.
- Backup expiry is actually observed or tested by a policy/fixture.
- Restore does not revive an account beyond authorized scope.
- Deletion followed by stale queue/event/webhook replay does not resurrect content.
- Audit receipt contains no raw story text, authentication secret or unnecessary sensitive fields.

## 4. Current publication blocker

The Terms/Privacy drafts say an account leaves the live system immediately and a locked backup remains for 90 days, with possible restoration during that period. Neither this runbook nor the source drafts constitute proof that the deployed infrastructure implements that behavior. Do not repeat this promise as verified until engineering supplies the live storage inventory, backup configuration evidence, expiry proof and successful restore/no-resurrection test run.
