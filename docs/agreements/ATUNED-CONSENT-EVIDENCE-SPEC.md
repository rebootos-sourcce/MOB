# ATÜNED Consent and Assent Evidence Specification

**Status:** Specification only; no deployed consent ledger or exact checkout control is claimed here.  
**Applies to:** Terms acceptance, privacy acknowledgement where relevant, any separate consumer-health-data consent, model-improvement/research purpose if selected, optional practitioner/cohort sharing, voice permission disclosures and purchase authorization.

## 1. Separate purpose, separate decision

Do not bundle optional processing or a purpose-specific consent into general Terms acceptance. Do not create a model-training or research toggle at launch under the current owner ruling. Counsel must determine which notices require acknowledgement, which processing requires affirmative consent or authorization, and whether an opt-out/withdrawal is required if a future owner ruling reopens an optional purpose. Each required decision must be distinguishable in the UI and stored evidence.

## 2. Minimum evidence record

Each consent/assent record should contain, where applicable:

- Stable evidence ID and account or anonymous-session reference.
- Purpose ID and the relevant data categories/recipient.
- Document/notice ID, immutable text version or content hash, locale and effective date.
- Separate UI label and checkbox/action identity.
- Required/default state; evidence that it began unticked where required.
- User action (accept, decline, withdraw), timestamp with timezone, client/app version and collection context.
- Transaction/checkout reference when purchase authorization is involved.
- Policy and consent version shown at the moment of the action.
- Withdrawal timestamp, affected purpose, subsequent processing stop and linked downstream actions.
- Minimal security metadata needed to protect integrity; no raw story or voice content in consent logs.

Do not infer acceptance from page load, default state, continued use or an unchecked control. Do not record the contents of a user's story as part of the consent receipt.

## 3. State transitions

- **NOT-PRESENTED:** notice has not been displayed.
- **PRESENTED:** exact version was rendered; this alone is not consent.
- **ACCEPTED:** user performed the required affirmative action on that version.
- **DECLINED:** user declined; optional processing remains off and blocked flow stays clear.
- **WITHDRAWN:** user later withdrew a purpose-specific permission; stop the covered processing and cascade to relevant providers/records as designed.
- **SUPERSEDED:** new version needs its own acknowledgement only if required by law, counsel or the approved product policy.

The state history must be append-only or otherwise tamper-evident. Store the current state as a derived view, not the only retained record.

## 4. Required acceptance tests

- Terms and required purpose-specific choices are displayed separately.
- Required checkbox(es) are not preselected where affirmative consent is required.
- A user can refuse optional consent and still use unaffected features where that is the product promise.
- If consent is required to process specific sensitive data, the data path remains blocked until valid consent is recorded.
- Declined or withdrawn consent cannot be silently re-enabled through defaults, refresh, migration or new-device login.
- Each record links to the exact copy/hash and version shown at the time.
- Repeat submissions are idempotent; the receipt can be fetched without exposing story text.
- Missing/unreadable consent storage fails closed for the protected processing path.
- Screen readers, keyboard interaction and mobile layout preserve meaning and independent actions.
- Copy changes trigger a version bump and focused tests.

## 5. Privacy and audit controls

Limit access to consent evidence; retain only the fields needed for proof and lawful administration; include the consent ledger in the data map, access/export/deletion decisions, vendor register and incident runbook. Counsel sets retention and determines when evidence itself may be retained after account deletion.

**Implementation status:** UNVERIFIED until the build thread provides an exact SHA, schema/API evidence, E2E test run, storage evidence and withdrawal/negative-control results.
