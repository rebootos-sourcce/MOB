# ATUNED Core 10 Funnel — Completion TDD V1

**Status:** 10-law question and story content authored; **Funnel, canonical scoring, onboarding and avatar wiring still open**. Branch `atunED/teachers-poles-ascent-alpha-2026-10-25` as of 2026-10-26.  
**Existing sources:** `funnel/questions.js` (100 negative-event items), `funnel/quiz.html` (five response choices + preview + link transfer), `atuned_src/engine/intake.js` (different 21×3 left/right/neutral intake), `atuned_src/engine/data/canon.js#SI` (21 laws and 7 bands), `atuned_src/engine/compute.js` (presently CQ_MODEL=2), `docs/ATUNED_CQ_COHERENCE_FORMULA_INTEGRATION_TDD_v1.md` (model-3 formula proposed, Intention domain disputed), `docs/data/compass/gameboard/v1/` (26 proposed scenes, no runtime).

## Product contract

The core visitor sees an educational narrative + an optional 30-prompt instrument across 10 laws. Each law gets a short story, two positive-action frequency ratings and one uns cored possible-mechanism question, then a short "alignment / friction" explanation; avoid the misleading claim that a response is physiological up/downregulation. There are 7 represented integrity bands but 10 laws, so **band totals should not be naive sums**.

### Five pre-quiz story beats / funnel

1. **Invite:** "How often do your actions follow what matters to you?"
2. **Recognize:** brief everyday inconsistency story, without accusation.
3. **Understand:** show Behavior → Pressure → Mechanism, and explain 0–10.
4. **Experience:** a single optional sample law with a compact Compass preview.
5. **Begin:** privacy notice / start assessment, no premature name demand or claim of clinical accuracy.

These are *beats*, not necessarily five separate pages. Existing five-surface funnel assets may be reused; owner signs off actual screenplay and mobile feel.

### Quiz interaction

- Suggested rendering: one law encounter contains **three steps**, optional mini-story that can be expanded, and progress `law 3 of 10`. Do not make a corporate questionnaire or force users to acknowledge a hypothetical negative cause.
- Two 0–10 questions display Never / Half eligible times / Always. `Not applicable` and `Prefer not` are null. Pressure can be N/A when no pressure event occurred.
- Mechanism offers multiple plausible context choices, own-words entry, none, unsure, skip. A selected choice is a **user hypothesis**, not diagnosis.
- Preserve raw answers by versioned `questionId`, `lawName`, `register`, `timestamp`, answer type, context, and provenance; allow resume/edit.
- Backtracking and accessibility, keyboard, screen readers, readable progress, reduced motion, touch target floors.

### Scoring and results — hard architectural gate

**Canonical CQ is unresolved:** current `atuned_src/engine/compute.js` uses `CQ_MODEL=2` and law-only CQ; the proposed Model-3 formula uses (Integrity × Intention) / Resistance but its Intention mapping is not ratified. No new independent CQ calculator may be shipped in this package.

Until accepted, the result is **Core-10 self-reported integrity baseline**, shown by law and band, **not full CQ**. Even if a provisional exploratory index is calculated, it must have a distinct `CORE10-1` identity, disclose answered count and not imply psychometric accuracy. Never set eleven unanswered full-model laws to zero and call the result measured coherence. Do not equate a 4–6 score on an individual item to a medically validated state or automatically assign the user to a Dante realm.

Result screen must show:
- User's reported strengths and where behavior varies under pressure.
- Possible anticipated losses from the user's own mechanism choices.
- Short personal-alignment summary, with the language "you reported..." rather than claims of mindreading.
- Mini Compass: 7-band visual + visible Core-10 law values + explanatory 40–60 oscillation *metaphor*, marked model estimate.
- One user-selected challenge, knowledge card, release reflection and becoming suggestion, with **no executable action offered until protocol IDs are joined**.
- Choice to save results by creating an account; no forced disclosure of raw journal stories.

### Joining the instrument to the user

- Maintain original Q1, Q2, Q3 values immutable with an append-only history of any edits/corrections; journal must not silently overwrite baselines.
- Account creation uses the established `atuned_funnel_system` secure attachment/transfer contract. The current stand-alone quiz's `#r=` link is shareable and contains a full profile; do not pass new sensitive raw mechanism/journal data into a shareable URL.
- Preserve name, completed/partial session, question-bank version, law scores, pressure deltas, mechanism options and consent on account creation.
- Journal engine proposes evidence-linked refinements, stores accepted/rejected outcome with date and reason, and differentiates self-report from derived reading.
- Full Compass uses the 26-scene map as a **separate user-chosen progression narrative**. Scene unlock introduces information, not moral rank or CQ increase; Source AI uses Virgil-style opt-in guidance; avatar shows logged practice, never inferred goodness.

## Work remaining to complete the package (definition of done)

| Gate | Status as of 2026-10-26 | Evidence needed |
|---|---|---|
| G1. Lock owner Core 10 selection and 30 question wordings | CONTENT DRAFTED; owner review pending | One signed-off version of 10 IDs × 3 questions, 7 bands, no duplicates |
| G2. Approve the 10 mini-stories and integrity/opposite explanations | CONTENT DRAFTED; owner review pending | Scenarios recognizable, non-moralizing, distinct and accessible |
| G3. Answer scoring architecture | BLOCKED | Decide canonical CQ model/intention semantics, shortened-quiz result label and missing-law policy |
| G4. UX, quiz flow and mini Compass | NOT BUILT | Playable responsive 10×3 journey, optional stories, skip/return, seven-band presentation, results |
| G5. Secure funnel → account → app handoff | PARTIAL OTHER FUNNEL INFRA ONLY | Same profile/evidence survives attach/reload/resume across device boundaries without leaking in a URL |
| G6. Journal reweight and consent | NOT BUILT | Source-quoted law evidence proposed, user-approved adjustment, audit/version history and rollback |
| G7. Full map and guide integration | NOT BUILT | Result challenge maps to a valid game node, approved release+become protocol IDs, evidence to avatar |
| G8. Tests, privacy, rollout | NOT VERIFIED | Mobile/desktop E2E, keyboard/AT, dropoff, no score drift, privacy/security checks, staged deployment |

**Owner choices needed:** (a) whether only 20 numeric questions + 10 optional mechanism questions may yield the Core-10 preview; (b) whether one or all ten stories are shown before or during quiz; (c) whether a quantified 0–100 provisional index is shown ahead of accepted CQ formula (recommend law-wise snapshot, not a CQ number); (d) policy for adjusting journal-derived estimates (recommend user-confirmed, auditable suggestions only).

## Tests required

- Questions: exact 10 canonical SI names, all seven bands represented; unique IDs and exactly three registers; mechanism never carries a numeric score or required negative answer.
- Scoring: 0 and 10 allowed; Q2 NA doesn't penalize; Q3 skip doesn't alter a law baseline; no double-weighted solar/throat bands; versioned result never silently masquerades as CQ.
- Data flow: same 10 raw answers and source provenance after resume, account attachment, refresh and import; no cross-profile access or personally sensitive text in referral/share URL.
- Journey: one end-to-end scenario `choose → know → reflect → become → log event → avatar trace`; do not fake completed releases or automatic coherence improvement.
- Copy/quality: 10 story vignettes, 10 aligned explanations, 10 misalignment explanations, 10 release-and-become invitations; independent comprehension testing with small pilot before wider rollout.
- Existing 100-question bank, 21×3 intake, CQ engine, 26-scene map and release-accounting tests still pass with no silent replacement.

## Not included in content-only commit

No edits to `funnel/`, `atuned_src/`, `CQ`, `DQ`, canonical law roster, user records or actual account backend. These remain explicit future engineering gates.
