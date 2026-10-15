# ATÜNED MVP Alpha KPI Framework
**Date:** 13 October 2026 UTC  
**Status:** Proposed measurement contract; owner approval is required before proposed numeric targets become release commitments.

## Authority and benchmark interpretation
Apple App Analytics is a useful measurement-structure reference for acquisition/conversion, sessions and active devices, retention/cohorts, crash/reliability, subscriptions/proceeds/refunds, and privacy-preserving peer comparison. Apple Human Interface Guidelines are a design-quality reference for clarity, user agency, transparency, feedback, accessibility, and user control.

Sources:
- https://developer.apple.com/app-store-connect/analytics/
- https://developer.apple.com/help/app-store-connect-analytics/reference/metrics-definitions
- https://developer.apple.com/design/human-interface-guidelines/design-principles/

These are framework references, not direct numerical benchmarks for ATÜNED. Apple's App Analytics data is not directly comparable to this browser-based pattern-reflection product. Do not label proposed thresholds below as Apple benchmarks.

## Status vocabulary
Use PASS, FAIL, OPEN, UNMEASURED, and UNVERIFIED. Report numerator, denominator, exact test/build/commit, date, and measurement method. Distinguish automated test results from representative-user observations and live production evidence.

## Alpha KPI register

| ID | KPI / acceptance evidence | Proposed target or gate | Last known state |
|---|---|---|---|
| A0-01 | Critical-path usability: representative participants complete first-run flow without moderator rescue | Proposed 8/10; owner approval required | UNMEASURED |
| A0-02 | Persisted E2E: browser → intended Worker → storage write → read → reload | 1/1 independently verified non-production journey | OPEN; 0/1 verified |
| A0-03 | User agency: correction and rejection paths preserve user choice | 100% of defined correction/rejection tests pass | OPEN; exact-head retest required |
| A0-04 | Transparency and consent: consent paths and outbound data behavior match approved copy | 100% defined consent tests pass; no unexplained sensitive-data transmission | OPEN |
| A0-05 | Deletion and no-resurrection across scoped stores | All defined cross-store deletion tests pass; no resurrection | OPEN; real-store retention decisions remain |
| A0-06 | Critical-path severity | Zero open Sev-0/Sev-1 defects | OPEN; release-wide evidence needed |
| A0-07 | Core technical action success | Proposed ≥99% over a declared test run; zero tolerance for privacy/data-integrity failures | UNMEASURED |
| A0-08 | Gift bank provenance and approval | All 100 items per bank have stable IDs, provenance/classification, and owner approval; six banks separately approved before activation | OPEN; 0/560 approved stable IDs recorded |
| A0-09 | Gift nature → meter track mapping | Six server gift-nature channels map deterministically to four client meter tracks; 100% mapping tests pass | UNVERIFIED |
| A0-10 | Production publisher and route ownership | One authoritative publisher and verified live Pages/API mapping | OPEN |
| A0-11 | Accessibility | 100% of defined critical tasks keyboard-operable; no blocking accessibility defects | UNMEASURED |
| A0-12 | User-reported clarity/usefulness | Establish a measured baseline before setting a numeric target | UNMEASURED |

Proposed numerical targets are not observed results. Owner approval is required before they become binding acceptance thresholds.

## Instrumentation and privacy rules
- Do not log raw reflection/story text by default.
- Prefer minimal event names, coarse outcome states, timestamps where justified, and pseudonymous IDs only when necessary.
- Define numerator, denominator, cohort window, exclusion rules, and event ownership before reporting rates.
- Never treat missing telemetry as success; mark it UNMEASURED or UNVERIFIED.
- Keep consent, correction/rejection, deletion, and data-integrity failures as explicit guardrails, not averages that can be offset by other metrics.

## P0 release gates tied to this register
1. Refresh exact branch/PR heads and run the required checks on those heads.
2. Resolve the Pages publisher collision and authenticated Cloudflare service/account/domain mapping.
3. Verify browser → intended API Worker → storage write/read/reload in a non-production environment.
4. Resolve the gift-bank source approval and frozen manifest decision; test the six-to-four adapter without activating unapproved items.
5. Verify consent, user agency, deletion/no-resurrection, accessibility, and zero open Sev-0/Sev-1 issues.
6. Publish a dated evidence report and record any remaining externally blocked criteria. Do not declare P0 closed while any mandatory gate is OPEN, BLOCKED, or UNVERIFIED.

## Current baseline caveats
As of the latest handoff, the recorded state is: persisted E2E 0/1 independently verified; gift queue 560 rows with zero approved stable IDs and no active manifest; six-to-four mapping unverified; Pages publisher/configuration conflict unresolved. These are handoff-recorded facts and require exact-head refresh before release decisions.
