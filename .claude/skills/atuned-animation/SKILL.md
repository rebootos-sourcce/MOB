---
name: atuned-animation
description: The twelve Disney animation principles (Thomas & Johnston, "The Illusion of Life," 1981), reconciled with this product's own motion rulings and reduced-motion floor. Load before writing or reviewing any motion, easing curve, transition or effect in atuned_src/ui/uni.js, the boot sheet, the Field's particle/torus work, or any surface the owner calls static or dull. Pairs with the animation-vfx-director agent, which owns this domain.
---

# The twelve principles, and where this product already keeps or breaks them

Source: Frank Thomas and Ollie Johnston, *The Illusion of Life: Disney
Animation* (Abbeville Press, 1981), the twelve principles first set out in
that book and now standard across the field. The copy handed to this skill
on 12 November was a third-party app's (Bookey) free summary of the book,
not the original text — thin, generic, mostly its own upsell. Its list of
the twelve principles is independently verifiable against the standard,
widely cited set and is accurate; nothing below rests on that summary's own
prose, which added no craft detail the original book is actually known for.
Treat a request to go deeper on any one principle (the real book's own
worked examples, the specific pencil tests) as needing the real text, not
this file.

**The floor every principle below sits under: `rbStill()` wins.**
`atuned_src/ui/component.js:683` — `rbStill()` is true when the OS's
`prefers-reduced-motion` is set or the body carries `.quiet`/`.rm`. No
principle below licenses an animation that ignores it. `atuned_src/ui/uni.js`
already does this correctly (`uniStill()`, fixed 12 November after it crashed
the funnel's standalone pages by calling `rbStill()` without a fallback — see
CLAUDE.md). Any new motion work checks `rbStill()`/`uniStill()` the same way,
and a gate exists for exactly this: `tests/design.js` watches reduced motion,
`tests/boot.js` watches the boot sheet's own fade under it.

## 1. Squash and stretch
Weight and flexibility through deformation on impact or speed. This product
has no squash-and-stretch character rig; the nearest equivalent is Uni's
pose fields in `atuned_src/ui/uni.js` (`EMO_FIELDS`, `CHILD_EMOTIONS`) which
blend hue/sat/val/dur/rings by emotion rather than deforming a mesh. Open: a
literal squash/stretch has never been ruled in or out for her.

## 2. Anticipation
A small counter-move before the real one, so the audience reads what is
about to happen. `uni.js`'s `triggerReaction()`/`spawnRing()` do the opposite
of this today — a reaction fires and resolves with no wind-up beat first.
Worth a look next time her reaction feels sudden rather than alive.

## 3. Staging
One idea read clearly at a time; the eye is told where to look. This is
already a live product ruling under a different name: CLAUDE.md's "one word
per concept" and the cognitive-load floor in `atuned-ux` are staging rules
for UI rather than a character, and they are the ones this project is
actually held to. Kept in sync here, not re-ruled.

## 4. Straight ahead action vs. pose to pose
Draw-through-in-order vs. plan-the-key-poses-first. `uni.js`'s render loop
(`frame()`, driven by `requestAnimationFrame`) is straight-ahead by
construction — every frame computed live from current state, nothing
keyframed or eased between two planned poses. That is the right choice for a
reactive face that has to answer to live data (coherence, DQ, emotion) on
every frame; a pose-to-pose approach would need pre-authored key states,
which nothing in this codebase currently stores.

## 5. Follow through and overlapping action
Parts of a body keep moving, and settle at different rates, after the main
motion stops. `uni.js`'s `chakraPulses` array (`spawnChakraPulse`,
`CHAKRA_PULSE_LIFE=1.3`) is the nearest real example: a pulse fires, ages
out over 1.3s independently of whatever else is happening on her face, and
up to two queue rather than snapping to one. The per-seat callable entry
point (`window.Uni.pulseChakra`, task #138) rides the same queue, so this
principle already holds for callers that did not write the original trigger.

## 6. Slow in and slow out
Motion eases at the start and end rather than moving at constant speed.
`atuned_src/ui/component.js:684`, `rbE3(x)` — a cubic ease-out already used
project-wide. Any new tween reaches for the same easing rather than a linear
one; a linear motion in this product is close to always wrong, the one
exception being a progress fill whose rate is meant to read as literal
elapsed time (`atuned-ux`'s progress-indicator floor).

## 7. Arc
Natural motion follows a curve, not a straight line, because real joints
and gravity do not move in straight lines. `uni.js`'s eye-travel spring
(the `mouseX`/`mouseY` easing toward a gaze target, `setGaze`) already
arcs because it is a spring toward a target rather than a linear slide; a
future mover (an icon travelling screen to screen, a card settling into a
grid slot) should arc the same way rather than translate in a straight line.

## 8. Secondary action
A smaller supporting motion that enriches the main one without competing
with it. The chakra pulse (#5 above) is also this: it never drives her main
emotional pose, it rides alongside it. A secondary action that pulls focus
from the primary read is a staging failure (#3), not a secondary action.

## 9. Timing and spacing
How many frames an action takes, and how the in-between frames are spaced,
together set what an action feels like (heavy, light, sudden, dreamy).
Every duration constant in `uni.js` (`CHAKRA_PULSE_LIFE`, `emoDur`-derived
durations in `setEmotionIntensity`) is a timing decision already made once;
changing a feel is a timing-constant change, not a new mechanism, until
proven otherwise.

## 10. Exaggeration
Push a motion or expression further than strict realism to make it read
clearly. **This is the one principle that collides with a standing ruling
rather than sliding in under it.** CLAUDE.md's voice rules call for
"mechanical and precise, no soft wellness language," and the product's
whole visual register (muted palette, ring not fill, Punch theme aside) is
built to under-state rather than exaggerate. Exaggeration in the Disney
sense is a motion-weight tool (a bounce overshoots before it settles, a
reaction is 20% bigger than the real-world equivalent) and is not the same
axis as the copy-voice restraint CLAUDE.md rules on — but anyone reaching for
this principle should name which register they are exaggerating in, since
the two can look like a contradiction from the outside. Not yet ruled which
of Uni's motions, if any, are meant to read as exaggerated versus literal.

## 11. Solid drawing
Volume, weight and a consistent sense of 3D form even in 2D work. Nearest
equivalent here: `atuned-anatomy`'s landmark-and-proportion method for the
body map, and the Field's torus/auric-field math (`engine/charfield.js`,
`auricField()`) which is explicitly trying to keep one coherent volumetric
read (a field that dims and compresses with charge) rather than a flat
decal. The open play-layers-energy-system thread (inverse-square falloff,
dominant-seat auric color) is solid-drawing work in this sense: making a
flat-feeling overlay read as one real volume.

## 12. Appeal
Charisma and interest in a design, independent of conventional beauty.
Owned by the art director and the UI/UX skill's own floors
(`atuned-ux`), not restated here; this principle is the one most likely to
collide with a grading question ("is this appealing") rather than a code
check, and belongs with whoever is grading the look, not this file.

## Where this applies in the repo today

    atuned_src/ui/uni.js            her whole motion system; #5, #6, #7, #9 above are
                                     already load-bearing code there, named by location
    atuned_src/ui/component.js      rbStill(), rbE3() -- the floor and the one shared ease
    engine/charfield.js             auricField() -- #11's nearest real analogue
    the boot sheet (tests/boot.js)  a CSS fade under #6/#9, gated against a cut load
    the Field (not yet built)       the torus/auric overlay work named in #11

A surface this skill does not yet cover: anything the owner calls static or
dull on first look belongs to the animation-vfx-director agent first; this
file is the vocabulary and sourcing, not the judgment call on whether a given
surface needs motion at all.
