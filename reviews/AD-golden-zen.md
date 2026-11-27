# Golden Ratio And Zen Aesthetics: Research, And A Judgement On The Awareness Mark

Art direction. Mika Ueda-Salas, with Sol Amadi on light and colour, Bjorn
Haraldsson on type and grid, Petra Nikau on composition and symbol.
20 September.

Scope. Two research bodies, cited. Then a judgement on the mark at
`/home/user/MOB/tools/soulloop.js` as presented at
`/home/user/MOB/reviews/soul-loop.html`, now renamed awareness, lowercase.
Numbered changes to the geometry, with the constant and the value. Nothing in
the generator was edited. Every measurement below was taken by rasterising the
generator's own outline at supersample 8 to 10 and by exact analysis of its
Beziers, and the scripts live in the session scratchpad.

Grade as it stands: **C plus.** The construction is honest and the file
argues for itself, which is rare. But three of the generator's own stated
intentions are not implemented, the stroke does not cross itself, and the mark
fails its own 14 pixel brief and fails the contrast floor on two of the four
lightings. Grade after the eleven changes in part 3: **A minus.**

---

# Part 1. The Golden Ratio, What Is Operative

## 1.1 The Number, Its Reciprocal, Its Powers

Phi is the positive root of x squared equals x plus 1.

    phi        1.6180339887
    1/phi      0.6180339887   = phi - 1
    1/phi^2    0.3819660113   = 2 - phi
    1/phi^3    0.2360679775
    1/phi^4    0.1458980338
    1/phi^5    0.0901699437
    phi^2      2.6180339887   = phi + 1
    phi^3      4.2360679775
    phi^4      6.8541019662
    phi^5     11.0901699437

The only property here that is actually load bearing for a design system is
that phi is the unique positive number whose geometric progression is also
additive. Because phi squared minus phi minus 1 equals zero exactly, every
power satisfies phi to the n equals phi to the n minus 1 plus phi to the n
minus 2. I checked the residual: 0.000000000000.

This is not true of any musical ratio. A perfect fourth squared is 1.7778
where additivity would need 2.3333. A perfect fifth squared is 2.2500 where
additivity would need 2.5000. So in a phi scale, and only in a phi scale, two
stacked elements at consecutive steps exactly fill the next step up with no
remainder. That is the one honest reason to choose phi for a spacing or size
system: it nests without a gap. Everything else claimed for it is decoration.

The self similar versus arithmetic distinction. An arithmetic progression adds
a constant, so the ratio between adjacent terms falls as the terms grow: 8, 16,
24, 32 has local ratios 2.00, 1.50, 1.33. Perceived difference tracks ratio,
not difference, so an arithmetic ladder reads as dramatic at the bottom and
flat at the top. A geometric progression holds the ratio constant, so every
step reads as the same amount of change at every size. That, and not beauty,
is why modular scales exist.

## 1.2 Golden Rectangle, Gnomon, Spiral

The golden rectangle has sides in ratio phi to 1. Remove a square from it and
the remainder is another golden rectangle. The removed square is the **gnomon**
in the loose sense used in design writing: the figure you add to or take from a
shape to leave a similar shape.

Strictly, the golden gnomon is a different object. Per Wolfram MathWorld it is
the obtuse isosceles triangle whose ratio of side to base is 1/phi, with angles
36, 36 and 108 degrees, angles in the ratio 1 to 1 to 3. Its companion, the
golden triangle, is 36, 72, 72. Bisect a base angle of the golden triangle and
it splits into a golden triangle plus a golden gnomon. One golden triangle plus
two golden gnomons is a regular pentagon. If we ever want a five fold mark,
this is the grid, not a circle.

The **golden spiral** is the logarithmic spiral whose growth factor is phi per
quarter turn. In polar form r equals a times e to the b theta, with

    b = ln(phi) / (pi/2) = 0.3063490
    growth per full turn = phi^4 = 6.8541
    angle between tangent and radius vector = 72.968 degrees
    pitch angle measured from the circle = 17.032 degrees

The thing every designer draws instead is the **quarter circle approximation**,
the Fibonacci spiral built from quarter arcs inscribed in squares of Fibonacci
side. It is not the golden spiral and the difference is not academic. Within
each quarter arc the curvature is constant; at every join it changes abruptly.
The true logarithmic spiral has curvature varying continuously along its whole
length, and its radius of curvature is proportional to arc length, which is the
property that puts it in the log aesthetic curve family used in industrial
design.

Hubner, 2024, in i-Perception, tested exactly this. About 80 percent of
participants preferred the golden spiral to the Fibonacci spiral, and the same
experiment found an Archimedean spiral preferred to a Durer spiral, which
differ in the same way. The author's conclusion is blunt and useful: abrupt
changes in curvature seem to be universally disliked. That is the most directly
applicable empirical result in this entire body, and it indicts our mark
twice. See 2.9 and 3.4.

## 1.3 The Golden Angle And Phyllotaxis

    golden angle = 360 / phi^2 = 137.50776 degrees
    complement            = 222.49224 degrees
    in radians, (3 - sqrt(5)) * pi = 2.399963

This is the one place the ratio is genuinely load bearing in nature, and the
reason is number theoretic rather than mystical. Phi has the continued fraction
with every partial quotient equal to 1, which makes it the worst approximable
irrational: its Markov constant attains the Hurwitz bound 1/sqrt(5), and no
irrational is harder to approximate by rationals. A divergence angle that is
poorly approximated by any simple fraction is an angle at which successive
primordia never stack into a small number of radial rows, so they pack.

Vogel, 1979, modelled sunflower florets in polar coordinates with divergence
137.5 degrees and radius proportional to the square root of the index, and it
reproduces the observed pattern. Ridley, 1982, proved via continued fractions
that the golden angle gives the most efficient packing. Spiral counts come out
as consecutive Fibonacci numbers, 21 and 34 on a small capitulum, up to 89 and
144 on a large one. Okabe, in Scientific Reports, 2015, shows the golden angle
is the angle that minimises the energy cost of the phyllotactic transition,
which accounts both for the precision of 137.5 and for the other angles that do
occur.

Operative for us: if we ever place n marks or n dots around a ring and want no
apparent row structure at any n, 137.50776 is the correct increment. That is
its only legitimate use in an interface.

## 1.4 Modular And Typographic Scales

Bringhurst, in The Elements of Typographic Style, gives the framing that Tim
Brown then carried into web typography: a modular scale, like a musical scale,
is a prearranged set of harmonious proportions. You take a ratio and a base and
multiply and divide.

The comparison the pop literature never makes is steps per doubling, and it is
the number that decides whether a ratio is usable:

    ratio            value    steps per octave
    major third      1.2500   3.106
    perfect fourth   1.3333   2.409
    perfect fifth    1.5000   1.710
    phi              1.6180   1.440

From a 12 pixel base, capped at 32 pixels, which is roughly the working range
of a dense interface:

    phi           12.0, 19.4, 31.4                    3 sizes
    fifth         12.0, 18.0, 27.0                    3 sizes
    fourth        12.0, 16.0, 21.3, 28.4              4 sizes
    major third   12.0, 15.0, 18.8, 23.4, 29.3        5 sizes

A phi type scale gives three sizes where a product surface needs five. That is
why phi is an editorial and display ratio and not a UI ratio, and it is why
this product's own type scale should not be phi even though its mark is.

The classical scale, 6, 7, 8, 9, 10, 11, 12, 14, 16, 18, 21, 24, 36, 48, 60,
72, still the default sequence in InDesign, is not a single ratio at all. Its
local ratios run 1.1667, 1.1429, 1.1250, 1.1111, 1.1000, 1.0909, then 1.1667,
1.1429, 1.1250, 1.1667, 1.1429, then 1.5000, 1.3333, 1.2500, 1.2000. Minimum
1.0909, maximum 1.5000. It is tighter where a reader needs discrimination in
text and coarser where the sizes are display. It is an optical scale, not a
mathematical one, and it beats phi at the job phi is usually sold for.

## 1.5 Where Phi Really Appears In Letterforms And Marks

The honest list is short.

**Optima, Hermann Zapf.** The proportions of Optima Roman are described as
based on the golden section, with the lowercase x height as the minor and the
ascender to descender span as the major. This is the cleanest case of a
typeface where the designer's own stated construction uses the section, rather
than a grid laid over the result afterwards.

**Page construction, not letters.** The Van de Graaf canon, popularised by Jan
Tschichold in The Form of the Book, produces a type area whose proportion
follows the page by diagonal construction. The canons resolve into 2:3, 1 to
root 2, 5:8 and the golden section. Tschichold and Hendel both report that the
golden section page, in practice 21:34, appears in manuscripts and incunabula
mostly between 1550 and 1770. This is real and documented, and it is about
where the block sits on the sheet, not about the shapes of the letters.

**Post rationalisation, which is the common case.** The practice of laying a
phi grid over a finished logo to sell it as mathematically inevitable has a
name in the literature, post rationalisation. On Apple: David Cole tested
whether circles match the logo's curves and found the arcs are not built from
strict circles, which Fast Company wrote up as debunking the Apple golden ratio
myth. On Pepsi: the Arnell Group's 27 page BREATHTAKING design strategy, on a
reported one million dollar contract, invoked the golden ratio alongside the
earth's magnetic and gravitational fields, feng shui, Pythagoras, the Mona
Lisa, the Parthenon and the theory of relativity. It was widely reported as
bizarre and nonsensical and there were rumours it was a hoax. Underneath the
document there is genuine circle geometry holding the smile consistent, which
is the tell: the working construction was circles, and phi was added for the
pitch.

The rule I draw from this, and I will enforce it on our own mark: if a phi
relation is in the geometry it must be in the generator as an expression, and
if it is not in the generator it does not get claimed in the presentation. Our
file currently breaks this in three places. See 2.3, 2.4 and 2.5.

## 1.6 Le Corbusier's Modulor

Published as Le Modulor, 1948, with Modulor 2 in 1955. A red series and a blue
series, both geometric progressions with ratio phi, anchored to body
measurements: navel at 113 cm, fingertip of the raised arm at 226 cm, which is
twice 113, with 70 and 43 in the same family. The figure was originally 1.75 m
and was revised to 1.83 m, six feet, on the reasoning that in English detective
novels the good looking men are always six feet tall. That is the anecdote and
it is the system's own account of its anchor.

What it got right. It is the first serious attempt to tie a proportional system
to the human body rather than to an abstract module, and the additive property
of phi means red and blue interlock so that dimensions combine without
remainder, which is exactly the property in 1.1. As a dimensioning discipline
for a repeated unit it worked.

Where it failed in use. The 226 cm ceiling derived from the raised arm collided
with regulation: for the Berlin Unite d'Habitation the Baupolizei required a
2.50 m minimum, and the building was subsequently deleted from Le Corbusier's
own oeuvre, a position he held until his death in 1965. Optimising to a 1.83 m
figure produces spaces that are tight for taller occupants and for two person
activities, and the kitchens and bathrooms of the Unites are cramped by
contemporary standards. Only the Marseille Unite and La Tourette were built to
the theory.

The lesson for us is precise and it is the lesson of Modulor, not a criticism
of phi. A proportional system anchored to one idealised body produces a
dimension that is correct in the system and wrong in the room. Our equivalent
of the 226 cm ceiling is the 14 pixel requirement. See 2.1.

## 1.7 The Honest Criticism

**Markowsky, Misconceptions about the Golden Ratio, The College Mathematics
Journal, volume 23 number 1, January 1992, pages 2 to 19.** The mathematical
properties are stated correctly in the literature; much of what is claimed for
the ratio in art, architecture, literature and aesthetics is false or seriously
misleading, and the paper goes after the claims that textbooks repeat. On the
Parthenon: the dimensions vary from source to source because different authors
measure between different points, and the closest ratio he obtains is 1.72,
which is not phi. He makes the measurement point directly: measurements of real
objects are approximations, and imprecision in the measurements compounds when
they are put into ratios. He also handles the navel ratio claim and the UN
Secretariat, in the latter case by showing that the measurement is taken wrongly
and that golden relations elsewhere in the same building are ignored. He
includes templates so a reader can run the body measurements themselves.

**Devlin.** His position, from the Mathematical Association of America, is that
the claim that the golden mean was used in ancient buildings such as the
Parthenon is a groundless myth with no basis in fact whatsoever. His structural
argument is better than the debunking: phi is irrational, so it cannot be
applied precisely to anything built, and many real objects have ratios that
float around it, which is what you would expect from any number in that
neighbourhood. He attributes the persistence to a natural desire to find meaning
in the pattern of the universe. His 2011 Museum of Mathematics lecture,
Fibonacci and the Golden Ratio Exposed, is the accessible version.

**The nautilus, which we must never cite.** Falbo measured nautilus shells in
the California Academy of Sciences collection and found spirals inscribing in
rectangles of about 1.33, not 1.618, with a measured range of 1.24 to 1.43, and
concluded that anyone with access to a shell can see the ratio is around 4 to 3
and not phi. Sharp's own measurements agree that the golden rectangular spiral
and the nautilus spiral do not match. Bartlett, in the Nexus Network Journal,
2018, measured eighty shells in the Smithsonian collection and puts the genus
mean at 1.310, so not even 4 to 3. The shell is a logarithmic spiral. It is not
a golden spiral. The general error is assuming that because phi can generate a
logarithmic spiral, every logarithmic spiral is about phi.

**The preference studies, and what they actually found.** Fechner, 1876, is the
origin. In his rectangle choice experiment the 5:8 rectangle was the modal
preference at about 35 percent, the 2:5 rectangle the least at about 1.5
percent, and 76 percent of all choices fell on three rectangles of ratio 1.75,
1.62 and 1.50. Read carefully, that is not a result about phi. It is a result
about a band of moderately elongated rectangles about 25 units wide, and phi
happens to sit in it. Godkewitsch, 1974, showed the golden rectangle preference
in the earlier work is an artifact of where that rectangle sits in the range of
stimuli presented, and made the methodological point that average group
preference often does not match the modal first choice, so first choices are the
more meaningful measure. Green, 1995, All that glitters: a review of
psychological research on the aesthetics of the golden section, in Perception,
is the review to hold; Hoge, 1995, revisits Fechner's hypothesis in the same
year.

Where that leaves us. There is a weak, range dependent preference for
proportions in a band that includes phi. There is no evidence for a preference
for phi specifically. The one strong, replicated, directly usable finding in the
whole literature is Hubner's, and it is not about ratio at all. It is about
curvature continuity, at about 80 percent agreement. **We should be using phi
as a discipline for generating a consistent family of values, and we should be
using curvature continuity as the thing we actually optimise.**

---

# Part 2. Japanese Zen Design Aesthetics, The Structure

## 2.1 The Seven, From Hisamatsu

Hisamatsu Shin'ichi, 1889 to 1980. Zen and the Fine Arts, translated by Gishin
Tokiwa, 1971. Hisamatsu was not prescribing a style; he was describing what the
Zen aesthetic already had in common across centuries of calligraphy, gardens,
flower arranging and tea. Seven characteristics, seven ways one spirit shows in
form. Definitions below, and for each one what it means in a mark rather than
in a garden, which is the part the literature never supplies.

**Fukinsei, 不均整, asymmetry.** Asymmetry, odd numbers, irregularity,
unevenness, imbalance, used as a denial of perfection as perfection, on the
ground that symmetry does not occur in nature. In practice it is a habit, not a
mood: elements come in threes, fives and sevens, rarely twos and fours,
because an odd grouping cannot be split cleanly down the middle and therefore
stays in motion. Ikebana formalises it as three named points, shin, soe and
hikae, heaven, man and earth, set at unequal lengths and unequal angles.
**In a mark:** no axis of reflection, no two lengths equal, no two angles
equal, no two tips at the same height. If any pair in the mark is within a few
percent of equal, that pair is the defect.

**Kanso, 簡素, simplicity.** Not minimalism as a look. The elimination of
whatever does not carry, so that what remains is plain and unornamented.
**In a mark:** one gesture, one fill, no outline, no second path, no effect. Our
mark passes this outright and it is the mark's best quality.

**Koko, 古枯, austere sublimity.** The discernment of beauty and depth in what
is aged or seasoned. The vocabulary attached to it is physical: furrowed,
cracked, wind dried, scarred, decayed, weathered, crackled, worm eaten.
**In a mark:** koko is the argument for a terminal that is not a clean
mathematical end, for the dry trail at the tail of a stroke, for an edge with a
history. It is the principle our mark most flatly violates, because both its
ends are flat machined chords. See 2.9 and 3.6.

**Shizen, 自然, naturalness.** Not the imitation of nature. The dropping away
of self conscious effort: practising a gesture until it is effortless, setting
conditions and then releasing control, removing whatever is trying too hard to
be beautiful. **In a mark:** the curve should read as the record of a movement
with momentum, not as a construction. A curvature discontinuity is the signature
of construction, which is why 1.2's finding and this principle point the same
way.

**Yugen, 幽玄, profound grace, subtle profundity.** What is suggested rather
than stated; depth that is not displayed. **In a mark:** the part you do not
draw. For us, the eye. If the eye is a leftover gap, there is no yugen. If the
eye is the thing the stroke was made in order to leave, there is.

**Datsuzoku, 脱俗, freedom from convention or routine.** Escape from the
habitual, the one departure that breaks the pattern. **In a mark:** the single
allowed rule break. In my own vocabulary this is the grid broken once. Broken
twice and there is no grid.

**Seijaku, 静寂, tranquillity, stillness.** Quiet, active stillness, not
inertness. **In a mark:** no vibration. This is a contrast and edge property
before it is a composition property, and it is where a sub pixel stroke fails,
because a sub pixel stroke shimmers.

## 2.2 Ma, The Interval

間, literally gap, space, pause. Ma is the interval, and the designer's
responsibility is to determine the interval between things. In the modern
reading of the traditional arts it is an empty space that often holds as much
weight as everything around it, and it directs attention by intention rather
than by default.

The related and more specific term for our purposes is **yohaku no bi, 余白の美,
the beauty of blank space**, from the Zen ink painting of the feudal period,
where composition is deliberately left with space. In shodo the unpainted parts
of the sheet are called **yohaku** and are considered as carefully as the ink.
The distinction from Western negative space is the whole point: in Western
practice negative space is background supporting a subject, while yohaku
celebrates the blankness itself, and form and emptiness are held in mutual
balance rather than in a figure and ground relation.

**What this means for us, stated as a rule.** If ma is real in this mark then
the eye is a subject and not a gap, and it is therefore dimensioned first and
the stroke is dimensioned second. That inverts how the generator is written.
See 3.2.

## 2.3 Wabi, Sabi And Shibui, Which Are Not The Same Thing

They get collapsed and they are three different judgements.

**Wabi.** Subdued, austere beauty. The root wabu is to languish or to be
miserable. Wabi is about poverty, insufficiency and solitude as a position, and
the beauty available inside them. It is a stance of the maker and the owner.

**Sabi.** Rustic patina. Sabi is what time does to a thing: the surface, the
wear, the oxidation, the evidence of age. It is a property of the object.

**Wabi sabi**, the compound, is the acceptance of transience and imperfection,
beauty that is imperfect, impermanent and incomplete.

**Shibui, 渋い.** Originally a taste word, the sourness or astringency of an
unripe persimmon. As an aesthetic it is understated beauty, subtle elegance,
quiet refinement that looks simple and holds hidden depth and complexity, and
that grows on the viewer over repeated looking rather than announcing itself.

The distinction, stated as it is in the literature: shibusa is not to be
confused with wabi or sabi. Many wabi or sabi objects are shibui, but not all
shibui objects are wabi or sabi. Wabi and sabi objects can be severe and can
exaggerate intentional imperfection to the point of looking artificial. Shibui
objects are not necessarily imperfect or asymmetrical, though they may be.
Shibui is beauty emanating from within.

**Which of the three we want.** Shibui, and not wabi sabi. This is a diagnostic
instrument a person will look at every day for years. It must reward the
hundredth viewing and it must not perform imperfection. Deliberately distressed
edges on an app icon are wabi sabi cosplay and I will not ship them. The
argument for an irregular terminal in 3.6 is a shibui and koko argument about
how a real stroke ends, not a licence to add wear.

## 2.4 Enso, Which Is The Closest Living Practice To What We Are Drawing

円相. A single brush stroke that produces a circle, usually unclosed, in sumi
ink on washi. The mechanics are those of shodo.

**One breath.** The stroke is made in one fluid uninhibited movement, typically
on one breath, with the breath taken before the stroke begins.

**Never corrected.** No revision, no second pass. The circle stands as it was
made, complete in its imperfection, a record of one breath and one movement of
the arm. This is not a stylistic preference, it is the definition of the
practice. The associated state is mushin, no mind, the mind free of deliberate
thought.

**Open against closed.** A closed circle reads as wholeness and completion. An
open circle reads as growth, incompleteness, ongoing motion. Neither is more
correct. The usual reading of the open enso is that the circle is not separate
from, and not contained by, itself; it opens out to what is greater. The gap is
the statement.

**The ink.** The first character of a piece is written with a heavily laden
brush, which gives the initial spread called **nijimi, 滲み**, the deliberate
bleeding of ink into the paper, controlled by the wetness of the brush and the
absorbency of the sheet at the point of contact. The brush is then not re
dipped until necessary, so successive strokes grow scratchier, ending in
**kasure, 掠れ**, the dry brush, the broken textured trail where the bristles
read separately instead of as a continuous edge. Ink starvation at the tail of
an enso is therefore not damage and not a flourish. It is the timestamp. It
proves the circle was one continuous act on one loading, which is the whole
claim the form makes.

## 2.5 The Brush, Three Phases

The vocabulary, in Japanese, for the three phases of a single stroke:

    始筆  shihitsu   the beginning. How the brush is placed on the paper
                    to start the stroke.
    送筆  sohitsu    the sending. How the brush is operated while writing,
                    from the beginning of the stroke to its end.
    終筆  shuhitsu   the finish, also written 収筆. How the brush is lifted
                    off the paper to end the stroke, restoring it to its
                    former position.

The three endings have their own names and they are different gestures, not
variants of one: **tome**, stopped, the brush is pressed and lifted in place;
**hane**, flicked, the brush is turned and released upward; **harai**, swept,
the brush is drawn out until it thins away to nothing.

The point that matters for a generator. A stroke has three phases and its
first and third are not the same gesture and are never the same shape.

## 2.6 Kanji And Stroke Construction

Stroke order is not decoration, it is the grammar. The core rules: top to
bottom and left to right; horizontal strokes are written left to right and
verticals top to bottom; horizontal before vertical where they cross; outside
before inside; and where two diagonals meet, the one running from upper right
to lower left is written before the one running from upper left to lower right.

**Eiji happo, 永字八法**, the eight principles of the character ei, 永,
eternal. The character has been used for centuries to teach because the eight
strokes common to Chinese characters all occur in it, and frequent practice of
the eight was held to ensure beauty in one's writing. The eight:

    側  soku    the dot
    勒  roku    the horizontal
    努  do      the vertical
    趯  teki    the hook
    策  saku    the rising horizontal with an upward right ending
    掠  ryaku   the long sweep down to the left
    啄  taku    the short stroke down to the left
    磔  taku    the sweep down to the right

Two of these are directly our mark. Our ascent is a saku, a rising stroke. Our
exit is a magaku, the long sweep down to the right, which is the stroke that
characteristically thins away and is the archetype of harai. That is the
tradition's own instruction about how our exit should end, and we are not
following it.

Where weight falls. In a brushed stroke the weight is not at the middle of the
arc length. It is at the point of maximum pressure, which in a turning stroke
falls on the outside of the turn and slightly before the apex of the turn,
because the brush is loaded as it enters the corner and is already releasing as
it leaves. A stroke whose weight plateau is centred on the turn reads as
mechanical.

## 2.7 Notan

Notan, 濃淡, from no, thin or watery, and tan, heavy or thick. The term means
dark and light and refers to the quantity of light reflected, to the massing of
tones of different values, and to the interaction of heavy and light elements.
Arthur Wesley Dow carried it into Western teaching in Composition, 1899, with
line, notan and colour as the three elements. Notan beauty is the harmony
resulting from the combination of dark and light spaces, coloured or not, in
buildings, pictures or nature.

The balance rule that comes with it: an equal distribution of light and dark
produces symmetrical balance, which reads as peaceful, stable and static. An
unequal distribution produces asymmetrical balance, which reads as energetic,
with dynamic tension, and is the one used for dramatic effect. Notan is
measured in two values only, so the discipline is to reduce a design to black
and white and look at the massing, which is precisely what our mark already is:
one fill, no outline, no tone.

## 2.8 Mon And Kamon

The closest historical object to what we are making: a tiny monochrome mark
built on a circle, made to work at the size of a sleeve badge and at the size
of a roof tile.

What the sources establish. Kamon are Japanese crests, usually set in a
circular arrangement, and they are black and white. The motif and not the
colour carries the meaning, so the same crest drawn in any colour is still the
same crest. The designs are made of precise circles and straight lines and many
can be constructed with compass and ruler alone. The construction order is
explicit: where the crest must be a given diameter, for instance to cut a
stencil for cloth, you begin by drawing the outer circle that will bound the
design, and then, because so many designs carry rotational or reflection
symmetry and belong to a cyclic or dihedral group, you inscribe that circle
with a regular polygon. Motifs fall into five groups: animals, plants, natural
phenomena, buildings and vehicles, and geometric patterns. Compared with
Western heraldry the tendency is towards minimalism, symmetry and natural
motifs, with motifs balanced precisely inside the circle using compass and
geometric guidelines.

Two rules I take from this and will hold us to.

**The bounding circle is drawn first and everything is dimensioned inside it.**
Our generator does the opposite. It sets H equal to 100, derives a width from
it, and lets the ink land where it lands. Measured, our ink occupies x from 4.75
to 61.00 and y from 10.75 to 100.00 of a 61.80 by 100 box, and the outline
itself runs from y 10.804 to y 100.248, so it leaves the box at the bottom. A
mon is never drawn out of its circle.

**A kamon is symmetric and a Zen ink mark is not, and we have to choose.** The
mon tradition favours symmetry because it is a badge, repeated, woven, stamped.
The enso tradition forbids it because it is a record of a gesture. Ours is the
second. We take the mon's construction discipline and the enso's asymmetry, and
we do not average them.

## 2.9 Where The Two Bodies Agree

They agree on one thing, from opposite directions, and it is the finding of
this whole report. Hubner's 80 percent for continuous curvature and shizen's
requirement that the gesture not look constructed are the same requirement.
A curvature discontinuity is what a made thing has and a moved thing does not.

---

# Part 3. Judgement On The Mark, And The Changes

## 3.0 What The Mark Currently Is, Measured

Constants as exported: PHI 1.6180339887, H 100, W 61.8034, R 9.0170,
CROSS 38.1966, EYE 9.0170. WMAX is R times 0.90 equals 8.1153. Turn 315
degrees, four arcs of 78.75 degrees. Width profile has three weights a factor
of phi apart, thin 3.1005, mid 5.0155, max 8.1153.

Derived and rasterised:

    2R                              18.034
    outer blob, 2R + WMAX           26.149
    eye aperture, 2R - WMAX          9.918
    eye / outer                      0.3793
    WMAX / R                         0.900
    outline bounds            x 4.650 to 61.001, y 10.804 to 100.248
    ink coverage of the box         16.2 percent, constant across sizes
    ink centroid                    54.5 percent across, 47.2 percent down
    ink above the crossing           27.6 percent
    ink below the crossing           72.4 percent
    ascent arc length               75.78
    exit arc length                 79.22
    exit / ascent                    1.0455
    left reach from the loop axis   32.02
    right reach from the loop axis  21.75
    right / left reach               0.6792
    entry cap                       flat chord, 3.10 wide
    exit cap                        flat chord, 3.10 wide
    curvature, ascent end            0.0022
    curvature, the loop              0.1109
    curvature, exit start            0.0068
    circle fidelity                 max radial error 0.0265 units,
                                    0.29 percent of R

At the sizes it is actually used, rasterised at supersample 10:

    height  grid    ink     solid px  fringe px  fringe/ink  eye
    14px    9x14    19.6px  1         49         2.50        1px
    22px    14x22   48.3px  7         89         1.84        4px, 2x2
    44px    27x44   193px   102       185        0.96        18px, 5x5
    72px    44x72   518px   404       229        0.44        47px, 8x8
    300px   185x300 8988px  8495      981        0.11        783px, 32x32

    at 14px:  WMAX 1.14px   eye aperture 1.39px   entry tip 0.43px
    at 22px:  WMAX 1.79px   eye aperture 2.18px   entry tip 0.68px

Contrast, computed against each ground the presentation shows it on, as
required by WCAG 1.4.11 non text contrast, floor 3:1:

    #D6A93B on #0F0F10  Dark    8.76 : 1    pass
    #D6A93B on #141414  Punch   8.42 : 1    pass
    #D6A93B on #F7F6F3  Snow    2.02 : 1    FAIL, 33 percent under
    #D6A93B on #FFFFFF  Glass   2.19 : 1    FAIL, 27 percent under
    #A87F27 shade on #FFFFFF    3.66 : 1    pass
    #F0C85A lift on #FFFFFF     1.60 : 1    FAIL badly

## 3.1 Squint. Six Feet, Eyes Half Closed

**Petra.** The shape reads as a lasso. Not a soul, not an eye, not awareness: a
rope with a loop at the top and a tail. The eye order is wrong. First landing is
the curl at the crown, correct. Second landing is the long left leg, which is
the heaviest single element at 43.5 percent of the ink below the crossing.
Third is the right leg at 28.9 percent. The eye, which by 2.2 should be the
subject, is not in the first three at all. At 44 pixels and below it is not in
the shape at all.

**Mika.** The mark is bottom heavy and it is reading as a descender. Ink by
horizontal third is 38.3 top, 36.1 middle, 25.6 bottom, which sounds fine, but
the centroid sits at 47.2 percent down while the curl that carries the meaning
sits at 23.6, so the optical centre of the mark and the semantic centre of the
mark are 24 percent of the height apart. Set beside a lowercase wordmark, this
will look like it has fallen off the baseline.

**Bjorn.** The name is now awareness, lowercase, so the mark will sit against
an x height, not a cap height. Nothing in the generator knows that. There is no
x height reference, no baseline, no overshoot allowance, and the mark's own
bottom is clipped at exactly y equals 100, which means it has been built to sit
on a baseline it will then overshoot by 0.248 units and be cut off by the
viewBox instead. This is a type problem and it has not been addressed.

## 3.2 Where It Obeys The Rules

Credit first, because there is real work here.

**Kanso, and it is emphatic.** One path, one fill, no outline, no filter, no
second element. The offset centreline construction rather than a stroked path is
the right decision and the file's own reasoning for it is correct. This is the
mark's best quality and no change below touches it.

**Notan is genuinely scale invariant.** Ink coverage is 15.5, 15.7, 16.3, 16.4
and 16.2 percent at 14, 22, 44, 72 and 300 pixels. The massing does not drift
with size. That is a real achievement of the width profile approach and most
marks do not have it.

**Notan asymmetry is correct in direction.** 16 percent ink to 84 percent
ground is a strongly unequal distribution, which by 2.7 gives asymmetrical
balance and dynamic tension rather than static peace. For a mark about
awareness that is the right side of the rule.

**The circle really is a circle.** I suspected the arc handle scaling, k equals
K times R times theta over a quarter, was wrong for 78.75 degree arcs, and it
is very slightly long: 4.3575 against the exact value 4.3018 from four thirds R
tan theta over four. I measured before asserting, per this project's own rule.
The maximum radial error is 0.0265 units, 0.29 percent of R. That is inside
any tolerance we care about and I withdraw the complaint. The file's argument
for a circle over two free cubics, that it keeps the curl round at every size
and makes the counter an almond rather than a wedge, holds.

**The horizontal asymmetry is nearly right.** Right reach over left reach is
0.6792 against 1/phi at 0.6180, so 9.9 percent long. Fukinsei is being served
on this axis and only needs tightening.

**Datsuzoku, once.** The 315 degree turn, going the long way round rather than
closing at 360, is the one convention break and it is the right one to have
chosen. It stays.

## 3.3 Defect. The Mark Fails Its Own 14 Pixel Brief

**Mika and Bjorn.** At 14 pixels tall, on a 9 by 14 grid, the mark puts down
19.6 pixels of ink of which **1 pixel is fully covered and 49 are partial**. The
ratio of fringe to ink is 2.50. Ninety five percent of the mark at its most used
size is antialiasing, not gold. The heaviest part of the brush renders 1.14
pixels wide. The entry and exit tips render 0.43 pixels wide, which on any
display is a grey suggestion at roughly 40 percent coverage. Combined with the
2.19:1 base contrast on Glass, the effective contrast of the tips against white
is in the region of 1.4:1. At 22 pixels it is still 7 solid pixels against 89
partial.

This is the 226 centimetre ceiling from 1.6. The system is internally
consistent and the dimension is wrong in the room. It is not a rendering
problem and it is not fixable with a hinting trick. R equals H over phi to the
fifth, which is 9.02, is simply too small a radius to survive being rendered
14 pixels tall.

**What it moves the grade to.** This alone is the difference between C plus and
B plus. Nothing else in this report matters as much.

## 3.4 Defect. Two Curvature Discontinuities, Which Is The Finding Both Bodies Converge On

**Sol found this one, looking for where the light would break.** Compute the
exact curvature at the joins from the Bezier derivatives rather than by finite
difference:

    ascent, at its end       0.0022
    the loop                 0.1109      a jump of 50.8 times
    the loop                 0.1109
    exit, at its start       0.0068      a jump of 16.2 times

The joins are tangent continuous, G1, and curvature discontinuous, not G2. The
stroke arrives at the curl as a near straight line and instantly becomes a
circle of radius 9.02. That is exactly the defect Hubner measured at about 80
percent dislike, and it is exactly what shizen calls a thing that is trying,
because a moving brush cannot change curvature instantaneously and an arm
cannot either. At 300 pixels you can see it: the ascent goes into the curl with
a visible corner in the highlight even though there is no corner in the outline.

Note the correct scope. The loop should stay a circle. An enso is a circle and
the file's reasoning for the circle is right. The defect is only at the two
joins, and the fix is to make each leg leave the join with curvature equal to
1 over R rather than with curvature near zero.

## 3.5 Defect. The Stroke Does Not Cross Itself, And CROSS Is A Fiction

**Mika.** The brief says it crosses its own line. It does not. I intersected the
ascent and exit centrelines at 800 samples each. There is no intersection. The
nearest approach is **1.396 units**, and it occurs at y equals 28.44, where the
ascent has already terminated on the circle and the exit sweeps past it.

The exported constant CROSS equals cy plus R phi equals 38.1966, which is H over
phi squared, a clean phi expression that describes nothing. The nearest thing to
a crossing in the actual geometry is 9.76 units away from it, which is 9.8
percent of the whole height of the mark.

The eye closes anyway, because the brush is 8.1 wide at that point and 1.396 of
separation is swallowed. So the mark looks like it crosses and does not. The
consequence is structural, not pedantic: a stroke that touches reads as a rope
laid over itself, and a stroke that crosses reads as one continuous act. This is
the difference between the mark being a knot and being an enso.

I solved for the turn at which a true crossing appears, holding everything else:

    315.0 deg, 3.500 quarters    no crossing, nearest 1.430
    324.0 deg, 3.600 quarters    no crossing, nearest 0.778
    333.0 deg, 3.700 quarters    no crossing, nearest 0.322
    337.5 deg, 3.750 quarters    no crossing, nearest 0.160
    342.0 deg, 3.800 quarters    TRUE CROSSING at (30.69, 28.80)
    351.0 deg, 3.900 quarters    TRUE CROSSING at (30.66, 28.88)

## 3.6 Defect. Both Terminals Are Flat Machined Chords, And They Are Identical

**Petra and Bjorn, jointly, and this is the ugly one.** The outline's first two
points are (4.650, 99.750) and (7.710, 100.248). That is a flat chord
perpendicular to the path, 3.10 units long, which is exactly width(0). The last
two points are the same thing, 3.10 units, at the other end.

So the mark has two guillotined ends of identical width. Three separate
violations in one defect.

It violates **shuhitsu and shihitsu**, 2.5: a brush has three phases and the
first and third are different gestures. Here they are the same number.

It violates **koko**, 2.1, and the whole logic of **kasure**, 2.4: an enso's
tail thins away because the ink ran down, and that thinning is the proof the
circle was one continuous act on one loading. A perpendicular cut is the proof
that it was not.

It violates **fukinsei**, 2.1: width(0) equals width(1) equals 3.1005, exactly
equal, to the last digit, which is the single most symmetric fact in the mark.
The generator's own comment even says both legs carry weight and only the last
few units of the exit thin out, and then it ends both legs on the same number.

And the entry chord is clipped. The outline reaches y equals 100.248 against a
viewBox bottom of 100, so the lower corner of an already flat cut end is sliced
off by the frame. A mon is never drawn out of its circle, 2.8.

By 2.6 the exit is a magaku, the long sweep down to the right, which is the
archetype of **harai**. Harai ends at nothing. Ours ends at 3.10.

## 3.7 Defect. The Two Legs Are Too Symmetric, By 4.6 Percent

You asked me to say where it is too symmetric and by how much, so here it is
precisely.

**Petra.** Arc lengths: ascent 75.78, exit 79.22. Ratio 1.0455. The two legs of
this mark are within **4.6 percent of being the same length.** By fukinsei and
by the ikebana shin, soe and hikae rule, no two of three elements should be
equal, and the two that are nearest to equal here are the two most visible.

The launch and landing angles compound it. The ascent leaves its foot at 80.8
degrees. The exit lands at minus 42.6 degrees. Their chord angles are plus 71.0
and minus 67.0, which is **4.0 degrees from a perfect mirror**. Two strokes of
the same length leaving at mirrored angles is a V, and a V is a symmetry axis.
The only reason the mark does not read as symmetric overall, and the measured
mirror IoU about the box centre is only 27.6 percent, is that the loop sits off
to one side. The loop is doing all the asymmetry work and the legs are fighting
it.

Compounding again: the foot lands at y equals 100.00 and the tip at y equals
94.00, **6.00 units apart on a 100 unit mark**. Both legs effectively land on
the same line. Three elements, two of them at the same height, the same length
and mirrored angles.

## 3.8 Defect. The Eye Is A Leftover, Not A Subject, And Its Ratio Is Wrong By 52 Percent

You asked what ma does to the ratio of the eye to the outer diameter. It changes
which one is derived from the other, and it changes the number.

**Mika.** The generator's own comment, measured off the drawing, says the eye it
leaves open is about a quarter of the outer diameter. Measured from the
generator as written:

    eye aperture, 2R - WMAX      9.918
    outer blob, 2R + WMAX       26.149
    eye / outer                  0.3793
    stated intent                0.25
    error                        +51.7 percent

And the second stated measurement from the drawing is missed in the other
direction. The comment says the weight is roughly 1.2 times the radius. As
built, WMAX over R is 0.900, which is **25 percent under** the stated intent.
The mark is simultaneously too thin for the drawing and too open for the
drawing, and the two errors are the same error, because both follow from the
single non phi constant 0.90.

**Which is the real defect.** The eye is computed as a residue. It is whatever
is left when a brush of an arbitrary width is dragged round a circle of an
arbitrary radius. By 2.2 that is exactly backwards. If ma is real here, the eye
is dimensioned and the brush follows.

## 3.9 Defect. EYE Is A Constant That Cancels To Nothing And Then Lies

**Bjorn.** Line 42:

    const EYE=R*2-R*PHI/PHI;        /* the slit the curl leaves open */

`R*PHI/PHI` is R. The expression is `2R - R`, which is R. EYE evaluates to
9.0170, identical to R, and I confirmed it: R equals 9.016994, R times PHI over
PHI equals 9.016994, EYE equals 9.016994.

Three things wrong. It is not the eye; the eye is 9.918, so the exported
constant is 9.1 percent off the thing it is named for. It is a multiplication
and division by the same number dressed up as a phi relation, in a file whose
header states that every proportion below is phi or a power of phi and nothing
here is a number that looked right. And it is exported in the public interface,
so any consumer reading EYE gets R.

This is the post rationalisation of 1.5, committed against ourselves. It is the
Pepsi document in one line, and it is worse there than in a pitch deck, because
here it is in the source.

## 3.10 Defect. The Gold Fails The Contrast Floor On Two Of The Four Lightings

**Sol.** #D6A93B has a relative luminance of 0.4299. It is a mid value. A mid
value cannot serve as a single ink on both a 0.006 luminance ground and a 1.000
luminance ground, and it does not.

    Dark   #0F0F10   8.76 : 1   pass, comfortably
    Punch  #141414   8.42 : 1   pass
    Snow   #F7F6F3   2.02 : 1   fail, floor is 3:1, 33 percent under
    Glass  #FFFFFF   2.19 : 1   fail, 27 percent under

WCAG 1.4.11 sets 3:1 for non text graphical objects needed to understand the
content, and this mark is the product's identity, so it qualifies. Two of our
four lightings are below the floor, and on the same two the brush at 14 pixels
is 1.14 pixels wide, so the failure compounds: a sub pixel edge at 2.19:1 is not
a thin gold line, it is nothing.

The presentation makes it worse by offering #F0C85A as lift, which is 1.60:1 on
white, and it is only labelled for motion, but a lift colour that is invisible
on half the grounds is not a lift colour.

The shade #A87F27 gets 3.66:1 on white and 3.39:1 on Snow, so the answer exists
and the system has to admit it: **the mark needs a ground dependent ink.** That
contradicts the presentation's claim that the mark is #D6A93B and nothing else,
and the claim is the thing that has to go, not the contrast.

For reference, against the seat colours at the same grounds, this is a general
property of the palette and not special to the gold: accent #7EB8D4 is 8.84:1
on Dark and 2.17:1 on white; Solar #D4BC70 is 10.24:1 and 1.87:1. The muted mid
value palette is a dark ground palette. On light grounds every one of these
needs a darker sibling.

## 3.11 Defect. The Presentation Breaks Two House Rules

**Mika.** Not the mark, but mine to call.

`reviews/soul-loop.html` sets `h2{...text-transform:uppercase...}` and runs
every section head in caps with 0.14em tracking. The house rule is no all caps,
sentence case. The headings are also in title case in the source text, which is
correct for a header, and then transformed to caps by CSS, which is not.

And the file is titled The Soul Loop, the generator is `soulloop.js`, and the
mark is now awareness. The rename has not landed anywhere. One word per concept:
right now we have three words for one mark.

---

# Part 4. The Changes. Numbered, With Constants And Values

Two masters, because 3.3 and 3.8 cannot both be satisfied in one set of
constants at 14 pixels. That is not a compromise, it is what optical sizing
means, and a type family solves it the same way: the small size gets larger
counters and relatively lighter weight, the display size gets the true
proportions. Optima, 1.5, is built on exactly this kind of relation between x
height and the ascender span.

The system that falls out is cleaner than either master alone, and it was not
designed for elegance, it was derived from the pixel arithmetic and then checked
against phi.

    In both masters:   WMAX = 2H / phi^5 = 18.034
    Display master:    R = H / phi^4 = 14.590,  so WMAX = 2R / phi
    Small master:      R = H / phi^3 = 23.607,  so WMAX = 2R / phi^2

One brush, 18.034 units wide, in both. Only the radius changes, by exactly one
power of phi. That is the correct physical model: the same brush, a bigger
circle. And the two eye ratios that result are both exact phi family constants,
which I verified rather than assumed:

    display:  (1 - 1/phi)   / (1 + 1/phi)   = 0.236068 = 1/phi^3
    small:    (1 - 1/phi^2) / (1 + 1/phi^2) = 0.447214 = 1/sqrt(5)

1 over root 5 is not a coincidental number. It is the constant in Binet's
formula and it is the Hurwitz bound from 1.3. Both masters' counters are
governed by phi, and neither number was chosen to be pretty.

### Change 1. R, Display Master

    was:  const R = H/(PHI*PHI*PHI*PHI*PHI);   //  9.017
    to:   const R = H/(PHI*PHI*PHI*PHI);       // 14.590

**Serves:** 3.3, the 14 pixel failure, and 2.8, the mon rule that the bounding
circle governs. **Measured effect**, simulated: at 14 pixels, solid pixels go
from 1 to 15, fringe to ink falls from 2.50 to 1.30, WMAX renders 2.52 pixels
instead of 1.14, ink coverage rises from 15.5 to 31.7 percent. Note the side
effect that cy becomes R phi squared equals 38.197, which is H over phi
squared, so the loop centre lands on the golden section of the height. That was
not aimed at.

### Change 2. WMAX, And Kill The 0.90

    was:  const WMAX = R*0.90;                 // 8.115, and 0.90 is not phi
    to:   const WMAX = 2*R/PHI;                // 18.034 at the new R

**Serves:** 3.8, both stated intentions from the drawing, and the file's own
header claim. 2 over phi is 1.236068. The drawing's measured weight to radius
was 45 over 38 equals 1.184 and was stated as roughly 1.2. So 2R over phi hits
the drawing at 4.4 percent, against the current 0.90 which misses it by 25
percent. And it makes the eye ratio exactly 1 over phi cubed equals 0.2361,
against the drawing's stated quarter. **One constant change lands both
measurements the file already claimed and removes the only non phi number in
the geometry.**

### Change 3. The Small Master, For Anything At Or Below 24 Pixels

    R    = H/(PHI*PHI*PHI)   = 23.607
    WMAX = 2*R/(PHI*PHI)     = 18.034

**Serves:** 3.3 and 2.2 together, which is the only way to serve both.
**Measured:** eye aperture 29.18 units, which is 4.09 pixels at 14 and 6.42 at
22, against 1.39 and 2.18 now. WMAX 2.52 pixels at 14. Tip at WMAX over phi
squared is 0.96 pixels, so effectively one pixel rather than 0.43. eye over
outer is 0.4472, exactly 1 over root 5. The eye survives at 14 pixels, which is
the whole point, because by 2.2 the eye is the subject and a subject that
closes at the most used size is not a subject.

### Change 4. Turn, From 315 To 342 Degrees

    was:  const A1 = A0 + Q*3.5;     // 315 deg, no crossing, nearest 1.396
    to:   const A1 = A0 + Q*3.8;     // 342 deg, a true crossing

**Serves:** 3.5, and the brief, which says it crosses its own line. **Measured:**
at 3.8 quarters the ascent and exit centrelines genuinely intersect. Verified at
3.75 quarters they still do not, nearest 0.160, so 3.8 is the first value that
works and not an arbitrary one. Datsuzoku is preserved, since 342 is still not
360 and the stroke still goes the long way round without closing.

### Change 5. Curvature Match At Both Joins

Not a constant, a rule for the two leg cubics. The third control point of
segment 1 and the second control point of segment 6 currently sit at
`IN - R*1.6, IN + R*4.2` and `OUT + R*1.5, OUT + R*3.4`, which are free hand
handle lengths. They must instead be placed so that the leg's curvature at the
join equals 1 over R.

For a cubic with the join at P3 and tangent direction fixed, curvature at t
equals 1 is 2 times the perpendicular distance from P1 to the line P2 to P3,
over 3 times the squared length of P3 minus P2. Solve that for 1 over R and the
handle falls out.

**Serves:** 3.4, Hubner at 80 percent, and shizen. **Current error:** jumps of
50.8 times and 16.2 times. **Target:** 1.0 at both joins. This is the change
with the most evidence behind it of anything in this report.

### Change 6. Asymmetric Terminals. Different Gestures, Different Numbers

    was:  width(0) = thin = WMAX/PHI/PHI      // 3.1005
          width(1) = thin*PHI/PHI = thin      // 3.1005, identical
    to:   width(0) = WMAX/(PHI^4)             // a landed point, shihitsu
          width(1) = 0                        // harai, swept to nothing

For the exit, replace the final segment of the profile with a power law that
reaches zero:

    return mid * Math.pow(1 - (t-0.86)/0.14, PHI);

**Serves:** 3.6, so shihitsu against shuhitsu from 2.5, harai from 2.6, kasure
and the one loading argument from 2.4, koko from 2.1, and fukinsei because the
two ends stop being the same number. **On the sub pixel objection:** a tip that
vanishes at 14 pixels is correct, not a defect. That is what kasure looks like.
What is not acceptable is a 3.10 wide flat cut, which at 14 pixels is a 0.43
pixel grey stub, and reads as a rendering error rather than as a brush.

### Change 7. Leg Lengths, To 1 Over Phi

    current: ascent 75.78, exit 79.22, ratio 1.0455
    target:  exit / ascent = 1/phi = 0.6180

Shorten the exit, do not lengthen the ascent, because the horizontal reach ratio
is already 0.6792 and favours the left; making the exit the short leg agrees
with the asymmetry the mark already has instead of fighting it. The constants are
segment 6's endpoint, currently `[Wd*0.97, H-H*0.06]`, and the exit handle
multipliers.

I ran a grid search over the four leg handle constants and the two endpoints,
requiring a true crossing and no overflow of the box. Best found was **0.8276**,
with the ascent at 59.33 and the exit at 49.10, a true crossing at (25.97,
46.63), and 0.266 units of residual overflow. So 0.618 is not reachable by
moving handles alone at these values; the exit endpoint has to come in, towards
roughly `[Wd*0.88, H-H*0.24]`. **Serves:** 3.7, fukinsei, shin soe hikae.

### Change 8. Stagger The Two Feet

    current: foot at y 100.00, tip at y 94.00, 6.00 units apart on a 100 mark
    target:  at least H/phi^3 = 23.6 units apart

Both legs currently land on the same line, which is the second half of the
symmetry defect in 3.7 and the reason the mark reads as a V with a loop. Raise
the exit tip. Change 7's suggested endpoint already does most of this, putting
the tip at 76 and the foot at 100, a stagger of 24.0 units against a target of
23.6.

### Change 9. Get The Ink Back Inside The Box

    current: outline y runs to 100.248, viewBox bottom is 100
             outline x runs from 4.650, and ink from 4.75, so 4.75 units of
             dead margin on the left against 0.80 on the right

**Serves:** 2.8, the mon rule, and 3.1's baseline problem. Two options and they
are not equivalent. Either pull segment 1's foot up to `H - width(0)/2` so the
cap sits on the frame instead of through it, which is the right answer if the
mark's bottom is a baseline, or set an explicit overshoot band and grow the
viewBox to hold it, which is the right answer if the foot is a descender. That
is a decision about the wordmark and it is yours, not mine. But the current
state, a flat cut clipped by 0.248 units with no stated intent, is neither.

### Change 10. Ground Dependent Ink

    Dark, Punch:   #D6A93B    8.76 and 8.42 : 1     keep
    Snow, Glass:   #A87F27    3.39 and 3.66 : 1     new, and required

**Serves:** 3.10 and WCAG 1.4.11. #A87F27 is already in the presentation as
shade, so nothing new is being invented; it is being promoted from a motion
highlight to a lighting variant. The token is semantic and names what it does:
`--mark-ink`, redefined per lighting, never `--gold`. Retire #F0C85A as a lift
on light grounds, where it is 1.60:1.

**Sol's note on why this is not a compromise of the identity.** A mon carries
its meaning in the motif and not the colour, 2.8, and the same crest in any
colour is the same crest. Two values of one hue is well inside that rule. What
is outside it is a mark you cannot see.

### Change 11. Rename, And Fix The Presentation

    tools/soulloop.js          ->  tools/awareness.js
    reviews/soul-loop.html     ->  reviews/awareness.html
    <title>The Soul Loop</title>  ->  awareness
    h2{text-transform:uppercase} ->  delete the declaration

**Serves:** one word per concept, and the house rule against all caps. The
headings are already in title case in the source, so deleting the transform is
the entire fix.

---

# Part 5. What The Enso Tradition Says We Are Getting Wrong

Four things, and they are not the same as the defects above. These are about
what the form is, not about whether the numbers are right.

**One. It is not one stroke, it is six, and one of them is a fiction.** The
generator emits six segments and the joins between them are visible as
curvature breaks, 3.4. An enso is defined by being one continuous act; the
tradition's whole claim rests on that. Our mark is assembled and then made to
look continuous. Change 5 is the minimum repair. The deeper reading is that the
width profile, which is keyed to normalised t across six equal segments, is
pretending to be a pressure record and is actually a piecewise linear ramp with
plateaux at 0.17, 0.30, 0.62 and 0.86. A real pressure record does not have
corners in it. The profile should be a single smooth function of arc length, not
a five case switch on segment fraction.

**Two. The weight is in the wrong place along the turn.** By 2.6, in a turning
brushed stroke the maximum pressure falls on the outside of the turn and
slightly before its apex, because the brush is already releasing as it leaves.
Our profile holds WMAX flat from t 0.30 to t 0.62, which is 32 percent of the
whole stroke at a constant maximum, centred almost exactly on the curl. A
constant maximum across a third of a stroke is not a brush, it is a pen. The
plateau should be a single maximum, placed before the apex of the turn, and it
should fall away on both sides.

**Three. We have not decided whether the enso is open or closed, and the mark
currently answers both.** By 2.4 this is the one real choice the form offers,
and neither answer is more correct, but you have to make it. A closed circle
says wholeness and completion. An open circle says growth, incompleteness,
ongoing motion, and the standard reading is that it opens out to what is
greater. Our mark turns 315 degrees, so it is geometrically open by 45 degrees,
and then the brush is fat enough that the gap fills in and it reads closed. We
are getting the semantics of a closed enso while writing the geometry of an
open one. For a product called awareness, about a person in process, the open
enso is obviously the right reading, and it requires the gap to be visible, at
14 pixels, on all four lightings. Change 3 makes that possible. Nothing else in
this report does.

**Four. We have no account of the ink running out, and that is the signature.**
By 2.4 the sequence within one loading is nijimi and then kasure: a spread where
the laden brush lands, then progressive drying, ending in a broken feathered
trail. The mark's width profile currently starts thin, fattens, and ends thin at
exactly the same width it started, 3.1005 both ends, 3.9. That is the profile of
a stroke made with a pen that was refilled on the way round. It reads as
reversible. An enso is not reversible; you can tell which end was first by
looking at it, and that is most of what makes it a record of one breath rather
than a shape.

Change 6 is the minimum fix, an asymmetric pair of terminals with the exit
going to zero. The complete fix is that the profile should be monotonically
decreasing in ink from the apex of the turn to the tail, with no recovery, so
that the tail is unambiguously the end. Right now, hand the mark to a stranger
and ask which end the brush started at. From the geometry alone, they cannot
tell. That is the thing the enso tradition would say we have most fundamentally
got wrong, and it is not a measurement, it is a reading.

---

# Grade

    as it stands                                          C plus
    with changes 1, 2, 3 and 10, the legibility and
      contrast floor                                      B plus
    with 4, 5 and 6, the crossing, the curvature and
      the terminals                                       A minus
    with 7, 8 and 9, the asymmetry and the box            A minus, held
    with part 5 items one, two and four, the profile
      rewritten as one smooth function of arc length      A

The ceiling is at A and not above it, because the mark is still a construction
and not a gesture. To go past A the centreline itself has to come from a drawn
stroke, sampled, rather than from six Beziers dimensioned in phi. That is the
next conversation and it is a bigger one.

---

# Sources

Golden ratio.
Markowsky, Misconceptions about the Golden Ratio, The College Mathematics
Journal 23(1), 1992, 2 to 19, https://www.tandfonline.com/doi/abs/10.1080/07468342.1992.11973428
and https://eric.ed.gov/?id=EJ445071
Devlin, Fibonacci and the Golden Ratio Exposed, Museum of Mathematics, 2011,
http://www.infocobuild.com/education/public-lectures/mathematics/fibonacci-and-the-golden-ratio-exposed-by-keith-devlin.html
and Devlin's Angle, http://devlinsangle.blogspot.com/2017/04/fibonacci-and-golden-ratio-madness.html
and https://ed.stanford.edu/in-the-media/golden-ratio-designs-biggest-myth-features-keith-devlin
Myth busting the Golden Ratio, University of Edinburgh Science Media,
https://eusci.org.uk/2020/07/29/myth-busting-the-golden-ratio/
Hubner, Golden spiral or Fibonacci spiral: Which is more beautiful and why?,
i-Perception, 2024, https://journals.sagepub.com/doi/10.1177/20416695241243319
and https://pubmed.ncbi.nlm.nih.gov/38600988/
Green, All that glitters: a review of psychological research on the aesthetics
of the golden section, Perception 24, 1995,
https://journals.sagepub.com/doi/10.1068/p240937
Hoge, Fechner's Experimental Aesthetics and the Golden Section Hypothesis
Today, 1995, https://journals.sagepub.com/doi/10.2190/UHTQ-CFVD-CAU2-WY1C
Phillips and Norman, Fechner's Aesthetics Revisited, 2010,
https://www.wku.edu/psychological-sciences/labs/vision_and_haptics/downloads/phillips_norman_aesthetics2010.pdf
The golden ratio and aesthetics, plus.maths.org,
https://plus.maths.org/golden-ratio-and-aesthetics
Golden spiral, https://grokipedia.com/page/Golden_spiral and
Logarithmic spiral, https://grokipedia.com/page/Logarithmic_spiral
Golden Gnomon, Wolfram MathWorld, https://mathworld.wolfram.com/GoldenGnomon.html
Bartlett, Nautilus Spirals and the Meta-Golden Ratio Chi, Nexus Network
Journal, 2018, https://link.springer.com/article/10.1007/s00004-018-0419-3
Peterson, Sea Shell Spirals, Science News,
https://www.sciencenews.org/article/sea-shell-spirals and
https://sites.millersville.edu/rumble/Math.457/nautilus.pdf
Okabe, Biophysical optimality of the golden angle in phyllotaxis, Scientific
Reports, 2015, https://www.nature.com/articles/srep15358
Strauss et al, Phyllotaxis: is the golden angle optimal for light capture?,
New Phytologist, 2020, https://nph.onlinelibrary.wiley.com/doi/10.1111/nph.16040
Sunflowers and Fibonacci: Models of Efficiency, ThatsMaths,
https://thatsmaths.com/2014/06/05/sunflowers-and-fibonacci-models-of-efficiency/
Markov constant, https://en.wikipedia.org/wiki/Markov_constant and
Cook on rational approximation of phi,
https://www.johndcook.com/blog/2009/05/19/golden-ratio-rational-approximation/
Brown, More Meaningful Typography, A List Apart,
https://alistapart.com/article/more-meaningful-typography/
Rendle, Typographic scales, https://robinrendle.com/adventures/typographic-scales/
Mortensen, The typographic scale,
https://spencermortensen.com/articles/typographic-scale/
Canons of page construction, https://en.wikipedia.org/wiki/Canons_of_page_construction
and Retinart, The Secret Law of Page Harmony,
https://retinart.net/graphic-design/secret-law-of-page-harmony/
Optima, https://en.wikipedia.org/wiki/Optima
Modulor, https://en.wikipedia.org/wiki/Modulor and Unite d'Habitation of
Berlin, https://en.wikipedia.org/wiki/Unit%C3%A9_d%27Habitation_of_Berlin and
Fondation Le Corbusier,
https://www.fondationlecorbusier.fr/en/work-architecture/achievements-unite-dhabitation-berlin-germany-1955-1958/
Debunking The Myth Of Apple's Golden Ratio, Fast Company,
https://www.fastcompany.com/1672682/debunking-the-myth-of-apple-s-golden-ratio
Arnell Group, BREATHTAKING Design Strategy, 2008,
https://archive.org/details/breathtaking-design-strategy-pepsi-gravitational-field-arnell-group-august-4-2008
and https://www.fastcompany.com/1160304/pepsi-logo-design-brief-branding-lunacy-max
and https://www.creativebloq.com/news/never-forget-that-utterly-ridiculous-pepsi-logo-design-document
G2 continuity in UI design,
https://medium.com/design-bootcamp/beyond-border-radius-understanding-g2-continuity-in-ui-design-e21608d9fcd3

Japanese aesthetics.
Hisamatsu Shin'ichi, Zen and the Fine Arts, trans. Gishin Tokiwa, 1971,
https://books.google.com/books/about/Zen_and_the_Fine_Arts.html?id=qBzqAAAAMAAJ
and https://terebess.hu/zen/mesterek/hisamatsu.html
and An Introduction to Hisamatsu Shin'ichi's Religious Thought,
https://terebess.hu/zen/mesterek/Introduction-to-Hisamatsu.pdf
Lomas et al, Zen and the Art of Living Mindfully: The Health-Enhancing
Potential of Zen Aesthetics, Journal of Religion and Health, 2017,
https://link.springer.com/article/10.1007/s10943-017-0446-5
and https://pubmed.ncbi.nlm.nih.gov/28718052/
The 7 Principles of Japanese Aesthetics,
https://japaneserituals.com/guides/seven-principles-of-japanese-aesthetics/
and Koko, https://japaneserituals.com/koko/
and Fukinsei, https://japaneserituals.com/fukinsei/
and Shizen, https://japaneserituals.com/shizen/
7 Japanese Zen Aesthetic Principles That Define Wabi Sabi,
https://danslegris.com/blogs/journal/7-japanese-zen-aesthetic-principles-that-define-wabi-sabi
Zen Aesthetic Principles in Budo,
http://tomikiaikido.blogspot.com/2013/08/zen-aesthetic-principles-in-budo.html
Ma (negative space), https://en.wikipedia.org/wiki/Ma_(negative_space)
Ma: The Value of Empty Space in Japanese Art and Design,
https://www.themindfulword.org/empty-space/
Yohaku no bi: The Beauty of Empty Space, Seattle Japanese Garden,
https://www.seattlejapanesegarden.org/blog/2016/03/15/yohaku-no-bi-the-beauty-of-empty-space
Japanese Aesthetics of Space: Ma, Yohaku no Bi, and the Art of Subtraction,
https://danslegris.com/blogs/journal/japanese-aesthetics-of-space-ma-yohaku-no-bi-and-the-art-of-subtraction
The Beauty of Empty Space, Kogei Standard,
https://www.kogeistandard.com/insight/serial/editor-in-chief-column-kogei/ma-yohaku/
Wabi-sabi, https://en.wikipedia.org/wiki/Wabi-sabi and
Shibui, https://en.wikipedia.org/wiki/Shibui and
Japanese Aesthetic Sense Shibui, Kogei Standard,
https://www.kogeistandard.com/insight/serial/editor-in-chief-column-kogei/shibui/
Wabi, Sabi and Shibui, http://mercury.lcs.mit.edu/~jnc/nontech/wabisabi.html
What is the Japanese wabi-sabi aesthetic actually about?, The Conversation,
https://theconversation.com/what-is-the-japanese-wabi-sabi-aesthetic-actually-about-miserable-tea-and-loneliness-for-starters-220026
Enso, https://en.wikipedia.org/wiki/Ens%C5%8D and
Enso (円相): The Zen Circle and How to Draw It, https://japaneserituals.com/enso/
and The Enso Circle in Zen, https://theartofzen.org/the-enso-circle-in-zen-symbolism-and-artistry/
Beyond Calligraphy, Logic Behind The Magic, Brush Techniques Part III,
https://beyond-calligraphy.com/2012/02/28/logic-behind-the-magic-brush-techniques-part-iii-a/
and https://beyond-calligraphy.com/2012/03/15/logic-behind-the-magic-brush-techniques-part-iii-b/
Little Great Calligraphy Part I,
https://beyond-calligraphy.com/2011/12/22/little-great-calligraphy-part-i/
Japanese vocabulary list: Calligraphy terms,
https://selftaughtjapanese.com/2020/08/25/japanese-vocabulary-list-calligraphy-terms/
Eight Principles of Yong, https://en.wikipedia.org/wiki/Eight_Principles_of_Yong
Eiji Happo, Japanese Wiki Corpus,
https://www.japanesewiki.com/culture/Eiji%20Happo%20(the%20eight%20basic%20techniques).html
Eijihappo, The Eight Strokes of Shodo Calligraphy,
https://drawingandpaintingstudio.com/eijihappo-eight-strokes-shodo-calligraphy
The Sword, the Brush, and the Principles of Eight,
https://www.gohitsushodostudio.com/sword-brush-and-the-principles-of-eight/
Stroke order, https://en.wikipedia.org/wiki/Stroke_order and
Tofugu, Kanji Stroke Order, https://www.tofugu.com/japanese/kanji-stroke-order/
What Is Sumi-e?,
https://japan-clothing.com/blogs/japan/what-is-sumi-e-the-complete-guide-to-japanese-ink-painting
Notan, https://en.wikipedia.org/wiki/Notan
Dow, Composition, 1899, 1905 edition,
https://publicdomainreview.org/collection/dow-composition/
How to Create Strong Painting Compositions using Notan Design,
https://willkempartschool.com/how-to-use-notan-design-to-create-compelling-compositions-in-your-paintings/
Mon (emblem), https://en.wikipedia.org/wiki/Mon_(emblem)
Tabing, Mathematics in Drafting Japanese Crest Designs, Bridges 2018,
https://archive.bridgesmathart.org/2018/bridges2018-463.pdf
Kamon: Japan's Family Crests, Nippon.com,
https://www.nippon.com/en/japan-data/h01578/
Japanese Kamon, Charles Hosmer Morse Foundation,
https://morsemuseum.org/wp-content/uploads/2022/04/Japanese__Kamon_Lesson_Plan.pdf
Ikebana: The Japanese Art of Flower Arrangement and Its Zen Roots,
https://zenechoes.blog/arts-culture/ikebana-japanese-flower-arrangement/
Numeral Influences, North American Japanese Garden Association,
https://najga.org/appendix-b-numeral-influences/

Note on access. The agent proxy blocked direct fetching of most of these
domains, including Wikipedia, SagePub, NCBI and the Bridges archive. Where a
fetch was refused, the figures above come from search result extracts of those
same sources, and I have marked nothing as a direct quotation that I could not
read in full. Every number about our own mark was measured locally and is
reproducible from the scripts in the session scratchpad.
