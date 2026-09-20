# Four Fields

Skunk works. Four treatments of the Field, simple to super complex, built as
four standalone runnable files and measured in a real browser. The brief was
the owner's: Iron Man for the effect, Pixar for the weight, the soul between
the two, and it has to still look right in ten years.

    Files        proto/field/one.html   Plumb        the simple end
                 proto/field/two.html   Atmosphere   the likely ship
                 proto/field/three.html Tissue       the magnificent one
                 proto/field/four.html  Console      the super complex end

    Profile      Diane, 46, founder, second company. Computed headless from
                 engine.js, not authored. Coherence 28.1 of 100, 8 of 112
                 addresses above the display line, 13 saboteurs, 4 complexes,
                 1 hyper complex. Console also carries Derek, 39, at 20 of 112
                 above the line and 53 objects on the chain, because a density
                 argument is only honest on the heaviest field.

    Measured     Chromium 1194, headless, file protocol, no network.
                 1600 by 1000 and 390 by 844.
                 WebGL renderer reported as ANGLE, Vulkan 1.3.0, SwiftShader
                 Device (Subzero), SwiftShader driver. That is a software
                 rasteriser on the CPU. Every figure for Tissue below is a
                 floor and not a ceiling, and this is said again where it
                 matters.

    Seats        Ines Halldors chaired. Mika Ueda-Salas, Anders Kjeld,
                 Priya Raghunathan, Dani Sorensen, Kai Moana, Rua Whitmore,
                 Yuki Brennan, June Okonkwo-Lund, Sol Amadi, Bjorn Haraldsson,
                 Petra Nikau, Ilse Coetzee-Nakamura, Rosa Iwasaki,
                 Camille Boucher, Ngozi Achebe-Lindgren, Noa Ferreira-Blake.

---

## THE DEBATE

Eighteen objections were raised and are recorded here with what happened to
each. Nine were conceded and changed the work. Five were overruled and the
losing argument is written out. Four are unresolved and became questions for
the owner. Where an objection was settled by a measurement, the measurement is
given.

### 1. Anders Kjeld. "Measure the shader before you argue for it."

His position was that a WebGL lighting is argued for on feel and paid for in
milliseconds, and that nobody in this room had ever put a clock on one in this
repository. Conceded before it was contested. Tissue now reads its own frame
time after a one pixel synchronous read back, because a timer wrapped round a
draw call measures the submit and not the work.

**Result, and it is the single most consequential number in this document.**
Tissue renders in **228 to 397 ms a frame** at 1600 by 1000, median across six
runs, into a 605 by 378 buffer at 0.55 scale. The spread is that wide because a
software rasteriser is CPU bound and shares the machine, which is itself part
of the finding. Atmosphere on the same machine at the same viewport renders in
**0.8 ms**, median, with a spread of 0.8 to 0.8 across the same six runs. That
is between two hundred and eighty and five hundred times.

The losing position was mine. I had assumed a fragment shader would come in at
a small multiple of a canvas pass. It does not, on this machine.

### 2. Priya Raghunathan. "It cannot carry the addresses as uniforms."

Her objection was concrete: a per address value for the whole somatic set,
three channels of it, is a lot of uniform and the fallback is a texture fetch
per march step, which would be slower again. Measured:
`MAX_FRAGMENT_UNIFORM_VECTORS` reports **4096** on this context, against a need
of about 340 scalars. Objection withdrawn on the number. The shader reads flat
float arrays and no texture is bound at all.

### 3. Kai Moana. "A WebGL lighting is a second renderer, forever."

The Field is canvas 2D today. Tissue is GL. That is two implementations of one
surface which must agree about what a reading looks like, and every future
change to the reading has to land in both. Conceded and not fixed, because it
cannot be fixed, only priced. It is the first line in what would have to be
true, below.

### 4. Petra Nikau. "All four of you will break Law 8 within an hour."

No text over the hero graphic. DESIGN.md records the rule as broken today on
the Field in nine places, where `pill()` draws a rounded caption onto the
canvas inside the rings. All four builds put every word off the drawing. The
nine captions became a caption rail under the hero in Atmosphere, eight
instrument tiles in Console, three caption blocks in Plumb and two rails in
Tissue.

**One collision this produced, and it is unresolved.** The shipped ruling at
`wheel.js` is explicit that the six gate rings always carry a pill with the
percent, and that the pill holds a dash when nothing has been read, because
"the absence is said rather than hidden". That pill is text on the hero. Law 8
is absolute. I ruled for Law 8 in all four builds and moved the dash into a
rail, so the absence is still said, just not on the drawing. Petra accepts the
outcome and disputes that I had the authority to pick. It is question 2 below.

### 5. Mika Ueda-Salas. "Your simple one says the opposite of what it means."

The first cut of Plumb drew the seat's **mean** charge outward and the seat's
integrity inward. Measured on Diane: the means run **1.29 to 3.64 of 10** and
the integrity runs **2.80 to 7.55 of 10**, so the wall beat the pressure at
every seat and a surface built to find charge drew a picture that said "you
have integrity". The cause is two rooms away from the symptom: 83 of her 112
addresses sit under the display line at SQ 4, so a mean over sixteen addresses
is mostly averaging zeroes.

Conceded entirely. Outward is now the seat's **peak**, the heaviest single
address there, which runs **2.09 to 5.07 of 10** on the same profile and
reverses the ranking: the Sacral goes from the lightest seat by mean to the
heaviest by peak. It is also the more actionable statistic, because a person
works an address and not an average. The mean is kept in the table under the
drawing, as a second figure rather than as the shape.

### 6. Dani Sorensen. "Hiding is simpler than blurring, to build and to explain."

Her position on layer isolation, which is the named gap in the Field: give the
person four checkboxes, hide what they uncheck, done in an afternoon. She is
right about the cost. She lost on the claim. This product's entire argument for
the Field is that the layers are one circuit: charge compounds into a saboteur
compounds into a complex compounds into a hyper complex. A control that deletes
three of the four contradicts the thing the surface exists to say. Atmosphere
puts the other three at distance instead, at half resolution and lower
contrast, which answers the request without retracting the claim. Overruled.

### 7. Sol Amadi. "You turned the muted palette into a bag of sweets."

The first Tissue render summed a lambert term, a wrap term, a back scatter term
and a fresnel term, each with its own gain, and the total ran well past one.
Every seat colour came back a pastel. The palette this product argues from
autonomic response was simply gone. **That render is recorded as a failure, not
quietly discarded:** it read as a beaded bracelet in candy colours, which is
precisely the cheese the brief forbade. Conceded. The terms are a budget now:
diffuse, subsurface and rim sum to a ceiling of one, so a seat on screen is the
seat colour lit and nothing is brighter than the light.

### 8. Yuki Brennan. "Your hero mechanic is out of range for most of the panel."

The chord web is the Field's signature and nobody had ever asked how many
objects it can carry. Measured across the nine reference people, weighted per
`PRODUCT.md`:

    who      weight   CQ    tier          above line   chain objects
    Diane      180   28.1   Corrupt            8 of 112        18
    Derek      170   15.0   Severe            20 of 112        53
    Marcus     160   39.2   Incoherent         0 of 112         1
    Angela     150   40.9   Incoherent         0 of 112        17
    Sofia      140   56.6   Even               0 of 112        10
    James      100   12.0   Severe            18 of 112        45
    Ana         50    7.6   Collapsed         41 of 112        45
    Gordon      35    0.8   Collapsed         97 of 112        66
    Rosa        15  100.0   Mastery            0 of 112         0

**The chord web sits inside a legible range of 3 to 40 objects for 47 percent
of the weighted panel. 36 percent are over 40 and 16 percent are under 3.** So
the mechanic the Field is built around works for slightly under half the people
it is for. Yuki's objection was upheld and it reshaped two of the four builds:
it is why Atmosphere quietens layers rather than stacking them, and it is the
whole architectural argument for Console.

### 9. Ilse Coetzee-Nakamura. "A volumetric glow is an aura camera."

Her seat owns whether the model is defensible to somebody not already
convinced, and the glossary in `kb.js` already refuses the aura claim in
writing: ultraweak photon emission is real, comes from reactive oxygen species,
and has never been shown to carry nervous system state. A luminous medium
around a body shaped object is the single most recognisable visual of the thing
this product has formally refused to be.

Partly conceded. The medium in Tissue is shadow weight, a computed number with
a stated scale, and the rail says so in those words. But she took a copy
ruling: **the word aura does not appear on any of the four surfaces**, and the
medium is named for what it is. She reserves the right to object again if it is
ever lit from outside rather than from the core.

### 10. Rua Whitmore. "Plumb is a wellness app in a dark theme."

Seventeen marks, no numbers on the drawing, seven soft arcs. His position was
that Marcus, who the review record already shows is only 58 percent identified
by this instrument and reads the word Incoherent in the largest type on screen,
will look at seventeen marks and close the tab.

Partly upheld. Plumb keeps the notch, which is the single actionable address,
and keeps four figures with their scales in a rail directly under the drawing.
The position that lost was the maximalist reply that the simple end should be
allowed to say nothing numeric at all. A diagnostic instrument that will not
print a figure is a mood board.

### 11. June Okonkwo-Lund. "Two of your four names are already taken."

One word per concept. **Blueprint** was proposed for the complex one and
rejected: `VIEWS` already uses it as the name of depth D. **Instrument** was
proposed for the second and rejected: the product calls itself a somatic
diagnostic instrument in its first sentence. Atmosphere and Tissue were kept
because `REVIEW-fields.md` already named those two treatments with those two
words, so keeping them is consistency and not invention. Plumb survives on one
prior use, as a description of an icon in `canon.js`.

**Console is unresolved and I am not going to pretend otherwise.** The word
appears eleven times in `atuned_src/`, every one of them the JavaScript console
object. That is a different noun in a different register, but "one word per
concept" does not have a clause about registers. It is question 1 below.

### 12. Camille Boucher. "The thing that travels is the number."

Her evidence is in `PRODUCT.md`: five of the seven reference people who would
arrive at this product name a person rather than an advertisement, and what
that person carries is a number. A picture that does not carry the number
cannot be repeated to a friend. Upheld without contest. All four builds print
coherence with its scale in a rail, and none of them prints it on the drawing,
which is the same ruling the shipped core already carries.

### 13. Rosa Iwasaki. "Four lightings is four times the gate surface."

`tests/design.js` gate 9 asserts that every lighting resolves its own tokens
and that the set produces distinct grounds. Seven lightings became seven
because each earned it. Adding four at once means four new grounds to argue,
four new contrast audits and four more surfaces for every future change.
Conceded completely. This document recommends **one**.

### 14. Anders Kjeld, second. "Your half scale buffer is a phone defect."

Tissue renders into a buffer at 0.55 of the surface and lets the browser
upscale, which is the same trick the shipped aura uses. Measured at 390 wide:
the stage is 358 across, the buffer at 0.55 was **197 pixels**, and a thin torus
section sampled at 197 comes back as a staircase. Conceded. The scale is a
function of the surface now: 0.90 under 760 wide and 0.55 above it, because the
fill on a phone is small enough to afford the resolution and a desktop's is
not. The staircase is materially reduced and **is not gone**, which is recorded
below as a live defect.

### 15. Ngozi Achebe-Lindgren. "A 5.5 second breath is a breathing pacer."

Her seat refuses manipulation patterns on a product that reads a nervous
system. Her point: 5.5 seconds a cycle is not a neutral choice, it is close to
the resonance frequency used in paced breathing protocols, and a large slow
object breathing at that rate in front of somebody will entrain them whether or
not that was intended. She is not against it. She is against doing it by
accident and not saying so. Unresolved, and it is question 4.

### 16. Bjorn Haraldsson. "Four files, four type stacks, no Inter."

The product embeds Inter as a base64 variable font, latin subset, and
`tests/design.js` gate 7 watches the network and fails on any request that is
not one of the two local rasters. These four mock ups declare
`Inter, system-ui, sans-serif` and embed nothing, so on a machine without Inter
they render in the system face. Conceded and priced: it is about 64 KB of
base64 a file, which would take Plumb from 26.8 KB to about 91 KB. It is not
added here because these are mock ups and the font is a known solved problem.
It is in the cost lines below so nobody mistakes the size figures for shipping
figures.

He also caught the **type floor**. Gate 4 forbids anything under 11 CSS pixels
on a leaf text element. My first cut set the eyebrow labels at 10.5 and the
quotient letter centres at 10. Both were defects against the product's own
gate. All four are now at 11 and measured clean at both viewports.

And the **all caps** rule. Gate 5 fails any leaf element with
`text-transform: uppercase` carrying more than six letters. My first cut had
fourteen such rules across the four files, inherited from the brief's
instruction to set headers in title case, which I had read as capitals. All
fourteen are removed. The labels are title case with tracking, which is what
the shipped `.eyebrow` already does.

### 17. Mika Ueda-Salas, second. "Console adds eight things to a screen the UX floor already failed."

The measured cognitive load on this product is 57 to 71 simultaneous choices
per screen against a working memory of about four, and `REVIEW-fields.md`
measured 109 on one screen. Eight instrument tiles looks like making it worse.

Overruled, on the chunking argument, and the arithmetic is the reason. Console
removes nine captions from the hero and adds eight tiles that share one
grammar: a ring of radial marks, same proportions, same scale convention, in
every tile. Eight instances of one learned chart is **eight chunks**, not
eight new things. The alternative, which is what the Field does today, is to
overlay nine layers in one drawing and produce one object with 236 named parts
in it, which is one chunk that cannot be read. Mika accepts the argument and
notes that it is untested on a person, which is fair.

### 18. Noa Ferreira-Blake. "Which of the seven does each of these stand beside?"

A new interface is an added lighting and never a replacement. Answered: all
four are ground `#0C0D12`, the Dark ground, and all four use `PAL`, the muted
dark palette. None of them touches Snow, Punch, Glass, Glass white, Flat or
Lumen, and none of them proposes changing a token any existing lighting
resolves. If one of these ships it ships as an eighth lighting with its own
ground argued, or as a change to how Dark draws the Field. Which of those two
it is, is question 3.

---

## WHAT THE FIELD IS FOR

The Field is the only surface that holds the whole circuit at once, and the
data says what that has to mean in practice. On the weighted reference panel
the median person carries something at most of their 112 addresses and has
almost none of them above the display line: Diane carries 91 of 112 and is over
the line at 8, Marcus carries 99 and is over the line at 0. So the Field is not
a census of 112 things, because 112 things at almost the same tiny value is a
picture of nothing. Two quantities in the geometry actually discriminate.
The first is the **peak** at each seat, which ranges 2.09 to 5.07 of 10 on
Diane where the mean ranges 1.29 to 3.64, and which points at one address a
person could work today. The second is **susceptibility**, the Domain Matrix
factor, which takes fourteen distinct values across 0.45 to 1.30 and is the
only quantity in the whole construct that varies per connection rather than
per node, and which has been computed since the first commit and never drawn.
The Field's job is to make those two legible, to show that the charge at an
address compounds into a named pattern and that the pattern compounds again, and
to hand back one thing to do. Everything else on it is context for that, and
context that costs more than it returns is decoration wearing the costume of
data.

---

## THE FOUR

### One. Plumb

*The ring is a pressure vessel.* Seventeen marks, drawn in SVG.

**What it shows.** The ring itself is zero and is the only reference mark.
Seven arcs outward from it are the peak charge at each seat, 0 to 10. Seven
arcs inward are the integrity at that seat, 0 to 10, and read as the wall the
pressure is held against. One disc at the centre is the core, sized and
coloured by coherence on the shipped ramp. One notch runs out past everything
and marks the single heaviest address of 112. Four figures with their scales
sit in a rail under the drawing, and a seven row table gives peak, wall and
mean per seat.

**What it refuses.** The chain, entirely: 13 saboteurs, 4 complexes and 1 hyper
complex are not drawn. The 112 addresses individually. The 21 laws, the 19
domains, the 6 masks, the 12 archetypes, the 6 gates, the wash, the atoms, and
every count. It refuses motion: there is no animation loop at all.

**The symbol argument.** A vessel under pressure is the one physical object
that reads correctly with the labels off, which is the test. The bulge is what
is pushing and the wall is what is holding, and a wide bulge over a thin wall
is a seat that will not hold. On Diane that is a true sentence the drawing
makes with no word on it: the Sacral has the highest peak, 5.07 of 10, over
the thinnest wall, 2.80 of 10. It is also the one place in the product where
the engine's own binary, charge held against the coherent opposite installed,
becomes a single shape instead of two bars.

**Cost.** **0 ms a frame.** It is SVG with no loop: drawn once and then free
until the reading changes. **26.8 KB** on disk, 10.1 KB gzipped, of which 14.0
KB is the embedded profile data. Add about 64 KB for the embedded Inter if it
ships. Every mark is a DOM element with its own `title`, so it is hit testable,
screen readable and inspectable, which canvas is not.

**The risk, honestly.** It can read as a wellness app. Measured across the
weighted panel, Plumb discriminates on **99 percent** of it, on the combined
test that either the seat peak spread reaches 1.0 of 10 or the wall spread
reaches 1.5 of 10. The 1 percent it fails on is Rosa, who reads coherence 100
of 100 with nothing held, where a flat ring is the correct drawing. So the
failure mode is not that it says nothing. The failure mode is that it says one
true thing where the person paid for an instrument, and `REVIEW-fields.md`
already records that half the ICP roster over claims what this product can see
about them.

### Two. Atmosphere

*The wheel that ships today, with two changes.* Canvas 2D, two contexts.

**What it shows.** Everything the Field shows today: the wash, the 112
addresses with the carrying ones grown, the chord web from saboteur to complex
to hyper complex with width from pattern weight and sag from susceptibility,
the beads, the six gates on stems, the core breathing at 1.4 Hz, the root to
crown entrance sweep. Plus the seat bands from Plumb at the rim, so the seat
reading exists without zooming. Plus one lead line to the heaviest address,
running outside the last ring.

**The two changes.** First, **every word comes off the canvas.** The nine
`pill()` captions DESIGN.md records as live Law 8 violations become a caption
rail under the hero, where they gain line breaking, a screen reader and a
collision gate that can actually see them. Second, **focus is distance, not
absence.** The layer in focus draws to a full resolution canvas; the other
three draw to a canvas at half resolution which the browser upscales, which is
the blur. Nothing is ever removed, so the claim that the layers are one circuit
survives the control that isolates them.

**What it refuses.** The 19 domains, the 6 masks, the 12 archetypes, the 21
laws and the atom layer. It refuses to be a complete inventory and it refuses
to hide anything it draws.

**The symbol argument.** Depth of field is the oldest legible way to say "this
is what you are looking at, and this is what it sits inside". It is also the
one that has aged best: a rack focus from 1975 reads today. It costs nothing to
learn because everyone has already learned it from every photograph they have
ever seen.

**Cost.** **0.8 ms median, 1.3 to 2.5 ms at the 95th** at 1600 by 1000 into a
670 by 670 canvas. **0.8 ms median, 0.9 at the 95th** at 390 by 844. The far
canvas is a quarter of the pixels of the near one, so the two pass structure
costs about 25 percent more fill than a single pass and buys the entire
effect. **36.9 KB** on disk, 13.4 KB gzipped. No dependency, no network, no
second renderer.

**The risk.** Two canvases is two states to keep in sync, and a bug where one
repaints and the other does not will show as a ghost. And the depth cue is
doing work that a person may read as "the rest is broken" rather than "the rest
is behind you" until they press a second button. It needs one line of copy,
which the build carries in the rail.

### Three. Tissue

*The same reading as a solid.* Raw WebGL 2, a single full screen fragment
shader. **No library, no include, no network.** It is a signed distance field
for a torus and an analytic sphere, sphere traced at 96 steps, with a 22 step
forward volumetric march through the interior.

**What it shows.** The ring is a torus with real section. The minor radius at
any bearing is the charge held at the address at that bearing, swelling from a
base of 0.026 to 0.108 of the major radius at a full ten, and pinched back by
the coherent opposite installed there, because an address with the cure in is
clear and should be thin rather than bright. How far light travels through the
section is **susceptibility**, which is the quantity that has never been drawn.
Inside the ring is a participating medium whose density is shadow weight,
tinted by the seat that carries most, lit by the core and by nothing else. The
core is a sphere sized and emitting by coherence, on the shipped ramp. One key
light. One breath at 5.5 seconds on the base section only, so the body moves
and the reading does not. One yaw at 63 seconds a turn.

**What it refuses, and this one matters.** It refuses individual addresses.
The section is a thirteen tap cosine window across six addresses, because a
linear blend between neighbours produced a beaded bracelet, and the rail says
in those words that addresses are not resolvable here and this lighting does
not pretend they are. It refuses the whole chain: no saboteurs, no complexes,
no hyper complexes. It refuses every count, every name and every number on the
drawing. It also refuses, deliberately, everything that makes a shader look
like a title sequence: **no bloom pass, no lens flare, no chromatic
aberration, no particle layer.**

**The symbol argument.** Everything else in this product draws the body as a
diagram. This draws it as a body. The argument for weight over effect is
Pixar's and it is one rule: the object must have mass, and mass is read from
how light enters it and how slowly it moves. So there is one light, a real
falloff, subsurface scatter that is a measured quantity rather than a look, and
a breath slow enough to be a breath. The argument against cheese is
subtractive: every effect that exists to say "this is expensive" is absent.

**Cost, measured, and the caveat is not decoration.**

    1600 by 1000, medium on, 0.55 scale, buffer 605 by 378
      228 to 397 ms median over six runs, 263 to 492 at the 95th

    1600 by 1000, medium off, surface only
      73 to 106 ms median over three runs

    1600 by 1000, full resolution, medium on, buffer 1100 by 687
      747 to 1186 ms median over three runs

    390 by 844, medium on, 0.90 scale, buffer 322 by 242
      83 to 115 ms median over four runs

    37.2 KB on disk, 14.6 KB gzipped

The renderer is a software rasteriser on the CPU, reported as
`ANGLE (Google, Vulkan 1.3.0 (SwiftShader Device (Subzero)), SwiftShader
driver)`. A fill bound fragment shader runs between one and two orders of
magnitude faster on a discrete card. **I will not extrapolate that into a
number, because a frame figure invented from a ratio is exactly the kind of
figure this repository has been bitten by five times.** What the measurement
does establish, independent of the hardware, is the **shape** of the cost,
which is a ratio and survives the machine: the volumetric medium is **between
67 and 81 percent of the frame** across the paired runs, and turning it off is a
three to five times speed up. Doubling the buffer scale from 0.55 to 1.00, which
is about three and a quarter times the pixels, costs about three times the
frame, which is what a fill bound shader is supposed to do and is the check
that the measurement is measuring what it claims to.

**The honest risks, including the ones still on screen.**

1. **The medium draws nothing for 47 percent of the weighted panel.** Marcus,
   Angela, Sofia and Rosa all read shadow weight 0.00 of 10. So the most
   expensive thing in the frame renders an empty volume for nearly half the
   people the product is for. This is the strongest argument against Tissue and
   it is arithmetic, not taste.
2. **The silhouette still steps.** At grazing angles the sphere trace
   overshoots a section whose thickness changes along the ray, and the lower
   edge of the ring comes back with a visible staircase. It is materially
   better than the first cut and it is **not fixed**. It needs either a
   conservative Lipschitz bound on the varying minor radius or a higher step
   count, and the step count is already the cost.
3. **The first render failed and is recorded as a failure.** Fat section,
   candy colours, visible beads, a brown fog filling the frame and four white
   bobbins on the near edge. It read as a beaded bracelet. The idea was not
   wrong and the execution was, which are opposite fixes, and this document
   would be worth less if it had quietly shown you only the second attempt.
4. It is a second renderer, forever.

### Four. Console

*Every layer, on one panel.* Canvas 2D hero plus eight SVG instrument tiles.

**What it shows.** The hero carries everything that can honestly be overlaid,
which is nine layers: 19 domains on the outermost ring coloured by their root,
6 masks, 12 archetypes with the leading one at full accent, four rings of chain
chords from saboteur through complex and hyper complex to character, the 112
addresses with the installed opposite drawn inward at the same address, the
seven seat bands, the 21 laws as spokes against the core, the six gates on
stems, and the core. Around it, eight tiles: seven seats, nine axes, twenty one
laws, nineteen domains, six masks, twelve archetypes, six gates, three
quotients. A layer index down the left names all nine layers with a count and
its total, and every row toggles that layer on the hero.

**The grammar.** Every tile is the same chart: a ring of radial marks from a
common inner circle, each mark's length a value on a stated scale, each mark
carrying its own `title`. Same proportions, same convention, eight times. The
eye learns one chart and then reads eight, which is the answer to Mika's
objection and it is Tufte's small multiple and Aicher's pictogram system doing
the same job in the same way.

**What it refuses.** It refuses to put words on the hero, so nothing on the
drawing is named and every name is in a tile or a rail. It refuses to overlay
what cannot be overlaid: the nine axes, the three quotients and the six gate
percentages are not on the hero because at nine layers they would be crossing
something. And **below 220 half units it refuses the gates on the hero too**.
Measured at 390 wide: the law spokes run from 42 to 56 pixels and the six gate
rings landed at 34 to 48. They collided. The gates now come off the hero at
that width and the Six Gates tile carries them, which is this lighting's own
architecture applied to itself.

**The symbol argument.** A flight instrument panel. Not as a mood, as a
structure: when a single dial cannot hold every quantity, you do not make the
dial cleverer, you put more dials on the panel and give them one face so they
can be scanned. It is the oldest solved version of exactly this problem and it
is why a 1960s cockpit is still readable today.

**Cost.** **0.9 ms median, 1.5 ms at the 95th** at 1600 by 1000 into a 590 by
590 canvas with Diane's 18 chain objects. **1.2 ms median, 1.7 at the 95th**
with Derek's 53. **0.8 ms median** at 390 by 844. The eight tiles are SVG and
cost nothing a frame: they are drawn once and redrawn only when a layer is
toggled or the profile changes. **60.5 KB** on disk, 18.1 KB gzipped, of which
32.8 KB is two embedded profiles.

**The risk.** Density. At Derek's 53 chain objects the chord web fills the
interior and is close to its limit; at Gordon's 66 it would be past it. The
layer index makes that survivable, because a person can put the chain away and
read the rest, but the hero's claim is "legible at once" and at 66 objects that
claim is false. And at 390 the hero is 358 pixels across carrying eight layers,
which works because the tiles exist, and would not otherwise.

---

## THE RECOMMENDATION

**Two. Atmosphere.** Ship it as a change to how the Field draws in the existing
Dark lighting, not as an eighth lighting.

The reason is not that it is the safe one. It is that it is the only one of the
four that pays off engineering already in the repository while closing a defect
already written down.

Three things land in one move. **Law 8 gets closed on the Field**, which
DESIGN.md records as broken in nine places today and which no other proposal on
the table fixes. **Layer isolation gets built**, which `REVIEW-fields.md` lists
as missing and which Atmosphere answers without contradicting the claim that
the layers are one circuit. And **the zoom ladder already in `wheel.js` gains
the thing it was missing**: zoom resolves detail, focus says which detail, and
the two are now different controls doing different jobs instead of one control
doing both badly.

It costs **0.8 ms a frame** against the shipped Field's own measured cost, in
one file, with no dependency, no network and no second renderer. That is the
whole of the technical argument.

**Plumb is not discarded.** It should ship as the **mobile** Field and as the
first thing a person sees before they have a record worth drawing. It reads
correctly for 99 percent of the weighted panel, it costs zero milliseconds a
frame, its seventeen marks are DOM elements a screen reader can read, and the
one surface in this product that currently shows 109 simultaneous choices would
benefit more from seventeen marks than from anything else in this document. The
seat band mechanic is already carried into Atmosphere and Console, so Plumb is
not a fork, it is the same reading at the lowest resolution.

**Console is the practitioner view**, not the person's view. The fork is called
and a practitioner who has been granted sight of somebody's data is exactly the
reader who needs every layer at once and has the training to scan a panel. Put
it behind that grant and the density risk stops being a risk and becomes the
point.

**Tissue does not ship this year.** The reason is in one number: the medium is
73 to 80 percent of its frame and renders nothing for 47 percent of the
weighted panel. That is not a performance problem to be optimised, it is the
expensive part of the picture being empty for half the audience.

---

## WHAT WOULD HAVE TO BE TRUE FOR THREE

Not a wish list. Six conditions, and the first two are hard gates.

1. **A frame figure from real hardware.** Every number above was measured on a
   software rasteriser. Tissue is not arguable until it has been measured on
   the range of machines the ICP actually owns, which per `PRODUCT.md` skews to
   people aged 36 to 57 on work laptops, not gaming desktops. The gate: median
   under 16.7 ms at 1600 by 1000 on the tenth percentile machine, with the
   medium on. If that measurement is not taken, the answer stays no.

2. **A fallback that is not a blank rectangle.** One file, no dependencies,
   no network is the product's spine. A WebGL lighting on a machine with no
   WebGL 2 context must fall back to the canvas Field, not to an apology.
   Tissue currently detects the failure and prints a sentence, which is honest
   and is not sufficient.

3. **A second renderer accepted as permanent cost.** Every change to what a
   reading looks like would land twice, in `wheel.js` and in the shader, and
   `tools/equiv.py` cannot compare a fragment shader to a canvas pass. Somebody
   has to own that the two agree. That is a standing job, not a one time one.

4. **The medium earns its place or it goes.** It is most of the cost and it is
   empty for nearly half the panel. Either it carries something that is
   non zero for everybody, or it is drawn only above a stated shadow weight
   threshold and its absence is a reading in itself, which is defensible and
   would need copy.

5. **The silhouette stops stepping.** A conservative bound on the varying minor
   radius, or a higher step count paid for out of condition 1.

6. **Ilse signs the copy.** A luminous volume around a body shaped object is
   the aura camera image, and this product has formally refused that claim in
   writing. She holds the word "measurable" and she has already reserved the
   right to object if the medium is ever lit from outside rather than from the
   core.

---

## THE QUESTIONS YOU CANNOT ANSWER

Six. Each one is a ruling only the owner can make, and each one is blocking
something specific.

**1. The name Console.** The word appears eleven times in `atuned_src/`, all of
them the JavaScript console object. One word per concept has no clause about
registers. Do we take the word for this, rename the lighting, or rule that a
developer facing noun and a person facing noun can share a spelling? Blocking:
the name of lighting four, and by extension whether the rule has an exception
we should write down.

**2. The gate pill against Law 8.** `wheel.js` rules that the six gate rings
always carry a pill with the percent, holding a dash when nothing has been
read, "because the absence is said rather than hidden". Law 8 rules that no
text goes on the hero graphic, ever. Both are yours and they are in direct
conflict on the Field. I ruled for Law 8 in all four builds and moved the dash
to a rail. Do you want that, or do you want a stated exception for a ring
caption? This is the same question DESIGN.md already put to you about the nine
`pill()` captions and it has not been answered. Blocking: whether Atmosphere's
caption rail is the fix or a workaround.

**3. Lighting or renderer.** Is a new treatment of the Field an **eighth
lighting**, with its own ground and its own row in gate 9, or is it **how the
Field draws inside Dark**, leaving the seven lightings at seven? My
recommendation assumes the second. If it is the first, gate 9 needs a distinct
ground argued for each one and that is real work with a real palette argument
attached. Blocking: the shape of the build, and Rosa's estimate.

**4. The 5.5 second breath.** Ngozi's objection. A large slow object breathing
at close to the paced breathing resonance frequency, in front of somebody whose
nervous system this product is reading, will entrain them. Is that an intended
feature of the instrument, an unintended side effect to be tuned away from, or
something that needs to be disclosed? It is a rate, so it is cheap either way.
It is not cheap to get wrong. Blocking: the motion spec for Tissue and for the
core breathe in Atmosphere, which runs at 1.4 Hz today and is not near the
resonance band.

**5. Which statistic the seat band carries.** The build changed it from the
seat's mean charge to the seat's peak, on the measurement that 83 of Diane's
112 addresses sit under the display line and the mean is mostly averaging
zeroes. The peak is more actionable and it reverses the seat ranking. But the
mean is what `compute()` uses for `darkB`, the seat the wash is tinted by, so
the drawing and the wash would now disagree about which seat carries most.
Either the band uses the mean and is duller, or the wash moves to the peak and
`darkB` changes meaning, or they are allowed to differ and each says which it
is. Blocking: Plumb, and the seat bands in Atmosphere and Console.

**6. Who Console is for.** I have recommended it as the practitioner view. That
presumes the practitioner grant in `DECISIONS.md` and it presumes a
practitioner wants density rather than a summary. Neither has been tested with
a practitioner, and Sofia is the only one on the reference panel. Blocking:
whether Console is built at all, and if so against which reader.

---

## RECORDED DEFECTS

Kept in rather than fixed out, because a review that only shows what worked is
not a review.

1. **Tissue's first render failed.** Beaded bracelet, candy colours, brown fog,
   white bobbins. Recorded in the debate at objection 7. The fix was to the
   execution, not the idea.
2. **Tissue's silhouette still steps** at grazing angles at 1600. Cause and
   fix stated. Not fixed.
3. **Tissue at 390 is small in its frame.** The ring occupies roughly half the
   stage width in a 4 by 3 box. It would want a tighter camera, which is a
   number, not a rebuild.
4. **Console at Derek's 53 chain objects is close to the legibility limit** and
   at Gordon's 66 would be past it. The layer index is the mitigation, not a
   cure.
5. **Plumb reads flat on Rosa**, who is coherence 100 of 100 with nothing held.
   That is correct behaviour, and it is also the failure mode
   `REVIEW-fields.md` already names: this product has no maintenance layer and
   loses everybody who succeeds at it.
6. **None of the four embeds Inter.** They declare it and fall back to
   `system-ui`. Priced at about 64 KB a file in the cost lines.
7. **Diane's chain sits almost entirely in the right half of the wheel**, so
   three of the four heroes have a visibly empty upper left quadrant. That is
   her actual reading and not a layout bug, and it reads as a layout bug, which
   is worth somebody's attention.

---

## HOW TO CHECK THIS

    node tools/shots.js is not wired to proto/, so open the files directly:

    /opt/pw-browsers/chromium-1194/chrome-linux/chrome  with NODE_PATH=$(npm root -g)
    proto/field/one.html    proto/field/two.html
    proto/field/three.html  proto/field/four.html

Each file prints its own measured frame cost in its rail, at the viewport you
are looking at, over the last 120 frames, with the renderer named. Tissue reads
its clock after a one pixel synchronous read back so the figure is the work and
not the submit. Plumb prints nothing because it has no frame.

The profile numbers were produced by loading `engine.js` in node, setting the
nine axes and the twenty one laws off `PEOPLE` and `LAWSET`, running
`compute()`, and dumping the result. Nothing in any of the four files was
authored by hand. Re run it and the numbers will be the same, because the
engine is deterministic and `tests/engine.js` asserts that it is.
