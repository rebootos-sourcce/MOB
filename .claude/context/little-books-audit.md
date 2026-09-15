# The Little Book of Reprogramming — spec compliance audit

Compares the build spec (`SC - The Little Book of Reprogamming.pdf`) against the six
published booklets in Drive. Pass 2 of the corpus ingestion.

## Series status

Spec defines **seven** books. Drive holds **six**.

| # | Spec name | Chakra | Spec polarity | PDF in Drive | Status |
|---|---|---|---|---|---|
| 1 | Courage | Root | Fear / Courage | Courage (RED) | present |
| 2 | Wonder | Sacral | Shame / Pleasure | WONDER (ORANGE) | present |
| 3 | Power | Solar Plexus | Doubt / Confidence | POWER (YELLOW) | present |
| 4 | Love | Heart | Grief / Compassion | LOVE (GREEN) | present |
| 5 | Will | Throat | Silence / Truth | WILL (CYAN) | present |
| 6 | Sight | Third Eye | Illusion / Clarity | INSIGHT (INDIGO) | present, **renamed** |
| 7 | Source | Crown | Separation / Unity | — | **MISSING** |

## Violations found in all six books

**Pair count.** Spec: 15 Fetter Pairs. Every book ships **16**. 6/6 violate.

**Closing Directive.** Spec requires a per-chakra closing key
(`ROOT: Turn the page only when the body softens and the breath flows again.`).
**Absent from all six.** 6/6 violate. Every book instead ends on the series
list + author bio.

**Fetter stem.** Spec mandates `I'm letting go of believing, thinking, and feeling I am…`
and explicitly forbids `that I` clauses. Five variants are actually in use:

| Variant | Where |
|---|---|
| `…believing, thinking, and feeling I am` (spec-compliant) | Courage pair 1 only |
| `…acting, feeling that I am` | Courage 2–16, Wonder, Power |
| `…acting, feeling I am` (no "that") | Love |
| `…acting, and feeling that I am` (adds "and") | Will |
| `…acting, and feeling that I am` | Insight |

**Truth stem.** Spec mandates `I am believing, thinking, and feeling I am…`.
None use it. Actual: `I know that I am` (Wonder, Power, Love, Will),
`I am certain that I am` (Insight throughout, Courage pair 1),
`I know that I know` (Courage pair 8).

## Defects

- **Insight pair 5** ships a template placeholder in the body text:
  `Embodied Truth = Openness I am certain that I am open, flexible…`
- **Will has a duplicate pair.** Pair 8 and pair 15 are both `Rigidity / Acceptance`.
- **Courage** ships two "How to Use This Book" sections — `(ORIGINAL)` and `(ALT)`.
- Typos: `Responcibility`, `Depemdency`, `dependant` (Power); lowercase `i am`
  from Courage pair 3 onward. Power's Responsibility list repeats `responsible` twice.
- Spec contradicts itself: prose says `~88 words` per fetter, builder JSON says
  `"word_target_per_fetter": 70`.

## Cross-book collisions

`Separation / Unity` is the Crown's defining polarity — the missing book — yet it
ships inside **Love (pair 16)** and **Insight (pair 15)**.

`Rigidity` appears as a fetter four times across three books (Love 10, Will 8,
Will 15, Insight 5). `Doubt` anchors four different pairs with four different
truths (Courage→Knowing, Power→Certainty, Will→Faith, Insight→Faith).
`Powerlessness`, `Victimhood`, `Projection`, `Judgment`, `Control`, `Apathy`,
`Guilt`, `Shame`, `Confusion`, `Hesitation`, `Betrayal` and `Chaos` all recur
across books with differing partners.

## Broken convention

Two books close on their own title as the final truth; four do not.

| Book | Final pair | Matches title? |
|---|---|---|
| Courage | Hopelessness / **Courage** | yes |
| Wonder | Emptiness / **Wonder** | yes |
| Power | Ego / Service | no |
| Love | Separation / Unity | no |
| Will | Faithlessness / Devotion | no |
| Insight | Blindness / Awareness | no |

## Metadata drift

The back-matter series list (identical in all six books) disagrees with the spec table:

| Book | Spec polarity | Back matter says |
|---|---|---|
| Wonder | Shame / **Pleasure** | Shame into **Joy** |
| Power | **Doubt** / Confidence | **Guilt** into Confidence |
| Love | Grief / **Compassion** | Grief into **Connection** |
| Will | Silence / **Truth** | Silence into **Expression** |
| Sight | Illusion / **Clarity** | Illusion into **Insight** |

Section headings are also inconsistent: `Root`, `Sacral Energy`,
`Solar Plexus Energy`, `Heart`, `Will`, `Insight`.

## What is fully compliant

Impact cues. Every pair in every book carries exactly 4 somatic markers in
body-part + verb form, and the truth impact inverts the fetter impact literally:

> Fetter — `Jaw tight, brow furrows, breath shallow, heart restless.`
> Truth  — `Jaw softens, brow smooths, breath deepens, chest opens.`

Spec allows 3–5; the books settled on 4 without exception. This is the one
rule the series holds perfectly, and it is the strongest voice signal in the corpus.

## Affirmations (verbatim, one per book)

- Courage — *I am courage over fear.*
- Wonder — *I fulfill my desires with creative expression.*
- Power — *I am responsible for my destiny.*
- Love — *I am open, balanced, and whole in love.*
- Will — *I am clear, confident, and truthful in expression.*
- Insight — *I am clear, calm, and discerning in perception.*
- Source — *(none — book does not exist)*
