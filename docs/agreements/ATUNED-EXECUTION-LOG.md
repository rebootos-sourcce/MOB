# ATÜNED Agreements Documentation Execution Log

**Snapshot:** 11 October 2026, America/Los_Angeles  
**Branch:** docs/agreements-readiness-20261011  
**Scope:** Documentation, contract alignment and build handoff only. No app code, migration, deployment, production billing, profile sync or gift issuance was performed.

## Block 0 — inventory and live evidence

- Latest refresh: MOB PR #59 was merged into `main` at `ed5eca344836e852f117a5b573059e5e1cf1e3ab` at 19:44:41 UTC; the earlier “open, unmerged” note in this dated historical log is superseded.
- MOB PR #66 is open/draft at head `8ca3aeae4609bf200a87cc90a89bade1cd5a9a07`, based on that merged main commit; exact-head run [38169513590](https://github.com/rebootos-sourcce/MOB/actions/runs/38169513590) was queued at the latest refresh. Older run 38168042535 targets the stale head `27eb858d62fd7dc5257197d3ee9431599cd5b6f2` and remains in progress in the fetched response, so it is not current-head final evidence.

**Result:** Completed as a documentation baseline; the package is not approved.

- Re-fetched current MOB legal source files and recorded current blob SHAs in ATUNED-DOCUMENT-REGISTER.md.
- Confirmed Terms, Privacy Policy and Consumer Health Data Policy still contain unresolved markers; Privacy Breakdown has no explicit markers but is not proven correct.
- Confirmed Legal IA and the deploy workflow are not implementation proof; generated pages must be rebuilt from Markdown after sign-off.
- Refreshed PR #66: open/draft at head 27eb858d62fd7dc5257197d3ee9431599cd5b6f2 on base 74279113003ca02c3675be04cf8d7bff651008b9. Run 38168042535 had journey2 failed and functional still in progress at the observed fetch. Status must be rechecked.
- Refreshed Reboot-OS PR #35: open/draft at head 32ad3b086679669b3571f4567aad49e60b6c222e. An external Cloudflare Workers Builds failure remains tracked separately in issue #37. Repository CI/smoke evidence does not equal deployment/live smoke.
- Reaffirmed MOB issue #58 as a separate unresolved P0 for owner-approved 100-item stable catalog membership.

**Correctness pass:** Reconciled current SHAs/states and separated source docs from generated pages and CI evidence.

**Adversarial pass:** Rejected false-green inference from prior candidate runs; rejected claim that marker-free summary or generated output is approved; preserved unknown data flow and vendor status. A second source-of-truth replay caught and corrected an interpretation based on earlier exploratory text after the later owner reversal was found.

- Added static source evidence from `tests/copy.js` and `atuned_funnel_system`: the signed-out first-visit test enumerates metadata-only request keys but stubs the Worker, and the funnel Supabase README reports a live test project while saying the app router is not wired end to end. These facts do not prove deployed consumer-data egress or persistence.
- Confirmed the first-visit privacy row and the full account-snapshot section of the root Privacy Policy cannot yet be reconciled from draft wording alone; retain the blocker until exact-build egress and storage evidence is attached. The voice-provider source ruling points to ElevenLabs via the ATÜNED server and requires a deployed route/contract check.

## Block 1 — product-truth / data-flow contract

**Result:** Drafted matrix. Acceptance is partial because engineering proof and owner decisions remain outstanding.

- Specified the intended journey as Story → Evidence → Mirror → user correction/confirmation → Release → Reframe → Verification → Practice/history.
- Distinguished attempted interaction, completed interaction, self-report and verified durable change.
- Mapped key data categories to claims in the current drafts and listed exact engineering proof needed.
- Recorded the latest controlling owner decision: no story training; research sharing off and not offered at launch; “Improve the Models” switch removed. Earlier exploratory text about story refinement is superseded.
- Explicitly blocked broad local-only/sync claims pending field-level network and storage evidence, and added ElevenLabs as a voice-path vendor to verify.

**Correctness pass:** Each policy claim is labeled documented claim, conflict, unverified or decision required.

**Adversarial pass:** Checked identity mismatch, account sync, birth data transfer, vendor side copies, backups, deletion, practitioner sharing and self-report overclaim.

## Block 2 — event/measurement dictionary and decision register

**Result:** Drafted. Acceptance partial: specification exists; instrumentation and owner decisions are not verified.

- Defined minimal event schema, privacy classes, idempotency/failure rules and acceptance tests.
- Defined metrics without implying efficacy or durable change.
- Assigned explicit IDs to unresolved owner decisions, including data transfer, identity, age/regions, public contact, billing/refunds, retention/restore, processor contracts, consent, claims and gift inventory.

## Block 3 — operational and implementation-support documents

**Result:** Drafted runbooks/registers and build acceptance contract. Acceptance partial pending named operational owners, actual system facts, vendor terms, counsel review and exact-build tests.

- Processor/DPA register separates candidate vendors from confirmed active processors.
- Retention schedule does not convert the 90-day draft into a verified infrastructure promise.
- Request, deletion/restore, incident, consent and billing runbooks describe required evidence and failure behavior.
- Claims/safety matrix prohibits clinical or durable-outcome promises without substantiation.
- Build handoff contains exact functional, privacy, consent, gift, billing, deletion, route and reporting acceptance tests.
- Counsel packet lists decisions and official primary-law starting points.

- A further replay of `DECISIONS.md` caught a retention conflict: the latest owner ruling records 24-month retention after deletion and says not to re-ask the period, while the Terms/Privacy drafts say live removal is immediate with a restorable 90-day backup. Updated the owner register, retention schedule, product-truth matrix, build handoff and counsel packet to preserve the owner ruling while blocking unproven scope/implementation claims.

## Remaining blockers

1. Product owner choices in ATUNED-OWNER-DECISION-REGISTER.md.
2. Build owner evidence for data flow, local/server storage, vendor inventory, deletion/export/restore, consent ledger and deployment routes.
3. Counsel ruling on legal applicability and final wording, especially health-data scope, consumer rights, transfers, auto-renewal/refunds, terms assent, health and outcome claims.
4. Gift taxonomy and exact 100 unique owner-approved stable IDs; MOB #58 remains open.
5. Recheck PR #66 exact-head run and Reboot-OS #35 Cloudflare check before quoting fresh statuses.
6. App code and deployment remain with build thread; no implementation completion is claimed.

## Measurements and confidence

- Legal source SHAs: Terms 628cbec4654440a6b37d6db5d7202c2f49af6839; Privacy 7b6e4afa22bc1b2250959fec7e6d82801c81c387; Consumer Health Data 34a7517c62d5564f1630cd3f1898768c3d5e590d; Privacy Breakdown 186b71a622c4ca4dab7201ca87d7dea1116c0ee3; Legal IA 81f8ff2f6958bfcb0a71aba3e3c18bf2e80092ae.
- Recorded unresolved-marker counts excluding the documents' explanatory marker examples: Terms 9/12/2; Privacy 10/29/3; Consumer Health Data 2/8/1 (PLACEHOLDER/CHECK/PROPOSED).
- Prior PR #59 exact-head CI remains historical: 30/30 jobs, Alpha 61 passed, copy 151 passed; it does not close #58 or prove deployment.
- PR #66 observed run 38168042535: one failed journey gate, functional still in progress; final run outcome not established in this fetch.
- Reboot-OS #35 remains draft/open; external Cloudflare check failure/root-cause issue #37 is separate from green repo-owned tests.
- Confidence 0.93 in the current source inventory and identified blockers; 0.80 in inferred runtime data-flow descriptions pending engineering proof; legal applicability and counsel approval unverified.
