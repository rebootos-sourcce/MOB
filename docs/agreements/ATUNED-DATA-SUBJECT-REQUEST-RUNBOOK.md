# ATÜNED Data Subject Request Runbook

**Status:** Operating draft. Capability, inbox ownership and response deadlines are unverified.  
**Applies to:** access, copy/export, correction, deletion, consent withdrawal, objection/opt-out, appeal, and questions about data handling.

## 1. Intake and logging

1. Receive the request through a verified published contact channel or in-product flow. Until the channel is tested and a person is assigned, do not claim the channel is operational.
2. Create a request ID; record received time, channel, request type, relevant account/session identifiers and the person's stated scope. Avoid copying story content into the ticket.
3. Restrict access to the request and assign a named responder and alternate. The product owner must appoint them before real-data Alpha.
4. Acknowledge receipt without promising an unverified legal deadline. Counsel supplies the applicable jurisdiction, clock, extension and appeal rules.
5. If the request could involve an account, confirm identity proportionately. Do not collect extra ID copies unless necessary and approved; never request passwords or full payment card data.

## 2. Classify scope

Record each relevant layer separately:

- Browser-local storage and files exported by the person.
- MOB/ATÜNED client and any server/Worker/D1 records.
- Supabase funnel schema/repository: `atuned_funnel_system/README.md` reports a live project and a repository read/write/delete check, while also saying the end-user router is not wired to `FunnelService` end to end. Confirm whether the active product sends any personal data to this project before including or excluding it from a request.
- Billing/transaction information held by the company and payment provider.
- Security/audit logs and support mailbox.
- Backup/replica/restore copies.
- Data held independently by vendors, browser speech services, or a user-selected practitioner/cohort if such sharing is confirmed.

Do not mark a layer “not applicable” without an engineering/source check.

## 3. Execute and record

1. Identify the exact data sources and legal basis/purpose relevant to the request.
2. Determine whether the request requires access, correction, deletion, export, restriction, opt-out or withdrawal; separate a consent withdrawal from deletion.
3. Before export, verify requester identity and remove other users' data, secret tokens, credentials and unnecessary infrastructure details.
4. Execute through the verified path, recording the system, operator, timestamp, request/result ID and expected exceptions.
5. Ask each system owner/provider for completion evidence if deletion or restriction extends to that provider.
6. Track partial outcomes visibly. Failed APIs, unknown stores, missing backups, linked-record errors or vendor delays remain OPEN.
7. If applicable law allows refusal or partial fulfilment, counsel must validate the reason and required appeal process; do not make up an exception.
8. Provide a truthful, plain-language response distinguishing completed work, outstanding work, what could not be removed, why, and when a follow-up is due.

## 4. Completion evidence

A request is complete only when the evidence register includes:

- Request ID and verified scope.
- Identity/authority verification outcome.
- Jurisdiction and deadline rule supplied by counsel.
- Each system/store and action/result.
- Export manifest or deletion receipt with no raw story content in logs.
- Vendor request IDs and confirmations where required.
- Backup/replica treatment, restore risk and legal retention exception.
- Reviewer and completion timestamp.
- User response copy/version and delivery proof.
- Appeal route/deadline if applicable.

## 5. Escalations

Escalate immediately to the security incident lead if a request reveals unauthorized access, missing isolation, data belonging to another person, suspicious export or unexpected disclosure. Escalate to counsel before refusing a request, relying on an exemption, interpreting a health-data right, or making a statutory deadline promise.

**Pre-Alpha gate:** until this procedure is staffed, tested and matches the real storage map, use synthetic test stories and do not promise self-service export, restoration or deletion beyond tested behavior.
