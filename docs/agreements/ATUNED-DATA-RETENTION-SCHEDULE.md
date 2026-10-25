# ATÜNED Data Retention Schedule

**As of:** 11 October 2026  
**Status:** Proposed internal schedule and verification checklist. It is not an infrastructure configuration statement or a public promise.

## Principles

1. Collect only data needed for an identified product, security, legal or billing purpose.
2. Assign a retention trigger and deletion authority to each data class.
3. Deleting an account from a live system, purging backups, deleting vendor copies, and deleting local-browser data are separate events.
4. A record is not anonymous merely because a direct identifier is removed; confirm linkage and reidentification risk.
5. Any period below marked “decision required” remains unresolved until product owner and counsel approve it and engineering demonstrates it.

## Schedule

| Data class / store | Purpose | Proposed trigger/period | Status and proof required |
|---|---|---|---|
| Browser-local story, answers and snapshots | Provide local instrument/history | Until user clears site data or uses a documented in-app deletion flow; exact local key list must be verified | Privacy draft claim; test each browser storage class and export path |
| Browser-local derived profile/birth inputs | Local-only optional interpretation | Remain on device until user deletes site data/record as specified | Privacy draft says these fields never leave device; network and storage negative tests required |
| Transient free-quiz story in memory | Run local quiz | Until flow/page ends; no persistence | Privacy draft claim; prove no network request, browser storage or logs |
| Account/authentication data | Account access and recovery | Owner ruling records 24-month retention after delete; exact record classes/stores covered remain to be mapped. Existing legal drafts also say live removal is immediate with a restorable 90-day backup, which must be reconciled. | Map each account/authentication record and deletion event to the ruling; verify actual purge/backup jobs and legal exceptions with counsel. Do not re-ask the period already recorded in `DECISIONS.md`. |
| Server-side first-visit/session/attachment/challenge records | Session continuity and product operations | Period not yet approved; identify purpose and purge trigger per table | Open question; export actual schemas, linked keys, row age distribution, retention jobs and access paths |
| Story/release/reframe/verification records | User-requested service and personal history | Account term, subject to separate deletion and legally required retention; sync scope must first be decided | Story transfer conflict blocks final wording; list fields and stores |
| Canonical catalog/source provenance | Product content integrity | Keep versioned content/provenance under a documented catalog governance policy; remove personal data if attached unnecessarily | Gift catalog itself remains provisional; do not treat candidate IDs as approved |
| Usage/grant/consumption ledger | Entitlement, fraud control and reconciliation | Period set by purpose/legal accounting needs; distinguish immutable ledger from user-visible record | Engineering and owner to specify period; test idempotency and account deletion/linkage treatment |
| Consent/assent evidence | Prove text/purpose/version and action | Keep as long as needed to demonstrate assent/withdrawal and satisfy applicable obligations; counsel must set period and access controls | No verified consent evidence store in this pack |
| Billing/subscription/refund records | Contract administration, tax/accounting and charge disputes | Use legally required/accounting/processor periods determined by counsel and finance; do not imply account deletion deletes these necessarily | Stripe fields/retention verified against real account and processor terms |
| Security/audit logs | Detect misuse, investigate incidents and maintain integrity | Short, purpose-limited rotation period; owner/security/counsel must set the exact period | Identify logs, field content, access, rotation, export and incident hold |
| Operational backups | Disaster recovery | Current Terms/Privacy draft says locked, restorable backup for 90 days. Latest owner ruling separately says retention after delete is 24 months, but does not define whether/how backup copies or other record classes are in scope. **CONFLICT / BLOCKED.** | Engineering documents configured expiry, backup class, access, purge/restore behavior and no-resurrection. Product owner clarifies scope only if genuinely not resolved by the existing ruling; counsel approves final explanation. Do not publish 90 days or 24 months as an infrastructure claim without proof. |
| Vendor-side copies | Payment, hosting, auth, speech or other services | Based on active vendor contract, service configuration and legal hold | Processor register must list each vendor and distinct deletion path |
| Support email/tickets | Answer rights, refund and incidents | Period and access policy decision required | Confirm mailbox provider, access roster, deletion and incident retention |
| Research/model-improvement copy | Any training or product research | **Launch ruling: no model is trained on stories and research sharing is off/not offered.** Do not create a research copy for this purpose. Reopen only with a new explicit owner ruling, counsel review, specific notice/consent where required and tested withdrawal controls. | Verify training/research code paths and access/config are absent or disabled; do not treat this schedule as permission to make a research dataset |

## Required engineering output

For each concrete table/store: system/project, table/key, data fields, personal/sensitive classification, purpose, collection trigger, retention trigger, scheduled job, deletion API/path, backup behavior, processor copy, logs/replicas, authorization role, test fixture, evidence URL/SHA, and known exceptions.

## Deletion completion states

- **LOCAL-CLEARED:** documented browser/local stores cleared and confirmed.
- **LIVE-STORE-CLEARED:** identified live database/system says the target record is removed or irreversibly detached.
- **VENDOR-REQUESTED / VENDOR-CONFIRMED:** separate provider deletion request and response if applicable.
- **BACKUP-EXPIRED:** expiry policy elapsed and checked; not inferable from live deletion.
- **REQUEST-COMPLETE:** every in-scope store has a verified outcome or an explicitly counsel-approved exception disclosed to the user.

Never collapse these states into the ambiguous phrase “permanently deleted” unless every relevant system and backup path supports it and counsel approves the statement.
