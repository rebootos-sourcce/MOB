# Research: the signal test, and the observer test

Commissioned after the owner looked at what onboarding calls the signal test
and ruled that it is not the signal test. He then described a second exercise
that does not exist anywhere in the product.

This file is in the order he asked for. Every claim from outside this
repository carries a URL. Anything I could not source is marked unsourced in
the line that makes the claim, rather than in a footnote.

Two prototypes accompany it and both run from the file system with no network
request of any kind.

    proto/signal/signal.html      the signal test, as he described it
    proto/signal/observer.html    the observer test, which did not exist

---

## WHAT IS BUILT, AND WHY IT IS NOT WHAT HE DESCRIBED

`atuned_src/ui/onboard.js`, the block `OB.step===2`, lines 158 to 183. The
screen shows a neutral word drawn at line 46 from a list of five, then a
charged word chosen at lines 47 to 56 from the nine child axes and defaulting
to Fear at line 54, then seven seat buttons and a Nothing button built at
lines 174 to 179 from `BANDS` at `atuned_src/engine/data/canon.js:66`.

It is a good screen. It is a different exercise.

**One. It is untimed, and the whole of both exercises is duration.** Both
words are written into the document at once, at lines 168 and 171. A person
can read the screen in four seconds and press a seat. Nothing paces them,
nothing holds a word in front of them, nothing asks them to stay. His
description opens with "take a second, turn their senses inward." The built
screen has no second in it. This is the defect that makes the other five
possible.

**Two. It never has them feel the difference between two states of their own
making.** The contrast built is between a dull word the product chose and a
loaded word the product chose. Both stimuli are the instrument's. His contrast
is between affirming and negating, and the person generates both of them. Yes
and no carry no subject matter at all, which is the point of using them: what
moves is the act, not the topic. "fear" carries subject matter, so whatever
moves could be this person's own history with the word. Those are two
different exercises reading two different things.

**Three. One exposure, not ten each.** There is no repetition anywhere in the
step. A single pass gives the signal no chance to build and gives the person
no baseline inside the exercise against which to feel anything.

**Four. It asks for a location, from a list.** Lines 174 to 179 are seven
named seats plus Nothing. His specification is a quality difference, which is
a different quantity from a location. And the list is the exact thing his
sentence rules out: "We all feel it differently, the words we would use to
describe it will be different." Seven seats is a vocabulary, handed over
before the person has felt anything.

**Five. The payoff grades the felt sense against a table.** Lines 195 to 203
compare the seat the person picked against `OB.charged.seat`, the canonical
address, and print whether they agree. Line 201 then says "Yours is the one
that counts," which is the right ruling, arriving after the comparison has
already been printed. On the first screen of the product, the instrument
checks the person's body against a lookup table.

**Six. Load, and where the attention goes.** Ten simultaneous choices on the
step, against a working floor of under 12, so it passes the count. It fails
the shape. About 70 words of prose sit above the first thing a person does,
and the doing is a click. An exercise whose entire content is interoception is
executed with the eyes.

**Seven. One line has the shape he struck elsewhere.** Line 172 reads "There
is no right answer." Nothing on the screen had suggested there was one. That
is the same move as the struck line at 123, and it belongs in the same bin.

The grade on what is built, as an implementation of his specification: it does
not implement it. As a screen in its own right it is competent and it is
warm, and every one of its defects is a defect of being the wrong exercise
rather than a badly made one.

---

## HIS DESCRIPTION, WHICH IS THE SPECIFICATION

The signal test:

> "This is not the signal test. The signal test is very personal. It has
> nothing to do with any of this text here or anything. Go do research on the
> signal test, come back with your findings. Because what it is, is asking a
> person to take a second, turn their senses inward, think yes ten times,
> think no ten times, feel a quality difference between the two. That's the
> mind body connection. One has a positive uplifting expansive sensation, the
> other has a contractive or heavy sensation. We all feel it differently, the
> words we would use to describe it will be different. The point is that
> that's the mind body connection. The fact that you have a thought that has a
> sensation in the body, that's highlighting the problem."

The observer test:

> "The observer test is just navigating you through your senses as a stack,
> backing you through feeling, smelling, listening, tasting, hearing, thought,
> until you're able to realise that there's a process of you that is
> perceiving the frequency, the sensation of thought, as a stack before all
> the other senses. So your awareness is a stack perceiving all the other
> senses. The reason why this is important is because that's what you actually
> are. You are this before emotional programming, sensory input, etcetera.
> That's who you are. And so this tool is designed to help repair the mind
> body, and then to help you understand who and what you are, by integrating
> any story that precedes awareness."

---

## WHAT THE BOOK SAYS

Both exercises are in `index.html`, The Mechanics of Being, in his own words.
They are not called the signal test and the observer test there. They are
client entry experiences one and two, and they appear again later as a full
session protocol. His text outranks everything below this section.

Line numbers are into the tag stripped text, which is 742,751 characters.

### The Two Are Adjacent, And They Are Entry Experiences

> "The Four Client Entry Experiences
> Four entry points, each requiring nothing but the person's own direct
> experience. No prior knowledge. No belief. No spiritual context. Just
> attention."

(line 396)

> "One · Mind-Body Connection
> Walk the client through their sensory channels one at a time. Ask them to
> notice where yes and no land in the body. Ask them to think "I am happy" and
> feel where it goes. "I am angry." "I am sad." Pin each word to its
> anatomical location. Realization: a nonphysical thought produced a physical
> reaction. The body is conducting frequency, not meaning. Once that is
> confirmed through direct experience, the conversation changes."

(line 400)

> "Two · The Observer
> Ask the client to think a thought. Then ask: who is watching the thought?
> Ask them to think the words very slowly, then louder, then as if screaming.
> Point out: something is doing the changing. Ask them to move their awareness
> back one level, to perceive their awareness the way their awareness
> perceives their thought. They will say no."

(line 402)

### The Signal Test, Written Out

> "Part One · System Check
> Say "yes" aloud. Notice where in the body it lands. A physical register.
> Something shifts when the word is spoken.
> Say "no" aloud. Notice where it lands. Different location, different somatic
> quality, different resonance from "yes."
> The realization: The word, the thought made audible, produced a physical
> event in the body. Language is not neutral. Every word is a signal with an
> anatomical address. The body conducts frequency, not meaning. This is the
> entry point. In sessions this runs in under two minutes. The person has
> confirmed the core premise through direct experience before a single concept
> has been explained."

(lines 3323 to 3326)

That last sentence is the duration budget and it is his: under two minutes.

### The Observer Test, Written Out

> "Part Three · Observer Sequence
> 1 · Ground. Move attention to the heart. Three slow exhales, each longer than
> the last.
> 2 · Inside. Move attention inside the body. Feel the body from the inside.
> Notice the warmth, the subtle movement. Something is doing this noticing.
> 3 · Outside. Expand the awareness outward from the body's center in all
> directions.
> 5-7 · Smell. Sound. Thought. "There is something aware of the smell of
> things. Not the smell itself, the thing noticing the smell."
> 8 · The question. "Notice that there is something aware, on top of your
> sensory input and your thought. And they all trigger a response in your
> body."
> 9 · The arrival. "This is your Observer. This is your point of origin." Stay
> here. Do not rush past it. This is the moment."

(lines 3332 to 3339, abridged at the step labels he wrote)

And the sentence that rules on where it goes:

> "The Observer does not unlock at the beginning of the work. It unlocks
> through the sequence. Explain it and it becomes an idea. Run the sequence and
> it becomes direct experience. Direct experience is the only installation that
> holds."

(line 3321)

And the sentence closest to his spoken description of the stack:

> "It supersedes senses, when awareness moves into the nose to identify a
> scent, something is noticing the noticing. That is the observer. That is what
> you are at the core of your experience."

(line 3318)

### Where The Book And The Spoken Description Disagree

Six places. Each one needs his ruling and each is repeated in the last section
of this file.

1. **Aloud or thought.** The book says say "yes" aloud. His spoken description
   says think yes. Speaking adds a motor act and an auditory return, which
   makes it a different exercise with a stronger stimulus and a weaker claim
   about thought alone.
2. **Location or quality.** The book's primary capture is where it lands. His
   spoken specification is the quality difference between the two. The book
   does say "different somatic quality" in the same breath, so it carries both.
3. **Repetition.** The book gives no count. His spoken specification is ten
   each.
4. **The observer and the awareness.** The book separates them: "The Observer
   is not the awareness. It is what is aware of the awareness" (line 3339).
   His spoken description makes awareness itself the top of the stack. The
   product's own glossary follows the book: `atuned_src/engine/data/kb.js`
   defines Awareness as "The aperture of perception of the soul" and the gate
   table has "GATE 2 Awareness. Awareness meets the stimulus before the senses
   process it. Awareness is the primary receiver."
5. **The order of the senses.** The book's session order is inside the body,
   outside, smell, sound, thought. His spoken list is feeling, smelling,
   listening, tasting, hearing, thought, which names taste and names the
   auditory channel twice.
6. **Where the signal chain already says this.** `kb.js` carries "Signal chain:
   field of awareness to senses to nervous system to brain to intelligence
   layer to relation layer to three axes to emotional layer to superego to
   koshas to archetypes to main field." That chain already puts the field of
   awareness before the senses, which agrees with his stack. It has eleven
   further stages after the senses that his description does not mention, so
   the two agree on the head of the chain and the observer test only walks the
   first two links of it.

One arithmetic disagreement between the book and the engine turned up while
searching and is noted here only so it is not lost. The book at line 2097 says
"112 charge-holding junctions in the human body, with 2 field nodes just
outside it for 114 total." `kb.js` says 112 total addresses including 4 field
nodes. `BOOK-ERRATA.md` is where that belongs and I did not touch it.

---

## THE RESEARCH

### The Tradition This Resembles, And What The Evidence Says

A yes and no test that reads a bodily response sits next to applied
kinesiology, and the evidence there is bad. It has to be reported straight.

Hall, Lewith, Brien and Little reviewed the literature in applied and
specialised kinesiology in Forschende Komplementärmedizin in 2008. They
identified 22 original relevant studies. Quality scored 1 to 11 out of a
maximum of 14 on QUADAS and 0 out of 5 on JADAD. Their conclusion was
insufficient evidence for diagnostic accuracy, insufficient evidence for the
validity of the muscle response, and insufficient evidence for effectiveness
in any condition.

- https://www.ncbi.nlm.nih.gov/books/NBK76251/
- https://pubmed.ncbi.nlm.nih.gov/18334813/

A 2025 systematic review of manual muscle testing reliability inside applied
kinesiology examined 7 studies. Every analysis that involved a
nonmusculoskeletal challenge showed nonexistent reliability. Plain muscle
testing without a challenge was potentially reliable for some named muscles,
which is orthopaedic testing and not the thing in question.

- https://www.sciencedirect.com/science/article/abs/pii/S0161475425000375

The one well designed test of the diagnostic claim is a double blind
randomised study published in Explore in 2014. Across 151 sets of trials the
toxic vial was identified correctly in 80 of them, which is 53 percent, with a
one tailed exact binomial p of .258. Two of the three kinesiologists scored
almost exactly at chance and so did the dynamometer.

- https://www.sciencedirect.com/science/article/abs/pii/S1550830713003418
- https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3373872/

The mechanism that explains the positive experience practitioners report is
ideomotor action. Carpenter named it in 1852. Chevreul showed that
imperceptible muscle activations start the pendulum and grow under visual
feedback, and that the movements stop once the person becomes aware of them
and cannot then be reproduced deliberately.

- https://academic.oup.com/nc/article/2017/1/nix014/4060585
- https://www.biorxiv.org/content/10.1101/841445v1.full

Hawkins built a 1 to 1000 calibration scale of consciousness on this method.
The scale rests on muscle testing as a truth detector and that is the claim
the systematic reviews do not support.

- https://en.wikipedia.org/wiki/Applied_kinesiology

**The distinction that decides whether any of this bites.** Every study above
tests muscle testing as a diagnostic: an external test, applied by a
practitioner, to read a fact about the world that the person could not
otherwise know. His signal test is not that. Nobody pushes on an arm. Nothing
is held against a vial. No fact about the world is being read. It is a first
person noticing task, and its entire claim is that a thought produced a
sensation, which is a claim about the person's own report of their own body.

So the exercise can be valuable as a noticing task and worthless as a
diagnostic, and those are two separate claims that have to stay separate in
every line of copy the product ships.

**One place in the product already crosses that line.**
`atuned_src/engine/data/practice.js` carries a row with the key `truth`, named
The Somatic Truth Check, whose description reads "Expansion is true.
Contraction is distortion" and whose instruction reads "Hold the statement and
read the body. Expansion means true. Contraction means distortion. Use it
live, in the moment, as an instrument." That is the applied kinesiology claim
in this product's own voice, stated as an instrument. It is not my file. It is
named here because the research above is directly about it.

### Interoception, And Its Broken Ruler

The anatomy is settled and `RESEARCH-somatics.md` already carries it with
sources: the insula is the interoceptive cortex, anterior insula supports
conscious access to those signals, and focal lesion patients show reduced
performance on interoceptive tasks.

The measuring stick is the problem. Zamariola and colleagues in Biological
Psychology in 2018 showed that heartbeat counting task accuracy largely
reflects systematic under reporting, that the correlation between actual and
reported beats is low, and that scores track a person's prior belief about
their own heart rate rather than their perception of it. A 2025 Psychophysiology
paper compared three ability measures and found they do not agree with each
other.

- https://www.sciencedirect.com/science/article/abs/pii/S0301051118303739
- https://onlinelibrary.wiley.com/doi/10.1111/psyp.70078

Garfinkel's three way split is the frame that makes this usable. Accuracy,
sensibility and awareness are three different quantities. A self report
instrument measures sensibility only, and it should say so.

The reference self report instrument is the MAIA-2: 37 items across 8
subscales, with internal consistency from .64 to .83 in a community sample and
test retest ICCs from .67 to .79. It is a trait questionnaire, not a state
read, which means it is the wrong shape for a 90 second exercise but the right
benchmark for anything this product claims to trend.

- https://pmc.ncbi.nlm.nih.gov/articles/PMC10826081/
- https://www.nature.com/articles/s41598-023-48536-0

The practical reading, and it is narrow good news. The objective bedside test
for interoception is unreliable, which means a well built self report is not
obviously worse than the lab task. That is a reason not to apologise for self
report. It is not a licence to call self report a measurement of the body.

### Affect, Embodiment, And The Expansive Versus Contractive Claim

Russell's circumplex puts affect on two dimensions, valence and arousal, and
forty years of studies have recovered those two repeatedly. A recent test of
the geometry argues the shape is an ellipse rather than a circumplex, which
does not disturb the two dimensions.

- https://pmc.ncbi.nlm.nih.gov/articles/PMC2367156/
- https://www.sciencedirect.com/science/article/abs/pii/S0191886921004293

Nummenmaa and colleagues, PNAS 2014, had 773 participants colour body outlines
for where sensation rose and where it fell across six basic and seven non
basic emotional states. The maps are topographically consistent, and they
replicate across Finnish and Taiwanese Hokkien samples and again in a 2024
PNAS extension to music induced sensation across Western and East Asian
subjects.

- https://www.pnas.org/doi/abs/10.1073/pnas.1321664111
- https://www.pnas.org/doi/10.1073/pnas.2308859121

Approach and avoidance have a genuine bodily component. Arm flexion is
facilitated toward positive stimuli and extension toward negative, flexion
increases affective startle modulation, and whole body stepping shows the same
bias.

- https://pmc.ncbi.nlm.nih.gov/articles/PMC9505509/
- https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6917595/

Meier and Robinson, Psychological Science 2004. Positive words are evaluated
faster in the upper position and negative words faster in the lower position,
and positive evaluations activate higher areas of visual space. Critically,
the effect runs one way: evaluations activate space, space does not activate
evaluations.

- https://journals.sagepub.com/doi/10.1111/j.0956-7976.2004.00659.x

That last finding is a direct confound for any capture that offers a person a
vertical axis. Ask where yes went and the good is up metaphor will pull the
answer upward whether or not anything in the body moved. It is named again in
the capture section with a test that would detect it.

Semantic satiation. Lambert and Jakobovits, early 1960s. Repeating a word two
to three times a second causes it to lose meaning, with onset typically after
10 to 50 repetitions. This is the sharpest design finding in the file. Ten
repetitions delivered at speed is the single pace that would empty the word
before the exercise ends, which is why the prototype runs at one repetition
every three seconds.

- https://en.wikipedia.org/wiki/Semantic_satiation

**What I could not source, and it is the central claim.** I found no study
testing whether a person thinking the word yes reliably reports an expansive
or uplifting sensation and thinking no reliably reports a contractive or heavy
one. **Unsourced.** The nearest evidence is a chain of three indirect steps:
valence maps to approach, approach maps to flexion and toward, and emotions
produce topographically consistent bodily maps. Each link is evidenced. The
chain is plausible. It is not a measurement of the thing he described, and the
product may not present it as one. What the product may say is that the
difference is the reading, without asserting in advance which direction it
runs.

### The Observer, Decentering, And Self As Context

The contemplative sources are old and consistent. Sakshi is the witness in
Advaita Vedanta. Drashta is the seer, and purusha in Samkhya is characterised
precisely as the drashta: Samkhya Karika 19 gives witnesshood, independence,
neutrality, seership and non agency. Patanjali's cessation of mental
fluctuations exists so that the seer can abide in its own nature. His
description sits inside this tradition and does not need to be defended from
outside it.

- https://en.wikipedia.org/wiki/Sakshi_(witness)
- https://en.wikipedia.org/wiki/Samkhya

The modern construct with real evidence behind it is **decentering**, and it
is the closest thing in the literature to what he is describing. Fresco and
colleagues built the Experiences Questionnaire in 2007, an 11 item self report
measure of the tendency to take a detached observer perspective on one's own
thoughts. It has been translated into at least 15 languages, performs well
across adult samples, and shows full or partial measurement invariance across
age, race and ethnicity, gender and meditation experience, meaning scores can
be compared across those groups. Decentering increases under cognitive
behavioural therapies, emotion regulation therapy and mindfulness based
interventions, and contributes to their effects.

- https://link.springer.com/rwe/10.1007/978-3-031-47219-0_42
- https://pubmed.ncbi.nlm.nih.gov/31464465/
- https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10684915/

The weaker neighbour is self as context in ACT, which is the same idea inside
a therapy model. A systematic review found only provisional and very limited
evidence, on 4 identified studies, mostly small undergraduate samples, and an
open debate about whether self as context is even necessary.

- https://www.sciencedirect.com/science/article/abs/pii/S0005789419301522

Measurement of meta awareness has a specific trap that lands directly on this
product. A systematic review of self caught methodologies included 39 studies
from 790 assessed for eligibility, and found that offering incentives for
frequent self catching encourages untruthful reports and over reporting.

- https://www.sciencedirect.com/science/article/pii/S1053810022001957

**Safety, and it is the load bearing finding for where the observer test
goes.** Farias and colleagues, Acta Psychiatrica Scandinavica 2020, put
adverse effects at 22.2 percent of participants in observational studies and
3.7 percent in experimental studies. Other work puts 50 to 53 percent of
meditators reporting at least one meditation related adverse effect.
Depersonalization occurs in 9.2 percent of meditators drawn from the general
population. Lindahl's Varieties of Contemplative Experience names six discrete
changes in sense of self, including loss of sense of ownership, loss of sense
of agency, change in sense of embodiment and loss of sense of basic self.

- https://onlinelibrary.wiley.com/doi/10.1111/acps.13225
- https://sites.brown.edu/britton/research/the-varieties-of-contemplative-experience/
- https://www.cheetahhouse.org/sense-of-self-domain

An exercise whose explicit target is that you are not the thought but the
thing watching it is a decentering induction aimed at the sense of self. That
is what it is for, it is what makes it valuable, and it is why the prototype
has an exit at every beat and a grounding close.

### The Sensory Stack, And What May Be Said About It

**Defensible as phenomenology.** That any sense datum arrives somewhere, and
that something can be found which is receiving it rather than being it, is a
first person report about the structure of experience. It is the oldest report
in the contemplative record and it is what the exercise invites a person to
check for themselves. The product may describe it, may offer it, and may ask a
person to look.

**Not defensible as neuroscience.** The claim that awareness sits before the
senses in the nervous system runs the opposite way to the evidence. Conscious
access to a stimulus is a late event. The global neuronal workspace account
puts the late positive correlate of conscious access at roughly 300ms, with a
candidate earlier marker at roughly 160 to 220ms spreading from occipital to
frontal cortex. Whichever marker is right, conscious report is downstream of
sensory processing.

- https://www.cell.com/neuron/fulltext/S0896-6273(20)30052-0
- https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6368270/

The product's own glossary already asserts the upstream version, in the gate
table in `kb.js`: "Awareness meets the stimulus before the senses process it.
Awareness is the primary receiver. The senses are the instruments awareness
reads through, not the other way around." Inside the book's own frame that is
a cosmological statement and it is his to make. It is not a statement about
the nervous system and the product must never let it be read as one.

The practical rule for copy. The observer test may say "something is aware of
the smell, not the smell itself," because that is an instruction to look. It
may not say "this happens before your brain processes the smell," because that
is a neuroscience claim and it is wrong.

---

## THE CAPTURE PROBLEM

He rules out handing a person words. The same sentence rules out handing them
seven seats. An instrument still has to compute on something.

The general move is to **capture the structure of the difference and not its
content**. A person's vocabulary for a sensation is theirs and is not
comparable. Geometry, magnitude, duration and their own repeated words are
comparable enough to compute on without importing anybody's language.

Six mechanisms. Two are in the prototype, one is validated elsewhere and
buildable, three are cheap.

### One. The Unlabelled Pad, Live Under The Stimulus

Built, at `proto/signal/signal.html`. A circle with no axes, no labels and no
words. The person moves a marker while the word is in front of them, not
afterwards, so what is recorded is a report made during the sensation rather
than a memory of it.

**Captures.** A vector per word, plus the whole trace with timestamps. Derived:
radius, angle, the separation between the two vectors, the angle between them,
time to first movement, time to a stable position, number of reversals.

**Cannot.** Say what the quality was. It captures the shape a person drew and
not the sensation that produced it. And it is exposed to the good is up
metaphor. A person may put yes high because up means good.

**Engine.** Separation is the primary number, and it is a within person
difference, which is what makes it survive the confound. Whatever the metaphor
pulls, it pulls both marks, so a person whose yes and no land in the same
place has a small separation regardless. Separation trended across sessions
reads the thing the product actually wants to know, which is whether the body
signal is legible to this person yet.

**The confound is testable.** Run one arm of the population with the pad
rotated 90 degrees. If reported directions rotate with the pad, it is reading
the metaphor. If they do not, it is reading something else. That is a real
experiment, it costs one boolean in the build, and nothing else in this file
can settle the question.

### Two. Their Own Word, And Whether The Same Word Comes Back

Built, as the optional one word field. This is Gendlin's handle: the word that
resonates most precisely with a felt sense at a moment, found by the person
rather than supplied.

- https://focusing.org/gendlincenter/what-focusing
- https://en.wikipedia.org/wiki/Focusing_(psychotherapy)

**Captures.** One word per stimulus, in the person's own vocabulary.

**Cannot.** Be compared across people on first use. Mapping it to a taxonomy on
day one is the exact move he ruled out.

**Engine.** Does nothing with it on day one but store it and show it back. The
computable quantity is not the word, it is whether the same word returns.
Stability of a person's own descriptor across sessions is a within person
measure that needs no shared vocabulary at all. After a person has produced
enough of their own words, the product may offer their own previous words back
as quick picks, which is recognition over recall without ever having handed
them anybody else's list.

### Three. The Two Body Painting, Activation And Deactivation

Not built in the prototype. Validated elsewhere and directly buildable. The
emBODY method shows two body silhouettes, and the person paints where
sensation rose on one and where it fell on the other, with successive strokes
increasing opacity.

- https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9674849/
- https://www.sciencedirect.com/science/article/abs/pii/S1071581918300545

**Captures.** A topography per word, continuous, with no words at all.
Expansion and contraction are read as activation and deactivation, which is a
gesture rather than a label.

**Cannot.** Distinguish two different qualities at the same address. And it is
slow: roughly a minute per stimulus in research use, which is most of the
budget.

**Engine.** This is the only mechanism here that the existing Body page can
consume directly, because that page is already argued from Nummenmaa. The
difference map between the yes painting and the no painting is a per person
somatic contrast with a published method behind it.

**Note.** It captures location, which is the book's version of the exercise
rather than his spoken version. It is the bridge between the two and it is the
reason question two in the last section has to be asked.

### Four. Duration And Latency, Captured Without Asking Anything

**Captures.** Time from a word appearing to the first movement of the marker.
Time to a stable position. How long a person stays on a hold beat. Whether
they leave, and where.

**Cannot.** Say anything about quality. And it is contaminated by device, by
attention and by whatever happened in the room.

**Engine.** This is the cheapest instrumentation in the product and it is the
one that says whether the exercise is working as an exercise rather than as a
screen. A person who settles in 1.2 seconds did not turn their senses inward.
A person still moving at the tenth repetition is reading something. Latency
distributions are also the first real data this product would hold about the
difference between the levels of the buyer grid, and they cost nothing.

### Five. The Difference Slider, Which Asks Only About Difference

Built. One control, with ends reading "the same" and "nothing alike", and
nothing in between named.

**Captures.** One number: the person's own report of how far apart the two
were.

**Cannot.** Say which direction, or what either one was. Deliberately.

**Engine.** This is the number that most directly answers his specification,
because the specification is about a difference and not about a state. It is
also the only number here that compares across people without importing
vocabulary, because how different means roughly the same thing to everybody in
a way that expansive does not.

It has a second use. The gap between the reported separation and the geometric
separation taken from the pad is a measure of how well a person's report
matches what they showed. In Garfinkel's framework the analogous quantity is
interoceptive awareness, the correspondence between confidence and
performance. It is a reading about the reading, and it comes free.

### Six. Forced Choice Between Their Own Two Marks, Later

Not built. At the next session, show the person their own two marks from the
previous run with the labels stripped, and ask which was which.

**Captures.** One bit. It is the only mechanism here that can be scored right
or wrong without importing a vocabulary, because the correct answer is the
person's own earlier answer and nobody else's.

**Cannot.** Work on a first run. And it can be passed by remembering the
picture rather than the sensation, which caps how much weight it can carry.

**Engine.** A within person consistency check. If a person cannot tell their
own yes from their own no a week later, the signal has not stabilised. That is
the closest this product can honestly come to validating its own instrument
from the inside.

### Named And Rejected

Having a practitioner rank a person's two words. It needs a practitioner, it
exports the person's private language, and `DECISIONS.md` already governs that
boundary. Named so that it is not reinvented as a new idea.

### What This Leaves The Engine

With no imported vocabulary at all, the engine holds four numbers: separation,
stability, latency and consistency. All four are within person. All four are
differences. Not one of them names a sensation. That is the answer to the
capture problem.

---

## THE TWO EXERCISES, SPECIFIED

### The Signal Test

`proto/signal/signal.html`. Screenshots at 1600 by 1000 and at 390 by 844 sit
beside it.

| Beat | What the screen says | Duration | Captured |
| --- | --- | --- | --- |
| Instruction | Two minutes, it runs on its own, you will be shown one word ten times then a second word ten times, move the marker to show what the word did | until pressed | nothing |
| Settle | Turn your senses inward. Follow the ring. Breathe out for as long as it takes to close | 15 seconds | nothing |
| First word | the word yes, fading in over 0.9s and out again, ten times | 30 seconds | the live vector trace |
| Hold | Stay with what is left of it | 6 seconds | nothing |
| Second word | the word no, on the same beat, ten times | 30 seconds | the live vector trace |
| The difference | the two marks shown back as marks, one slider, two optional one word fields | person paced | reported separation, two words |
| What was captured | the record, printed plainly, with a control that dumps it verbatim | person paced | nothing new |

Paced attention totals 81 seconds. With capture the whole thing runs about two
and a half minutes, and the core is inside his book's budget of under two
minutes.

**Why three seconds a repetition.** Semantic satiation onsets at 10 to 50
repetitions delivered at two to three per second. Ten fast repetitions is the
one pace that would hollow out the word before the beat ends.

**Why ten, and not three.** Ten is his. Ten at three seconds is thirty seconds
per word, which is about the time attention needs to arrive and stay.

**Why the order is fixed, yes then no.** Order effects are real. Randomising
per person would make the first session incomparable to the population.
Counterbalancing is an experiment to run deliberately later, not a default.

**Why six seconds between.** Long enough that the second word is not read
against a live first word, short enough that the contrast is not lost.

**Why the marker is live rather than asked for afterwards.** A report taken
after the fact is a memory of a sensation. Petitmengin's work on eliciting
descriptions of experience is explicit that introspective reports are shaped by
belief, context and judgement, and that the risk is a person describing their
interpretation rather than their experience. Capturing during the stimulus
does not remove that risk but it removes the recall step.

- https://onlinelibrary.wiley.com/doi/10.1002/9781119132363.ch51
- https://onlinelibrary.wiley.com/doi/full/10.1111/sjop.12858

**Why Nothing moved is a bordered control and not a caption.** A flat response
is a real reading of the run. The standing rule is that a control with no
affordance is the same as no control.

**What the engine does.** Computes separation from the two vectors, the angle
between them, latency to first movement and settle time, and stores the
person's own two words unparsed. Trends separation and stability across runs.

**What it never does.** Name a seat. Write charge to the nine axes. Compare
what the person felt against a canonical address.

### The Observer Test

`proto/signal/observer.html`.

| Beat | What the screen says | Duration | Captured |
| --- | --- | --- | --- |
| Instruction | six minutes, sitting still, each sense gets two beats, and the stop instruction | until pressed | nothing |
| Ground | three slow breaths out, attention to the middle of the chest | 26 seconds | nothing |
| Contact | attention inside the body, then: something is receiving that | 20 then 14 seconds | dwell, one optional tap |
| Smell | attention to the air, then: something is aware of the smell, not the smell | 20 then 14 seconds | dwell, one optional tap |
| Taste | attention to the mouth, then: the same something as a moment ago | 20 then 14 seconds | dwell, one optional tap |
| Sound | attention out past the walls, then: aware of all of it without going anywhere | 20 then 14 seconds | dwell, one optional tap |
| Sight | attention to what arrives at the eyes, then: it is not in the picture | 20 then 14 seconds | dwell, one optional tap |
| Thought | think I am here, again louder, again as a shout without sound, then: something is aware of the thought, on top of it | 24 then 18 seconds | dwell, one optional tap |
| The question | all six arrived somewhere. What is the arriving happening to | 28 seconds | nothing |
| The arrival | the band appears above the stack for the first time | person paced | time held |
| Close | feet flat, weight in the chair, temperature of the room | 20 seconds | nothing |
| What was captured | the record, and one optional word for the position | person paced | the word |

Automated beats total 286 seconds. With the arrival and the close it runs five
to six minutes.

**Why the stack is drawn and not described.** The screen opens with six sense
bands and no band above them. The band above appears at the arrival and never
before. A person who is told there is a layer above the senses has an idea. A
person who walks the stack and then sees the band land has something else. His
book says exactly this at line 3321.

**Why the thought station is last and longest.** It is the one that closes the
argument, because a thought turns out to be in the stack with the other five
rather than above them. The book's three move version, think it, louder, as if
shouting, is inside it, and its purpose is that the person notices they did the
changing.

**Why there is a grounding close.** Because the literature on adverse effects
says so, and because a decentering induction that ends on the induction is
badly made.

**Why the exit is on every screen.** Same reason. And because the feedback
floor says anything over ten seconds needs a way to leave.

**What the engine does.** Records dwell per beat, how long the person held at
the arrival, which stations they tapped, whether they left and where, and one
optional word. Time held at the arrival is the only quantity worth trending,
because it is the only one that tracks whether the position is becoming
available.

**What it must never do, and this is a collision with work now in scope.** The
tap must not feed points, badges or a streak. The systematic review of self
caught methodologies found that incentivising self catching produces over
reporting. Gamifying that tap would destroy the only signal the exercise
collects, and the gamification ladder is currently in scope. His ruling is
needed.

---

## WHERE THE OBSERVER TEST BELONGS

Not in onboarding. Five reasons, in the order they bite.

**One. His own book rules on it.** "The Observer does not unlock at the
beginning of the work. It unlocks through the sequence. Explain it and it
becomes an idea. Run the sequence and it becomes direct experience." Line 3321.
Onboarding is the beginning of the work by definition.

**Two. The budget.** It runs five to six minutes. Onboarding's stated budget is
on its own first screen, at `onboard.js:125`: "Two minutes. One thing to try."
The observer test is three times the whole flow.

**Three. The buyer grid.** `BUYERS.md` is not monotonic. It peaks at levels 8,
9 and 10, collapses through 5 and 4, and floors at 1, and levels 4 and 5 are
the largest population and the hardest sell. A six minute witness meditation at
first run is written for level 8. Walk it with the reference profiles and it
separates immediately: Angela at 36 will do it and will like it. Diane at 46
running a company will not give six minutes to an app she opened ninety seconds
ago. Derek at 39 will skip on principle because nothing has earned it yet.
James at 57 will close the tab. A flow that works for Angela and fails for
Diane, Derek and James is a flow that works for nobody who pays twice.

**Four. The safety case.** Adverse effects at 22.2 percent of participants in
observational studies, depersonalization at 9.2 percent of meditators from the
general population, and six named changes in sense of self in Lindahl's
taxonomy. First run is the worst place in the product to run a decentering
induction, because the person has entered nothing, has no relationship with the
instrument, and has no reason to trust that the exit works.

**Five. It is a practice, and the product already has a table of practices.**
`atuned_src/engine/data/practice.js` carries rows with a track, a minute count
and a tier, and it already has The Signal Test at 3 minutes on tier 1. The
observer test is the same kind of object at 6 minutes, and it belongs in the
same table.

**So where.** The ritual, as a practice. And offered at a specific moment
rather than on a menu: before the first release, because that is the moment his
own note names. `TASKS.md` records his ruling as "possibly the observer too, so
they know how to drop back into witness and not take a release personally." The
operative word is release. The observer test earns its six minutes the first
time a person is about to let something go, and not before.

**What onboarding gets instead.** One sentence saying the layer exists, and
nothing else. Onboarding may name it. It may not run it.

**And where the signal test goes.** Onboarding, and it stays the only
interactive thing there. Eighty one seconds of paced attention fits the two
minute budget with room for the capture. It should also be a practice row for
later, which `practice.js` already anticipates.

---

## WHAT NEITHER MAY CLAIM

**Neither may say that a sensation means a statement is true or false.** That
is the applied kinesiology claim and the evidence is against it: insufficient
evidence for the validity of muscle response across 22 studies, and 80 correct
identifications out of 151 trials at p = .258 in the one well designed test.
This applies to the existing practice row that reads "Expansion means true.
Contraction means distortion."

**Neither may diagnose.** Nothing here detects a condition, an organ, an
allergy, a deficiency or a disorder.

**Neither may grade the person.** No count against a total, no percentile, no
level, no pass. The standing ruling already covers it and it bites hardest
here, because both exercises produce something that looks scoreable.

**The signal test may not tell a person where they should have felt it.** That
is what `onboard.js:195` to `:203` does now and it is the line to delete.

**The signal test may not write charge to the nine axes.** Nothing it captures
is a reading of the field.

**The signal test may not treat a flat response as a finding about the
person.** Nothing moved is a reading of that run at that moment.

**The observer test may not claim that awareness precedes sensory processing in
the nervous system.** It may describe the position and ask a person to look for
it. The distinction is between phenomenology, which is defensible, and
neuroscience, which runs the other way.

**The observer test may not claim to have measured awareness.** It records
dwell time and taps.

**Neither may claim the run did anything lasting.** One run is one run.

**Neither may feed points, badges or a streak.** Incentivised self report
corrupts the only data these exercises collect.

**Neither may present its numbers as the instrument's accuracy.** The accuracy
percentage and its interval describe what the engine has read from stories, and
these numbers are a different thing.

**The claim that is available, and it is enough.** A thought produced a
sensation. The person noticed it. That noticing is the capacity everything else
in the product runs on. His own sentence says it better than any of mine: "The
fact that you have a thought that has a sensation in the body, that's
highlighting the problem."

---

## THE QUESTIONS I CANNOT ANSWER

Eleven, and every one of them changes what gets built.

**Q1. Thought, or spoken aloud.** His description says think yes ten times. His
book says say "yes" aloud. Speaking adds a motor act and an auditory return,
which makes it a stronger stimulus and a weaker demonstration about thought
alone. The prototype follows his spoken description and shows the word rather
than instructing speech.

**Q2. Quality, location, or both.** His description asks for the quality
difference. His book's System Check asks where it lands. The prototype captures
a shape that is neither exactly. Does the signal test also ask where.

**Q3. The pad, or the two body painting.** They capture different quantities.
The pad captures a gesture about quality, the painting captures a validated
topography. Both are buildable. The painting costs about a minute per stimulus
and would push the exercise past the two minute budget.

**Q4. Ten repetitions at three seconds each.** Ten is his. Three seconds is
mine, argued from semantic satiation. Does he want a different beat, or a
different count.

**Q5. Does the signal test write anything to the record.** The current build
writes nothing and says so at `onboard.js:211`. If separation is going to be
trended across sessions it has to be stored, and storing it makes the exercise
part of the record rather than an opener.

**Q6. The observer, or the awareness.** The book separates them at line 3339:
"The Observer is not the awareness. It is what is aware of the awareness." His
spoken description makes awareness the top of the stack. `kb.js` currently
follows the book. Which does the product build, and does the glossary move.

**Q7. The order of the six senses.** His spoken list is feeling, smelling,
listening, tasting, hearing, thought, which names the auditory channel twice
and names taste. The prototype uses contact, smell, taste, sound, sight,
thought, following the book's session order. Is that the order.

**Q8. Where the observer test sits in the ritual, and at what tier.** And is it
offered before the first release, as his note suggests, or somewhere else.

**Q9. The gamification collision.** The meta awareness literature says
incentivising a self report tap produces over reporting. Points, badges and a
ladder are now in scope. Does the observer test sit outside the points ladder
entirely.

**Q10. The Somatic Truth Check.** `practice.js` carries "Expansion means true.
Contraction means distortion. Use it live, in the moment, as an instrument."
That is a truth detection claim and the evidence is against it. Does it stay as
written, get reworded as a noticing practice, or go. It is not my file and I
changed nothing.

**Q11. Does either exercise need to produce a number at all.** Both could be
built to capture nothing but a timestamp and still do the job he described,
which is to have a person feel the connection. Making them instruments is a
design decision with costs, and it is his call rather than mine.
