# ATÜNED Canonical Source of Truth Charter

**As of:** 11 October 2026  
**Status:** Internal governance record. Draft; not legal approval or proof of deployed behavior.  
**Canonical role:** This file defines which source is authoritative for each class of fact, how conflicts are resolved, and what evidence is required before a claim may be marked verified.

## 1. Non-negotiable rule

There is no single file that proves every kind of fact. This charter is the canonical index and conflict-resolution rulebook. The source that owns each fact remains authoritative within its domain. A planning document, PR description, passing unit test, or draft agreement must never be treated as proof outside its scope.

When sources disagree, record the conflict, preserve the higher-authority fact, and block any dependent publication or release claim until the discrepancy is resolved. Never fill evidence gaps with inference.

## 2. Authority by fact type

| Fact type | Authoritative source | What does not prove it |
|---|---|---|
| Owner-approved product or business policy | The latest explicit owner ruling in root `DECISIONS.md`. This register may index the ruling but cannot silently change it. A new decision must be explicitly recorded by the owner. | Older exploratory notes, draft PRs, assumptions in code comments, or the wording of an unapproved policy |
| Current source-code behavior | Exact file contents at a stated repository, branch and commit SHA, supported by tests that exercise the relevant path | A branch name alone, a stale commit, a PR summary, or tests that stub the relevant service |
| Current deployed behavior | Exact deployed build/version plus a reproducible live or staging trace, request/response evidence, configuration and storage read-back for the tested path | Source code alone, green repository CI, a successful deployment job alone, or a scaffold not wired to the active app |
| Database persistence and deletion | Actual schema/configuration, authoritative write/read/delete evidence, relevant row or audit receipts, retention jobs and restore/no-resurrection tests | A migration file, mocked test, README claim without route wiring, or user-interface state alone |
| CI and test status | Workflow/job result attached to the exact commit SHA, including failed, skipped and in-progress jobs and assertion counts/floors when available | A run on a prior SHA, a PR body, a green subset while required jobs remain unfinished, or a combined result that omits an external provider check |
| Consumer-facing legal text | Root Markdown legal sources after explicit owner fact confirmation and qualified counsel approval; generated output is derived from those sources | Generated HTML, draft labels removed, a zero-placeholder count, an internal review or this charter |
| Privacy/data-flow facts | Latest owner policy plus exact-build network trace, client serializers, Worker/server routes, vendor egress and storage read-back. Each must agree before the fact is publishable. | A copy test that stubs the Worker, architecture intent, or claims that a path is “local” without testing all active paths |
| Canonical pattern inventory and starter-gift eligibility | A source-reviewed, owner-approved catalog of stable pattern IDs, sentence text, provenance, version and content hash; a frozen 100-item set with ordered membership/hash read-back; and the implemented, tested client meter adapter | Positional meter keys, duplicate text cycling, synthetic test IDs, a server gift ID, a list of 100 unapproved IDs, a successful snapshot validator or green CI alone |
| Legal/operational approval | Explicit recorded owner approval for product facts, counsel approval for legal scope/wording, and named engineering/operations evidence for implementation and staffing | Silence, inferred approval, draft state, a merge, or successful tests by themselves |

## 3. Source hierarchy and conflict handling

1. **Explicit owner decision:** The latest explicit, controlling owner decision governs product intent. A later, clear ruling supersedes earlier exploratory language. Only the owner can reopen or change that decision.
2. **Observed implementation:** Claims about what the product actually does require evidence from the exact candidate/deployed build. Implementation evidence can reveal a mismatch with policy; it does not silently amend the policy.
3. **Legal publication:** Consumer legal copy must describe the approved policy and actual implementation together. If they disagree, publication remains blocked until engineering, the owner and counsel resolve the mismatch.
4. **Derived documentation:** The document register, data-flow matrix, event dictionary, runbooks, build handoff and this charter organize facts and requirements. They cannot create owner policy, legal conclusions, production behavior or approvals.
5. **PRs, issues and workflow summaries:** These are traceable work records. Draft PRs define proposed changes only. Issues track blockers. Workflow results apply only to their exact tested commit and the jobs shown in the result.

## 4. Required status vocabulary

- **OWNER-RECORDED:** An explicit owner ruling exists at a cited source. This does not prove implementation.
- **SOURCE-DOCUMENTED:** A repository source or design contract says this. It may be draft or stale.
- **IMPLEMENTATION-VERIFIED:** The exact relevant code/configuration and successful tests prove the specified behavior. Cite repository, commit and test evidence.
- **DEPLOYMENT-VERIFIED:** The exact deployed version was traced, with network/storage or user-visible proof appropriate to the claim.
- **DECISION REQUIRED:** The owner has not settled the product/business choice.
- **COUNSEL REQUIRED:** Legal application or final language needs qualified counsel.
- **IMPLEMENTATION UNVERIFIED:** Source intent exists, but exact-build behavior has not been demonstrated.
- **BLOCKED:** A named dependency prevents approval, publication, issuance or release.
- **APPROVED:** Use only with explicit, recorded approval evidence from the responsible authority. Nothing in this charter grants approval.

A fact can have more than one status. For example, a retention duration can be OWNER-RECORDED while its store coverage remains IMPLEMENTATION UNVERIFIED and legal wording remains COUNSEL REQUIRED.

## 5. Evidence record required for a verified claim

Every material implementation or release claim must identify:

1. Claim and affected user journey/data class.
2. Owning source file or decision, including current blob SHA or decision link where available.
3. Repository, branch, exact commit SHA, PR and test/workflow URL.
4. Required job count, passed/failed/skipped/in-progress counts, assertions and floors.
5. Exact deployed version/environment when the statement is about live behavior.
6. Reproduction method: route, request fields, relevant response, vendor egress or storage/read-back evidence.
7. Reviewer, date/time and any unresolved limitation.
8. Owner approval and counsel approval where required.

If a field is unavailable, mark it unknown and keep the corresponding claim unverified. Do not substitute a guessed value.

## 6. Current controlling decisions and blockers

### Privacy and data handling

- The latest root `DECISIONS.md` ruling says the first-visit funnel sends a random code, selected topic and finish marks only, never story text or name.
- Story-based model training is off, research sharing is off and not offered at launch, and the “Improve the Models” switch is removed. This supersedes earlier exploratory wording.
- The owner-recorded spoken-release voice path routes each anonymous user's spoken release line through the ATÜNED server to ElevenLabs when voice is enabled. Actual deployed fields, account contract, retention and notice still require exact-build verification.
- Retention after deletion is owner-recorded as 24 months, and the period is not to be re-asked. The precise store/record scope and implemented behavior remain unverified. Terms and Privacy drafts still refer to immediate live-store removal plus a 90-day restorable backup. This conflict blocks publication until engineering maps the scope and behavior and counsel approves consistent wording.

### Starter gift and pattern identity

- The intended product definition treats one pattern as one sentence. An execution key or meter position is not a stable catalog identity.
- MOB issue [#58](https://github.com/rebootos-sourcce/MOB/issues/58) remains the P0 catalog blocker.
- Reboot-OS PR [#35](https://github.com/rebootos-sourcce/Reboot-OS/pull/35) proposes versioned server-side fixed-set snapshots and six gift-nature values; it remains draft/open.
- MOB PR [#66](https://github.com/rebootos-sourcce/MOB/pull/66) implements the client choice/read-back guard in a draft; it remains draft/open.
- No owner-approved production stable pattern IDs or 100-item membership manifest are established in the current evidence. The server's six verb channels and MOB's four meter tracks still lack a deterministic, source-backed adapter and consumption rule. Keep local allowance and production gift issuance disabled. Synthetic fixtures are test-only.

### Legal and deployment boundary

- MOB PR [#59](https://github.com/rebootos-sourcce/MOB/pull/59) is merged to main at `ed5eca344836e852f117a5b573059e5e1cf1e3ab`; its exact-head repository tests are historical candidate evidence, not production deployment or live-smoke proof.
- Agreement pack PR [#67](https://github.com/rebootos-sourcce/MOB/pull/67) is draft/open. Prior head `b473d75a6369c453736401de30ee2d766987335d` passed 30/30 jobs in workflow [#38170329312](https://github.com/rebootos-sourcce/MOB/actions/runs/38170329312). The charter and alignment edits were committed afterward, so the prior green run does not validate this revised branch; the revised exact head must pass its own run.
- MOB PR #66 current metadata head is `61174502691d1bc353a479604b35bbf5c6d53187`. Exact-head run [#38182154741](https://github.com/rebootos-sourcce/MOB/actions/runs/38182154741) most recently showed 29 successful jobs and aggregate `gates-pass` queued. The complete gate and final workflow conclusion are not yet available; do not call it green.
- Reboot-OS PR #35 current metadata head is `74755057c54e11a82580b6c387f258f40a75f9fc`. Repository-owned gate [#38182175796](https://github.com/rebootos-sourcce/Reboot-OS/actions/runs/38182175796) succeeded. The external Cloudflare Workers Builds issue [#37](https://github.com/rebootos-sourcce/Reboot-OS/issues/37) remains open; a green repository-owned gate does not resolve an external check failure or prove deployment.
- All agreement artifacts remain draft and not approved for publication. No production migration, deployment, billing/profile-sync activation, real sensitive-data test or production gift issuance is authorized by this charter.

## 7. Working index

| Need | Use this artifact first |
|---|---|
| Document scope, owner and release state | [Document and Evidence Register](ATUNED-DOCUMENT-REGISTER.md) |
| Product claims versus observed data flows | [Product Truth and Data-Flow Matrix](ATUNED-PRODUCT-TRUTH-DATA-FLOW-MATRIX.md) |
| Open product decisions | [Owner Decision Register](ATUNED-OWNER-DECISION-REGISTER.md) and root `DECISIONS.md` |
| Event names, data fields and measurement meaning | [Event and Measurement Dictionary](ATUNED-EVENT-MEASUREMENT-DICTIONARY.md) |
| Retention and deletion behavior | [Data Retention Schedule](ATUNED-DATA-RETENTION-SCHEDULE.md), [Deletion/Restore Runbook](ATUNED-ACCOUNT-DELETION-AND-RESTORE-RUNBOOK.md) and [Data Subject Request Runbook](ATUNED-DATA-SUBJECT-REQUEST-RUNBOOK.md) |
| Legal publication blockers | Root legal Markdown, [Counsel Review Packet](ATUNED-COUNSEL-REVIEW-PACKET.md) and [Build Handoff](ATUNED-AGREEMENTS-BUILD-HANDOFF.md) |
| Latest work performed and evidence | [Execution Log](ATUNED-EXECUTION-LOG.md) |
| Release/implementation acceptance | [Agreements Build Handoff](ATUNED-AGREEMENTS-BUILD-HANDOFF.md) |

## 8. Change control

When a controlling source changes:

1. Confirm the source and its authority; do not promote an unreviewed PR to a controlling fact.
2. Update the owning artifact first, preserving the original decision/evidence citation.
3. Update this charter's current-state summary only when the source change is verified.
4. Update the document register, data-flow matrix, dependent runbooks and execution log as needed.
5. Run link/format/static checks, then exact-head CI. Verify the final tested SHA matches the branch head.
6. Record remaining conflicts and approvals as open. Do not merge, publish or deploy merely to make documentation read as consistent.

**Current rule:** Where this charter and its source links are stale or disagree, the domain-owning authoritative source above takes precedence; record the stale pointer and correct the documentation. This charter governs source selection and evidence quality, not business policy or legal conclusions.
