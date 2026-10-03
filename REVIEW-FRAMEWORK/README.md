# The review framework (standing, reusable. Set by the owner, round PH and PJ)

His words, round PJ: "do what they did with their last round, bounce it amongst
themselves, simulate it amongst themselves in the ICPs, same framework as before,
and when I repeat this it will be the same framework unless I adjust it."

So this is the procedure. When he says "review X", run it exactly as written here.
He adjusts it by saying so; every adjustment is written into this file the same day.

## What it is
Three passes by the whole team on one SUBJECT (a screen, a flow, a skin, a feature),
each seat grading its own discipline, with a tally, ranked recommendations, and a
pitch to the ICPs (ideal customer profiles: the kinds of person we build for).

## The seats (twelve, all on Sonnet, read only on the product)
art-director, uiux-architect, narrative-director (copy and type), brand-director,
systems-director (design system, symbols, upstream and downstream), animation-vfx-director,
innovation-director, game-director (mechanics and stickiness), technical-director
(cost and feasibility), marketing-director and sales-director (ICP pull and conversion),
creative-director (the soul, the whole), devops-qa (measured proof, runtime counts).

## The passes
1. PASS 1, independent. Each seat audits the subject from its own discipline with
   evidence (screenshots, source, counts). A grade out of 100, six to ten criteria
   scored out of ten with one line of evidence each. Writes `pass1/<seat>.md`.
2. PASS 2, collaboration. Each seat reads every pass 1 report. Agreements (strongest
   signals), disagreements with a ruling and a reason, what it missed, its part of ONE
   unified proposal written as values not adjectives, a revised grade, top five
   recommendations. Writes `pass2/<seat>.md`.
3. PASS 3, simulate and pitch. The unified proposal is pitched to each ICP in turn
   (use the ICPs in `PANEL-10k.md` and `BUYERS.md`: at least six, always including a
   phone only arrival, a skeptic, a practitioner, and someone in acute distress).
   Each simulated ICP reacts in their own voice: what they see in ten seconds, what
   they do next, what makes them leave. Then each seat gives a FINAL grade, and the
   proposal is measured against the highest unified quality. Writes `pass3/<seat>.md`.
4. TALLY. One page: each seat's grade at pass 1, 2 and 3, the average, what moved
   each grade and why, then the ranked recommendations (skin, redesign, mechanics,
   motion, innovation, stickiness, journey), each with size S, M or L and the ICPs
   it moves. `TALLY.md`. Plain words as if the reader is ten.

## Rules that are fixed
Seats decide; a question only if truly blocked. Verbatim owner words go in the brief.
Rulings in CLAUDE.md and DECISIONS.md are not argued. No em dashes. A generous grade
that hides a defect is a defect. Measure, do not guess. Check the tool against a known
case. Pictures for anything visual, made by the team and sent to him before building.
A reskin first; a redesign only where the gain in consistency is dramatic.

## How to run it
Copy `BRIEF.template.md` and `PASS2.template.md` and `PASS3.template.md` into
`REVIEW-<subject>/`, fill the subject and the owner's words, take the screenshots into
the scratchpad, launch pass 1 in parallel, then pass 2, then pass 3, then write the
tally. Last run: `REVIEW-skin/` (round PH). Last adjustment: round PJ added the ICP
simulation as a named pass (it was folded into pass 3 before) and the rule that the
framework is standing.
