# ATÜNED Event and Measurement Dictionary

**Version:** 0.1 draft  
**Status:** SPECIFIED / IMPLEMENTATION UNVERIFIED  
**Purpose:** Define observable product events and honest measures separately from code instrumentation.

## 1. Rules

- Do not store raw story, transcript, free-text Mirror, reframe, or health-sensitive content in an analytics event unless a separately reviewed, consented product purpose requires it.
- Each event has a version, event ID, timestamp, actor/session scope, trigger, source of truth, privacy class, idempotency rule, failure behavior and acceptance test.
- A button click is an attempted action. Completion requires the authoritative result. A user-reported sensation is not clinical evidence.
- Use stable IDs for catalogue items; never use array position, list order, or line number as canonical content identity.
- An event may be specified but must be labeled implementation-unverified until schema, capture point, persistence and tests are verified on an exact candidate SHA.
- Do not emit analytics to a server if the documented user experience says the step is local-only.

## 2. Privacy classes

- **P0 Product telemetry:** minimal event fields not containing user story content; disclose purpose and destination first.
- **P1 Account activity:** pseudonymous/account-linked event and meter state; access-limited and retention controlled.
- **P2 Sensitive input/derived content:** story, voice transcript, body-linked interpretation, health inference or equivalent. Avoid in telemetry payloads by default; use only in the product record where needed and disclosed.
- **P3 Security/consent evidence:** assent version, timestamp, method, purpose, policy version, transaction reference and security/audit metadata; restricted access and retention.
- Classification is conservative and does not itself decide legal category; counsel must review whether any data is consumer health data or otherwise specially regulated.

## 3. Canonical event specification

| Event | Trigger and authoritative source | Minimum properties | Class | Idempotency and failure behavior | Acceptance test |
|---|---|---|---|---|---|
| story_started | User enters a new story stage; client stage transition is source of attempt | event_id, schema_version, session_id, occurred_at, flow_version, stage_id | P0 or P1 depending on linkability | One event per stage entry ID; offline or blocked path does not fabricate server receipt | Start the flow twice; two distinct attempts; no story text in payload |
| story_submitted | User confirms submission; source is local app state or authenticated API as designed | event_id, stage_instance_id, input_kind, content_ref if applicable, submit_state | P1; content itself is P2 and excluded | Retry uses same submission id; server rejection leaves state failed/pending, not completed | Verify payload/storage schema and no raw text in telemetry |
| evidence_presented | App presents input-based evidence used for the interpretation | event_id, story_instance_id, evidence_type, engine_version, result_ref | P1; evidence body may be P2 | One per result version; missing evidence blocks an “evidence shown” claim | Test evidence displayed, source-linked and stable on refresh |
| mirror_presented | Interpretation is displayed | event_id, story_instance_id, model_or_rule_version, result_ref, correction_available | P1; Mirror content P2 | Dedupe by result version; if generation fails, no presentation event | Confirm user can accept, correct or reject; reject leaves source story intact per policy |
| mirror_corrected | User edits/corrects interpretation | event_id, result_ref, correction_action, corrected_at | P1; corrected text P2 | Repeated saves use revision id; conflict leaves draft intact | Edit/cancel/reopen tests; telemetry contains no correction text |
| release_started | User begins a release interaction | event_id, execution_id, catalog_id, catalog_version, started_at | P1 | One start per execution attempt; no quota consumption yet unless separately specified | Abandon or error release; meter unchanged |
| release_completed | The authoritative system confirms defined completion | event_id, execution_id, catalog_id, catalog_version, content_hash, completed_at, authority | P1 | Unique event key per execution; duplicate requests return same outcome; failure does not double-consume quota | Retry/network-loss/idempotency tests and authoritative meter reconciliation |
| reframe_saved | User saves a reframe | event_id, story_instance_id, reframe_ref, schema_version, saved_at | P1; reframe text P2 | Revision IDs; failed save remains pending and visible | Save/edit/delete behavior matches policy and local/server storage disclosures |
| verification_reported | User records a post-interaction self-report | event_id, execution_id, report_scale_version, reported_value, reported_at, report_source=user | P1/P2 depending on question/value sensitivity | Preserve provenance; no automatic upgrade to verified outcome | Display clearly as self-report, not diagnosis or objective body measure |
| practice_logged | User intentionally records practice | event_id, practice_id, occurred_at, practice_type, source=user_action | P1 | One event per user-confirmed practice ID; retries are idempotent | Click/refresh/retry do not create duplicates; history matches source of truth |
| usage_consumed | Single authoritative meter accepts a completed billable/limited execution | event_id, account_or_grant_id, execution_key, pattern_id, catalog_version, amount, balance_after, reason | P1/P3 | Database uniqueness/transaction guard; reconciler detects orphan or duplicate ledger rows | Concurrent execution, retry, grant exhaustion and replay tests |
| consent_recorded | User completes a separate required consent action | evidence_id, purpose_id, text_version, notice_version, action, occurred_at, collection_context | P3 | Immutable append-only evidence; exact retries idempotent; withdrawal is a separate event | Unticked default, independent choices, reject path, version/time evidence |
| deletion_requested | Authenticated/verified request is accepted into the workflow | request_id, subject_ref, scope, received_at, status | P3 | One active request per scope or linked idempotency key; failure remains open and escalated | Verify identity, create receipt and track every storage system |
| deletion_completed | Each required system reports the defined deletion/purge result | request_id, system_id, scope, status, completed_at, evidence_ref | P3 | Per-system idempotency; partial failure remains partial; no “complete” until every in-scope store has result | Inject a system failure; no false completion receipt; test no resurrection |

## 4. Metric dictionary

| Metric | Definition | What it does not prove | Source of truth | Implementation status |
|---|---|---|---|---|
| flow_start_count | Count of distinct story_started event IDs | Unique people, product success or benefit | Canonical event store if approved; otherwise test telemetry only | Unverified |
| story_submit_success_rate | Successful submissions / eligible attempts in a time window | Quality or accuracy of submitted story | Submission authority and event ledger | Unverified |
| mirror_correction_rate | Distinct Mirrors corrected / distinct Mirrors presented | That the original Mirror was correct or incorrect in all cases | Mirror version ledger | Unverified |
| release_completion_rate | Authoritatively completed releases / started releases for eligible cohort/window | Lasting change or clinical effect | Release authority plus meter ledger | Unverified |
| release_failure_rate | Failed releases / started attempts, with reasons | Why a person feels or behaves a certain way | Release interaction status | Unverified |
| quota_integrity | Difference between authoritative grant/meter balance and counted successful unique executions | Product efficacy | Transactional ledger and reconciler | Unverified |
| self_report_response_rate | Users choosing to submit a verification self-report / eligible completed releases | Clinical efficacy or representative sentiment | Verified release plus self-report store | Unverified |
| repeat_practice_rate | Users with a qualifying second practice / users with an initial logged practice, over stated interval | Habit formation or durable behavior change without validated study design | Practice events | Unverified |
| consent_evidence_coverage | Required purpose-specific consent records / required consent actions | Legal validity of the text or correct implementation of all rights | Consent ledger joined to notice/purpose version | Unverified |
| deletion_completeness | In-scope systems with verified completion / all in-scope systems for a request | Immediate backup expiry unless backup purge is separately proven | DSAR request ledger and per-system receipts | Unverified |

## 5. Evidence required before reporting a metric

Any external metric report must state time window, denominator, population, exclusions, data source, missingness, duplicate handling, exact build/schema version and known limitations. Preserve user-level privacy and avoid reidentification in published small cohorts. A successful CI gate is software test evidence, not product outcome evidence.

No event or metric in this document is claimed to be implemented as specified.
