# Copy objections

**This file is a build product. Never edit it.** The source is
`.claude/skills/atuned-voice/objections.json` and the renderer is
`tools/objections.py`. `COPY-OBJECTIONS.html` is the same content for
reading rather than for diffing.

His ruling, and it is why this exists:

> create a log of all the times I said I do not like this copy type.
> Create a database, sweep for it, and kill it. And add that to the
> style guide.

Run the sweep:

    python3 .claude/skills/atuned-voice/check.py --objections

It exits non zero on a finding at a severity that stops a build. Every
other mode of that gate enforces the same rules, so there is one set of
rules and one place they live.

    commit cff2675, tree dirty   database md5 53d3f3e9c71f
    24 objections logged, 19 of them with a quotation on record
    18 rules, 7 with patterns in the database, 11 held by a gate elsewhere
    10 more objections are guidance, because no check can express them
    2 findings on this run, 2 at a severity that stops a build

---

## The log

His wording, unsmoothed. Where a class is inferred rather than quoted,
the entry says so and says from what.

### CO-01. A figure printed with a tolerance stapled to it. Analytics, the lower right of the reading.

> Get rid of where it says 50 in the lower right hand corner, is accuracy of 100 plus or minus 12.

    where    TASKS.md:143, KN2
    when     21 September, twenty first pass
    quoted   verbatim
    rules    tolerance

### CO-02. A figure printed with an interval stapled to it. The compass polar and the compass drill.

> Where is this swing 11? Get rid of that.

    where    TASKS.md:140, KN1
    when     21 September, twenty first pass
    quoted   verbatim
    rules    tolerance

### CO-03. The whole class, not the two strings. Any figure carrying an interval, a tolerance or a statistical decoration.

> Like I said, do a sweep of text like that. 100 plus minus 12, swing 11. That shit has to all go.

    where    TASKS.md:146, KN3
    when     21 September, twenty first pass
    quoted   verbatim
    rules    tolerance, interval-word

He also ruled what replaces it, in the same breath: give a pill to the lower right side of the number of the coherence slider, like it oscillates within the person's range. The range is drawn, never stated.

### CO-04. Prose that hides behind a scale instead of saying something.

> There is some weird text that says the waist is 40 to 60 out of 100. First of all, I told you never to write text like that any more. Scrub the entire app, look for stuff like that. If you cannot use regular words to describe it, do not describe it. And 40 to 60 out of 100 does not give a lot of specific detail.

    where    TASKS.md:5578, TX
    when     20 September
    quoted   verbatim
    rules    scale-prose

It collides with CO-06 and CO-07, which say every number states what it is out of, and his ruling here wins: the point of that law was that a bare 13 means nothing, not that every figure should be dressed in a denominator.

### CO-05. A count against a total. A reading is not a score.

> every time you add that 11 of 12, why.

    where    FEEDBACK-log.md, owner, counts
    when     17 September
    quoted   verbatim
    rules    count-against-total

The ruling recorded with it: never print a count against a total unless the person is working through a finite list and the number tells them how much is left. Nine count lines were cut and two survive, intake progress and release queue position.

### CO-06. A number with no scale and no meaning beside it.

> you read 13 below the oscillating band. You read 13, what does that mean. Integrity 4.3, what does that mean. Coherence 13.

    where    TASKS.md:7844, AJ1
    when     recorded in the twelfth note
    quoted   verbatim
    rules    naked-number

### CO-07. A number with no unit. Handed to this seat as a standing job rather than as a task.

> 39 of what. We're not doing that anymore. Make sure that's copy editor. This is your job to make sure it's no longer happening.

    where    TASKS.md:8169, AR1
    when     recorded in the twelfth note
    quoted   verbatim
    rules    naked-number

### CO-08. A figure's label written as a sentence, and the same number said twice on one card.

> 85 days kept, of the 90 days on your record. Of the same 90 days. We should need a rule never to write shit like that. I don't even know why you have it. Instead of 85 days kept, just one word. Recurring, missed, active, streak.

    where    TASKS.md:2268, NW
    when     20 September, ninth pass
    quoted   verbatim
    rules    figure-label

### CO-09. A refusal sitting in a value slot, between two labels, so it reads as a sentence about the second label.

> the balance masculine feminine is broken. It says masculine, not enough held to read feminine. I do not understand what that bullshit means.

    where    TASKS.md:158, BM1
    when     21 September, twenty first pass
    quoted   verbatim
    rules    empty-state

The wording half is gateable and the slot half is not. The guidance entry refusal-in-value carries the part no pattern reaches.

### CO-10. A heading that is not a thing a person would say out loud.

> which day you keep it, I'm not sure what that word means. This goes again to our syntax. We need a sweep of the entire thing, of all the copy. Add that to the list. A copy sweep.

    where    TASKS.md:2291, CP
    when     20 September, ninth pass
    quoted   verbatim
    rules    none. Guidance, and not gateable

### CO-11. The register of the whole product. This is the objection the voice skill exists to answer.

> The writing needs to feel like it's exceptional and right now it feels like it's AI. I need all output content copy to feel like our team simulated it ten times before they gave us an answer. They all have persona backgrounds. We know the type of content they consumed and the writing styles they would have consumed within that content. So the AI should have a deep brain about how to write content for humans, especially if it makes micro rule sets about how it relates to its past history and content and what it's learned and how it's identified with certain styles and techniques. So that the end output is a ten instead of an AI six.

    where    TASKS.md:3206, VC
    when     20 September
    quoted   verbatim
    rules    none. Guidance, and not gateable

### CO-12. A document titled questions holding statements. A list that asks nothing cannot be answered.

> these do not look like questions from the team. It says Atuned questions, but there are no question marks here. These are just statements.

    where    TASKS.md:1045, QD1
    when     18 September
    quoted   verbatim
    rules    question-mark

### CO-13. A line written by the seat that found it, assuming everything that seat knows.

> I don't know what A2 kept is. I don't know what does the dot law move so U3 can exist. I don't know if the e loses rhythm. All these have no context. Give me context so I can answer them.

    where    TASKS.md:448, QC1
    when     18 September
    quoted   verbatim
    rules    none. Guidance, and not gateable

### CO-14. Copy placed over a graphic. Two sentences from the same session, recorded together in the log.

> I do not like text hovering over things unless I can read it. display information over the main feature is bad design, shrink it.

    where    FEEDBACK-log.md, owner, Field stage and gates
    when     17 September
    quoted   verbatim
    rules    none. Guidance, and not gateable

### CO-15. A node serial in a header meant for a person. The data model read out loud.

> Address 007 root, where in your programming are you adding that.

    where    FEEDBACK-log.md, owner, drill headers
    when     17 September
    quoted   verbatim
    rules    serial-to-a-person

### CO-16. A legend on a surface explaining the product's own model to somebody who did not ask.

> I'm not sure what that is. Get rid of it.

    where    TASKS.md:2354, RT7
    when     20 September, ninth pass
    quoted   verbatim
    rules    none. Guidance, and not gateable

### CO-17. The name of the mark, and its case.

> just call it sol, lowercase

    where    TASKS.md:6558, D18
    when     20 September
    quoted   verbatim
    rules    none. Guidance, and not gateable

He corrected himself in the same breath, and the record keeps both halves so nobody reinstates the first: "actually, it's called awareness." Awareness stands, lowercase, and sol is superseded.

### CO-18. A verdict about a person. The product says what is running, not what a person is.

> We are not judging anybody.

    where    DECISIONS.md:305, the register
    when     ruled, undated in the record
    quoted   verbatim
    rules    verdict

Recorded in DECISIONS.md as the owner's words. The ruling it settles: a label describing a PATTERN may be blunt, a label describing the WHOLE PERSON may not.

### CO-19. Punctuation, the count, and case.

> No em dashes. Anywhere. Including commit messages and documentation. Never say 108. The count stated to users is 112. Sentence case. No all caps UI copy.

    where    BIBLE.md, Voice
    when     settled, no quotation on record
    quoted   NO. Inferred from the record, see the note
    rules    em-dash, the-count, caps

INFERRED FROM THE RECORD, not quoted. BIBLE.md carries these as settled law and says it keeps his words where he gave them. These three carry no quotation, so the class is taken from the ruling and not from an utterance.

### CO-20. The category lexicon, the line that announces a thing is starting, and the reassurance against a fear nobody raised.

> Mechanical and precise. No soft wellness language. Short sentences. Physical metaphors only.

    where    BIBLE.md, Voice, and CLAUDE.md, Voice
    when     settled, no quotation on record
    quoted   NO. Inferred from the record, see the note
    rules    soft, preamble, reassurance

INFERRED FROM THE RECORD, not quoted. The reassurance half is the voice skill's own V12 and carries his one bounded exception, the welcome at ui/onboard.js:121, which is quoted in that file and stands.

### CO-21. A band word standing alone.

> A label this product puts on a person carries a definition, the behaviour it produces, and the direction out of it. A word like Severe with nothing attached is a judgement. The same word with those three is a reading.

    where    BIBLE.md, Voice
    when     settled, no quotation on record
    quoted   NO. Inferred from the record, see the note
    rules    none. Guidance, and not gateable

INFERRED FROM THE RECORD, not quoted. It is the team's proposal that he accepted, which BIBLE.md records as law.

### CO-22. Two words doing one job.

> One word per concept. A real distinction keeps its own word; held, installed and firing are three states and stay three words.

    where    BIBLE.md, Voice
    when     settled, no quotation on record
    quoted   NO. Inferred from the record, see the note
    rules    one-word-per-concept, empty-state

INFERRED FROM THE RECORD, not quoted. tools/terms.py is the gate that already holds it.

### CO-23. Content structure. A deck of identical cards is a list wearing a deck's clothes.

> The knowledge base was linear and boring.

    where    BIBLE.md:154, grades on record
    when     graded, in his words
    quoted   verbatim
    rules    none. Guidance, and not gateable

### CO-25. An offer stated in copy that the owner has ruled out.

> Two months free is out. The offer is not two months free. Any copy saying so is wrong and comes out.

    where    TASKS.md:6984
    when     ruled, recorded 20 September
    quoted   NO. Inferred from the record, see the note
    rules    two-months-free

Recorded as his ruling inside a list of them, so the wording is the record's rather than a quotation. The class is not in doubt and BUYERS.md states it a second way.

---

## The rules, and where each one is enforced

    rule                  class         severity  gate                        from
    tolerance             notation      stop      objections                  CO-01, CO-02, CO-03
    interval-word         notation      flag      objections                  CO-03
    scale-prose           scale         stop      objections                  CO-04
    count-against-total   score         stop      objections                  CO-05
    empty-state           value         stop      objections                  CO-09, CO-22
    serial-to-a-person    label         stop      objections                  CO-15
    two-months-free       offer         stop      objections                  CO-25
    figure-label          label         stop      check.py:figure label       CO-08
    naked-number          number        stop      check.py:naked number       CO-06, CO-07
    em-dash               punctuation   stop      check.py:emdash             CO-19
    the-count             number        stop      check.py:108                CO-19
    caps                  case          stop      check.py:caps               CO-19
    soft                  register      stop      check.py:soft               CO-20
    preamble              register      stop      check.py:preamble           CO-20
    verdict               register      stop      marketing/refuse.js:verdict CO-18
    reassurance           register      flag      check.py:reassure           CO-20
    one-word-per-concept  terminology   stop      tools/terms.py              CO-22
    question-mark         form          stop      tools/questions.js          CO-12

### tolerance

A figure with an interval, a tolerance or a statistical decoration stapled to it is a lab readout and not copy. Ruled as a class rather than as two strings. The range is a shape, so it is drawn and never stated.

    fails   of 100, plus or minus 12
    fixed   of 100
    found   0

The swing label takes two patterns because it ships in two shapes. In the source the literal ENDS on the word and the figure arrives at run time; on the screen the figure follows it. The first cut carried only the template shape and read "swing 11", the exact string the objection names, as clean. Checked against that wording as a known good case before it was trusted. It also reads the literal and not the sentence, because this label ships inside an SVG text element and a sentence walk drops it on the attribute quote.

### interval-word

A sentence naming the interval is a definition and not a lab readout, so it is flagged and never failed. It points at a figure that is coming off the screen, and a sentence whose referent has gone is a sentence about nothing.

    fails   A move smaller than the interval is not a reading.
    fixed   The needle has play in it. Watch the run.
    found   0

### scale-prose

Prose that hides behind a scale instead of saying something. The ruling: if you cannot use regular words to describe it, do not describe it.

    fails   The waist is 40 to 60 out of 100, where most people oscillate.
    fixed   The narrow middle is where most people sit.
    found   0

Zero in the product when this was written, because the scrub already ran. It is a regression gate, which is what a gate is for.

### count-against-total

A count against a total invites a person to pass or fail, and a reading is not a score.

    fails   11 of 12
    fixed   11 addresses carrying
    found   2
    atuned_src/ui/analytics.js:201
        <p class="sum-p">21 of the 76 laws, each answered from never to every time.</p>
    atuned_src/ui/games.js:142
        </b> of the 112 addresses.

Two survivors are ruled and neither has this shape: intake progress and release queue position, where the person is working through a finite list. A SCALE IS NOT A TOTAL, and the first cut of this rule did not know the difference: it fired on "4 of 10 counts as loaded" in funnel/about.html, which is a threshold on the depth scale and is the shape CO-04's own resolution ruled survives. A denominator of 1, 10 or 100 is a scale and is exempt unless a countable set is named after it.

### empty-state

The empty state has one wording for each of its two states. Six phrasings were in the product for two facts, and the worst of them landed in a value slot between two labels, where it read as a sentence about the second label.

    fails   not enough held to read
    fixed   not read yet
    found   0

TWO STATES, TWO WORDINGS, AND THEY ARE NOT THE SAME FACT. Not read yet is the instrument having read nothing. Nothing held is a field that has been read and is carrying nothing, which is what the balance strip actually means, so the rule does not force one onto the other. The sentence form keeps a subject and a reason and passes. The drift is the bare value form and the hedge yet, so the anchored pattern fires only where the whole string is those three words. The first cut had no anchor and would have failed the replacement this rule itself proposes, which is a gate refusing its own fix.

### serial-to-a-person

A node serial or a stack integer in front of a person is the data model read out loud.

    fails   Address 007 root
    fixed   Root
    found   0

Zero in the product when this was written. A regression gate.

### two-months-free

The offer is not two months free. Any copy saying so is wrong and comes out.

    fails   Two months free on the annual plan.
    fixed   nothing. The annual discount is not ruled, so no copy states one.
    found   0

---

## Not gateable, and named rather than dropped

A rule nobody can express as a check is guidance. It is written down
here so the next writer is held to it, and it is not turned into a bad
pattern, because a tool that lies is worse than no tool.

**refusal-in-value.** CO-09

A refusal sentence sitting in a value slot. It passes every pattern, because the wording is fine and the slot is wrong. The balance strip is its corpse: the value slot between masculine and feminine carried a refusal, so a person read one sentence across three elements.

*Why no pattern.* No pattern reads which bucket a slot expects. The empty-state rule catches the wording this one arrived in, and nothing catches the next one. Read every value slot's empty state out loud, in the order the eye takes it.

**empty-state-that-can-be-false.** CO-09

The empty state's own wording, correct everywhere else, put where it can be false. balance() returns read false when both means sit under one, at engine/compute.js:41, which folds three states into one flag: nothing entered, nothing carrying, and carrying too little to call. Not read yet is true of the first and false of the third, and a person holding eight units of charge would read it beside a Field with addresses lit. The instrument contradicting itself on one screen is the defect the usability panel recorded in a person's own words, and once they cannot tell which half is wrong they stop believing both.

*Why no pattern.* A pattern reads the string and never the state behind it. The check is to ask, of every empty state, which states its flag folds together and whether the wording is true of all of them. Where it is not, the value takes the dash and the reason goes one door in.

**no-context.** CO-13

A line written by the seat that found it assumes everything that seat knows.

*Why no pattern.* Whether a reader has the context is a fact about the reader.

**text-over-the-graphic.** CO-14

No text over the hero graphic, ever. Text hovering over a thing it cannot be read against is the objection, and it was made twice in one session.

*Why no pattern.* Placement, not wording. tools/collide.js and the shot run own it.

**legend-on-a-surface.** CO-16

A card explaining the product's own model to a person who did not ask. Get rid of it.

*Why no pattern.* A legend is a whole block and reads as ordinary copy line by line.

**heading-a-person-would-say.** CO-10

Which day you keep it. The word does not mean anything to the person reading it, and a heading has to be a thing a person would say out loud.

*Why no pattern.* No pattern knows whether a phrase is one a person would say. This is the read it out loud pass and it is a person's job.

**the-ai-six.** CO-11

The writing reads as AI and the target is a ten. The whole voice skill is the answer to this one.

*Why no pattern.* There is no pattern for smooth. The measurable proxies are the rate gates: antithesis, gloss, and the demonstrative copula opener, each reported against the house rate.

**band-word-alone.** CO-21

A label this product puts on a person carries a definition, the behaviour it produces, and the direction out of it. Severe with nothing attached is a judgement.

*Why no pattern.* The band words are correct values in a row where the definition stands beside them, so a pattern on the word fires on the right use as often as the wrong one. Checked by reading the surface.

**the-mark-is-named-awareness.** CO-17

Just call it sol, lowercase. And then, in the same breath: actually, it is called awareness.

*Why no pattern.* A pattern on the word soul fires on the numerology, where soul urge is the right term. The rename is done and a gate here would only break the right use.

**linear-and-boring.** CO-23

The knowledge base was linear and boring. A deck of identical cards is a list wearing a deck's clothes.

*Why no pattern.* Structure, not wording.

---

## The strings the build seat has to change

Old and new, with the reason. The line is found by searching the file
for the string, not by remembering where it was.

### atuned_src/ui/ui.js:522

    bucket  value
    rule    empty-state, from CO-09
    old     label:b.read?dir:'not read yet'
    new     label:b.read?dir:''

The balance pill, and the last piece of the string the objection names. The structural half is landed and right: the pill draws a dash and the refusal moved out from between the two pole labels. The label is the part still to go. Not read yet is false on a field that has been read and is carrying under a mean of one on both sides, which is a real state the engine folds in with the empty one at compute.js:41. A label that can be false about the screen it sits on is worse than no label. The dash is the value, the absence needs no name, and the reason is one tap away in the drill.

If an empty label draws an empty box, drop the key rather than passing a space.

### atuned_src/ui/ui.js:527

    bucket  refusal
    rule    empty-state, from CO-09
    old     'Balance. Not read yet. Neither side reaches 1, so no direction is '
    new     'Balance. Neither side reaches 1, so no direction is '

The same claim in the tooltip, and the sentence directly after it already says what is true. Neither side reaches 1 is checkable on any profile. Not read yet is not.

### atuned_src/ui/drills.js:441

    bucket  value
    rule    empty-state, from CO-09
    old     +(!b.read?'not read yet'
    new     +(!b.read?'no direction named'

The drill's headline value, the same slot one door in, where there is room for three words. It says what the instrument did rather than guessing which of three states it is in, and the paragraph two lines below carries the reason with both means printed beside it.

### atuned_src/ui/analytics.js:164

    bucket  definition
    rule    interval-word, from CO-03
    old     '. This is an estimate. A small move is not a reading.'
    new     '. The needle has play in it, so a small move is not a reading.'

Marked provisional in the file and waiting on this seat. The fact is the instrument's resolution, and a physical metaphor carries it where the arithmetic used to: play is the slack in a linkage, which is what an interval is. This is an estimate is the product talking about itself, and the sheet behind the profile button already says it once.

### atuned_src/ui/panels.js:883

    bucket  definition
    rule    interval-word, from CO-03
    old     'Every reading is an estimate, not a measurement. A small move is not '
    new     'Every reading is an estimate. The needle has play in it, so a small move is not a reading.'

Thirty words with three antithesis turns in them, X not Y twice and rather than once, against a house rate of 2.7 per cent of sentences. Noise is the lab register with the figure taken out of it, which is the class the sweep refuses. And the instrument saying it does not flatter you is the product praising itself for not praising.

The second literal on the following line, 'a reading, it is noise, and the instrument says so rather than flattering you.</p></div>', is replaced by '</p></div>'. The new sentence closes the paragraph.

### atuned_src/ui/analytics.js:201

    bucket  definition
    rule    count-against-total, from CO-05
    old     '21 of the 76 laws, each answered from never to every time.'
    new     '21 laws, each answered from never to every time.'

A count against a total, and the total is a fact about the codex rather than about the person. Said this way it reads as coverage of twenty seven per cent and invites the question why not the rest. The number a person needs is how many they answered and how.

### atuned_src/ui/games.js:142

    bucket  reading
    rule    count-against-total, from CO-05
    old     '</b> of the 112 addresses. '
    new     '</b> address'+(at.length===1?'':'es')+'. '

A count against a total, and this one is the total stated to a person. The set is the addresses this fetter runs, so the figure carries its own unit and needs no denominator. The sentence after it already says how many of them are carrying.

The literal in front of it, It runs <b> plus the count, does not move.

