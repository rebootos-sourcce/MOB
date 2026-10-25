# ATUNED P0 Execution Backlog

**Snapshot:** 12 October 2026  
**Status:** Open. This is the durable block list and acceptance contract, not a completion claim.  
**Rule:** Execute workstreams concurrently where files and branches do not conflict. After every change, run relevant tests, perform correctness review and adversarial cross-review, then repeat against the new exact commit. Old handshakes are historical unless refreshed against live GitHub evidence.

## Execution blocks

### B0 — Baseline and tracking hygiene
**Build:** Refresh current main/PR heads, exact-head workflow states, migrations, live service wiring and acceptance gates. De-duplicate historical notes and update the master index and handshakes.  
**Pass:** One current status table gives each task a workstream, source commit, PR/check links, acceptance test, owner/external dependency, and explicit completion state.

### B1 — Alpha core flow and failure paths (MOB)
**Build:** Exercise onboarding, account/delete confirmation, release-screen, local persistence, failure rollback, retry, reload, mobile/desktop and accessibility paths. Investigate actual app defects rather than weakening assertions.  
**Pass:** All blocking Alpha/browser/copy/release gates pass at the exact candidate SHA; no floor reductions, hidden skip/expected-red path, or untested failure branch remains.

### B2 — Canonical source and pattern inventory (MOB + Reboot-OS)
**Build:** Search and reconcile the source Library: The Mechanics of Being, The Attuned, source compilation, recipe/appendix files, transcripts and archived PDFs. Resolve ambiguous locators and multi-line sentence boundaries; map source runs and channels precisely.  
**Known inventory to refresh:** 560 source-review rows; 24 ambiguous PDF locators; 210 multiline transcript rows needing sentence-boundary review; 7 candidate rows without explicit source-run evidence; 55 with multiple source runs; 43 lacking source kind/verb. These are reported snapshots, not completion counts.  
**Pass:** Each selected line has exact source evidence and sentence boundaries, stable product ID, exact wording, channel, side, phase, release/reframe designation, and lineage. No synthetic text, locator-as-ID substitution, or automatic selection of the first 100 rows.

### B3 — Six deterministic 100-pattern gifts (Reboot-OS + MOB)
**Build:** Maintain six independent versioned banks: anxiety, overwhelm, burnout, depression, grief, sadness. Keep gift nature separate from the twelve onboarding grounds. Freeze catalog/set version, 100 unique stable IDs, order, per-item and aggregate hashes. Integrate the server gift/giftVerified snapshot into the client and define a source-grounded mapping from six verb channels to the meter's four tracks.  
**Pass:** Every bank contains exactly 100 approved, unique items; issue/checkpoint/read/reload returns the same ordered membership and hashes; one verified authority controls consumption; missing set or mapping fails closed without local fake grants or fallback. Keep production activation disabled until approvals are present.

### B4 — Public canon integrity (Reboot-OS)
**Build:** Validate actual stored table rows against frozen source-manifest content fingerprints, not just manifest fields or row counts. Test dict and list table shapes, new-table rejection and protected/imported-source exposure.  
**Pass:** Same-row-count value mutation, added/deleted row, manifest drift, newly introduced table and protected-table sentinel all fail closed, while unchanged approved tables remain readable. Test suite green on exact SHA.  
**Active code change:** Draft starter-gift PR #35 has new runtime fingerprint verification and a same-row-count mutation regression test. Commits 27ae01e7e986da1d0532b627d1c9526f41a94486 and 1a33efa34264f1faf332b835ca5bab3c49a2983f; verify current CI and list-shaped table behavior before calling this done.

### B5 — End-to-end persistence (MOB + Reboot-OS + Supabase)
**Build:** Verify the current Alpha browser -> intended Worker -> Supabase write -> independent read -> reload path. Compare the persisted gift snapshot, identities, order, and hashes. Exercise timeout/retry/idempotency, stale session, missing bank, mismatch and error rollback.  
**Pass:** Repeatable current-release journey proof succeeds; historical workflow runs and isolated unit fixtures do not substitute for end-to-end evidence.

### B6 — Cloudflare external build/service wiring (Reboot-OS)
**Build:** Retrieve the first real failure for the external Workers Builds: atuned-os check. Confirm intended repository binding, service, root directory, build command, permissions and required secrets before making any config change.  
**Pass:** External build succeeds for the exact PR head, or the remaining gate is explicitly assigned to an authenticated operator with the exact build URL and required evidence. No guessed fix, check dismissal, or deployment bypass.

### B7 — Security and release controls
**Build:** Review auth/session ownership, deletion retention, RPC/RLS/grants, CORS/public routes, secrets, rollback, migration order, feature flags, billing/profile sync and protected-source isolation.  
**Pass:** Required security and regression tests pass. Do not apply migrations 0016–0018, deploy, activate billing/profile sync, import protected vault data, or activate/issue real gifts without explicit authorization.

### B8 — Cross-pollination and closure review
**Build:** Workstream A reviews B3–B7 for contract and integration mistakes; workstream B adversarially reviews A's tests, edge cases and failure modes. Run both passes again after corrections. Record review notes against the exact final SHA; update the master index and the executive and next-thread handshake documents; ZIP the handshakes.  
**Pass:** Two recorded cross-reviews on the final exact SHA, all required current-head CI and end-to-end evidence green, no unresolved blocking review comments, and every remaining owner/external dependency clearly named.

## Active execution cadence
1. Execute independent blocks concurrently.
2. Review implementation and failure modes before considering the block green.
3. Cross-pollinate findings and correct contract mismatches.
4. Run tests after the final edit, read results from the exact new SHA, and update this file/index.
5. Repeat until P0 exit criteria are met. A discovered gap is added to its existing block, never used as a reason to reset the overall plan.

## Current owner/external gates
- **Pattern approval:** No owner-approved stable pattern IDs or approved 100-item banks are recorded yet. Engineering can prepare evidence and validation, but must not invent approval.
- **Cloudflare:** Authenticated dashboard logs are required if GitHub's external check does not reveal the first failing step.
- **Production:** Migrations, deployment, gift issuance, profile sync, billing activation and protected-vault import remain disabled absent explicit authorization.
