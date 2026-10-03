# Skin review brief (round PH, 1 October)

The owner asked the whole team to review Atuned three times as visionaries and to
find the soul of the product. The deliverable is a SKIN: a reskin of what exists,
with a full redesign proposed only where it gives a dramatic gain in consistency
and uniformity. Everything in the product has symbolic meaning: colour, symbol,
shape, information, how it is linked, what is upstream of it and downstream of it,
and the data that drives it. Review from that view.

His words (verbatim): "I want you and the team to review a tuned three times I want
you to collaborate amongst each other as visionaries knowing how visual systems
influence friction psychographics interface design visual language typography
branding copy design systems unified systems measurement of coherence. Look for the
soul of this product. From all those angles, I want to do UI/UX redesign like a new
skin ... pitch the ideas to the ICPs, and measure against their overall highest
unified quality. Knowing that that directly translates to human psychographics and
modern day stickiness ... recommend art direction suggestions, UI UX suggestions as
a reskin not a redesign; you can redesign if you're going to make a dramatic
improvement in UI UX for consistency and uniformity ... Come back and give it a
grade from each discipline individually. Create a tally of the score. Get
recommendations. Even on the animation and innovation, and mechanics side.
Stickiness side. User journey side."

## The three passes
1. PASS 1, independent. Each seat audits the product from its own discipline, with
   evidence (screenshots, source, the docs). Grades its discipline 0 to 100 with a
   score per criterion. Writes to `REVIEW-skin/pass1/<seat>.md`.
2. PASS 2, collaboration. Each seat reads ALL the pass 1 reports, names where it
   agrees, where it disagrees and why, what another seat saw that it missed, and
   revises its grade and recommendations. Writes `REVIEW-skin/pass2/<seat>.md`.
3. PASS 3, pitch and measure. The skin concepts are pitched to each ICP (ideal
   customer profile) and measured against the highest unified quality. Final grade
   per discipline, final tally, ranked recommendations. `REVIEW-skin/pass3/<seat>.md`.

## What to look at (read, do not rebuild)
- Screenshots of every surface, loaded profile ("Marcus, example"), at 1600 wide and
  390 wide: `/tmp/claude-0/-home-user-MOB/e909b21c-7092-5fcd-af76-1092a869307f/scratchpad/skin-shots/`
  (`1600-<tab>-loaded.png`, `390-<tab>-loaded.png`, plus `-00-first-screen.png`).
  Tabs: story, summary, field, body, intake, knowledge, games, compass, settings, character.
  Open them with the Read tool and LOOK. Reading CSS is not reviewing a screen.
- Mockups already made: `mockups/` (character-*, rail-*, onboarding, release-redesign,
  layer-observatory, teachers, matrix-gears, summary-layout, field, intake-*, compass-overlays).
- Source: `atuned_src/` (never edit; `source.html` and `engine.js` are build products).
  Tokens and palette: `atuned_src/shell/head.html`, `atuned_src/ui/`. Data that drives
  symbols: `atuned_src/engine/data/canon.js`, `atuned_src/engine/`.
- Docs: `CLAUDE.md` (voice rules, rulings), `DECISIONS.md`, `BRAND.md`, `BUYERS.md`,
  `DESIGN.md`, `DESIGN-ia.md`, `DESIGN-information.md`, `DESIGN-gamification.md`,
  `DESIGN-nav.md`, `ATUNED-art-ux-icp-review.md` (the earlier scorecard, use as the
  baseline and say what moved), `ATUNED-experience-icp-model.md` (the ICP list S1 to S17),
  `ATUNED-creative-innovation-brief.md`, `CREATIVE-BRIEF-voice.md`, `COPY.md`,
  `PLAN.md`, `TASKS.md` (owner rulings are quoted there, by round).

## Fixed rulings (do not argue these, build the skin around them)
- No em dashes anywhere. Sentence case. No soft wellness language. Short, mechanical,
  precise sentences, physical metaphors. Muted palette argued from autonomic response.
  Icons are rings, not fills (theme "Punch" is the exception). 112 is the node count.
- The loop is discover, play, flow, embody, and it is a circle, never a list.
- The avatar is the centrepiece. The content chain: journal -> imprints -> a story to
  release, a practice in the ritual, sometimes an affirmation.
- The app opens on the Field. Login A (ring) comes first. Account after the first release.
- Vitality yellow, Awareness indigo, Will blue. CQ and DQ as one two-colour bar.
- One HTML file, no dependencies, no network. A skin must live inside that.
- Never renumber tab integers.

## Report format (each seat, each pass)
- Plain words, short sentences, bullets. A term of art gets its meaning in the same
  sentence. Explain it as if to a ten year old, but do not talk down.
- First line: `GRADE: NN/100` for your discipline, then a table of 6 to 10 criteria
  each scored 0 to 10 with one line of evidence (a file, a screenshot name, a number).
- Then: THE SOUL (one paragraph: what this product is for your discipline's eye),
  WHAT BREAKS COHERENCE (ranked, each with where it is and what it costs),
  SKIN RECOMMENDATIONS (reskin: tokens, type, colour, shape, motion, copy; each
  with effort S/M/L and which ICPs it moves), REDESIGN CANDIDATES (only if the gain in
  consistency is dramatic, say why a skin cannot do it), RISKS.
- Be honest. A generous grade that hides a defect is a defect. Measure, do not guess:
  count the distinct font sizes, colours, radii, icon styles you can verify in source.
- Under 1500 words. No em dashes. Write only your own file.
