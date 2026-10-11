# ATÜNED KPI Register

**Version:** 0.1 draft  
**Status:** KPI definitions proposed; instrumentation and reporting are not verified  
**Owner:** Product owner for product goals; engineering/data owner for definitions and source reliability; named operators remain to be assigned  
**Review cadence:** Weekly during closed Alpha; monthly after measurement and operating reviews stabilize  
**Authority:** This register is subordinate to the latest explicit owner ruling in root `DECISIONS.md`, the [Canonical Source of Truth Charter](ATUNED-CANONICAL-SOURCE-OF-TRUTH-CHARTER.md), and the [Event and Measurement Dictionary](ATUNED-EVENT-MEASUREMENT-DICTIONARY.md).

## 1. Purpose and rules

This register defines how ATÜNED measures product value, engagement, safety, data integrity, reliability and business performance. It assigns a formula, denominator, time window, source, owner role, review cadence and action for every KPI.

**A definition is not an implemented metric.** Every KPI below remains `SPECIFIED / IMPLEMENTATION UNVERIFIED` until its event definitions, capture points, source of truth, persistence, duplicate handling, read-back, privacy controls and exact-build tests have been verified. An attractive dashboard cannot substitute for those checks.

Rules:

1. **Measure the product, not a story's private content.** KPI and analytics payloads must not contain raw story text, transcript, Mirror, reframe text, health inference or similar content. Use opaque journey, execution, revision and event references where appropriate.
2. **Use authoritative outcomes.** Button clicks and client counters show attempts, not successful completion or durable state. Completed events must be based on the authoritative result and required read-back.
3. **Keep self-report separate from outcome claims.** A verification answer is a user-reported experience, not a diagnosis, clinical measure or proof of lasting change.
4. **Freeze definitions before comparing periods.** Version event schemas, formulas, eligibility rules, cohort windows and exclusions. Do not quietly change the denominator to improve the displayed rate.
5. **No denominator, no rate.** Report numerator, denominator, population, time window, missing data, exclusions, source version and confidence limits or small-sample caveats. Show counts alongside rates.
6. **Do not optimize by weakening safety.** Privacy, consent, quota integrity and false-success measures are release gates. A good conversion rate cannot offset a failed safety gate.
7. **Respect the owner ruling.** First-visit telemetry must not send story text or name. Story-based model training and research sharing remain off and are not offered at launch. Other data paths still require exact-build proof.
8. **No unsupported outcome promises.** Retention, practice frequency and completion numbers do not establish efficacy or durable psychological change.

## 2. North-star KPI

### KPI-NS-01: Weekly Core Journey Completion Rate

**Question:** Of eligible journeys started in a cohort, what share reached a properly persisted core-loop completion within seven days?

**Formula**

`Weekly Core Journey Completion Rate = eligible started journeys with one authoritative core_journey_completed event within 7 days / all eligible started journeys in that cohort`

Report both the rate and raw numerator/denominator, for example `n / N`. Do not count synthetic, staff-only, test or bot sessions as user journeys. Do not remove a real user's failed or abandoned journey from the denominator after the cohort has been frozen.

**Core completion contract:** One journey is complete only when the same `journey_id` has an authoritative completed release, a saved reframe revision, a verification step marked reported or explicitly skipped, a practice step marked logged or explicitly skipped under the approved UX, an updated state persisted and read back, and a traceable journey record linking those references. Completion is a workflow state, **not** a claim that the user achieved a psychological outcome. A client button click or local-only counter is insufficient.

**Source:** Proposed `core_journey_completed` event in the Event and Measurement Dictionary, grounded in the authoritative release/meter ledger and saved-state read-back. This event is not yet implemented or verified.

**Window:** Weekly cohorts, each observed for seven days from journey start. Show incomplete/matured cohorts separately so recent starts are not treated as failures prematurely.

**Owner:** Product owner plus engineering/data owner.  
**Review:** Weekly in closed Alpha.  
**Target:** Establish a valid baseline from at least two complete, instrumented cohorts; then record a numeric target and approval in a dated owner decision. Do not invent an initial conversion goal before trustworthy data exists.  
**Action when below target:** Segment by journey stage and technical failure reason using content-free event metadata; reproduce the drop-off; fix reliability, clarity or accessibility; remeasure the same frozen definition. Do not pressure users to complete optional steps or change privacy settings to lift this KPI.

## 3. KPI catalogue

All rates use deduplicated identifiers and a declared cohort. “Owner” means the accountable role; named individuals must be assigned before operational use.

| ID / KPI | Formula and unit | Source / prerequisite | Cadence and owner | Target and response |
|---|---|---|---|---|
| KPI-01 First-release activation | Distinct eligible journeys with authoritative `release_completed` within 24 hours of start / eligible journeys started. Report count and percent. | `story_started`, `release_completed`, stable journey/execution IDs; exact route and completion authority verified. | Weekly; Product + Engineering. | Baseline first. If low, segment by stage and failure status, test the path and copy. Do not count a started release as completed. |
| KPI-02 Core journey completion | Distinct eligible journeys with `core_journey_completed` within 7 days / eligible started journeys in the matured cohort. North star; see Section 2. | Proposed `core_journey_completed` plus release, reframe, verification, practice, updated-state and trace references; all persist/read back. | Weekly; Product + Engineering/Data. | Baseline first, then owner-approved target. A missing source event or unresolved persistence means report “not measurable,” not zero or success. |
| KPI-03 Release execution success | Unique authoritative `release_completed` executions / unique `release_started` executions in the same eligible cohort. Also report failed and cancelled attempts separately. | Event dictionary; authoritative release status and meter ledger. | Daily operational review, weekly product review; Engineering. | Baseline first. Investigate technical failures, timeout/retry patterns and false-success events. |
| KPI-04 Mirror correction rate | Distinct Mirror revisions corrected / distinct Mirror revisions presented. Always show counts. | `mirror_presented`, `mirror_corrected`, stable result/revision IDs; no private correction text in analytics. | Weekly; Product/Research owner. | Baseline first. High or low values are diagnostic, not a quality verdict; review examples only through an approved content access process. |
| KPI-05 Seven-day repeat practice | Eligible users with a second `practice_logged` event 1–7 days after their first / eligible users with a first practice event whose full 7-day window has elapsed. | Authoritative `practice_logged`, pseudonymous user/grant reference and event timestamps. | Weekly; Product. | Baseline first. Treat this as observed use, not habit formation or benefit. |
| KPI-06 Thirty-day repeat practice | Eligible users with a qualifying repeat practice 1–30 days after their first / eligible users with a first practice event whose full 30-day window has elapsed. | Same source as KPI-05; stable schema and deduplication rules. | Monthly; Product. | Baseline first. Do not mix incomplete 30-day cohorts with mature ones. |
| KPI-07 Critical persistence/read-back | Critical writes whose authoritative record reads back with matching ID/version/hash / critical writes attempted. Report by system and event type. | Server/API receipts and durable-store read-back for release, reframe, state, consent and deletion as applicable. | Daily during Alpha; Engineering. | **100% for any event shown as durably complete.** A failed write/read-back stays pending or failed and must not create a success receipt. |
| KPI-08 Meter / quota integrity | Duplicate or mismatched consumption records per eligible completed unique execution; also report count of unexplained balance differences. | Authoritative usage ledger, stable pattern IDs, execution IDs and reconciliation job. | Each build/release and daily during Alpha; Engineering. | **Zero duplicate charges and zero unexplained balance differences at release.** Any mismatch blocks release, freezes affected consumption if required, and triggers reconciliation. |
| KPI-09 Required-consent evidence coverage | Covered actions with matching required consent evidence / all covered actions that require that evidence. | Consent ledger joined to exact purpose, notice/text version, action, timestamp and context. | Each release plus weekly audit; Privacy/Engineering. | **100%.** Any missing or mismatched required evidence blocks the covered action; optional refusal must not silently enable another path. |
| KPI-10 First-visit payload privacy violations | Count of tested or observed first-visit payloads containing story text or user name where disallowed. Also report test coverage by route/build. | Exact-build request capture for first visit; regression tests; no story text used as analytics fixtures. | Every release; Engineering/Privacy. | **Zero.** Any occurrence is a release blocker. Fix the path and add a regression test before rerun. |
| KPI-11 Unapproved gift issuance | Count of production gifts issued without an owner-approved frozen set of exactly 100 unique stable IDs and a verified client meter adapter. | Issuance ledger, manifest/version/hash read-back, approval record and client adapter tests. | Every issuance/build review; Product + Engineering. | **Zero.** Until the catalog, mapping and adapter are approved and proven, production issuance remains disabled; do not replace this gate with a gift counter. |
| KPI-12 Deletion completion integrity | In-scope systems with verified deletion/purge result / all in-scope systems for a request; count any false “complete” receipts. | Request ledger, mapped storage/vendor systems, per-system receipts, backup retention and no-resurrection tests. | Every deletion request; Privacy/Engineering. | **100% of in-scope systems evidenced before “complete”; zero false-complete receipts.** If any system is unknown or fails, report partial/pending and escalate. This does not imply backup expiry unless tested separately. |
| KPI-13 Data-flow and vendor coverage | Active data paths with identified payload, recipient, purpose, retention and test evidence / all paths in the approved path inventory. | Exact-build network traces, route/source inventory, vendor/account list and storage read-back. | Every material release; Engineering/Privacy. | **100% of launch-critical paths mapped before relevant notice/feature approval.** Unknown path blocks the related claim or feature. |
| KPI-14 Journey event integrity | Events passing schema, unique-ID, idempotency, ordering and required-reference checks / events sampled or processed. Also show duplicate, orphan and missing-reference counts. | Canonical event sink/reconciler and event dictionary schema version. | Daily in Alpha; Engineering/Data. | Establish in test. Zero duplicate authoritative completion/usage events and zero orphaned completion references at release. Other thresholds require owner-approved SLOs. |
| KPI-15 API / dependency reliability | Successful eligible requests / all eligible requests, split by endpoint and failure class. Report latency percentiles and timeout rate only after collection is validated. | Server/Worker logs with content-free request IDs, status, latency and schema/build version. | Daily during Alpha; Engineering. | Baseline first; owner/engineering approve endpoint-specific SLOs after observing load and failure distributions. Alert on sustained regression and any critical-write failure. |
| KPI-16 Support / deletion request timeliness | Requests completed within the owner/counsel-approved service target / eligible requests whose deadlines have matured. | Verified request intake, named responder, status history and completion receipts. | Weekly; Operations/Privacy owner. | Do not set or publish a response-time promise before the process, contact route, staffing and legal deadlines are confirmed. Track all open/overdue cases regardless. |
| KPI-17 Paid conversion | Eligible users who complete a verified first paid transaction / eligible users shown the approved purchase offer, within a frozen attribution window. | Test-mode and then approved production provider read-back; cancellation/refund rules and assent evidence. | Weekly after billing authorization; Business/Billing. | Not active until billing is authorized and verified. Do not measure from button clicks or expose production charging as part of this documentation task. |
| KPI-18 Paid retention / cancellation / refunds | Renewal-eligible paying accounts that remain active at the next renewal / renewal-eligible paying accounts; separately report cancellations and refund outcomes by period. | Payment-provider truth plus app entitlement/receipts and approved billing policy. | Monthly after billing authorization; Business/Billing. | Not active until real pricing, renewal, cancellation and refund behavior is confirmed. Report gross and net values separately; define taxes, refunds and failures. |
| KPI-19 Safety / claims exceptions | Count of public or in-product claims that fail the claims/safety matrix, and count of release-blocking incidents by severity. | Claims review evidence, incident log and release checklist. | Every content/build release; Product + Safety/Legal. | **Zero unresolved release-blocking safety/claims exceptions.** Remove or substantiate claims before release; never treat engagement data as clinical substantiation. |

## 4. Release gates versus improvement KPIs

The following are hard gates, not averages to improve over time:

- Zero prohibited story/name egress on first-visit paths.
- 100% required-consent evidence for each covered operation.
- Zero duplicate charges or unexplained meter discrepancies.
- No false durable-success receipts after failed writes or missing read-back.
- Zero production starter gifts without approved stable IDs, a frozen set and a tested adapter.
- No deletion request marked complete while an in-scope system lacks evidence.
- All launch-critical data paths and active processors mapped before the associated notice or claim is approved.
- No unresolved P0/P1 safety, privacy, data-integrity or release gate failure at sign-off.

A 99% average must never be used to excuse a known individual consent failure, leaked story, duplicate charge or false deletion receipt.

## 5. Baseline and target-setting plan

### Phase A: define and test

1. Product owner approves the KPI definitions, core journey completion contract, eligible population and any optional-step behavior.
2. Engineering maps each event to its exact source-of-truth write, read-back and idempotency behavior.
3. Engineering verifies telemetry contains no raw story, Mirror, reframe text, transcript or health inference.
4. QA runs synthetic-data journeys including success, abandonment, retries, reload, offline/failure, account attachment, deletion and duplicate/concurrent attempts.
5. Release report records exact repository/build SHA, schema/event versions, successful and failed tests, skipped checks, and known blind spots.

### Phase B: establish a trustworthy baseline

- Collect at least two complete weekly cohorts for activation and core journey completion. This is a proposed operational minimum, not a claim of statistical sufficiency.
- Wait for each cohort's full observation window before finalizing its result.
- Record sample size, numerator/denominator, excluded test traffic, missing events, failure categories and uncertainty. If the cohort is too small, report counts and directional observations only.
- Do not set product conversion or repeat-practice targets from synthetic test traffic or stale event definitions.

### Phase C: approve targets and run the review

For each performance KPI, the owner records a numeric target, date approved, rationale, effective date, owner and action threshold. Safety gates stay at their hard values and are not relaxed to improve product metrics.

Weekly review questions:
- Which KPI moved, and is the change larger than normal data variation?
- Is the data complete, deduplicated and from the correct build/schema?
- Which journey stage or technical failure explains the movement?
- Is the action a product change, a reliability fix, an accessibility improvement, or a measurement repair?
- Did any safety, privacy, consent or meter-integrity gate fail?
- What will be changed, who owns it, and when will the same KPI be rechecked?

## 6. Dashboard and reporting contract

The first dashboard may be a private internal report. It must show:

- KPI ID, label, definition version, owner and status (`not instrumented`, `instrumented/unvalidated`, `verified`, `blocked`).
- Current value plus numerator/denominator, period, cohort maturity and baseline/target if approved.
- Data source, exact app/build SHA, event-schema version, last successful read-back and missingness.
- Failure categories, sample-size warnings and excluded traffic.
- Hard-gate status shown independently from performance KPIs.
- A link to the acceptance test and incident/blocker for any red or unknown result.

Do not show a metric as zero when it has never been instrumented. Use **N/A — not instrumented** or **BLOCKED — source not verified**. Never infer success from missing events.

For privacy, aggregate small cohorts cautiously. As an initial internal reporting safeguard, suppress user-level drill-down from general product dashboards and flag any cohort with fewer than 10 people for privacy review before broader sharing. This threshold is a proposed internal safeguard, not a legal standard.

## 7. Ownership and change control

Before operational use, assign named owners for Product, Engineering/Data, Privacy/Operations, and Billing. Until assigned, role ownership is a proposal, not an accountable named-person assignment.

A KPI formula or denominator change requires a version bump, written reason, backfill/comparability assessment and owner approval. Preserve prior definitions and label breaks in the time series. Legal, consent or safety gate changes also require the relevant privacy/counsel review; a KPI owner cannot relax them alone.

## 8. Known gaps and current status

- The Event and Measurement Dictionary is version 0.1 and remains **SPECIFIED / IMPLEMENTATION UNVERIFIED**.
- The event sink, source-of-truth mapping, dashboard and operational review process have not been proven implemented by this document.
- `core_journey_completed` is proposed here and must be added to the Event and Measurement Dictionary before its KPI is instrumented.
- No conversion, retention, business or product-outcome baseline has been established by the evidence in this pack.
- The production starter gift remains blocked by the canonical catalog, approved stable IDs and client meter adapter.
- Terms/Privacy publication remains blocked by the unresolved retention-scope and implementation conflict and required counsel review.

**Current rating:** KPI definitions — draft complete for review; instrumentation — unverified; baseline — not established; numeric performance targets — pending owner approval; safety gate targets — specified above, not verified as met.
