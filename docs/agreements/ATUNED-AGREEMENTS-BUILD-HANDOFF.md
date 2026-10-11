# ATÜNED Agreements Build Handoff

**Status:** Requirements contract only. The documentation branch does not implement application code or approve public release.  
**Recipients:** Build owner, QA, product owner, privacy/legal reviewer.

## 1. Scope

Implement and prove the controls needed for accurate Terms, Privacy, Consumer Health Data notice (if applicable), Privacy Breakdown, consent evidence, legal routes, billing disclosures, request handling and deletion. Use the source Markdown and existing renderer. Do not hand-edit generated HTML.

## 2. Contract requirements

| ID | Requirement | Failure behavior | Acceptance evidence |
|---|---|---|---|
| BH-01 | Legal pages must be generated from approved root Markdown through funnel/legal/render.py | Build stays draft/noindex and release-blocked if source approval is absent | Renderer run, output diff, source/output hash manifest |
| BH-02 | Generated legal pages must be included in the correct deployment output list only after approval | No accidental public exposure; no hidden/omitted links | Workflow diff; exact build artifact listing; deployment/page list check |
| BH-03 | Legal routes must be linked from public footer and each relevant entry/signup/onboarding/account/checkout surface | Missing route or failed route remains a test failure | Direct route tests in private browser, link crawl and mobile/desktop screenshots |
| BH-04 | Required Terms acceptance and any purpose-specific consent are separate controls | Missing required assent/consent blocks the covered operation; optional refusal leaves unaffected features available | Accessible UI assertions, unticked default test, negative controls |
| BH-05 | Evidence records exact text/version/hash, purpose, action and timestamp | Do not accept or process protected data without required evidence | Schema, API test, stored-row readback, retry/idempotency, withdrawal tests |
| BH-06 | Story and derived data transfer must exactly match approved data map and notice | Unexpected data path blocks feature and release | Network capture and storage inventory for quiz, account create, release, history, voice and deletion |
| BH-07 | Gift issuance uses selectedGroundId and distinct giftNatureId as product-approved; only issue from active frozen set of exactly 100 unique stable pattern IDs | Missing choice, stale/unapproved set, wrong count, duplicate ID or hash mismatch must fail closed without decrement/issue | Cross-repo schema and E2E evidence; issue #58 resolved; owner approval; hashes and IDs read back |
| BH-08 | Billing page shows exact plan, price/currency, interval, recurring term, tax handling, cancellation route and approved refund policy before authorization | Missing/ambiguous facts or absent assent must prevent charge | Test-mode checkout config, exact UI copy, provider readback and cancellation/refund runs |
| BH-09 | Account close/delete displays only the scope proven by system receipts and reconciled with the owner’s 24-month retention-after-delete ruling | Partial failure cannot show full completion; do not repeat the draft 90-day restore promise until it is reconciled with the owner ruling and proven backup behavior | Data-class/store map; failure-injected deletion tests; per-system receipts; configured purge/backup expiry evidence; restore and no-resurrection proof; counsel-approved copy |
| BH-10 | Request/export/withdrawal support matches actual enabled functions and approved response process | Unavailable feature is labelled unavailable and no false receipt emitted | Test each request path; operator runbook and contact ownership |
| BH-11 | Vendor inventory reflects active runtime and actual company-account terms | Unknown destination or missing required vendor terms blocks that path and relevant policy publication | Runtime egress inventory, service/account list, DPA evidence and subprocessor list |
| BH-12 | Product copy does not promise clinical/durable results or unverified privacy/security capabilities | Claim test fails or release remains blocked | Claims matrix test list, human review record, prohibited phrase scan plus contextual review |
| BH-13 | Mobile/desktop, accessibility, private-window and direct-route tests cover all required notices and controls | Broken/inaccessible legal/consent route remains a release blocker | Exact-head browser run and annotated evidence |
| BH-14 | Release report records exact repo/branch/head SHA, run URLs, conclusions, skipped gates and measured assertions | No generic “all green” wording when checks are skipped or failed | Evidence manifest and reviewer sign-off |
| BH-15 | No production migration, deployment, billing/profile sync activation or gift issuance without separate explicit owner authorization | Protected operation remains disabled without authorization | Owner decision record and deployment/secret/feature-flag evidence |

## 3. Exact test journeys

1. Private-window first visit → privacy notice visible → story path network capture → user exits; confirm actual local/transient storage.
2. Signup with required consent controls unticked → covered account/sensitive operation remains blocked.
3. Accept Terms only → optional/sensitive/research processing remains off unless separately authorized.
4. Reject optional processing → unaffected flow remains usable; no hidden retry or alternate code path enables it.
5. Create account using synthetic data → exact request payload and all written data read back; field-level policy matches.
6. Gift flow → choose one of twelve grounds and one of six gift natures separately; no issuance before approved frozen set; missing/invalid choices fail closed.
7. Repeat release request and inject timeout → no duplicate usage consumption; completion only on authoritative meter/event.
8. Delete account → verify local, live, vendor, backup/log and retained billing/audit scope; partial provider error produces partial status.
9. Cancel subscription in test mode → provider readback verifies stopped renewal and UI confirmation.
10. Request refund → policy checks, provider state and receipt agree; failure stays pending and escalates.
11. Open legal routes directly, from footer, signup and checkout on mobile/desktop/private window; test keyboard, screen reader labels, locale and noindex/draft state.
12. Compare source Markdown, generated HTML, build artifact, deployed routes and exact hashes.

## 4. Handoff evidence packet

Every implementation report must include repository, PR, base/head SHA, run URL, completed job count vs failed/skipped/in-progress, key assertions and floors, browser dimensions, source/output hashes, known caveats, reviewer and next action. No PR description alone substitutes for job readback.

## 5. Do not do as part of this handoff

Do not merge any PR, deploy production, apply production migrations, activate billing/profile sync, create the production gift manifest, or issue gifts. Do not use real story content as a fixture. Do not treat candidate catalog rows or source-run mentions as approved content.
