# ATÜNED — SOURCE Design Acceptance Matrix and Implementer Handoff
**Date:** 2026-10-29 | **Status:** TEST SPECIFICATION ONLY — NO RUNTIME TESTS RUN  
**Design owner:** SOURCE orchestration. **Schema:** [Source v1 event envelope](data/ATUNED_SOURCE_CONVERSATION_SEAM_SCHEMA_v1.json). **Architecture:** [13-seam TDD](ATUNED_SOURCE_INTELLIGENCE_SEAMS_ARCHITECTURE_TDD_2026-10-29.md).

## 1. What constitutes evidence
Three distinct check columns must be reported. **C = contract complete:** the specification gives provider, consumer, typed payload, authorization, correction/rejection, version/ID, error, and owner. **V = schema/examples validate:** schemas parse, normal positive instances validate, negative instances fail validation, and cross-reference/ID checks pass. **R = runtime verified:** implementation integration and human-reviewed multi-turn conversation demonstrate it, including backend receipts and privacy/correction. Do not infer R from C or V.

This document currently provides **candidate C test criteria**, not an observed percentage. Schema commits alone do not validate behavioral outcomes. A high CQ or intelligent-sounding response is not proof the model is free of distortion or that the person is healed.

## 2. Interface test inventory

| ID | Provider → consumer | Required positive behavior | Failure / adversarial test | Current evidence status |
|---|---|---|---|---|
| S01 | Voice/text → SOURCE | Final transcript, revision, user intent, source and topic preserved | Interim ASR corrected; wrong-text highlight retracts | Design only |
| S02 | SOURCE → Sniffer → SOURCE | Raw spans, descriptor/modifier, intensity, subject/tense and candidate register returned with provenance | "I wasn't angry; she was furious" never becomes user's admitted anger | Design only |
| S03 | SOURCE → evidence ledger | Exact user wording preserved independently of inference; correction supersedes | Bad normalized offsets and stale citations detected | Design only |
| S04 | Registry → SOURCE | Stable typed record IDs, taxonomy, sourceRefs and three research-pass statuses | Missing source returns unresolved; no fabricated record | Design only |
| S05 | SOURCE → graph | Evidence-based typed proposed edges; versioned review/ACK | Unconfirmed intergenerational hypothesis never enters canonical graph | Design only |
| S06 | Graph → SOURCE | Material contradictions, alternatives and unknowns available | One episode contradicts earlier claim; preserve both | Design only |
| S07 | SOURCE → CQ | Versioned snapshot from sole CQ owner with formula/input status | Unresolved Intention never silently yields CQ 100 or a fabricated number | Design only |
| S08 | Sniffer/SOURCE → Imprints/Bank | Provisional preview distinguished from saved pattern; authorized save ACK | Failed save does not display "banked" | Design only |
| S09 | SOURCE → Release | Request traces user selection, evidence, consent; outcome receipt | Abort/reject produces no "released" claim | Design only |
| S10 | SOURCE → Ritual | Plan proposal with user goal, permission and evidence; practice result separated | Practice count does not auto-increase CQ without approved reassessment | Design only |
| S11 | CQ/graph → Compass/Avatar | Accepted CQ band and unique release-pattern count shown with version | Mixed model versions not compared as like-for-like | Design only |
| S12 | SOURCE → renderer | Listening, considering, tentative/supported/retract are real semantic cues | Corrected relation retracts; no simulated body scan | Design only |
| S13 | Ledger → analytics | Authorized, scoped events only; retention/version metadata | No raw private stories or cross-user learning without consent | Design only |

## 3. Language and discernment acceptance pack

Every scenario has **input**, **expected structures**, **forbidden inference**, **conversational ideal**, and **retraction rule**. Implementers must save test fixture + output trace + evidence IDs + observed response, and have a human reviewer mark naturalness and judgment independently.

| Test | Story / turn(s) | Required observable outcome |
|---|---|---|
| L01 | "I was angry." | Said angry, self, past; candidate Anger/Solar mapping; no asserted current physiological state or moral violation |
| L02 | "I was absolutely furious." | Intensifier scoped to furious; lexical strength distinguished from L01 without fabricated calibrated physiology |
| L03 | "I was a little angry." | 'little' modifier low; does not equal "absolutely furious" |
| L04 | "I wasn't angry. My sister was furious." | Self negation and other-person attribution separately traced; no negative user Imprint for sister's anger |
| L05 | "Our family always spends Christmas together." | Family-practice generalization, no forced negative charge |
| L06 | "Our family always spends Christmas together, but I don't want that anymore." | Family script + explicit self divergence; possibly proposed tension, never assumed trauma |
| L07 | "I have to go or I'm a bad daughter." | Conditional self-worth as tentative belief; user can confirm or decline |
| L08 | "I always feel anxious." | Generalization, not proof of literally constant anxiety; Source can ask context/exception |
| L09 | "My father always told me I was worthless." | Parent quote is an external message, not automatically current self-endorsement |
| L10 | "I will always love you." | Positive commitment; do not force limiting-belief classification |
| L11 | "I used to panic. Now I can speak up." | Past versus new behavior, possible improvement, not currently panicking |
| L12 | "I was furious, but I spoke respectfully." | Both shadow emotion and coherent behavior evidence survive; no signed collapse |
| L13 | "I was angry, angry, angry." | Word repetitions within one episode ≠ three independent events |
| L14 | Three dated and separately contextualized anger episodes | Three reported episodes with same user; one underlying root still unconfirmed |
| L15 | "I always fail" then later "Not always—I succeeded on Tuesday." | Contradiction and correction preserved; hypothesis weakens/revises |
| L16 | "My family expects me there" followed by "I don't want to anymore." | Cross-turn referent resolution and explicit desire retained |
| L17 | Person says "No, that's not a family pattern" | Candidate retracted, no silent reinsertion; original user story remains |
| L18 | ASR revises "furious" to "curious" | Offsets, traces and dependent provisional imprints update or retract |
| L19 | Person changes topic to a mundane task | SOURCE yields and answers new task; no forced psyche interpretation |
| L20 | Person asks for a summary | Distinguishes exact episodes, candidate connections, counterevidence and choices; no neat invented root |
| L21 | "I keep putting off the conversation" | Possible avoidance statement without adjective; no zero-hit refusal to converse |
| L22 | "I'm not angry but I could be" | Do not multiply an admitted anger charge from multiple negated/counterfactual mentions |
| L23 | Person says "stop exploring that" | SOURCE respects boundary and avoids repeating the interpretive hypothesis |
| L24 | Graph or CQ adapter fails mid-turn | SOURCE continues truthful conversation without pretending a score, relationship or write exists |

## 4. Cross-system contract validation tasks
1. **Schema parsing and structural integrity.** Validate JSON against draft 2020-12; verify 15 event types have an associated payload definition; check all referenced definitions exist; check required fields, enums, nonnegative offsets and numerical ranges. The regex/format checks depend on validator configuration, and need explicit enablement.
2. **Positive fixtures.** At least one schema-valid, evidence-linked event for each type; assert `correlation_id`, consent, provenance, revision and state.
3. **Negative fixtures.** Reject missing evidence, unknown actor, invalid CQ range, invalid purpose, malformed timestamps, missing consent. Note: referential integrity (evidence IDs exist) requires a graph/ledger validation pass **beyond JSON Schema**.
4. **Permission matrix.** Distinguish processing allowed, storage allowed, analytics allowed, and user removal; review permitted internal draft persistence; do not silently equate conversation with permission to bank.
5. **Idempotency test.** Repeat a save/release request twice with same event ID. Confirm one accepted write and stable receipts, including retry under timeout.
6. **Rollback/retraction.** Reject hypothesis after preview and verify candidate, graph proposal and visual cue all retract; accepted records follow explicit correction/privacy policy.
7. **Version migration.** Change lexicon/CQ model version and demonstrate history comparison warning; current model-version semantics cannot be silently re-used.
8. **Fault isolation.** Source responds naturally with no Sniffer hit and with one subsystem unavailable; consequential writes fail closed.
9. **21-law SOURCE guard suite.** Each of the 21 proposed Source integrity records has at least a failure case, correction case, counterexample, source reference and three research-pass statuses; do not mark records canon-approved from table rows.
10. **Privacy/security signoff.** No cross-tenant evidence, private conversation leakage, unapproved model training or unlogged consequential action.
11. **Naturalness assessment.** 15-minute unscripted real conversation covering family tradition, universal language, emotional intensity, opposing intentions and changing context; measure interruption, relevance, forced questions, unsupported inferences and user corrections.
12. **Accessible visual-state audit.** Voice-first, captioned, keyboard, reduced-motion, correction visualization and honest recording feedback.

## 5. Blocking compatibility decisions
Do not ask the next engineer to infer any of these:
- The canonical CQ Intention operand is unresolved: existing model-3 arithmetic currently consumes `It`; behavioral owner canon defines said-vs-did follow-through. Historical Sniffer contract says Resistance primarily affects Expression, while CQ integration divides by normalized Resistance. **Owner/domain reconciliation and explicit version decision required.**
- Current SI 21 integrity names vs legacy `LAWVIO` include different concepts for Responsibility/Accountability and Ownership/Wisdom. **Do not auto-alias or silently score missing law cues.**
- Legacy Sniffer coverage for the 13 nature and 15 human-nature principles is reported zero. The record source/version and missing-data status must be explicit.
- Current Imprints/Bank persistence and "Commit" semantics predate conversation-first SOURCE. Preserve data and guarantee correct consent + receipt semantics in any migration.
- The record schema uses `researchPasses` exactly three, but three empty/pass-pending slots do not count as researched.
- 13 interface names and v1 schema are **proposed adapters**, not a discovery that running REST endpoints with those exact names exist.

## 6. Final build handoff
Implementation order: **(a)** owner-domain reconciliation of P0 contradictions, **(b)** versioned evidence/turn envelope adapter, **(c)** Sniffer frame/modifier/context upgrade, **(d)** graph/Bank CQ read and guarded write adapters, **(e)** model-based SOURCE turn policy, **(f)** user correction/retraction and visual presence, **(g)** 15-minute naturalness/acceptance runs. Every stage must report file/commit identifiers, which tests ran, pass and fail counts, and unsolved blockers. No Source TDD success metric is a runtime success metric until demonstrated.

## 7. Measurements and values (as of design handoff)
**Seam inventory:** 13 documented. **Schema event types:** 15 proposed. **Language/interaction acceptance cases:** 24 specified, not executed. **Runtime tests executed by this document:** 0. **App code changes:** 0. **Design interpretation confidence:** 0.97. **Verified runtime compatibility:** unknown. **Unresolved domain conflicts:** 3 categories (CQ operands/resistance; law naming; nature/human-nature mapping) plus additional implementation and privacy decisions. No claim of 100% implementation.
