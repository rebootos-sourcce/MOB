# ATÜNED Security Incident and Breach Runbook

**Status:** Operating draft. Incident lead, on-call path, contractual vendor deadlines and jurisdiction-specific notice duties must be confirmed before real sensitive data is accepted.

## 1. What qualifies for intake

Treat as a security incident any suspected unauthorized access, disclosure, loss, alteration, account takeover, privilege escalation, unexpected data transfer, cross-user visibility, secrets exposure, suspicious export, storage misconfiguration or failure of a promised deletion/access boundary. A privacy complaint is also an incident signal until triaged.

## 2. First response

1. Create an incident ID and record discovery time, reporter, affected service/build, symptom, known data classes and current scope.
2. Notify the named incident lead and alternate immediately. The product owner must record these names and the working contact path before launch.
3. Preserve relevant evidence securely: provider logs, deployment IDs, exact commit/build SHA, access/audit logs, timestamps and affected request IDs. Do not copy raw user stories into broad chat/issues.
4. Contain the issue with the least destructive safe action: disable the affected route/integration, revoke exposed credentials, pause affected processing or access, or roll back a known unsafe build. Follow established authority; do not perform an undocumented production change.
5. Keep a timeline of every action, responsible person, time and reason. Protect original evidence against tampering.
6. Assess scope across client, server/Worker/D1, Supabase if active, payment provider, browser speech, email/support, logs, backups, and any practitioner/cohort exposure.
7. Rotate/revoke credentials only through the approved secret-management process. Never include secret values in the incident record.

## 3. Notification decision

- Counsel determines which laws/regulators, contractual duties, affected-person notices, deadline clocks, content requirements and exceptions apply.
- Check vendor incident-notice duties and request their incident ID, scope, timeline, containment and evidence.
- Do not delay initial internal escalation while waiting for a final legal classification.
- Do not state a statutory deadline or decide an exemption from this draft; record counsel's specific decision and source.
- Assign one communicator and approval path for user/vendor/regulator statements. Communications must be accurate, scoped and not speculate beyond known facts.

## 4. Recovery and review

1. Verify containment and patch/fix in a non-production environment first where possible.
2. Run security regression tests, including authorization, cross-user isolation, deletion/no-resurrection, logging redaction and consent boundary checks.
3. Confirm whether any data must be restored from backup and that restore will not resurrect a deleted account or revoked permission.
4. Preserve required evidence and remove unnecessary incident copies of personal content.
5. Complete a post-incident review: timeline, root cause, affected data/people, why controls failed, detection gaps, remedial work, owner, deadline and test proving closure.
6. Update data map, processor register, retention/deletion docs, risk register and public statements as required.
7. Counsel approves any legally required communication; product owner approves ordinary product statements after counsel review where required.

## 5. Evidence register and exercise

Record incident ID, severity, detection source, confirmed facts vs hypotheses, exact affected release SHA, logs/evidence references, access restrictions, containment, vendor notifications, counsel decisions, notices and delivery evidence, recovery tests, remediation PRs and closure authority.

**Before Alpha:** name a lead and alternate; establish monitored contact and escalation channel; confirm vendor notification contacts and required contract terms; conduct one tabletop for unexpected story disclosure and one for incomplete deletion; save results. Until this is done, incident readiness is unverified.
