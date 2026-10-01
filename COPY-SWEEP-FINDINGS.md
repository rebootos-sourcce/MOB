# Copy sweep findings, read off the brief

The owner's order: "We need to do a copy sweep. This is the copy engine that
needs to be developed and then utilized on the product." And on 1 October:
"You have a document that gives you rules. I gave that to you earlier."

The document is `CREATIVE-BRIEF-voice.md`. The engine is
`check.py --brief`, in `.claude/skills/atuned-voice/`, and section 3c of the
voice skill says how it works. This file is what the engine found when it was
run over the product. Nothing in `atuned_src/` has been changed by it: the
sweep that applies it comes after the four builds now in those files have
merged.

## How to read this

Every string a person reads was given a **layer** (what job the sentence
does: tooltip, label, information, mirror, discovery, play, flow, embody,
button, notification, status, metric) and a **mode** (which station of the
loop it is read in: DISCOVER, PLAY, FLOW, EMBODY, or none). The mode comes
straight from the tab bar in `engine/core.js`, so Story strings are DISCOVER
and Ritual strings are FLOW because that is where those tabs sit today.

Each finding carries one of three severities.

    stop     a certain defect: a phrase the brief or the house rules out
    flag     a probable defect, found mechanically
    review   a question for a person. It never fails anything

Every count of strings and findings is in the generated section at the
bottom, which the engine writes and rewrites. The few figures in the prose
above it are dated to the commit they were measured at, and are not to be
quoted after the next run. To refresh the bottom half after a change:

    python3 .claude/skills/atuned-voice/check.py --brief atuned_src/ui \
        atuned_src/engine atuned_src/shell funnel/*.html funnel/questions.js \
        --md COPY-SWEEP-FINDINGS.md --json COPY-SWEEP-FINDINGS.json

The order below is the order a sweep should take, by how many people read the
line: the funnel, then day one, then Story and Release, then the buttons and
the Field, then everything one door away.

## The top findings, with a rewrite for each

Old and new, side by side, and the reason. Every new line was run through
both `check.py --line` and `check.py --brief --line` in the layer it ships in,
and passes both. None is applied. Where a line is the owner's own words, it is
listed under the questions instead, because the team does not rewrite
dictated words.

### The funnel. Everyone who arrives reads these.

**`funnel/index.html:312`**, the landing lead. Mirror language, brief
section 5: "Never tell the user who they are."

    Old  You are tired in a way that sleep does not fix, and the same month
         keeps arriving.
    New  Tired in a way sleep does not fix. The same month keeps arriving.

The sentence describes an experience the reader recognises. Dropping "You
are" keeps the recognition and drops the claim, and it is stronger as a
landing line than "You may be tired", which the brief's preferred form would
give and which hedges the first thing a person reads.

**`funnel/index.html:348`**, medical authority, brief section 8.

    Old  And stagnation, which nobody counts as illness and which costs the
         most years.
    New  And stagnation, which no test picks up and which costs the most
         years.

**`funnel/index.html:365`** and **`funnel/quiz.html:430`**, the same claim on
two pages. Brief section 8: "Do not present the model's interpretation as an
established medical fact."

    Old  When coherence is low the circuit leaks, and the leak shows up as
         mental, physical and spiritual disease.
    New  When coherence is low the circuit leaks, and the leak shows up in
         all three places on the list above.

    Old  When it is low the circuit leaks, and the leak is what promotes
         mental, physical and spiritual disease. That is the mechanism, and
         it is the reason this instrument exists.
    New  When it is low the circuit leaks. The leak shows up in your mind,
         your body and what still feels worth doing. That is the reason this
         instrument exists.

"That is the mechanism" is cut: it is certainty the instrument has not
measured, brief section 15 rule 7. Check question 7 below before this ships:
the owner has dictated opening copy with "pain and disease free" in it, and
these lines may be his.

**`funnel/about.html:318`**, reading level, brief section 3. Grade 16.4 by
the engine's estimate, against about 9. The cause is the sentence: 34 words.

    Old  It tunes moral integrity against the 21 laws of integrity, and the
         result is vital energy: the capacity that holding a pattern was
         spending, back in the hands of the person who was spending it.
    New  It checks how you live against the 21 laws of integrity. What a
         pattern was costing you comes back as energy you can use.

### Day one. Everyone who signs up reads these.

**`atuned_src/ui/onboard.js:232`**, the first card. Voice rule V2, never
instruct a nervous system. The house gate has never seen this line: it drops
every string that carries markup, and this one sits inside
`<p class="ob-p">`. The brief run reads markup.

    Old  Sit down. Take ten slow breaths. Relax.
    New  Sit down. Put both feet on the floor. Take ten slow breaths.

"Relax" is an outcome, not an action. The replacement is the skill's own
fixed line for the same defect in the release opening.

**`atuned_src/shell/guard.html:206`**, the boot guard's report. All capitals,
and a failure with no route. Brief section 5: "Clear first."

    Old  THE FILE IS SHORT. The end of it never arrived.
    New  The file is short. The end of it never arrived. Download it again.

### Story and Release. Everyone who uses the product once reads these.

**`atuned_src/ui/release.js:136`**, `REL_ENTRY`, the three openings a release
line rotates through. Release language, brief section 4: "use release the
charge, not let go of the charge."

    Old  ['I let go of ','I give up ','I forgive myself for ']
    New  ['I release ','I give up ','I forgive myself for ']

This is the brief's named live violation, and it is **not** a clean edit. The
rotation is the book's, "Let go. Give up. Forgive myself. Forgive others.
Same mechanic. Different entry points.", and the owner ruled the protocol
statement as "I am letting go of believing" in `DECISIONS.md`. It is question
1 below. The same question covers the letting go cards in
`engine/data/cards.js`, the Letting Go Deck in `ui/knowledge.js` and the
letting go run in `ui/games.js`.

The worked example refusals, "Nothing released on a worked example." at
`ui/release.js:758` and its siblings in Story, Settings and the Avatar, come back as reviews for having no
route in the sentence. They are right as they stand: the owner ruled on 25
September (BA9) that the route is the profile picker beside them, and voice
rule V15 records it. No change.

### Buttons and the Field

**`atuned_src/ui/drills.js:960`**, a button. Brief section 5: short verbs.

    Old  None of these. Try by age
    New  Try by age

"None of these" is a state, and a state on a button is a sentence. The line
above the buttons already says nothing matched.

**`atuned_src/ui/fieldbar.js:99`**, a tooltip. Brief section 5: one idea,
prefer one sentence. Thirty one words and a term a child would ask about.

    Old  The seven assemblage points, the seats up your body from the base of
         the spine to the top of the head. Each is named on its own stretch of
         the ring.
    New  The seven seats, from the base of your spine to the top of your head.

Seat is the product's word. "Assemblage points" is a second name for the same
thing, which voice rule V14 rules out.

### One door away. The reference tables and the engine.

**`atuned_src/engine/data/kb.js`**, the glossary entry for DQ. Evidence, brief
section 6: an interpretation stated as a finding.

    Old  A high DQ means you are spending energy holding up parts of you that
         pull against each other.
    New  A high DQ reads as energy spent holding up parts of you that pull
         against each other.

**`atuned_src/engine/ladder.js:188`**, a mark earned. His own objection
CO-29, the abstract word list.

    Old  Fifty. Close to half the architecture has been opened at least once.
    New  Fifty. Close to half your addresses have been opened at least once.

**`atuned_src/engine/data/kb.js:16`**, a saboteur definition. The house
filler rule.

    Old  Simply not present for it.
    New  Not present for it.

**`atuned_src/ui/drills.js:466`**, the house unit rule, V7.

    Old  so the wheel is 112 of these side by side.
    New  so the wheel is 112 segments side by side.

**`atuned_src/engine/compute.js:303`**, a medical frame in a reading.

    Old  the cure for X, done past the point where it helps
    New  the fix for X, done past the point where it helps

**`atuned_src/engine/data/compass.js:171`** and its neighbours, reading level.
The descent tables carry the densest prose in the product, grade 12 to 17 by
the estimate, and the cause is the words, not the sentences.

    Old  Calculated manipulation and deliberate domination. Not reactive,
         strategic. Awareness is present and deployed against coherence.
    New  Harm done on purpose, with a plan. It is not a reaction. The person
         sees clearly and uses what they see against coherence.

    Old  Does this person access experience directly, or require verification
         before they allow themselves to feel?
    New  Does this person feel things straight away, or wait for proof before
         they let themselves feel?

The descent is the codex's own taxonomy, so the sweep that takes these keeps
every named term and changes only the words around it.

## Questions for the owner

Each one is a place where the brief and something already ruled disagree. The
engine does not settle any of them: it flags the line and leaves it.

**1. Release, or letting go, in the protocol itself?**

The brief, section 4: "Canonical language: use 'release the charge,' not
'let go of the charge.'" Your own ruling, in `DECISIONS.md`, round CB, 26
September: "believe, I'm letting go of believing, perceiving, thinking,
behaving, acting, feeling. Those are the channels we're using." The product
speaks the second: "I let go of fear." in the release run, "I am letting go of
the belief that I am trapped." on the cards, and the names "The Letting Go
Deck" and "The letting go run".

- **The brief wins everywhere.** "I release fear." The deck and the run are
  renamed. Costs: every card statement in `cards.js` is rewritten, the
  product parts from the book's wording, and `BOOK-ERRATA.md` records it.
- **The brief governs the product's voice, the protocol keeps the book's.**
  Instructions say "Release the charge"; the sentences a person says out loud
  stay "I am letting go of". Costs: two verbs near one mechanic, which voice
  rule V14 (one word per concept) argues against.
- **The statements change, the names stay.** "I release fear.", and the Letting
  Go Deck keeps the book's name. Costs: the name and the act disagree.

**2. Is Integrate a word in this product?**

The brief uses it as a canonical phrase, "Integrate the charge.", and as a
button verb. Your ruling at round GS, 27 September, recorded in `COPY.md`:
"Integrate does not name the mechanic or any string in it." The app carries no
Integrate string today. The funnel does: "integrates the kink, the cluster
and the network" on the about page.

- **GS stands.** Integrate stays out, and the funnel lines lose it. Costs: the
  brief's flow step ("Release the charge. Integrate the charge.") has one verb.
- **Integrate names the step after release**, the Flow work of making a new
  response stick, and never the release itself. Costs: a second word next to
  Release that needs its own definition, and GS reopened.

**3. The brief's own examples carry em dashes and capitals.** Its tooltip
example is the word Resistance, an em dash, then the definition. Its metrics
are written the same way, Coherence, an em dash, 72. Its screen examples are
in capitals: "SEE THE PATTERN.", "AVOIDING THE NEXT STEP". (The dashes are
described here and not copied, because this file is held to the same rule.)
The house rules are no em dashes anywhere and no all caps copy.
The engine's own test shows these are the only lines in the brief that fail
the house rules. Proposed, and it needs only a yes: the house wins, and the
examples are read as "Resistance. The friction you feel...", "Coherence 72"
and "See the pattern."

**4. How does a metric read?** The brief, section 12, prints Coherence beside
72 and Resistance beside 28: a word and a bare number. Voice rule V22, your round JX,
says a figure a person reads about themselves carries its node state word
("heavily impaired, 7.4"), and rule V8 says a reading is never a score. Which
governs the metrics layer: the brief's bare figure, or the figure with its
word?

**5. Ninth grade, or ten years old?** The brief asks for "approximately
ninth-grade readability". Your ruling of 27 September, voice rule V21: "We
want to speak to people as if they're 10." A ten year old reads at about
fourth or fifth grade. The engine is built to the brief: it flags a string at
grade 12 and over and asks about one at 10.5 and over. Measured at commit
`fd2594f`, 933 strings were long enough to grade; 14 were 12 or over, 60 were
9 or over, and 361 were 5 or over. Moving the line to the ten year old would
turn a short list into a sweep of about a third of the product's longer
strings. Which line do you want the gate to hold?

**6. Hedging.** The brief: "Use qualified language when interpretation is
involved", "You may be avoiding...". `COPY.md` and voice rule W3: "the copy
says so once at the end rather than hedging throughout." The engine reconciles
them this way, and it needs a yes or a no: an observation (what you wrote,
what the engine counted) is said plainly; an interpretation (why, what it
means about you) is qualified once; the limit of the instrument is admitted
once, at the end.

**7. "Never diagnose", and a product that calls itself a diagnostic.** The
brief: "Never diagnose." `BIBLE.md` 1.1 calls the product "a somatic
diagnostic instrument", and two strings a person reads say so: "From your
diagnostic" and "Not answered in the diagnostic" in the drills. The funnel
says the leak "shows up as mental, physical and spiritual disease" and that
stagnation is not counted "as illness". The node state words you ruled at
round KD ("impaired", "blocked") read as medical too, and `COPY.md` already
holds "impaired" open. Should "diagnostic" leave every string a person reads
(the intake becomes "your answers" or "the 63 questions"), and should the
funnel's disease lines change as proposed above? If any of the funnel lines
are your dictated opening, they stay until you say.

**8. The loop map.** The brief's stations: Flow is "release and integration",
Embody is "action", "Practice the new response". Your tab bar, round KT:
Release sits on the Story page in Discover, "Flow is ritual and
accountability", "Embody is knowledge." So the engine reports release lines
as flow layer read in DISCOVER mode, and ritual practices as embody layer read
in FLOW mode. Both are counted in the table at the bottom.

- **The tab bar stays as ruled**, and the brief's stations describe what a
  sentence does, not where it lives. Costs: nothing to build; the two maps
  have to be explained side by side, as here.
- **The bar follows the brief.** Release moves into Flow, practice into
  Embody, Knowledge out of the loop. Costs: a navigation change you ruled
  twice already.

**9. Your brand lines and the brief's avoid list.** "You are already the most
powerful version of yourself" (about page) and "We help you become the best
version of yourself" (about and buy pages) are yours, from `BRAND.md` section
1. The brief lists "inflated self-help language" as something to avoid, and
these two read that way to its list. The engine flags them and will never
stop them. Do they stay?

**10. Comparing a release to therapy.** The about page, the buy page and the
plan table say a therapy session releases one to six patterns, the codex's
figure, and that a run releases up to 25. The brief rules out "medical
authority". Keep the comparison as the codex states it, keep it against
meditation and breathwork only, or drop the comparison?

**11. Mystical and clinical names in the reference tables.** The engine flags
"Karmic debt" (the numerology lens, Summary and the drills), "Higher Self
anchor" (an address name in `nodes.js`), and "narcissism" and "codependency"
(saboteur and descent definitions in `kb.js` and `compass.js`) against the
brief's avoid list. These are the codex's own terms. Keep them as the codex's
names, each explained in plain words once, or rename them?

**12. A one line tooltip for every glossary term?** The brief, section 14:
the tooltip's job is "define it", one sentence, "The friction you feel when
something inside you pushes against your intention." The glossary (`GLOSS` in
`kb.js`) is the only place a term is defined, and its entries run three to
six sentences, read as rows on Knowledge. `COPY.md` rules that a definition
never lives only in a tooltip. Add a one sentence field beside each entry,
for hover, with the full entry staying where it is?

<!-- brief run: generated by check.py --brief --md. Edits inside are overwritten. -->

Measured at commit `94b7325`, 2026-10-01, by:

    python3 .claude/skills/atuned-voice/check.py --brief atuned_src/ui atuned_src/engine atuned_src/shell funnel/about.html funnel/buy.html funnel/index.html funnel/quiz.html funnel/questions.js

3110 strings read. 180 findings: 115 review, 57 flag, 8 stop.

### Strings by layer and mode

| layer | DISCOVER | PLAY | FLOW | EMBODY | none | all |
|---|---|---|---|---|---|---|
| information | 262 | 55 | 5 | 15 | 989 | 1326 |
| label | 114 | 25 | 16 | 13 | 283 | 451 |
| mirror | 161 | 66 | 14 | 7 | 193 | 441 |
| discovery | 64 |  |  |  | 139 | 203 |
| status | 29 | 3 | 1 |  | 130 | 163 |
| button | 35 | 2 | 12 | 3 | 97 | 149 |
| flow | 32 |  |  |  | 74 | 106 |
| tooltip | 11 | 45 |  |  | 23 | 79 |
| embody |  |  | 6 |  | 51 | 57 |
| metric | 49 |  |  |  |  | 49 |
| UNCLASSIFIED | 7 | 11 |  | 1 | 7 | 26 |
| quoted |  |  |  |  | 26 | 26 |
| notification |  |  |  |  | 19 | 19 |
| play |  |  |  |  | 15 | 15 |

UNCLASSIFIED, by file, never guessed: `map.js` 5, `cone.js` 4, `drills.js` 4, `fieldbar.js` 4, `ui.js` 3, `avatarui.js` 2, `birth.js` 1, `body.html` 1, `knowledge.js` 1, `panels.js` 1.

### Findings by rule and severity

| rule | stop | flag | review |
|---|---|---|---|
| next-step |  |  | 59 |
| button-verb |  | 1 | 21 |
| release-language |  | 18 |  |
| readability |  | 14 | 15 |
| tooltip-one-idea |  | 1 | 14 |
| diagnosis |  | 11 |  |
| avoid-list |  | 10 |  |
| evidence |  | 1 | 6 |
| house:caps | 4 |  |  |
| house:filler | 1 |  |  |
| house:naked number | 1 |  |  |
| house:soft | 1 |  |  |
| mirror-identity |  | 1 |  |
| objection:abstract-word | 1 |  |  |

### Findings by layer and severity

| layer | stop | flag | review |
|---|---|---|---|
| mirror | 1 | 6 | 50 |
| information | 3 | 34 | 13 |
| button |  | 1 | 21 |
| status | 3 |  | 16 |
| tooltip |  | 1 | 15 |
| flow |  | 11 |  |
| label |  | 3 |  |
| notification | 1 |  |  |
| play |  | 1 |  |

### Reading grade and body words, by layer

| layer | graded strings | median grade | p90 grade | body words |
|---|---|---|---|---|
| UNCLASSIFIED | 5 | 1.5 | 10.0 |  |
| discovery | 109 | 4.0 | 6.8 | 15.3% |
| embody | 36 | 4.0 | 6.4 | 33.3% |
| flow | 37 | 3.7 | 7.6 | 16.0% |
| information | 481 | 4.8 | 8.8 | 8.0% |
| metric | 18 | 2.3 | 5.8 | 0.0% |
| mirror | 153 | 3.8 | 7.3 | 4.3% |
| notification | 12 | 3.4 | 6.0 | 0.0% |
| play | 5 | 3.5 | 4.6 | 0.0% |
| status | 47 | 3.7 | 8.0 | 0.0% |
| tooltip | 30 | 3.8 | 8.4 | 2.5% |

### By file, in the order a sweep should take them

Files are ordered by how many people read them, then by stop and flag findings. One file is one change, so two seats can take two files without touching the same lines. Reviews are questions, listed last in each file.

#### `funnel/about.html`, reach 1. 4 flag, 2 review

- `246` **flag** avoid-list, information / none: "You are already the most powerful version of yourself. What you feel instead is the load sitting on top of it."  
  inflated self-help language (selfhelp). His own line, BRAND.md section 1, so this is a question for him and never an edit.
- `318` **flag** readability, information / none: "It tunes moral integrity against the 21 laws of integrity, and the result is vital energy: the capacity that holding a pattern was spending,..."  
  grade 16.4 against a target of about 9. Cause: the sentence: 34 words a sentence adds 13.3 grades.
- `504` **flag** diagnosis, information / none: "A release run is at most 25 patterns, and one pattern is one thought line at one address by way of one channel. The codex behind the engine ..."  
  a medical frame: a claim measured against care the instrument does not give.
- `530` **flag** avoid-list, information / none: "We help you become the best version of yourself."  
  corporate wellness language (corporate). His own line, BRAND.md section 1, so this is a question for him and never an edit.
- `356` **review** readability, information / none: "A person can already get a figure for their sleep, their pulse and their blood, and can act on it without asking anybody's permission. Nothi..."  
  grade 10.8 against a target of about 9. Cause: the sentence: 26 words a sentence adds 9.9 grades.
- `454` **review** readability, information / none: "Holding A promise that a person's words never leave their machine can now be kept, because the whole instrument is one file with no network ..."  
  grade 11.5 against a target of about 9. Cause: the sentence: 27 words a sentence adds 10.5 grades.

#### `atuned_src/shell/guard.html`, reach 1. 3 stop

- `206` **stop** house:caps, status / none: "THE FILE IS SHORT. The end of it never arrived."  
  "THE" in copy. Sentence case in body, title case in headers.
- `206` **stop** house:caps, status / none: "THE FILE IS SHORT. The end of it never arrived."  
  "FILE" in copy. Sentence case in body, title case in headers.
- `206` **stop** house:caps, status / none: "THE FILE IS SHORT. The end of it never arrived."  
  "SHORT" in copy. Sentence case in body, title case in headers.

#### `funnel/index.html`, reach 1. 3 flag

- `312` **flag** mirror-identity, information / none: "You are tired in a way that sleep does not fix, and the same month keeps arriving."  
  "You are tired" is a claim about who the person is. Describe what they do, and qualify it: "You may be..."
- `348` **flag** diagnosis, information / none: "And stagnation, which nobody counts as illness and which costs the most years."  
  the language of a diagnosis. Say what was reported and where.
- `365` **flag** diagnosis, information / none: "The measure of the gap is coherence. Coherence is the alignment between what arrives from the world, how you read it, what you intend, and w..."  
  the language of a diagnosis. Say what was reported and where.

#### `funnel/buy.html`, reach 1. 2 flag, 1 review

- `402` **flag** diagnosis, information / none: "The codex behind the engine puts a therapy session at one to six patterns released, and half an hour of meditation or breathwork at nine to ..."  
  a medical frame: a claim measured against care the instrument does not give.
- `444` **flag** avoid-list, information / none: "We help you become the best version of yourself."  
  corporate wellness language (corporate). His own line, BRAND.md section 1, so this is a question for him and never an edit.
- `429` **review** readability, information / none: "Nothing here expires, nothing counts down, and no figure in the product is taken away for a day off. A person has to be able to stop and be ..."  
  grade 10.8 against a target of about 9. Cause: the sentence: 28 words a sentence adds 10.7 grades.

#### `atuned_src/ui/onboard.js`, reach 1. 1 stop, 2 review

- `232` **stop** house:soft, information / none: "Sit down. Take ten slow breaths. Relax."  
  "Relax" is category language. Name the physical fact.
- `169` **review** button-verb, button / none: "Come in"  
  Does this control do one thing? If so, which verb names it, from the brief's list or one the product already uses?
- `170` **review** button-verb, button / none: "Not now"  
  Does this control do one thing? If so, which verb names it, from the brief's list or one the product already uses?

#### `funnel/quiz.html`, reach 1. 1 flag, 9 review

- `440` **flag** diagnosis, information / none: "When it is low the circuit leaks, and the leak is what promotes mental, physical and spiritual disease. That is the mechanism, and it is the..."  
  the language of a diagnosis. Say what was reported and where.
- `375` **review** next-step, mirror / none: "{x}. The test cannot be scored without it and will not guess. Serve this page from the funnel directory beside the engine."  
  A full reading with no next step. Is the route one door away, or does this reading need one line naming it?
- `385` **review** evidence, mirror / none: "Some of them will be uncomfortable to answer honestly, because they are about things that happened rather than about the kind of person you ..."  
  Is this observed or inferred? If observed, which field or which words of theirs does it come from? If inferred, qualify it once. (W3: admit the limit once, never hedge throughout.)
- `437` **review** next-step, mirror / none: "That is your coherence. One hundred is every law closed with nothing held in the body. Coherence is the alignment between what arrives, how ..."  
  A full reading with no next step. Is the route one door away, or does this reading need one line naming it?
- `484` **review** next-step, mirror / none: "Every address named above carries its own direction in the Compass. {x} more saboteurs are firing under these, and they compound into {x} co..."  
  A full reading with no next step. Is the route one door away, or does this reading need one line naming it?
- `495` **review** next-step, mirror / none: "What this is. A hundred points on the 21 laws, and the nine charges those points imply. It has not read a story in your own words, which is ..."  
  A full reading with no next step. Is the route one door away, or does this reading need one line naming it?
- `758` **review** next-step, mirror / none: "Each card is one charge your words named. A charge is survival energy stuck at one place in the body. The last line on each card says whethe..."  
  A full reading with no next step. Is the route one door away, or does this reading need one line naming it?
- `769` **review** next-step, mirror / none: "What this is. The same reader the app runs on its Story page. It matches your words against the instrument's word list and places each match..."  
  A full reading with no next step. Is the route one door away, or does this reading need one line naming it?
- `832` **review** readability, mirror / none: "There is no account and no server, so nothing here can be fetched later by anybody, including us. What you save is a profile in the instrume..."  
  grade 11.6 against a target of about 9. Cause: the sentence: 26 words a sentence adds 10.1 grades.
- `846` **review** next-step, mirror / none: "{x}. The app reads every story you write and shows where each one sits in the body. Then it runs a release on each address that is carrying,..."  
  A full reading with no next step. Is the route one door away, or does this reading need one line naming it?

#### `atuned_src/shell/body.html`, reach 1. 1 review

- `345` **review** button-verb, button / none: "Source OS"  
  Does this control do one thing? If so, which verb names it, from the brief's list or one the product already uses?

#### `atuned_src/ui/login.js`, reach 1. 2 review

- `128` **review** button-verb, button / none: "Suggest"  
  Does this control do one thing? If so, which verb names it, from the brief's list or one the product already uses?
- `133` **review** button-verb, button / none: "Forgot your password?"  
  Does this control do one thing? If so, which verb names it, from the brief's list or one the product already uses?

#### `atuned_src/ui/release.js`, reach 2. 1 flag, 1 review

- `136` **flag** release-language, flow / DISCOVER: "I let go of"  
  brief section 4: release, not let go. This collides with ruled protocol wording ("I am letting go of believing", DECISIONS.md), so it is an owner question before it is an edit.
- `758` **review** next-step, status / DISCOVER: "Nothing released on a worked example."  
  Does the control beside this carry the route (V15, ruled BA9)? If not, add one imperative step.

#### `atuned_src/ui/storyui.js`, reach 2. 3 review

- `152` **review** button-verb, button / DISCOVER: "List"  
  Does this control do one thing? If so, which verb names it, from the brief's list or one the product already uses?
- `379` **review** next-step, status / DISCOVER: "Nothing committed on a worked example."  
  Does the control beside this carry the route (V15, ruled BA9)? If not, add one imperative step.
- `1789` **review** next-step, status / DISCOVER: "This browser has no speech recognition. Typing works."  
  Does the control beside this carry the route (V15, ruled BA9)? If not, add one imperative step.

#### `atuned_src/ui/tutorial.js`, reach 2. 1 review

- `96` **review** next-step, mirror / none: "Nothing in that one lit anything the engine could name. That happens, and it is not a problem with what you wrote. Some entries are quiet."  
  A full reading with no next step. Is the route one door away, or does this reading need one line naming it?

#### `atuned_src/engine/data/cards.js`, reach 3. 10 flag

- `51` **flag** release-language, flow / none: "I am letting go of {x}"  
  brief section 4: release, not let go. This collides with ruled protocol wording ("I am letting go of believing", DECISIONS.md), so it is an owner question before it is an edit.
- `223` **flag** release-language, flow / none: "afraid. I am letting go of the belief that I am trapped. I am letting go of the survival program running at this address."  
  brief section 4: release, not let go. This collides with ruled protocol wording ("I am letting go of believing", DECISIONS.md), so it is an owner question before it is an edit.
- `227` **flag** release-language, flow / none: "angry. I am letting go of the compressed will at this address. I am letting go of the belief that I must force the result."  
  brief section 4: release, not let go. This collides with ruled protocol wording ("I am letting go of believing", DECISIONS.md), so it is an owner question before it is an edit.
- `231` **flag** release-language, flow / none: "ashamed. I am letting go of the collapse at this address. I am letting go of the story that my presence requires justification."  
  brief section 4: release, not let go. This collides with ruled protocol wording ("I am letting go of believing", DECISIONS.md), so it is an owner question before it is an edit.
- `235` **flag** release-language, flow / none: "in rejection. I am letting go of the recoil at this address. I am letting go of the standard that makes reality wrong."  
  brief section 4: release, not let go. This collides with ruled protocol wording ("I am letting go of believing", DECISIONS.md), so it is an owner question before it is an edit.
- `239` **flag** release-language, flow / none: "in apathy. I am letting go of the collapsed will at this address. I am letting go of the question that assumes the answer is nothing."  
  brief section 4: release, not let go. This collides with ruled protocol wording ("I am letting go of believing", DECISIONS.md), so it is an owner question before it is an edit.
- `243` **flag** release-language, flow / none: "in shock. I am letting go of the bracing at the surface. I am letting go of the record that says reality must always be a threat."  
  brief section 4: release, not let go. This collides with ruled protocol wording ("I am letting go of believing", DECISIONS.md), so it is an owner question before it is an edit.
- `247` **flag** release-language, flow / none: "in sadness. I am letting go of the weight at the inferior heart. I am letting go of the old flags that were never updated. I am letting go o..."  
  brief section 4: release, not let go. This collides with ruled protocol wording ("I am letting go of believing", DECISIONS.md), so it is an owner question before it is an edit.
- `253` **flag** release-language, flow / none: "closed to receiving. I am letting go of the smallness at this address. I am letting go of the belief that what is present cannot be for me."  
  brief section 4: release, not let go. This collides with ruled protocol wording ("I am letting go of believing", DECISIONS.md), so it is an owner question before it is an edit.
- `257` **flag** release-language, flow / none: "in grief. I am letting go of the weight at this address. I am letting go of the hold on what was or what never came to be."  
  brief section 4: release, not let go. This collides with ruled protocol wording ("I am letting go of believing", DECISIONS.md), so it is an owner question before it is an edit.

#### `atuned_src/ui/component.js`, reach 3. 1 review

- `550` **review** next-step, status / none: "Nothing saved on a worked example."  
  Does the control beside this carry the route (V15, ruled BA9)? If not, add one imperative step.

#### `atuned_src/ui/panels.js`, reach 3. 6 review

- `586` **review** next-step, mirror / none: "{x}: {x}. One of 19 parts of the blueprint you are born with, under the {x} root. {x}"  
  A full reading with no next step. Is the route one door away, or does this reading need one line naming it?
- `628` **review** evidence, mirror / none: "{x}. Holds {x}. Running it makes {x} land 1.3 times as heavy. Filled means you added it. Pale means something you picked is already in it."  
  Is this observed or inferred? If observed, which field or which words of theirs does it come from? If inferred, qualify it once. (W3: admit the limit once, never hedge throughout.)
- `628` **review** next-step, mirror / none: "{x}. Holds {x}. Running it makes {x} land 1.3 times as heavy. Filled means you added it. Pale means something you picked is already in it."  
  A full reading with no next step. Is the route one door away, or does this reading need one line naming it?
- `1058` **review** button-verb, button / none: "Manage billing"  
  Does this control do one thing? If so, which verb names it, from the brief's list or one the product already uses?
- `1270` **review** next-step, mirror / none: "Back. Takes back {x}. {x} step{x}"  
  A full reading with no next step. Is the route one door away, or does this reading need one line naming it?
- `1273` **review** next-step, mirror / none: "Forward. Puts back {x}. {x} step{x}"  
  A full reading with no next step. Is the route one door away, or does this reading need one line naming it?

#### `atuned_src/ui/ui.js`, reach 3. 3 review

- `56` **review** evidence, mirror / PLAY: ", because of your {x}"  
  Is this observed or inferred? If observed, which field or which words of theirs does it come from? If inferred, qualify it once. (W3: admit the limit once, never hedge throughout.)
- `1222` **review** tooltip-one-idea, tooltip / PLAY: "Awareness of the instrument. {x}"  
  Is the second sentence a second idea? If so, it goes one door away.
- `1537` **review** next-step, status / PLAY: "Managing billing from here is not built yet. Email support to change or cancel a plan."  
  Does the control beside this carry the route (V15, ruled BA9)? If not, add one imperative step.

#### `atuned_src/ui/fieldbar.js`, reach 4. 1 flag, 3 review

- `99` **flag** tooltip-one-idea, tooltip / PLAY: "The seven assemblage points, the seats up your body from the base of the spine to the top of the head. Each is named on its own stretch of t..."  
  a tooltip is one idea. This teaches the concept. Move the rest one door away, into the drill.
- `101` **review** tooltip-one-idea, tooltip / PLAY: "The twenty one laws, each set at its assemblage point. Their sum is the number at the centre."  
  Is the second sentence a second idea? If so, it goes one door away.
- `103` **review** tooltip-one-idea, tooltip / PLAY: "Six ways of meeting a charge, round the core. Awareness, detachment and intention sit across from ignorance, attachment and aversion."  
  Is the second sentence a second idea? If so, it goes one door away.
- `283` **review** tooltip-one-idea, tooltip / PLAY: "Folds the bar into this one circle. Every layer stays as it was set."  
  Is the second sentence a second idea? If so, it goes one door away.

#### `atuned_src/ui/avatarui.js`, reach 4. 9 review

- `1023` **review** button-verb, button / DISCOVER: "I said it"  
  Does this control do one thing? If so, which verb names it, from the brief's list or one the product already uses?
- `1750` **review** next-step, status / DISCOVER: "Nothing saved on a worked example."  
  Does the control beside this carry the route (V15, ruled BA9)? If not, add one imperative step.
- `1791` **review** next-step, status / DISCOVER: "Saved. The starting weight was not kept, so this one reads from nothing done."  
  Does the control beside this carry the route (V15, ruled BA9)? If not, add one imperative step.
- `1798` **review** next-step, status / DISCOVER: "Nothing saved on a worked example."  
  Does the control beside this carry the route (V15, ruled BA9)? If not, add one imperative step.
- `1815` **review** next-step, status / DISCOVER: "Nothing saved on a worked example."  
  Does the control beside this carry the route (V15, ruled BA9)? If not, add one imperative step.
- `1829` **review** next-step, status / DISCOVER: "Nothing saved on a worked example."  
  Does the control beside this carry the route (V15, ruled BA9)? If not, add one imperative step.
- `1838` **review** next-step, status / DISCOVER: "Nothing saved on a worked example."  
  Does the control beside this carry the route (V15, ruled BA9)? If not, add one imperative step.
- `1856` **review** next-step, status / DISCOVER: "Nothing saved on a worked example."  
  Does the control beside this carry the route (V15, ruled BA9)? If not, add one imperative step.
- `1870` **review** next-step, status / DISCOVER: "Nothing saved on a worked example."  
  Does the control beside this carry the route (V15, ruled BA9)? If not, add one imperative step.

#### `atuned_src/ui/intakeui.js`, reach 4. 1 review

- `621` **review** button-verb, button / DISCOVER: "New"  
  Does this control do one thing? If so, which verb names it, from the brief's list or one the product already uses?

#### `atuned_src/ui/map.js`, reach 4. 3 review

- `385` **review** button-verb, button / DISCOVER: "Whole body"  
  Does this control do one thing? If so, which verb names it, from the brief's list or one the product already uses?
- `3326` **review** tooltip-one-idea, tooltip / DISCOVER: "Paint where it hurts, on the figure. Painted pain stays until the profile changes and is not saved."  
  Is the second sentence a second idea? If so, it goes one door away.
- `3329` **review** readability, tooltip / DISCOVER: "How open each seat is, up the spine: open, mildly impaired, moderately impaired, heavily impaired or blocked."  
  grade 11.2 against a target of about 9. Cause: the words: 1.71 syllables a word adds 4.5 grades, long words moderately, heavily.

#### `atuned_src/ui/rings.js`, reach 4. 3 review

- `63` **review** tooltip-one-idea, tooltip / PLAY: "One ring, read by depth. The bar above adds a layer at a time and scrolling on the ring adds more."  
  Is the second sentence a second idea? If so, it goes one door away.
- `145` **review** tooltip-one-idea, tooltip / PLAY: "The twenty one laws, set by seat. Their sum is the number at the centre."  
  Is the second sentence a second idea? If so, it goes one door away.
- `147` **review** tooltip-one-idea, tooltip / PLAY: "The six gates round the core. Each higher gate sits across from the lower one it stands against."  
  Is the second sentence a second idea? If so, it goes one door away.

#### `atuned_src/ui/wheel.js`, reach 4. 4 review

- `665` **review** tooltip-one-idea, tooltip / PLAY: "What you are carrying, and where. The core is coherence, the ring is your 112 addresses, the wash is shadow weight."  
  Is the second sentence a second idea? If so, it goes one door away.
- `667` **review** tooltip-one-idea, tooltip / PLAY: "The saboteurs running on top of the charge. Each bead is one, and the threads show which addresses built it."  
  Is the second sentence a second idea? If so, it goes one door away.
- `669` **review** tooltip-one-idea, tooltip / PLAY: "How a pattern compounds. Saboteur into complex into hyper complex into character, inward, each built from the one outside it."  
  Is the second sentence a second idea? If so, it goes one door away.
- `671` **review** tooltip-one-idea, tooltip / PLAY: "What was there before any of it. Nineteen domains, and the twenty one laws underneath the whole reading."  
  Is the second sentence a second idea? If so, it goes one door away.

#### `atuned_src/ui/drills.js`, reach 5. 1 stop, 3 flag, 27 review

- `466` **stop** house:naked number, information / none: "The charge held at one address, 0 to 10. Each segment of the shell is drawn to its own depth, so the wheel is 112 of these side by side. The..."  
  "112 of these side" has no unit. A reader cannot say it out loud.
- `265` **flag** diagnosis, label / none: "From your diagnostic"  
  the language of a diagnosis. Say what was reported and where.
- `960` **flag** button-verb, button / none: "None of these. Try by age"  
  a button is a short verb. This is 6 words.
- `1400` **flag** avoid-list, mirror / none: "Karmic debt {x}. {x}"  
  mystical fortune-telling (mystical).
- `384` **review** next-step, mirror / none: "Coherence is the alignment between the world around you, what arrives from it, the way you read what arrives, the intention behind it, and t..."  
  A full reading with no next step. Is the route one door away, or does this reading need one line naming it?
- `389` **review** next-step, mirror / none: "A circuit distorts somewhere specific. In the field, and it shows up as perception. In the body, and it shows up in the nervous system or in..."  
  A full reading with no next step. Is the route one door away, or does this reading need one line naming it?
- `408` **review** next-step, mirror / none: "{x}Radiance {x}%. The field is the geometry of that radiance. It is harmonic, so patterns sit at registers rather than anywhere, and what ra..."  
  A full reading with no next step. Is the route one door away, or does this reading need one line naming it?
- `497` **review** next-step, mirror / none: "Three independent lines. They do not average into a score, they say which of the three is carrying and which is short. Yours reads shortest ..."  
  A full reading with no next step. Is the route one door away, or does this reading need one line naming it?
- `592` **review** next-step, mirror / none: "The nine axes split by the direction the body takes under them. Four discharge outward, five withdraw inward. Four against five is not a fai..."  
  A full reading with no next step. Is the route one door away, or does this reading need one line naming it?
- `604` **review** next-step, mirror / none: "You gave {x}. It is stored and marked on the strip, and it does not enter the arithmetic. The distance between the tick"  
  A full reading with no next step. Is the route one door away, or does this reading need one line naming it?
- `652` **review** evidence, mirror / none: "It fires when its addresses carry at once. Yours are not carrying enough for it to run, which is why it is here and not on the wheel.{x}"  
  Is this observed or inferred? If observed, which field or which words of theirs does it come from? If inferred, qualify it once. (W3: admit the limit once, never hedge throughout.)
- `700` **review** next-step, mirror / none: "A mask is not a fault and it is not a stage you failed to leave. It is a shape held in front of the seats it covers, and it costs what holdi..."  
  A full reading with no next step. Is the route one door away, or does this reading need one line naming it?
- `888` **review** next-step, mirror / none: "Two measurements, not one twice. Shape is where what is running points, at other people or at the person carrying it. Control is whether the..."  
  A full reading with no next step. Is the route one door away, or does this reading need one line naming it?
- `1052` **review** next-step, mirror / none: "One side is who you are at your best. The other is who you are not, in your own words. They are written as a pair, because a value has no ad..."  
  A full reading with no next step. Is the route one door away, or does this reading need one line naming it?
- `1055` **review** next-step, mirror / none: "Nothing here is a diagnosis. This product does not rule on whether an attribute is a real edge or a saboteur wearing a virtue. That depends ..."  
  A full reading with no next step. Is the route one door away, or does this reading need one line naming it?
- `1071` **review** next-step, mirror / none: "Nothing written yet. The journal asks for it in two questions: describe yourself on your best day, not what you achieved but how you were. T..."  
  A full reading with no next step. Is the route one door away, or does this reading need one line naming it?
- `1079` **review** button-verb, button / none: "The purpose map"  
  Does this control do one thing? If so, which verb names it, from the brief's list or one the product already uses?
- `1108` **review** button-verb, button / none: "All of them"  
  Does this control do one thing? If so, which verb names it, from the brief's list or one the product already uses?
- `1145` **review** next-step, mirror / none: "Overlap the two triangles and the six sided shape is the boundary of your behaviour. That is your containment. A mirror you hold up to yours..."  
  A full reading with no next step. Is the route one door away, or does this reading need one line naming it?
- `1153` **review** next-step, mirror / none: "{x} of {x} written. Thirty is not a lot to ask of a mirror you will hold for as long as this takes. A mirror half described shows half a per..."  
  A full reading with no next step. Is the route one door away, or does this reading need one line naming it?
- `1156` **review** button-verb, button / none: "The avatar"  
  Does this control do one thing? If so, which verb names it, from the brief's list or one the product already uses?
- `1177` **review** next-step, mirror / none: "The mind sticks to anything that it defends. Once it is stuck, the bias is set. So the question is never what you liked. It is what you woul..."  
  A full reading with no next step. Is the route one door away, or does this reading need one line naming it?
- `1218` **review** button-verb, button / none: "All sixteen"  
  Does this control do one thing? If so, which verb names it, from the brief's list or one the product already uses?
- `1264` **review** next-step, mirror / none: "The line runs 0 at the base to 100 at the crown, and the word changes every ten points. Above {x} the field builds more than it costs. Below..."  
  A full reading with no next step. Is the route one door away, or does this reading need one line naming it?
- `1276` **review** next-step, mirror / none: "{x}. The marker is where coherence sits now, and how far it drifts is the range it moves in. Tight alignment leaves little room. A decoherin..."  
  A full reading with no next step. Is the route one door away, or does this reading need one line naming it?
- `1316` **review** evidence, mirror / none: "This is a 1.3× affinity pair: running {x} makes you more"  
  Is this observed or inferred? If observed, which field or which words of theirs does it come from? If inferred, qualify it once. (W3: admit the limit once, never hedge throughout.)
- `1332` **review** next-step, mirror / none: "This element maps to the {x} root. You currently run {x}. {x}"  
  A full reading with no next step. Is the route one door away, or does this reading need one line naming it?
- `1340` **review** next-step, mirror / none: "{x}. Your first archetype is {x}. {x}"  
  A full reading with no next step. Is the route one door away, or does this reading need one line naming it?
- `1396` **review** evidence, mirror / none: "Your names reduce to {x} and the flat sum of every letter comes to {x}. They disagree because one of your names carries a master. The parts ..."  
  Is this observed or inferred? If observed, which field or which words of theirs does it come from? If inferred, qualify it once. (W3: admit the limit once, never hedge throughout.)
- `1396` **review** next-step, mirror / none: "Your names reduce to {x} and the flat sum of every letter comes to {x}. They disagree because one of your names carries a master. The parts ..."  
  A full reading with no next step. Is the route one door away, or does this reading need one line naming it?
- `1402` **review** next-step, mirror / none: "{x}. Your first archetype is {x}. {x}"  
  A full reading with no next step. Is the route one door away, or does this reading need one line naming it?

#### `atuned_src/ui/summary.js`, reach 5. 1 flag, 3 review

- `514` **flag** avoid-list, mirror / DISCOVER: "Karmic debt {x} on the whole name. {x}"  
  mystical fortune-telling (mystical).
- `255` **review** next-step, mirror / DISCOVER: "There is no birth data on file, so the spiritual layer is not in this reading. Date, time and place would put it in. What is running now is ..."  
  A full reading with no next step. Is the route one door away, or does this reading need one line naming it?
- `438` **review** next-step, mirror / DISCOVER: "{x} could be made between them and the field. {x} point the same way. That is what the convergence is.{x}"  
  A full reading with no next step. Is the route one door away, or does this reading need one line naming it?
- `797` **review** next-step, mirror / DISCOVER: "The heaviest of the nine is {x}, at a weight of {x}. It sits at {x}, which you feel in the {x}. The quality on the far side of it is {x}."  
  A full reading with no next step. Is the route one door away, or does this reading need one line naming it?

#### `atuned_src/ui/account.js`, reach 5. 3 review

- `327` **review** next-step, status / none: "Nothing was deleted."  
  Does the control beside this carry the route (V15, ruled BA9)? If not, add one imperative step.
- `560` **review** next-step, status / none: "Could not reach the clipboard. Nothing was copied."  
  Does the control beside this carry the route (V15, ruled BA9)? If not, add one imperative step.
- `627` **review** next-step, status / none: "Nothing was deleted."  
  Does the control beside this carry the route (V15, ruled BA9)? If not, add one imperative step.

#### `atuned_src/ui/personas.js`, reach 5. 4 review

- `397` **review** next-step, mirror / none: "Family identification. How much of you the instrument has measured. Opens the detail."  
  A full reading with no next step. Is the route one door away, or does this reading need one line naming it?
- `399` **review** button-verb, button / none: "Accuracy"  
  Does this control do one thing? If so, which verb names it, from the brief's list or one the product already uses?
- `438` **review** next-step, mirror / none: "{x}. {x}% of the laws are spread three or more, which is what separates one family from another. Laws of integrity sitting close together na..."  
  A full reading with no next step. Is the route one door away, or does this reading need one line naming it?
- `839` **review** next-step, mirror / none: "Nothing is carrying, so there is nothing to release. The intake measured {x} of the 21 laws, which is how you act, not what you hold. A stor..."  
  A full reading with no next step. Is the route one door away, or does this reading need one line naming it?

#### `atuned_src/ui/ritual.js`, reach 5. 6 review

- `647` **review** button-verb, button / FLOW: "A week"  
  Does this control do one thing? If so, which verb names it, from the brief's list or one the product already uses?
- `648` **review** button-verb, button / FLOW: "Two weeks"  
  Does this control do one thing? If so, which verb names it, from the brief's list or one the product already uses?
- `739` **review** button-verb, button / FLOW: "Imprints"  
  Does this control do one thing? If so, which verb names it, from the brief's list or one the product already uses?
- `752` **review** button-verb, button / FLOW: "Imprints{x}"  
  Does this control do one thing? If so, which verb names it, from the brief's list or one the product already uses?
- `1063` **review** button-verb, button / FLOW: "Again"  
  Does this control do one thing? If so, which verb names it, from the brief's list or one the product already uses?
- `1105` **review** button-verb, button / FLOW: "Put back"  
  Does this control do one thing? If so, which verb names it, from the brief's list or one the product already uses?

#### `atuned_src/ui/knowledge.js`, reach 6. 2 flag, 1 review

- `440` **flag** release-language, label / EMBODY: "The Letting Go Deck"  
  brief section 4: release, not let go. This collides with ruled protocol wording ("I am letting go of believing", DECISIONS.md), so it is an owner question before it is an edit.
- `667` **flag** release-language, label / EMBODY: "Letting go card, axis {x}"  
  brief section 4: release, not let go. This collides with ruled protocol wording ("I am letting go of believing", DECISIONS.md), so it is an owner question before it is an edit.
- `640` **review** next-step, mirror / EMBODY: "{x}. The energy is {x}. {x}"  
  A full reading with no next step. Is the route one door away, or does this reading need one line naming it?

#### `atuned_src/ui/games.js`, reach 6. 1 flag

- `143` **flag** release-language, play / none: "The letting go run"  
  brief section 4: release, not let go. This collides with ruled protocol wording ("I am letting go of believing", DECISIONS.md), so it is an owner question before it is an edit.

#### `atuned_src/ui/character.js`, reach 6. 1 review

- `1039` **review** next-step, mirror / PLAY: "The {x}, which {x}. Of the archetypes seated under this mask, it is the one your blueprint leans on most. Its shape sits faint under the pix..."  
  A full reading with no next step. Is the route one door away, or does this reading need one line naming it?

#### `atuned_src/ui/cone.js`, reach 6. 5 review

- `2625` **review** next-step, mirror / PLAY: "Integrity is the hull. A hole in it means the ship takes on water, and everything above the waterline stops mattering. Integrity raises cohe..."  
  A full reading with no next step. Is the route one door away, or does this reading need one line naming it?
- `2833` **review** next-step, mirror / PLAY: "The compass. Two pyramids: one points up to coherent, one points down to decoherent, and the oscillating range sits in the gap between them...."  
  A full reading with no next step. Is the route one door away, or does this reading need one line naming it?
- `2864` **review** tooltip-one-idea, tooltip / PLAY: "Draw the seven seats as shells of light, one inside the other, each sized by its own tone. An address holding charge falls in and goes dark."  
  Is the second sentence a second idea? If so, it goes one door away.
- `2882` **review** tooltip-one-idea, tooltip / PLAY: "Light the whole figure by its radiance. It goes dark where a seat holds charge and where the field bends off your level."  
  Is the second sentence a second idea? If so, it goes one door away.
- `3134` **review** next-step, mirror / PLAY: "The run ended {x} days ago. Longest held: {x}. Practise today and a new one starts."  
  A full reading with no next step. Is the route one door away, or does this reading need one line naming it?

#### `atuned_src/engine/data/kb.js`, reach 7. 1 stop, 12 flag, 3 review

- `16` **stop** house:filler, information / none: "Declines the engagement before it can cost anything. Not fleeing discomfort the way the Escapist does, and not arguing the way the Negotiato..."  
  "Simply" carries nothing.
- `16` **flag** readability, information / none: "Projects the worst possible outcome onto every uncertainty. Distinguishable from Worrywart by magnitude, Catastrophizer reaches existential ..."  
  grade 18.4 against a target of about 9. Cause: the words: 2.55 syllables a word adds 14.5 grades, long words catastrophizer, distinguishable, existential, ordinary, uncertainty, every.
- `16` **flag** readability, information / none: "Supports others' destructive patterns to maintain relationship or avoid conflict. Distinct from Pleaser: the Enabler supports behavior they ..."  
  grade 12.1 against a target of about 9. Cause: the words: 2.00 syllables a word adds 8.0 grades, long words relationship, behavior, destructive, enabler, recognize.
- `17` **flag** readability, information / none: "physical courage, boundary enforcement, protection of what matters. Directed aggression at obstacles, not people."  
  grade 13.3 against a target of about 9. Cause: the words: 2.21 syllables a word adds 10.5 grades, long words enforcement, aggression, boundary, obstacles, physical, protection.
- `17` **flag** avoid-list, information / none: "codependency, possession, love as completion rather than addition."  
  therapy-speak (therapy).
- `17` **flag** release-language, information / none: "voluntary descent, the chosen ordeal, sacrifice as the mechanism that produces insight unavailable any other way. The knowledge that comes f..."  
  brief section 4: release, not let go. This collides with ruled protocol wording ("I am letting go of believing", DECISIONS.md), so it is an owner question before it is an edit.
- `17` **flag** diagnosis, information / none: "discernment of what's real and what's false. Accountability without cruelty. Moral disorder doesn't just feel wrong, it triggers the nervous..."  
  the language of a diagnosis. Say what was reported and where.
- `19` **flag** evidence, information / none: "Decoherence, the shadow number. All the weight held at all 112 addresses, added up, against the most they could hold. A high DQ means you ar..."  
  an interpretation stated as a finding. Qualify it ("appears", "may") or name what was reported.
- `19` **flag** diagnosis, information / none: "The part of what life taught you that does not wear off with time, with a big change in your life, or with most kinds of therapy. Only relea..."  
  a medical frame: a claim measured against care the instrument does not give.
- `19` **flag** avoid-list, information / none: "The way the body protects its own patterns. Blaming, changing the subject and making excuses are a tag fighting back, the way your body figh..."  
  therapy-speak (therapy).
- `19` **flag** release-language, information / none: "The main address carrying charge in a group of addresses around it. Clear it and the ones around it let go on their own. Work on the others ..."  
  brief section 4: release, not let go. This collides with ruled protocol wording ("I am letting go of believing", DECISIONS.md), so it is an owner question before it is an edit.
- `19` **flag** release-language, information / none: "Release that happens by reading. You read a Letting Go sequence, written the right way, and the body releases at the place the sequence name..."  
  brief section 4: release, not let go. This collides with ruled protocol wording ("I am letting go of believing", DECISIONS.md), so it is an owner question before it is an edit.
- `19` **flag** release-language, information / none: "When enough gates have cleared, the body starts releasing by itself. The soma lets go without you running the protocol. This is how you know..."  
  brief section 4: release, not let go. This collides with ruled protocol wording ("I am letting go of believing", DECISIONS.md), so it is an owner question before it is an edit.
- `16` **review** readability, information / none: "The moment control begins to slip. Uncertainty in outcomes. Others not performing to expectation. Delegation without confirmation. Silence w..."  
  grade 10.8 against a target of about 9. Cause: the words: 2.09 syllables a word adds 9.1 grades, long words confirmation, delegation, expectation, uncertainty, performing.
- `17` **review** readability, information / none: "disruption of rigid patterns, revealing what's hidden through inversion, innovation through disorder. Sees the absurdity in what everyone el..."  
  grade 10.7 against a target of about 9. Cause: the words: 1.86 syllables a word adds 6.4 grades, long words absurdity, innovation, disorder, disruption, everyone, inversion.
- `19` **review** readability, information / none: "The loop everything runs through, every moment. It starts in the field of awareness around you and goes through your senses, your nerves, yo..."  
  grade 10.5 against a target of about 9. Cause: the sentence: 27 words a sentence adds 10.5 grades.

#### `atuned_src/engine/data/compass.js`, reach 7. 8 flag, 6 review

- `62` **flag** readability, information / none: "Does this person access experience directly, or require verification before they allow themselves to feel?"  
  grade 13.1 against a target of about 9. Cause: the words: 1.93 syllables a word adds 7.2 grades, long words verification, directly, experience.
- `91` **flag** readability, information / none: "Map replacing territory permanently. The belief system defended against any experience that contradicts it."  
  grade 12.4 against a target of about 9. Cause: the words: 2.14 syllables a word adds 9.7 grades, long words permanently, territory, contradicts, experience, replacing.
- `118` **flag** readability, information / none: "The nervous system recognising coherent structure and stabilising around it. He arrived at maximum civilisational destruction."  
  grade 15.6 against a target of about 9. Cause: the words: 2.38 syllables a word adds 12.4 grades, long words civilisational, recognising, stabilising, coherent, destruction, maximum.
- `145` **flag** readability, information / none: "Pride as separation from Source. The highest functioning adversarial expression, hardest to detect, because it uses the vocabulary of cohere..."  
  grade 12.7 against a target of about 9. Cause: the words: 2.00 syllables a word adds 8.0 grades, long words vocabulary, adversarial, decoherence, separation, coherence, expression.
- `154` **flag** avoid-list, information / none: "Narcissism. Grandiose entitlement. The narcissist appoints himself arbiter of all things."  
  therapy-speak (therapy).
- `170` **flag** readability, information / none: "Chaotic destructive reactivity without self awareness. No gap between stimulus and response."  
  grade 12.3 against a target of about 9. Cause: the words: 2.17 syllables a word adds 10.0 grades, long words awareness, reactivity, destructive, stimulus.
- `171` **flag** readability, information / none: "Calculated manipulation and deliberate domination. Not reactive, strategic. Awareness is present and deployed against coherence."  
  grade 17.0 against a target of about 9. Cause: the words: 2.60 syllables a word adds 15.1 grades, long words manipulation, awareness, deliberate, domination, calculated, coherence.
- `310` **flag** avoid-list, information / none: "The narcissistic stack plus active suppression of empathy. Feeling right has become more important than feeling connected."  
  therapy-speak (therapy).
- `49` **review** readability, information / none: "Chaos engineered to prevent coherence. Betrayal as systemic strategy. Disruption from inside trusted systems."  
  grade 10.7 against a target of about 9. Cause: the words: 2.07 syllables a word adds 8.9 grades, long words betrayal, coherence, disruption, engineered, strategy, systemic.
- `113` **review** readability, information / none: "Maximum expansion, the state in which every other frequency can reorganise around the coherent signal. The body is the instrument."  
  grade 10.7 against a target of about 9. Cause: the words: 1.90 syllables a word adds 6.8 grades, long words coherent, every, expansion, frequency, instrument, maximum.
- `121` **review** readability, information / none: "Intensity moving through the body without destroying the container or the target."  
  grade 11.7 against a target of about 9. Cause: the words: 1.92 syllables a word adds 7.0 grades, long words intensity, container, destroying.
- `161` **review** readability, information / none: "Complete inversion. No flow, no movement, maximum resistance. Stasis at terminal velocity, not active evil."  
  grade 11.5 against a target of about 9. Cause: the words: 2.13 syllables a word adds 9.6 grades, long words velocity, inversion, maximum, movement, resistance, terminal.
- `308` **review** readability, information / none: "Grandiose entitlement. The self appointed arbiter. Personal situations described in strategic terms."  
  grade 11.5 against a target of about 9. Cause: the words: 2.17 syllables a word adds 10.0 grades, long words entitlement, arbiter, personal, situations, strategic.
- `440` **review** readability, information / none: "One quality carried to its maximum in service of something, with nothing decoherent running underneath it. This is the coherent pole of a mi..."  
  grade 11.8 against a target of about 9. Cause: the sentence: 24 words a sentence adds 9.6 grades.

#### `atuned_src/engine/sniff.js`, reach 7. 1 stop, 3 flag

- `176` **stop** house:caps, mirror / none: "CHILD holds {x} at the {x}, which is the {x} seat and not {x}"  
  "CHILD" in copy. Sentence case in body, title case in headers.
- `1161` **flag** readability, mirror / none: "the 13 nature and 15 human nature elements carry their shadow strings in reviews/elements.json, which is not in this repository, so they wer..."  
  grade 13.8 against a target of about 9. Cause: the sentence: 30 words a sentence adds 11.7 grades.
- `1220` **flag** readability, mirror / none: "the text matched {x} gate cues, and the sump is not computed without both upstream readings, because assuming them clean would report an avo..."  
  grade 12.9 against a target of about 9. Cause: the sentence: 27 words a sentence adds 10.5 grades.
- `1303` **flag** readability, mirror / none: "every shadow in the system has a named coherent opposite at the same address, and detecting the shadow is what names the replacement to offe..."  
  grade 13.5 against a target of about 9. Cause: the sentence: 25 words a sentence adds 9.8 grades.

#### `atuned_src/engine/plan.js`, reach 7. 2 flag

- `341` **flag** diagnosis, information / none: "Plant medicine is not on this list, because the book gives no rate for it."  
  a medical frame: a claim measured against care the instrument does not give.
- `368` **flag** diagnosis, information / none: "As many patterns as {x} therapy sessions would release."  
  a medical frame: a claim measured against care the instrument does not give.

#### `atuned_src/engine/compute.js`, reach 7. 1 flag

- `303` **flag** diagnosis, mirror / none: "the cure for {x}, done past the point where it helps"  
  a medical frame: a claim measured against care the instrument does not give.

#### `atuned_src/engine/data/figure.js`, reach 7. 1 flag, 1 review

- `166` **flag** readability, information / none: "Parshvasandhi, the flank over the kidneys: renal and suprarenal plexuses, the adrenal"  
  grade 12.7 against a target of about 9. Cause: the words: 2.00 syllables a word adds 8.0 grades, long words parshvasandhi, suprarenal, adrenal.
- `169` **review** readability, information / none: "Basti, above the pubic bone: the hypogastric plexuses, the pelvic splanchnic nerves that drive the bladder, the ganglia inside the plexus"  
  grade 11.7 against a target of about 9. Cause: the sentence: 21 words a sentence adds 8.2 grades.

#### `atuned_src/engine/data/nodes.js`, reach 7. 1 flag

- `6` **flag** avoid-list, information / none: "Higher Self anchor"  
  guru language (guru).

#### `atuned_src/engine/ladder.js`, reach 7. 1 stop

- `188` **stop** objection:abstract-word, notification / none: "Fifty. Close to half the architecture has been opened at least once."  
  A word that is always an abstraction standing in for a plain one.

Not read, and named: `atuned_src/engine/core.js` state and the tab tables. No copy; `atuned_src/engine/lexicon.js` the sniffer's match phrases. Input, not copy; `atuned_src/shell/foot.html` script tags; `atuned_src/shell/head.html` the stylesheet.

<!-- brief run: end -->
