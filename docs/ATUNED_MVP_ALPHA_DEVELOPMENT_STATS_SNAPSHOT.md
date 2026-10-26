# ATÜNED MVP Alpha, Development Statistics Snapshot

## Snapshot: 2026-10-26 (a confirmation round: percent conversion, both-poles bar, code freshness, and the real KPI number)

He asked to confirm five things in one message: the coherence engine, nerve to
saboteur, the records, the point-to-percent change, the both-poles bar reading
clean, the engine and code being current, and where the KPI sits now. Checked
each against the live build, not against memory of earlier rounds.

## Headline
| Measure | Current value | Basis |
|---|---:|---|
| P0 chain, the 20 links Review B scored (same day, earlier round) | 40%, 8 of 20 | Unchanged since that round. Nothing built today touched this scorecard; today's work was two urgent bug fixes and five small, independent backlog items, all outside this ledger. |
| Both-poles bar (CQ/DQ, Positive/Negative, Masculine/Feminine) | reads clean, verified | Real screenshots, a loaded profile (Gordon), both widths, today. Paired, labelled, percent on both sides. |
| Point numbers to percent, sitewide | not complete | Real, active, partly merged. See below. |
| Code and build freshness | current | `git status` clean, HEAD matches the pushed branch tip, build stamp matches. |
| Navigation | clean | `tests/functional.js`: "the navigation is in the document and cannot drift" and the tab-count check both pass, 0 failed, confirmed on this round's run. |

## The percent conversion, checked directly, not assumed

This is being built as its own tracked effort ("percent phase 2"), in slices,
not by this session: slice 1 (the shared ring and Field headline), slice 2
(Summary) and slice 3 (Analytics and the record) are merged to main. Slice 4
(the six-gate drill panel and its hover tip) is open as PR 123, created 19
October, last touched 22 October, and as of today it has a merge conflict
against main. Nobody's move to make here but worth knowing it has gone quiet.

What is still raw, checked live on the Character tab with a real profile
loaded (not a blank one): the Leading Pattern card prints "Fear 10.0", and the
Vitality line beside it prints "0.09", a bare fraction with no percent sign,
while two lines below it Coherence and Decoherence already print "18%" and
"54%" on the same panel. The 0.09 is the same figure the Field tab already
shows correctly as "9%", so this is not a missing calculation, it is one
screen's own number sitting un-wrapped in a renderer slice 4 did not reach.
Site wide, 9 of 45 UI renderer files call the shared percent registry
(`pct.js`/`fmtPct`) today; the other 36 were not audited one by one, this
round only confirms the gap is real and names one concrete instance of it.

## Everything else he asked to confirm

- **The coherence engine, CQ to DQ, nerve to saboteur.** Still exactly where
  Review B left it earlier today: the two ends hold (CQ and DQ arithmetic,
  proven by running it), the middle does not (a story's body location is read
  correctly by the sniffer and thrown away before the field uses it). The
  fix for this, the most serious item on Review B's list, has not been
  started. Nothing today changed this picture; today's five small fixes were
  independent backlog items (a lexicon gap, a negation bug, stable record
  IDs, a documentation gap, a research write-up), none of them this wiring.
- **All the records.** Unchanged since the records-inventory audit: real and
  substantial, with named gaps already tracked (the chain graph stops four
  rungs short of canon's eight, saboteur addresses are hand-coded where a
  canon.json lock says not to, both written up today in
  `CANON-MERGE-PLAN.md`).
- **The engine is the most recent, all the code is the most recent.**
  Confirmed directly: working tree clean, HEAD is the branch's own pushed
  tip, the build stamp inside `source.html` matches it. Nothing uncommitted,
  nothing stale.

## Audit rule, unchanged from 22 October and 25 October

Do not upgrade a percentage because a document was written or a commit
exists. The entries above are upgraded only where the entry itself names what
was actually run and what it actually proved. Update this file after every
subsequent build or pass, and keep the entries below for delta calculation.

---

## Snapshot: 2026-10-25 (real runtime verification closes most of P5's gap; one owner decision blocks P3)
Scope: the same contract, after three independent runtime audits actually ran the
engine (simulation, forward and backward), the full records inventory, and the
both-poles UI check, against a real Chromium, against the live build. This is
the first comparable runtime snapshot the 22 October entry below said did not
exist yet.

## Headline
| Measure | Current value | Basis |
|---|---:|---|
| Runtime acceptance criteria verified complete | not 100% | Real, named progress since 22 October, not full closure. See block table. |
| P0 canonical architecture/ownership contract | 100% | Unchanged, still contract-only. |
| P3, CQ/DQ/SQ framework mapping | blocked on one owner decision | Named below. Everything else in P3 is now runtime-verified, not just implemented. |
| Build delta since 22 October | large, evidence-backed | tests/engine.js: 6247 passed, 0 failed, run repeatedly today, not claimed from a commit count. |

## What today's audits actually verified, against this contract's own ledger

**P3, CQ/DQ/SQ calculation integration.** The 22 October entry said "arithmetic
wired, framework mapping blocked." Today's audit ran it, not just read it:
- CQ computes exactly as the 22 October ruling specifies, across 500 random
  profiles. Proven, not asserted.
- DQ computes correctly across 300 profiles, and its seat-level breakdown
  checks out across 200 more.
- SQ, confirmed by source inspection to still be exactly this contract's own
  definition, "sum of individual fetter/node weights" (`const SQ=NODES.map(n
  =>n.sq)`, `compute.js:496`), feeding DQ (`compute.js:497`). It does not yet
  reach outward to Awareness, Flow, Radiance, Vitality, or the Positive and
  Negative lean the owner named today. That wiring does not exist yet; this is
  now a named gap, not an open question of whether it exists.
- Forward simulation works, proven by running it, not by reading the code.
- Backward simulation does not exist as a built feature. The core math does
  invert by hand. Written as a realistic story and run the normal way through
  the sniffer, it does not yet reliably land on a specific target. Named
  precisely in the engine audit, not asserted as either broken or working.
- **Still blocked, and this is the one piece of P3 that needs him, not more
  verification:** `compute.js` derives Intention from band-answered laws.
  `docs/briefs/cq-unified.md` and `DECISIONS.md` define Intention as
  action-linked, said-versus-did follow-through over a seven day window
  (`intentionRead`). These are two different things computing one number
  called Intention. The 22 October snapshot named this and it is still true
  today: CQ cannot be called framework-correct until he picks one.

**P5, end-to-end verification.** The 22 October entry read 0% verified, no
build or test run claimed. Today: `tests/engine.js` run repeatedly, 6247
passed, 0 failed, 10 expected red. A full records inventory ran against the
live build, not a draft. A both-poles UI check ran against real screenshots,
both widths, a loaded and an empty profile, images actually looked at. This
does not close P5, release hit-feedback and the full end-to-end browser chain
are not part of what ran today, but it is real evidence where the ledger
previously had none.

**P4, release/intervention loop.** Unchanged, still 0%, not touched today.

**P6, final integration and handoff.** Unchanged, still blocked on P3 and P4.

## New since 22 October, not in the old ledger
- The resistance/avoidance signal (the six gates, "THE SIX AXES" at the top of
  `engine/verp.js`) computes correctly and has a structural rule already
  written into the engine against showing it as a bare number. It has no
  screen. Not a P3 metric gap, a rendering gap, named for whoever builds that
  screen.
- The body-location read (where on the body a story lands) does not use the
  location at all right now; it spreads evenly regardless of what body part a
  person names. Verified by running two otherwise-identical stories through
  it and comparing the output.
- Shock and Surprise are read by about one word each in the whole lexicon.

## Audit rule, unchanged from 22 October
Do not upgrade a percentage because a document was written or a commit
exists. The entries above are upgraded only where the entry itself names what
was actually run and what it actually proved. Update this file after every
subsequent build or pass, and keep the entry below for delta calculation.

---

# Snapshot: 2026-10-22 (CQ formula source audit; canonical Intention mismatch found)
Scope: Priority-1 CQ / Coherence formula integration, including downstream projections and the connected signal architecture
Baseline type: Updated after P0 contract closure; first comparable runtime snapshot remains unavailable, so no build delta is claimed.

## Headline
| Measure | Current value | Basis |
|---|---:|---|
| Runtime acceptance criteria verified complete | 0% | No successful runtime evidence is verified. The latest inspectable GitHub Actions deploy run remains queued on an earlier candidate; the current head has no returned status check. |
| Runtime acceptance criteria remaining or unverified | 100% | All runtime integration and regression criteria remain open until source implementation is tested. |
| P0 canonical architecture/ownership contract | 100% | Canonical definitions, target owners, cardinality, provenance, CQ-version policy, and runtime-gap transfer are recorded in the v1.1 owner audit. This is contract completion, not runtime completion. |
| Build delta | N/A | First comparable snapshot; no previous evidence-backed baseline. |

## Block-by-block progress
Implementation percentages below describe code and integration present on the branch, not verified runtime behavior. Verification remains separately tracked in the headline until tests execute.

| Block | Implemented (verification pending where noted) | Remaining implementation | Status and evidence |
|---|---:|---:|---|
| P0, Canonical engine contract and owner map | 100% | 0% | Complete as architecture/ownership contract. Qualium is the Vritti→fetter interpretation orientation; tone belongs to canonical nerve-address node/seat owner; CQ equation version policy and metric isolation are fixed. Runtime source wiring is P1, not a P0 blocker. See ATUNED_MVP_ALPHA_CANONICAL_RECORD_OWNER_AUDIT_v1.md v1.1. |
| P1-A, Source/tone owner seam | 100% implemented / unverified | 0% implementation remaining | `FLOWSEAT`/`seatHz` located in `engine/data/practice.js`; existing consumers in `ui/release.js` and `ui/map.js`; derived address tone reference wired in `engine/trace.js`. Test execution remains unverified. |
| P1-B, Trace relationship seam | 100% implemented / unverified | 0% implementation remaining | Derived story→impression→fetter and canonical address→fetter association are wired; `loopRead` exposes source-backed markers with raw story text, candidate provenance, address/nerve and configured FLOWSEAT tone reference. No `p.vritti[]`; tests authored but not executed. |
| P1-C, Regression/contract closure | 100% implemented; execution deferred | 0% implementation remaining | Added deterministic/idempotent derivation, profile validation round-trip, legacy profile without trace, strict rejection of uncontracted qualium fields, confirmed-address versus inferred-fetter provenance, metric isolation, and UI contract assertions. Commands have not been executed by instruction. |
| P2, Trace graph/marker integration | 100% implemented; execution deferred | 0% implementation remaining | Existing pattern row now exposes source-backed story text, inferred/candidate status, canonical nerve address and nerve label, configured FLOWSEAT seat-tone reference, and explicit unrecorded qualium dimension. Marker is derived; no duplicate Vritti collection or metric writes. Structured sensory/emotional capture is split into a separate follow-on block, not counted as marker integration. |
| P3, CQ/DQ/SQ calculation integration | Arithmetic wired; framework mapping blocked | Not complete | `compute.js` has model-3 arithmetic and consumers/history wiring, but it uses band-derived `It` as Intention. Canonical `docs/briefs/cq-unified.md` / `DECISIONS.md` define Intention as action-linked said-versus-did follow-through (`intentionRead`, 7-day window). These are not equivalent. Owner decision required before claiming framework-correct CQ. See `ATUNED_CQ_COHERENCE_FORMULA_INTEGRATION_TDD_v1.md`. |
| P4, Release/intervention loop | 0% | 100% | Release hit-feedback requirements are documented elsewhere; no new implementation or tests completed in this pass. |
| P5, End-to-end verification | 0% verified | 100% unverified | Candidate GitHub Actions deploy/gate runs are still queued; no completed test result is available at this snapshot. Local build/test execution is unavailable in this environment; no pass is claimed. |
| P6, Final integration and handoff | 0% | 100% | Cannot close until runtime implementation and verification evidence exist. |

## Implemented versus verified
- Implemented in this pass: CQ model 3 formula wiring in `compute.js`; returned formula inputs; revised CQ regression expectations and added explicit formula contract assertions; added `ATUNED_CQ_COHERENCE_FORMULA_INTEGRATION_TDD_v1.md`.
- Verified by source inspection: story text and onboarding metadata live under p.story.entries; address/nerve identity is sourced from NODES; trace is strict and stored through p.trace; the current source does not establish that NODES[].d or OUTWARD/INWARD is qualium.
- Not verified: runtime signal → fetter → qualium → node/tone traversal, marker rendering, persistence round trip for new links, metric isolation, release-feedback integration, build/tests.
- Test status: passed 0 confirmed; failed 0 confirmed; blocked/not run: documented build, engine, and release-chain tests. "0 passed" means no run evidence is available, not that tests failed.

## Open gaps
1. Structured sensory and emotional input capture at the existing source/imprint owner remains a separate follow-on; current story text is preserved as raw source and is not misrepresented as a fully structured waveform.
2. A domain-approved qualium orientation vocabulary is not invented. The current contract exposes qualium as an explicit, unrecorded orientation-of-distortion dimension until its canonical owner and values are approved.
3. CQ arithmetic and downstream wiring exist, but canonical Intention mapping is unresolved. Do not proceed to other work or mark CQ complete until the formula's Intention source and missing-data behavior are settled, then update tests and run acceptance.
4. Build and test execution remains deferred by instruction; run ./atuned_src/BUILD-engine.sh, node tests/engine.js, node tests/trace.js, and the documented release-chain command before claiming runtime verification.

## Next recursive execution target
Priority 1 is CQ formula model 3. Source wiring, formula-consistent range/ceiling projections, and regression assertions are committed. Candidate CI/gate runs remain queued; inspect the first completed run, repair every failure recursively, then run engine, trace, and release-chain acceptance. Do not advance structured sensory/emotional capture or release feedback ahead of CQ acceptance.

## Audit rule
Do not upgrade a percentage because a document was written or a commit exists. Mark criteria complete only when the defined source/behavior criteria and applicable verification evidence are satisfied. Update this file after every subsequent build/pass and preserve the previous snapshot for delta calculation.
