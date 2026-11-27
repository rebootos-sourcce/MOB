---
name: atuned-animation
description: The twelve Disney animation principles (Thomas & Johnston, "The Illusion of Life," 1981), reconciled with this product's own motion rulings and reduced-motion floor. Load before writing or reviewing any motion, easing curve, transition or effect in atuned_src/ui/uni.js, the boot sheet, the Field's particle/torus work, or any surface the owner calls static or dull. Pairs with the animation-vfx-director agent, which owns this domain.
---

# The twelve principles, and where this product already keeps or breaks them

Source: Frank Thomas and Ollie Johnston, *The Illusion of Life: Disney
Animation* (Abbeville Press, 1981), chapter "The Principles of Animation,"
the chapter that first named and ordered the twelve. Lance supplied the real
text of this chapter on 12 November, replacing a thin third-party (Bookey)
summary this skill ran on until then. Everything below the chapter's own
material (the anecdotes, the quotes, the named animators and shorts) is read
off that real text; it is an OCR scan with scattered caption noise and no
legible page numbers, so citations below name the principle's section in
that chapter rather than a page. Where the book's own material runs thin for
a principle, that is said plainly rather than padded.

**The floor every principle below sits under: `rbStill()` wins.**
`atuned_src/ui/component.js:683`. `rbStill()` is true when the OS's
`prefers-reduced-motion` is set or the body carries `.quiet`/`.rm`. No
principle below licenses an animation that ignores it. `atuned_src/ui/uni.js`
already does this correctly (`uniStill()`, fixed 12 November after it crashed
the funnel's standalone pages by calling `rbStill()` without a fallback, see
CLAUDE.md). Any new motion work checks `rbStill()`/`uniStill()` the same way,
and a gate exists for exactly this: `tests/design.js` watches reduced motion,
`tests/boot.js` watches the boot sheet's own fade under it.

## 1. Squash and stretch
The book's own name for this: "by far the most important discovery." Its
own worked case is the bouncing-ball test every beginning animator drew: a
plain circle, dropped and bounced, elongated in the fast part of the fall so
the eye can follow it, then flattened on contact for a solid hit and a
believable spring back up. Thomas and Johnston are explicit that getting
the timing of that flattened drawing wrong (holding it an extra frame or
two) turns a bounce into a hop, or into what they call "an injured rabbit,
or an angry grasshopper." Their other anchor is the half-filled flour sack:
dropped, it squashes to its fullest shape; picked up by the corners, it
stretches to its longest; it never changes volume. That volume-constant
rule, not a generic "squish it," is the actual test, and it is why they
distrust "little interior lines" that try to fake a deformation the whole
shape should already be carrying. This product has no squash-and-stretch
character rig; the nearest equivalent is Uni's pose fields in
`atuned_src/ui/uni.js` (`EMO_FIELDS`, `CHILD_EMOTIONS`) which blend
hue/sat/val/dur/rings by emotion rather than deforming a mesh. Open: a
literal squash/stretch has never been ruled in or out for her, and if it
ever is, the flour-sack constant-volume test is the real bar, not "make it
wobble."

## 2. Anticipation
The book's case: Oswald the Lucky Rabbit reaching into his pocket for a
sandwich. Walt's correction, which the authors call "aiming," was to make
Oswald's whole body commit to that reach (the head cannot be looking
elsewhere) so no one in the audience has to ask afterward, "Now where did he
ever get that sandwich?" Their wider claim is that almost nothing in real
life moves without it: the golfer's backswing, the pitcher's windup, "a man
runs, he crouches low, gathering himself like a spring." And the reverse
case proves the rule: a surprise gag only lands because the audience was
anticipating something else first, so the "surprise gag cannot work if a
different action has not been anticipated." `uni.js`'s `triggerReaction()`/
`spawnRing()` do the opposite of this today, a reaction fires and resolves
with no wind-up beat first. Worth a look next time her reaction feels
sudden rather than alive; the Oswald test for that fix is not "add a pause"
but "does the whole figure commit to the coming action, out where it can be
seen."

## 3. Staging
The book's own definition: "the presentation of any idea so that it is
completely and unmistakably clear," decided first by the story point (what
is this moment for) before any drawing is made. Its clearest worked case is
a constraint, not a choice: Mickey's whole body was solid black, with no
gray to separate a hand from a chest, so "there was no way to stage an
action except in silhouette." Walt's own instruction, quoted directly:
"Work in silhouette so that everything can be seen clearly. Don't have a
hand come over a face so that you can't see what's happening." Director
Dave Hand's reasoning for staying close with the camera: "By its use we are
able to eliminate from the mind of the audience anything that is less
important than the particular point we are putting over at the time." The
book names two specific scenes built on this: animator Fred Moore's Dopey
balancing an umbrella on a slice of toast in *Snow White* (one gag, held
until it resolves, nothing else competing for the eye), and Art Babbitt's
Minnie Mouse in *The Country Cousin*, caricatured broadly but always
readable as feminine because nothing else is asked of the silhouette at the
same time. This is already a live product ruling under a different name:
CLAUDE.md's "one word per concept" and the cognitive-load floor in
`atuned-ux` are staging rules for UI rather than a character, and the
silhouette test translates directly: if the screen went flat black, would
the one thing it is for still read.

## 4. Straight ahead action vs. pose to pose
The book's own distinction: straight ahead is drawn start to end with no
fixed plan, "the animator should be as surprised as anyone at the way it
comes out"; pose to pose plans the key positions first and fills in between
them. Their own case against straight ahead alone: an animator drew a dog
jumping and turning with real spirit, but it was unusable because he never
fixed how high the dog was jumping against a perspective background, so the
drawings didn't match the layout. Their case for pose to pose: Mickey
Mouse's discouraged walk-off (hands in pockets, a look back, a kick at a
stone) has to be pose to pose because each position carries meaning and must
be "worked over separately and together" before it is ever inbetweened. In
practice the book says both are usually combined, straight-ahead's
spontaneity kept on a leash by a pose-to-pose path of action underneath it.
`uni.js`'s render loop (`frame()`, driven by `requestAnimationFrame`) is
straight ahead by construction, every frame computed live from current
state, nothing keyframed between two planned poses. That is the right
choice for a reactive face answering live data (coherence, DQ, emotion) on
every frame; a pose-to-pose approach would need pre-authored key states,
which nothing in this codebase currently stores, and the dog-jump failure
is the warning for why: a straight-ahead system that ever needs to hit a
fixed external mark (a specific pixel, a specific other element) is the
case this principle says will break.

## 5. Follow through and overlapping action
The book splits this into five real cases, and names Walt's own complaint
that started it: "Things don't come to a stop all at once, guys; first
there's one part and then another." Case one: a tail, long ears or a coat
keep moving after the body stops. Case two: the body itself doesn't arrive
all at once, "Peg Leg Pete's belly continued to bounce and sag
interminably" after the rest of him has stopped. Case three, which they
name "drag": loose flesh (Donald's body, "almost all of Goofy") trails the
skeleton at a slower speed, done well enough to be "scarcely detectable" as
it plays, done broadly enough for a gag to become the skeleton literally
running off and leaving the flesh behind. Case four is the one with the
clearest lesson for a reactive UI: how an action ends tells the audience
more than the action itself, "a golfer takes a mighty swing, which covers
only a few frames, but what happens to him afterward can easily take five
feet of film and is much more revealing." Case five is the Moving Hold: a
pose held on screen for eight to sixteen frames goes flat and dead if held
perfectly still, so two drawings are made instead, "you hit the pose, then
drift on beyond to an even stronger pose... but essentially he's still in
his pose," keeping it alive without breaking the hold. `uni.js`'s
`chakraPulses` array (`spawnChakraPulse`, `CHAKRA_PULSE_LIFE=1.3`) is the
nearest real example of case one or two: a pulse fires, ages out over 1.3s
independently of whatever else is happening on her face, and up to two
queue rather than snapping to one. The per-seat callable entry point
(`window.Uni.pulseChakra`, task #138) rides the same queue, so this
principle already holds for callers that did not write the original
trigger. Case four (the follow-through as the real payload, not the swing
itself) is unbuilt: nothing in `uni.js` currently treats the end of a
reaction as more communicative than its onset.

## 6. Slow in and slow out
The book's own mechanic: key poses ("extremes") are drawn and refined first,
then the inbetween drawings are packed close to each extreme with only one
fleeting drawing at the midpoint, so the character "zips" from one attitude
to the next rather than crawling evenly between them. Their own caution:
"too much of this gave a mechanical feel to the action, robbing the scene of
the very life that was being sought." Walt's standing demand behind it,
quoted directly: "Our work must have a foundation of fact in order to have
sincerity. The most hilarious comedy is always based on things actual."
`atuned_src/ui/component.js:684`, `rbE3(x)` is a cubic ease-out already used
project-wide, which is this principle in its modern form. Any new tween
reaches for the same easing rather than a linear one; a linear motion in
this product is close to always wrong, the one exception being a progress
fill whose rate is meant to read as literal elapsed time (`atuned-ux`'s
progress-indicator floor), exactly the book's own warning that overusing
the extremes-hugging timing mechanizes something that should read as
literal and even.

## 7. Arcs
The book's claim is anatomical, not decorative: "very few living organisms
are capable of moves that have a mechanical in and out or up and down
precision," a woodpecker named as close to the one exception, and "the
movements of most living creatures will follow a slightly circular path."
Their worked case is a pointing hand: the animator charts the path of the
gesture as a real arc and places inbetweens along that curve, and the book
is blunt that this is one of the hardest things to get an inbetweener to
actually do, "there is a strong inclination to pull back toward a more
normal inbetween," enough that studio sheets carried the standing warning
"Watch arcs!" `uni.js`'s eye-travel spring (the `mouseX`/`mouseY` easing
toward a gaze target, `setGaze`) already arcs because it is a spring toward
a target rather than a linear slide; a future mover (an icon travelling
screen to screen, a card settling into a grid slot) should arc the same
way rather than translate in a straight line, and "Watch arcs!" is the real
warning for why a straight-line tween that looks fine in isolation can
still read as mechanical once it moves alongside anything alive.

## 8. Secondary action
The book's definition: a smaller action that supports the primary one and
is "always kept subordinate to it"; "if it conflicts or becomes more
interesting or dominating in any way, it is either the wrong choice or is
staged improperly." Their worked case: a sad figure wiping a tear as he
turns away, where the hand's gesture has to be sized so it never covers the
expression it is meant to support, too broad and the face is lost, too
subdued and the gesture reads as nothing. Their own process for getting the
balance right, from "one animator": a building-block method, animate the
primary action fully first, then pass back through the same scene animating
only the secondary action against it, then a third pass if needed, until
the two read as one unified statement rather than two competing ones. The
chakra pulse (#5 above) is also this: it never drives her main emotional
pose, it rides alongside it. A secondary action that pulls focus from the
primary read is a staging failure (#3), not a secondary action, exactly the
book's own test: if the secondary action becomes the thing a viewer notices
first, it was staged wrong, not merely subordinate.

## 9. Timing and spacing
The book's own proof of how much timing alone carries meaning: the same two
extreme head-tilt drawings, inbetweened with zero drawings between them
reads as "hit by a tremendous force"; add one inbetween and it reads as hit
by a brick or a frying pan; by seven or eight inbetweens the same two
extremes read as someone "searching for the peanut butter on the kitchen
shelf." Nothing about the drawings changed; only the count and spacing of
the inbetweens did. Their other real distinction is "ones" versus "twos"
(one exposure per drawing versus two): most normal motion could run on
twos and the audience would never detect it, saving enormous work, but any
camera pan or any point of contact with the background had to run on ones
or the image would visibly slip. Every duration constant in `uni.js`
(`CHAKRA_PULSE_LIFE`, `emoDur`-derived durations in `setEmotionIntensity`)
is a timing decision in exactly this sense, the book's own head-tilt example
is the reminder that changing a feel is a timing-constant change, not a new
mechanism, until proven otherwise, and the exact same spacing numbers can
read as completely different states depending only on how they're counted.

## 10. Exaggeration
**This is the one principle that collides with a standing ruling rather than
sliding in under it.** The book's own resolution of a real internal
confusion is worth keeping whole: Walt asked for more realism, then
criticized results for not being exaggerated enough, and animators thought
the two were opposites until one of them worked it out: "I don't think he
meant 'realism.' I think he meant something that was more convincing...
because 'real' things do." Their fullest worked case is director Dave
Hand's test of Mickey's taxicab blowing a tire: Hand staged a believable
gag, Walt rejected it as not broad enough, and this happened six times in a
row, "erasing and redrawing until he was nearly through the paper." Hand's
own account of what broke the deadlock: "The only thing I knew to do was to
do something he wouldn't take, to make it so extreme that he would say, 'I
didn't mean that much!' So I went back and did something horribly
distorted... Walt came and ran it a few times, then stepped back and
looked at me... he said, 'There, Dave, that's just what I wanted!'" Hand's
own lesson from it: as a director he later told his own animators, "Will
you make it so extreme that you make me mad?" CLAUDE.md's voice rules call
for "mechanical and precise, no soft wellness language," and the product's
whole visual register (muted palette, ring not fill, Punch theme aside) is
built to under-state rather than exaggerate. The book's own distinction
(exaggeration as motion-weight, "make him sadder... brighter... wilder,"
never as distortion for its own sake) is not the same axis as the
copy-voice restraint CLAUDE.md rules on, but anyone reaching for this
principle should name which register they are exaggerating in, since the
two can look like a contradiction from the outside. Not yet ruled which of
Uni's motions, if any, are meant to read as exaggerated versus literal, and
Hand's taxicab story is the real test to apply if that is ever ruled on:
not "is this bigger" but "does this make the real feeling land, the way the
quiet version did not."

## 11. Solid drawing
The book's own floor, posted on studio walls for trainees: "Does your
drawing have weight, depth and balance?" and its own named failure mode is
"twins," both arms or both legs drawn parallel and doing exactly the same
thing, which the book says "no one draws on purpose" and which animator Ron
Clements, decades later, still found creeping into his own work "no matter
how hard he worked to keep them out." Their own resolving concept is
"plastic" versus "static": a shape with volume that is still flexible,
"capable of being shaped or formed, pliable," illustrated by a bent pipe or
hose, which has no chance at solidity because its outline is two parallel
lines no matter how it bends, against a fleshed-out form that is plastic
because its two sides are never symmetrical, one side straight while the
other "bellies out with the relaxed weight." Nearest equivalent here:
`atuned-anatomy`'s landmark-and-proportion method for the body map, and the
Field's torus/auric-field math (`engine/charfield.js`, `auricField()`) which
is explicitly trying to keep one coherent volumetric read (a field that
dims and compresses with charge) rather than a flat decal. The open
play-layers-energy-system thread (inverse-square falloff, dominant-seat
auric color) is solid-drawing work in this sense, making a flat-feeling
overlay read as one real volume, and the twins warning is a real, checkable
failure mode for it: a symmetric field with no asymmetry at all is the
"static" failure the book names, not a stylistic choice.

## 12. Appeal
The book is explicit that this is not cuteness: "the word is often
misinterpreted to suggest cuddly bunnies and soft kittens. To us, it meant
anything that a person likes to see, a quality of charm, pleasing design,
simplicity, communication, and magnetism." Their own proof that appeal and
likability are different things: "a villainess, even though chilling and
dramatic, should have appeal; otherwise, you will not want to watch what
she is doing," while "the ugly and repulsive may capture your gaze, but
there will be... no story strength." Their own diagnosis of what kills it:
"a weak drawing lacks appeal. A drawing that is complicated or hard to read
lacks appeal. Poor design, clumsy shapes, awkward moves, all are low on
appeal." Owned by the art director and the UI/UX skill's own floors
(`atuned-ux`), not restated here; the villainess test is the one worth
carrying into any grading question on this product, since "is this
appealing" and "is this likable" are not the same question, and a reading
that lands hard (a complex, a saboteur, a hard truth about a pattern) should
still be clear, well-composed and worth looking at even when what it says
is not comfortable.

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
