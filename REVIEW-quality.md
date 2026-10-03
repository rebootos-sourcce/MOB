# The team grading itself

Scored 2026-09-21 against commit 647a099, source.html md5 4b044f78008e21efd3506927b23618bf.
Read the page instead: `REVIEW-quality.html`. This file is the record.

**This is the team grading its own work, which is the weakest kind of evidence
there is.** Nobody outside the team scored anything here. The rubric was written
by the seat being scored by it and the dimensions were chosen after the work was
done. What it buys is repeatability: every dimension is computed off the bytes by
`sim/combination/quality.js`, so two readers get the same number.

What would make it stronger, in order: the owner scores the same 9 families on
the same eight dimensions and the columns are printed side by side; a
dimension is added for whether the change reached `atuned_src` at all, read off
the commits; and the rubric is frozen before the next round rather than after it.

## The numbers

- 91 page versions scored, 52 family versions, 717 dimension scores.
- Mean family score 15.6 to 16.7 out of 32.
- Follow rate 9%: of 43 transitions, 4 raised the dimension that had been weakest.
- 2 of 43 transitions dropped a dimension that had been higher.
- Weakest dimension overall: Names where it lands at 0.95 of four.

## The rubric

- **Self contained** mean 4.00, spread 0.00 (separates nothing on this set). Outbound references in the deliverable pages: a script, style, image, font or fetch pointing at a host. Four when there are none, minus two for each distinct one.
- **Looked at, both widths** mean 1.93, spread 1.53. Shots present in the tree at that commit at both widths, and a script that takes them. Two for each width, and nothing for shots with no script behind them.
- **Figures measured, not typed** mean 1.43, spread 1.77. Two for a measurement file in the family, Two for the page carrying a stamp: a commit, an md5 or a timestamp.
- **Refuses to build without its data** mean 2.57, spread 1.00. A builder or probe script in the family that exits non zero on a missing input. Four with the guard, two for a script with none, nothing with no script.
- **Reproduction printed on the page** mean 2.02, spread 2.01. The deliverable page naming the command that rebuilds it.
- **Voice gate** mean 2.30, spread 1.95. The repository voice gate run against the deliverable pages. Four minus one for each hard failure.
- **Names where it lands** mean 0.95, spread 1.53. Distinct paths under atuned_src named in the deliverable pages. Two for one, four for two or more.
- **Says what is still open** mean 1.07, spread 0.47. Counts the page saying what it is not doing, what needs a ruling, and whose call it is. This is the weakest of the eight and it is a word search.

## Every family

| Family | Seat | Iterations | First | Now | Move | Weakest now |
|---|---|---|---|---|---|---|
| The funnel | growth | 13 | 11.0 | 16.8 | +5.75 | Figures measured, not typed |
| The simulation pages | research | 20 | 17.0 | 19.3 | +2.34 | Looked at, both widths, Voice gate |
| The logo rounds | art | 7 | 17.0 | 19.0 | +2.00 | Reproduction printed on the page, Voice gate |
| The four story designs | design | 2 | 16.4 | 16.4 | +0.00 | Figures measured, not typed, Reproduction printed on the page |
| The navigation prototype | ux | 2 | 17.0 | 17.0 | +0.00 | Reproduction printed on the page, Names where it lands |
| The dial prototype | design | 2 | 20.0 | 20.0 | +0.00 | Reproduction printed on the page |
| The feather prototype, second | design | 2 | 17.0 | 17.0 | +0.00 | Reproduction printed on the page, Names where it lands |
| The feather prototype, first | design | 2 | 11.0 | 11.0 | +0.00 | Looked at, both widths, Figures measured, not typed, Reproduction printed on the page, Names where it lands |
| The ladder | game | 2 | 14.0 | 14.0 | +0.00 | Figures measured, not typed, Reproduction printed on the page, Names where it lands |

## What this cannot see

- **Is it good.** whether the artefact is well designed. No regex reads composition, and the team scoring its own taste is the weakest evidence in this document.
- **Was it the right thing to build.** a perfect artefact nobody needed scores full marks here. Only the owner’s queue answers this.
- **Is the claim true.** the voice gate says so itself: no gate reads a sentence against the reading it names.
- **Did it land.** whether the change reached atuned_src at all. This file reads what the artefact says, not what shipped.

## The instrument found two defects in itself

- The voice probe swallowed every failure, because the gate exits non zero when it
  finds one and the wrapper threw. Every artefact read four of four on voice until
  it was fixed. It now refuses to score until the gate reports a failure on a line
  known to fail.
- A family average computed off a joined text cannot be pulled down by a bad page.
  Five of the eight dimensions are scored per page now.

## Reproduce

    node sim/combination/quality.js 40
    node sim/combination/build-quality.js
