# TDD · THE SNIFFER

The engineering contract. Interfaces, data shapes, invariants, failure modes,
what is tested and how. `DESIGN-sniffer.md` says what it is for and why it is
shaped this way, and carries the twelve questions for the owner. Read that
first.

Counts in this file are read off a run and stated with what they are out of. Do
not type a count in here that the product can grow past: this repository has
been bitten by that seven times.

## THE CHAIN, AND WHAT EACH STAGE MAY CLAIM

    scanStory(text)   -> [hit]           a word occurred. no claim about a person.
    parseStory(text)  -> reading         charge in a region, and an address with
                                         a flag saying whether the text named it.
    applyStory(text)  -> {parsed,applied} the only function that mutates.

`scanStory`, `parseStory` and `applyStory` keep the bodies and signatures they
had. Everything this pass added runs before them, at load, and builds the tables
they read. Nothing in the reading path changed.

### scanStory

    scanStory(text) -> [hit]

Pure. Deterministic. No host. Normalises to lowercase letters, spaces and
apostrophes, then matches three tables in this precedence:

1. `PHRASES`, the idioms. Every match is recorded.
2. `LEX`, longest key first. A match is skipped if it overlaps a hit already
   recorded, which is what makes a phrase outrank the words inside it.
3. `ADJ2CHG`, the charge names. Recorded unconditionally, so one word can be a
   lexicon hit and a charge hit at the same offset, which is one event in the
   body and not two.

Hits are sorted by offset. A hit is:

    {t, kind, at}                 always. kind is phrase, word or adj.
    {band, amt, label}            on a phrase.
    {band, amt, fet}              on a word. fet may be null.
    {charge}                      on an adj.

**Invariant.** `t` is always a key of the table `kind` names. The gate asserts
this in the hard direction: every key of every table can be found by the
scanner. Two cannot, they are named in `LEX_DEAD` with the reason, and the gate
holds the count at exactly those two.

**Failure mode, named.** `at` is an offset into the normalised string, not into
the text the person typed. The normaliser collapses every run of punctuation to
one space, so the two drift apart as soon as a sentence has any punctuation in
it. Measured: for `"I was FURIOUS, and then, numb."` the hit for numb reports
offset 23, where the original holds `", numb"`. So nothing may use `at` to
highlight the person's own words. That is question 11 in the design document.

### parseStory

    parseStory(text) -> {hits, bands, charges, named, weights, imprints, path, words}

Pure. Deterministic. The only stage that names an address.

    bands    {seatKey: summed amount}      well founded. the table says where.
    charges  {chargeName: count}           from the words that name a charge.
    named    [fetter]                      charges present, most mentioned first.
    imprints [{node,name,band,fetter,amt,inferred,stated,from}]

**`inferred` is the load bearing field, and it guards less than it looks like
it guards.** False means the person's own word named the AXIS. It does not mean
the address was named, and no word ever names an address: the address comes from
a susceptibility sort over the band. Measured, and unchanged by this pass: "I was
furious" returns Pride, Arrogance, Competition and Anger, all with
`inferred:false`. The axis is right and the four names are a sort order. A
renderer that treats `inferred:false` as a licence to print `name` is printing
Pride off the word furious. That is question 13 and it is the highest
consequence item left open.

False means the person's own word named the axis. True means the seat was read
and the address was chosen by the band's modal fetter rather than by the text.
A renderer must never print `name` as a finding when `inferred` is true. This
is not a style preference: the version without it told a bereaved person they
were carrying Martyrdom and told somebody who had been cheated that they were
carrying Lying.

**The quarter rule.** A named fetter governs a band only when it holds at least
a quarter of that band's addresses, otherwise the band's modal fetter is the
better read. One Shame address at the heart was otherwise enough to route the
whole heart band, including the despair idioms, onto Shame, and grief was filed
as shame.

**The stated exception.** A fetter the person's own word named survives a seat
that cannot house it. Exhaustion states Apathy, the solar plexus has no Apathy
address, and the quarter rule would otherwise discard the one thing the sentence
actually said and fall back to Anger.

**Failure mode, named and not fixed.** In the stated branch the fetter is taken
as `Object.keys(stated)[0]`, the first stated fetter globally rather than the
one belonging to this band. A story stating two fetters therefore gives every
band that cannot house either the first one. Reproduced, not repaired, because
`parseStory` keeps its body in this pass. It needs a band scoped `stated` map
and it is a five line change in the same shape as the existing code.

### applyStory

    applyStory(text) -> {parsed, applied}

The only function in the engine that mutates. Scales what lands by 0.35 and
clamps to 0 through 10. Coherent hits subtract. Nothing else anywhere may write
to `S.charge` off a story.

## THE LEXICON ENTRY

An entry is an array and the positions are named, because a table read by index
is a table nobody can search.

    LEX[key] = [seat, amount]            or
    LEX[key] = [seat, amount, fetter]

    LEX_SEAT  0   seat      one of LEX_SEATS. WHERE. always asserted.
    LEX_AMT   1   amount    signed integer. 12 to 28 in practice, ceiling 30.
                            negative only at the coherent seat.
    LEX_FET   2   fetter    one of CHARGES, or absent. WHICH axis, and absent
                            by design: absent means the seat is known and the
                            axis is not, and the imprint comes back inferred.

`amount` is not a charge and must never be read as one. `parseStory` divides the
band total by 3 and `applyStory` scales by 0.35.

**What an entry may never assert.** A saboteur, an architecture, a diagnosis, a
verdict, or anything about a person. A word is evidence that a word was written.

### The key

    /^[a-z']+( [a-z']+)*$/

Exactly the surface forms the normaliser can produce. A key with a capital, a
comma or a double space in it matches nothing forever and looks live.
`lexKeyOk` is the predicate and the gate runs it over every entry.

### Provenance

    LEXMETA[key] = {src, from, rule, cite}
    CHGMETA[key] = {src, from, rule, cite}

`src` is one of `LEX_SRC`, which is the spec and not a summary of one:

    authored  hand written. the original 192. no stated source, and that is
              question 2, not a defect to be hidden.
    canon     derived from a canon table that already has an owner. no number
              is invented by this pass.
    fold      an ordinary surface form of a key already present, generated by a
              stated rule and admitted only where a named corpus confirms it.

`LEXMETA` covers `LEX` exactly, in both directions, and the gate asserts both.
A provenance table with holes is worse than none, because it reads as though
everything in it were sourced. A derived entry must also name what it was
derived from, or the provenance is a label rather than a trail.

## HOW A NEW ENTRY IS ADDED

Through `lexAdd` and `chgAdd`, and no other way. This is the point of the
design: a second vocabulary table appearing with no owner is the failure this
layer exists to prevent, and it is the failure that produced the state this
pass found.

    lexAdd(key, seat, amount, fetter, meta) -> {ok, why, errs, already}
    chgAdd(key, chargeName, meta)           -> {ok, why, already}

`obValidate`'s posture, applied to a vocabulary: refuse by name, never clamp,
never accept in silence. A clamped amount reads back as a reading the author
never wrote. Already present with the same seat is a no op and says so, so a
pass can be re-run without doubling the table.

Refused, each by name and with the reason:

    a key the normaliser cannot produce
    a seat not in LEX_SEATS
    an amount that is zero, fractional, or past LEX_AMT_MAX
    a sign that disagrees with the seat
    a fetter not among the nine axes
    a source not in LEX_SRC
    moving an existing key to a different seat

## THE TWO DERIVATION PASSES

Both run at the top of `sniff.js` and both complete before anything can scan.

**Load order is why they run there rather than in `lexicon.js`.** `lexRefuse`
checks a stated fetter against `CHARGES`, which `core.js` declares, and MANIFEST
loads `core.js` after `lexicon.js`. Touching it from `lexicon.js` throws at
parse, which is the failure the load order rule exists to prevent. So the
vocabulary, its schema, its validator and its rules live with the vocabulary,
and the passes are run at the first module where the canon tables are in scope.

**Pass order is load bearing.** Canon first, then the fold, so the fold can take
an inflection of a canon word and never the other way round.

### lexCanon

Reads its word list off the canon at load: the nine axis names lowercased, and
every cue word `SAB33` defines a saboteur by. Neither is a list typed anywhere,
so neither can fall out of step with the table it came from.

Seat from `CHG2SEAT`. Fetter from `CHG2FET`, or, where the word is an axis name
that `CHG2FET` has no entry for, the axis itself by identity, which is the same
string and not a guess. Amount derived: the floor of that axis's own authored
family, or the lowest charged amount anywhere in the table where the family is
empty.

A word with no seat is reported by name and the gate fails on it. The 112
addresses carry a second answer in `cf` and the two disagree for four of the
nine axes, so `cf` is not a fallback, it is question 6.

Output:

    {added, already, unseated:[word], identity:[word], floor, fam}

### lexFold

    LEX_FOLD_RULES  14 rules, each [id, test, make]. pure.
    LEX_FOLD_OK     27 forms. the allow list.
    LEX_FOLD_NO     4 forms, each with the reason it is refused.

Of the ordinary inflections of authored keys, 31 are confirmed by the corpus and
0 of those 31 resolved before this pass. 27 are admitted and 4 are refused by
name. A fold changes the surface form and nothing else: same seat, same amount, same
stated fetter, same charge name. The gate asserts all four, so a fold can never
be the back door through which a new reading arrives.

The corpus that confirms a form stays outside the engine, because the engine may
not read a file. `proto/sniffer/fold.js` is the tool, the corpus is the book and
the fourteen persona voices, and what crosses the boundary is the confirmed
list. When the record store exists there will be a better corpus and the list
grows by re-running the tool rather than by anybody's judgement about what a
person might write.

Output:

    {generated, added, already, refused:[form], unreachable:[form]}

## WHAT IS TESTED, AND HOW

`tests/engine.js` group 32, additive, nothing existing changed. It asserts
CLOSURE and not accuracy. Accuracy needs a labelled set of real stories and
there is not one, and a gate that pretended otherwise would be worse than no
gate.

The assertions, grouped by what they would catch:

**The thing that was wrong.** Every axis name resolves. Every saboteur cue word
resolves. Each axis name reads as its own axis and not merely as something, and
reads as named rather than inferred.

**The canon pass invented nothing.** Nothing is unseated. Every word owed is
accounted for. Every amount equals the family floor rule, re-derived in the test
rather than compared against a typed number. Every seat is the one `CHG2SEAT`
gives it.

**The fold smuggled nothing in.** Every admitted form is reachable from a real
key by a named rule, re-derived from the rules in the test. Every form carries
its base seat, amount, stated fetter and charge name unchanged. Every refused
form is absent from the table and states its reason.

**Provenance is complete in both directions.** No entry without a source, no
source without an entry, every source on the list, every derived entry naming
what it came from, and the charge name table covered the same way.

**No dead rows.** Every lexicon key, every charge name key and every phrase can
actually be found by the scanner. The two that cannot are named in `LEX_DEAD`
with the reason, and the gate fails both on an unaccounted dead row and on a
`LEX_DEAD` entry that actually works.

**The boundary refuses.** Eleven bad additions, each asserted to be refused with
a reason, and the table asserted unchanged afterwards, because refusing and then
writing anyway is the failure that matters.

**Idempotence.** Both passes run again add nothing.

**The sniffer is still the sniffer.** Re-parsing gives the same reading, a canon
word lands on a real address with weight, and no reading names a diagnosis.

### Proving the gate fires

Broken on purpose, four ways, each shown to fail with the right name, then put
back:

    the canon pass does not run          6 failures, naming all 8 missing axes
                                         and all 7 missing cue words
    a form typed into the allow list
    with no reachable base               3 failures, naming the form
    a fold drifting from its base        1 failure, naming all 27
    a working row named as dead          1 failure, naming the row

## MEASURED, BEFORE AND AFTER

Same probes, same corpora, both sides. `proto/sniffer/before-after.js`.

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

Leakage, over the same 9,431 sentences: 296 readings changed, 0 lost a seat, 0
band totals went down. The lexicon feeds the whole product, so a change here can
move a reading anywhere, and a change that lowered an existing reading would be
a regression nothing could see.

## FAILURE MODES, NAMED

| What | Measured | Status |
| --- | --- | --- |
| negation is not read | "I was not angry" equals "I was angry" | question 3 |
| a denial raises the reading | "not afraid but could be afraid" is double "afraid" | question 3 |
| attribution is not read | "I shouted at him" equals "he shouted at me" | question 4 |
| tense is not read | "I used to panic" equals "I panic every day" | question 5 |
| intensity modifiers are not read | "a bit sad" equals "unbearably sad" | not specified |
| offsets do not address the original text | numb reported at offset 23 of ", numb" | question 11 |
| a shorter idiom beats a longer entry | "cannot stop thinking" reads as compulsion | LEX_DEAD, question 9 |
| the stated fetter is taken globally | two stated fetters, the first wins everywhere | named above, not fixed |
| inferred licenses printing an address name | "I was furious" names Pride and Arrogance, inferred=false | question 13 |
| no frame layer | 91 percent of book sentences produce nothing | specified, not built |
| three axes have no vocabulary | Disgust, Shock and Surprise | question 7 |

## WHAT IT WOULD TAKE TO EVALUATE THIS HONESTLY

There is no ground truth and there is not going to be one, so the honest
evaluation is closure and stability rather than accuracy.

1. **Closure.** Every word the canon is built out of resolves. Gated now, and it
   was 1 of 9 and 0 of 7.
2. **Inflection closure.** Every ordinary form of a key resolves to the same
   seat. Partial: 27 forms, corpus confirmed.
3. **No drift.** A vocabulary change never lowers an existing reading. Measured
   over 9,431 sentences, 0 lowered.
4. **Reach, reported and not hidden.** 856 of 9,431. That number belongs in
   front of whoever is deciding what to build next.
5. **A held set that can move a percentage.** 14 voices makes one voice worth
   7.1 points. Roughly 60 would make it 1.7.
6. **A count of what real entries contain and the instrument reads as nothing.**
   No identity attached, no model needed, and it is the highest value thing the
   record store could produce. It sizes the vocabulary gap in a week.

What would make all of it wrong, and how it would be caught: a probe reading the
wrong thing. Three probes in this repository have already reported their own
bugs as defects, so `proto/sniffer/measure.js` checks itself against four known
good cases before it reports anything, and refuses with a non zero exit if any
of the four fails.

# THE CONTRACT GATE · GROUP 33

Appended to `tests/engine.js`. Additive: nothing above it changed, and the
count went from **964 to 1083**.

    node tests/engine.js        1083 passed, 0 failed

## WHICH GUARDS A HEADLESS GATE CAN ACTUALLY MAKE

`SNIFFER_SPEC.md` section 11 lists eight guards and calls them non negotiable.
Saying which are assertable and which are not is part of the work, because a
gate that claims to cover a guard it cannot reach is worse than one that admits
the gap.

| Guard | Assertable | How, or why not |
|---|---|---|
| 1 · no diagnosis | **partly** | asserted that no clinical string reaches the output. Cannot assert a renderer will not add one |
| 2 · never score another person | **partly** | asserted there is exactly one set of axes and every offer lands on one of the writer's nine. The real risk is subject blindness in the law cues and that is a design gap, not a test gap |
| 3 · two readings per axis | **yes** | see below |
| 4 · band edges are ramps | **yes** | see below |
| 5 · show upstream with avoidance | **yes, structurally** | asserted the number cannot be emitted outside an object carrying both upstream readings |
| 6 · Surprise fires no saboteur | **yes** | table and behaviour, separately |
| 7 · Resistance never divides CQ | **no** | it lives in `compute.js`, which this group does not own. Specified in `DESIGN-sniffer.md` |
| 8 · label the estimator | **no** | a UI rule in a file this group does not own |

## GUARD 3 · TWO READINGS PER AXIS

The weak version of this test is that both fields exist. That passes on a build
where one is derived from the other.

**The strong version builds the field a signed collapse cannot represent** and
asserts both survive: a text carrying real fear and real coherence at once. Plus
that neither reading is ever negative, because a signed collapse shows up as a
negative number the moment the coherent side wins.

## GUARD 4 · BAND EDGES ARE RAMPS

Six assertions, because "it is a ramp" is six separate claims.

- **No step anywhere.** The largest move per twentieth of a point across 0 to 10
  is under 0.05. This is the assertion that fails on the shipped staircase.
- **Half a point under the band still carries membership**, and the two readings
  either side of x.5 are nearly the same answer, which is the whole ruling.
- **It peaks inside the band**, so the centre outscores both edges. The shipped
  rule was flat inside and cannot pass this.
- **Both edges sit at `SAB_EDGE`.**
- **Zero at `SAB_BELOW` under and `SAB_ABOVE` over**, and `SAB_ABOVE > SAB_BELOW`,
  which is the spec's asymmetry.
- **Monotone on each side**, rising to the peak and falling after, no reversal.

**The monotone test failed first and the failure was the test's.** The loop
accumulated 0.1 in a float, walked off the exact midpoint and reported a reversal
the ramp does not have. It iterates tenths as integers now and splits at the
peak. Recorded because a tool that lies is worse than no tool, and this one lied
about the thing it was written to check.

## PROVING THE GATE FIRES

Ten breaks, each made on purpose in the engine source, the gate run, the failure
names recorded, the source restored. Reproduce with the script in the scratchpad
or by hand. **A gate nobody has seen fail is a gate nobody has tested.**

| # | The break | Failures named |
|---|---|---|
| 1 | collapse the two axis readings into one signed number | `neither reading is ever negative, so neither is a signed collapse of the other` · `a field with real fear reports real fear, -1.1999999999999993` · `and the coherent reading in the same text is not cancelled by it` · `and nothing went negative, which is what a collapse looks like` |
| 2 | put the hard staircase back in place of the ramp | `the ramp has no step: largest move per twentieth of a point is 0.5000 near 5.45` · `and the two of them are nearly the same answer, which is the whole ruling` · `membership peaks inside the band rather than sitting flat across it` · `and both edges sit at SAB_EDGE, 0.75` · `a loaded field emits saboteurs, 0` |
| 3 | key Dramatizer on Surprise | `no row of the 33 keys on surprise, Dramatizer` · `and Surprise is the only axis keying nothing, none silent` |
| 4 | drop `because` from the saboteurs | `every saboteur emitted carries a because` · `and every fetter in the row is named in the citation` · `and the citation states the band and the ramp value that produced it` |
| 5 | arithmetic mean instead of geometric | `a configuration with one fetter absent scores zero, not an average` · `and that holds on a three part row, where an arithmetic mean would have fired at 0.67` |
| 6 | retune the cascade off his measurement | `the cascade base is his measured 14.5 (15 vs 14.5)` · `one upstream distorted is his measured 43.2 (45 vs 43.2)` · `both distorted is his measured 71.9 (75 vs 71.9)` |
| 7 | resentment back onto Anger alone | `"resentment" lands on BOTH Anger and Apathy, 10 and 0` · `"resentful" lands on BOTH Anger and Apathy, 10 and 0` · `and every composite key is the ruled pair` · `and the citation says it is a composite` · `and Aggressor and Manipulator both appear, which is the collapse it was ruled to fix` |
| 8 | empty `offer`, the payload | `so offer is not empty, 0` |
| 9 | remove the negation lookback | `and its denial does not` · `and a denied avoidance does not fire Courage` |
| 10 | raise the Avoider weight to 1 | `Avoider is held low on the ruling, undefined` · `and a dead centre Avoider scores under a dead centre Escapist, which is the ruling` |

**Break 7 is in this table twice over, because the first version of it did not
fire properly and that is the more useful entry.** The composite test read only
`resentful`. Breaking the `resentment` key left the behavioural assertion green,
because the other six keys still carried Apathy and the reading looked intact.
**A guard that passes while the thing it guards is broken is worse than no
guard.** The test exercises every key in `LEXCOMP` now, and doing so immediately
found three keys the scanner could not reach at all: `grudge`, `begrudge` and
`embittered` were in the composite table and in no lexicon entry, so each scored
0 and 0 while the table asserted it was a composite. That defect was found by
tightening a test, not by reading code.

## WHAT ELSE THE GROUP ASSERTS

- **The port, against a second transcription.** 33 rows, no duplicate name, every
  band ordered and inside 0 to 10, exactly four three-fetter rows, exactly one
  single-fetter row and it is Innocent.
- **No dead rows in `LEXCOMP`.** `lexComposite()` reports what it could not seat
  and the gate fails on it, so a future unreachable composite word gets ruled
  rather than sitting in the table looking live. It also asserts the seat was
  unanimous and that the seat and amount were derived off the table rather than
  typed.
- **The coverage report.** All 21 laws keyed, four keyed bidirectionally, nature
  and human nature reported as **zero** coverage rather than omitted, the four
  missing files named, five of ten expression elements keyed and the other five
  reported absent, and not every circle keyed. An aggregate hides a hole, so the
  gate asserts the hole is reported.
- **Depth refuses to guess.** Reads null on ordinary text, names the four circles
  it cannot key, fires C8 on warmth that needed an audience, and **does not** fire
  C8 on warmth that cost something without one.
- **The pole collision.** Asserted to exist, so it cannot be quietly forgotten
  before it is ruled.
- **Determinism and purity.** Re-reading the same story gives back the same
  contract, the three original functions are still present, and reading a story
  through the contract leaves `S.charge` untouched.

## FAILURE MODES, NAMED

**The one that would do the most damage.** No subject handling. "she lied to me"
fires Truth on the writer. Guard 2 says never score another person and the scan
has no subject model at all, so this is the only place in the output where the
guard is at genuine risk rather than satisfied by absence of a mechanism. It is
the highest value thing left on this layer.

**Second.** The law cues are a floor derived from the words the spec happens to
print, because `reviews/elements.json` is not in this repository. Recall is
unmeasured and unmeasurable without a labelled set. Nothing in the law layer may
be called accurate.

**Third.** The ramp does not improve set agreement on the population this
repository has. It buys resolution, thirteen times finer, and steadiness, about a
tenth. Anybody reading "band edges are ramps" as a recall improvement will be
disappointed by the measurement, and the measurement is in
`proto/sniffer/ramp.js` rather than in a claim.

**Fourth.** `EXPRCUE` duplicates a concept `EXPR` already names, with different
shadow words, because moving `EXPR` moves surfaces this pass did not measure.
Two tables now name one thing. It is a debt and it is written down.

**Fifth.** The legacy path is half moved. `core.js sab33Detect` reads the new
bands with the old staircase, and `applyStory` still routes resentment onto Anger
alone. The contract is right and the field is not yet, which means two parts of
the product can disagree about the same story.

## WHAT IT WOULD TAKE TO EVALUATE THIS HONESTLY

In cost order, and **the privacy ruling is checked first rather than last.**

**Nothing in this pass reads a name, a record or anything off a device.** It is a
pure function of text already in the person's own browser, with no host access,
and the build asserts the engine is host free. The ruling permits everything
built here. **It does not obviously permit the evaluation**, and that is the
binding constraint rather than the effort.

1. **A labelled set, and it cannot be built by this seat.** 200 journal entries,
   two independent raters per entry marking axis, law and direction, inter-rater
   agreement measured **before** the matcher is scored against it. The raters may
   not be the authors of the tables. Without this, every number in the law layer
   is a coverage figure and not an accuracy figure, and none of them may be
   presented to a person as confidence.
2. **His cohort, for the 94 and 73.** The spec's headline band-edge measurement
   cannot be reproduced here. Uniform random fields are not a cohort and the 14
   stated profiles are stated rather than sampled, so they are not a validation
   set and are not called one.
3. **A subject-tagged sample**, for guard 2. Entries where the writer describes
   another person's behaviour, labelled for who acted, so subject blindness can
   be measured rather than assumed to be rare.
4. **The owner's ruling that a labelled corpus may exist at all.** A labelled set
   of journal text is the most sensitive artefact this product could hold. The
   ruling that the story without the record is what refines the models is exactly
   what makes it possible, and it still needs consent language and his explicit
   permission before a single entry is collected.

**And one thing that is not learnable from this data, stated plainly.** Whether a
saboteur reading is *correct* is not learnable from journal text alone, at any
sample size, because there is no ground truth in the data and the construct is
defined by the canon rather than by an outcome. What **is** learnable is whether
the reading is stable, whether it is reproducible, whether it agrees with a
practitioner, and whether a person accepts it. Those are four different questions
and only the first two can be measured without asking anybody anything.
