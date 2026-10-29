# ATUNED Core 10 Funnel — Completion TDD V1.1

**Status:** 30 context-complete, numerically answerable question prompts plus 10 mini-stories authored and statically checked. **No live quiz, CQ, journal, or Compass changes made.**

## Owner's correction

> “There's a context missing ... When respect was difficult, what felt threatened? ... we want them to report these on a zero to ten scale. ... When you held back. First off, held back what? ... it doesn't allow me to self-report.”

## Canonical question contract

For each of the 10 owner-selected integrity laws, require **three 0–10 measured registers**. The user answers **how frequently they took a named action in a named situation**, with anchors 0 Never / 5 half / 10 Always. Each item must stand alone when displayed by itself; avoid unresolved pronouns, vague event references (“held back what?”), undetermined behavior, and unsupported claims about internal motives.

- B = aligned behavior in eligible situations.
- P = aligned behavior when real personal cost is present, reasonably safe and eligible.
- M = explicitly named *reverse-facing protective behavior* in a clearly described perceived-threat context. A reported score means the **frequency of the stated response**, not certainty about a root belief. Examples such as hiding a mistake to avoid judgment are testable self-report behavior; a free-text alternative mechanism remains possible.

**10 on Mechanism = often exhibits the named protective response, not perfect integrity.** Never add B+P+M or calculate a three-score mean without explicit reversing and an owner-approved CQ derivation. Under all circumstances raw ratings are independently persisted. A third answer of 0 with no relevant feared event is not the same as an actual 0 with events; offer N/A. A person can reject the proposed mechanism, be unsure or name a different reason. Safety, privacy, low control and coercion must be respected.

## Story/copy contract

Each law retains one recognizable everyday vignette, explains when intentional aligned action supports coherence (as ATUNED's model of action/intention alignment), and describes how reverse behaviors may add friction. **Don't claim measurable autonomic nervous-system regulation, physiological or psychiatric effects from an answer**. The release and becoming proposals are not executable until joined to canonical protocol IDs.

## Funnel build steps

1. **Approve final questions and selected single candidate mechanism per law.** Run comprehension tests: users can say exactly what action and situation each question asks about, and can report 0 or 10 meaningfully without inventing an event. Add alternate mechanisms adaptively only with explicit provenance (don't assume ten chosen fear patterns cover everyone).
2. **Build 10 three-card encounters** with 0–10 inputs for B, P, M; optional mini-story; progress, skip, N/A, return and resume. Mechanism's opposite-facing direction must appear in UI labels and analytics. Don't reuse `funnel/questions.js`'s reversed five-point response mapping or `atuned_src/engine/intake.js`'s left/right/neutral indices without a versioned migration.
3. **Resolve CQ domain authority.** Present a distinct Core-10 self-report snapshot until `atuned_src/engine/compute.js` (currently CQ_MODEL=2) and proposed Model-3 `(Integrity × Intention)/Resistance` settle Intention and the partial-law rule. Never invent an alternative CQ number.
4. **Build mini Compass** with all seven integrity bands, distinguish positive-frequency B/P and reverse M channels; translate variability into nonjudgmental explanatory sentences; 4–6 is a proposed conceptual oscillation band, not a population norm. A score never auto-assigns a person to Inferno/Purgatorio/Paradiso.
5. **Secure account handoff** that persists preferred name, question versions, 30 raw answers (including null), consent, date, and optional self-description, using existing `atuned_funnel_system` ownership/attachment seam rather than sensitive shareable URL fragments.
6. **Journal evidence and refinement**: later user-supplied story can propose corroboration or challenge for a particular situation and law; save source, consent and accept/reject decision as a separate version; never silently rewrite the submitted self-report or infer a confirmed protective belief.
7. **Join actual rituals and gameboard scenes**: map proposed user-selected challenge to valid Compass scene IDs, link verified release and becoming IDs, log observed practice events, update avatar only from dated user actions.
8. **Test and ship**: scripted 0/10 edge cases, valid N/A vs 0, pressure-only responses, no relevant fear, mechanism disconfirmation, mobile/keyboard/screen reader tests, session resume/import, security, no CQ regression, production review.

## Acceptance gates

| Gate | Required evidence | Current state |
|---|---|---|
| G1 content | 10 exact canon law names; 7 bands; 30 complete questions; 30 numeric responses; 10 mini-stories | **STATIC CONTENT DONE**, owner comprehension review pending |
| G2 scoring | separate B/P/M values and polarity; no alternate CQ calculator; N/A distinct from 0 | **CONTRACT ONLY** |
| G3 experience | interactive ten-encounter journey with three actual 0–10 inputs each | **NOT BUILT** |
| G4 results | self-report summary, mini Compass, challenge preview with correct scope | **NOT BUILT** |
| G5 identity and journal | secure profile save, same numbers after reload, evidence consent and reversible revisions | **NOT BUILT / EXISTING INFRA PARTIAL** |
| G6 gameplay | approved release/becoming ID joins, Virgil guide, event evidence, avatar projection | **NOT BUILT** |
| G7 testing | regression and real-browser E2E including no-motive-coercion cases | **NOT RUN** |

## Quality tests

- Every third prompt must permit a literal 0–10 frequency answer and a statement of *what was actually done* in *which triggering situation*; do not accept bare “What felt threatened?” prompts.
- B and P always have polarity `ALIGNED_CAPACITY`, M `REVERSE_PROTECTIVE_PATTERN`. Results cannot mislabel 10 in M as superior integrity.
- No N/A on M because a particular situation was absent can be interpreted as never exhibiting the mechanism; preserve null.
- Any selected mechanism remains a candidate even if rating is 10; not a demonstrated root cause, not automatically a diagnosis or moral rank.
- Retain full 21-law questionnaire as separate, earlier version; do not claim its third channel has been converted.

## Source ownership

- `docs/data/compass/quiz/v1/CORE10_FUNNEL_PACKAGE_V1.json`: version 1.1.0; authoritative *new Core 10 content draft*.
- `docs/data/compass/quiz/v1/CORE10_FUNNEL_QUESTIONS_AND_STORIES_V1.md`: owner-readable questions + stories.
- `docs/data/compass/quiz/v1/validate_core10_package.cjs`: static structure and scoring-polarity validator.
- Live funnel: `funnel/questions.js`, `funnel/quiz.html` — unchanged.
- Canonical CQ: `atuned_src/engine/compute.js` — unchanged.

## Owner clarification — 2026-10-26: real-world pressure wording and Core 10 → full diagnostic continuity

**Design note; not authorization to replace a live questionnaire.** The owner wants a clear, everyday situation and a recognizable behavioral decision in each prompt, especially when the person *does not feel safe* telling the truth. The illustrative 8/4/7 scores were not the point: numbers must reflect the respondent's own 0–10 self-report, not canned example scores.

- **Pressure questions must explicitly name the situation and the act.** Example owner phrasing: “When someone asks you for an honest answer and you don't feel safe, how often do you still tell the truth?” Preserve this close-to-life construction in editing rather than writing abstract “What felt threatened?” questions. **Important boundary:** distinguish *fear of disapproval or discomfort* from actual danger, coercion or unsafe disclosure. Someone who protects themselves in danger has not automatically failed a moral-integrity law. Provide N/A and safe context wherever a risk is real.
- **All 3 registers remain 0–10 self-report.** Behavior = frequency of action; Pressure = frequency of aligned action under a specified challenge; Mechanism = frequency of a specified defensive response when the named trigger appears. Mechanism has reverse polarity. Concrete antecedent, behavior and opportunity are required for each prompt.
- **One diagnostic question library, two surfaces.** The owner-approved **Core 10** are the first ten **21-law** canonical entries displayed in the public funnel (10 laws × 3 = 30 questions). The signed-in Diagnostic tool must present the **remaining 11 laws × 3 = 33 additional questions** in the **same exact three-register format**, so the user eventually completes **21 laws × 3 = 63 responses**.
- **No repeat intake:** Transfer Core 10 answer values, question IDs, context, status and version from funnel to user account. In the Diagnostic tool, preserve and show already answered 10 laws, offer editing/reassessment by choice, and queue the 11 remaining laws; never score missing 11 as zero. All inputs need canonical law IDs and versioned question records, not duplicate hardcoded quizzes.
- **Known implementation gap:** `INTEGRITY_THREE_DEPTH_QUESTIONS_V1.json` currently has a nonnumeric third depth for the 21-law draft, and `atuned_src/engine/intake.js` uses a different left/right/neutral 63-question contract. They **do not** yet meet this unified 21×3 design. Author a new versioned 21-law bank, validate 30 shared funnel prompts as the exact same canonical records, and migrate intentionally before wiring; do not silently reuse the current 63 intake indices.
- **Still required:** owner's revised wording review; a validated 0–10 answer contract; CQ vs Core-10 provisional status; resumed, cross-device account handoff; completion of remaining 11 without re-answering first 10; matching results in funnel and diagnostic; journal provenance/reweighting.
