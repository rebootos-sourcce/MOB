# THE SNIFFER

What it is looking for, what it is allowed to claim, and what it cannot read.

Written because the owner asked a question this repository had no answer to:
does the sniffer know what it is supposed to be sniffing, has it got the
information, has it got the logic supplied by The Mechanics of Being. The
answer, measured rather than argued, was no, and in a specific way that no
amount of adding words would have fixed. Every number below was measured on
this build with the probes in `proto/sniffer/`, each checked against a known
good case first.

## THE TWELVE QUESTIONS

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
information." Thirteen of the fourteen return zero imprints, and the fourteenth
only because it happens to contain the idiom "feel nothing". Across the book,
856 of 9,431 sentences produce any hit at all, so 91 percent of the owner's own
prose reads as nothing. A vocabulary cannot reach a stance, because a stance
carries no feeling word. If the journal receives stance, the frame layer is the
product and the lexicon is a side show. If it receives events, a father dying
and a partner lying, the lexicon is the product. Today the instrument is built
for events and every held example is a stance.

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

### The three about what the product is allowed to say

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

**Pass two, the fold.** 29 of 63 ordinary inflections of words already in the
table did not resolve, so the obvious fix is a stemmer. It was prototyped and
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
