# ATÜNED Document and Evidence Register

**Snapshot date:** 11 October 2026  
**Repository source:** rebootos-sourcce/MOB, default branch main  
**Purpose:** Canonical inventory for the agreement package. Read [ATUNED-CANONICAL-SOURCE-OF-TRUTH-CHARTER.md](ATUNED-CANONICAL-SOURCE-OF-TRUTH-CHARTER.md) first for source authority, conflict handling and evidence standards. A listed file is not thereby approved.

## Source inventory

| Artifact | Current source / evidence | Status | Owner and exit condition |
|---|---|---|---|
| Terms of Service | [TERMS.md](../../TERMS.md), blob 628cbec4654440a6b37d6db5d7202c2f49af6839 | DRAFT / NOT PUBLISHABLE; recorded unresolved markers: 9 PLACEHOLDER, 12 CHECK, 2 PROPOSED | Product owner resolves business facts; counsel approves final clauses; build owner proves clickwrap and purchase flow |
| General Privacy Policy | [PRIVACY-POLICY.md](../../PRIVACY-POLICY.md), blob 7b6e4afa22bc1b2250959fec7e6d82801c81c387 | DRAFT / NOT PUBLISHABLE; recorded unresolved markers: 10 PLACEHOLDER, 29 CHECK, 3 PROPOSED | Product and engineering verify data facts; counsel resolves legal scope and wording |
| Consumer Health Data Privacy Policy | [CONSUMER-HEALTH-DATA.md](../../CONSUMER-HEALTH-DATA.md), blob 34a7517c62d5564f1630cd3f1898768c3d5e590d | DRAFT / NOT PUBLISHABLE; recorded unresolved markers: 2 PLACEHOLDER, 8 CHECK, 1 PROPOSED | Counsel first decides applicable scope and required notice/consent |
| Privacy Breakdown | [PRIVACY-BREAKDOWN.md](../../PRIVACY-BREAKDOWN.md), blob 186b71a622c4ca4dab7201ca87d7dea1116c0ee3 | No explicit markers found; content correctness unverified | Must be checked against the same approved facts as the long policy |
| Legal information architecture | [LEGAL-IA.md](../../LEGAL-IA.md), blob 81f8ff2f6958bfcb0a71aba3e3c18bf2e80092ae | Implementation plan; not proof of shipped controls; contains open checks/proposals | Build owner supplies exact route/build/test evidence |
| Renderer | funnel/legal/render.py, blob 6098bb33bf2861b7ee9b8a07a7793fbd1630a829 | Exists; generated output workflow must be preserved | Build owner runs renderer and validates exact output |
| Publish workflow | .github/workflows/deploy.yml, blob c47c48d7f868a6125d9f8569521364d23e2fd244 | Recorded fixed output list excludes the legal pages | Build owner wires pages only after approval; test actual deployment bundle |
| Product decisions | [DECISIONS.md](../../DECISIONS.md), blob 723094e40ef311d319980c0cee73e8f60ca47acc | Primary record of owner rulings and explicitly open decisions | Product owner resolves remaining business choices; decisions must be copied to this register with source link |
| Onboarding behavior | [ATUNED-onboarding-first-experience-TDD.md](../../ATUNED-onboarding-first-experience-TDD.md), blob a2302bfea98e60c7535432ed7b38fce3f4715d79 | Product TDD exists; gift selection alignment must be checked against current PR #66 | Product and build owners reconcile both 12-value ground and six-value gift-nature inputs |
| Data/retention research | [RETENTION-90DAY.md](../../RETENTION-90DAY.md), blob 6c59d2b4cc4f2fa36b13e9680d0b6a88983a5cd6 | Research/design record; does not establish deployed retention | Engineering confirms actual tables, backup/restore, timers and tested deletion |
| Security/IP analysis | [SECURITY-IP.md](../../SECURITY-IP.md), blob 46a7a4fc1934105cb05cd8416289327db54e3f00 | Security and IP background; not an operational incident runbook | Security/engineering validates controls; owner determines publication/privacy posture |

## New working artifacts in this pack

| Artifact | Purpose | State |
|---|---|---|
| ATUNED-CANONICAL-SOURCE-OF-TRUTH-CHARTER.md | Defines source authority, evidence rules, conflict resolution and change control | Added in this batch; exact-head validation pending |
| ATUNED-PRODUCT-TRUTH-DATA-FLOW-MATRIX.md | Contract-to-fact matrix, data locations, proof gaps | Draft; implementation unverified where stated |
| ATUNED-OWNER-DECISION-REGISTER.md | Explicit owner choices and blockers | Open decisions preserved |
| ATUNED-EVENT-MEASUREMENT-DICTIONARY.md | Canonical event and measurement spec | Specification only; instrumentation unverified |
| ATUNED-PROCESSOR-AND-DPA-REGISTER.md | Vendor and contract verification | Candidate processors listed for verification, not asserted as all active |
| ATUNED-DATA-RETENTION-SCHEDULE.md | Data classes, proposed retention behavior and proof requirements | No unverified retention promise authorized |
| ATUNED-DATA-SUBJECT-REQUEST-RUNBOOK.md | Request intake, verification, execution, response and evidence | Operational capability unverified |
| ATUNED-ACCOUNT-DELETION-AND-RESTORE-RUNBOOK.md | Deletion boundaries, backup and no-resurrection checks | Operational capability unverified |
| ATUNED-SECURITY-INCIDENT-AND-BREACH-RUNBOOK.md | Incident intake and counsel/owner escalation | Must be staffed and rehearsed |
| ATUNED-CONSENT-EVIDENCE-SPEC.md | Clickwrap, health-data consent and optional-purpose evidence | Consent controls unverified |
| ATUNED-SUBSCRIPTION-REFUND-AND-CANCELLATION-RUNBOOK.md | Purchase terms, cancellation and refunds | Purchase controls unverified |
| ATUNED-CLAIMS-AND-SAFETY-MATRIX.md | Evidence-linked public claim limits | Draft; counsel/content review required |
| ATUNED-AGREEMENTS-BUILD-HANDOFF.md | Testable engineering acceptance contract | No implementation completion inferred |
| ATUNED-COUNSEL-REVIEW-PACKET.md | Questions and primary-law starting points | Counsel decision required |
| ATUNED-EXECUTION-LOG.md | This branch's execution evidence and blockers | Updated as blocks are completed |

## Repository and PR evidence recorded during this review

- MOB PR #59: https://github.com/rebootos-sourcce/MOB/pull/59. **Merged 11 October 2026 at 19:44:41 UTC** as main commit `ed5eca344836e852f117a5b573059e5e1cf1e3ab`, from exact tested head `74279113003ca02c3675be04cf8d7bff651008b9`. Run 38157593102 recorded 30/30 jobs successful, Alpha journey 61/61, and copy 151/151. This validates the merged candidate's repository tests; current production deployment/live smoke must still be verified separately.
- MOB PR #66: https://github.com/rebootos-sourcce/MOB/pull/66. Current PR metadata head `61174502691d1bc353a479604b35bbf5c6d53187`, draft/open. Exact-head workflow [#38182154741](https://github.com/rebootos-sourcce/MOB/actions/runs/38182154741) most recently showed 29 successful jobs and aggregate `gates-pass` queued; no final workflow conclusion is available. Do not report the full gate green until it completes.
- MOB issue #58: https://github.com/rebootos-sourcce/MOB/issues/58. Open; no owner-approved production gift catalog/set established in this evidence.
- MOB PR #67: https://github.com/rebootos-sourcce/MOB/pull/67. The prior head `b473d75a6369c453736401de30ee2d766987335d` passed 30/30 jobs in run #38170329312. The charter and alignment changes were committed afterward; validate the latest branch head before calling the revised pack green.
- Reboot-OS PR #35: https://github.com/rebootos-sourcce/Reboot-OS/pull/35. Current PR metadata head `74755057c54e11a82580b6c387f258f40a75f9fc`, draft/open. Repository-owned server and smoke workflows passed, but the external `Workers Builds: atuned-os` check failed on this SHA at 2026-10-11T22:53:44Z. Latest build detail: [Cloudflare build 3ac5f30c-a112-436e-9d5d-f2c1be36b161](https://dash.cloudflare.com/b34a8a4f24d5ac71f7b386c240a6da90/workers/services/view/atuned-os/production/builds/3ac5f30c-a112-436e-9d5d-f2c1be36b161). Issue #37 remains open; root cause is not available in GitHub annotations.
- Reboot-OS issue #37: https://github.com/rebootos-sourcce/Reboot-OS/issues/37. Open; external Workers Builds check lacks a root cause in GitHub annotations and needs authenticated dashboard investigation.

## Register acceptance rule

A row closes only when the source hash/version, owner, approval status, implementation evidence, counsel status if applicable, next action and exact acceptance evidence are all recorded. A zero marker count alone never closes a legal artifact.
