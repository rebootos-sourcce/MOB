# Colour and symbol for Emmy: five lenses, plus what is known about colour, meaning and energy symbols, applied to Atüned and MOB
Researched 2026-10-15.
Lenses, not authorities: Emmy reviews through them, she never speaks for them. MOB canon governs symbol meaning.

---

**How to read this.** Every web fact was checked against search results that quoted or summarised
the source named beside it. This environment blocked direct page fetches, so the checks rest on source
text as search returned it. Full pages were not read. Quotes appear only where the exact words came
back with a URL. Everything else is paraphrase. **UNVERIFIED** marks anything that could not be
confirmed. **COMPUTED** marks numbers worked out in this pass from the build's own colour tokens
(method at the end of 2(a)). Canon references are `file:line`. The book is
`atuned/data/corpus/MOB_Complete_v192.txt`, cited as MOB with a line number.

Lance's brief: "Same thing with color theory and color psychology. We're going to connect that to the
energy symbols, because symbols convey a lot of meaning. We'll be baking in a lot of color and symbol
and ideas together, like a chakra color and the way that it looks, and then why it needs to look that
way."

---

# PART 0: WHAT THE CANON ALREADY RULES

Emmy respects these. Nothing in this file overrides them.

- **The seven are the card palette.** "The seven chakra colours are the only colours a card may speak
  in (1181)." `DESIGN_BIBLE.md:6`. The seven, with the distortion each holds: Root `#E0524B` Fear,
  Sacral `#F08A2E` Craving, Solar `#EFC53F` Pride, Heart `#4CD9A0` Grief, Throat `#3FC3E8` Silence,
  Brow `#6E8CF0` Doubt, Crown `#B77DE8` Separation, and Coherent with no colour, "discharge".
  `DESIGN_BIBLE.md:16-25`.
- **Card text in the chakra colours.** `ART_DIRECTION_BIBLE.md:13`.
- **Snow is a saturated rainbow.** "Light is the ring: Snow carries a saturated rainbow, red through
  violet, never a muted brown." `ART_DIRECTION_BIBLE.md:14`.
- **Gold stays, clean all around the ring.** `ART_DIRECTION_BIBLE.md:41, 46` (ruling 1233).
- **The geometry is fractal. Divine geometry.** `ART_DIRECTION_BIBLE.md:42`.
- **Icons.** "An icon is a 24-unit stroke drawing in the tool's colour, no fill, no text; a band is a
  disc in its colour." `ICON_SHEET.md:41`.
- **The field.** Coloured seat by seat in the band's colour at the strength that seat passes, "so the
  bands moving most are the bands that shine and a held seat goes dark." `OWNER_RULINGS.md:47`. The
  aura shows the dominant colour and what it means; "With nothing held, the heart leads."
  `OWNER_RULINGS.md:55, 59`.
- **The current, not Kundalini.** The crown and heart linked "as the diamond in the lotus"; the panel's
  word is "the current". `OWNER_RULINGS.md:63`.
- **The 2024 brand deck.** "Simple geometry: circles, triangles, squares" and "No sacred geometry or
  organic forms" (TULA brand deck, recorded at `.claude/emmy/voice_profile.md:118`).
- **The book's seven.** Root red, Sacral orange, Solar yellow, Heart green ("Seat of the Soul"),
  Throat blue, Third Eye indigo, Crown "Violet/White". MOB 901-913.
- **The book's shape of a chakra.** "A chakra is not a ring. It is a field held by three points, and
  open, it is a volume, not a circle. Under enough pressure it does not flatten. It collapses toward a
  single point." MOB 7104.
- **The book's first shapes.** "There is a mobile above a baby crib. Square, triangle, circle. Three
  colors." MOB 1525.
- **The book on colour as frequency.** Green is the heart range; warm colours energise, cool calm;
  "the body responds to the frequency, not the symbolic association." MOB 6340-6346. Green
  "accelerates the release speed by approximately one and a half times." MOB 6388.
- **The book's other geometry.** Two overlapping triangles, "diamond-lotus structure", upward triangle
  for the higher self and purpose, downward for what you do in the world (MOB 629). The upward and
  downward spiral (MOB 1203, 4535). The Merkaba, a star tetrahedron (MOB 6326). The torus (MOB 1633).

## Conflicts flagged, not resolved

- **C1. Sacred geometry.** The 2024 deck says no sacred geometry or organic forms. The art direction
  bible says "Divine geometry" (`ART_DIRECTION_BIBLE.md:42`). The book uses a star tetrahedron, a
  diamond-lotus and a torus. Which governs app visuals is Lance's call.
- **C2. Disc against volume.** `ICON_SHEET.md:41` draws a band as a disc. MOB 7104 says a chakra "is
  not a ring ... not a circle." MOB canon governs symbol meaning, but the disc is a ruled build
  convention. Lance's call.
- **C3. Card text on Snow.** Card text in the chakra colours (`ART_DIRECTION_BIBLE.md:13`) fails WCAG
  text contrast on mobile Snow for four of the seven (COMPUTED, table in 2(a)).
- **C4. Muted desktop Snow.** The desktop Snow tokens (`atuned/src/10_style.css.html:137-138`, for
  example Sacral `#8E6231`, Solar `#7E6C29`) are low-chroma browns and olives. The ruling says Snow is
  "never a muted brown". Unclear whether that ruling covers desktop or only the ring.
- **C5. Two Throats.** The script palette `RULED.throat` is `#62D2B4`, a teal
  (`atuned/src/30_lexicon-look-dev-stand-in-for-source-ai.js:14`). The bible and CSS Throat is
  `#3FC3E8`. `PAL.dark` overrides to `#3FC3E8`, but `RULED.throat` is still read directly by the
  coherence colour ladder (`36_the-teachers-on-the-compass.js:141`), tool colours
  (`44_polarity.js:172`), readings (`46_...js:569`) and overlays (`49_the-overlays.js:10`). COMPUTED:
  `#62D2B4` sits 0.042 from Heart in Oklab; the bible Throat sits 0.099 from it. In those places Throat
  is drawn almost as Heart.
- **C6. Band colours as a score scale.** `cohColor()` (`36_the-teachers-on-the-compass.js:140-142`)
  colours the coherence number Heart green at 95 and up, the teal Throat at 75, yellow `#E8B830` at 50,
  orange `#E77016` at 25, and Root red below 25, labelled "DANGER OF COLLAPSE". The colour that means
  "your Fear band" also means "danger". See the Birren and Elliot lenses.
- **C7. A number in the book.** "Approximately one and a half times" (MOB 6388) is a number. If it ever
  renders in the app, standing rule 6 (every number shown is real) applies. No measurement for it was
  found in this pass.
- **C8. History.** The book presents the rainbow seven without a date (MOB 901-913). The research
  below shows the rainbow sequence is a twentieth-century Western assignment. This does not change
  canon. It changes only one thing Emmy enforces: copy never calls the seven colours ancient or
  traditional.

Noted, not a conflict: Root doubles as the accent and Heart as "done". The source says this is "Part
Six's own doing rather than an error" (`30_lexicon...js:6-8`). Ruled. The lenses note the cost only.

---

# PART 1: THE LENSES

## 1. Johann Wolfgang von Goethe (1749 to 1832)

**Who and why.** The poet who spent years on colour as something the eye does, not only something
light does. He is the lens for meaning grounded in perception, and for polarity: warm against cool,
light against dark.

**Background.** *Zur Farbenlehre* came out in German in 1810, Charles Eastlake's English *Theory of
Colours* in 1840 (John Murray, London). Goethe wrote it against Newton's optics. Scientists mostly
rejected it; artists and philosophers kept it because it was about perception. Part VI covers the
"effect of colour with reference to moral associations". Turner painted *Light and Colour (Goethe's
Theory)* and worked with Goethe's plus and minus.

**How he thinks.**
- Colour is born where light meets darkness. Darkness is a pole, not an absence.
- Yellow and blue are the two colours in greatest opposition. Red arises from their intensification,
  which he called *Steigerung*.
- Opposed colours call each other up in the eye, so his colour circle is symmetric.
- The plus side (yellow, red-yellow, yellow-red) is active and warm. The minus side (blue, red-blue,
  blue-red) gives "a restless, susceptible, anxious impression" (Eastlake, as quoted by The
  Marginalian).
- He describes what the eye reports before he theorises about it.

**Quality bar.**
1. Polarity: each colour has its opposite somewhere in the frame, so both read at full strength.
2. Edge: colour lives at the boundary of light and dark, glow on near-black, not as flat fill.
3. Side: warm colours carry activation, cool colours carry the receptive, and the code never flips.
4. Eye before table: the meaning claimed for a colour can be felt by looking, not only read in a chart.

**Lens questions.**
- What is this colour's opposite, and where is it on the screen?
- Is this colour sitting in light, in shadow, or at the edge between them?
- Plus side or minus side, and does that match what the screen asks the person to do?
- Is green, the balance point, being used as balance?

**Example notes.**
- MOB 6346 already is Goethe: warm toward activation, cool toward calm, "Green sits in the center,
  neither warming nor cooling." A book diagram could draw the seven as two poles meeting at the heart
  rather than as a ladder.
- Snow: yellow belongs near light and dies on it. Solar on Snow is 1.62:1 (COMPUTED). Goethe would
  give it a darker partner or a dark edge before he would give it more saturation.
- The aura (`OWNER_RULINGS.md:55`): a cool ground makes a warm field read warmer without raising
  intensity, which the ruling capped. An option, not a fix.

**Sources.** [Wikipedia, Theory of Colours](https://en.wikipedia.org/wiki/Theory_of_Colours) ·
[Taylor & Francis listing, Part VI](https://www.taylorfrancis.com/books/9780367023133) ·
[Akademika listing, Eastlake 1840](https://www.akademika.no/goethes-theory-colours/9781108075442) ·
[The Marginalian on Eastlake's text](https://www.themarginalian.org/2012/08/17/goethe-theory-of-colours/) ·
[Project Gutenberg, Eastlake translation](https://gutenberg.org/ebooks/50572)

**Uncertain.** The plus-side wording often quoted ("quick, lively, aspiring") was not confirmed:
UNVERIFIED. Green as the mixture and balance of the poles in Goethe's own text: UNVERIFIED. The Turner
painting's date was not checked.

---

## 2. Wassily Kandinsky (1866 to 1944)

**Who and why.** The painter who argued most influentially that colour and form act straight on the
inner life, and who then tested colour-form pairings with students. He is the lens for "why it needs
to look that way", and the warning about what happens when a personal code is sold as a law.

**Background.** *Über das Geistige in der Kunst* (*Concerning the Spiritual in Art*) was published in
Munich in 1911 (some sources say 1912). He taught at the Bauhaus from 1922 until the Nazis closed it in
1933. *Point and Line to Plane* followed in 1926. In 1923 his wall-painting students at Weimar ran a
questionnaire asking people to match the three primaries to triangle, square and circle. Twenty-six
completed forms survive; Immelmann and colleagues read it as a teaching tool, not science.

**How he thinks.**
- Inner necessity: a colour or form belongs only if the inner content needs it.
- Colours move. Yellow is the "typical earthly color", warm and pressing outward. Blue is the
  "typical heavenly color", deep and inward (as quoted in a UCSB course handout).
- Form and colour act on each other. His pairs: yellow triangle, red square, blue circle.
- Reduction: point, line and plane are the basic elements, each with its own force.

**What testing found.** An Implicit Association Test study (Makin and Wuerger, 2013) found "no
implicit association between the original color-form combinations". A 2013 preference study found
little group-level support beyond a weak yellow-triangle link.

**Quality bar.**
1. Necessity: every mark has a reason you can say in one sentence that is not decoration.
2. Agreement: form and colour say the same thing, or fight on purpose.
3. Reduction: the symbol still works as a point at 12 px.
4. Movement: the colour advances or recedes where the meaning needs it to.
5. Owned, not universal: a colour-form pairing is this product's code, never a law of perception.

**Lens questions.**
- What does this form say before any colour is added?
- Does the colour push the form forward or pull it back, and is that the meaning?
- What is the point-version of this symbol?
- Is anything here because it looks spiritual rather than because it is needed?

**Example notes.**
- MOB 1525, the crib mobile, "Square, triangle, circle. Three colors," is Kandinsky's Bauhaus trio. If
  a book diagram colours them, choose the pairing by MOB's meaning and say so. The 1923 pairing did
  not hold up as perception.
- "A band is a disc" (`ICON_SHEET.md:41`). A disc is a plane. MOB 7104 says a chakra collapses
  "toward a single point". Kandinsky's point is exactly that form. The open seat needs extent. One disc
  cannot show both states.
- On dark, Solar text is 11.71:1 and Root 5.04:1 (COMPUTED). The yellow card always reads first.

**Sources.** [Wikipedia, Kandinsky](https://en.wikipedia.org/wiki/Wassily_Kandinsky) ·
[UCSB handout on Kandinsky's colour theory](https://www.mat.ucsb.edu/g.legrady/academic/courses/12w259/Kandinsky_%20Color%20Theory.pdf) ·
[Immelmann et al., Kandinsky's Bauhaus Questionnaire](https://aesthetics.univie.ac.at/publications/details/pure/9eb8aa6b-a8e2-4ea1-9b25-610f2f518d07/show/publ/Pure) ·
[Makin & Wuerger 2013, PMC](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3769683/) ·
[2013 Frontiers preference study](https://frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2013.00926/text)

**Uncertain.** Exact month and publisher of the 1911 edition: UNVERIFIED. Whether Kandinsky was a
synaesthete is widely said and was not confirmed here: UNVERIFIED.

---

## 3. Josef Albers (1888 to 1976)

**Who and why.** The Bauhaus-trained painter and teacher whose *Interaction of Color* is still the
standard way to learn how colours change each other. He is the lens for a palette that must hold on
two grounds, beside six neighbours, at small size.

**Background.** *Interaction of Color* was published by Yale University Press in 1963 as a limited
silkscreen edition with 150 colour plates, a handbook for artists, teachers and students. A paperback
followed in 1971 and a 50th anniversary edition in 2013. His teaching posts (Bauhaus, Black Mountain
College, Yale) were not re-checked here: UNVERIFIED in this pass.

**How he thinks.**
- "In visual perception a color is almost never seen as it really is, as it physically is." "This fact
  makes color the most relative medium in art." (Princeton University Art Museum record and Schirn;
  punctuation varies by edition.)
- Experience before theory: cut coloured paper, not pigment mixing.
- The classic exercises: make one colour look like two, make two colours look like one, find the
  boundary that vibrates, fake transparency.
- The subject is the gap between physical fact and what the eye reports.

**Quality bar.**
1. Ground: every colour judged on Lumen dark and on Snow, never on a neutral artboard.
2. Neighbour: each band judged beside the bands it actually touches.
3. One as two, two as one: a token that reads as two colours in two places, or two tokens that read as
   one, is a defect.
4. Edge: equal-lightness complementary edges vibrate. Use that on purpose or avoid it.
5. Size: judge at shipping size. Small areas lose chroma.

**Lens questions.**
- Which colour is this beside, and what is that neighbour doing to it?
- Does this token read the same on both grounds?
- Which two colours in this palette are closest, and can a person tell them apart?
- What happens at 12 px?

**Example notes (all COMPUTED).**
- Two look like one, on desktop Snow. The seven sit at Oklab lightness 0.50 to 0.53 and chroma 0.077 to
  0.108. Sacral and Solar are 0.041 apart, the closest pair in any palette in the build. Albers's
  exercise is happening by accident.
- Gold beside Solar. Gold `#C9A84C` has hue 89.5 degrees in Oklch, Solar `#EFC53F` 90.8. Same hue,
  lower chroma and lightness. Where a Solar arc meets the gold trim (`ART_DIRECTION_BIBLE.md:46`), the
  trim may read as dull Solar rather than as gold. Check at size.
- One as two. The build has two Throats (C5). In the coherence ladder Throat is drawn as teal, a few
  steps from Heart.

**Sources.** [Princeton University Art Museum record](https://artmuseum.princeton.edu/collections/objects/60427) ·
[Schirn on Interaction of Color](https://www.schirn.de/en/magazine/context/josef_albers_interaction_of_color_peter_halley_color_theory/) ·
[David Zwirner, the book](https://www.davidzwirner.com/collect/josef-albers-interaction-of-color-book) ·
[Modernism101, first edition](https://modernism101.com/products-page/art-photo/albers-josef-interaction-of-color-new-haven-yale-university-press-1963-first-edition-2000-copies/) ·
[The Marginalian, 50th anniversary](https://www.themarginalian.org/2013/08/16/interaction-of-color-josef-albers-50th-anniversary/)

**Uncertain.** One source dates the quote to 1965; most give the 1963 introduction. Life details and
posts: UNVERIFIED here.

---

## 4. Faber Birren (1900 to 1988)

**Who and why.** The American colour consultant who made colour a working tool in factories, ships and
hospitals, and who also wrote the popular history of colour healing. He is the lens for colour that
has a job, and for knowing where function ends and lore begins.

**Background.** Born in Chicago in 1900. He studied colour at the University of Chicago, left after two
years, and opened his own consultancy in 1934. Clients included DuPont, Monsanto, General Electric and
the military; he set colour standards for the US Navy and Coast Guard. With DuPont he laid out a hazard
code: yellow for stumbling and falling, red for fire protection, orange for equipment that might "cut,
crush, burn, or shock", blue for caution, green for first aid. One source says the National Safety
Council approved it in 1944. He used light green walls to cut visual fatigue. He wrote *Color
Psychology and Color Therapy: A Factual Study of the Influence of Color on Human Life* (a 1961 edition
is confirmed in a bibliography), and edited a 1967 reprint of Edwin Babbitt's 1878 *The Principles of
Light and Color*, a founding text of colour healing (bibliographic citation only).

**How he thinks.**
- Colour as function: legibility, fatigue, hazard, wayfinding.
- One colour, one meaning, everywhere in a system, so the code can be learned.
- The environment matters: walls, machines, where the eye rests.
- He reported healing traditions beside his functional work. Reading him well means separating the
  two. The hazard code is an adopted working convention. The healing material is history.

**Quality bar.**
1. One colour, one job across the whole product.
2. The job is a verb: find, group, warn, confirm.
3. The long look: twenty minutes of ritual or release without strain.
4. Lore is labelled as tradition, never as mechanism.

**Lens questions.**
- What is this colour's job, in one verb?
- Where else in the product does this colour appear, and with what meaning?
- If this colour claim came from a tradition, does the copy say so?
- Can the eye rest on this screen?

**Example notes.**
- The coherence ladder (C6). Root red marks both the Fear band and "DANGER OF COLLAPSE". Heart green
  marks both the Grief band and the top of the scale. A person whose Root band is active sees the
  colour the score uses for danger. Code collision. Flagged, not fixed.
- Root as accent and Heart as "done" are ruled double roles (`30_lexicon...js:6-8`). Birren notes the
  cost. The ruling stands.
- MOB 6340-6346 and 6388: present as practice and tradition. If "one and a half times" ever renders,
  rule 6 applies (C7).

**Sources.** [Wikipedia, Faber Birren](https://en.wikipedia.org/wiki/Faber_Birren) ·
[Yale library guide](https://guides.library.yale.edu/faberbirren/aboutbirren) ·
[Summer of Protocols, The Color of Safety](https://protocolized.summerofprotocols.com/p/the-color-of-safety) ·
[LensCulture book listing](https://www.lensculture.com/books/5590-color-psychology-and-color-therapy-a-factual-study-of-the-influence-of-color-on-human-life) ·
[Bibliography citing the 1967 Babbitt edition](https://hindawi.org/books/50609495/0.3)

**Uncertain.** Birth date (11 or 21 September by source), book count (forty or twenty-five), the 1944
versus 1948 adoption date, and the often-cited 1950 first edition all vary or are UNVERIFIED. His own
stance on whether colour healing works was not found.

---

## 5. Andrew J. Elliot

**Who and why.** The University of Rochester psychologist who, with Markus Maier, built the main modern
theory of colour and psychological functioning, and who has said in print that the field is young. He
is the lens for any claim that a colour does something to a person.

**Background.** Known first for work on approach and avoidance motivation. Elliot and colleagues (2007,
*Journal of Experimental Psychology: General* 136(1), 154-168) reported that a brief view of red before
an important test such as an IQ test impaired performance, and linked red to avoidance. With Maier he set out colour-in-context theory (2012) and the
*Annual Review of Psychology* review (2014, 65, 95-120). His 2015 *Frontiers* review ends that the
literature "is at a nascent stage of development", "recommending patience and prudence regarding
conclusions about theory, findings, and real-world application."

**How he thinks.**
- Colour carries meaning, and meaning drives response.
- Meanings come from learned pairings, and some from a biological starting point that learning shapes.
- The same colour means different things in different contexts: red near evaluation signals failure
  and danger, red in a romantic context signals attraction.
- Vary hue only, with saturation and brightness held fixed; earlier work had not, and he was noted for
  it.

**The record since, stated fairly.** A 2020 meta-analysis (Gnambs; 67 effect sizes, 38 samples) found
no difference for anagram and knowledge tests (d = -0.06 and -0.04). Reasoning tests showed d = -0.34,
but after adjusting for publication bias there was no evidential value, and early studies were larger
than later ones. Steele's lab failed to replicate the 2007 result. A 2018 red-and-attraction
meta-analysis, with Elliot as co-author, found d = 0.26 for men rating women and 0.13 for women rating
men, smaller in recent and preregistered studies. He co-signed the shrinking estimate.

**Quality bar.**
1. Context: what does this colour mean in this exact situation?
2. Control: if two options differ in lightness or chroma as well as hue, no hue claim can be drawn.
3. Size: would the claim still be made if the effect were d = 0.06?
4. Replication: has it held outside the first lab?

**Lens questions.**
- Is the person being evaluated on this screen? Then what does red mean here?
- Is this colour claim about meaning (supported) or about effect on the body or performance (not)?
- Which study is this claim from, and did it replicate?

**Example notes.**
- The coherence ladder (C6): reading your own number is an evaluation context, exactly where the
  theory predicts red reads as failure. The performance effect did not survive meta-analysis, so the
  note is about meaning, not harm.
- Marketing: no claim that a colour calms, energises or speeds release. Any colour test varies hue at
  matched Oklab lightness and chroma.

**Sources.** [Elliot 2015, Frontiers](https://www.frontiersin.org/articles/10.3389/fpsyg.2015.00368/full) ·
[Elliot & Maier 2014, Annual Review](https://www.scinapse.io/papers/2164901293) ·
[APA Monitor on the 2007 study](https://www.apa.org/monitor/may07/seeingred) ·
[Gnambs 2020 meta-analysis, PMC](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7704521/) ·
[Lehmann, Elliot & Calin-Jageman 2018](https://journals.sagepub.com/doi/10.1177/1474704918802412) ·
[Steele lab poster](https://www.appstate.edu/~steelekm/documents/Psychonomic2016Poster_Steele.pdf)

**Uncertain.** The 2012 chapter's exact title and contents were not confirmed: UNVERIFIED. Birth year
not checked.

---

## Better candidates?

1. **Karen B. Schloss** (University of Wisconsin-Madison). The strongest evidence-based voice on colour
   meaning for people who make things. Palmer and Schloss (2010, *PNAS*) showed colour preference tracks
   how people feel about the objects a colour belongs to. Schloss and colleagues (2019, *IEEE TVCG*)
   showed the dark-is-more and opaque-is-more biases in data colour, and that they pull against each
   other on dark backgrounds. A better evidence lens than Birren, or a sixth.
   [Palmer & Schloss 2010, PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC2889342) ·
   [Schloss lab, colormap paper](https://schlosslab.discovery.wisc.edu/new-publication-mapping-color-to-meaning-in-colormap-data-visualizations)
2. **Michel-Eugène Chevreul.** Director of dyeing at the Gobelins tapestry works from 1824. He traced
   complaints about dull tapestry colour to an optical cause and wrote *The Laws of Contrast of Colour*
   (1839). Albers's subject starts with him. Worth having if Goethe reads as too poetic.
   [Britannica](https://www.britannica.com/biography/Michel-Eugene-Chevreul)
3. **Kurt Leland**, as a reference rather than a lens. *Rainbow Body* (Ibis Press, 2016) is the
   provenance record for every chakra-colour claim Emmy makes.
   [Quest, Spring 2017](https://www.theosophical.org/publications/quest-magazine/the-rainbow-body-how-the-western-chakra-system-came-to-be)

---

# PART 2: KNOWLEDGE

## 2(a) Colour theory that matters for making

- **Hue, value, chroma.** Albert Munsell, a painter and teacher, framed colour this way in *A Color
  Notation* (1905; the *Atlas* followed in 1913). He was the first to separate the three into
  perceptually even, independent scales, later fitted to measurements of human vision. The USDA
  adopted it for soil in the 1930s.
- **Value carries legibility.** WCAG's relative luminance is 0.2126 R + 0.7152 G + 0.0722 B on
  linearised channels, and contrast is (L1 + 0.05) / (L2 + 0.05). Green dominates luminance and blue
  barely counts, so saturated blues and violets are darker than they look and yellows lighter.
- **Simultaneous contrast.** Chevreul at the Gobelins found that dull-looking tapestries had an optical
  cause, not a chemical one. His 1839 book describes simultaneous, successive and mixed contrast. Yellow
  on blue reads tinted toward orange. Every band in Atüned is seen against a ground and its neighbours,
  never alone.
- **Harmony.** Complementary, analogous and triadic schemes are workshop conventions. No evidence was
  found in this pass that any scheme is universally preferred. What is supported: people like colours
  tied to things they like (blues, sky and clean water) and dislike colours tied to things they dislike
  (browns, rot) (Palmer and Schloss, 2010).
- **Perceptual colour spaces.** HSL is not perceptual. Oklab (Björn Ottosson, December 2020) fits
  lightness and chroma to CAM16 and hue to IPT, and fixes the hue drift in blues that CIELAB shows. It
  is in CSS Color 4 and 5 as `oklab()` and `oklch()`, supported in current browsers. One designer argues
  Oklch lightness is a poor stand-in for contrast. Use WCAG luminance for contrast and Oklab for ramps
  and for how far apart two colours look.
- **Accessibility.** WCAG 2.2 SC 1.4.3 (AA): 4.5:1 for text, 3:1 for large text (18 pt, or 14 pt
  bold). SC 1.4.11 (AA): 3:1 for UI parts and meaningful graphics against what is next to them. SC 1.4.1
  (A): colour is never the only carrier of information. Congenital colour vision deficiency affects
  about 8% of males and about 0.5% of females; deutan types are most common; it is X-linked.

### Atüned's bands, measured (COMPUTED, 2026-10-15)

Contrast against each ground, and Oklch lightness, chroma and hue for the dark tokens.

| Band | Dark token | on `#0E0E0D` | Oklch L / C / h | Mobile Snow token | on `#FCFCFB` |
|---|---|---|---|---|---|
| Root | `#E0524B` | 5.04 | 0.628 / 0.179 / 26 | `#E01B24` | 4.70 |
| Sacral | `#F08A2E` | 7.71 | 0.729 / 0.159 / 57 | `#FF7800` | 2.58 |
| Solar | `#EFC53F` | 11.71 | 0.838 / 0.152 / 91 | `#F5C211` | 1.62 |
| Heart | `#4CD9A0` | 10.80 | 0.795 / 0.147 / 163 | `#2EC27E` | 2.24 |
| Throat | `#3FC3E8` | 9.37 | 0.762 / 0.122 / 221 | `#1C9BE6` | 2.97 |
| Brow | `#6E8CF0` | 6.14 | 0.663 / 0.152 / 269 | `#3D5AFE` | 5.00 |
| Crown | `#B77DE8` | 6.54 | 0.691 / 0.162 / 308 | `#9141AC` | 5.75 |
| Gold | `#C9A84C` | 8.45 | 0.743 / 0.117 / 90 | `#8F7005` | 4.56 |

- Dark: all seven pass 4.5:1 as text.
- Mobile Snow: Root, Brow and Crown pass 4.5:1. Sacral, Solar, Heart and Throat fail even the 3:1
  non-text line.
- Desktop Snow (`#EDEBE6` ground, tokens at `10_style.css.html:137-138`): 4.34 to 5.29, with Sacral
  4.47, Solar 4.34 and Heart 4.37 just under 4.5, but all seven at Oklab lightness 0.50 to 0.53.
- The desktop `.dev.lumen` lighting (`#FFFFFF` ground, `10_style.css.html:168-174`; not the same thing
  as the "Lumen dark" ground the design bible names): Sacral 2.61 and Solar 2.79 fail 3:1.

How far apart the closest pair sits (Oklab distance x100), for typical vision and three simulated
colour-blind types:

| Palette | Typical | Deutan | Protan | Tritan |
|---|---|---|---|---|
| Mobile dark | 10.7 Brow-Crown | 5.0 Brow-Crown | 1.3 Brow-Crown | 3.2 Heart-Throat |
| Mobile Snow | 16.6 Throat-Brow | 10.5 Sacral-Heart | 10.1 Solar-Heart | 5.9 Heart-Throat |
| Desktop dark | 7.5 Brow-Crown | 0.9 Brow-Crown | 3.7 Brow-Crown | 4.8 Heart-Throat |
| Desktop Snow | 4.1 Sacral-Solar | 0.6 Sacral-Solar | 2.3 Sacral-Solar | 1.7 Heart-Throat |
| Desktop `.dev.lumen` | 10.7 Sacral-Solar | 3.7 Brow-Crown | 1.9 Sacral-Solar | 3.3 Heart-Throat |

What it says: Brow and Crown are the weak pair on dark. Under the protan simulation on mobile dark they
are about one-eighth as far apart as the closest pair a typical viewer sees. Colour alone cannot carry
band identity for everyone. Position on the body, or a mark, has to carry it too.

**Method.** WCAG 2.2 relative luminance and contrast ratio. Oklab from Ottosson's published
matrices. Colour-blind simulation with the Machado, Oliveira and Fernandes (2009) full-severity
matrices on linear sRGB. The matrices came from the commonly used published table and were not
re-checked against the paper in this pass, so treat the colour-blind numbers as approximate. Which pair
is weakest is the reliable part. Tokens were read from `atuned/src/10_style.css.html:54-63, 107-108,
137-138, 168-174` and `30_lexicon...js:9-27` on 2026-10-15.

**Sources.** [W3C, SC 1.4.3](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) ·
[W3C, SC 1.4.11](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html) ·
[W3C quick reference](https://www.w3.org/WAI/WCAG22/quickref/) ·
[Wikipedia, Oklab](https://en.wikipedia.org/wiki/Oklab_color_space) ·
[Smashing, Ottosson interview](https://smashingmagazine.com/2024/10/interview-bjorn-ottosson-creator-oklab-color-space/) ·
[atmos.style on oklch](https://atmos.style/glossary/oklch-color-space) ·
[Wikipedia, Munsell](https://en.wikipedia.org/wiki/Munsell_color_system) ·
[Britannica, Chevreul](https://www.britannica.com/biography/Michel-Eugene-Chevreul) ·
[Webvision prevalence table](https://www.ncbi.nlm.nih.gov/books/NBK11538/table/ch28kallcolor.T1/)

---

## 2(b) Colour psychology: strict and fair

**Supported by large, controlled or replicated work.**
- **Colour-emotion links are widely shared, with local variation.** Jonauskaite and colleagues (2020,
  *Psychological Science*): 4,598 people, 30 nations, 22 languages, 20 emotions, 12 colour terms. Average
  similarity across nations r = .88. Nation still predicted links beyond the shared pattern, and nations
  closer in language or geography were more alike. The specific pairings (red and love, and so on) were
  not confirmed in this pass: UNVERIFIED.
- **Preference follows objects.** People like colours of things they like (Palmer and Schloss, 2010).
  Students prefer their own school's colours more than rivals do, more so with school spirit (Schloss,
  Poggesi and Palmer, 2011).
- **Colour carries quantity.** In data colour, people read darker as more, and more opaque as more. On
  light grounds the two agree. On dark grounds they conflict, and opacity can override darkness
  (Schloss and colleagues, 2019). For a dark-ground app, "brighter and more solid means more" is likely
  to be read, which matches the field ruling at `OWNER_RULINGS.md:47` ("the bands moving most are the
  bands that shine and a held seat goes dark"). Test it, because the two biases conflict on dark.
- **Legibility and colour blindness** are physiology and published standards (2(a)).

**Contested or shrinking.**
- **Red lowers test scores.** Gnambs 2020: no evidential value after bias adjustment (see the Elliot
  lens).
- **Red raises attraction.** d = 0.26 and 0.13, smaller in recent and preregistered studies (2018).
- **Red wins fights.** Hill and Barton (2005, *Nature*): at Athens 2004, in boxing, taekwondo and two
  wrestling styles, red won more than 60% of evenly matched bouts. A 2024 *Scientific Reports* study of
  more than 6,500 contestants from 1996 to 2020 found red won 50.5%, not significant. The advantage
  existed before 2005; the authors point to scoring technology and rule changes.
- **Blue for creativity, red for detail** (Mehta and Zhu, 2009, *Science*). A direct replication with
  more than three times the participants found no effect (Steele, *Psychonomic Bulletin & Review*,
  2014). All replications found are from Steele's lab.
- Fair note: a shrinking effect is not proof of zero. It is proof that no product claim can rest on it.

**Cultural.**
- Codes are local. Water is green on Tibetan prayer flags, black in Wu Xing, and a white crescent in
  the tantric chakra text. Each code is coherent inside its own system (2(c)).
- Learned conventions come to feel natural. The 1944 hazard code (yellow hazard, red fire, green first
  aid) is now how people read machines.

**Lore: no controlled support found, or failed replication.**
- **Baker-Miller pink calms aggression.** A controlled test (Genschow and colleagues) did not replicate
  it, and Schauss himself reportedly saw no difference in a real pink cell.
- **"Blue calms the body."** No controlled evidence was found in this pass either way: UNVERIFIED.
  Atüned does not claim it.
- **Colour healing** (the Babbitt 1878 lineage, chromotherapy). History. No controlled support found
  in this pass.
- **Chakra colours as frequencies the body responds to** (MOB 6342). This is MOB canon, not a research
  finding. It governs meaning inside the book. Emmy does not present it as science in product copy.

**Sources.** [Jonauskaite et al. 2020, open PDF](https://biopen.bi.no/bi-xmlui/bitstream/11250/2761614/1/Jonauskaite_etal_2020_PsychScience.pdf) ·
[Palmer & Schloss 2010](https://pmc.ncbi.nlm.nih.gov/articles/PMC2889342) ·
[Schloss, Poggesi & Palmer 2011](https://palmerlab.berkeley.edu/pdf/SchlossPoggesi&Palmer-2011.pdf) ·
[Schloss et al. 2019, Caltech record](https://authors.library.caltech.edu/89412) ·
[Gnambs 2020](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7704521/) ·
[Lehmann et al. 2018](https://journals.sagepub.com/doi/10.1177/1474704918802412) ·
[NPR on Hill & Barton 2005](https://www.npr.org/2005/05/18/4657033/study-red-is-the-color-of-olympic-victory) ·
[Northumbria on the 2024 study](https://northumbria.ac.uk/about-us/news-events/news/olympic-red-advantage) ·
[APS, failure to replicate Mehta & Zhu](https://www.psychologicalscience.org/video/failure-to-replicate-the-mehta-and-zhu-2009-color-effect.html) ·
[Genschow et al., Baker-Miller pink](https://fis.leuphana.de/de/publications/does-baker-miller-pink-reduce-aggression-in-prison-detention-cell/) ·
[Big Think on pink](https://bigthink.com/neuropsych/pink-calm/)

---

## 2(c) Colour and energy symbols

### Chakra colours: classical against modern

**The answer.** The rainbow sequence (red, orange, yellow, green, blue, indigo, violet, root to crown)
is a modern Western assignment. Kurt Leland, the historian of the Western chakra system, says the
rainbow colours and the list of qualities "did not come together in print until 1977". The classical
tantric text gives different colours, and gives them to petals and element shapes, not one colour per
centre.

**The classical text.** The *Ṣaṭ-cakra-nirūpaṇa* (*Description of the Six Centres*) was written in the
sixteenth century by Pūrṇānanda of Bengal, as the sixth chapter of the *Śrī-tattva-cintāmaṇi*. It
describes six centres, Mūlādhāra to Ājñā, with the thousand-petalled Sahasrāra above them. The 1577 date
often given was not confirmed: UNVERIFIED. The standard English version is Arthur Avalon's (Sir John
Woodroffe's) *The Serpent Power* (1919), with Kālīcaraṇa's commentary.

| Centre | Petals | Petal colour | Element and its mark | How well checked |
|---|---|---|---|---|
| Mūlādhāra | 4 | red, crimson | earth, yellow square | Secondary sources; the square from a separate account |
| Svādhiṣṭhāna | 6 | vermilion | water, white crescent | Vermilion confirmed (wisdomlib summary); crescent from Wikipedia |
| Maṇipūra | 10 | the colour of a rain-cloud (dark blue to black) | fire, red downward triangle | Woodroffe's *Mahanirvana* translation and a Sri Vidya source; triangle from Wikipedia |
| Anāhata | 12 | red, like the Bandhūka flower | air, smoky region of two crossed triangles | Bandhūka confirmed (wisdomlib, Avalon excerpt); smoky region from Wikipedia |
| Viśuddha | 16 | smoky purple | ether | From a *Saundaryalaharī* commentary, not the text itself; ether's mark UNVERIFIED |
| Ājñā | 2 | white | (mind) | One commentary says white; Hinduism Today says lavender: conflicting |
| Sahasrāra | 1,000 | sources disagree: white, gold, or every colour | (beyond the six) | UNVERIFIED |

Read down the petal column: red, vermilion, rain-cloud, red, smoky purple, white. No rainbow. And the
element marks are square, crescent, triangle, crossed triangles, and the point at the centre: the same
simple shapes the 2024 brand deck allows, plus the crescent.

**How the West got the rainbow.**
- Blavatsky and the Theosophical Society carried the teachings west from 1879, when she arrived in
  India, until her death in 1891 (Leland).
- C. W. Leadbeater's *The Chakras* (1927) uses a different sequence that includes a "spleen chakra",
  and its colours are not in spectrum order (cosolargy; divine-warrior). His exact colours were not
  confirmed: UNVERIFIED.
- The rainbow colours and the endocrine glands attached to the chakras gradually between the 1920s and
  the 1950s (Leland).
- 1977 is the consolidation. The dust jacket of Ken Dychtwald's *Bodymind* (June 1977) shows the chakras
  as rainbow bands, and a *Yoga Journal* article, "Bodymind and the Evolution to Cosmic Consciousness"
  (July-August 1977), assigns the spectrum colours (both per Leland's account as search returned it;
  the article's author was not confirmed). Christopher Hills's *Nuclear Evolution: Discovery of the
  Rainbow Body* is dated 1977 by Wikipedia, which says he modified Leadbeater's anatomy and gave each
  centre a rainbow colour. Some sites date Hills to 1970: first-edition year UNVERIFIED.

**What follows for Emmy.**
- The MOB seven are canon and stay. They are MOB's code and the modern Western standard.
- Copy never calls them ancient, traditional or Vedic.
- If lineage is ever shown, show the classical colours with their source.

**Sources.** [Leland, Quest, Spring 2017](https://www.theosophical.org/publications/quest-magazine/the-rainbow-body-how-the-western-chakra-system-came-to-be) ·
[cosolargy review of Bodymind](https://cosolargy.org/chakras-ken-dychtwald/) ·
[cosolargy on Leadbeater](https://cosolargy.org/chakras-charles-leadbeater/) ·
[Theosophical Publishing House, The Chakras](https://www.ts-adyar.org/book/chakras-0) ·
[Wikipedia, Aura (paranormal), on Hills](https://en.wikipedia.org/wiki/Aura_(paranormal)) ·
[wisdomlib, Shat-cakra-nirupana](https://www.wisdomlib.org/hinduism/book/shat-cakra-nirupana-english) ·
[wisdomlib, summary of verses 14-18](https://www.wisdomlib.org/hinduism/book/shat-cakra-nirupana-english/d/doc1144834.html) ·
[wisdomlib, Bandhuka](https://www.wisdomlib.org/concept/bandhuka-flower) ·
[Woodroffe, Mahanirvana Tantra, Chakras](https://chestofbooks.com/new-age/spirituality/tantra/Mahanirvana-Tantra/Chakras.html) ·
[Saundaryalahari commentary](https://www.advaita-vedanta.org/archives/advaita-l/2000-July/001253.html) ·
[Wikipedia, Manipura](https://en.wikipedia.org/wiki/Manipura) ·
[Wikipedia, Svadhishthana](https://en.wikipedia.org/wiki/Svadhishthana) ·
[Wikipedia, Anahata](https://en.wikipedia.org/wiki/Anahata) ·
[Hinduism Today, 1994](https://www.hinduismtoday.com/magazine/april-1994/1994-04-chakras)

### Colour in other systems

| System | Colours and what they code | Notes |
|---|---|---|
| Tibetan prayer flags | Blue sky and space, white air and wind, red fire, green water, yellow earth, flown in that order | Also linked to the five meditation Buddhas; which Buddha takes which colour was not confirmed: UNVERIFIED. Variant mappings exist. |
| Chinese Wu Xing (five phases) | Wood *qīng* (blue-green), east, spring. Fire red, south, summer. Earth yellow, centre, late summer and the turns between seasons. Metal white, west, autumn. Water black, north, winter. | Phases or processes, not substances. The Four Symbols repeat it: Azure Dragon east, Vermilion Bird south, White Tiger west, Black Tortoise north. |
| Golden Dawn colour scales | Four scales, one per Qabalistic world: King (Atziluth), Queen (Briah), Prince (Yetzirah), Princess (Assiah). Crowley's *Liber 777* calls the last two Emperor and Empress. A four-colour entry is read in quarters: top, right, left, bottom. | One source credits the scales to Florence Farr. Specific entries (Malkuth citrine, olive, russet, black) were not confirmed: UNVERIFIED. |

Every system uses colour to code a structure: elements, directions, worlds. The codes disagree with
each other and are each consistent inside themselves. That is the case for "MOB canon governs": choose
one code and apply it everywhere.

**Sources.** [Wikipedia, Prayer flag](https://en.wikipedia.org/wiki/Prayer_flag) ·
[Mark Horrell on prayer flags](https://markhorrell.com/blog/2012/prayer-flags-what-are-they) ·
[Wikipedia, Wuxing](https://en.wikipedia.org/wiki/Wuxing_(Chinese_philosophy)) ·
[Wikipedia, Four Symbols](https://en.wikipedia.org/wiki/Four_Symbols) ·
[Liber 777 tables (transcription)](https://globalspiritualstudies.com/liber-777-correspondences/) ·
[Colouring the Golden Dawn tarot (PDF)](https://www.daneel.franken.de/tarot/GoldenDawn/Coloring%20the%20Classic%20Golden%20Dawn%20Tarot.pdf)

### Basic symbols

| Symbol | Documented meanings | Where MOB already uses it |
|---|---|---|
| Dot, point | In a yantra, the *bindu*: the centre from which the diagram and creation come; drawn as a dot, a small circle, or left invisible. Kandinsky's point is the root element of form. | The soul as "the point of origin ... the vertex" (MOB 1523). The chakra under pressure "collapses toward a single point" (MOB 7104). |
| Circle | The Zen *ensō*: one or two brushstrokes for enlightenment, emptiness, the universe; left open, it allows movement. "Circle means wholeness everywhere" is often said and was not confirmed as a cross-cultural fact: UNVERIFIED. | The ring is the product's hero (`ART_DIRECTION_BIBLE.md:10`). But "a chakra is not a ring ... not a circle" (MOB 7104). |
| Triangle | In the Sri Yantra, upward triangles are Shiva, the masculine; downward are Shakti, the feminine, tied to water and the yoni; together, union. Maṇipūra's fire is a red downward triangle. The Eye of Providence sits in a triangle on the reverse of the US Great Seal, adopted 20 June 1782, a Renaissance-era sign of God's oversight. | The diamond-lotus: upward triangle for the higher self and purpose, downward for what you do in the world (MOB 629). A chakra is "a field held by three points" (MOB 7104). |
| Square | The *bhūpura*, the outer square of a yantra with four gates, called the earth enclosure or the body. Mūlādhāra's earth is a yellow square (secondary source). | The crib mobile (MOB 1525). |
| Spiral | Newgrange, about 3200 BCE: meaning unresolved; one theory ties the carvings to tracking the sun and moon. Irish Christians later read the triple spiral as the Trinity. | The upward spiral of coherence and the downward spiral of decoherence (MOB 1203, 4535). |
| Eye | The Egyptian *wedjat*, the Eye of Horus: protection, health, restoration, because Hathor restored the lost eye; common on amulets. The Eye of Providence: divine watchfulness, a separate tradition. | Third Eye: "Perception/Curiosity/Discernment" (MOB 911). The eye recurs in Lance's own art (`voice_profile.md`). |
| Lotus | Buddhism: purity, rising unstained from muddy water. Egypt: the sun rising from a lotus each morning; rebirth (Tutankhamun's lotus chalice). In the Sri Yantra the petal rings are creation and vital force. | "The diamond in the lotus" (`OWNER_RULINGS.md:63`), "diamond-lotus structure" (MOB 629). A drawn lotus meets the deck's "no organic forms" rule: see C1. |

**Sources.** [Wikipedia, Yantra](https://en.wikipedia.org/wiki/Yantra) ·
[Wikipedia, Sri Yantra](https://en.wikipedia.org/wiki/Sri_Yantra) ·
[Wikipedia, Ensō](https://en.wikipedia.org/wiki/Ens%C5%8D) ·
[Wikipedia, Eye of Providence](https://en.wikipedia.org/wiki/Eye_of_Providence) ·
[Wikipedia, Great Seal](https://en.wikipedia.org/wiki/Great_Seal_of_the_United_States) ·
[Britannica, Newgrange](https://www.britannica.com/topic/Newgrange) ·
[Wikipedia, Triskelion](https://en.wikipedia.org/wiki/Triskelion) ·
[Britannica, Eye of Horus](https://www.britannica.com/topic/Eye-of-Horus) ·
[Wikipedia, Sacred lotus in religious art](https://en.wikipedia.org/wiki/Sacred_lotus_in_religious_art) ·
[Britannica, Sacred lotus](https://www.britannica.com/plant/sacred-lotus) ·
[Wikipedia, Lotus chalice](https://en.wikipedia.org/wiki/Lotus_chalice)

---

## 2(d) Apply it: a chakra or body-address symbol in Atüned

Principles first, then options. No final picks. Lance rules.

### Principles

1. **Colour names the band. Form tells the state.** The seven colours are a fixed identity code
   (canon, 1181). What changes on a seat (open, held, collapsing, releasing) is better carried by form,
   size, light and motion than by shifting the hue. Birren: one colour, one job.
2. **Never colour alone.** About 8% of men have a colour vision deficiency, and WCAG 1.4.1 forbids
   colour as the only carrier. Brow and Crown are the weakest pair in both dark palettes, for typical
   vision and both red-green simulations (COMPUTED).
   Band identity has to also live in position on the body, a label, or a mark.
3. **Light shows amount, hue shows identity.** On a dark ground people read brighter and more solid as
   more (Schloss). Ruling 47 already does this. Keep hue fixed and let light, radius or opacity carry the
   number, which must itself be real (rule 6).
4. **Design each band as a pair.** One band, two tokens (dark and Snow), the same identity. Check
   contrast on each ground with the real numbers, not on an artboard (Albers).
5. **Draw MOB's geometry with the deck's primitives.** The book's own description of a seat (three
   points, a volume when open, a point when collapsed) can be drawn with dots, triangles and circles
   only, without sacred geometry and without organic forms.
6. **Say the history straight.** The rainbow seven are MOB's code and the 1977 Western standard. The
   classical colours are different and available as a deliberate reference.
7. **Claims follow the evidence bins.** Associations: yes, with care. Effects on the body or
   performance: no. Tradition: labelled as tradition.

### Colour options

- **C-A. Keep the seven and move text to ink on Snow.** Band colour goes on the mark (dot, edge,
  glow), body text stays in ink. Does: fixes the four Snow text failures without touching the code.
  Risk: departs from "card text in the chakra colours" (`ART_DIRECTION_BIBLE.md:13`), so it needs
  Lance's ruling.
- **C-B. Keep the seven, separate them by lightness.** Push Brow darker and Crown lighter (or the
  reverse) so the pair separates under colour blindness. Does: identity survives for more people.
  Risk: the bands stop looking equally weighted, and lightness starts to suggest amount (principle 3).
- **C-C. A lineage view.** In the knowledge layer, show the *Ṣaṭ-cakra-nirūpaṇa* colours beside the MOB
  seven with dates and sources. Does: honesty as a feature, and it fits "deeper than astrology, read off
  what they wrote" (`ART_DIRECTION_BIBLE.md:32`). Risk: two codes on screen; keep it to one view.
- **C-D. Crown toward white at full coherence.** The book gives Crown "Violet/White" (MOB 913), and the
  bible's Coherent row has no colour (`DESIGN_BIBLE.md:25`). Crown could whiten as it opens. Does: uses
  the book's own second colour as a state. Risk: white on Snow disappears, and white may read as
  "disabled" in UI.

### Form options

- **F-A. The disc, as ruled.** Does: simple, legible, consistent with `ICON_SHEET.md:41`. Risk: contradicts
  MOB 7104 (C2), and one disc cannot show open against collapsing.
- **F-B. Three points.** Three dots in the band's colour define a triangle. Open: the area between them
  holds faint band light, the "volume". Collapsing: the points draw in toward the centre and end as one
  dot. Does: draws MOB 7104 literally with dot and triangle only. Risk: at small sizes three points read
  as a loading spinner; needs testing at 12 px.
- **F-C. The point with a radius.** A *bindu*-style dot whose glow radius is what passes the seat, on
  the field ruling's steep curve (`OWNER_RULINGS.md:47`). Collapse means the radius shrinks to the dot. Does: the simplest form, reads at
  any size, matches the field already built. Risk: a dot with glow is common; the gold trim and type
  must carry the distinctness.
- **F-D. Classical element marks as a second layer.** Square, crescent, triangle, crossed triangles,
  point, shown only in a lineage or knowledge view. Does: real history, simple shapes. Risk: the crescent
  edges toward "organic", and crossed triangles toward "sacred geometry" (C1).

Motion for any of these follows ruling 715: the stack holds still while a person reads; motion is the
pull, never the point.

### What Emmy checks on any band or seat symbol

1. Which band is this, and does anything other than hue say so?
2. Contrast on both grounds, with the numbers.
3. Closest neighbour in Oklab, typical and simulated.
4. Is any number it shows real (rule 6)?
5. Does its form match MOB 7104, or is the gap flagged?
6. Does any copy call the colours ancient, or claim an effect on the body?
