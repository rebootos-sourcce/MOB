# THE LEAN. BENIGN AND MALIGNANT, AS TWO CHANNELS

Owner's instruction, close to verbatim: "build a system for benign and
malignant. Include the sniffer that listens for these words. We are looking
for a lack of empathy or empathy, lack of accountability or accountability.
Work this into our algorithm for our sniffer so that we can now start to track
people's benign and malignant behaviour as well."

This is the AI, machine learning and algorithms seat. Everything below was
measured on this repository rather than reasoned about, and where a number is
quoted the command that produced it is given.

## THE SHORT VERSION

The one thing to read if nothing else. On the code that was shipped, three
plain accounts of being harmed read 67, 60 and 51 of 100 malignant. An account
of a person refusing all responsibility for harm they caused read 36. **The
person who did nothing wrong scored up to 1.9 times worse than the person
refusing their own part.** That was not a hypothetical, it was the behaviour of
the build, and it is the reason this document is long.

The same six texts now read 28, 28, 28 against 45.9, with an unread field
sitting at 28. The blame language in the harm accounts is still counted. It is
the frame that holds it, not a shorter list.

## WHAT ALREADY EXISTED, AND WHAT IS NAMING WORK

Roughly half of this was built. Verified rather than taken on trust, by
loading `engine.js` in node and reading the objects.

| Thing | State before this pass | Verified by |
|---|---|---|
| `LEANCUE` | real, 21 benign phrases and 20 malignant | counted off the parsed source |
| `leanScan`, `leanApply` | real, accumulating into `LEANMIX` | called directly |
| `leanRead(r)` | real, blending story against field malignancy | called directly |
| trust weight capped at 0.62 | real, `Math.min(0.62, tot*0.09)` | read and exercised |
| `p.gates.lean` persistence | real, through `gatesSave` and `gatesLoad` | round tripped |
| `compute()` returning `benign` and `malig` | real | called |
| `engine/birth.js` reading them | real, three sites | grepped and read |
| Two channels | **did not exist.** one axis, mixed | the list itself |
| Tracking over time | **did not exist.** `snapshot()` carries no lean | measured, below |
| Any gate on the lean beyond four assertions | **did not exist** | `tests/engine.js` group 8 |

So: the plumbing is his and it was already there. **The naming work is calling
the existing single axis what it is.** The new work is the second dimension,
the lexicon, the frame gate, the negation and precedence rules, the series, and
the gate.

One correction to the brief this seat was given: `snapshot()` carries fifteen
fields and not fourteen. Read off the run, `Object.keys(E.snapshot(p)).length`.

## THE TEN PASSES, AND WHAT EACH ONE CHANGED

Not ten readings of the same thing. Ten passes, each of which changed the
design, in the order they happened.

**Pass 1. Measure what exists.** Produced the table above. Changed the scope:
this is not a build from nothing, it is a second dimension on something
working, so every existing body and signature stays.

**Pass 2. Reproduce the failure before touching it.** Wrote a probe, checked
it against a known good case in both directions first, then ran three harm
accounts. 67, 60, 51 malignant against 36 for a deflection account. Changed the
design from "extend the lexicon" to "the lexicon is not the problem".

**Pass 3. Audit all forty one phrases one at a time.** Found four separate
mechanical defects, each reproduced at the command line:

- `it was not my fault` scored **1 benign**. `my fault` was a benign cue and
  the scanner used a bare `indexOf`, so a denial of fault read as taking it.
- `let them think i did not know` scored **1 benign and 1 malignant**. `let
  them` was benign, `let them think` was malignant, and with no precedence
  rule both matched the same words.
- `she made me realise i was wrong` scored **1 malignant**. `made me` matched
  inside `made me realise`.
- `i should have known better` scored **1 malignant**. `should have known` has
  no subject, so self blame and other blame landed on the same number, which
  is incoherent on the system's own terms.
- `let it go` moved **two instruments**: it was a benign lean cue and a
  detachment cue on the six gates, so one phrase in one sentence changed the
  lean and the cost multiplier on every held pattern.

Changed the design: precedence and negation are mechanisms, not more phrases.

**Pass 4. The research.** Sources below. The single most important finding
changed the accountability list: following LIWC literally would have broken
this. Pennebaker's expressive writing result is that rising causal and insight
words track improvement, so `because i was` and `i realised` look like obvious
accountability entries. They are not accountability, they are insight, and
"because I was eleven" and "I realised he was never going to change" are
insight about being harmed. Worse, the accountability list feeds the frame
gate, so a wrong entry there opens the lack side on a harm account. All bare
causal and insight forms were cut; only forms naming the writer's own act
survived.

**Pass 5. Sort the existing list into the two channels.** Result: a good
number of the forty one belong to neither. `reached out` and `asked for help`
are contact. `put it down` and `let it go` are release, which the six gates
already read. `showed up` is attendance. **16 shipped phrases were removed from
scoring, each with a written reason in `LEANOUT`**, which is the number that
can be checked by reading `E.LEANOUT.length` rather than by counting by hand.
Five of the shipped benign phrases and two of the shipped malignant ones do not
survive in any form at all: `let it go`, `asked for help`, `reached out`, `put
it down`, `showed up`, `should have known` and `proved them wrong`. Changed the
design: `LEANOUT` exists, because a phrase removed with no reason is a phrase
somebody puts back.

A hand count went into an earlier draft of this paragraph and was wrong. It was
replaced by a number read off the run, which is this repository's own rule and
the reason it is mentioned rather than quietly fixed.

**Pass 6. The frame gate.** The diagnosis is that reporting and deflecting use
identical words and a matcher cannot separate them from the phrase. Rejected
per phrase classification as undecidable. Chose an agency ratio at document
level. The decisive property, and the reason this shape was chosen over the
alternatives: **the safety does not depend on the harm list being complete.**
With no self agency evidence the admitted fraction is zero whatever the harm
list holds. An incomplete list costs a missed deflection, never a survivor
called malignant.

**Pass 7. Build the four lists.** 269 scored phrases, 103 frame markers.

**Pass 8. First run, and a hole in the negation.** The deflection account
opens "None of it was my fault" and scored **1 accountability taken**. Fixing
`not my fault` by precedence works only because that exact string is in the
table; it does not generalise. Added a negator window of three words. Changed
the design from a table fix to a mechanism.

**Pass 9. Second run, and the negation window crossing a sentence.** The
ownership account lost one of its four self action cues: "I said things I
cannot take back. I lied to her" put `cannot` within three words of `i lied
to`, because the normaliser strips every mark to a space. Changed the
normaliser to keep sentence boundaries as a bar the look back stops at, which
also stops a phrase matching across two sentences.

**Pass 10. Third run, and the two mechanisms fighting.** "None of it was my
fault" still scored 1 accountability. The negated long match `it was my fault`
was merely dropped, which left `my fault` inside it free to match. Negation on
the long form was being defeated by the short form. A voided match now consumes
its span. This one is the reason the gate has a table driven nested pair check
rather than one example: there are 18 nested pairs in the table and any of them
could have done the same thing.

Then the gate, and eight deliberate breakages to prove it fires. Those are
below.

## THE CHANNELS

Two dimensions, four counts. Counted separately and summed afterwards, so the
reading can say which one moved.

| Count | Channel | Direction | Gated | Phrases |
|---|---|---|---|---|
| `emp` | empathy | shown | no | 88 |
| `empLack` | empathy | lack | **yes** | 72 |
| `acc` | accountability | shown | no | 49 |
| `accLack` | accountability | lack | **yes** | 60 |

269 scored phrases, against 41 before. Plus 63 harm frame markers, 40 self
action markers, 16 removed phrases with reasons, and 11 negators. 372 entries
in the tables in total.

Presence and lack are separate counts and not two ends of one number, because
absence of blame is not the same evidence as presence of ownership and they
have to be able to disagree.

`LEANCUE` still exists with its old two way shape and its old name, and is now
derived from the four channels rather than authored, so it cannot drift from
them the way the hand written pair did.

## THE LEXICON, AND HOW A PHRASE WAS DECIDED

The rule applied to every entry: **a phrase earns a place on a channel only if
it names the act rather than reports another person's act, and only if it
carries a direction on its own.** Anything that failed either test went to
`LEANOUT` with the reason written next to it, or to the frame lists.

### Empathy shown, 88

Built on the three communication mechanisms in the EPITOME framework for
assessing empathy in text, which separates emotional reaction, interpretation
and exploration, plus the prosocial behaviour category LIWC-22 added. Every
entry names another person, because empathy is directed and a phrase with no
object is not evidence of it. That test alone cut `stayed with` from the
shipped list: the object can be a person or a sensation.

### Empathy withheld, 72, gated

Contempt first, because contempt is the one construct in this document with a
measured predictive record: in the Gottman observational work it is the single
strongest predictor of divorce, ahead of criticism, defensiveness and
stonewalling. Then dismissal of another's state, the moralization category
LIWC-22 added, overgeneralisation, and retaliation.

Phrases drafted here and cut on the harm test: `grow up`, because a survivor
writes "I had to grow up fast"; `get over it`, because a survivor writes "I
could not get over it"; `so stupid` and `how stupid`, because those are
overwhelmingly self directed.

### Accountability taken, 49

Ownership, repair, and causal self reference restricted to the writer's own
act, for the reason given in pass 4. `i should have` and `i could have` are
**not here**: the trauma literature distinguishes behavioural self blame, which
can be adaptive, from characterological self blame, which is associated with
shame and worse PTSD outcomes, and a matcher cannot tell them apart. Since this
list feeds the frame gate, a wrong entry is expensive in the one direction that
matters.

### Accountability refused, 60, gated

External stable attribution, after the dimensions the Leeds Attributional
Coding System codes; defensiveness, which in the Gottman work is claiming
oneself blameless and deflecting back; counterfactual blame; concealment; and
score keeping. The two that most need the gate are concealment and score
keeping: "I did not tell anyone" is survival in a harm account, and "they owe
me those four years" is an accurate moral claim.

### Sources

Full text fetch was blocked by the network proxy for several of these, so what
was read was the search index summary and not the paper. That is stated rather
than hidden, and it is a real limit on how much weight these should carry.

- LIWC-22 dictionary development and psychometrics, Boyd, Ashokkumar, Seraj
  and Pennebaker. Categories used here: prosocial behaviour, politeness,
  interpersonal conflict, moralization, and the pronoun and cognition
  categories. https://www.liwc.app/static/documents/LIWC-22%20Manual%20-%20Development%20and%20Psychometrics.pdf
  *(index summary only, direct fetch blocked)*
- LIWC2015 development and psychometric properties, Pennebaker et al.
  https://www.researchgate.net/publication/282124505_The_Development_and_Psychometric_Properties_of_LIWC2015
- Equivalence study of LIWC2015 across four languages, on closed vocabulary
  word counting and its limits.
  https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2021.570568/full
- Pennebaker and Chung, expressive writing, emotional upheavals and health.
  The causal and insight word finding, and the pronoun switching finding.
  https://c3po.media.mit.edu/wp-content/uploads/sites/45/2016/01/PennebakerChung_FriedmanChapter.pdf
- Emotional and physical health benefits of expressive writing, Baikie and
  Wilhelm, Advances in Psychiatric Treatment.
  https://www.cambridge.org/core/journals/advances-in-psychiatric-treatment/article/emotional-and-physical-health-benefits-of-expressive-writing/ED2976A61F5DE56B46F07A1CE9EA9F9F
- A computational approach to measure empathy and theory of mind from written
  texts. Uses a trained model on expert annotated diaries, not a dictionary.
  https://arxiv.org/abs/2108.11810 *(index summary only, direct fetch blocked)*
- Empathy identification systems are not accurately accounting for context,
  EACL 2023. https://aclanthology.org/2023.eacl-main.123.pdf *(index summary
  only, direct fetch blocked)*
- The EPITOME framework, Sharma et al., three communication mechanisms in
  text based support. Summarised in
  https://arxiv.org/pdf/2501.14981 and https://arxiv.org/pdf/2311.00721
- Gottman, the four horsemen, and contempt as the strongest single predictor.
  https://www.gottman.com/blog/the-four-horsemen-recognizing-criticism-contempt-defensiveness-and-stonewalling/
- Leeds Attributional Coding System, Stratton and colleagues, for coding
  attributions in natural speech along internal, stable, global and
  controllable dimensions.
  https://sk.sagepub.com/dict/edvol/essential-guide-to-qualitative-methods-in-organizational-research/chpt/attributional-coding
- Trauma attributions: internal, stable and global attributions associated
  with shame and PTSD severity, and the behavioural against characterological
  distinction. https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9667339/ and
  https://pubmed.ncbi.nlm.nih.gov/37569070/ and
  https://pubmed.ncbi.nlm.nih.gov/29924426/
- We-talk in couples, and the finding that "we" can indicate shared identity
  or strategic avoidance of personal accountability. The reason no bare
  pronoun is scored here.
  https://onlinelibrary.wiley.com/doi/10.1111/pere.12463
- Automated blame attribution, for what the state of the art actually is: a
  supervised transformer over 90,000 labelled comments, not a keyword list.
  https://www.sciencedirect.com/science/article/abs/pii/S0747563225000743

**Unsourced, and marked as such.** The specific phrasings in all four lists
are this seat's own English, chosen to match the constructs above. No validated
phrase list for these constructs in first person journal writing was found, and
if one exists it was not reached. The frame gate, the weight of 2, the trust
half life of 12 and the channel floor of 2 are engineering judgements argued
below and are not taken from any paper.

## THE ARITHMETIC

Per story, in order.

**1. Normalise.** Lowercase. Full stop, question mark, exclamation, semicolon,
colon and line break become a bar. Everything else that is not a letter, an
apostrophe or a space becomes a space. The bar is a boundary no phrase can
contain and no negation can cross. A comma is left as a space on purpose: it is
too weak a break to end a negation.

**2. Match, longest first, non overlapping.** Every phrase from every list,
sorted by length descending, matched bounded by spaces. A match consumes its
span and blocks the shorter phrases inside it. Ported from `scanStory`,
including the reason its window is length plus one and not length plus two.

**3. Negate.** A match is void if a negator stands within the three words
directly before it, stopping at a sentence bar. **A voided match still consumes
its span**, which is what stops the short form inside it from matching.

**4. Count the four channels and the two frame sides.**

**5. Gate the lack side.**

    self  = self action markers + accountability taken
    other = harm frame markers
    admit = self <= 0 ? 0 : self / (self + 2 * other)

**6. Per story totals.**

    benign    = emp + acc                  a count
    malignant = (empLack + accLack) x admit   a weight, not a count

**7. Blend with the field, which is unchanged in shape.**

    trust = 0.62 x cues / (cues + 12)
    mal   = fieldMal x (1 - trust) + storyMal x trust

### Every weight, and its reason

| Number | What it is | Why |
|---|---|---|
| `LEAN_FRAME_W` 2 | one harm frame marker outweighs two agency markers | the asymmetric cost. a false positive on the lack side is the one error this product cannot afford, so the threshold follows from that and not from a balanced score |
| `LEAN_TRUST_CAP` 0.62 | the story never carries more than 62 of 100 of the reading | his cap, kept as it was |
| `LEAN_TRUST_HALF` 12 | matched phrases to reach half the cap | it was seven phrases for the **whole** cap, which is a great deal of confidence from seven substring matches. the ramp is asymptotic now, so the cap is approached and never reached |
| `LEAN_MIN_CH` 2 | below this a channel reports `read: false` | refusing to read is a legitimate answer and it is the right one more often than the old code allowed |
| `LEAN_NEG_W` 3 | words of negation look back | three is one clause of run up. wider started voiding phrases whose negator belonged to the sentence before, which is what the sentence bar now also prevents |

The trust change costs something and it should be said: the ownership account
moved from 20.0 to 22.2 malignant, slightly **worse**, because six matched
phrases now buy less confidence than three used to. That is the honest
direction. Less confidence from few cues means the field speaks for more of the
reading, and the field for that profile sits at 28.

## THE HARM TEST

Six accounts. Three of real harm in plain language, a fourth written by this
seat as the hardest case it could construct, one of a person who did harm and
owns it, and one of a person refusing it. The last two are there because a
system that reads nothing is a different failure, not a fix.

Method: `engine.js` loaded in plain node, `gatesClear` then `leanApply` then
`compute` then `leanRead`, a blank field per account. The probe was checked
against a known good case in both directions before any number off it was
believed, and it refuses to run if that check fails. The shipped column was
measured the same way against the previous build of the engine, restored from
git, built, run, and put back. It is not quoted from anywhere.

| Account | What it is | Shipped | Now | Lack cues | Admitted | Frame |
|---|---|---|---|---|---|---|
| Bullied at work | a person describing being bullied | 67 | **28.0** | 6 | 0.00 | 0 acting, 3 acted upon |
| A parent | a person describing a parent | 60 | **28.0** | 3 | 0.00 | 0 acting, 4 acted upon |
| An assault | a person describing an assault | 51 | **28.0** | 3 | 0.00 | 0 acting, 7 acted upon |
| Coercive control | the hardest case this seat could write | 41 | **29.4** | 5 | 0.38 | 1 acting, 6 acted upon |
| Doing harm, owned | taking responsibility for harm caused | 20 | 22.2 | 0 | 0.00 | 4 acting, 0 acted upon |
| Doing harm, refused | refusing their own part | 36 | **45.9** | 8 | 8.00 | 1 acting, 0 acted upon |
| *a field with no story at all* | *nothing entered* | *28* | *28.0* | *0* | *0.00* | *none* |

Read the third and fourth columns together. Three of the four harm accounts
now read **exactly** what a field with no story at all reads, and the fourth
reads 1.4 points above it. Their blame language was still counted: six, three,
three and five refusal cues. The gate admitted none of the first three and 0.38
of one cue in the fourth.

The ordering is now right in both directions. Deflection is the highest at
45.9. Ownership is the lowest at 22.2. Every harm account sits between them and
within 1.4 of an unread field. On the shipped code the ordering was inverted:
the bullying account at 67 was the most malignant text in the set.

The fourth account is the one worth arguing about. It is coercive control
written with heavy blame language, one genuine act of the writer's own in the
middle, and self blame mixed in. It moved 1.4 points, driven by one self action
cue against six harm markers, admitting 0.08 of five refusal cues. That is the
gate working rather than the gate being switched off, and it is the case that
should be watched if the weight of 2 is ever changed.

**The residual risk, named.** A person describing harm who also names one
thing they did opens the gate a little. That is correct behaviour for a
deflection and wrong for a survivor who is being honest about their own part,
and the two are the same text. The ratio and the cap keep the cost to about a
point. This seat does not know how to do better without a parser, and would
rather say so than pretend the case is closed.

## WHAT THIS IS NOT, AND THE CONSTRAINT THAT IS NOT MINE TO RELAX

A word matcher that reports a person as malignant is a verdict on a person
derived from a keyword count. The standing rulings forbid exactly that: never a
diagnosis, never a verdict, throughput and not outcome. This is not a caveat at
the bottom of the document, it is the reason the design has the shape it has,
so it is argued rather than mentioned.

**Why a keyword count cannot carry a verdict about a person.** Three separate
reasons, each of which is sufficient on its own.

1. **It measures an account, not a life.** A person writes one story about the
   worst week of a decade. The instrument sees the week.
2. **Closed vocabulary counting has known, documented failure modes** on
   negation, irony and context, which is why the automated blame attribution
   literature uses supervised classifiers over labelled corpora and not
   dictionaries. This product cannot use one of those, for the privacy reason
   below, so it has to be honest about being the weaker instrument.
3. **The construct is not stable across the two acts that produce the same
   words.** That is the whole of the frame problem and it is not solved here,
   it is bounded.

**Why the clinical direction matters and not only the product one.** The
trauma literature is not neutral on this. Internal, stable and global
attributions for trauma are associated with shame and with PTSD symptom
severity, and Cognitive Processing Therapy exists in part to dismantle them. A
system that rewards "my fault" and penalises "their fault" on a harm account is
rewarding the exact cognition the clinical work treats. So the shipped
behaviour was not merely unkind, it pointed the wrong way on its own terms.

**What is defensible.** The reading is about what an account does, not what a
person is. `leanRead` reports a direction of travel for a story against a
field, and it reports refusal to read as a first class answer rather than as a
zero. `benign` and `malignant` are his words and they are right as internal
names. **What a surface says to a person is his call and not this seat's, so no
surface copy naming a person malignant is shipped here.** It is raised as a
question below.

## TRACKING IT OVER TIME

"So that we can now start to track people's benign and malignant behaviour."
Nothing did.

**No field was added to `snapshot()`, and the reason is measured rather than
assumed.** `validateProfile` rebuilds every history entry from a whitelist at
`atuned_src/engine/schema.js`, keeping four strings and eleven numbers by name.
Measured:

    written  keys: 16   t,cq,dq,...,arch,lean
    ok: true
    returned keys: 15   t,dark,tier,arch,cq,...,ch
    lean survived: false

Sixteen fields written, fifteen returned, `lean` dropped, and the validation
returns `ok: true`, so nothing anywhere reports the loss. A number that looks
stored and is not is the exact defect this repository has been bitten by
repeatedly, so it is not being shipped. The one line that would fix it is in a
file this seat was told not to edit, and it is named in the questions below.

**What was built instead, which needs no schema change at all.** `malig` is a
function of `CQ`, and every snapshot already carries `cq`, so the field's own
lean at every point on the record is recoverable exactly. `leanSeries(p)` in
`atuned_src/engine/verp.js` returns that series, counted against the history
length, and it states on itself that the story cue half is not in the record
rather than drawing a line through numbers it does not have.

So there is a direction line today. It is one of the two halves, and it says
which half it is.

## THE GATE, AND THE PROOF IT FIRES

Group 31 in `tests/engine.js`, additive. Nothing existing was changed.

**Group 31 adds 75 assertions.** That is the stable number: the engine gate
stood at 843 before it and 914 after, measured on the same tree minutes apart.
The repository total is not quoted here on purpose. Other seats are landing
groups in the same file while this is written, and it reached 960 within the
hour, so a total typed into this document would be wrong before it was read.
Read the total off the run.

A check that has never failed is not yet a check. Every mechanism was broken on
purpose, the gate run, and the file put back. All eight fired, each on the
assertion meant to catch it.

| Breakage | Result |
|---|---|
| `leanAdmit` always returns 1, the frame gate removed | **11 failed**, including all three harm accounts reading malignant and the persistence assertion |
| negation guard removed | **2 failed**, the generalised negator and the negated frame marker |
| a voided long match no longer consumes its span | **3 failed**, including `17 of 18 nested pairs do not resolve` |
| `gatesClear` zeroes the two sums by name, as it used to | **8 failed**, including `clearing zeroes every key of the mix, 8 survived: emp` |
| `let it go` put back on the benign list, as shipped | **1 failed**, `let it go is lean.emp and verp.detach` |
| the same phrase placed on both sides | **1 failed**, `i forgave in emp and accLack` |
| the raw lack count persisted instead of the admitted weight | **2 failed**, the reading went from 28 to 34.4 on a reload |
| the sorted phrase cache keyed on a bare null, ignoring its input | **1 failed**, a phrase added to a table looked like it landed and had no effect |

The last one is worth naming. The frame is not in the profile and cannot be
reapplied on the way back in, so if the raw count were written a harm account
would pass the gate on the way out and fail it on the way back. `gatesSave`
writes the admitted weight for that reason.

Assertions worth knowing about, because they are the ones that hold the design:

- the three harm accounts are asserted as **behaviour and ordering**, not as
  numbers, so tuning a weight does not fail the gate and inverting the reading
  does.
- each harm account is also asserted to have **counted its blame cues**, so
  nobody can pass this gate by deleting phrases from the table.
- the nested pair check is **driven off the table**, so a pair added later is
  covered without anybody remembering to add a case. There are 18 today.
- `leanApply` is asserted to move **no number in the arithmetic**. The lean is
  a read and never an input, which is what makes it impossible for this work to
  change a single CQ in the product.
- `gatesClear` is asserted to zero **every key** of the mix by iteration, so a
  key added later cannot be forgotten and leak between two people's stories.

`VERPCUE` and `VERPMULT` were added to the engine contract so the gate could
reach them. They were browser globals with no test able to see them, which is
the condition this repository already records as how six broken intake
questions shipped.

## HOW THE GATES WERE RUN, AND ONE RED THAT WAS NOT MINE

This was built in a tree several seats are writing to at the same time. It is
worth recording because it changes how a gate result should be read.

- HEAD moved four commits during this pass and another seat's commit swept
  these files in before they were finished. The first `tools/equiv.py` run was
  therefore a comparison of HEAD against itself and reported nothing. It was
  re-run against the last commit that does not contain `LEANCH`, which is the
  honest baseline, and then reported 18 new declarations, all named `LEAN` or
  `lean`. **The tool was not lying, the baseline was wrong.** Worth saying
  because this repository already records three probes that reported their own
  bugs, and the instinct to blame the tool first is the wrong one.
- `./atuned_src/BUILD.sh` went red once with `div balance -1, not 0`. It was
  not this work: nothing here touches markup. `find atuned_src -newermt '-3
  minutes'` named `atuned_src/ui/cone.js` and `atuned_src/shell/head.html`,
  both being written by another seat at that moment, and the build was green on
  the next run. A gate that goes red on somebody else's half written file is
  still a red gate and it is recorded here rather than quietly re-run.
- `tests/design.js` went red the same way, and harder: `classes with no CSS
  rule: cone-read, cone-rec` plus five `the Field still animates under <theme>`
  failures. Attributed rather than assumed. Those two class names grep to
  exactly two lines, `atuned_src/ui/cone.js:784` and `:785`, in a file
  `find atuned_src -newermt '-20 minutes'` lists as being written right now,
  alongside `ui/wheel.js`, `ui/component.js` and `shell/head.html`, which are
  where the Field's animation lives. **This work adds no CSS rule, no class, no
  DOM and no canvas code at all**, which is checkable from the diff: it is
  `engine/verp.js`, `engine/export.js` and `tests/engine.js`. It was green at
  105 of 105 earlier in the same session on the same lean code.
- `tests/engine.js` reads a different total every hour as other groups land.
  This is why the number this document commits to is the 75 assertions group 31
  adds and not a repository total.

The honest summary: **every gate this work is capable of affecting is green,
and the two that went red are other seats' in flight files, named above with
the evidence.** Whoever integrates should re-run the full set against a settled
tree rather than take this paragraph as the last word.

## WHAT IT COSTS

- **Engine size.** `atuned_src/engine/verp.js` goes from 102 lines to 584.
  `engine.js` gains 18 top level declarations, every one of them named `LEAN` or `lean`, which `tools/equiv.py` reports as a named diff against the last commit before this pass. The built `source.html`
  grew by about 36 kilobytes on a 1.38 megabyte file.
- **Runtime.** One pass over the normalised text per phrase, 372 phrases,
  longest first. `tests/engine.js` still runs in well under a second. Nothing
  here is on a render path: `leanApply` runs once when a story is committed.
- **Recall on the lack side is deliberately reduced.** A deflection account
  with no self action phrase in the table reads nothing. That is the chosen
  direction of the asymmetry and it is not free.
- **Maintenance.** 372 table entries are 372 things that can be wrong. The
  gate covers the mechanical failures. It cannot cover a phrase being on the
  wrong channel, and nothing can except reading them.
- **No number in the product moved.** Asserted, not assumed.

## THE QUESTIONS. HIS CALL, NOT MINE

He has instructed every team to ask rather than guess, so these are asked.

1. **What does a surface say to a person?** `benign` and `malignant` are the
   right internal names and they are unusable as copy. "Your accountability is
   34 of 100" is a verdict on a person derived from a keyword count and this
   seat will not ship it. The alternatives worth ruling between: say nothing at
   all until there is more evidence; say it about the story only, in the past
   tense, naming the phrases; or show only the direction over time and never a
   level. The third is the safest and the least useful.

2. **May the history whitelist gain one line?** The exact change is in
   `atuned_src/engine/schema.js`, in the `o.history` block, adding `lean` to
   the list it rebuilds each entry from. Without it, a lean field on a snapshot
   is dropped silently at the next read off the disk. This seat was told not to
   edit that file and would rather ask than widen its own scope.

3. **Should the channel split persist?** `p.gates.lean` accepts two numbers.
   Persisting four would show which channel moved across sessions instead of
   only within one. Same file, same ruling needed.

4. **Is the frame gate's asymmetry set where he wants it?** `LEAN_FRAME_W` is
   2, chosen so a false positive on the lack side costs more than a miss. At 1
   the coercive control account moves further and one more deflection shape gets
   caught. At 3 the instrument is quieter still. This is a product decision
   wearing a number, and it is his.

5. **Does the lean ever reach the arithmetic?** It does not today, by design,
   and the gate asserts it. If it should move CQ the way the six gates do, that
   is a separate ruling and it needs the evaluation question below answered
   first.

6. **How would this ever be evaluated honestly?** There is no labelled set and
   there will not be one, because the privacy ruling forbids holding the record
   joined to the story. What is possible without breaching it: the story
   without the record can be read, so a small set of journal entries could be
   hand labelled by two people for the four channels and the frame, inter rater
   agreement measured, and the matcher scored against it. That is the only
   honest route this seat can see. It needs consent language, it needs somebody
   other than the author of the lists to do the labelling, and it needs the
   owner to rule that it is allowed at all. **Checked first rather than last:
   nothing in this pass reads a name, a record or anything off a device. It is
   a pure function of text that is already in the person's own browser, so the
   privacy ruling permits what was built here. It does not obviously permit the
   evaluation.**

7. **A field with nothing entered reads 28 of 100 malignant.** That is not
   this seat's code, it comes from `compute()` deriving `malig` from `CQ`, and
   `compute.js` was out of scope. But it means the default state of a person
   who has typed nothing is a little under a third malignant, and both surfaces
   that print a reading silence themselves on `r.unread` precisely because of
   this class of problem. Worth a look by whoever owns `compute`.

## WHERE THE CODE IS

- `/home/user/MOB/atuned_src/engine/verp.js` the whole of it
- `/home/user/MOB/atuned_src/engine/export.js` the new names on the contract
- `/home/user/MOB/tests/engine.js` group 31, appended
- `/home/user/MOB/proto/lean/lean.html` the standalone page, engine inlined
- `/home/user/MOB/proto/lean/lean.src.html` and `build.js` and `build.sh` what makes it
- `/home/user/MOB/proto/lean/accounts.json` the six accounts, one copy, shared
- `/home/user/MOB/proto/lean/harm-probe.js` the harm test, runnable, refuses to
  run if its own known good check fails

The prototype runs the engine that is in the build rather than a copy of it, and
prints the md5 of the engine it was built from, so a page that has drifted says
so instead of looking current.
