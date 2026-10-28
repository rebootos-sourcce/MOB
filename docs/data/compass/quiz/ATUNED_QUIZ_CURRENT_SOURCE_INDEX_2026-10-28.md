# ATÜNED Compass Quiz — Current Source Index & Acceptance Gates
Date: 2026-10-28  
Scope: Public Core 10 funnel → signed-in remaining 11 → verified full 21-law Diagnostic.

> **Working baseline, not production certification.** The newer Core-10 and unified 21-law design supersedes the old 100-question quiz as the **target**. This record is grounded in retrieved GitHub documents and the available October 28 story-flow handoff. Full verbatim text of separately titled "ATUNED Compass + Funnel" chats 1, 2 and 3 was not independently retrievable here. Any later chat-only decision must be reconciled before calling the design final.

## 1. Read these files in this order

1. `docs/data/compass/quiz/v2/INTEGRITY_21_LAW_THREE_REGISTER_V2.json` — latest structured 21-law / 63-response content draft (v2.0.0), **source of record for quiz content**.
2. `docs/data/compass/quiz/v2/INTEGRITY_21_LAW_THREE_REGISTER_V2.md` — owner-readable wording and integration rules.
3. `docs/data/compass/quiz/v1/CORE10_FUNNEL_COMPLETION_TDD_V1.md` — owner's corrections, three numeric registers, conditional safety, no-repeat funnel-to-app agreement, acceptance gates.
4. `docs/data/compass/quiz/v1/CORE10_FUNNEL_PACKAGE_V1.json` and `CORE10_FUNNEL_QUESTIONS_AND_STORIES_V1.md` — all ten mini-stories, earlier v1.1 content, revised contextual prompts.
5. `docs/data/compass/quiz/v2/validate_integrity21_v2.cjs` — structural validation gate; run `node docs/data/compass/quiz/v2/validate_integrity21_v2.cjs`.
6. `funnel/quiz.html`, `funnel/questions.js` on main — *legacy implementation only*, 100 questions and five-category frequency answers; **not** an implementation of V2.
7. `atuned_src/engine/intake.js` on main — separate left/right/neutral legacy 63-item intake; **not** interchangeable with new B/P/M registers.
8. `atuned_src/engine/compute.js` — live CQ authority; do not invent funnel CQ arithmetic.
9. `rebootos-sourcce/Reboot-OS/atuned/server/src/funnel.js` — existing session/account handoff infrastructure to inspect and integrate, not proof of 30-answer persistence.

## 2. Canonical V2 contract

- Public Core 10 = **10 canonical laws × 3 registers = 30 questions**.
- In-app completion = **11 remaining laws × 3 registers = 33 new questions**.
- All laws = **21 × 3 = 63 versioned questions**; Core 10 must not be repeated.
- Registers: BEHAVIOR (aligned), PRESSURE (aligned under safe challenge), MECHANISM (reverse-facing frequency of specific hypothesized protective behavior).
- Responses: numerical **0–10** frequency of the explicitly stated action **in eligible situations**; N/A and skipped are `null`, not zero. A person's motive is not established by a scored mechanism.
- **All three raw answers remain separate and versioned. Do not average the reverse register into the CQ figure.** Final full CQ positioning requires the appropriate canonical measurement authority and complete eligible 21-law coverage.
- Preserve canonical law/question IDs and source versions, context, consent, and any user correction. Do not claim physiological measurement from self-report.
- Funnel results should be an honest **Core-10 provisional self-report snapshot**, not a fabricated complete 21-law CQ, while the denominator and model authority remain unresolved.
- The seven Compass bands are present across the ten public laws: Root, Sacral, Solar, Heart, Throat, 3rd Eye, Crown.

## 3. New source integrity evidence

The retrieved V2 JSON was inspected on this branch on 2026-10-28. In-memory structural assertions passed for 21 canonically ordered law IDs, 63 distinct question IDs, exactly three named registers/polarities per law, 10 Core-10 flags, the 30/33 question split, all seven bands, N/A/skip support, and manifest law-list consistency.

**Not yet demonstrated:** running the Node validator in CI, owner wording comprehension, live UI behavior, semantic appropriateness, CQ calibration, account persistence, mobile support, or a production end-to-end journey.

## 4. Implementation order and acceptance gates

| Gate | Implementation requirement | Present evidence |
|---|---|---|
| V2-S: source structure | 21 laws, 63 unique prompts, precise polarity, 10/11 split | **PASS (source inspection); versioned validator added, CI not run** |
| V2-C: comprehension | owner accepts exact wording, user can identify event, action and eligible opportunity | **OPEN** |
| V2-Q: public quiz | actual V2 30-question UI: 0–10, N/A, skip, back, resume, seven-band mini Compass | **NOT IMPLEMENTED** |
| V2-R: provisional summary | qualified 10-law self-report result, strengths, gaps, mechanism as hypothesis, uncertainty and no fake CQ | **NOT IMPLEMENTED** |
| V2-H: identity/handoff | user-authorized safe preservation of 30 raw responses and IDs; optional account creation; no duplicate intake | **NOT VERIFIED** |
| V2-D: remaining diagnostic | signed-in app shows the next 33 and preserves the first 30, including corrections | **NOT IMPLEMENTED** |
| V2-E: canonical CQ integration | one owner-approved, versioned CQ authority; explicit missingness and band boundaries | **OPEN** |
| V2-G: guide/journal/practice | story, confirm/correct, approved release and ritual IDs, evidence-based progress | **NOT VERIFIED** |
| V2-T: E2E and production | 0/10, N/A, unsafe, no opportunity, correction, refresh, cross-device, session, screen reader, mobile, security, deployment | **NOT RUN** |

## 5. Immediate engineering sequence

1. Freeze this V2 bank as content candidate, validate structural regression automatically, and finish wording/context review.
2. Implement a shared V2 question loader and versioned answer contract. **Never use the old five-point bank or old Intake 63 indices as if compatible.**
3. Implement 10 × 3 public encounters with truthful progress, skip/N/A, resume and provisional seven-band display.
4. Produce the actual 30-answer summary with clear evidence vs hypothesis labels, explicit missingness and first suggested exploration.
5. Add consented, durable 30-answer transfer via server/account, preserving original answer IDs and edits. Avoid sensitive full-record URL fragments.
6. Modify the signed-in Diagnostic to start with the 11 unanswered law entries; retain and display Core-10 answers without asking again.
7. Integrate canonical CQ only after owner-approved scoring semantics and verify with engine regression tests.
8. Wire supported, user-confirmed findings to the Discover → Play → Flow → Embody loop; verify release/ritual/Avatar progression separately.
9. Run full browser-to-account-to-return golden path and deploy only after passing evidence.

## 6. Percentages, with denominators (not claims of production completion)

- **V2 content structure:** 63/63 question records = 100% *structurally authored*; wording and semantic signoff are open.
- **Core-10 subset:** 30/30 prompt records exist; **0/30 V2 prompts confirmed served in the live public quiz**.
- **Remaining diagnostic:** 33/33 prompt records exist; **0/33 confirmed served in the live app using V2 contracts**.
- **V2 cross-system end-to-end:** **0 verified golden-path runs**.
- **Project-level baseline:** prior provisional total about 50% for broad Compass + Funnel + Psyche, not a new measurement. Do not carry the old 65% legacy quiz estimate into the V2 quiz and call it V2 completion.
- **Confidence:** source contract 0.98; structural counts 0.99; live readiness estimate low until tests; latest chat-only decision coverage incomplete.

### Change discipline
All migration work belongs on an isolated feature branch until approved, tested and reviewed. The owner did not authorize silently replacing existing CQ math, scores, or approved production behavior.
