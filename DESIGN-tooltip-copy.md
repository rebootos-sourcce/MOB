# The words in the tooltip

June Okonkwo-Lund, story. 27 September 2026.

**What this is.** Research and a pitch, ordered in `TASKS.md` FV. His words:
"I need my story team to figure out like these tooltips and the copy and what
kind of messaging we're trying to show here. So I want them to go out to the
internet, search all the tools that have the highest rating for things like
this, find out what kind of information actually needs to be in this, and then
give me a pitch." And the bar, in the same breath: "this isn't a computer, we're
talking about human behavior. It needs to be in a language that people can
understand. It needs to be grounded. It needs to be direct. It needs to be
simple. It needs to be informative. It needs to provide context. And it needs
to have a kind of a warmth to it that says I see you, in a way. But not
condescending either."

**It is a pitch and not a rewrite.** Nothing under `atuned_src/` moved,
`source.html` was not touched, and no gate was changed. Another seat is
building in `atuned_src/` tonight, and code should follow an agreed pitch
rather than run beside it blind.

**Where it sits.** `DESIGN-tooltip.md` is the panel: one anchored tooltip, its
geometry, its motion, and the two tier ruling of 26 September at the foot of
it. `DESIGN-information.md` is the routing: which of five questions goes to
which surface, and the `data-gloss` attribute. This file is the layer inside
both of them: **the words**. Where either already rules, it is cited here and
not ruled again.

---

# 1. Method

**The code.** Read against commit `34012d7`. Every string quoted below carries
its file and line in `atuned_src/`.

**The people.** Five reference profiles loaded headless through `engine.js`,
the engine half of the build, with `proto/tipcopy/probe.js`: Tomas, Derek,
James, Angela and Gordon. Their numbers in the worked examples are read off
that run, not invented. A headless read uses each reference case's stated law
table, which is not quite what the app shows: the app rounds laws through the
intake, and `DESIGN-integrity.md:439` measured Tomas's Courage as stated 1.1
and reading 2.3 because of it.

**The scope.** `proto/tipcopy/figscan.py` finds every place a renderer prints a
figure straight after a word. It was checked against the three known lines
before it was believed. Its first version did not pass that check, which is
recorded in section 3.

**The web.** Search, 27 September. The page fetcher was refused by the network
proxy for `support.ouraring.com` and `www.16personalities.com`, the same
refusal `RESEARCH-firstrun.md` recorded the day before. So every source below
was read through its search result summary and not the full page. Every claim
carries its address. Anything quoted from a source is the source's wording as
the summary gave it, and should be read at the source before it is repeated to
a customer.

**The gate.** Every rewrite in section 5 went through
`python3 .claude/skills/atuned-voice/check.py --line`, one line at a time. The
gate was first shown to fail four known bad lines, so a pass means something.
`proto/tipcopy/gate.sh` re-runs all of them.

---

# 2. What he was looking at, found

Both of his examples are the same person. Tomas is a reference case in the
roster, his lowest law is Courage, and his character layer is Dissociation
fused with Dysregulation. The third string is an address drill.

| He said | It is | Quoted exactly |
|---|---|---|
| "courage most shut law 2.3 of 10" | a Dial callout, `ui/rings.js:970` | `Courage` over `Most shut law. 2.3 of 10` |
| "Dissociation character" | a Dial callout, `ui/rings.js:966` | `Dissociation / Dysregulation` over `Character layer` |
| "held 5.0 opposite install 0.0", after clicking distortion | the address drill, `ui/drills.js:249` | `Held 5.0, opposite installed 0.0, net SQ 5.0. Distorts as Avoidance.` |

The third string ends on "Distorts as", which is the word he pressed. It is
the only sentence on that drill that says what the address does in a life, and
it is one noun long.

---

# 3. The current copy, sampled across the product

His three strings are not the anecdote they look like. They are the house
pattern. Thirteen more, from nine files, each as a person reads it:

| # | Where | What a person reads | What is wrong |
|---|---|---|---|
| 1 | `drills.js:249` address drill, Derek | `Held 5.4, opposite installed 0.0, net SQ 5.4. Distorts as Self-rejection.` | Three variable names and three decimals in one sentence. No definition of an address. The behaviour is one noun. |
| 2 | `drills.js:252` same drill | `This sits on the Shame toward Worth axis, at the pudendal plexus.` | "Axis" is schema. The body place is a nerve name with no plain place beside it. |
| 3 | `ui.js:37` to `:42` the Field hover | `001 Fear` / `Root seat, Lumbar Plexus` / `axis Fear` / `susceptibility 1.00` / `held 0.3, opposite 8.8` / `SQ 0.0` | Six readouts in a hover. The storage index `001`, which `drills.js:243` already cut from the drill as "a storage key". The most seen tooltip in the product. |
| 4 | `rings.js:962` Dial | `Heart. SQ 6.2` | A seat, a stop, a variable. |
| 5 | `rings.js:973` Dial | `Heaviest pattern. Weight 6.5` | The same shape. |
| 6 | `rings.js:966` Dial | `Character layer` | A label this product puts on a person with nothing attached, which V9 of the voice skill forbids. "Character layer" is not in `GLOSS`. |
| 7 | `component.js:173` every ring's native title | `Root · 9.4` on the Fear ring and `Heart · 0.0` on the Trust ring | The ring titles itself with its colour's seat. The Trust ring says Heart because `ui.js:555` colours it Heart. |
| 8 | `ui.js:1106` to `:1117` right rail | `integrity 1.9 of 10` / `intention 1.9 of 10` / `pole in 0.00 of 10` / `overshoot 0.00 of 10` / `distortion 10.0 of 10` | Five variable names. "Integrity 1.9" reads as a moral grade and nothing says what it measures. |
| 9 | `drills.js:216` law drill | `This law is shut. Under 4 it is not resisting, it is closed, and everything seated at the solar pays for it.` | The threshold read aloud, and an antithesis. "Pays for it" is the right instinct with no mechanism behind the words. |
| 10 | `drills.js:399` energy drill | `intention against distortion. Intention 1.9, distortion 10.0.` | Two variables chained. |
| 11 | `imprints.js:207` imprints | `Fear toward Trust` then `held 9.4, opposite 0.0` | The same chain, on the page where a person reads their own writing. |
| 12 | `drills.js:386` pole drill | `...the pole is how much of that opposite is installed, 0 to 1 averaged across the nine.` | **False.** `engine/compute.js:225` sets each address's pole from 0 to 10 and `:303` averages it over every body address, not the nine emotions. Pass 1, the truth pass, fails before any other. |
| 13 | `ui.js:1129` right rail, running cards | `Saboteur, collapsed` | "Collapsed" is also the lowest coherence band in `canon.js`. One word, two concepts. The canonical word for a live pattern is "running". |

**And what already works, which the pitch builds on rather than replaces.**

- **`SABDEF`, `engine/data/kb.js:16`.** Each saboteur carries what it is, when
  it fires, what it says, and the interrupt. The Pleaser's interrupt reads
  "State a preference or limit once. Do not explain or apologize." That is the
  best reading copy in the product, and it is exactly the definition, the
  behaviour and the direction out that V9 asks of every label.
- **`TIERDEF`, `engine/data/canon.js:610`.** Each coherence band carries a
  definition, how it feels, and a `toward` line. The same three.
- **`HCX_LIB`, `engine/data/nodes.js:34`.** One physical line per deep pattern.
  Dissociation: "the outline holds and there is nobody inside it".
  Dysregulation: "the swing overshoots at both ends and never settles at the
  middle". These are real copy and neither reaches the Dial.
- **`IQ_STEM`, `engine/intake.js:10`.** A plain verb phrase for every one of
  the 21 laws, the exact words a person answered. Courage: "move toward what
  you are avoiding". **This is the missing definition of every law, already
  written, already true to what was measured.** `SI` in `canon.js:432`
  carries a name, a seat and a glyph and nothing else, so the product has had
  the sentence all along and prints "2.3 of 10" in its place.
- **`drills.js:463`**, the flow drill: "one shut seat closes the column
  whatever the six above it are doing". A cost, in a physical metaphor, true to
  the arithmetic.

### The scope, measured

`proto/tipcopy/figscan.py`, commit `34012d7`:

    figures printed straight after words in ui/        66
      of which CSS, not copy                             5
      copy sites                                         61
        a variable name, then a decimal                  41
        a figure already inside a sentence               20

The 41 are the shape he objected to. They run heaviest in `ui.js` and
`drills.js`, which are the hover and the drill, the two tiers a person uses to
ask what something means. The count is a floor: a figure passed through a
helper such as `row()` or `cr()` does not follow a literal and is not seen.

**The first probe lied.** It used a grep bracket expression in which `\]`
closed the class early, matched SVG geometry, and reported 24 sites that were
coordinates. It was run against the three known lines, found none of them, and
was discarded. That is the check this repository asks for before a tool is
believed.

### The gate cannot see this class

Every one of the strings above passes the voice gate with no hard failure. So
does his own example:

    $ check.py --line "Held 5.0, opposite installed 0.0, net SQ 5.0. Distorts as Avoidance."
      no hard failures

The gate is not broken. It fails "Welcome to your journey", "plus or minus
12" and the lower address count exactly as it should, checked tonight. And it is right to pass
"2.3 of 10", because `objections.json` rule `count-against-total` exempts a
denominator of 10 on purpose: a scale is not a total. What it has no rule for
is an instrument's variables read aloud as a sentence. Section 5.5 proposes
one.

### The diagnosis, in one line

**The definitions exist, the plain sentences exist, and the tooltip prints the
variables instead.** Three defects, in order of cost:

1. **The schema read aloud.** Variable names and decimals where a sentence
   should be. `COPY.md` already names it: "nine poled axes, held state then
   coherent opposite" is a data model.
2. **A label on a person with nothing attached.** Character layer, most shut
   law, Dissociation: a word with no definition, no behaviour and no way out
   is a judgement.
3. **No door.** Every named thing is a word a person cannot look up from where
   they are standing. One renderer in the product links to the Knowledge base.

---

# 4. What the best rated comparable products do

Twelve sources. Each names the product, the move, and what it means here.

## 4.1 Name the state in words before the number, and compare a person to themselves

Oura's Readiness score is made of named contributors, and each carries a state
in words beside its number. "Pay attention" on HRV balance means the recent
trend is below the person's own average, a sign the body or mind is under
prolonged stress. Resting heart rate is judged against the person's own normal,
learned over a couple of weeks of their data.
<https://ouraring.com/blog/hrv-balance/>
<https://support.ouraring.com/hc/en-us/articles/360057791533-Readiness-Contributors>
(**page blocked, read through the search summary**)
<https://help.ouraring.com/readiness/resting-heart-rate>

Oura's Resilience has five named levels and each is one sentence. Limited:
"There's a clear gap between the recovery your body is getting and the
recovery it needs to balance your recent levels of physiological stress."
<https://support.ouraring.com/hc/en-us/articles/25358829055251-Resilience>
(**page blocked, read through the search summary**)

**Here.** The state word goes first and the figure second: "Courage, shut",
never "Courage 2.3". And a comparison is against the person's own field, never
against other people: "the third heaviest place in your field". The engine
already ranks every address, so this costs no new field. **Taken: the
structure. Refused: the voice.** Oura's Adequate level reads "You're hanging in
there", which is the register this product rules out.

## 4.2 Say in words that the number is not a grade

WHOOP puts Recovery in three colour bands with one sentence each (green, "well
recovered and primed to perform"; red, "under stress and needs rest") and
states that Recovery is a planning tool, not a pass or fail grade.
<https://www.whoop.com/us/en/thelocker/how-does-whoop-recovery-work-101/>
<https://developer.whoop.com/docs/whoop-101/>

**Here.** V8 already rules that a reading is not a score. The WHOOP move is to
make each band carry a sentence, which `TIERDEF` already does for coherence and
nothing does for a law. "Shut", "working" and "open" are the law thresholds
at `drills.js:216` to `:219`; they need one sentence each.

## 4.3 Put the person between two named poles

16Personalities places each trait on a 0 to 100 line between two opposites,
says a reading of 51 percent tells a person something quite different from 88,
and says the opposite pole still exerts influence on somebody who leans the
other way.
<https://www.16personalities.com/articles/strength-of-individual-traits/amp>
(**page blocked, read through the search summary**)

**Here.** Held and installed are the two ends of one line, and
`ui.js:545` says so once, well: "Held is the state you are carrying. Opposite
is the coherent quality on the far side of it." Every address tooltip should
name both ends in words, as that sentence does, instead of printing two
decimals.

## 4.4 Say what the number measures, and what it does not

The Myers-Briggs Company's Preference Clarity Index states outright that it is
not a measure of skill, strength or how well a preference is developed. It
measures how consistently a person chose.
<https://www.themyersbriggs.com/en-US/Connect-with-us/Blog/2016/March/Clarifying-Clarity>
<https://www.themyersbriggs.com/en-US/Support/MBTI-Facts>

**Here.** "Integrity 1.9 of 10" will be read as a moral mark by anybody who
does not know it is the mean of 21 self reported frequencies. One clause of
what it measures, in the definition slot, is the fix.

## 4.5 Describe a type at a level as behaviour

The Enneagram Institute's Levels of Development describe each type at each
level as what the person does. An average Six "continuously focus[es] on the
threats to their own security"; at unhealthy levels, "swing[s] between
dependence and rebellion". Behaviour, not trait, and the levels give a
direction.
<https://www.enneagraminstitute.com/how-the-enneagram-system-works/>
<https://enneagramexplained.com/enneagram-levels-of-development/>

**Here.** "Distorts as Avoidance" is the behaviour, compressed to one noun.
The address tooltip says it as something a person does: "it shows up as
avoidance". The distortion names are already in `nodes.js` for every address,
so nothing is invented.

## 4.6 Result, meaning, limit, next

23andMe's health reports say the result, what it means, what it does not mean
("This does not mean you will definitely develop the condition. Other factors
may also affect your risk"), and what to do with it. The company reports
comprehension above 90 percent per concept in its own studies, run without a
clinician in the room.
<https://customercare.23andme.com/hc/en-us/articles/115006037188-Navigating-and-Understanding-Health-Predisposition-Reports>
<https://medical.23andme.com/reports/health-predispositions/>

**Here.** The drill's order in section 5.2 is this order. The limit is stated
once, at the end, which is W3 of the voice skill. 23andMe hedges with "may";
this product does not, because every figure it prints is computed from what the
person entered and the sentence can say so.

## 4.7 A physical metaphor carries an abstract number

Garmin's Body Battery explains a 5 to 100 figure computed from heart rate
variability as a battery: sleep charges it, stress and exercise drain it.
<https://www.garmin.com/en-US/blog/fitness/5-reasons-your-body-battery-running-low/>
<https://www.wareable.com/garmin/garmin-body-battery-explained-how-it-works-8734>

**Here.** The house rule is physical metaphors only, and the engine is already
built on one: charge is held, it sits deeper when a law is shut, release
empties an address and the opposite fills it. The tooltip should use those
verbs and never the variable.

## 4.8 A vocabulary for inner states, and a place in the body for each

How We Feel, built with the Yale Center for Emotional Intelligence on Marc
Brackett's Mood Meter, carries a definition for each of 144 emotion words. The
vocabulary is the product.
<https://marcbrackett.com/how-we-feel-app-3/>
<https://apps.apple.com/us/app/how-we-feel/id1562706384>

Nummenmaa and colleagues, PNAS 2014: people asked to locate felt sensation
for thirteen emotions on a body silhouette produced consistent, spatially
distinct maps.
<https://www.pnas.org/doi/abs/10.1073/pnas.1321664111>

**Here.** Every named state gets a definition a person can reach, which
`DESIGN-information.md` rule 1 already asks for. And naming a place in the body
has published ground under it as self report. It is not a measurement, and
the copy never calls it one.

## 4.9 What makes a reading feel true to anybody, and why this one must not

The Barnum effect: people rate vague, two sided, positive statements ("at times
you feel very sure of yourself, while at other times you are not") as accurate
descriptions of themselves. It is the standard explanation for why
horoscope and personality copy feels personal. The Pattern's perceived accuracy
is partly put down to it by reviewers. Co-Star's short, blunt pushes are
widely liked and sometimes read as "bullying".
<https://en.wikipedia.org/wiki/Barnum_effect>
<https://thedecisionlab.com/biases/barnum-effect>
<https://www.auraeastrology.com/blog/the-pattern-app-review-2026-an-astrologers-honest-opinion>
<https://ixd.prattsi.org/2024/09/design-critique-co-star-ios-app/>

**Here, and this is the sharpest finding in the research.** Warmth written as
"at times you may" is the Barnum move, and it would make this instrument feel
more accurate by making it less so. **The defence is W2 of the voice skill:
every reading line names the person's own address, their own answer or their
own sentence.** A line that would read as true for anybody gets cut. That is
also the honest route to "I see you": the product has seen something, and it
says what.

## 4.10 A tooltip is brief, supplementary, and never the only copy

Nielsen Norman Group: tooltip content is supplementary and never essential;
lengthy content is no longer a tip; and an info tip that repeats what is on the
screen wastes the interaction and undermines trust.
<https://www.nngroup.com/articles/tooltip-guidelines/>
<https://www.nngroup.com/articles/info-tips-bad/>

**Here.** Tier one is two sentences. The long answer is the drill. `COPY.md`
already forbids the only copy of a definition living in a tooltip, because a
phone cannot reach one.

## 4.11 Plain words serve the expert more, not less

GOV.UK's content guidance, citing legal plain language research: the more
specialist the reader, the stronger the preference for plain English; 80
percent preferred clear sentences, and 97 percent preferred "among other
things" over "inter alia".
<https://gds.blog.gov.uk/2016/02/23/writing-content-for-everyone/>
<https://design.education.gov.uk/content-design/plain-language>

**Here.** This settles Derek, who wants the diagnostic. Plain words do not
cost him the diagnostic; they cost him the jargon. The arithmetic stays, one
door in, under its own heading, in section 5.2's last slot.

## 4.12 Link once, at the first mention

Wikipedia's Manual of Style: a term is linked once per article, at its first
occurrence, and overlinking "robs the article of clarity". Nielsen Norman
Group's usability participants called text with too many links distracting.
<https://en.wikipedia.org/wiki/Wikipedia:Manual_of_Style/Linking>
<https://en.wikipedia.org/wiki/Overlinking>
<https://www.nngroup.com/articles/concise-scannable-and-objective-how-to-write-for-the-web/>

**Here.** This is the frequency half of the linking rule in section 6.

## Not found, and said rather than filled

A published figure for how often people open an in-app definition. The same
gap `DESIGN-information.md` recorded. Any number here would be invented.

---

# 5. The pitch

## 5.1 What a reading tooltip must carry, and what it must not

**Keep.** The name. The state, in a word the engine already thresholds. The
place in the body, in plain anatomy beside the nerve name. The person's own
instance.

**Cut.** Variable names in sentences: susceptibility, net SQ, pole in, axis,
overshoot. Decimals in sentences. The storage index. The seat's name used as
a title when it is only the ring's colour. The clinical correspondence in
`HCX_LIB` `sub` (schizoid, bipolar, ADHD), which `ui.js:1131` already rules
internal and must stay internal.

**Add, because it is missing.** What the thing is. How it shows up in this
person. What it costs. One way out. The door to its Knowledge base entry.

## 5.2 The template, on the two tier ruling

The owner ruled on 26 September, recorded at the foot of
`DESIGN-tooltip.md`: "A tooltip carries two sentences that set the thing up,
and a button reading something like click for more that goes to its knowledge
base page. Pressing the thing itself opens a summary of how it runs through
this person, on the right, with its own link out to the full page." The
template fills that ruling.

**Tier one. The tooltip.** Five slots, and each slot is one bucket.

    title     the name, and the state word when there is one   Label, Value
    line 1    what it is, where it sits                         Definition
    line 2    how it is in you now, tied to your own data       Reading
    number    at most one figure, in the number slot, with its  Value
              scale, never inside a sentence
    action    Read about <name>                                 the door

**Tier two. The drill.** Fixed headings in a fixed order, so a person learns
the shape once.

    What it is        the definition, from the one table that holds it
    In you            the state, its rank in your own field, the behaviour,
                      and your own sentence when a story put it there
    What it costs     one clause, true to compute()
    What moves it     one step, imperative, and the control that does it
    The numbers       label and figure rows, for Derek, last
    Made of           the rows that already exist
    Read the full entry

That is the `SABDEF` shape, what it is, when it fires, what it says, the
interrupt, generalised to everything the instrument names. It is also the
23andMe order, and the three parts V9 asks of every label.

**Every slot already has a source.** Nothing in the template needs a new
table except where marked.

| Kind | What it is | In you | What it costs | What moves it |
|---|---|---|---|---|
| address | `GLOSS` Address, the nerve in `nodes.js`, the plain place in `CHILD.loc` | held or not, rank in the field, `nodes.js` `d` as behaviour | the patterns it feeds, already in the drill's chips | the protocol button, already built |
| law | `IQ_STEM` | shut, working or open, from `drills.js:216`, and `iqScore` lean | a shut law lets charge sit deeper at its seat, `compute.js:217` | **open**, see question 5 |
| saboteur | `SABDEF.d` | weight, and its addresses | `SABDEF.t` | `SABDEF.i` |
| deep pattern | `HCX_LIB.d` | weight | what it is built from | its heaviest address |
| character layer | **not in `GLOSS`**, drafted in 5.3 | the two `HCX_LIB.d` lines | the line at `drills.js:192` | its heaviest address |
| coherent opposite | **defined nowhere**, drafts in `proto/info/info.html` | installed or not | none | release, then replace |
| band | `TIERDEF.def` | `TIERDEF.energy` | `TIERDEF.soma` | `TIERDEF.toward` |

**Warmth, as operations and not as adjectives.** He asked for "I see you, but
not condescending". Both halves are mechanical.

- **I see you** is W2: the person's own instance. Their address, their
  answer, their sentence. `runAtomDrill` already quotes the exact story
  sentence that put charge at an address, and that quotation is the warmest
  string the product can print, because it is theirs.
- **Not condescending** is everything the tooltip does not do: no praise, no
  reassurance against a fear nobody raised (V12), no "at times you may" (4.9),
  no softening adverb, no explaining what the person plainly knows, and no
  clinical term.
- **The one move that does both** is `SABDEF`'s "what it says" line, the
  pattern's own sentence in the first person. The Judge: "Someone is
  responsible for this." It names the sentence a person says to themselves,
  and it neither flatters nor accuses. Nothing outside the saboteurs has one.
  Question 4 asks whether the laws should.

**Words.** The state words are the ones the engine already thresholds, and
nothing is added:

    held          an address at 4 or over, the line
    nothing held  the empty state, one wording
    installed     the opposite end, at 4 or over "partly installed"
    shut          a law under 4
    working       a law from 4 to under 7
    open          a law at 7 or over
    running       a live pattern
    overshot      a live pattern past the point where it serves

No new ladder for "light" or "heavy". A comparison is a rank inside the
person's own field, which the engine already sorts.

## 5.3 Worked examples

Each gives the old string exactly, the new one, and the reason. Every new line
was run through the voice gate; the results are in 5.4.

### Example 1. The address drill. His "held 5.0 opposite install 0.0".

Derek, address 2, Shame at the root. His third heaviest address.

**Old**, `drills.js:245` to `:255`, as rendered:

    Root
    Shame
    Pudendal Nerve · axis Worth, embodiment
    How it runs through you
    Held 5.4, opposite installed 0.0, net SQ 5.4. Distorts as Self-rejection.
    The opposite
    This sits on the Shame toward Worth axis, at the pudendal plexus. Worth is
    what fills this address once it is emptied.

**New, tier one:**

    Shame
    One of your 112 addresses, at the pudendal nerve in the pelvic floor.
    Shame is held here, and it shows up as self-rejection.
    held  5.4 of 10
    Read about Shame

**New, tier two:**

    Pelvic floor, root
    Shame
    What it is      An address is one place in the body where a pattern sits.
                    This one is the pudendal nerve, in the pelvic floor, and it
                    carries shame.
    In you          Shame is held here, the third heaviest place in your field.
                    It shows up as self-rejection.
    What it costs   It feeds seven saboteurs now running, the heaviest of them
                    Control Freak.
    The other end   The other end of shame is Worth. None of it is installed
                    here yet.
    What moves it   [Run the protocol here]  Four channels, twenty five lines.
    The numbers     Held 5.4   Worth 0.0   Depth 5.4
    Read the full entry

**Why.** The three decimals move to a row block labelled for what they are.
The sentence says where, what, and what it does. "Third heaviest" and "seven
saboteurs" are read off Derek's own field, not a population. "Axis" is gone.
The instruction and its control already exist and are unchanged, including
"Run the protocol here", which `COPY.md` carries as its model instruction.

### Example 2. The most shut law. His "courage most shut law 2.3 of 10".

Tomas. Courage is his lowest law.

**Old**, `rings.js:970`, the Dial callout:

    Courage
    Most shut law. 2.3 of 10

**New callout:**

    Courage
    Your lowest law, shut

**New, tier one:**

    Courage, shut
    One of 21 laws: how often you move toward what you are avoiding. Yours is
    the most shut, so what is held at your solar plexus sits deeper.
    Courage  2.3 of 10
    Read about Courage

**New, tier two**, replacing `runLawDrill`'s `Courage 2.3` header and its
threshold sentence at `drills.js:214` to `:217`:

    Law of integrity, solar plexus
    Courage
    What it is      Courage is how often you move toward what you are avoiding.
                    It is one of the 21 laws of moral integrity, seated at the
                    solar plexus.
    In you          Yours reads shut, the lowest of the laws you answered.
    What it costs   A shut law lets charge sit deeper at its seat. At your solar
                    plexus, 13 addresses are held.
    What moves it   Move toward one thing you have been avoiding, then answer
                    the three Courage questions again.
    The numbers     Courage 2.3 of 10

**Why.** "Move toward what you are avoiding" is `IQ_STEM`, the words Tomas
answered on, so the definition is exactly what was measured and nothing is
invented. The cost is `compute.js:217`: a closed law at a seat lets charge sit
deeper, and the drill's current "pays for it" was reaching for that without
saying it. 13 is Tomas's headless read with his stated laws; the app's figure
may differ by the intake round trip in section 1. **The "What moves it" line is
the one line here I cannot vouch for**: I do not know that re-answering is the
route the engine rewards, and pass 1 comes first. It is question 5.

### Example 3. The character layer. His "Dissociation character".

Tomas. His character layer is Dissociation fused with Dysregulation.

**Old**, `rings.js:966`:

    Dissociation / Dysregulation
    Character layer

**New callout:**

    Dissociation / Dysregulation
    Too close to see

**New, tier one:**

    Dissociation / Dysregulation
    Two patterns fused deep enough to feel like your personality. The outline
    holds with nobody inside it, and the swing overshoots both ends and never
    settles.
    Read about character layers

**New, tier two:**

    What it is      A character layer is the deepest thing the instrument names:
                    two patterns fused together, close enough that you cannot see
                    them as separate from you.
    In you          [candidate A] Yours is Dissociation fused with
                    Dysregulation. The outline holds and there is nobody inside
                    it, and the swing overshoots both ends and never settles at
                    the middle.
                    [candidate B] Yours is Dissociation fused with
                    Dysregulation. You step out of the moment while the shape
                    carries on, and the swing overshoots both ends and never
                    settles.
    What it costs   A character layer costs more than it looks like it should,
                    because you cannot see it as separate from you.
    What moves it   Start underneath it. Open the heaviest address it is built
                    on.

**Why.** Both physical lines are `HCX_LIB`'s own, unchanged, and until now
reached no surface a person sees on the Dial. The cost line is already in the
product at `drills.js:192` and is kept word for word. "Too close to see" is the
same claim as "you cannot see it as separate from you", in three words that fit
a callout. The route is true to the arithmetic: a character layer is built from
addresses, and the drill already lists them.

**Two candidates for one line, and it is not mine to average.** Read as Angela,
candidate A lands; it is the codex's own image. Read as James, level 3 and
defended, "there is nobody inside it" says he is empty, and he will feel
accused rather than described. Candidate B names the behaviour instead of the
absence. The voice skill's order is that pass 9, James, beats pass 7, Angela,
so B is the rule's answer. It is his image being moved, though, so it goes to
him as two lines. Question 6.

### Example 4. The Field hover. The most read tooltip in the product.

**Old**, `ui.js:37` to `:42`, address 001 as `DESIGN-tooltip.md` captured it:

    001 Fear
    Root seat, Lumbar Plexus
    axis Fear
    susceptibility 1.00
    held 0.3, opposite 8.8
    SQ 0.0
    Drag to change, click for detail.

**New**, held and clear:

    Fear                                  root, lower back
    Where fear sits, at the lumbar plexus in the lower back and gut. Yours is
    held here, and it shows up as avoidance.
    Click to open it. Drag to change it.

    Fear                                  root, lower back
    Where fear sits, at the lumbar plexus in the lower back and gut. Nothing is
    held here, and Trust is installed instead.
    Click to open it. Drag to change it.

**Why.** Six readouts become two sentences. Susceptibility, the axis and SQ
move to the drill's numbers block, where Derek finds them. The storage index
goes, as it already went from the drill. On a phone the second instruction
drops, because a touch does not drag, which `ui.js:131` already handles.

### Example 5. The ring's own title.

**Old**, `component.js:173`, on the rail's stack at `ui.js:553` and `:555`:

    Root · 9.4          on the Fear ring
    Heart · 0.0         on the Trust ring

**New:**

    Fear, held
    Trust, not installed yet

**Why.** The ring names its colour instead of its subject. `cr()` does the same on every
call site, which `DESIGN-tooltip.md` counted at 36 and names as the highest
value line in its migration. The fix belongs there, as the words that
line emits.

### Example 6. The law drill's threshold sentence.

**Old**, `drills.js:216`:

    This law is shut. Under 4 it is not resisting, it is closed, and everything
    seated at the solar pays for it.

**New:**

    This law is shut. A shut law lets charge sink deeper at its seat, and this
    one is seated at the solar plexus.

**Why.** The threshold number leaves the sentence. The antithesis goes. The
cost gets its mechanism. My first draft read "sits deeper, so everything held
at the solar plexus sits deeper too", which says the same thing twice; out
loud it was obvious, and it was cut on pass 10.

### Example 7. The pole drill. A truth fix before a copy fix.

**Old**, `drills.js:386`:

    ...and the pole is how much of that opposite is installed, 0 to 1 averaged
    across the nine.

**New:**

    The pole is how much of each opposite is installed, 0 to 10, averaged
    across the addresses in the body.

**Why.** The old sentence is wrong on both counts. `compute.js:225` scores each
address from 0 to 10 and `:303` averages across every body address. The rail
at `ui.js:1114` prints it "of 10", which is right, so the drill and the rail
currently disagree about the same number.

### Example 8. The running card.

**Old**, `ui.js:1129`: `Saboteur, collapsed`
**New:** `Saboteur, running`

**Why.** "Collapsed" is the name of the lowest coherence band. The UX skill's
canonical word for a live saboteur is "running", and "overshot" stays for the
other case.

## 5.4 Voice gate results

`proto/tipcopy/gate.sh`, every line in `proto/tipcopy/lines.txt`:

    31 lines   31 pass   0 fail

Before trusting that, the gate was run on four known bad lines and failed the
three it should: a preamble with soft language and an em dash (6 hard
failures), a tolerance on a figure, and the lower address count the codex uses. The fourth, an empty state
phrasing, is caught by the source sweep and not by a single line, which is how
it is built.

**What the gate cannot check, and so what I did by hand**, which is the block
the gate prints at the end of every run:

1. **Is it true.** Each figure was read off a loaded reference profile. The
   one line not verified against the engine is marked in Example 2.
2. **One bucket.** Each slot of the template is one bucket by construction.
   The one string I would split if space allowed is the Dial callout "Your
   lowest law, shut", which is a Reading in a Label's slot; it is kept because
   a callout has two lines and no third.
3. **Angela, Derek, James.** James changed Example 3 into two candidates.
   Derek is served by the numbers block, and 4.11 is the evidence that plain
   words do not cost him anything. Angela reads every line with her own place
   in the body in it.
4. **Out loud.** Example 6 changed on this pass.

## 5.5 The gate has no rule for this, and one is proposed

A candidate rule, written to `proto/tipcopy/rule.py` and **not installed** in
`objections.json`, because that database is his log and a gate, and gates are
out of scope tonight. Three patterns: two instrument readouts chained in one
clause; a label, a full stop and a bare figure; a name, a full stop and a
variable.

    objected lines caught        7 of 7
    good lines wrongly flagged   0 of 41

The objected set is his three strings plus four from section 3. The good set
is every rewrite above plus six shipping sentences that carry a figure
correctly, including V8's own model "at a weight of 7.4" and the threshold
"4 of 10 counts as loaded" that `count-against-total` protects. It reads a
rendered line. Reading template source, where the figure is an expression and
not a digit, needs the treatment the naked number rule already has. If he
wants it, it enters the database as a new objection carrying his FV words
verbatim.

---

# 6. The Knowledge base link rule

His words: "I think in the tooltips for the overlays we know we need to link
off to the knowledge base, and I think that any text, this is for the story
team, I think that all text that relates to the content needs to have a
hyperlink also to the knowledge base, so information just always links back to
the knowledge base."

## 6.1 What exists

- **A working link.** `.kbjump` with `data-kbs` for the section and `data-kbt`
  for the entry, handled at `ui.js:722` to `:746`: it switches to Knowledge
  and opens that entry's drill through `kbOpen`, `knowledge.js:441`.
- **One renderer uses it.** `prow`, `ui.js:1032`, the right rail's archetype
  and domain rows, with the action line "Press to read it."
- **The glossary has no address.** `GLOSS` left the deck strip on purpose,
  `knowledge.js:226`, and is reached only by typing in search.
- **The mark and the resolver are designed.** `DESIGN-information.md`: one
  dotted rule under a glossed name, `data-gloss`, and `glossOf` resolving any
  name through the engine's tables. Its step 8 measured the phone collision: on
  one tap the navigation won in 120 milliseconds and the definition was
  destroyed, so on a coarse pointer the first tap explains and the tip's action
  line navigates.

So his instruction is not a new mechanism. It is `.kbjump` generalised, on the
mark `DESIGN-information.md` already chose, with a rule for which words carry
it.

## 6.2 The rule, in five lines

    1  Content bearing means the string names a thing the Knowledge base
       has an entry for. The resolver decides, not the writer.
    2  Each such name links to its own entry, opened on that entry,
       never to the top of the Knowledge tab.
    3  Once per block: the first mention in a tooltip, a drill, a card or a
       paragraph. A block never links its own subject; it ends with
       Read the full entry instead.
    4  Every tooltip whose title is a named thing carries the action line
       Read about <name>. A tooltip on a control carries none.
    5  One mark and one gesture everywhere: the dotted rule. On a desktop
       hover opens tier one and a click follows the link. On a phone the
       first tap opens tier one and its action line follows the link.

**Never linked.** The person's own words, quoted from a story, because a link
inside their sentence is the product writing on it. Figures. Instructions.
Refusals and empty states. Menus and labels. Settings, billing and account
copy. A name inside the Knowledge entry for that same name.

## 6.3 What counts, by kind, and where it goes

| Kind | Example | Knowledge section | Entry exists |
|---|---|---|---|
| address | Shame, Possession | Fetters, `addr` | yes |
| child emotion | Fear | Child emotions, `fetter` | yes |
| coherent opposite | Trust, Worth | Child emotions, via its emotion | **no definition**, seven of nine |
| saboteur | Pleaser | Saboteurs, `sab` | yes |
| complex, deep pattern, character layer | Dissociation | none | **no row** |
| law | Courage | Moral integrity, `law` | row, **no definition** |
| mask, domain, archetype, gate | Magician | their own sections | yes |
| seat | Solar | The stack, `seat` | yes |
| universal law | Rhythm | Universal laws, `harm` | yes |
| glossary term | CQ, SQ, Charge, Release | search only | yes, **no address** |
| coherence band | Oscillating | none | **no row** |

## 6.4 What the rule exposes, which is the real work

A link to a page that does not exist is a broken promise, so the rule cannot
ship ahead of its pages. Five gaps, each measured:

1. **The 21 laws have rows and no definition.** `IQ_STEM` is the definition,
   question 3.
2. **Seven coherent opposites are defined nowhere.** Trust, Worth, Acceptance,
   Vitality, Groundedness, Joy, Readiness. `DESIGN-information.md` drafted all
   seven and its question 1 is still open.
3. **Complexes, deep patterns and character layers have no Knowledge row**,
   and "Character layer" has no `GLOSS` entry. `DESIGN-information.md`
   question 2 asks whether the deep patterns are names a person should meet at
   all.
4. **The coherence bands have no Knowledge row**, though `TIERDEF` holds
   everything one needs.
5. **The glossary has no entry address.** One line fixes it: a `gloss`
   section key the jump can name, while the deck strip still leaves it out.

## 6.5 What it costs

Every link is an interaction cost and a visual one (4.12). Once per block keeps
the density at one or two marks a paragraph on the drills sampled here. The
gate that enforces it is `DESIGN-information.md` step 7, gate 16, extended by
one clause: a resolvable name at its first mention in a block carries the mark,
and failures are reported by name.

---

# 7. Found in passing, for the backlog, not dispatched

1. **`drills.js:386` states the pole's scale wrongly**: "0 to 1 averaged
   across the nine", where the engine is 0 to 10 across the body. Example 7.
2. **Every ring's native title names its colour's seat**, so the Trust ring
   says "Heart". `component.js:173`. Example 5.
3. **"collapsed" labels every running pattern that is not overshot** and is
   also the lowest band. `ui.js:1129`. Example 8.
4. **`GLOSS` Hyper-complex says "One of 8 named clusters"**; `HCX_LIB` carries
   six, twelve with their overshoot poles in `core.js:15`.
5. **Eleven `GLOSS` entries carry a typewriter double hyphen** standing in for
   a dash: Address, Ascension, Replacement state, Drag, Hyper-complex,
   Justification mechanic, Limiting belief, Mask, Pure perception, Resistance,
   Two mechanics. The build's em dash check does not catch it.
6. **V8 in the voice skill lists "7.4 of 10" as a failure**, while
   `objections.json` `count-against-total` exempts a denominator of 10 as a
   scale. One of the two documents should move.
7. **The Field hover still prints the storage index "001"**, which
   `drills.js:243` removed from the drill as "a storage key".

---

# 8. His, and open

1. **The template.** Two tiers, five slots in the tooltip, seven headings in
   the drill, in the order of 5.2. Approve, reorder, or cut a slot. Cutting
   "What it costs" shortens every drill by a line and loses the part 23andMe and
   WHOOP both lead with after the result.
2. **Numbers in the tooltip.** (a) The state word only, figure one door in:
   the plainest, and Derek has one more press to reach his figure. (b) The word
   and one figure in the number slot, as the examples show: what
   `DESIGN-tooltip.md` specified. (c) As today. Each example above is written
   to (b).
3. **The laws' definitions.** `IQ_STEM` is a phrase per law, written by a seat
   and flagged in its own file as "mine rather than his, so they are the first
   thing to overrule". Make them canon, correct them, or give the book's
   wording.
4. **A voice line for the laws.** The saboteurs carry "what it says", the
   pattern's own sentence. Should a shut law carry one too, such as Courage:
   "I will do it when it is less frightening"? That is new canon, so it is
   asked, not drafted into the product.
5. **What moves a shut law.** Example 2's instruction assumes re-answering the
   three questions after changing what you do. If the engine also moves a law
   from stories, the instruction should say so instead. Engine seat or his.
6. **Dissociation, candidate A or B.** A keeps the codex's image, "the outline
   holds and there is nobody inside it". B names the behaviour, "you step out
   of the moment while the shape carries on", and lands without accusing a
   defended reader.
7. **"Character layer".** A name that needs a gloss is not a name. Keep it and
   give it a `GLOSS` entry (drafted in Example 3), or rename it. It is printed
   by five lines of source across `ui/` and `engine/` and is the rail's tab label
   "Character", so a rename is small.
8. **The link gesture on a desktop.** Click on the word goes straight to the
   Knowledge entry, as 6.2 line 5 proposes, or always through the tooltip's
   action line, which makes a desktop behave like a phone.
9. **The rule for his objection.** Enter 5.5 into the objections database as
   a new objection, with his FV words verbatim.

---

# 9. The files

    DESIGN-tooltip-copy.md        this file
    proto/tipcopy/figscan.py      the scope scan, section 3
    proto/tipcopy/probe.js        the reference profiles, headless
    proto/tipcopy/own.js          which patterns an address feeds, Example 1
    proto/tipcopy/lines.txt       every proposed line
    proto/tipcopy/gate.sh         every proposed line through the voice gate
    proto/tipcopy/rule.py         the candidate rule, with its own check

To re-run, from the repo root, after `./atuned_src/BUILD-engine.sh`:

    python3 proto/tipcopy/figscan.py
    node proto/tipcopy/probe.js Tomas,Derek,James,Angela,Gordon
    node proto/tipcopy/own.js
    ./proto/tipcopy/gate.sh
    python3 proto/tipcopy/rule.py
