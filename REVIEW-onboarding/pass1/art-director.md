# Pass 1, art director: the onboarding and tutorial (round PJ)

Mika, with Sol (colour, light), Bjorn (type, grid), Petra (composition, symbol). Looked at the build shots, the login and ring mockups in `mockups/onboarding/png/`, `ui/onboard.js`, `ui/tutorial.js` and `.ob-*` at `shell/head.html:6244-6383`.

Gap: `1600-tut-0.png` and `390-tut-0.png` show the bare Field, not the tutorial. I graded the tutorial from source. Redo the capture before pass 3.

GRADE: 38/100

| Criterion | /10 | Evidence |
|---|---|---|
| Squint (where the eye lands) | 4 | Brightest object on the welcome is the "Come in" button (accent on panel 7.8 to 1). The figure comes third. The order should be figure, line, action. |
| Composition | 4 | At 1600 the card is 560 by 436, which is 15% of the screen. The other 85% is the app at about 6% brightness, still readable as nav and padlocks. |
| Colour as response | 5 | Seat hues are right in idea, but the wash scatters all seven into the card corners (`head.html:6263`) at 55% opacity, blurred 30px. Hue means place on the body here, not decoration. |
| Light | 3 | No single source. Card ground `#1A1D26` on a scrim of 94% near black is about 1.2 to 1 apart, so the edge (9% white) does all the work. |
| Type | 5 | One face, good. But sizes are 24, 15, 13.5 and about 11 for the eyebrow, a ratio of 1.6 from headline to body on a 1600 screen. The signal test is 108 words on one card in five paragraphs. |
| Shape language | 3 | Rounded rectangle, 14px radius, pill buttons, 6px dots. That is the grammar of a cookie banner. The product's own grammar is ring, arc and tick. |
| Relation to Field and avatar | 3 | The welcome says "This is you" over a column of dots that is not the avatar and not the Field's wheel. |
| Pacing and motion | 3 | Nothing moves on its own except a 30 second wash drift. Four dots mark steps that have no time in them. |

Contrast, measured against each element's own ground. Body `--mid` on panel 7.8 to 1, `--dim` 5.3 to 1, so the text passes. The inactive dot is `--edge-2` (14% white) on panel at 1.55 to 1, and it is a 6px target, so the progress mark fails the 3 to 1 floor for UI parts. Tap targets are fine (44px).

## THE SOUL
A ring that is also a clock: login A (tick ring, concentric arcs), the boot figure assembling root to crown, the Field wheel. Dark case, one cool light, seven small seat colours. The mockups `onb-01-start-1600.png` (twelve starting points on a ring) and `tut-01-loop-1600.png` (the loop as a real circle) already hold it. The shipped build kept none of it.

## WHY THE OWNER REJECTS IT (my reading, with the evidence)
- **Sol:** a dialog over a dimmed app. A stranger leaves the ring login and lands in a grey box with the real product's clutter ghosting behind it. The light has no source, so nothing glows and nothing welcomes.
- **Petra:** the shape changes between screen 1 and 2. Login is the instrument, onboarding is a SaaS modal, so the first lesson is that they are two products. Defects: the watermark figure (`.ob-fig-wm`, 7% opacity, 64% wide) is a second figure at another scale, so `1600-ob-0.png` shows three grey dots below the Root dot (y 546, 582, 618). The signal test Next renders as a 66px disc beside 44px pills (`1600-ob-3.png`).
- **Bjorn:** text is the hero on every card, so a person reads instead of arriving. Eyebrows print in Start Case ("The Signal Test"), against the sentence case rule. Dots sit under the buttons, so progress is read last.
- **Mika:** it asks him to press. Six named buttons (Come in, Not now, Try one thing, Back, Next, Go in) plus Yes, No, Nothing. A title sequence has no buttons because the pace is the control.

## WHAT BREAKS
1. **The welcome figure is not the avatar.** `obFigure()` draws seven dots on a line at 168px. "This is you" is a claim the picture does not make.
2. **Ghost figure** double image (above).
3. **Seat palette mismatch.** Shipped `PAL` at `engine/data/canon.js:261` is `#D6524C #D8924E #DABF6A #5FD5A6 #5EBBDB #7D93E0 #A77EDB`. The canon I hold is `#C4635E #D19255 #D4BC70 #6FC5A3 #65B8D4 #8296DB #A98BCE`. Saturation, shipped vs canon: Root 63% vs 46%, Heart 58% vs 43%, Crown 56% vs 41%. Saturation decides whether a surface reads calm, and the boot and the wash use the louder set. Systems and Brand must say which is ruled. My decision here: canon, because a full-screen dark stage multiplies saturation.
4. **Dots do nothing.** Off state 1.55 to 1, no time in them.
5. **Signal test is a paragraph.** The ten-breath action hides inside the explanation, same type.
6. **390:** the card is 90% of screen height (756 of 844, `390-ob-1.png`), Back wraps to its own row (`390-ob-3.png`). A page pretending to be a card.
7. **Tutorial** (from source): five text cards, a textarea in a modal, Continue disabled until typed, the loop never drawn as a circle against the standing ruling.

## RECOMMENDATIONS FOR THE NEW ONBOARDING
Name: **the stage**. One full-bleed black screen, no card, no dimmed app behind it. It is the login's ring world continued, so login to onboarding to first release is one room.

**R1. The stage (M).** Ground `--bg #0C0D12`, nothing else on it. Centre the figure at 38% of height on 1600, 32% on 390 (figure 40vmin). Text sits below the figure, never over it. Ink `--ink #EFEDE8` on stage is about 16 to 1. Squint order: figure, one line, nothing. ICPs moved: phone only arrival, skeptic.

**R2. One light.** The light comes from the root seat and climbs. Slide 1 lights the seven seats root to crown at 140ms stagger (0.98s total, curve `--ease-enter` `cubic-bezier(.33,1,.68,1)`). A single radial glow, 8% alpha, 60px blur, in the colour of the seat currently lit, never seven at once. Replace the corner wash. (S, Sol). ICPs moved: acute distress, skeptic.

**R3. The timer is a ring, not dots (M, Petra).** One thin arc, 1.5px, accent `#7EB8D4` at 60%, around the figure. It sweeps once per slide, and 8 tick marks (the login's tick language) fill as slides pass. Held means the sweep freezes and the arc goes to 100% brightness. Ring, not fill, per the house rule. Replaces the dots, 1.55 to 1 becomes 5 to 1 or better.

**R4. Type (S, Bjorn).** Inter variable, three sizes only. Hero line weight 300, 52px/1.15 at 1600, 30px/1.2 at 390, max 3 lines, max 22ch per line. Support line 18px/1.5 `--mid`. Eyebrow 12px weight 500, sentence case, `--dim` (6.1 to 1 on `#0C0D12`). Remove the `text-transform` that makes Start Case. One idea per slide, 14 words maximum on the hero.

**R5. Pace per slide (M).** Reading time plus breath: `dwell = max(3.4s, 1.2s + words / 3.2)`. Slide 1 (figure, "This is you, and it is okay.") 5.0s. Slide 2 ("No judgment. Nothing here grades you. This one is for you.") 5.5s. Slide 3 ("Most of the stress we call normal is making us sick.") 4.5s. Slide 4 (the loop, drawn as a circle, four stations light in order at 1.2s each, "Discover. Play. Flow. Embody. Then again.") 7s. Slide 5 (somatic line, ruled: "Welcome to a neurosomatic experience. Awareness and intuition is a tool we use to turn your senses inward.") 8s. Total about 30s before the one action.

**R6. The signal test as a paced scene (M, Petra).** No paragraph. Four timed beats: "Sit. Feet on the floor." 5s; "Bring your attention to your throat." 5s; "Think yes. Ten times." with ten ticks lighting one per 1.2s (12s); "Now no. Ten times." 12s. Then "Did they feel different?" with three ring chips (Yes, No, Nothing), the only slide that waits, and a tap advances after 600ms with no Next button. If nothing is tapped it records nothing, not "Nothing", because an unanswered question must not be answered for a person.

**R7. Controls that earn their place (S).** Press and hold anywhere for more than 180ms freezes it. Tap right two thirds goes on, left third goes back. Visible: a quiet "Skip" bottom left, 12px, 44px target, and a ring sound icon bottom right, off by default. Sound on plays his recorded voice (`audio/atuned-opening.wav`, 49.7s, phrases in the timing JSON) on the release screen, where his ruling already puts it, not here. Reduced motion: keep the timer (it is not motion) but lengthen every dwell by 1.5x, replace the draw and sweep with a 200ms crossfade, freeze the breath. A pause control must exist because a timer over 5 seconds needs one.

**R8. The handoff (M).** The last slide is the ring of twelve starting points (the mockup `onb-01`), which waits, because it is the one real decision. Choosing one contracts the ring into the figure with that seat lit (380ms, `--ease-enter`), then the writing stage opens. No button wall. ICPs moved: practitioner (sees the structure), phone only (one thumb).

**R9. The tutorial (L).** Same stage. The loop as a circle, the person's own sentence travelling round it: Discover (the words that lit glow in their seat colour), Play, Flow, Embody, closing into a circle. No textarea in a modal, the writing uses release stage direction A.

**R10. 390 wide (S).** Full bleed 100dvh with safe area insets. Figure at the top 18%, text in the lower third, whole screen is the hold zone, Skip top left, no card, no Back button.

**Flagged to others:** the palette ruling (WHAT BREAKS 3), and the sniffer, which must watch the signal test for distress because there is no permanent safety line (a systems job).
