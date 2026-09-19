# The build plan

## State

    BLOCK  1 summary          DONE   3990px to 2892, plate, reading has a home,
                                     everything structural right, output row
    BLOCK  2 field look dev   PART   chords carry weight and susceptibility,
                                     60fps, thresholds down. Scale and the
                                     travelling charge remain
    BLOCK  3 compass look dev DONE   flat toggle, six axis arrows, Dante
                                     layers, oscillation over 30/90/365
    BLOCK  4 knowledge        OPEN
    BLOCK  5 two lightings    OPEN
    BLOCK  6 story + release  OPEN
    BLOCK  7 tools scrub      OPEN
    BLOCK  8 body             OPEN
    BLOCK  9 intake           OPEN
    BLOCK 10 games            PART   its own tab again. The games themselves open
    BLOCK 11 onboarding       OPEN
    BLOCK 12 the ladder       OPEN
    BLOCK 13 intro variants   OPEN
    BLOCK 14 motion system    OPEN
    BLOCK 15 simulations      OPEN


Written because the owner asked for the list in blocks, after finding that a
mountain of work sat queued while small fixes shipped. That is a fair reading
of what happened and this is the correction.

Every block below is verified against the code, not against memory. Sizes are
honest against this codebase. Dependencies are named. Nothing here is
started unless it says so.

**The rule for this plan:** a block is not done when the code is written. It
is done when the four gates are green, a screenshot has been looked at, and
the thing it was asked for is visibly true on screen.

---

## BLOCK 1. The summary. Named four times, still wrong.

**Verified state.** `sumFull` renders glance, then story and structure side by
side, then the spiritual layer, then numerology. Exactly the order he
described as broken: the blueprint stack, the chain beneath it, numerology at
the bottom. The reading paragraph has no container, so it is text on the page
ground. 3990px tall, 115 interactive elements, the person's name first
appearing 1.9 screens down inside a numerology sentence.

**Build.**
1. The plate. First name at display size, the band and the direction out of
   it beside it. Full bleed, no box.
2. The reading gets a home: a display panel with its own ground, its own
   edge, and room around it. This is the "text field behind the text".
3. Everything structural moves to the right column: blueprint, primary,
   secondary, masks, expression, soul urge, numerology. The centre carries
   the reading and nothing else.
4. Moral integrity as its own block, which he asked for by name and which
   needs no new arithmetic.
5. The output row: the protocol this state calls for, the release the field
   calls for, the next marker. The block the page has none of.
6. Analytics leaves Summary entirely and becomes its own tool with its own
   header.

**Size.** Large. `ui/summary.js` is a rewrite, `shell/head.html` gains a
layout.
**Depends on.** Nothing.
**Proof.** Under 40 interactive elements at rest, under two screens tall, the
name first thing on the page.

---

## BLOCK 2. Look development, the Field.

**Verified state.** The drawn disc is 26 percent of its own canvas and 16
percent of its column. Chords now carry weight and susceptibility, which
landed this session. Everything else is unchanged.

**Build.**
1. Scale the wheel into its column. It is a small object in a large empty
   room and no amount of motion fixes that.
2. The travelling charge: one charge per chord moving inward, period set by
   weight. Turns the diagram into a circuit.
3. Ease the zoom over 260ms, which makes all five reveal ramps dissolve
   instead of snap, for free, because they all read S.zoom.
4. Pull the reveal thresholds down so the symbols land while the ring is
   still in frame. **Needs a ruling: this changes what a depth means.**
5. The core breathes properly. Currently plus or minus 1.29px on a 25.7px
   radius, which is under the threshold at which a human reads movement.

**Size.** Large.
**Depends on.** Item 4 needs the owner.

---

## BLOCK 3. Look development, the compass. Graded D trending D plus.

**Verified state.** Halo, pitchfork, ego compression, the oscillating band and
the souls landed. None of the look development did.

**Build.**
1. Oscillation over time, lower left: 30 day, quarter, annual, so a person
   can see whether they are improving.
2. The six axis arrows. Three that up regulate and three that down regulate,
   which is the nervous system and the spine composited onto the figure as
   toggleable overlays.
3. A symbol for every character, Jesus through Lucifer.
4. Selecting a character shows their story and their polar opposite, because
   the whole point of the compass is two paths of one behaviour.
5. A layers button, with Dante's Inferno and Paradiso as the reading of what
   compression over time looks like.
6. A flat 2D version on a button, beside the spinning one.
7. The figure scaled to 78 percent of the frame, labels haloed so they stop
   colliding with the mesh they annotate.

**Size.** Large. This is the biggest single surface rebuild on the list.
**Depends on.** Nothing.

---

## BLOCK 4. Look development, the knowledge base.

**Verified state.** It is a deck of cards now, which is a structural
improvement and not look development. It still looks nothing like the rest of
the product.

**Build.**
1. Where is the stack, the universal laws, coherence. Three decks that do not
   exist.
2. The 27 named things with no icon: all 21 laws and all 6 masks. This is why
   zooming resolves into geometry rather than into language, and it is a
   standing Bible violation.
3. One stroke weight across the product. Eleven distinct weights were
   measured in one screenful, 1px to 3.5px.
4. Make it feel like the codex: a special place, not a reference.

**Size.** Medium, plus 27 icons which is its own afternoon.

---

## BLOCK 5. Six versions of the look.

**Verified state.** Four lightings exist: Dark, Snow, Punch, Glass.

**Build.**
5. Glass on white.
6. Flat colour. Super futuristic, high end, less beveled than anything here
   now.

**Size.** Medium each. Gate 9 proves each lighting is genuinely its own.

---

## BLOCK 6. The story, the release, and a standalone release tab.

**Verified state.** The story is two columns: write on the left, imprints on
the right. The release runs as an overlay from `relPick`. There is no release
tab.

**Build.**
1. Split the right column in two, each half scrolling on its own. Imprints on
   top, the release and all its settings on the bottom.
2. The settings: how many patterns, how long, how quick, and which ones.
3. Run a release from there without leaving the story.
4. Then the standalone release tab carrying the same two halves.

**Size.** Medium.

---

## BLOCK 7. The tools scrub.

**Verified state.** Eighteen readings the engine computes and no surface
draws. Seven have zero callers anywhere in the UI: `pathOf`, `markersFor`,
`boundaryCross`, `equivOf`, `verpShare`, `r.steer`, `CASCADE`.

**Build.** Read the whole Mechanics of Being content and the whole engine, and
answer the question properly: what could a person see about themselves that
this instrument already knows and never says. Then expose the top ten in the
left rail.

**Size.** Medium to build, and the reading comes first.

---

## BLOCK 8. The body.

**Verified state.** The chakra image he supplied is unused. The pain map is
region buttons. The heat is blooms at seven points on an outline.

**Build.**
1. Use the chakra image.
2. Selecting head, throat or shoulders zooms to that location.
3. The pain map starts blank and is paint to select. `NERVEBR` is 72 traced
   polylines in the figure's coordinate space, already tagged by seat: it is
   the hit geometry and it is already in the file.
4. The Nummenmaa treatment for the heat: a continuous field across a filled
   silhouette with a diverging scale, rather than blooms at seven points on
   an outline. This is why his zones are not noticeable.
5. From a painted region: what is going on there, the story associated with
   it, and release it.

**Size.** Large.
**Depends on.** Storing imprint node ids per story entry, which is one
additive field, for step 5.

---

## BLOCK 9. The intake.

**Build.** The redesign, the Ultima style moral dilemma questions, the nine
child emotion questions, every question exposed in the centre rather than the
rail, and the three copy failures: what a person is meant to do with the
fetters, what "fear towards trust" means, and what the matrix is for.

**Size.** Large.

---

## BLOCK 10. Games.

**Build.** A game development director with thirty years of mobile
experience owns it: structure, the game design document, art direction, two
games, and how they work into the point and badge system.

**Size.** Large.
**Blocked on a ruling.** Games as their own tab puts the bar back to eight
and reverses the earlier fold that put them inside Knowledge.

---

## BLOCK 11. Onboarding and the tutorial.

**Build.** The welcome, the why, the story loop, how mindset programming
works, the geometric nature of behaviour, the release protocol, the tools.
Warm and inviting. The tutorial turns off once seen. Maximum flow and
retention with no burden, while still capturing enough for CQ and the
energetics.

**Size.** Large.
**Depends on.** Block 1, because onboarding ends on the summary.

---

## BLOCK 12. The ladder.

**Build.** Badges, achievements, score, the ritual builder and the
accountability tracker from the original Atüned app, and how they fit
together.

**Size.** Large.

---

## BLOCK 13. The intro, three versions.

**Verified state.** Five seconds, black bookends, twelve principles, a skip.
One version.

**Build.** Three dramatically different versions, simulated twenty times.
Line weight, effects, colour, the feeling of being invited to something new,
clever ease in and ease out, anticipation, timing, staging. The material is
there: the halo, the soul, the pitchfork, the geometric nature of the soul.

**Size.** Medium each.

---

## BLOCK 14. The motion system.

**Build.** Three easing tokens and four duration tokens, then replace
`transition: all` on 323 elements. The house curve is in the stylesheet and on
zero live elements: 382 of 384 animated elements use the browser default.
`n.disp` is frame rate bound and settles in half the time on a 120Hz panel.
Readings change in zero frames. Tab change is a hard cut. The Body has 144
SVG nodes and none of them move.

**Size.** Medium. Touches everything, breaks nothing.

---

## BLOCK 15. The simulations.

**Build.** Day one to day thirty against the ICPs and the focus group.
Onboarding, the tutorial, the story journal, Source AI, imprints and release.
Sign ups, tier changes, drop off, acquisition cost. The three closing
questions asked in the form that produces behaviour rather than opinion.

**Size.** Large.
**Depends on.** Blocks 1, 6, 11 existing to be simulated.

---

## The order I would build them

**First, because everything is judged through them:** 1 summary, 2 field,
3 compass. These are the three surfaces he has graded and the three he looks
at.

**Then, because they are cheap and they lift every screen at once:** 14
motion system, 4 knowledge base, 5 the two lightings.

**Then the mechanics:** 6 story and release, 7 the tools, 8 the body.

**Then the product:** 9 intake, 11 onboarding, 12 the ladder, 10 games.

**Then:** 13 intro variants, 15 simulations.

## What I need a ruling on before starting

1. **Games as their own tab.** It puts the bar back to eight and reverses the
   fold.
2. **The zoom reveal thresholds.** Pulling them down changes what a depth
   means, not only when it appears.
3. **Summary structure:** everything structural on the right, or above the
   reading. He said both in one sentence and they are different layouts.
