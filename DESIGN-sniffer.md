# THE SNIFFER

What it is looking for, what it is allowed to claim, and what it cannot read.

Written because the owner asked a question this repository had no answer to:
does the sniffer know what it is supposed to be sniffing, has it got the
information, has it got the logic supplied by The Mechanics of Being. The
answer, measured rather than argued, was no, and in a specific way that no
amount of adding words would have fixed. Every number below was measured on
this build with the probes in `proto/sniffer/`, each checked against a known
good case first.

## THE THIRTEEN QUESTIONS

His logic and his book, so a guess costs more here than anywhere else in the
product. Each of these is answerable in a sentence, each is ordered by how much
the answer changes, and each carries the measurement that makes it worth
asking. Nothing below this section is built on an assumed answer: where an
answer is needed the code reports the gap by name rather than defaulting it.

### The two that change what gets built

**1. When a person writes in the journal, are they reporting an event or
stating a stance?**

Measured. The fourteen persona voices the product ships are all stance: "Rest
feels like a moral failure." "There is nothing wrong with me." "Pain is
information." Thirteen of the fourteen returned zero imprints before this pass
and twelve do after it, and the two that read at all read only because one
contains the idiom "feel nothing" and the other contains the word "funerals".
Across the book, 856 of 9,431 sentences produce any hit at all, so 91 percent
of the owner's own prose reads as nothing. A vocabulary cannot reach a stance,
because a stance carries no feeling word. If the journal receives stance, the
frame layer is the product and the lexicon is a side show. If it receives
events, a father dying and a partner lying, the lexicon is the product. Today
the instrument is built for events and every held example is a stance.

**2. Is the lexicon derived from the book, or is it a separate instrument
vocabulary with its own justification?**

Measured. 87 of the 192 authored words appear anywhere in the book and 105 do
not. 8 of the 124 idiom phrases appear. Both answers are defensible and they
are different products. Derived means every entry cites a passage, the table
gets smaller and more defensible, and the answer to "why this word" is "because
he wrote it". Separate means the table is a clinical instrument that the book
informs, and it then needs its own justification, which it does not currently
have. The machinery is built so either answer is implementable without a
rewrite: every entry now records its source, and `cite` is the field that holds
a passage when there is one to hold.

### The three that change every reading the product has ever produced

**3. Does the instrument read negation, and if it does, does "not angry" mean
no anger or anger named and denied?**

Measured. "I was angry" and "I was not angry" produce the identical reading,
`{solar:18}`. Worse, "I am not afraid but I could be afraid" reads as
`{root:32}`, double the charge of "I am afraid" at `{root:16}`, so a denial
currently raises the reading. The English answer is obvious. The somatic answer
may well be that a person who volunteers "I am not angry" has named anger, and
that is a ruling about the psyche rather than about grammar, which is why it is
a question and not a fix.

**4. Is the charge the same when a person did it as when it was done to them?**

Measured. "I shouted at him" and "he shouted at me" produce the identical
reading, `{solar:24}`. The 112 addresses already say no: 68 Interrupting is the
doing and 65 Self-Silencing is the being done to, and they are different
addresses in different bands. So the canon distinguishes and the sniffer
cannot.

**5. Is a charge a person has released still a charge?**

Measured. "I panic every day" and "I used to panic and I do not any more"
produce the identical reading, `{root:28}`. The whole loop of this product is
release, so a person writing about what they have released is charged by their
own account of the release. That is the loop working against itself.

### The four that are contradictions inside the canon, not defects in the code

**6. Where a charge sits has two answers in this repository and they disagree.
Which is authoritative?**

Measured. `CHG2SEAT` says Shame is sacral; the 112 addresses make Shame modal
at the throat, 3 addresses to 1. `CHG2SEAT` says Apathy is throat; the
addresses make it modal at the sacral, 8 to 0, and the throat carries no Apathy
address at all. Surprise has 3 addresses across 3 bands and Anticipation has 5
across 5, so neither has a modal band. The canon pass refuses to pick and
reports the word by name instead, because a pass that chose one of two
disagreeing answers would be laundering a ruling nobody has made.

**7. Three of the nine axes have no vocabulary at all, and one of them does not
appear in the book. Is Surprise an axis the canon argues?**

Measured. Disgust, Shock and Surprise have zero authored words in the lexicon
that route to them. The word "surprise" appears 0 times in 117,716 words of the
book; "disgust" appears 27 times and "shock" 26. So Surprise is scored on every
reading, drives 2 of the 33 saboteurs, and is argued nowhere. Either it is
argued or it is inherited from an emotion wheel and should be named as such.

**8. What does the number 24 mean?**

Measured. The table holds 181 charged amounts spanning 12 to 28 with a median
of 24, and no stated rule for what any of them is. Without a scale every one of
them is a magic number and the table cannot be audited by anybody, including
him. One sentence fixes it: name what the top of the range is, in terms of what
a person would do or say at it, and the other 180 become checkable.

**9. When a longer specific entry contains a shorter idiom, which wins?**

Measured. "I cannot stop thinking about it" reads as compulsion at the sacral,
amount 18, because the idiom "cannot stop" outranks the longer lexicon entry
"cannot stop thinking", which is seated at the third eye at 24 and labelled
rumination. A person ruminating is told they are compulsive, at the wrong seat,
for less. The stated rule is that a phrase outranks the words inside it, which
is right and does not reach this case, because here the entry contains the
phrase. It is one clause in `scanStory` and which way it goes is a ruling, so
the two unreachable rows are named in `LEX_DEAD` with the reason and the gate
holds the count at two.

### The four about what the product is allowed to say

**10. What does a reading show a person whose entry produced nothing?**

Measured. 8,575 of 9,431 book sentences produce no hit. Today that is an empty
reading, which reads to a person as "you are clear" when what happened is that
the instrument did not understand them. Silence, a question back, or a stated
"this did not resolve" are three different products.

**11. Should a reading show a person which of their own words it read?**

Measured. It cannot at present. A hit carries an offset into a normalised
string, lowercased and stripped of punctuation, so the offset does not address
the text the person typed. For "I was FURIOUS, and then, numb." the hit for
numb lands at offset 23, where the original holds ", numb". Explainability is a
product feature here rather than a compliance one, and if the answer is yes
then the offset has to address the original, which is a change to `scanStory`.

**12. May Source AI see a person's own previous entries in order to read the
current one?**

The privacy rulings are structural and were checked before anything else in
this pass: the name never leaves the device, a key replaces it, and the record
is never held joined to the story. Reading one entry against that person's own
earlier entries, on their own device, is a different grant from a corpus
leaving it, and it is the grant that would buy the most. It needs ruling before
Source AI is designed rather than after.

**13. `inferred:false` says the person named the axis. May the product then
print the address names it chose?**

This is the most consequential of the thirteen and it is the one I would ask
first if only one could be answered. Measured, and unchanged by this pass: "I
was furious" returns four imprints named Pride, Arrogance, Competition and
Anger, all with `inferred:false`. The flag is telling the truth about what it
was built to guard: the word furious does name the Anger axis. But no word ever
names an ADDRESS, and the four addresses are the first four Anger addresses in
the solar band by susceptibility order. So a person who wrote "I was furious" is
carrying Pride and Arrogance according to the instrument, and the flag that
exists to stop exactly that is reporting green.

The fix is not a tuning. Either the flag splits in two, one for the axis and one
for the address, or a reading never prints an address name at all and shows the
band and the axis instead. The second is a smaller product and an honest one.
Both are his call because both change what a person is told about themselves.

## WHAT THE SYSTEM IS LOOKING FOR

This had never been written down, which is the substance of his question. Four
stages, and the point of naming them is that each one is allowed to claim less
than the next.

    a sentence
      -> NORMALISE   lowercase, strip to letters, spaces and apostrophes
      -> SCAN        surface forms matched against three tables -> hits
      -> PARSE       hits -> band sums, charge counts, a path, imprints
      -> APPLY       imprints -> charge on the nine axes

**Normalise** claims nothing. It is inside `scanStory`. It loses case,
punctuation, sentence boundaries and the ability to address the original text,
and every one of those losses costs something later.

**Scan** claims that this exact string occurred at this offset and that a table
seats it. It claims nothing about the person. Three tables in a stated
precedence: idiom phrases first, then multi word lexicon entries, then single
words, longest first, and a phrase outranks the words inside it.

**Parse** is where a claim about a person first appears, and it is the stage
that has to be read carefully. It produces:

- `bands`, a sum per body region. This is well founded: the table genuinely
  says where, and nothing was inferred to get there.
- `charges`, a count per named charge, from the words that name one.
- `imprints`, each naming an address out of the 112. This is the load bearing
  claim and it carries `inferred`. `inferred:false` means the person's own word
  named the axis. `inferred:true` means the seat was read and the address was
  chosen by a fallback, and a renderer must never print that name as a finding.
  The product has already shipped the version that did: a bereavement came back
  as Martyrdom, and being cheated came back as Lying.
- `path`, the route through the body. A record, not an input. No number moves
  because of it, deliberately, because the claim it encodes is not measured.

**Apply** is the only function that mutates. It scales by 0.35 and clamps to 0
through 10.

### What a hit is, and what an imprint is

A hit is evidence that a word was written. An imprint is a claim that charge of
a size sits at an address. The difference is the whole safety property of this
instrument, and the ladder is:

| Stage | Claims | Is it a finding |
| --- | --- | --- |
| hit | this string occurred here | no |
| band sum | charge is held in this region | a reading |
| named fetter | the person named this axis | a reading, sourced |
| inferred imprint | the region is read, the address is a placement | never |
| anything about a saboteur, an architecture or a diagnosis | nothing here asserts this | never |

Never a diagnosis and never a verdict. A hit is evidence, not a finding.

## WHAT THIS PASS BUILT, AND WHAT IT MEASURED

Three things were true before this pass and are the reason it exists.

**The scoring layer and the reading layer did not share a vocabulary.** 1 of
the 9 axes the instrument scores resolved in the lexicon. Only "sad". Fear,
anger, shame, disgust, apathy, shock, surprise and anticipation were not words
the scanner could find. 0 of the 7 cue words the 33 saboteurs are defined by
resolved. So a person could write "I am full of anger" and the instrument that
scores an Anger axis, and defines eleven of its saboteurs by an anger range,
read nothing.

**No entry knew where it came from.** 192 authored words with no recorded
source, so the owner's question could not be answered from the repository.

**Two entries could not be found at all** and nothing would ever have said so.

### The floor, built

**Pass one, the canon.** Ten words derived, nothing authored. Every seat comes
from `CHG2SEAT` and every fetter from `CHG2FET`, which are the app's own
existing answers and already have an owner. The amount is derived by a stated
rule: a bare axis noun is the least specific evidence in its family, so it
takes that family's floor, never its median and never its top. "I was furious"
is a stronger report than "I have anger" and the table already prices that, 16
for defensive up to 24 for furious. Three axes have no family and take the
lowest charged amount anywhere in the table. Both are read off the table at
load, so retuning a neighbour retunes this, and the gate asserts the rule
rather than the number.

**Pass two, the fold.** Of the ordinary inflections of words already in the
table, 31 are confirmed by a corpus this repository holds and 0 of those 31
resolved, so the table was written in one form and people write in another. A
separate pass this session reported 29 of 63 by a different construction and I
did not reproduce that figure, so the number above is mine and the method is
stated. The obvious fix is a stemmer. It was prototyped and
it is the wrong instrument here, and the numbers are the argument. Fourteen
rules over the 145 single word keys generate 438 forms. 31 are confirmed by a
corpus this repository actually holds. Seven percent. The other 407 are strings
like "ashams" and "anxiousing": harmless, because they never occur, and
corrosive, because a lexicon nobody can read is a lexicon nobody can audit, and
this product shows a person why.

Worse, three of the 31 confirmed forms are real words meaning something else,
and two of those fold off coherent keys, which subtract. A stemmer would have
had the word "contents" quietly lowering somebody's reading. A false positive
in a somatic reading costs more than a miss, so the refusals are by name with
the reason, in `LEX_FOLD_NO`, and 27 forms are admitted.

The rules stay in the engine because they are pure and tiny and the gate uses
them to prove every admitted form is reachable from a real key. The corpus
stays out, because the engine may not read a file. What crosses the boundary is
the confirmed list, and `proto/sniffer/` holds the tool that produced it.

### Before and after, the same corpora both sides

|  | before | after | of |
| --- | --- | --- | --- |
| axis names that resolve | 1 | 9 | 9 |
| saboteur cue words that resolve | 0 | 7 | 7 |
| lexicon entries | 192 | 229 | |
| charge name entries | 66 | 84 | |
| persona voices with an imprint | 1 | 2 | 14 |
| persona voices with a route through the body | 0 | 0 | 14 |
| book sentences with at least one hit | 609 | 856 | 9,431 |
| hits over those sentences | 989 | 1,729 | |

And the check that matters more than any of them. Over the same 9,431 book
sentences: 296 readings changed, 0 sentences lost a seat, and 0 band totals
went down. A vocabulary change that lowered an existing reading would be a
regression the product could not see, so it is measured rather than assumed.

### What the numbers say, plainly

The canon pass is a real fix: 1 of 9 to 9 of 9, and it closes the gap between
what the instrument scores and what it can read.

The fold is not the cheap win it was reported to be. It moves the persona set
from 1 of 14 to 2 of 14, and the one it buys is Angela, whose line contains
"funerals" where the table held "funeral". Restricted to forms a corpus
confirms, it is worth 27 entries and one voice. The unrestricted stemmer that
measured better would have shipped two false positives on coherent words.

And the honest headline: after both passes, 856 of 9,431 sentences of the
owner's own prose produce any hit at all. Nine percent. That is not a
vocabulary problem any more and it was never going to be solved by one. It is
question 1, and it is why the frame layer is specified below rather than built.

## THE FRAME LAYER, SPECIFIED AND NOT BUILT

Deliberately not attempted in this pass. Specified so the next one starts from
a shape rather than from a guess, and so nobody builds it before question 1 is
answered.

A frame is a sentence pattern that carries charge without carrying a feeling
word. "Rest feels like a moral failure" is a rule about the self. "There is
nothing wrong with me" is a denial. "Pain is information" is an
intellectualisation. None contains a word the lexicon could ever hold, and all
three are exactly what a person types.

The shape, and the reason it is this shape: `verp.js` already carries a frame
layer for the lean instrument, `LEANFRAME`, with a negation guard and a
per frame weight. That is the precedent and it is in this repository, so the
sniffer's frame layer is a port of a pattern that already has a gate rather
than a new idea.

What it needs before it can be built:

1. The answer to question 1, because a frame layer built for stance and a
   lexicon built for events are two instruments and only one of them is worth
   the work.
2. A negation ruling, question 3, because half of the frames are denials and
   the reading depends entirely on whether a denial is a zero or a naming.
3. A held set to measure against that is not the 14 persona voices. Fourteen is
   too few to move a percentage and they were written to illustrate
   architectures rather than to exercise a reader. Roughly 60 lines would make
   a single voice worth 1.7 points instead of 7.1.
4. Precision before recall. A frame asserts more from less text than a word
   does, so a wrong frame is a worse error than a wrong word, and the threshold
   has to follow from that rather than from a balanced score.

## WHAT CANNOT BE LEARNED FROM THIS DATA

Checked first rather than last, because it is the constraint that decides what
is worth designing.

The privacy rulings are structural: the name never leaves the device, a key
replaces it, and the record is never held joined to the story. So the story
without the record is what refines any model. That rules out, permanently and
not as a matter of engineering effort:

- Anything that needs a person's identity or their record beside their story.
- Any supervised model of "which saboteur does this person have", because the
  label would have to come from the record.
- Any calibration of the 0 to 10 charge against an outcome, because the outcome
  lives with the record.

What is learnable from stories alone: which words and frames occur, how often,
in what company, and which of them the instrument currently reads as nothing.
That last one is the whole of the near term work and it needs no model. A count
of unresolved words across real entries, with no identity attached, would size
the vocabulary gap in a week and is the single highest value thing the record
store could produce.

And one thing that is not learnable from any amount of data: whether a reading
is right. There is no ground truth here and there is not going to be one. That
is not a gap to be closed, it is the nature of the instrument, and it is why
every claim has to be sourced to the person's own words rather than validated
against an outcome. `inferred` is that discipline expressed as a field.

## FILES

    atuned_src/engine/lexicon.js    the vocabulary, its schema, its validator,
                                    the fold rules, the allow list, the refuse
                                    list and the named dead rows
    atuned_src/engine/sniff.js      the two derivation passes, then the scanner
    tests/engine.js group 32        the gate
    proto/sniffer/measure.js        the baseline probe
    proto/sniffer/fold.js           the fold generator and what each rule costs
    proto/sniffer/plan.js           what each candidate addition buys
    proto/sniffer/before-after.js   the comparison and the leakage check
    TDD-sniffer.md                  the engineering contract

# THE AUTHORITATIVE SPEC · THREE PASSES, THE SCHEMA, AND WHAT IT COSTS

`SNIFFER_SPEC.md` landed as canon rather than as a proposal. The owner's
instruction was to review it three times, analyse the content, the structure,
the flow and the frameworks, design the schema, update the algorithm, and
integrate it. This section is that work. The spec wins wherever it and the
engine disagree, so the column that matters in every table below is not who is
right, it is what the difference costs.

Every number here was measured on this build with the probes in
`proto/sniffer/`. Each probe checks itself against a known good case in both
directions and refuses to run if either fails, because a tool that lies is worse
than no tool. The three headline contradictions were re-measured from scratch
rather than inherited, and one of them did not survive contact.

## FIRST, THE FOUR FILES THE SPEC SAYS TO LOAD ARE NOT HERE

Section 13 names four files and says to load them rather than retype them. None
of the four is in this repository.

| File | What the spec says it gives | State |
|---|---|---|
| `reviews/elements.json` | 76 elements with `sh` and `co` strings, **"the lexicon"** | missing |
| `ENGINE.json` | saboteurs with bands, axes with addresses, archetypes, formulas | missing |
| `reviews/canon.json` | every ruling with dates and provenance | missing |
| `handoff/ATUNED_SPEC.json` | the app facing ruled subset | missing |

`manuscript_notes/2026-09-20_benign_malignant_routing.md`, cited in section 12,
is not here either.

**What is lost, plainly.** The spec calls `elements.json` the lexicon and the
sniffer's job includes detecting violations across 76 elements. Without it there
are no shadow and coherent strings for the 13 laws of nature or the 15 of human
nature, which is 28 of the 76 slots, and only five of the ten expression
shadows are recoverable because section 7 happens to print those five in prose.
`ENGINE.json` would have made the band port a load rather than a transcription,
and the transcription is now the thing that could carry a typo. It is
transcribed twice in this repository for that reason, in
`atuned_src/engine/data/canon.js` and `proto/sniffer/bands.js`, and the gate
asserts the two agree row for row.

**So the law layer that ships is a floor and it is labelled one.** `lawCoverage()`
reports what is reached and what is not, and `sniffStory().flow` returns nature
and human nature as `unread` with the reason attached rather than as empty,
because an empty array with no explanation reads as nothing violated.

## PASS ONE · CONTENT

Run it: `node proto/sniffer/pass1.js`. 38 checkable claims, mechanically
compared against the engine and against `engine/data`. **12 agree, 3 partial,
23 differ.** The full run prints the cost line under every difference; the ones
that change a reading are below.

| § | Claim | What the code does | | Cost |
|---|---|---|---|---|
| 2 | nine axis names | 9, identical | agree | none |
| 2 | **the coherent pole per axis** | 5 of 9 compatible | **differ** | see the collision below |
| 2 | **the somatic address per axis** | 8 of 9 share a term | **differ** | Surprise: spec lower solar plexus bilateral at lung edges, `CHILD` upper chest and back, seat Heart |
| 2 | two readings per axis | `S.charge` and `S.replace` are separate | agree | none |
| 2 | Surprise scores no saboteur | 0 of 33 rows, both tables | agree | none |
| 3 | the 33 names | identical | agree | none |
| 3 | the firing bands | **33 of 33 identical after the port** | agree | it was 16 of 33 before |
| 3 | every band term is an axis | all nine now | agree | it was 31 of 33 before |
| 3 | band edges are ramps | `sabMember` is continuous, `core.js` still steps | partial | the legacy caller has not moved |
| 3 | Resentment is a composite | fixed in this pass, legacy path unmoved | partial | see the algorithm |
| 5 | six hyper-complex modes | identical | agree | none |
| 5 | clinical labels are translation only | `sub` is internal, never printed as a condition | agree | none |
| 6 | **the 21 law names** | 19 of 21 shared | **differ** | spec has Ownership and Wisdom; engine has Responsibility and Accountability |
| 6 | **CQ is the mean of the 21 times 10** | `(It*Ig)/Rz` | **differ** | the largest thing in the document, priced below |
| 6 | **the four bidirectional laws** | no direction exists anywhere in `engine/` | **differ** | fixed in this pass for the sniffer, absent from `S.law` |
| 6 | **E43 Wisdom is live** | no law named Wisdom exists | **differ** | and section 7 says E43 is retired, so the document disagrees with itself |
| 7 | **the ten expression elements** | 6 of 10 shared | **differ** | spec has Curiosity, Creativity, Flow, Love; `EXPR` has Beauty, Voice, Devotion, Presence |
| 7 | **the five high value expression shadows** | **0 of 5 match** | **differ** | Flow and Curiosity have no slot; Play, Purpose and Will have a different shadow word |
| 7 | the 13 nature and 15 human nature laws | absent | differ | 28 of 76 slots, needs `elements.json` |
| 8 | **two upstream feeding one sump** | six gates as flat peers in `VERPMIX` | **differ** | his 14.5 to 43.2 to 71.9 cascade cannot be reproduced there |
| 8 | radiance is the vector magnitude | `compute.js:192` | agree | none |
| 8 | **Resistance never divides CQ** | `Rz` divides CQ at `compute.js:140` | **differ** | guard 7 violated by the shipped formula |
| 9 | the nine circles as a depth scale | no circle table existed | differ | built thinly in this pass, four circles unkeyable |
| 9 | no seven deadly sins framework | none present | agree | none, and none added |
| 11 | never score another person | no subject model at all | partial | satisfied by absence of a mechanism, not by a rule |
| 11 | **always emit `because`** | no citation of any kind was emitted | **differ** | fixed in this pass |

### The pole collision, which is new and is his to settle

Four of the nine coherent poles differ, and two of them **trade one word
between two addresses**.

| Axis | Spec section 2 | `CHILD.opp` |
|---|---|---|
| Fear | Safety / Ground | Trust |
| Anger | Calm / Integrated Power | Equanimity |
| **Apathy** | **Joy** / Aliveness | Vitality |
| **Sad** | Happy / Restoration | **Joy** |

The spec offers Joy at Apathy. The engine offers Joy at Sad. A person could be
offered Joy for their apathy on the sniffer's output and Joy for their sadness
on every other surface in the product, which is one word naming two different
places in a body.

**This pass did not settle it.** `sniffOffer` emits the spec's table, because the
spec rules the contract, and every offer carries `poleDiffers` naming both
answers so a renderer can decline to print a replacement the rest of the product
contradicts. `CHILD.opp` is read by the wheel, the summary, the drills and the
release control, and moving it moves readings on surfaces this pass has not
measured. The gate asserts the collision exists, so it cannot be forgotten.

## PASS TWO · STRUCTURE AND FLOW

A different question from pass one. Pass one asked whether the tables agree.
This asks whether the engine's **control flow** has the shape the spec draws.

### The firing order

The spec: `bias -> fetter -> saboteur -> complex -> hyper-complex`.

The engine, read off `compute()` in order of declaration:

    line 67   sabs      saboteurs, off the fetter levels
    line 88   cxs       complexes, pairs of saboteurs inside a family
    line 101  hys       hyper-complexes, families that compound
    line 107  sups      PAIRS OF HYPER-COMPLEXES

**Three findings.**

**There is no bias layer.** The word appears in `engine/data/ages.js` as a
conversational idea, a groove set in a developmental era, and nowhere as a
detection rung that constrains fetters. The spec's chain begins at a rung the
engine does not have. It is also the only rung the spec gives no table for, so
this is a gap in both places rather than a disagreement.

**The engine has a fifth rung the spec does not name.** `sups`, pairs of
hyper-complexes, gated at mean weight 5.6. The spec's five-step descent chain in
section 5, Narcissism to Machiavellianism to Sociopathy to Psychopathy to
Megalomania, is the only thing in the document that could be it, and the
correspondence is not stated. **Needs his ruling: is `sups` the descent chain, or
a sixth layer nobody has ruled?**

**The rest of the order is right, and it is right in the strong sense.** Each
rung reads only the rung below it. `cxs` filters `sabs`, `hys` filters `cxs`,
`sups` slices `hys`. Nothing reads upward. The spec's note that the arrow is not
strictly top-down and pattern can install from any direction is therefore **not**
implemented, and the strongest joint it names, fetter to saboteur, is exactly
where the engine puts all of its confidence too. On that point the code and the
document already agree.

### The mask as output rather than a rung

**Satisfied, and structurally rather than by convention.** `compute.js:199`:

    const mask = sups[0] || hys[0] || cxs[0] || sabs[0] || null;

The mask is *selected from* the stack. Nothing downstream of it feeds back in,
and `maskRing` at line 112 is computed from band charge and appears only in the
return. So the seam between native and acquired has no operator, which is what
the spec rules. Nothing needed building here and nothing was built.

### The mirror principle

The spec's claim is that the release protocol is four moves and each has a
detection twin. Before this pass the sniffer had two of the four.

| Release move | Sniffer twin | Before | Now |
|---|---|---|---|
| Locate the address | node id | `imprints[].node` | `axes[].address`, `offer[].address` |
| Charge, read the load | 0 to 10 shadow load | `imprints[].amt` | `axes[].shadow` |
| Release through the gates | gate id | **nothing** | `gates`, with the cascade |
| Uncover the replacement at the same address | pole id | **nothing** | `offer[].replacement` |

The fourth row is the one the spec says makes this a sniffer and not a sentiment
classifier, and it was the one entirely missing. It is the whole reason `offer`
is the payload.

### The three axes as two upstream feeding one sump

**The engine does not have this shape and `verp.js` is another seat's file.**
`VERPMIX` holds all six gates as flat peers, each with its own multiplier in
`VERPMULT`, and `verpFactor()` returns their weighted average. There is no
cascade, no upstream and no sump, so the spec's measured progression cannot be
reproduced there.

It is implemented in the new layer instead, in `sniffGates`, and **the cascade
was fitted to his own three numbers rather than to a curve this seat liked.**
The spec measures avoidance at 14.5 percent with both upstream clean, 43.2 with
one distorted and 71.9 with both. Those three points are exactly linear: 43.2
minus 14.5 is 28.7, and 71.9 minus 43.2 is 28.7 to the tenth. So

    avoidance = 14.5 + 28.7 x (aware distortion + detached distortion)

with each distortion 0 through 1. It reproduces all three of his points exactly,
it generalises to the continuous case a story actually gives, and it has **no
free parameter left to tune**. The gate asserts all three points.

**Guard 5 is structural in the output, not advisory.** The avoidance number is
not a bare field. It sits inside `gates.intentional` next to the two upstream
readings that produced it and a `because` naming them, so a renderer that has the
number has already been handed the upstream state. That is as far as an engine
can enforce a rendering rule, and it is further than a comment.

**And it refuses to read rather than assuming clean.** With no gate cue matched,
`gates.intentional` is `null` and `read` is `false`. Running the cascade on
assumed zeros would report 14.5 of 100 avoidance to somebody who wrote nothing
about it, which is the same defect as a blank profile reading 36 in the largest
type on screen.

## PASS THREE · THE FRAMEWORKS

Pass one asked whether the tables agree, pass two whether the flow has the
shape. This asks, of each framework the spec names, what is implementable now,
what needs a lexicon this repository does not have, and what needs his ruling.

### The 21 laws, with their violation readings

**Implementable now, as a floor, and shipped as one.** `LAWCUE` in
`engine/lexicon.js` keys all 21 laws. Every cue is derived from a string the spec
itself prints in the section 6 violation column plus that string's ordinary
English inflections. Nothing is imported from a clinical vocabulary.

**The four bidirectional ones are the substance of this framework and they are
keyed in both directions.** The spec's warning is that a one sided reader misses
half of them, and names the reason: self-abandonment reads as virtue in a
journal. Compassion, Humility, Generosity and Ownership each carry two cue sets,
and the output names the direction and the direction's own violation string.

| Law | Outward | Inward |
|---|---|---|
| Compassion | Indifference | **Self-abandonment** |
| Ownership | Justification outward | **Victimhood inward** |
| Humility | Pride and grandiosity | **Self-abasement** |
| Generosity | Hoarding on giving | **Entitlement on receiving** |

**Negation is handled, and it had to be.** The mechanism is ported from
`verp.js` rather than reinvented, including its three word lookback and the
reason for that width. Without it "i did not lie to them" fires Truth, which is
the instrument accusing a person of the thing they just denied. The gate asserts
both directions on three laws.

**What it cannot do, named rather than left to be discovered.** There is no
subject handling. "she lied to me" fires Truth on the writer. Guard 2 says never
score another person, and the scan has no subject model at all, so this is the
one place in the output where the guard is genuinely at risk rather than
satisfied by absence. It is the single highest value thing left on this layer and
it is not in this pass.

**Needs his ruling, and it changes arithmetic.** The engine's 21 and the spec's
21 share 19 names. The spec has Ownership and Wisdom; the engine has
Responsibility and Accountability, which is Ownership split in two. And section 7
says E43 is retired while section 6 lists E43 Wisdom as live with a violation
string. If Wisdom is retired, section 6 lists 20 live laws and the mean is over
20, not 21. **The divisor of the coherence number is unresolved.**

### Dante's nine circles as a depth scale

**Partly implementable, and mostly not, and the output says which.**

The eighth circle is implementable **as a test**, because the spec calls it one:
"does this person's warmth cost them anything, or does it require an audience?"
That is a relation between two markers rather than the presence of one, so
`sniffDepth` looks for a giving marker and a display marker inside one sentence
of each other. The spec is right that it is the most sniffable line in the
system, and it is the only part of this framework with real evidence behind it.

Four circles carry a thin phrase list derived from the spec's own pattern line.
**Four carry nothing at all: C2, C6, C7 and C9.** They are behavioural taxonomy
without a vocabulary, and `elements.json` is not here to derive one from.

**`depth` returns null rather than a low confidence guess.** A depth reading is
the heaviest thing in this output. A person told they are in the eighth circle on
two matched substrings has been handed a verdict the instrument cannot support,
so refusing to read is the right answer and the output names the four circles it
cannot key. Confidence is capped at 0.5 for every circle read off a phrase list
and 0.4 for the C8 test, because one relation in one sentence is not a pattern
across entries.

### The expression shadows

**Five implementable, five not, and the engine's own table disagrees with all
five that are.** Section 7 names Flow to Block, Curiosity to Apathy, Play to
Rigidity, Purpose to Driftlessness and Will to Resignation as high value for
journal text. Measured against `EXPR`: Flow and Curiosity have no slot at all,
and Play, Purpose and Will each carry a different shadow word (grimness, drift,
inertia).

`EXPRCUE` is therefore **a separate table and not an edit to `EXPR`**. `EXPR` has
other callers and moving its strings moves surfaces this pass has not measured.
That is a deliberate duplication and it is a debt: two tables now name the same
concept. It is the smaller of two evils and it is written down so it is not
discovered later as a surprise.

The other 28 of the 76 slots, nature and human nature, are **not implementable at
all** without `elements.json`, and are returned as `unread` with the file named.

### The output contract

**Implementable now and built.** Section 10's shape is the target and
`sniffStory` emits it. Details in the schema below.

## THE SCHEMA

    sniffStory(text) -> {
      axes:      [{axis, shadow, coherent, address, because, coherentBecause, named}] x 9
      saboteurs: [{id, name, confidence, because, weight, fetters}]  ranked, top 6
      laws:      [{e, law, violation, score, direction, because}]
      flow:      {nature, human, expression, unread, because}
      gates:     {aware, detached, intentional:{avoidance, of, upstream, because},
                  read, cues, because}
      depth:     {circle, pattern, confidence, because, unkeyed}
      offer:     [{address, axis, replacement, shadow, coherent, because, poleDiffers}]
      parsed:    the full parseStory output, kept so the contract can be audited
      gaps:      lawCoverage(), so a renderer cannot print a clean reading over a hole
    }

Seven decisions in it worth defending.

**`offer` is the payload and everything else is evidence.** It is ordered by
shadow load, because the address carrying most is where release should be offered
first, and it is never empty when any axis carried anything. The gate asserts
that.

**`because` is on every part, including the parts that read zero.** An axis
reading zero says "nothing in the text reached this axis", which is a different
claim from a zero with no explanation. The gate asserts `because` on every
saboteur, that it names every fetter in the row, and that it states the band and
the ramp value that produced the number.

**There is no boolean firing set anywhere.** See the algorithm: a hard floor on
the output is where the band edge cliff reappears.

**Two readings per axis are built in two separate passes and never subtracted.**
`shadow` and `coherent` are both non-negative by construction, and the gate
builds a field carrying both at once and asserts both survive, because that is
the field a signed collapse cannot represent.

**The coherent load is not apportioned per axis, and says so.** The lexicon's
coherent seat does not record which axis a calm word answers, so splitting it
nine ways would be an assumption nobody made. It is reported once as a field
level reading with the reason in `coherentBecause`.

**`gaps` is in the payload.** Every place this reading is thin travels with the
reading. A renderer cannot accidentally print nature and human nature as clean.

**`parsed` is retained.** Re-parsing a stored entry gives back the same
imprints, which is what makes the atom layer possible with no schema change, and
a contract that discards its own evidence cannot be audited.

## THE ALGORITHM

### The bands, ported

`SAB33` in `engine/data/canon.js` is now section 3's table. It was 16 of 33 rows
identical; it is 33 of 33. What was wrong, measured with
`proto/sniffer/sab.js` before anything was touched:

- **17 of 33 rows** carried different numbers or different fetters.
- **5 rows changed arity.** The spec gives Victim, Judge, Martyr and Control
  Freak a third fetter and reduces Innocent to one. The shipped table had no
  three fetter rows at all, which is why the combination rule below had never
  mattered.
- **2 rows keyed on `anxiety`, which is not one of the nine axes.** `core.js`
  papered over it with `L.anxiety=L.anticipation`, so Avoider and Restless were
  scored off a term the instrument does not carry.
- **Apathy keyed nothing.** The shipped table never mentioned apathy or
  anticipation, so one of the nine axes fired no saboteur at all while the spec
  keys twelve rows on it. **This is the largest thing the port fixes** and no
  amount of retuning the other sixteen rows would have found it.

**What the port moved in the shipped path, measured with
`/tmp` probe against commit `fd104ff`.** `core.js sab33Detect` reads `SAB33`
directly, so `compute()` moved whether or not `core.js` was touched.

    9 of 14 reference profiles read a different named saboteur set
    189 saboteurs across the roster before, 178 after
    mean CQ unchanged at 33.86, mean DQ unchanged at 4.84

Diane loses Avoider and Restless, the two `anxiety` rows. Derek loses six.
Wren goes from Pleaser to Innocent. Abraham loses Pleaser and reads nothing.
CQ and DQ do not move, because neither depends on which saboteurs are named.
**Readings in this product have changed and that is the cost of the port.**

### The ramp, and the measurement that did not go as expected

**The shipped rule was a three step staircase over a level rounded to an integer
first.** Full membership flat across the band, a half step at exactly one integer
outside, zero beyond.

**His example is not quite the defect, and it is worth being precise.** 6.9 and
7.1 both round to 7, so they are in fact the same answer. The cliff is real and
it sits at **x.5**: 6.4 and 6.6 are different answers, and nothing about a body
changes across a fifth of a point. Dropping the rounding is the whole of that
complaint.

**And flat-inside cannot express "intensity peaks inside the band",** which the
spec states outright. A reading at the very edge and a reading dead centre were
the same number.

`sabMember(lvl, lo, hi)` in `canon.js`. Every width has a reason:

| Constant | | Why |
|---|---|---|
| `SAB_EDGE` | 0.75 | membership at the band edge. Not 1, because a peak needs somewhere to fall to. Not lower, because the edge is inside the band the canon states and must not read as half absent |
| `SAB_BELOW` | 2 | points under the low edge to zero. Two, so a reading **one point under**, which the spec calls the normal condition of a reader, keeps half the membership it had at the edge. One would put the normal error at zero, which is the failure being fixed |
| `SAB_ABOVE` | 3 | points over the high edge to zero, wider than below on the spec's own "tapers above it". The low edge is a threshold of **presence** and under it the configuration has not formed; the high edge is a threshold of **displacement** and over it it has formed and is being overrun. Evidence that decays is not evidence that never arrived |

**The measurement, and the finding this seat did not expect.** Definition first,
because there is no labelled set and this is not accuracy. It is **agreement**:
the saboteur reading at a stated field against the reading at the same field off
by one point, which the spec itself calls the normal condition. Run
`node proto/sniffer/ramp.js` and `node proto/sniffer/cohort.js`.

    1 · RESOLUTION, and it needs no cohort at all
        largest move in confidence one tenth of a point of input can cause
        hard edge  0.5000        ramp  0.0375        the ramp is 13x finer

    2 · THE MEASUREMENT THAT FOUND THE DEFECT
        agreement on a BOOLEAN firing set behind a hard floor at 0.6
        jitter 0.5   hard 74.4   ramp 74.0
        jitter 1     hard 58.8   ramp 54.4      THE RAMP IS WORSE
        jitter 2     hard 35.0   ramp 29.6      WORSE AGAIN

    3 · CONFIDENCE STABILITY, mean absolute move under an off by one reading
        jitter 1     hard 0.0998  ramp 0.0905   ramp steadier by 9 percent

    4 · TOP THREE AGREEMENT ON THE 14 STATED PROFILES, off by one point
        mean         hard 51.4    ramp 51.4     a dead tie

**Row 2 is the finding.** A ramp inside the membership function buys nothing
while the **output** is still a cliff. The edge simply moved from the band to the
confidence floor. The band edge ruling is not really about band edges; it is
about the reading being continuous all the way to what is shown.

**So the boolean firing set was removed entirely.** `sniffSaboteurs` emits a
ranked confidence on every row that scores above zero and discards nothing by a
line. `SAB_SHOW` bounds what is rendered, which is a display decision, not a
claim that row 7 is absent. `canon.js` carries no firing threshold at all.

**Row 4 is the honest limit and it is not hidden.** On the population this
repository actually has, the ramp is a dead tie on set agreement. It helps Ana
39.9 to 65.4, Derek 24.3 to 34.8 and Marcus 56.2 to 65.7, and it hurts James
46.8 to 28.1, Nkem 49.6 to 32.2 and Wren 61.4 to 51.0. **It redistributes
stability rather than adding it.** What it genuinely buys is resolution, by a
factor of thirteen, and steadiness of the number itself by roughly a tenth.

**This seat could not reproduce his 94 and 73.** Those need the cohort they were
measured on and it is not in this repository. Uniform random fields across nine
independent axes are not a cohort: no body puts nine axes independently anywhere
in 0 to 10, and rank agreement measured on them is largely measuring
tie-breaking. What is reported above is what this seat can stand behind with the
definition stated beside it.

### The combination rule, which the port made load bearing

The shipped code took the **arithmetic mean** of the per-fetter fits. The spec's
own sentence refuses it: "a saboteur is a configuration of fetters at specific
intensities. Break the co-mingling and the saboteur is gone." An arithmetic mean
cannot go. On a three fetter row it averages 1, 1 and 0 to 0.67 and fires with
one fetter entirely absent.

`sabFetters` is the **geometric mean**, which is zero on any absent part. That is
what "break it and it is gone" means arithmetically. The shipped table had no
three fetter rows so this had never shown; the port adds four, so it stopped
being academic the moment the table landed.

### The two specificity weights, and both are derived

**Arity.** `SAB_ARITY` = {1: 0.80, 2: 1.00, 3: 1.10}. A configuration naming one
fetter is the least specific claim in the table and one naming three is the most,
so confidence scales with how much the row had to find. This is the same rule
`lexicon.js` already applies to a bare axis noun taking its family floor.

**It is also the fix for a defect the port introduced, which this seat did not
expect.** The spec reduces Innocent to a single fetter, Fear 2 to 4, and a one
part row beats a multi part row under **any** conjunctive combination because it
has nothing to disagree with. Measured on the 14 stated profiles with the ported
bands, **Innocent reached the top three in 38.4 percent of runs.** That is
exactly the "fires on everything" shape the spec warns about, relocated from
Avoider onto Innocent by the port itself.

**Avoider, held at 0.55 on his ruling. The premise is not true of this
population and it is raised rather than buried.** The spec: "Avoider fires in 81
percent of runs and costs 0.1 points. Weight it low or your sniffer will report
Avoider on everything." Measured on the ported bands over the 14 stated
profiles, **Avoider reaches the top three in 1.4 percent of runs, not 81.**
Whatever cohort produced 81 is not in this repository. The weight is applied
because he ruled it. This seat reports that on the data here it suppresses a row
that was already nearly silent, and that **Innocent is the row his sentence
actually describes.**

### Resentment as the composite

`LEXCOMP` in `sniff.js`. The shipped lexicon seats `resentment` at the solar
plexus with no stated fetter, so the fetter is inferred from the seat and comes
back **Anger alone**, which is exactly the mapping the spec names as the defect
that collapsed Aggressor and Manipulator.

**The charge splits rather than doubling.** Half to Anger, half to Apathy.
Doubling would let one word carry twice the load of any other word in the table,
which is a magic number dressed as a composite. Split is what "the grudge held"
describes: anger that has stopped moving. Measured, both Aggressor and
Manipulator now appear at **different** confidences on "i am resentful", so they
are distinguished rather than merely both present, and the gate asserts it.

**The gate found three dead rows in this table and that is worth recording.**
`grudge`, `begrudge` and `embittered` were in `LEXCOMP` and **none of them was in
`LEX`**, so each scored 0 and 0 while the table asserted it was a composite. The
first cut of the gate exercised only `resentful`, which is seated, so it passed.
It exercises every key now. `lexComposite()` seats the missing words by the same
derivation `lexCanon` uses: the unanimous seat of the members already in the
table and the **floor** of their amounts, read off the table rather than typed.
It refuses if the seat is not unanimous, and the gate fails on the refusal, so it
gets ruled rather than defaulted. A fourth provenance, `composite`, is declared
in `LEX_SRC`; until that line existed the validator refused every entry, which is
the validator working.

### A stated fetter that `parseStory` dropped

Measured: **"i am angry and exhausted" returned Anger 10 and Apathy 0.** The
owner's exhaustion ruling is that exhaustion sits at the solar plexus and is not
anger, and `parseStory` honours it through its `stateHere` branch, but that
branch only runs when the seat has no address for any wanted fetter. `angry` puts
Anger in `wanted`, the solar plexus carries ten Anger addresses, so `seg` is non
empty, the branch is skipped and the one thing the sentence actually said about
apathy is discarded. **This happens to every stated fetter whose seat is shared
with a co-occurring axis.**

`scanStory`, `parseStory` and `applyStory` keep their bodies on the standing
ruling, verified byte identical after this pass, so it is repaired in
`sniffAxes` and only where it was dropped: a stated fetter that no imprint
carries is added, a fetter the imprints did carry is left alone, so nothing is
counted twice. It now reads Anger 10 and Apathy 8.7.

**The one line change that would fix it at source**, for whoever rules on moving
`parseStory`: in the quarter rule, change

    if(seg.length < all.length*0.25 && !stateHere){

to fall through to the `stateHere` push for any stated fetter that `seg` does
not represent, rather than only when `seg` is empty. It is a four line change,
it moves `S.charge` for every story containing a stated fetter beside a
co-seated axis, and it is not in this pass because `applyStory` mutates and the
blast radius has not been measured.

## THE CQ CONTRADICTION · SPECIFIED, PRICED, NOT BUILT

`atuned_src/engine/compute.js` is not this seat's file. This is the change
request, with the measurement.

### What the two definitions are

The engine, `compute.js:138-140`:

    Rz = max(1, (1 + DQraw*0.05) * verpFactor())
    CQ = clamp((It * Ig) / Rz, 0, 100)

The spec, section 6: **"CQ is defined as the mean of these 21, each scored 0 to
10, times 10."**

### The gap is not a rescaling

Measured across 18 fields including all 14 reference profiles. **Blank profile:
engine 36, spec 60.** But the gap runs **0 to 43** and is not monotone in
anything, so no constant and no curve converts one to the other.

| Field | engine | spec | gap |
|---|---|---|---|
| blank, laws all 6 | 36 | 60 | +24 |
| all laws 0 | 0 | 0 | 0 |
| all laws 10 | 100 | 100 | 0 |
| all laws 5 | 25 | 50 | **+25** |
| Rosa | 54.2 | 60 | +5.8 |
| James | 29.9 | 60 | +30.1 |
| Gordon | 18.7 | 60 | +41.3 |
| Tomas | 17.0 | 60 | **+43.0** |

### The thing that actually decides it

**Under section 6 taken literally, a full release moves CQ by 0.0.**

Measured on Ana, every charge zeroed:

| | before | after | moved |
|---|---|---|---|
| engine `(It*Ig)/Rz` | 29.0 | 38.6 | **+9.6** |
| spec section 6, law mean x 10 | 60 | 60 | **0.0** |
| spec guard 8 estimator | 45.2 | 62.2 | **+17.0** |

And **0 of 14 reference profiles carry any law data**, so under section 6 every
one of them reads exactly 60 and they are indistinguishable.

**So section 6 alone would make CQ a pure readout of the 21 law intake
questionnaire.** Releasing charge could not move it. `cqCeiling` and
`cqHeadroom` would return constants, the release meter would have nothing to
meter, and the tier ladder would move only when a person re-answered the intake.

### The reconciliation, and it is in the document

Sections 6 and 11.8 are not in conflict; they describe **two functions**, and the
engine has one of them mislabelled.

**Guard 8:** "`sqrt(Intention x Integrity) x 10 / (1 + 0.6*SQ/10)` fits r = +0.97
against the full audit, and is **for use only when the 21-law audit has not been
run.** Label it as an estimate in the UI."

**Guard 7:** "Resistance acts on Expression, never on CQ. Do not let Resistance
divide the coherence number."

Read together the architecture is unambiguous:

    CQ            = mean(the 21 laws) x 10          when the audit has been run
    CQ estimate   = sqrt(It x Ig) x 10 / (1 + 0.6*SQ/10)   when it has not
    Resistance    divides Expression, never either of the above

The engine's `(It*Ig)/Rz` is **neither**. It is the estimator with a different
shape and with Resistance dividing it, which guard 7 forbids by name. **The
engine has never implemented audited CQ at all.**

### The change, precisely

In `compute()`:

1. Add `measured` as the gate, which already exists at `compute.js:150`.
2. When `measured === 21`, `CQ = clamp(SINAMES.reduce((a,l)=>a+S.law[l],0)/21*10, 0, 100)`.
3. When `measured < 21`, `CQ = clamp(Math.sqrt(It*Ig)*10/(1+0.6*SQm/10), 0, 100)`
   and set a new returned field `cqEstimated: true`.
4. **Remove `Rz` from the CQ expression.** Keep `Rz` computed and returned; move
   its divisor role onto the expression reading, per guard 7.
5. Every surface printing a tier checks `cqEstimated` and labels it, per guard 8.

`compute()` keeps its signature. `It`, `Ig`, `Rz`, `DQ` and `SQm` keep their
bodies. Two lines change and two fields are added.

### What it costs, so the decision is priced

- **Every reading the product has produced moves, and every tier with it.**
  Measured: mean CQ across the 14 reference profiles goes from **33.86 to 53.27**
  on the estimator path, and **14 of 14 profiles change tier.** Not some.
  Tomas goes Severe to Oscillating, Gordon Severe to Oscillating, Rosa Even to
  Compounding, Sofia and Lance Incoherent to Gaining. The blank profile goes
  Incoherent to Even. **There is no profile in this repository whose stated tier
  survives this change**, so every screenshot, every copy line that names a tier
  and every threshold in the ladder is measuring against a distribution that
  will not exist any more.
- **`cqCeiling` and `cqHeadroom` need rewriting**, because the ceiling of the
  audited definition is 100 by construction and the ceiling of the estimator is a
  different function.
- **The tier ladder needs re-reading against the new distribution.** The current
  thresholds were set against a formula that put a blank profile at 36. The
  estimator puts it at 60, which is a different tier.
- **The accuracy figure moves.** It is fitted against the shipped formula.
- **The release meter gains something on the estimator path and loses it on the
  audited path.** A release moves the estimator by 17 and audited CQ by nothing.
  **This is his to rule: once a person has answered all 21, should release stop
  moving their coherence number?** That is what section 6 says, and it may be
  exactly right, because releasing charge is not the same act as closing a law.
  But it needs saying out loud before it ships.
- **And one thing it silently fixes.** `benign` is `CQ >= 50` and `malig` is
  `(50-CQ)/50*100`. A blank profile reads 28 of 100 malignant today, which
  `DESIGN-lean.md` raises as its open item 7. Under either spec definition a
  blank profile reads 60 and `malig` becomes 0. Measured: **28 to 0, and
  `benign` flips from false to true.** **The CQ ruling and the lean seat's open
  item are the same question.**

## THE LEAN WORK AND THE BENIGN / MALIGNANT OPEN ITEM

Section 12 names the benign and malignant polarity conflict as **OPEN**, says
malignancy counts up in one place and down in another, and says to resolve it
before scoring anything on it. `engine/verp.js` scores on it. It is another
seat's file, so this is raised rather than changed.

**Read `DESIGN-lean.md`. The verdict: that work is on the right side of the
conflict, and the part of it that is exposed is not its own.**

**Why it is on the right side.** Inside `verp.js` the direction is consistent.
`leanScan` counts `malignant = (empLack + accLack) x admit`, which rises with
malignancy, and `leanRead` blends `mal = fieldMal x (1-trust) + storyMal x
trust`, where both operands also rise with malignancy. The spec's conflict is
between two places in the canon; the lean work picked one, counts up, and made
both its inputs agree with it. That is the correct posture for an OPEN item: pick
one, state it, do not mix.

**Where it is exposed, and it is not the lean seat's code.** `fieldMal` comes
from `compute()`'s `malig`, which is `(50-CQ)/50*100`, which is CQ restated. So
the lean reading is downstream of the CQ definition this document is asking him
to change. **Adopting section 6 or guard 8 moves the lean numbers without anyone
touching `verp.js`.** A blank profile goes from 28 of 100 malignant to 0, and
`benign` flips from false to true.

`DESIGN-lean.md` open item 7 already names the 28 and says `compute.js` was out
of scope and it is worth a look by whoever owns `compute`. **It is the same
question as the CQ ruling and it should be ruled once, not twice.**

**One thing the lean seat should hear rather than read in a diff.** Their own
finding is that plain accounts of being harmed read 67, 60 and 51 of 100
malignant, and their DESIGN document says a word matcher reporting a person as
malignant is a verdict on a person. If the CQ change lands, `fieldMal` drops
sharply for every profile, the story half of the blend gains relative weight,
and **the harm accounts get worse rather than better** because the field is no
longer diluting them. That is measurable before it ships and it should be
measured rather than discovered.

## WHAT NEEDS HIS RULING

Five, and they are the five that block integration rather than the five that are
most interesting. Everything else in this document was decided by the rule that
the spec wins.

**1 · E43, and the divisor of the coherence number.** Section 7 says 76 slots
with 75 live because **E43 is retired**. Section 6 lists **E43 as Wisdom, live,
with a violation string**. And the engine's 21 laws are not the spec's 21: they
share 19 names, the spec has Ownership and Wisdom, the engine has Responsibility
and Accountability, which is Ownership split in two. So there are three
questions folded into one and all three change arithmetic. Is Wisdom live? Is
Ownership one law or two? **Is the mean over 21 or over 20?** Audited CQ cannot be
implemented until this is answered, because the divisor is the answer.

**2 · Once a person has answered all 21 laws, should releasing charge stop moving
their coherence number?** Section 6 taken literally says yes, and it is measured:
a full release of every charge moves audited CQ by **0.0**. That may be exactly
right, because releasing charge and closing a law are not the same act. But it
retires the release meter on the audited path, `cqCeiling` and `cqHeadroom`
become constants, and **14 of 14 reference profiles change tier.** It needs
saying out loud rather than arriving as a side effect.

**3 · Which address owns Joy?** The spec offers **Joy / Aliveness at Apathy**.
`CHILD` offers **Joy at Sad**. One word, two places in a body. The sniffer emits
the spec's table and flags the disagreement on every offer, but a person cannot
be offered Joy for their apathy on one surface and for their sadness on every
other one.

**4 · Avoider or Innocent?** The ruling to weight Avoider low is implemented. The
premise behind it does not hold on the data here: measured on the ported bands
over the 14 stated profiles, **Avoider reaches the top three in 1.4 percent of
runs, not 81.** The row that actually fires on everything is **Innocent, at 38.4
percent**, and it does so because the spec reduces it to a single fetter and a
one part row beats a multi part row under any conjunctive rule. Two ways to
settle it: move the weight to Innocent, or give Innocent a second fetter. The
arity weight currently absorbs it, which works and is derived, but it is a
general rule standing in for a specific ruling.

**5 · Surprise's somatic address.** The spec puts it at the **lower solar plexus,
bilateral at the lung edges**. `CHILD` puts it at the **upper chest and back**
with the **Heart** seat. This is the one address where the two disagree about a
place rather than a wording, and a somatic address is the thing this product
points at on a body.

**Noted and not asked, because it does not block anything.** The engine has a
fifth rung the spec's firing order does not name: `sups`, pairs of
hyper-complexes. The five step descent chain in section 5 is the only candidate
for it and the correspondence is not stated. It can wait.
