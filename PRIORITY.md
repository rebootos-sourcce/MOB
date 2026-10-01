# Priority

The order. Owned by the project manager, scrubbed with the technical director
and the art director. `TASKS.md` stays the record and nothing here replaces it.
This file says what gets built, in what order, and what does not.

His instruction this round, verbatim: "Okay, review. Block it. Figure out where
it goes in our list." Read as: review what landed, block the new work out, and
place it in the order. That is what sections 1 to 3 are. If he meant block as
in hold something back, he has to say what, because nothing on this page is
held except the items already named as blocked.

## The stamp on this measurement

**Superseded. The current stamp is section 19, 30 September,** which places
the systems he brought in during rounds MS to NB: the two TDDs and their
audits, the creative brief, the onboarding storyboard and the masks design.
Sections 17 and 18 carry the 27 September state. This block is kept as the
record of what was true on 21 September.

Every count below was read off the file and off the run, not out of a document.
Where a document disagrees with the run, section 7 names the document.

    commit                  f87595d, two untracked paths in proto/
    TASKS.md                6,646 lines, md5 b22ddf038227
    QUESTIONS.md            264 lines, md5 84ea919d574c
    measured                21 September, 00:15 UTC

    open        [ ]         520
    his ruling  [?]         136
    specced     [~]          20
    built       [x]         317
                            993 lines carrying a state, 32 per cent built

    node tests/engine.js      1392 passed, 0 failed
    node tests/functional.js   773 passed, 0 failed
    node tests/collide.js      100 passed, 0 failed
    node tests/design.js       141 passed, 0 failed, in a stacked run
    node tools/monitor.js      all surfaces render
    ./atuned_src/BUILD.sh        div balance 0, no em dashes, 44 funnel tokens
    ./atuned_src/BUILD-engine.sh engine is host free, 402 exports

All four gates green, stacked, in one run, tonight. The build reproduces: a
fresh `BUILD.sh` against the committed `source.html` differs by one line, and
that line is the build stamp. The working tree was put back the way it was
found.

**What moved since the last stamp at 64529da.** Plus 55 open, plus 23 his, plus
51 built, in about three hours. The built column grew faster than the open
column for the first time on this page. Two commits landed under the read and
`TASKS.md` changed md5 twice while it was being counted, so the numbers above
are one atomic reading at one stated minute and not an average of several.

**So an ordering of 520 items is obsolete before it is read, and this file does
not attempt one.** It orders ten. Everything else is sorted into blocked,
stopped, or waiting behind a named ruling.

---

# 1. The order

**Status on 27 September, with the commits, is in section 17.** Rows 2, 3, 4
and 10 are built. Row 5 is built in the funnel. Row 6 is built in the funnel
and open in the app. Row 9 is overtaken. Row 1 is closed in substance except
the currency. Rows 7 and 8 are open.

| # | What | Who | Size | Depends on | Moves grade |
|---|---|---|---|---|---|
| 1 | The five rulings go to him with a snapshot each. `QC1-QC3`, applied to the five in section 2 | project manager, plus the seat that found each | small for five, large for all 136 | nothing | no, and it releases 136 items |
| 2 | A gate on the funnel's four pages | engineering | medium | nothing | yes, it is the only measurable half of `TN1` |
| 3 | `E2` / `AC1`, the second field leak | engineering | unsized, see section 4 | nothing | protects it |
| 4 | `ST1`, the page that reads the sentence twice | engineering | medium | nothing | yes, his worst graded surface |
| 5 | `CQR1-CQR3`, the seven band ring into the funnel | art direction, engineering | medium | nothing | yes, and it is his own drawing |
| 6 | The favicon, plus `TR1` and `TR2` | art direction | small | nothing | yes |
| 7 | `SY1-SY4`, the journal box concretes | UX, art direction, engineering | medium | nothing | yes |
| 8 | `CP7`, then `CP6` | engineering | small | a seat to clear `tests/functional.js` | no, it makes a gate honest |
| 9 | The left rail, measured and proposed. Not a build | UX architect | small, and it is reading | nothing | no, it makes the next ten buildable |
| 10 | The ritual reconciliation. Not a build. **Delivered 21 September** | project manager | small, and it is reading | nothing | no, same reason |

## The argument, one line each

**1. The five rulings go with a snapshot each.** He has now said the same thing
twice about the questions document. The eighteenth pass fixed that the lines
were statements. He came back with "I don't know what A2 kept is. All these
have no context. Give me context so I can answer them," and `QC1` records it.
136 questions across 40 sections are the single largest blocker in this
project, and they are blocked on us, not on him. **The scope decision is mine
and it is this: five snapshots now, not 136.** All 136 is large and it competes
with the deadline. The five in section 2 plus the generator gate at `QC3` is
small, and it is the only item on this page that moves a three figure number.

**2. A gate on the funnel.** `TN1` is his deadline and his words: "By tonight
we need our funnel and we need it tuned tight." Measured: this project has four
gates and **not one of them opens a funnel page.** `tests/design.js` mentions
the word funnel once, in a comment. `funnel/` carries `index.html`,
`about.html`, `buy.html` and `quiz.html`, and the only thing watching them is a
person looking at a screenshot. His standard at `TN2` is "nothing breaks,
nothing stalls, nothing reads as placeholder," and that is a gate's sentence,
not a judgement call. The app half of `TN1` is already green: four gates and
the monitor, measured tonight.

**3. The second field leak.** `E7` is done and gated. `tests/functional.js`
carries a group called "a stranger is a stranger, whoever was on screen
before", it asserts the delta across a round trip rather than a number, and it
is green in the 773. `E2` and `AC1` are the same defect and it is still not
found: in a full page sequence the person's own record carries a reference
case's charge before the release test starts. `saveYou()` is guarded on
`S.who===0`, so the fault is a path that claims the person's identity while a
reference field is still in `S`. Its own line says it goes before any new
surface and I am keeping that.

**4. The page that reads the sentence twice.** Measured in `DESIGN-story4.md`
on the 87 word story the four prototypes carry: the engine reads **8 hits and
the shipping page lights 4.** The scanner records `hit.at` on every hit and the
page throws it away, then re-matches with its own regular expression. So a
coherent word cannot be lit, an idiom cannot be lit as one thing, and the name
the engine already holds for "stayed quiet", which is `silenced`, is printed
nowhere. **This is not held by `SQ1`.** All four prototypes already wrote
`normMap` and `marksOf` to route around it, and the delivery says port that and
do not rebuild it. Whichever belief he picks, this lands underneath it.

**5. The seven band ring into the funnel.** `CQR3` is ruled: it definitely goes
in the funnel. It is his own drawing, from `46952ef`, the alpha he brought to
this project, and measured in that file it is 287 matches for ring and 64 for
arc, so it is a lift and not an invention. `CQR2` is why it matters: "It is a
truncated CQ. As you input information into it, it will show you what is going
on." The funnel's quiz shows a person nothing while they answer. `CQR4`, where
it goes inside the app, is his and he asked for it as a note rather than an
answer, so it does not block the funnel half.

**6. The favicon.** Measured: **zero matches for `favicon` or `rel="icon"` in
`source.html`, and none in any of the funnel's four pages.** Every tab this
product opens, in the app and in the funnel, shows a blank page icon. Against
`TN2`, a blank icon is the definition of reading as placeholder. `FV1` is ruled
and the ring is drawn and measured. `TR13` asks muted or vivid and is his, so
**it ships muted under the standing muted palette ruling and his answer later
is seven hex values, not a rebuild.** `TR1` rides along: `geometry.js:116`
draws u2 with no right stem above the bowl, which is a drawing defect and not a
preference. `TR2` rides along too and is a record fix, not a build: `PAL` in
`engine/data/canon.js` is the palette and three documents in `reviews/` carry a
different seven, Root 20 units apart in red alone.

**7. The journal box concretes.** `SY1` to `SY4` are the copy coming out, a
circular record button, a red light while the microphone is open, and click in
and type with no mode to choose. **All four prototypes keep a box, so these
four survive whichever belief wins.** `SY5`, the box carrying the weight of
what it is, is the one item that is a feeling rather than a rule, and it is
exactly what `SQ1` answers. So the box splits: four items build now, one waits.
That split is the reason item 1 on the last order is not simply blocked.

**8. `CP7`, then `CP6`.** Measured tonight off the running engine: the roster
is 14 long, index 6 is **Rosa**, and Gordon is **index 12**. `tests/functional.js`
at HEAD carries **17 call sites saying `loadP(6)`** with a comment beside them
saying Gordon, heavily loaded. The backlog line says nine, which means the
count in the line has already grown past itself inside one day. It is the
`loadP(8)` defect `CLAUDE.md` records, in the same file, and `GORDON()` already
exists there to fix it with. Another seat is live in that file tonight, so this
waits for that seat to land rather than fighting it. `CP6` is data: `CHILD.addr`
does not resolve to an address, four of the nine match a node's nerve name, one
ambiguously, and five match nothing.

**9. The left rail.** The navigation prototype was asked for a two level bar
and it delivered one, and then it said plainly that the bar is not where the
problem is. Measured on `source.html` by its own counter: **52 controls in the
left rail, on every surface but Settings, open on arrival, at both widths.**
First viewport at 1600 is 64 to 125 controls, median 76, against a working
memory of about four. The bar port moves 2 to 5 of a per surface 85 to 221,
which is 1 to 6 per cent. Item 9 is the rail measured and a proposal written.
It is not a build, and the bar port is in section 6.

**10. The ritual reconciliation.** Delivered 21 September as
`RITUAL-RECONCILE.md` and applied to `TASKS.md` the same night.

**The 114 in the line that used to stand here did not reproduce, and it was
mine.** The corrected figure at the commit this page stamps is **85 open, 25
his, 39 built across those 9 sections**, and the method is at the foot of
section 9. No definition that yields nine sections produces 114, and the
closest, 108, shares no column with 26 or 40.

**And the pile had not got worse. It had not moved.** Those nine sections read
85, 25 and 39 at `f87595d` and read 85, 25 and 39 again two passes and 1,125
added lines later, so "it got worse, 114 against 101" was an argument built on
a number that was never in the file. The reason for doing item 10 was still
sound and it is a better reason than the one given: the ritual was not the
largest pile in the project, it was the pile with the most finished work
sitting unmarked inside it. The reconciliation found 21 such items and they are
closed.

Read off the run at the applying commit, the same nine sections are **65 open,
23 his, 62 built** of 150 lines with a state, and **53 open, 22 his, 59 built**
once the 16 lines marked Not ritual work are excluded. What remains open there
is a port, not a spec: `RT22` prices the loop that four shipped fixes have
never been measured against, and item 5 of `RITUAL-RECONCILE.md` section 8 is
the port of `proto/ritual/ritual2.html` into the build.

## Where the order is arbitrary, said plainly

- **1, 2, 3 and 4 are parallel and the order between them is arbitrary.** Four
  seats, four files with no shared path: this file, `tests/`, the store and
  release path, and `ui/storyui.js`. Ranking them against each other would be
  theatre.
- **5 and 6 are one item in two parts.** Both are the mark, both are art
  direction, both land in the funnel and in `shell/head.html`.
- **7 can swap with 4** and nothing changes. They are the same surface and the
  same file, and if one seat takes both it should take them in this order
  because `ST1` changes what the box has to render.
- **9 and 10 can move anywhere in the ten** without cost, because neither is a
  build and nothing above them touches the rail or the ritual. They are placed
  at 9 and 10 so they happen this round rather than never.

## What came off the order, and why

- **`GT2`, the frame rate measurement.** It was item 3 last stamp because gate
  13 read 24.8, 20.9 and 21.3 frames against a floor of 30 in a stacked run.
  **It did not reproduce tonight.** Measured in a stacked run, after three
  other gates, all seven lightings: 54, 51.4, 60.9, 52.8, 61.1, 61.1 and 61,
  against a floor of 30. The rule in this repository is reproduce before
  fixing, so it comes off the order and stays on the list. `GT1` and `GT3`
  stand as written, because a gate that has cried wolf once will be doubted
  again.
- **`E7`.** Built and gated, see item 3.
- **`TD1-TD4`, the two dials, and `FE1`, `FE3`, the feathers.** They were items
  7 and 8. Two untracked prototypes appeared in `proto/dials/` and
  `proto/feathers/` while this was being measured, which means seats are in
  them now. They are not re-ranked here because a plan written across a live
  seat is a plan that arrives late.
- **`SI1-SI3`, `SX2`, `SX3`.** Real, unblocked, and displaced by three things
  that arrived since: a deadline, a defect under the surface they sit on, and a
  ruling that the story page is a D. They are the first things back on when
  items 1 to 7 land.
- **`LG1-LG7`, the logo.** Two rounds delivered and nine questions under them.
  The mark cannot be finished until he picks the cuts. The favicon is
  separable, so it is item 6 and the wordmark waits. See section 5.

---

# 2. The 136 that are his, ranked by what they unblock

**Read this first: as they stand he cannot answer any of them.** That is
measured, not inferred, and it is his own sentence at `QC1`. So this section
does two jobs. It names the five. And it says what has to be true about how
they are sent, which is item 1 of the order.

    measured    136 questions, across 40 sections
    measured    35 distinct section ids carry one, and 40 sections do, because
                13 section ids in this file are used twice

## The five, in order of what they release

### Q1. `D11`. The opening surface, and whether the avatar is a tab

Still the largest blocked pile on the list, and it grew.

    measured    82 open, 13 his, 33 built across the 6 avatar sections
    measured    25 per cent built, the lowest of any large subject
    measured    TABDEF carries 9 entries and none of them is the avatar

It also decides `RT9`, whether what the ritual sets is pulled from the avatar,
and `CL13`, where the reading picks the always on ritual by the darkest band
and the avatar picks it by the most live imprints, and for Marcus those are two
different seats.

**Snapshot he needs, and this is the shape every one of the five needs.** What
it is: the avatar is the thing he called the centrepiece, and today it is a
drill inside another surface. What is at stake: 82 items. Either way: a tab
means a tenth entry and a renderer; a drill means the character sheet folds
into Summary. Where to look: `proto/` has no avatar page, which is itself the
answer to why nothing has been built.

**Options:** the avatar is a tenth tab and the app opens on it; a tenth tab and
the app still opens on the Field; or it stays a drill folded into Summary.

**He should see this before he answers:** the opening surface has flipped twice
and `CLAUDE.md` records both flips. A third flip is affordable. A third flip
that is not written down is not.

### Q2. `SQ1`. Which of the four beliefs is the story page

New this round and it is the cheapest large answer on the page, because the
work is done and sitting in a folder he has never been pointed at.

    measured    25 open, 6 his, 14 built across the story page sections
    measured    four prototypes, twenty screenshots, all looked at
    measured    choices on the surface: mirror 28, page shipping today 39,
                instrument 40, body 47

He said the story page is a D and asked for four designs from art and creative.
They exist: `proto/story4/instrument.html`, `mirror.html`, `body.html`,
`bench.html`, and `index.html` carries all four with the belief written on
each. **The ask is not which layout. It is which sentence is true about the
surface,** because the drawing follows the sentence. The seat's own
recommendation is the mirror, with the body second on a case it says it cannot
measure.

Released by one answer: `SY5`, and with it `SQ2`, `SQ3`, `SQ4` and `SQ5`, which
are four sub decisions of the same belief and should not be asked separately.

**Options:** the instrument, which gives the journal an axis; the mirror, which
refuses to touch the sentence and answers beside it; the body, which draws the
route on the anatomy; the bench, which treats the story as stock. Or the
sentence that is right, if none of the four is it.

### Q3. The twenty one laws, and what coherence is. `SN5`, `SN6`, `SN7`, asked once

**Ask him once, not three times.** The sniffer spec and the engine disagree
about which twenty one laws: 19 are shared, the spec has Ownership and Wisdom,
the engine has Responsibility and Accountability. That is the divisor. The spec
then defines coherence as the mean of the laws times ten; the engine computes
`CQ=(It*Ig)/Rz`. Malignancy is computed off coherence, so either definition
takes a blank profile from malignant to benign.

**This moved up because of the deadline.** `CQR2` puts a truncated CQ in the
funnel, filling as a person answers, which means the funnel now prints a number
whose definition is in dispute. It was a correctness question. It is a shipping
question tonight.

Downstream and released by one answer: `BM5`, `FD10`, `SP12`, `SP13`, `D16`,
the whole lean surface, the funnel's result number, the seven band ring, and
the tier ladder in `DECISIONS.md`, which is priced on CQ.

**Options:** adopt the spec's definition and accept that releasing every charge
moves coherence by nothing; keep the engine's and correct the spec; or keep
both, with the spec's as a second reading under its own name.

### Q4. The currency. Karma, points, or patterns

**Cost to him: one word.** Three words are live for one thing in three current
documents. `DESIGN-progression.md` rules exactly one currency, patterns, and
asks for a build gate against a second. `PRODUCT.md` says points. `AK2` says
karma.

It got more urgent this round without changing a letter. `GB1` is newly ruled:
"It sounds like you need to send the team on the scoring, the badge and
achievement system. So I want to go ahead and do that." **That team cannot cost
a single badge until the unit has a name.** It also settles what a mark is
worth, whether a balance is a number a person sees, and the gate that
`DESIGN-progression.md` is waiting to have written.

### Q5. `RV7`. The audio, asked once with `RV13`

He ruled the release flow high priority. Its whole `RV` block is blocked on
this and nothing in it can start.

    measured    source.html 1,544,375 bytes
    measured    atuned-slim.html 1,041,262, and the build already had to be
                compressed to arrive at all
    measured    embedding the frame at 16 kbps is 160 kilobytes, 29 per cent
                on the wire
    measured    synthesis is zero bytes, because the whole sound system is
                3,210 characters of code
    standing    one file, no dependencies, no network, and gate 7 watches it

The team's own recommendation, which he can simply take: synthesise now, embed
the frame when the recording exists.

**Two things ride with it and no answer unblocks them.** `RV1` needs a
recording only he can make. `RM1` names a mobile app whose release flow he
wants reviewed five times, and it is not in this repository.

## The next two, and both are cheap for him

- **`SX1`. The word that replaces "addresses".** He ruled the word out: "a
  meaningless term to a person." He has not given the word in. It is the
  largest language sweep on the list and every surface built before he answers
  prints the word again. It is not in the five only because nothing is blocked
  from starting by it, and it gets more expensive every round.
- **`TR13`. Muted or vivid, for the favicon.** Item 6 of the order ships muted
  under the standing ruling. His answer after that is seven hex values. He
  should be told that, so he does not think he is holding the favicon up.

## The other 129

They are real and they are not urgent. The honest sort:

- **Blocks one surface and nothing else.** `CP4` and `CP8` (three surfaces draw
  the nine child emotions and none says which are found, and widening before
  the ruling means three surfaces to move back instead of one), `CB4`, `CB9`,
  `CB10`, `RQ1-RQ5`, `CL12`, `CL14`, `CL15`, `SW6b`, `SW7b`, `SW8-SW10`,
  `AH5-AH7`, `AM4`,
  `AM5`, `PC3`, `MN8`, `CQR4`, `D4`, `D5`, `D7`, `D8`, `D20`.
- **Blocks a claim, and the claim is a real exposure.** `PO2`, the word "heals"
  is a regulated therapeutic claim and the funnel cannot ship carrying it.
  `D10`, the therapy equivalence claim, same. `SF6`, six people in the roster
  reach a surface naming Psychopathy and Machiavellianism with a clinician on
  screen, and it has never fired. **`PO2` is now on the deadline path,** because
  the funnel is what ships tonight and the funnel carries the positioning line.
- **Blocks an asset only he can supply, so no answer unblocks it.** `VID1` and
  `D3`, the universal law videos. `NS3`, the five nerve state icons. `SP14`,
  `SP15` and `SP16`, three files named in his own spec as ours to load.
- **Blocks nothing and can wait for ever.** `Q3` to `Q13`, the nine cut
  questions `TR6` to `TR12` and `TR14`, `FV3`, the wording questions, and the
  two collisions in `OB25`. Worth having answered one day. Nothing stops today.

---

# 3. Blocked versus merely unstarted

These look identical on the list. They are completely different to plan with.

## Actually blocked. Effort cannot move them

| What | Open items | Blocked by | Can it be unblocked |
|---|---|---|---|
| The avatar and the character sheet | 82 across 6 sections | `D11` | yes, one ruling |
| The story page's look | `SY5` and 4 sub questions | `SQ1` | yes, one sentence, four prototypes to look at |
| The `RV` release flow | 6 | `RV7`, and `RV1` needs his voice | ruling, then an asset |
| The badge and achievement ladder | 24 | the currency word | yes, one word |
| The child pattern's three surfaces | `CP8`, plus `CP5` | `CP4`, and `CP5` is a schema change | yes, one ruling |
| The chakra band | 5 | `CB9`, nothing says what high and low in a band mean | yes, one ruling |
| The universal law films | 4 | the files are on his drive, unreachable | only by handing them over |
| The nerve state icons | 4 | the artwork is not in the repository | only by handing them over |
| The sniffer's own lexicon | `SP14`, `SP15`, `SP16` | three files his spec says to load, not in the repo | only by handing them over |
| Everything needing a server | about 20 | `AS2` does not exist | yes, by deciding to build it |
| The mobile release flow review | 1 | `RM1`, the app is not in this repository | only by handing it over |
| **All 136 questions** | **136** | **`QC1`. They have no context and he has said so** | **yes, and it is ours to fix, not his** |

That last row is the change in the shape of this section since the last stamp.
The largest blocked pile in the project is blocked on us.

## Merely unstarted. A seat could open the file tomorrow

**Every one of the ten is in this column.** The five snapshots, the funnel
gate, the second field leak, the double read of the sentence, the seven band
ring, the favicon, the four journal box concretes, the roster index, the left
rail measurement and the ritual reconciliation. None is blocked and none of
them needs him first.

**The shape of the problem, in one sentence, and it has changed.** Last stamp
it was that the work you can act on is a thin layer at the top. Tonight the top
layer is thicker, the built column grew faster than the open column for the
first time, and the binding constraint is no longer a shortage of unblocked
work. It is that 136 answers are sitting behind a document defect we own.

---

# 4. The technical director's column

What it costs, and what it costs if it is done later rather than now.

## Gets much more expensive with every day of real records

**These are the schema items and they are the reason the order matters.** There
are no records off device today, so all of this is free. The moment `AS2`
exists, every one of them is a migration against live data.

- **The history whitelist.** `validateProfile` rebuilds every snapshot from a
  16 key whitelist. Measured: 16 keys written, 15 returned, `lean` silently
  dropped, and it returns `ok: true` while doing it.
- **Schema v2.** Named as his. The gates bump is additive and v1 still loads,
  which is exactly the property that expires the day a second party holds a v1
  record.
- **`Root_08_Unnamed`.** It carries no fetter, so the root can never fully
  conduct and the kundalini rise can never read 100 for anybody.
- **`CP5`, a field to keep a childhood imprint in.** New this round and it is
  the same class. `AGE_ANS` is a variable inside the drill, the blank profile
  has no age shaped key, and `ageFinding()` returns a finding that dies with
  the tab. The age ladder measures 0 on every profile in the roster and not
  because nobody has a childhood imprint. **That reading cannot be built at all
  until the finding is stored.**

**The ruling this implies:** answer the server question before building the
service, and land the schema items in the gap between the answer and the build.
That gap is the last cheap moment and it closes once.

## Gets more expensive with every surface built

- **`SX1`, the addresses rename.** 212 string literals across 33 files,
  including `engine/data/canon.js` and `cards.js`, which are the codex. Items
  4, 5 and 7 of the order all print the word.
- **The wordmark.** Drawn once and referenced at four sizes, and the boot
  animation builds the mark from its own paths, so the animation is rewritten
  with it. The favicon at item 6 does not carry this cost, which is why the two
  are separated.

## Gets cheaper, or already did, and the list has not noticed

- **`ST1`.** All four prototypes wrote `normMap` and `marksOf`, which rebuild
  the engine's own normalisation and keep the original index of every
  character. The work is written four times. It is a port.
- **`ST4`.** `parseStory().path` has returned order, distance, direction, dwell
  and both ends on every parse since it was written and **no surface draws one
  step of it.** The invention the story page was asked for is already computed.
- **`CQR1`.** The ring is in `46952ef`, in the repository's own history. Nobody
  has to draw it.
- **`TD3` and `TD4`.** `leanSeries()` in `engine/verp.js` is written, exported,
  covered by the engine gate, and has zero UI callers. Still true, and two
  untracked prototypes appeared in `proto/dials/` tonight, so a seat is on it.
- **`BL2` is stale and must be re-measured before it is built.** It says the
  release ceiling "already exists as a number and nothing surfaces it."
  `ui/release.js` and `ui/summary.js` both read it. Part of it landed.

## Costs a little more every round it is not done

- **The ritual reconciliation.** Done, 21 September. The 114 was mine and did
  not reproduce: 85 open across 9 sections at this page's own stamp, and the
  pile had not moved between two stamps rather than growing. Every pass still
  adds a section without retiring one, which is the finding that survives.
- **`CP7`.** The line says nine call sites. There are 17. The line is a day
  old. Left alone, the fix grows while the defect sits still.
- **`GT1` and `GT3`.** Gate 13 read green tonight, which does not retire the
  finding that a red frames line costs a manual re-run and a judgement call.

## Unsized, and what would size it

I will not invent a number for these.

| What | Why it is unsized | What would size it |
|---|---|---|
| `E2`, `AC1` the second field leak | not reproduced, and a clean page shows nothing | a failing test that demonstrates it in the full sequence, which is this project's own rule |
| `SY5` the box carrying its weight | it is a feeling, not a rule, and the list says so | `SQ1` |
| `SR5` the release buttons | named by him, not specified | a proposal, not a guess |
| `RV5` the counts | depends on whether it is heard or read | `RV7` |
| The avatar page | depends on whether it is a tab | `D11` |
| `SIM1-SIM4` the ninety day run | `SIM4` says one already exists at `reviews/sim-ninety-days.html`, 83 kilobytes, unread | reading that first and saying what moved |
| `R1` the knowledge base restructure | specified against a surface that has since been rebuilt | a re-scope against the deck of cards that now exists |

---

# 5. The art director's column

The calibration for "everywhere" is in the record. A design language change is
seven lightings by nine surfaces before the funnel, and the saturation bump
moved 17 colours in 4 tables plus the boot sheet's own copy of the palette,
which carries a gate that fails if the two part company, plus
`funnel/tokens.css`, which `BUILD.sh` generates and the run reports as 44
tokens. Five files and a gate. That is the floor, not the ceiling.

## One surface. Schedule these as surface items

- `SY1-SY4`, the journal box concretes. `ui/storyui.js`.
- `ST1`, the highlighter. Same file.
- The favicon. `shell/head.html`, plus the funnel's four pages.
- `TR1`, the u2 stem. `geometry.js:116`.
- `CQR1-CQR3`, the ring, in the funnel only.
- `SI1-SI3`, the imprints panel.
- `RL1-RL4` and `RC10-RC13`, the release panel and controls.
- `TD1-TD4`, both dials, and `FE1`, `FE3`, the feathers.

## Design language. Do not schedule these as surface items

- **`SX1`, the addresses rename.** 212 string literals, 33 files, reaching the
  codex, so `BOOK-ERRATA.md` needs a pass in the same breath. Still filed
  beside `SX2` and `SX3`, which are both one surface. Splitting them is still
  the single most useful edit anybody could make to that section.
- **The wordmark, `LG1-LG7` with `TR6` to `TR14`.** `LG3` says the blue moves
  per lighting and `LG4` says the white dot does not, so the mark is specified
  seven times, then at four sizes, then in the boot animation which builds it
  from paths. Nine of the cut questions are his and the mark cannot be
  finished under them. **The favicon is separable and the wordmark is not,**
  which is the whole reason item 6 exists and the logo is not on the order.
- **`TR2`, the palette's provenance.** Three documents in `reviews/` carry a
  seven that is not the code's. The code is the palette and the documents move.
  This is the stale count defect one layer out, in a file that is not a gate,
  which is the hardest place to catch it.
- **`N4` and `AR1`, the copy editor pass on every number.** Standing. A
  property, not a task, and it gets re-broken by every new surface.
- **`CP` the copy sweep and `TX` the scale phrasings.** Both whole product by
  name, both filed as ordinary items.
- **`SX2`, all the counting subtext goes.** Reads as one surface and is not:
  the story page, the release, the ritual and the Summary.

---

# 6. What to stop

Nothing here is deleted. Every line stays in `TASKS.md` with its wording. These
are marked, with the reason, so they stop competing for attention.

## Stopped by his own ruling

**The onboarding block. 29 open and 3 of his.** Measured by identifier across
`OB`, `SIG` and `OBS`. He ruled onboarding off, `PZ2` records it, the seat
stood down and wrote what it measured to `DESIGN-onboard.md`. `TN1` restates it
in his own words this round: "If we don't have onboarding, no sweat." **It is
the single largest stoppable pile on the list and he has now stopped it twice.**

**Overtaken, 30 September.** He restarted it: round MH, "do onboarding and
tutorial, first", the redesign at MP, built at `a9c2e28`, and his own
storyboard at MU. Its current lines are section 19, cluster E.

**Two exceptions, keep them.** `OB22` is a real defect:
`proto/signal/signal.html` prints 62 out of 100 and 74 degrees out of 180 on a
reading. And `OB24`, the one progress object where the ring is the indicator
and progress is angular rather than ordinal, is worth keeping whether or not
onboarding is ever built, because it is the loop drawn correctly.

## Not this round, and it is ruled work

**`MN1-MN7`, the two level navigation bar.** This is a no and it is mine to
say. It is ruled and the port is specified to the line in `DESIGN-nav.md`, with
a prototype, a request log and ten checks written for the functional gate. It
is still not this round, for three measured reasons. It touches the bar markup,
`setTab`, the stylesheet, the gutter and every one of nine surfaces, on the
night his standard is "it can't break." It buys 2 to 5 fewer choices against a
per surface 85 to 221, which is 1 to 6 per cent. And its own delivery says the
next move on cognitive load is the left rail, not the bar. **The right response
to that delivery is item 9, not the port.** The port goes first thing after the
deadline, and `MN8` should be answered on the seat's recommendation, which is A
with one condition, rather than held open.

## The product has moved past it, and the line now says something false

**`AO0`. "The funnel. Zero pages exist."** `funnel/` holds four pages plus
`tokens.css` and the screenshots. The line is false and it is the exact defect
this repository has written down. It must not stay as it is, telling the owner
the funnel does not exist on the night he is shipping it.

**`R1`, the knowledge base restructure, as written.** The KB was rebuilt.
Building `R1` as written would regress the rebuild. Re-scope, do not build.

**`2g`, the closing review, `AP1-AP5`.** Real work, and it will never again be
the most important work in its current form, because the product it was written
against has been rebuilt underneath it. **And it now collides with `SIM1-SIM4`,
newly ruled,** which asks for the same thing with a stability requirement on the
grade. The two should be one item. `SIM4` already says a ninety day simulation
exists at `reviews/sim-ninety-days.html`, a product older and unread. Read it
before building a second and say what moved.

## Two seats solving the same thing from different ends

**The avatar has two incompatible designs and nothing reconciles them.** One
says the product opens on the avatar and the kundalini is the progress bar. The
other says it is a character sheet whose stats are ceilings being held down.
Those are different products. `D11` is where that starts.

**The always on ritual has two sources that disagree.** `CL13`.

**The currency has three words in three documents.** `Q4`.

**The ritual page has been specced nine times.** 85 open, 9 sections, 39
built, correcting a 114 of my own that did not reproduce. Stop adding ritual
specs. Item 10 was the reconciliation and it is delivered: 21 items closed, 6
folded, 1 cut, 24 identifiers disambiguated. The nine sections now read 65
open, 23 his and 62 built.

**And the questions document has now been fixed twice and is still broken.**
The eighteenth pass made every line ask something. The nineteenth pass records
that he still cannot answer them. That is two passes spent on the container. The
third one has to ship five answered questions, not a better container, which is
why item 1 is scoped to five and not to 136.

## Real, and will never be the most important work again

- **`MK2`, the masks as pixel art.** His original idea, so not mine to kill.
  `MK12` states the problem against itself: this product's look is argued from
  autonomic response and pixel art is a different argument. Mark it as needing
  its argument before it is scheduled.
- **`AI3`. "He does not like the design. Run it again."** Not actionable as
  written. It needs the specific objection or it will be run again and disliked
  again. `QC1` is the same failure in the questions document, so this one now
  has a precedent to be fixed by.
- **`R6`. Every piece of art gathered for his ruling.** A process, not a task.

## One item filed in three places, which is three items' worth of attention

- The avatar as a page: `N2`, `AO3`, and the whole character sheet block.
- The release rebuild: `C3` in two sections and the whole `0c2` block.
- The Summary rebuild: `N3`, `AH1`, and `GL`.
- **The favicon: `FV4` and `TR5`,** which are the same open item in two
  sections of the same pass. See section 7.

---

# 7. The duplicates, folded. This is a decision, not a copy edit

Nine folds. Eight of them are among the 136 questions and one is in the open
column. Every line number is off the md5 in the stamp.

| Topic | Lines | Survives | Why that twin |
|---|---|---|---|
| The audio bytes | `RV13` at 601, `RV7` at 795 | **`RV7`** | It states the ruling as a ruling and names the one file constraint. `RV13` carries the better arithmetic, so its numbers move up into `RV7` and `RV13` closes pointing at it |
| The always on colour | `RQ3` at 1584, `CL12` at 2164 | **`CL12`** | It names what is built and why, Root because the practice marks seat there. `RQ3` adds only that it is visible at week scale, which becomes a line inside `CL12` |
| The currency word | 2884 and 3216 | **the line at 2884** | It is the one that says it blocks work and names all three documents. The later one adds the costing argument, which moves up |
| A karma balance as a number | 2904 and 3222 | **the line at 3222** | It is the one with the evidence: the prototype prints it, so there is something to look at. The earlier one is the rule with no exhibit |
| The lexicon's provenance | 3285 and `Q2` at 3866 | **`Q2`** | It carries the word counts, 87 of 192 authored words in the book, 105 not, 8 of 124 idioms. The earlier one carries no measurement |
| The Universal Law videos | `VID1` at 3562, 4469 | **`VID1`** | It names the path on his machine and why this container cannot reach it, which is the whole answer he needs to act on |
| The opening surface | 3398 and `D11` at 4900 | **`D11`** | It carries the history, and the history is the argument: this has flipped twice already |
| The favicon's absence | `FV4` and `TR5`, same pass | **`TR5`** | It states the measurement, zero matches for `favicon` or `rel="icon"`, so it can be checked. `FV4` asserts the same fact with nothing behind it |

**And the ninth candidate, which I am ruling is not one.** `D3` asks where the
videos live at 15.4 megabytes against a one file build with no network. That
reads like a third copy of the videos question and it is not: `VID1` is how we
get them and `D3` is where they go once we have them. Both have to be answered
and only one of them is answerable today. So `D3` stays, and it is marked as
downstream of `VID1` rather than folded into it.

**What the fold is worth.** 136 questions become 128, and more importantly the
five in section 2 are five and not eight. Three of the eight folds sit inside
the five: the audio, the currency and the opening surface were each asked
twice, and sending him a list where three of five questions appear twice is the
fastest way to have the list ignored again.

**Where the folding happens.** I do not own `TASKS.md` and have edited nothing
in it. The fold is recorded here with line numbers, and the seat that owns that
file applies it, or the generator at `tools/questions.js` applies it on the next
run by collapsing lines that name each other. A generator that emits two copies
of one question is the same class of defect as `QD1` and `QC1`, and it should be
gated the same way.

---

# 8. Defects in the record itself

This repository's own rule is that a number typed into a document the product
then grows past is the same defect as a number typed into a gate. Here are the
ones measurable tonight. I do not own these files and have not edited them.

**The gate counts.** `CLAUDE.md` cut its own column, which was the right fix,
and the dated sentence that replaced it reads 1083, 741, 100 and 105. Tonight
the runs read **1392, 773, 100 and 141.** The sentence is dated on purpose so
it is not wrong, and it is worth noting that the design gate has grown from 105
to 141 in a day, which is why nobody should type it anywhere again.

    TASKS.md line 3895 says the design gate is 105 of 105, three times over.
    It is 141. It sits in a dated block, so the honest fix is to date the
    line, not to correct the number.

**`CP7`'s own count is already stale.** The line says nine call sites say
`loadP(6)`. Measured at HEAD: **17.** The line is one day old. That is the
tenth time this repository has been bitten by this, and this one was bitten
inside twenty four hours.

**`AO0` claims the funnel has zero pages.** It has four, and he is shipping
them tonight.

**`BL2` claims the release ceiling is surfaced nowhere.** Two files read it.

**The list's identifiers still do not identify, and it is measurably worse.**

    measured    929 lines carry an identifier, 864 distinct
    measured    59 identifiers used more than once, across 124 lines
    measured    67 sections, 54 distinct ids, so 13 section ids are ambiguous
    measured    64 lines carrying a state carry no identifier at all

This cost a real measurement tonight. Counting the sections that carry a
question **by identifier gives 35. Counting them by occurrence gives 40.** Five
sections are invisible to anything that keys on the id, and the generated
`QUESTIONS.md` is right because it counts occurrences. `CP1`, `CP2` and `CP3`
now mean both the child pattern build and the whole product copy sweep, in the
same file, both live. `RL1` still means two unrelated things.

**Recommended, and it is cheap:** an identifier that means two things takes a
letter, so `RB1` in section `0y` becomes `RB1y` and `RB1` in `0v` becomes
`RB1v`. The old identifier stays visible as the stem because it is quoted from
other documents and from `QUESTIONS.md`.

**This corrects the recommendation that stood here, which was a section prefix
like `0f.RL1`.** That form cannot be parsed: `tools/questions.js` reads an
identifier as letters, then digits, then one optional letter, so `RL1f` is read
and `0f.RL1` is not, and the owner's own questions document is generated by
that reader. The letter also follows a convention this file already set at
`SW1b` and `SW1c`. Applied 21 September to 24 identifiers in the ritual
sections. 46 collisions are still live elsewhere in `TASKS.md`, none of them in
those nine, and `CP1` and `RL1` are no longer among them.

---

# 9. The shape of the list, measured

Grouped by subject rather than by the pass that wrote it. Same 993 lines,
counted a second way. **Method: by section, and the sections are named,
because counting by identifier undercounts and section 8 says why.** The
ritual row is the nine sections that `grep '^## .*RITUAL' TASKS.md` returns,
which on 21 September are `0h2`, `0j2`, `0m`, `0q`, `0t`, `0y`, `0d`, `0f` and
`0v`, the last of them being the D minus pass and not the fifth pass calendar.
Run the grep rather than trusting the list. Every other row names its subject
and not its sections, so every other row is unchecked by anybody reading this
page, which is the same defect one row down from where it was caught.

| Subject | Open | His | Built | Per cent built | Sections |
|---|---|---|---|---|---|
| Ritual | 85 | 25 | 39 | 26 | 9 |
| Avatar and character sheet | 82 | 13 | 33 | 26 | 6 |
| Story and release | 39 | 12 | 26 | 34 | 6 |
| Onboarding, stopped | 29 | 3 | 13 | 29 | 3 |
| Logotype and favicon | 18 | 12 | 24 | 43 | 3 |
| Funnel and quiz | 20 | 5 | 6 | 19 | 7 |
| Sniffer and lexicon | 17 | 21 | 4 | 10 | 3 |
| The nineteenth pass | 13 | 1 | 0 | 0 | 1 |
| Navigation | 10 | 1 | 1 | 8 | 1 |
| Whole file | 520 | 136 | 317 | 32 | 67 |

**The list is not 520 tasks. It is about a dozen subjects, each specced between
one and nine times, with no later spec retiring an earlier one.**

Three readings fall out and all three change a plan.

**His instinct was right and the team has answered it.** Last stamp, story and
release carried 30 open and **1 built**, the lowest ratio on the page by a
factor of thirteen. Tonight it is 39 open and **26 built**, at 34 per cent,
which is above the file's own average of 32. Two passes went at it in three
hours. **That finding is retired by measurement and should not be repeated.**
The surface still grades a D, which is now a design question and not a neglect
question, and `SQ1` is the whole of it.

**The ritual and the avatar are 167 open items, 32 per cent of the open column,
and neither can be built tonight.** One needed a reconciliation and the other
needs a ruling. That is where the weight sits and it is not where the work is.

**The gap is not widening, and the sentence that said so was arithmetic on my
own bad number.** With the ritual corrected from 114 to 85, the pair is 167,
which is exactly the 167 of the last stamp. The reconciliation is delivered
and it takes the ritual's open column to 65, so the pair is now 147 and
falling for the first time.

**The sniffer is the worst ratio on the page and nobody has noticed.** 17 open,
**21 of his**, 4 built, 10 per cent. It is the only subject where his column is
larger than the open column, which means it is not under specced or under
built. It is waiting, and three of the things it waits for are files his own
spec says are ours to load.

## The part of the file nothing counts

    measured    the last line carrying a checkbox is 5079
    measured    lines 5080 to 6646 carry none
    so          1,567 lines, 24 per cent of the file, is the record half

Work lives in there, in prose, that no count reaches. "The numbers,
everywhere", "Tooltips on every number and every button", "Screen zones",
"Badges, achievements and score" are requests of his sitting in paragraphs,
some since built under other names and some never started, and nothing
distinguishes the two. `AC1`, item 3 of the order, lives in there: a corruption
defect that no count on this page would reach.

The record must not be compressed. That is what has kept this project honest.
But the items inside it should be mirrored into the ledger as checkboxes so
they are counted, and the prose left exactly as he said it.

---

# 10. Not doing this round

Named, so nothing disappears quietly.

- **The two level navigation bar, `MN1-MN7`.** Ruled work, fully specified,
  and it is a no this round. Section 6 has the three reasons.
- **The wordmark, `LG1-LG7`.** Blocked on nine cut questions that are his. The
  favicon is item 6 and the wordmark waits for them.
- **The whole avatar and character sheet.** 82 items. Blocked on `D11`.
- **`SY5` and the story page's look.** Blocked on `SQ1`. The four concretes
  build, the feeling waits.
- **The `RV` release flow, the heard half.** Blocked on `RV7` and on a
  recording only he can make.
- **The ritual build.** 85 items at this stamp, correcting a 114 of mine, and
  65 after the reconciliation landed on 21 September. Item 10 reconciled it and
  is delivered. Nothing is built from it this round, and `RT22` is the first
  thing that should be: the four shipped loop fixes have never been measured.
- **The badge and achievement ladder, `GB1`.** Newly ruled and it cannot be
  costed until the currency has a name. The design brief can be written; no
  number in it is real until `Q4`.
- **The ninety day simulation, `SIM1-SIM4`.** Newly ruled and large. `SIM4`
  says one already exists, unread. Reading that and saying what moved is the
  first deliverable, not a second simulation.
- **All 136 snapshots.** Five this round, by decision. The generator gate at
  `QC3` lands with them so the rest gain a snapshot as they are touched.
- **`SX1`, the addresses rename.** Blocked on one word, and it should land
  before the ritual and avatar surfaces, not after.
- **Anything needing a server.** About 20 items.
- **The chakra band, the universal law films, the nerve state icons, the three
  sniffer files.** Blocked on rulings or on assets that are not in this
  repository.
- **Onboarding.** Stopped by his ruling, twice, not deferred. **Overtaken 30
  September:** restarted by him at MH, MP and MU. Section 19, cluster E.
- **The schema items, including `CP5`.** Deliberately held until the server
  question is answered, then done immediately, in the gap before the service is
  built. That gap is the last cheap moment.

---

# 11. Needs a ruling

**On 27 September four of these five are ruled or overtaken, and only the
currency is still his. Section 17 has the evidence.**

Only the ones where the answer changes what gets built. The full argument for
each is in section 2, and **none of these goes to him as it stands.** Item 1 of
the order is the snapshot each one needs: what it is, what is at stake, what
happens either way, and the file to look at.

1. **The opening surface, and whether the avatar is a tab.** `D11`. Releases
   82 items. Options: a tenth tab and the app opens on it; a tenth tab and the
   Field still opens; or it stays a drill folded into Summary.
2. **Which of the four beliefs is the story page.** `SQ1`. Releases the surface
   he graded a D, and four prototypes are built and waiting in
   `proto/story4/`. Options: the instrument, the mirror, the body, the bench,
   or the sentence that is right if none of them is.
3. **The twenty one laws and the coherence definition.** `SN5`, `SN6`, `SN7`,
   asked once. On the deadline path now, because the funnel is about to print a
   CQ. Options: adopt the spec, keep the engine and correct the spec, or carry
   both under separate names.
4. **The currency.** Karma, points, or patterns. One word, and the badge team
   cannot start without it.
5. **The audio.** `RV7`, with `RV13` folded in. Options: embed as base64 at 160
   kilobytes, fetch at the sign in seam and fail the network gate, or
   synthesise and embed his frame when the recording exists.

Two more that cost him one word each and that he should be told are not holding
anything up: **`SX1`**, the word that replaces "addresses", and **`TR13`**,
muted or vivid for the favicon, which ships muted tonight either way.

Three that are small for him and are the ones a lawyer would find first:
**`PO2`** the word heals, which is on the funnel and therefore on tonight,
**`D10`** the therapy equivalence claim, and **`SF6`** the safety referral that
names Psychopathy on screen and has never fired.

---

# 12. 25 September. The forty two, blocked out and placed

His instruction this round, verbatim: "Create a plan, add to the tasks. Block
this plans and then show me the list." Read the way the preamble reads the last
one: block means group and sequence into the order, not hold back. He named
nothing to hold, so nothing below is held except what waits on a named ruling.

What landed is `AU1` to `AU18` and `AV1` to `AV24` in `TASKS.md`, 42 defects
found by seven seats asked to document the product for the desktop port, not
to audit it. This section places them. It does not reorder sections 1 to 11,
and where one of the 42 is already an item there, it says so and does not list
it twice.

## The stamp on this measurement

    commit                  d90bf98, tree clean at the start of the read
    TASKS.md                8,889 lines, md5 ebd1693db0cd, read before this
                            pass added its two pointer notes
    AU                      lines 8658 to 8763, 18 items
    AV                      lines 8765 to 8889, 24 items
    measured                25 September, 13:41 to 13:46 UTC

    open        [ ]         567
    his ruling  [?]         155
    specced     [~]          20
    built       [x]         433
                           1175 lines carrying a state, 37 per cent built

    method      grep -cE "^\s*[-*]?\s*\[\X\]" TASKS.md, once per state

**The 42 are in none of those four counts.** Not one AU or AV line carries a
checkbox, measured: zero matches for a state in lines 8658 to 8889. They sit
in the record half that section 9 says nothing counts. Mirroring them into the
ledger as checkboxes is recommended and not done here, because it moves every
count above and that is a change to make on purpose rather than as a side
effect of a plan.

**The difference from the 21 September stamp is not a measurement of
movement.** That stamp did not write its method down and this one does, so the
two are not known to count the same thing. From here on the method is above.

    node tests/engine.js       1464 passed, 0 failed
    node tests/functional.js    852 passed, 0 failed
    node tests/collide.js       100 passed, 0 failed
    node tests/design.js        149 passed, 0 failed

Run stacked, in that order, in one pass, against the committed `source.html`.
`BUILD.sh` and `BUILD-engine.sh` were not run this pass: both rewrite committed
build products, and this pass changes no source, so a rebuild would dirty the
tree to prove nothing about the 42.

## How the 42 sort

    27  whole lines placed in the order below. 26 in the table, and AU7 rides
        section 1 item 6
     7  lines split: a part placed in the order, a part waiting
     7  whole lines waiting on a ruling of his
     1  whole line waiting on a team decision that is not his

    of the 7 split lines, 4 wait on him for their other part and 3 on us

**Before the port or after it.** The AU footer says that is his call. It
changes when, not what gets built, and when is what this file owns. So: the
table goes before the port. A defect ported is a defect fixed twice, in two
codebases, by two seats. If he wants the port first he says so, and the table
moves behind it unchanged.

## The order

| # | What | Who | Size | Depends on | Moves grade |
|---|---|---|---|---|---|
| 1 | `AV13`, `tools/equiv.py` made honest. It exits clean when a whole declaration is deleted and cannot see top level code after a column zero comment. `CLAUDE.md` describes it as stronger than it is, and that sentence moves with the fix | engineering, systems director | medium | nothing | no, it makes the refactor check honest, and rows 2, 3, 4 and 11 lean on it |
| 2 | `AV8`, a person's own story evidence carried into a persona's reading, because `loadP` never resets it. And `AV9`, `compute()` reading unread status off `CURP` instead of the profile it was handed | engineering | medium | nothing | protects it. `AV8` is corruption |
| 3 | `AV7` and `AV19`, undo takes back the cause and not only the charge: the story's cue counts, the journal entry, the gate and lean mixes. Measured 27.07 still standing after a story was taken back | engineering | medium | row 2, same state, same seat | yes, coherence stops lying after an undo that looks complete |
| 4 | `AV10`, the boundary. `who` refused by name rather than cut at 200. Bad `meter.unique` and `soul.roots` entries refused by name rather than dropped. Missing seed axes filled from the blank, which is 0, rather than invented at 3. A second import of one record refused rather than stored under a shared id | engineering | medium | row 1 | protects it, and it gets dearer the day `AS2` exists, section 4 |
| 5 | `AV12` and `AV11`. Seven writes that claim success without checking the save report through `status()`: story commit, release commit, intake answer, both ritual writes, undo and redo, both clipboard exports. Density read after storage binds, and the theme saved | engineering | medium | nothing | yes, it is the standing ruling that a control never claims a success it does not have |
| 6 | `AU10`, with the blank halves of `AV24` and `AV14`, found twice in one night. The unread guard reaches the five surfaces that print a blank profile's defaults: Knowledge at 60 per cent, Body at Flow 100, Ritual naming the root, Games dealing 24 cards at zero charge, the Field's law spokes at 6. And the right rail's archetype and domain percentages | engineering, UX architect | medium | nothing | yes, it is the first minute a stranger has |
| 7 | `AU1`, `AU5`, and the contrast half of `AU6`. Snow's dark text on three black stages at 1.06:1. Lumen's accent at 3.37:1, moved to `#0078C2` in the text role only, which is the precedent `DECISIONS.md` line 972 already set for the accent on paper, so `AD2`'s vibrancy is kept where the colour carries no text. White on the alarm red at 3.71:1 | art direction | small | nothing | yes, three surfaces cannot be read today |
| 8 | `AU2` and `AU3`. The aura painter honours the per lighting strength its own token sets, measured 0.34 in all seven. Eleven literal gold values go to the accent token | art direction | small | nothing | yes, Glass runs at about a third of what it asks for |
| 9 | `AU14` and `AU15`. The blur comes off the release overlay and gate 13 measures it open, not only closed: 60.9 frames closed, 17.7 open on the heaviest profile. Compass presses stop stacking loops, measured five times the spin after four presses, and the Flat toggle stops snapping the tilt | engineering, animation | small | nothing | yes |
| 10 | `AV21`, the Escape and tab change half of `AV22`, and `AV20`. A drill closes on a tab change and stops saying "Back to the field" where there is no Field. The release overlay takes Escape and closes on a tab change. The drill gains a history, so a second drill stacks and back goes one level | engineering, UX architect | medium. The first two are small, the history is the medium | nothing | yes |
| 11 | The engine halves: the clause half of `AV2`, a named fetter claiming only its own clause and not the whole sentence. `AV5`, seven adjective rows pointing at an axis called joy that does not exist, seated through the fold `canon.js` already applies or removed. The gate half of `AV6`, the dead row gate checking which kind of match hit. The baseline half of `AV4`, `seedShare` measured against 0 | AI director, engineering | medium | row 1. Readings move, so the roster diff is named in the commit | yes, readings stop being wrong in ways a person can see |
| 12 | The game halves. The deal half of `AV14`: Games deals off the person's own field and never deals `Root_08_Unnamed` as a card. `AV15`: the copy says what the ruled halving does after a two day gap and stops naming the absence. The count half of `AV16`: the Seven, Thirty and Ninety marks read the run the ruling forgives rather than a perfect row, and "Ten addresses" counts addresses, not pattern keys | game director, engineering | medium | row 6 for the blank deal | yes, the copy stops contradicting the code |
| 13 | `AU16` and `AU18`. Six bars animate by moving a width rather than rebuilding their markup. The reduced motion gaps close: the tooltip's own fade, the Compass hover. The `body.rm` rules written for an in app motion toggle that does not exist come out | engineering, animation | medium | nothing | yes |
| 14 | `AU9` and `AU12`. Summary's avatar line reads fields a pair actually carries, so it can print something other than the all clear. On a phone the four doors come up from 3,066 pixels down | engineering, UX architect | small for `AU9`, medium for `AU12` | nothing. `D11` can move where the doors live, and item 9 of section 1, the left rail, is what pushes them down, so that proposal carries this | yes |
| 15 | `AU17`, a press state. There is no `:active` rule in the stylesheet | art direction | medium. It is design language, seven lightings by every control, section 5 | nothing | yes |
| 16 | `AV23`, one tooltip. A canvas panel over the wheel and two rail caption slots become the one system the design record already describes | UX architect, engineering | large | nothing | yes |

## Already in the order, so not listed twice

- **`AU7` rides `TR2`, section 1 item 6.** Same defect, one layer in: the code
  is the palette and the documents move. And `AU7`'s own line names the wrong
  file. `CLAUDE.md` carries no seat colours. The stale seven and "four
  lightings" are in `BIBLE.md` lines 52 to 59, the same seven are in
  `.claude/agents/art-director.md` line 99, and the Lexend and IBM Plex Mono
  comment is `shell/head.html` line 48. Small, record only.
- **The microphone half of `AU6` rides `SY2` and `SY3`, section 1 item 7.** The
  solid alarm fill on the record button comes off when the button is rebuilt.
  `SY3` is his: a red light while it listens. `BIBLE.md` line 56 reserves the
  alarm colour for something being wrong. Both hold if the light is a red that
  is not `--alarm`, and which red is the art director's to pick, not his.
- **`AV8` goes to the seat on `E2` and `AC1`, section 1 item 3.** It is not
  claimed to be the same defect. `E2` carries a persona's charge into the
  person's record; `AV8` carries the person's evidence into a persona's
  reading. Same function family, opposite direction, and it may be the
  reproduction `E2` has never had.

## Where the order is arbitrary, said plainly

- **1, 2, 6, 7 and 8 are parallel.** Tools, engine state, surfaces, and two art
  direction rows, with no shared file. Ranking them against each other would
  be theatre.
- **3 follows 2 and 4 follows 1,** and those two dependencies are real.
- **9 to 16 can take any order** once a seat is free. They are placed by grade
  per unit of work, and 15 and 16 are last because they are the two that are
  design language rather than a surface.

---

# 13. 25 September. Waiting on a named ruling, grouped by the ruling

Grouped so one answer releases every line behind it. Seven groups. Four are
questions already in his queue, where the 42 add evidence and not a question.
Three are new. None of the three new ones goes to him without a snapshot:
item 1 of section 1 and `QC1` still stand, and his ruling of 21 September says
a question about a drawing is asked with the drawing.

## A. The charge path. Two questions, asked together

**Releases:** `AV1` and `AV3` whole, the "I am not angry" case of `AV2`.

1. **Does the sniffer read negation?** Already his, the sniffer's `Q3` at
   `TASKS.md` line 5820. `AV1` is a second seat finding it from the core charge
   path: "I am not angry" scores like "I am angry", and only the law and lean
   readers handle a negative. Section 2 lists `Q3` to `Q13` under blocks nothing and can wait for ever.
   That is not re-ranked here. It is his to weigh with the new evidence beside
   it.
2. **Does the field move with the sniffer's composite contract?** New.
   `engine/sniff.js` from line 577 says resentment is ruled a composite, split
   half to Anger and half to Apathy, and that the legacy path keeps Anger alone
   on the standing ruling, with the one line change left "for whoever rules".
   `AV3` measures "i feel resentment" as Anger 10 and Apathy 4, which is
   neither of those. **So the code is wrong whichever way he rules,** and the
   ruling says which way it gets fixed.

**Why together:** either answer moves every reading in the roster. One roster
diff, acknowledged once, is cheaper than two.

## B. The currency and the three words

**Releases:** `AV17` whole, the ladder half of `AV14`, the stored half of `AV16`,
and a `terms.py` rule either way.

Already his as `Q4` in section 2: karma, points or patterns. `AV17` is the same
document one question over. `DESIGN-progression.md` line 340 bans badge,
streak and score, `terms.py` does not enforce it, and `engine/ladder.js` line 4
reads "Ruled: badges, achievements and a score," which is `GB1` in his words.
`BIBLE.md` line 62 uses badge for a third thing, how a named reading renders.
**Ask them as one question,** because the badge team cannot cost a mark until
both the unit and the words have names.

**Options:** the ban stands, and `ladder.js`, `GB1`'s design and the Bible
sentence move. The ruling in `ladder.js` stands, the ban shrinks to the words
it did not rule back in, and `terms.py` enforces what is left. Or a list he
writes.

**And one thing no answer releases.** A game played reaching the ladder, and
marks being stored and dated, both need a field on the profile. That is the
schema class section 10 holds until the server question is answered. It stays
held by that decision, not by this one.

## C. `D11`, the opening surface and the avatar

**Releases:** `AU8` whole.

Already his, and already first in section 2. `AU8` adds no question. It adds
the record that `0o` rules the app opens on the avatar while the code opens on
the Field, and that nothing in the UI writes an avatar pair. Large either way,
as the line says. It also decides where `AU12`'s doors finally live, which is
why row 14 builds the phone fix without waiting and says it may move.

## D. Which surface is each station of the loop

**Releases:** `AU11` whole, and `FL2` and `HW2`, which are already open.

New as a question, not new as a problem: `DESIGN-onboard.md` section 4 records
it as unresolved. `DESIGN-gamification.md` lines 440 and 441 put play at the ritual and
flow at the record, and the record lives on the Ritual surface, so one surface
holds two stations and a person can name three doors, not four. `proto/onboard`
and `proto/ladder` draw the loop and map it differently. The loop itself is
ruled, discover, play, flow, embody, a circle. What is open is only the
mapping.

**Look at:** `proto/onboard/shot-discover-1600.png`, `shot-play-1600.png`,
`shot-flow-1600.png`, `shot-embody-1600.png`, and `proto/ladder/shot-wide.png`,
side by side, both widths.

Whether it is built this round is sequence, and sequence is mine: the round
after he answers.

## E. Which rule wins on the top tabs

**Releases:** `AU4` whole.

New. Two of his rulings meet on the tab strip. `BIBLE.md` line 65, "Top level
navigation is tabs, not buttons. No boxes," built at `shell/head.html` line
818. And Punch, decided this round in `CLAUDE.md`: nothing outlined,
everything solid. Punch, Flat, Lumen and Glass give the tabs a fill or an
outline today, and the Flat and Lumen tab rules target a class the markup
never emits, so they do nothing. **Both halves wait,** because the dead rules
are either fixed or deleted depending on the answer.

**Options:** no boxes in every lighting, and Punch's solid stops at the tab
strip. Or the lightings keep their own tab, and the Bible line gains its
exception.

**Look at:** the tab strip in all seven lightings, at 1600 and at 390, which is
a shot the art director takes before this goes.

## F. How long the boot runs

**Releases:** `AU13` whole, and it sets `FN13`.

Already his, twice: `D8` at `TASKS.md` line 6949 and `AL5` at 8344. **`D8` is
stale and cannot go as it stands.** It asks three seconds or five and says the
boot plays 3,340 milliseconds today. Measured this pass: the stylesheet ends
the boot at 7.02 seconds, `shell/head.html` line 3359, with the comment "two
seconds longer than it was. Ruled." The remover still fires at 5,450
milliseconds, `ui/panels.js` line 929, so the sheet holds full opacity and
vanishes in one frame, and the eased fade is dead. Three numbers, so the
question he gets is three, five or seven, sent with captures of the ending at
each. The fix is one line once he answers.

## G. The twenty one laws

**Releases:** the wiring half of `AV6`, law cues in `sniffStory` moving a law
score.

Already his, `SN5` to `SN7`, third in section 2. Wiring a cue into a law before
he says which twenty one laws is building against a divisor in dispute. The
gate half of `AV6` does not wait and is in row 11.

---

# 14. 25 September. Waiting on us, not on him

These change what gets built and they are not his. The owner does not want to
be asked what the team is paid to decide, so none of them goes to him.

- **Where undo reaches.** `AV18` whole, and the overwrite and undo half of
  `AV4`. Undo reaches story commit, release, the wheel drag and the wheel's
  picks, and not the rail sliders, the bulk sliders, the rail's own picks, the
  personality seed or any intake answer. The UX architect draws the line and
  writes it into `DECISIONS.md`, then row 3's seat builds to it.
- **The seed decay policy.** The clear half of `AV4`: clearing a stated type
  leaves its charge standing. `CLAUDE.md` lists the policy as open and as
  engineering's own, under "Mine to build when asked". Systems director and AI
  director decide it together.
- **Never entered against fully released.** The second half of `AV24`. The
  guard cannot tell a person who has entered nothing from one who has released
  everything, and those two should not see the same screen. UX architect. If
  the answer turns on the avatar, it waits for `D11` and says so.
- **What Stop does.** The first half of `AV22`. Stop ends the release early and
  applies all of it. Whether it applies what ran or nothing goes into the `SR5`
  proposal, which section 4 already lists as needing a proposal rather than a
  guess.

---

# 15. Not doing this round, from the 42

- **The avatar build, `AU8`.** Waits on `D11`, group C.
- **The loop in the app, `AU11`.** Waits on the station mapping, group D.
- **An in app motion toggle.** `AU18` found rules written for one. Nobody asked
  for the toggle and the operating system setting already carries reduced
  motion, so the rules come out in row 13 and the toggle is not built.
- **A name for `Root_08_Unnamed`.** Row 12 stops Games dealing it as a card.
  The name stays his, as `CLAUDE.md` already records.
- **The ladder reaching the profile, and stored marks.** Held with the schema
  items in section 10, see group B.
- **Mirroring the 42 into the ledger as checkboxes.** Recommended in the stamp
  above, not done by a plan.

---

# 16. 25 September. The desktop version. What is buildable today on the
# tech side, and what waits on him

His instruction: "I need to see what it needs to be built today, from the tech
side, that's remaining. Before I touch any visuals." And the standing order for
everything: foundation first, which includes all of the logic, then UI UX, then
how it looks, then content, then animation, then possibly sound.

Source: `TASKS.md` section AW, measured at reboot-os `8ba42de`. This repo has
read access to that one and no push access, so every row below that lands in
that codebase is either relayed to the session that owns it or waits for him
to grant push. Nothing here is built yet.

## The order, foundation first

| # | What | Where | Size | Depends on |
|---|---|---|---|---|
| 1 | `AW2`. Fix the three hard coded paths so their gate runs. 81 red pushes end | reboot-os `test/tools/` | small | nothing. First because nothing after it is provable until it is green |
| 2 | `AW7` and `AW8` go to him as one question set with the numbers beside each: which coherence, which laws, sight by tier or not, story beside email or not | both repos | small to ask, large to land | nothing |
| 3 | `AW1`. Create the D1 database, set `ATUNED_API`, prove one record round trips from the client, and point the deploy workflows at the branch that has `atuned/` | reboot-os `server/`, `.github/` | medium | his region and provider ruling, never given. If he rules Cloudflare, it is one afternoon |
| 4 | `AW5` and `AW6`. Sync carries all four dropped lists; the journal is encrypted at rest as ruled, not PIN gated | reboot-os `42b_cloud.js`, journal | medium | row 3 for the sync half; nothing for encryption |
| 5 | `AW3`. Wire the calibrated geometry in: 113 nerves, 7 orbs, 6 arm nodes replace the pseudo random scatter | reboot-os pattern map | medium | nothing. It is the difference between a map and a drawing |
| 6 | `AW4`. Reach or delete the 33 unreached functions, and shrink `KNOWN_UNWIRED` to zero | reboot-os | medium | row 1 |
| 7 | `AW9`. A boundary on `restore()` that refuses a bad field by name, and an undo. Port MOB's `validateProfile` shape and `undo.js` rather than writing new ones | reboot-os | large | row 2, because the record shape depends on which engine is canon |
| 8 | `AW12`. Embed the typeface (MOB already carries Inter as base64; copy it) and fix `prd` against `.tprd` | reboot-os | small | nothing |
| 9 | `AW11`. The 88 script drawn colour reads move to the brief's table so the figures and wordmark agree with the CSS in all seven schemes | reboot-os | medium | nothing |
| 10 | `AW10`. The fifteen unreflowed screens, the 901 to 1200 band, the lit tab, and a way into Balance and Load | reboot-os | large | rows 1 to 9. This is the first row that is visuals |
| 11 | `AW13`. Their stale documents corrected, `THE_SIX_MODES.md` restored from the commit before `20b683f`, `MANIFEST.source.json` regenerated | reboot-os `docs/` | small | nothing, and it should ride whichever row lands first |

Rows 1, 2, 5, 8, 9 and 11 can start now without a ruling. Rows 3, 4 and 7 wait
on him. Row 10 is visuals and waits on everything above it by his own order.

## What waits on him, from this section

- Which engine's coherence formula is canon, and which laws roster (`AW7`).
- Sight by tier, and story beside email (`AW8`).
- Backend region, provider, PIN recovery (`AW1`).
- Whether the book branch handoffs bind Atüned (`AW14`).
- Body typeface, still open from their GAME_PLAN.
- Push access to reboot-os for this session, or the work is relayed.

---

# 17. 27 September. Round IW placed, and the backlog cleared against git

**Status at `18238fe` is in section 18.** Rows 1, 2 and 3 below are built;
the IX half of row 7 is built; the settle question under "Already his" is
answered. **The masks rows 4 to 6 and rulings 3 and 4, at 30 September, are
in section 19:** row 4 is done as `DESIGN-masks.md`, and ruling 3 is
reopened there as R1.

His closing instruction for round IW, verbatim (`TASKS.md` section IW): "Stick
with your priorities, add this to the priority list, clear the backlog."

Read as three jobs. The order already on this page stands. The IW items are
placed in it. Every item this page has ordered is checked against what
actually shipped, by commit, and its state is corrected. Sections 1 to 16 are
the record of what was ordered and when, so they are not rewritten; their
status lines point here.

## The stamp on this measurement

    commit                  6a2cfb3
    product at that commit  identical to e3b13ae: git diff --stat e3b13ae 6a2cfb3
                            over atuned_src, source.html, engine.js, tests,
                            tools and funnel is empty. The two commits between
                            touch only TASKS.md, docs/briefs and marketing
    source.html             md5 b8f58ab7, the same bytes as 6aa063a
    TASKS.md                22,002 lines, md5 75d403b94b72, read at 6a2cfb3
    measured                27 September, 18:15 to 18:36 UTC, in an isolated
                            worktree, never the shared tree

    method                  grep -cE "^\s*[-*]?\s*\[\X\]" TASKS.md, once per
                            state, the method section 12 wrote down

    open        [ ]         567
    his ruling  [?]         155
    specced     [~]          20
    built       [x]         433
                           1175 lines carrying a state, 37 per cent built

    ./atuned_src/BUILD.sh          div balance 0, no em dashes, 47 funnel tokens,
                                   and a fresh build differs from the committed
                                   one by one line, the build stamp
    ./atuned_src/BUILD-engine.sh   engine is host free, 468 exports
    node tests/engine.js           1770 passed, 0 failed
    node tests/functional.js       1228 passed, 1 failed, and again on a re-run
    node tests/collide.js           351 passed, 0 failed
    node tests/design.js            167 passed, 7 failed, and again on a re-run
    node tools/monitor.js          all surfaces render, exit 0
    node tests/funnel.js            172 passed, 0 failed
    check.py --objections          0 findings

**Two gates are not green in this pass, and I am not calling that noise or a
regression until a quiet run says which.** All eight failures are timing
measurements. Design: six lightings each read the Field's frame rate at 22.8
to 29.2 against a floor of 30, and the boot sheet's fade read an end time of
NaN. Functional: a fade read opacity 1 about 120 milliseconds after a press.
The load average on this machine was 12 to 14 while they ran, with four other
seats working. The bytes under test are the same bytes as 6aa063a, and the
tests are unchanged since then, and round IV read that build at 1229 and 174
with nothing failing. That is strong evidence for load. It is not a green run.
**The round is not done until both gates read green on a quiet machine,** and
the design gate's frame checks are `GT1` and `GT3` again, section 4: a red
frames line costs a re-run and a judgement call every time.

## The finding under the stamp: the ledger has stopped moving

**The four state counts are identical to section 12's, to the item.** Between
d90bf98, section 12's stamp, and 6a2cfb3:

    measured    372 commits, 54 of them into atuned_src
    measured    TASKS.md from 8,889 lines to 22,002
    measured    second level sections from 116 to 504
    measured    every line carrying a state, diffed between the two commits:
                0 lines differ
    measured    the last line carrying a state is 7095, so the 14,907 lines
                after it are prose that no count reaches

Not one checkbox was added, ticked or moved in three days of shipping. The
Avatar tab, the Story page, the spoken release, the CQ audit and the data loss
fixes are all built and none of them reaches the count. **So "37 per cent
built" is a frozen number, not a measure of progress,** and any plan read off
it is reading 25 September.

This is section 9's finding grown by a factor of nine: "the part of the file
nothing counts". The fix is the one section 12 recommended and declined to do
as a side effect, done on purpose: tick the ledger. I do not own `TASKS.md` and
have not touched it. The table below names every item whose state moved, with
the commit, so whoever owns that file can apply it in one pass.

## The order. Round IW placed

Section 12's order still stands, and its rows 2 to 5 (state corruption, the
boundary, writes that claim success) still go before any new surface is built,
because they protect the data a new surface would draw. The IW work is placed
beside that, not above it.

| # | What | Who | Size | Depends on | Moves grade |
|---|---|---|---|---|---|
| 1 | **In progress.** Three imprint visualisations wired into the Story page behind a three icon toggle. `ui/storyui.js` | fullstack, dispatched at e3b13ae | as dispatched | nothing | yes, it is his ask to see which he likes |
| 2 | **In progress.** A live SQ and DQ readout on the release run screen. `ui/release.js` | fullstack, dispatched at e3b13ae | as dispatched | nothing to build. What it shows after a run ends depends on the settle question under "Already his" below | yes, it is the thing he said he should see |
| 3 | **In progress.** Badges, achievements and scoring as an interactive mockup with a slider from day 0 to day 90. `proto/gamification-timeline/`, design only | game director, dispatched at e3b13ae | as dispatched | the reward word, `Q4`, for its labels. Its numbers can be real from `engine/ladder.js` today; its words are not final until he names the unit | no, it is a drawing he asked to see |
| 4 | The masks page, specified and drawn at both widths. Not a build | UX architect, art direction | medium | nothing to start. The golden prototype at `proto/masks/golden/` is the starting drawing | no, it makes row 6 buildable |
| 5 | Six mask weights stored on every history row, the way the twenty one laws were added on 26 September as `lawNow` (`engine/schema.js:231`), with the same rule for a row written before the key existed | engineering | medium: the row, the boundary's whitelist, a series reader, a gate | nothing | no, and without it "how my child mask runs" has no history to summarise |
| 6 | The masks page, built | engineering, art direction | large | rows 4 and 5, rulings 3 and 4 below, and the art direction change he announced for it | yes, it is a surface he described in full |
| 7 | The floor on the Field's Top three and By assemblage point card, `ui/ui.js` lines 1190 to 1224 at 6a2cfb3. **The round IX half is already in flight:** at 18:40 UTC the shared tree carries an uncommitted `ui/ui.js` edit that ranks those rows Primary, Secondary, Tertiary and retires the "Top three" heading. The floor lands on top of that seat's commit, not beside it | engineering | small once ruled | ruling 2 below, and the IX seat's commit | yes |
| 8 | The band word, whichever way he rules | copy, engineering | medium if his new meaning wins, nothing to build if the shipped meaning stays | ruling 1 below | yes, one word per concept |

### Why these rows, one line each

**Row 5 is the dependency nobody mentioned.** He asked for "a summary of how
my child mask runs." Measured in `engine/schema.js`: a history row carries cq,
dq, sq, pole, the laws and the tier, and no mask. The six weights exist on
every reading as `r.maskRing` (`engine/compute.js:311`) and are thrown away.
Nothing stored can say how any mask has run, and a row that was never written
cannot be reconstructed later, because a row keeps no per address charge to
recompute it from. Every day this waits is history lost. It is additive, as
`lawNow` was, so a v1 record still loads.

**Row 6 costs less arithmetic than it looks.** "As I enter my journal, all the
masks begin to fill in" is already true of the engine: `r.maskRing` is
recomputed on every `compute()`, so the live fill is a drawing and not a model.
The right hand panel has a start: `runMaskDrill` at `ui/drills.js:605`, which
the Field and Knowledge already open (`0d5fb9c`). It is a new surface, so it
takes TAB integer 11, appended; the integers are identity and are never
renumbered.

**No design document for this page exists, said plainly.** Searched every
tracked markdown file for a masks page, a landing of six masks, or a child
mask summary. What exists: his original ask at `TASKS.md` `MK2`, "As people
enter their story the masks begin to fill in", with `MK10` to `MK12` under it;
the pixel mockup at `proto/masks/` and the golden ratio one at
`proto/masks/golden/`, both design only; and `DESIGN-sheet.md` line 252, which
found the table defect under ruling 3. Nothing specifies all six at once, the
click, the panel's contents, or the per mask summary. Row 4 is that document.

## Needs a ruling. Only where the answer changes the build

Each carries what he said and what it collides with, so he does not have to go
and find it.

### 1. What "band" means

**He said, round IW:** "A symbolage point is a chakra. A band would be the
chakra color. So, root is the band."

**What it collides with, his own ruling, `DECISIONS.md` line 380:** "The
scale, ruled. Ten bands, ten points each... The ruling is a new word every ten
points." Band is the shipped word for the coherence level, Gaining, Even,
Oscillating and the rest, and the app says it: "The band is named once all
[the laws] are in" (`ui/component.js:102`).

**A fact that helps him decide.** Inside the engine, band already means what he
now means. `BANDS` at `engine/data/canon.js:249` is the seven seats, Root to
Crown, referenced 58 times across the source, and every mask names its seats
under a key called `b`, for bands. Only the word a person reads uses band for
the coherence level.

- **His new meaning.** Band is a seat's own colour and quality. The coherence
  levels need another word, the ruling at line 380 is amended, and the copy
  that prints "band" for a level moves. The code does not move. Cost: a copy
  sweep, medium.
- **The shipped meaning.** Band stays the coherence level and a seat keeps
  "assemblage point". His dictation is translated in every brief. Cost:
  nothing built, and the gap between how he talks and what the screen says
  stays open.
- **Neither.** Band leaves the screen in both senses. Cost: two words to find.

### 2. Whether the Top three has a floor at five

**He said, round IW:** "I think we should show, maybe as a system rule,
everything above from 5 to 10. The close, tens are, everything closer to 10 is
prioritized. But if you only have five, sixes, and sevens, then your fives
will show up."

**What shipped at 6aa063a** is the three heaviest addresses carrying any
charge, heaviest first, so closer to ten already comes first. The code says
why it did not cut at five, and I re-measured the claim rather than quote it.
Headless, off the engine's own roster at 6a2cfb3:

    measured    14 reference profiles
    measured    7 have no address at 5 or more
    measured    2 of those 7 carry nothing at all, Rosa and Lance
    measured    5 carry charge and never reach 5: Sofia at 1.54, Angela at
                1.52, Marcus at 2.51, Abraham at 3.93, Wren at 4.03
    measured    Diane has 1 address at 5 or more, Derek 9, James 10, Nkem 13,
                Ana 18, Gordon 51, Tomas 59

**So his rule changes two things, and he should see both.** Rows under five
disappear, which empties the card for five people who do carry charge. And
"everything from 5 to 10" could mean every address in that range and not
three, which is 51 rows for Gordon and 59 for Tomas.

- **A strict floor at five, every row from 5 to 10.** Cost: blank for 7 of 14,
  and the card's own empty sentence, "Nothing is carrying charge yet", becomes
  false for Marcus, who has 99 addresses lit. It needs a new sentence. Gordon's
  list runs to 51.
- **Five as a preference.** Addresses from 5 to 10 first, heaviest first, three
  shown. When nothing reaches five, the heaviest three still show, under a line
  saying nothing is past five. Cost: small. Nobody who carries charge sees a
  blank card.
- **As shipped.** The heaviest three, no floor. Cost: nothing, and his rule is
  not followed.

It goes with the drawing, per his ruling that a question about a drawing is
asked with the drawing: Marcus and Gordon, each option, 1600 and 390. Round IX
is relabelling the same rows now ("new labels that reflect the content, like
primary, secondary"), so the drawing is taken after that seat commits, or he is
shown a heading that is already gone.

### 3. Two of the six masks can never differ

**He said, round IW:** "for the mask page, I want to see all six on the
screen... all the masks begin to fill in."

**The table:** Preteen at `engine/data/canon.js:499` and Professional at line
508 both sit on `['Solar','Throat']`. Measured on all 14 reference profiles,
the two weights are identical every time: Ana 4.55 and 4.55, Gordon 5.38 and
5.38, Tomas 4.64 and 4.64. On a page whose whole point is six masks filling,
two will always fill in lockstep, and a person will notice.
`DESIGN-sheet.md` line 252 found this and left it, correctly, because the seat
pairs are the codex and the codex is his.

- **Professional gets its own seat pair,** which one is his. Cost: a data
  line, and every reading in the roster moves once, named in the commit.
- **Five on the page, six in the engine,** with the two merged on screen. Cost:
  the page contradicts the book.
- **Six, and the lockstep is accepted.** Cost: nothing built, and the defect
  ships on the page that shows it most.

### 4. Where the masks page lives, and whether a person lands on it

**He said, round IW:** "when I land as a user, I come here, I should be able to
see as I enter my journal, all the masks begin to fill in."

**What it meets:** the app opens on the Field, ruled 19 September, which
itself reversed Summary. Section 2 of this page said it: "A third flip is
affordable. A third flip that is not written down is not." And round GS ruled
Character is "what all the masks look like, and what's running it."

- **A new tab, and the app still opens on the Field.** "Land" means land on
  the page when you go to it. Cost: one surface, one TAB integer.
- **A new tab, and the app opens on it.** A third flip of the opening,
  written into `CLAUDE.md` and `DECISIONS.md` when it is made. Cost: the unread
  guard and the four doors move with it.
- **Inside the Avatar tab,** as the Character view. Cost: the Avatar hero is
  already open for redesign after "a bunch of text boxes" (HV), so the two
  redesigns become one.

### Already his, and these rows lean on them. Not new questions

- **Should the shown number drop the moment a run ends, or settle over nine
  days** as the book's tau draws it. Asked in round IU. It decides what row 2's
  readout shows after the last line of a run, so it goes with row 2's drawing.
- **The reward word, `Q4`.** Still open, narrowed in round GP to "marks" as
  shipped against badges, patterns, points or karma. Row 3's labels wait on it.
  His IW goal, "for a person to empty their bank and to fill their vault", ties
  the rewards to the bank and vault the release already runs, which is his
  direction and not yet a word.

## SQ in real time, and what it connects to

The IW addendum at e3b13ae already measured it: DQ is SQ's own aggregate over
the 112 (`engine/compute.js:240` to 343), and a release already lowers SQ at
the run's address and lifts CQ at its seat. So he is asking for a screen and not
new arithmetic, and row 2 is that screen.

**Cross references, so nothing is specced twice:**

- **The formula lock, `DECISIONS.md` line 1563,** ruled 25 September: "lock
  this in as sacrosanct." The readout reads the arithmetic and may not change
  it. Any seat that finds itself editing `compute.js` to make the number move
  visibly is outside the ruling.
- **The seed decay policy, section 14 and `CLAUDE.md`,** is related and is not
  the same question. It asks whether a stated type's charge fades on its own.
  The readout shows only what a release moves. If decay is ever ruled in, the
  readout has to say which of the two moved the number, and that is the only
  place they touch.
- **The settle question above** is the one that actually governs row 2.

## The backlog, cleared against git

Every item this page has ordered, re-checked at 6a2cfb3. "Built" means a commit
lands it and the gates above cover it; nothing is marked built on a report.

### Section 1, the order of 21 September

| Item | State now | Evidence |
|---|---|---|
| 1. Five rulings with a snapshot each, `QC1` to `QC3` | closed in substance, except the currency | `D11` overtaken: the Avatar tab built at `1850525`, `DECISIONS.md` line 2049. `SQ1` overtaken: "This looks good for the story. Wired in.", ported at `ecbc0a8`. `SN5` to `SN7` ruled 25 September, `a400472` to `7070052`: CQ is the twenty one laws, and the roster is `SI` in the engine. `RV7` overtaken by build, a synthesised voice at `2c6e38b`, his recording `RV1` still his; no audio ruling is recorded in `DECISIONS.md`, so it closes as built on the team's recommendation, not as ruled. `Q4` still open. The method was ruled 25 September, "the team asks" and no shorthand. `QC3`, the generator gate: no commit found, still open |
| 2. A gate on the funnel | **built** | `ec94db6`, 21 September. `tests/funnel.js` read 172 and 0 today |
| 3. `E2` and `AC1`, the field leak | **built** | `88181e6` and `94aeb8b`, recorded closed at `55b51ed`. Two further data loss routes closed at `9a5fe14`, 26 September |
| 4. `ST1`, the sentence read twice | **built** | `fbe941c`, 21 September. `normMap` and `marksOf` live at `engine/sniff.js` lines 148 and 444 and the Story page calls them |
| 5. `CQR1` to `CQR3`, the ring in the funnel | **built** in the funnel | `ec94db6`, `funnel/ring.js`. `CQR4`, where it goes in the app, is his |
| 6. The favicon, `TR1`, `TR2` | **half built** | All 4 funnel pages carry `rel="icon"`, `ec94db6`. The app's `source.html` carries 0. `TR1` and `TR2` not checked this pass, left open |
| 7. `SY1` to `SY4`, the journal box | open, and must be re-measured before anyone builds it | The Story page was rebuilt at `ecbc0a8`. `SY3` asks for a red light while listening; the shipped dot is green while recording and red while typing, `ui/storyui.js` line 49. That is his to reconcile, not a defect to fix by default |
| 8. `CP7`, then `CP6` | open, and growing | `tests/functional.js` at 6a2cfb3: 18 calls to `GORDON()`, and 39 calls to `loadP` with a literal index. This page counted 17 on 21 September. `CP6` not checked |
| 9. The left rail, measured | overtaken | The Field lands with its column shut, `1341796`; the rail rebuilt, `fe433d8`. The 52 is no longer measured and must not be cited again until it is |
| 10. The ritual reconciliation | built | delivered 21 September, already recorded |

### Section 12, the forty two of 25 September

`git log --grep` for every AU and AV identifier since d90bf98 finds no commit
naming any of them as fixed. Two were fixed under other names, and the rest
were spot checked in the code.

| Row | State now | Evidence |
|---|---|---|
| 1. `AV13`, `equiv.py` | half built | Deleting a declaration now fails the check, `e00b217`, 26 September. The column zero comment half has no commit |
| 2. `AV8`, `AV9` | open, re-measure | `9a5fe14` closed a neighbouring route, a story's charge lost after visiting a worked example. `AV8`'s own direction is named by no commit |
| 6. `AU10`, `AV24` | open | `AV24` re-confirmed still present twice in the log, `TASKS.md` lines 16755 and 17394 |
| 7. `AU5` | open | `#0078C2` appears 0 times in `shell/head.html` |
| 13. `AU18` | open, and moved the wrong way | the `body.rm` rules the row says come out: 4 at d90bf98, 5 now |
| 14. `AU9` | **built** | `766a87d`, the Summary avatar line reads the pair's real shape |
| 15. `AU17` | open | one `:active` rule in the stylesheet at d90bf98 and one now, a cursor on the Compass |
| Group C, `AU8` | overtaken | the Avatar tab, `1850525` |
| Group F, `AU13`, the boot length | open, his | `DECISIONS.md` "Still open": 5.24 seconds as built or the 7.2 once ruled |
| `AU14`, the clipped depth bar | open | he marked it again himself as `BA1`, `TASKS.md` line 9381 |
| Rows 3, 4, 5, 8 to 12, 16 | open | no commit names them. Not re-measured one by one in this pass, and not marked built on silence |

### Section 16, the desktop rows

Unchanged. They land in reboot-os, which this repository can read and not
check from here.

### And two from sections 4 and 10 that moved

- **`SIM1` to `SIM4`, the ninety day run.** Built: `f72c3b4` ran the ICPs
  through ninety days, and it found a defect that locked every free tier user
  out for good, fixed at `b0eed95`.
- **The plexus count he asked to be checked.** Confirmed, nothing to build:
  `BODY-MAP-SPEC.md` lines 244 to 246 against `engine/data/nodes.js`, recorded
  in the IW addendum at e3b13ae.

## Not doing this round

- **Building the masks page.** Row 4 specifies it first. Building it over two
  open rulings and an art direction change he has already announced is
  building it twice.
- **Masks as pixel art, `MK2` and `MK12`.** Section 6 stands. The golden ratio
  prototype is the current direction.
- **Names for a person's own masks.** Ruled out 27 September: "that's
  identification."
- **A strict floor at five by default.** Not built until he answers ruling 2.
- **The seed decay policy.** Still engineering's own, section 14, and not
  moved by the SQ readout.
- **Ticking the ledger.** It is the most useful edit on the list and it is not
  mine to make. `TASKS.md` belongs to another seat this round. The table above
  is written so it can be applied without re-reading the commits.
- **Section 12 rows 3 to 16 re-ranked against the IW work.** They keep their
  order. Rows 2 to 5 still go before any new surface.

---

# 18. 27 September, late. Section 17 checked against git, on his JX order

His words, round JX: "make sure we're adding all this stuff to our
documentation. We may need to go do a scan and make sure that everything
that's been added recently that is of like actions or designs or whatever is
in documentation." This section corrects section 17's states and does not
re-rank anything. Read at `18238fe`. Every state below names its commit.

## Section 17's rows, now

| Row | Section 17 said | State at `18238fe` | Evidence |
|---|---|---|---|
| 1 | In progress, imprint views | **built** | `ff76edc` (JB). JJ answered which stays: all three, default Lanes |
| 2 | In progress, live readout | **built** | `82e7bb7` (JC), DQ live to two decimals |
| 3 | In progress, gamification mockup | **built**, design only | `b1d6721` (IZ). No reaction from him recorded yet |
| 4 | Masks page spec | not started | The drawing moved: the mosaic view landed at `7be7c9e` (JU) inside `proto/masks/golden/`. JZ puts the six masks on the body map, which the spec has to start from |
| 5 | Mask weights on every history row | not started | no commit |
| 6 | Masks page built | not started | rows 4 and 5 |
| 7 | Floor at five, IX half in flight | **IX half built**, floor open | `11a36c0` (JB): Primary, Secondary, Tertiary under "By weight" and "By assemblage point". Ruling 2 still open |
| 8 | The band word | open | ruling 1 still open. No round since IW answers it |

## The rulings in section 17, now

- **Ruling 4, where the masks page lives, has new words from him and is not
  answered by them.** JZ: "our masks should be on the body masks. So put all
  six masks here." That is a fourth option beside the three written: the
  masks on the rebuilt Body page. JZ's own open question is whether that
  retires a standalone masks page or only mirrors it. Read it back to him with
  a drawing before row 4 starts.
- **"Already his": the settle question is answered.** JA: "CQ, DQ, and SQ are
  calculated in real time... When they release, it adjusts the numbers." The
  number drops when the run writes; the nine days belongs only to the masks
  mockup's fade.
- **"Not doing: masks as pixel art" still holds, and its last line is out of
  date.** The current direction is the mosaic of saboteurs, complexes and
  hyper complexes (JP), drawn over the golden ratio faces, not the golden
  ratio faces alone.

## What section 17 does not carry, said plainly

**The order has not been re-placed since round IW.** Rounds JP, JQ, JS, JX, JZ
and KA added the avatar rebuilt root to crown, the Field's buttons, the
Compass as two pyramids, the ritual calendar, the release carousel, the pole
display, the Energetics wire in, Source AI's redesign and voice mode, the Story
zones, the first run with storyboard switches, the logo and tab chrome, the
profile page, and the Body page rebuilt as one map with a Kundalini layer. Each
is recorded as his in `DECISIONS.md`, "Ruled 27 September, late". Several are
uncommitted in the shared tree at `18238fe` (`ui/avatarui.js`, `ui/cone.js`,
`ui/map.js`, `ui/release.js`, `ui/ritual.js`, `ui/intakeui.js`,
`ui/storyui.js`, the shell files). The Body rebuild and the profile page have
no owner. Placing them is the next ordering pass, not this correction.

**The ledger is still frozen.** Re-measured at `18238fe` with section 17's own
method: open 567, his 155, specced 20, built 433, identical to section 12 and
section 17. The last line carrying a state is 7095 of 23,179. Nothing shipped
since 25 September reaches the count, so "37 per cent built" is still a
number from 25 September.

---

# 19. 30 September. Round NB: the systems he dropped in, placed in the order

His words, round NB in `TASKS.md`: "I don't see on the plan any of the
systems that I've been integrating and dropping in here over the last
several sessions... All the stuff that I've been dropping in those TDDs.
Block prioritize. And I want to see it in this plan. Review all those
documents because we've got funnel onboarding tutorial. Changes to story
imprints. ritual schema, the AI source AI that like all of it."

**He is right, and the gap is this page's.** Rounds MS to NA brought in five
documents. Each was saved whole and logged in `TASKS.md`, and not one line of
them reached this page, `MILESTONES.md` or `BACKLOG-AUDIT.md`. This section
turns every substantive item in them into a backlog line, places every line
in one order across all of them, and puts the rulings that gate any of it
first. "Block" is read the way sections 1 and 12 read it: group and
sequence, not hold back. Sections 1 to 18 are the record and are not
re-ranked; where a line here is already an item there, it says so.

**Round NC added a sixth document, folded in here rather than placed in a
section of its own.** His words: "all these systems that you're being
dropped into are going to help get us to MVP. So I need these blocked.
Figured out where they go in the plan. Prioritized."
`SOURCE-TDD-release-intelligence.md` is an architecture for the release
run in `ui/release.js`, and most of what it asks for is the gap this
section had already found there, so its lines are `19.C8` to `19.C16` in
cluster C, a new ruling R5, and one new row in the order.

A TDD is a technical design document: a specification of how a system
should work, written before it is built. An audit here is the team reading
one of his TDDs against the real code and marking each requirement EXISTS,
PARTIAL, MISSING or CONFLICT, with the file and line.

## The stamp on this measurement

    commit                a5404f0, tree clean at the start of the read
    source.html           md5 b95ad397
    measured              30 September
    node tests/engine.js  1841 passed, 0 failed
    browser gates         not run. This pass changes no source, and a
                          rebuild would dirty the tree to prove nothing

**Read in full:** `SOURCE-TDD.md` and its audit `AUDIT-source-tdd.md`;
`SOURCE-TDD-V3-intelligence.md` and its audit `AUDIT-source-tdd-v3.md`;
`CREATIVE-BRIEF-voice.md`; `DESIGN-onboarding-narrative.md`; `DESIGN-masks.md`
with its three addenda; `TASKS.md` rounds LV to NB; `DECISIONS.md` from
"The stack" to the end; `MILESTONES.md`; `BACKLOG-AUDIT.md` section 2.
**Checked against the code, not taken from the documents:** the two
saboteur loops at `engine/compute.js` lines 268 to 284 and the pairing at
294 to 297; the history row at `engine/schema.js` line 241; the release
card at `ui/release.js` line 1359 and the heavy mark at line 748; the
ritual plan store at `ui/ritual.js` line 171; the hero cap at
`shell/head.html` line 4821 and the shared breath at line 4847; the
Preteen and Professional seats at `engine/data/canon.js` lines 499 and 508;
the tutorial switch at `ui/login.js` line 131; the funnel's story step in
`funnel/quiz.html`. Every status below that names a file was read there
today.

**Round NC, read at `fd00aab`, engine gate unchanged since no source
moved:** `SOURCE-TDD-release-intelligence.md` in full, 22 sections, and
against it `ui/release.js`: the run object at line 155 and its reset at
194, the phases from line 194 to 822, the dose, bucket and cooldown
constants at lines 121, 36 and 109, the carousel from line 894 and its
Back and Forward at 1156, the reframe's source at 189 and 214, and the
places a run is started from, `relPick`'s callers in `ui/imprints.js`,
`ui/drills.js`, `ui/map.js` and `ui/avatarui.js`.

**Item labels.** Lines are labelled by cluster letter and number, `19.A1`,
the way section 13 lettered its groups. "Row" means a row of the order
table further down, which is the priority. The label is the item.

---

## Read this first. What needs him before the build can go on

Only questions whose answer changes what gets built. Each goes to him with
its snapshot, per the 21 and 25 September rulings: what it is, what is at
stake, each way it could go and what that costs, and the drawing where
there is one. **None goes as it stands here.** Row 1 of the order is
preparing them.

### Gating work that is otherwise ready

**R1. Six masks, seven seats.** Partly answered, round NE. He reversed
himself mid sentence: "Keep professional as well... Oh, I see what
you're saying. Go ahead. Let's get rid of the uh, professional. Just
hide it for now. Don't calculate it." Built: `MASKS_READ` in
`canon.js`, Professional out of every live reading, Preteen kept. The
seven-seat mapping below is still open; this is a stopgap, not an
answer to it.
- *What he said.* Round MT: "Heart and crown, are part of the chakra
  system, all the chakras should be in the masks." Round NB: "Keep the
  professional."
- *What that collides with.* Today Preteen and Professional both sit on
  Solar and Throat (`engine/data/canon.js` lines 499 and 508), so their fill
  is identical on every profile, and Heart and Crown sit under no mask. The
  team's answer to both, M1 in `DESIGN-masks.md`, was five masks with
  Professional removed. Keeping Professional retires M1, including the
  Preteen's move to Heart, which existed only to make room once
  Professional was gone. That is why "Preteen moving to heart" did not
  parse for him at NB.
- *The question.* With six masks, which seats does each carry, so that all
  seven are covered and no two masks light the same?
- *The ways it could go.* A new six mask mapping the team measures on the
  roster, as M1 was, where Professional gets a seat pair of its own. Or
  Professional gets real career data, a new life area field on all 112
  addresses, which round MT sized as an engine schema change, large. Or
  Heart and Crown drawn as the ground all six sit on, which is cheaper and
  may not meet "all the chakras should be in the masks".
- *What it holds.* `19.A7` the frames, `19.A9` the face as a body map,
  `19.A10` the weave, and what the stored mask weights in `19.A12` mean.
- *Owed by us first.* Two or three measured mappings, drawn at 1600 and
  390, before this is asked. Row 1.

**R2. Which engine picks Source AI's next question.** Answered, round
NE, but not buildably yet: "The impression excavation engine is it's
the new one... we're changing the rule for number two for now... in
all the features, algorithms, tools, schemas, and systems." Governs,
wider than this question alone. Still blocked: the document itself,
round LZ's "Foundation Specification v0.1," 47 sections, was not
attached again this round either. Asked for a second time.
- *Built, and ruled 27 September (round GO):* a count of how often a story
  returns to the same seat. It asks at seven or over, never twice, and
  "Move on" ends it. `engine/sourceai.js`.
- *Ruled 29 September (round LZ), never built:* "This is our source AI
  question engine... Swap this out with the system that we currently have."
  The Impression Excavation Engine, which follows feeling, body and belief
  toward a root through a fixed question grammar. Round MB then asked
  whether it could merge with the discernment document of round MA.
- *Proposed 30 September (V3, section 18):* pick whichever question most
  reduces the system's own uncertainty.
- *The ways it could go.* Keep the built count and treat the other two as
  later. Build LZ's engine as ruled, with V3's scoring as its internal
  ranking. Or V3 governs. Each has to answer his standing "the person
  leads" (round GO), which a system choosing questions for its own
  certainty can cut against.
- *What it holds.* Every change to how Source AI asks, and the contradiction
  engine `19.D5`, whose whole output is a question.
- *Also needs from him:* LZ's specification is not in this repository. See
  "Documents he dropped in that are not here" below.

**R3. May the product ask a person how strong something feels?**
Answered, round NE: no. "No, the release is rapid. Maybe if a person
wants to vocalize note, if they say note, the software detects that
word, it'll automatically detect it. Or the word dense." No numeric
rating; a spoken word during a voice run, heard and marked
automatically. Real precedent checked directly, `ui/storyui.js`'s own
`stMic`, already shipped. Not yet scoped: what the mark actually
writes, and the release carousel has no swipe gesture built yet to
carry it on.
- *Why it matters.* Today "released" is calculated, not measured: the
  before is the held charge, the after is that number minus a fixed
  formula (`AUDIT-source-tdd-v3.md` section 2b). A person's own rating
  before a release and again days later is the only honest fix, and the
  audit adds the control it needs: a later rating at an equally heavy
  address that was not released, so a real change can be told from the
  number drifting back toward normal on its own.
- *What it collides with.* His rule of round MP, "no 7.9, no numbers that
  don't tell the user anything", refined at JX into nerve state words. A
  zero to ten slider is a bare number.
- *The ways it could go.* A rating in his state words, flowing through
  blocked, stored as a number underneath. A zero to ten scale, as an
  exception he rules. Or no rating, and release stays calculated and is
  labelled so.
- *Rides with it:* V3's question 8, a prompted check in later, which is how
  "the old trigger came and the old response did not" ever gets recorded.
  His ritual reminder ruling (`DECISIONS.md`, "New, logged the same round")
  is the one channel he has allowed to speak to a person outside push, so
  a check in could ride it.
- *What it holds.* `19.C3`, `19.C4`'s recurrence, and whether the 90 day
  engine `19.D6` can ever say anything true.

**R4. What the Day One tutorial works with when a person has written
nothing yet.** Answered, round NE: "the day one tutorial has to start
with the journal... journal is the beginning of the journey." The
tutorial opens by having the person write live, rather than needing a
prior entry, which answers the gap below. A second thing rides with
it, not part of this question but decided the same turn: the 21 law
intake, CQ, becomes an ongoing ritual task rather than a one sitting
requirement, "that needs to be added to the ritual until it's
completed."
- *Round JX, 27 September:* "narrated story animations of named people
  using the tools, ending 'Take the quiz. Find out your coherence.'"
  (`DECISIONS.md`, "Ruled 27 September, late").
- *His storyboard, round MU, 30 September:* "The tutorial begins with
  something the user has already expressed... ATUNED is not giving them a
  generic example of avoidance. It is working with their life."
- *The dependency nobody wrote down.* On day one the only thing a person
  has written is the funnel's story, and the funnel holds it in memory and
  never stores it (`funnel/quiz.html`, "THE TEXT IS HELD IN MEMORY AND
  NOWHERE ELSE"). Carrying it in needs real sign in, which is blocked below.
- *The ways it could go.* The tutorial asks for one sentence first and works
  on that. The funnel's story follows the person in at sign up, once sign
  in exists. Or JX's named people for anyone with nothing written, MU's own
  words for anyone with something. The later document is usually the
  ruling, and this one reverses the earlier one's substance, so it is
  confirmed rather than assumed.
- *What it holds.* `19.E1`, the tutorial itself.

**R5. What happens to a pattern a person sets aside during a release.**
Answered, round NE: "When a person swipes past, it goes into their
history. If they leave it alone, it gets recycled." Swipe is discard
with history kept, untouched is recycle. Kept for when the carousel
itself is built, since no swipe gesture exists yet to wire it to.

New at round NC, and it absorbs V3 audit question 4, which sat in the list
below until the release document made it gate a build.
- *What the release document asks for* (`SOURCE-TDD-release-intelligence.md`
  section 11): four operations. Swipe one way to recycle a pattern, "return
  to active rotation later"; swipe the other to discard it, "remove from the
  current active experience" while keeping its history; the Bank as what is
  still to process; the Vault as "historical record retained for
  intelligence".
- *What that collides with.* In the product the Vault already means what has
  been released, and it is the billed set: `meter.unique`, which only grows
  (`AUDIT-source-tdd-v3.md`, and his IW goal, "empty their bank and fill
  their vault"). A discarded pattern in that Vault would read as released
  and as paid for. And he has already said something about the patterns a
  person does not mark, at JX: "The patterns you didn't feel removed from
  your pool." That is a rule about the heavy mark, the one gesture the
  carousel has today.
- *The question.* Is "removed from your pool" a discard, gone from future
  runs with its history kept, or a recycle, offered again later? Does a
  swipe join the heavy mark or replace it? And when a released pattern
  comes back, does it return to the Bank, and does releasing it again spend
  allowance?
- *The ways it could go.* The heavy mark stays the only gesture, and
  unmarked lines leave the pool as he said at JX, kept in history. Or
  recycle and discard are added beside the heavy mark, and the Vault keeps
  meaning released and paid. Or the document's four operations as written,
  which moves the Vault's meaning and so moves billing.
- *Rides with it:* the document itself says the direction a swipe goes
  must not be fixed to its meaning, so which side is which is ours.
- *What it holds.* `19.C12`, and `19.C4`.

### His, real, and holding nothing this round

Written down so none of them is lost. Each is asked when the work reaches
it, not now.

- **What may leave the device.** V3 audit question 3: beyond word and
  phrase combinations, may dated sequences of a person's own readings and
  releases leave the device, even with no name? Round MX widened the
  direction, "aggregate everyone's data... with the purpose of improving
  the AI's accuracy", and said the design comes later. The standing ruling
  (`DECISIONS.md`, "Sight by tier, ruled") is word and phrase combinations
  only. Holds `19.D8` beyond words, and the whole of `19.D10`.
- **Whether a person ever sees a label like weak, possible, probable,
  strong or verified.** TDD audit question 4. At MX he asked for context:
  "I don't know what you mean by number four." The context: a confidence
  cut line on the output was measured once and removed, because it made
  two nearly equal readings look like different verdicts
  (`engine/sniff.js` lines 808 to 831). Holds only display; the evidence
  index `19.B7` is internal either way.
- **"Pattern" has three meanings.** V3 audit question 6: one release line,
  a recurring mechanism, a saboteur family. Holds the 90 day report
  `19.D6`, which is not this round.
- **Which channels, and which meaning keeps the word.** V3 audit question
  7 asked six or seven, V3 adding "somatic". The release document adds a
  third list, eight, with "speaking" (its algorithm C). And the release
  already uses "channel" for something else, the left and right sides
  (`CHAN`, `ui/release.js` line 36, printed as "Release, left channel"),
  which `BACKLOG-AUDIT.md` 2.7 item 67 already asks about. One word, two
  meanings, three lists. Holds the channel half of `19.B8`, and the
  release document's channel activation, which is not this round.
- **Is "jouissance" one word or two.** TDD audit question 3. Holds the
  jouissance detector, TDD task SRC-018, not this round.
- **A word for the nine drivers.** MX: "Fetter does mean 112 addresses.
  And they are the outputs of the underlying drivers... it should be one
  word. Maybe you can help me with that." Owed by us: candidates. Holds a
  copy sweep, nothing structural.
- **"Power" in the brief.** `CREATIVE-BRIEF-voice.md` section 8 names a
  body area "Power"; V3 section 4.3 says "a Power register". The seven
  seats are Root, Sacral, Solar, Heart, Throat, 3rd Eye and Crown (`BANDS`,
  `engine/data/canon.js`). A loose word for Solar, or a new naming for the
  seats? The second is the product wide rename `BACKLOG-AUDIT.md` 2.4 item
  35 already carries.
- **Where the masks page lives against the Body map.** Section 17 ruling 4.
  The page exists as the Character tab (`TAB.MASKS`, `engine/core.js` line
  213) and the rail layout was ruled for it. JZ's "put all six masks here",
  on the Body page, is still not read back to him as either replacing or
  mirroring it.
- **Not asked, by his own word:** the Teen's thin data and pixel density by
  age. MX: "It's still open question. Let's keep it open for now."

### Answered since the audits asked them, so not asked again

Every one of these is recorded only in `TASKS.md`. **`DECISIONS.md` was last
written 27 September (`b15a68b`)** and carries none of them, which is the
defect his JX order was about. A "Ruled 28 to 30 September" block there is
owed; this page does not own that file.

- Fetter means the 112 addresses (MX).
- One saboteur list, not two (MX). `19.B2`.
- Give the archetypes a source credit (MX). `19.B3`.
- "Move on" counts, revisited after launch with real data and a prediction
  of the other way (MX). `19.D2`.
- Cross person learning is wanted, designed later (MX). Read narrowly, as
  above.
- The shape is E2, the egg broad at the brow (MV).
- A rail of small masks and one large hero (MX). Child first on first open,
  then the last pressed. Child at the top of the rail, the face centred,
  the rail below the hero and above the navigation on a phone, the blank
  profile's coarser grid kept as the reward for filling in (MZ). A rail
  press updates the hero and the right column together (NA).
- The halo is a flat line (MZ, restated at NB).
- Keep Professional (NB).
- The six lean axes belong on Analytics (NA), and in the tooltips and the
  knowledge base (MZ). `19.D7`.

**And three things the release document proposes that earlier rulings
already settle,** so they are not asked:
- **A release that slows, pauses or repeats itself** (its algorithm D).
  JA: "Pace is user driven" (`DECISIONS.md`, "Ruled 27 September, late").
  The person's pace stands; the run may suggest and never decide.
- **Reframes generated as "I know..." lines** (its algorithm E). Every
  reframe today is the canon's own coherent opposite of the pattern
  (`relOpp`, `ui/release.js` line 189, used at 214), so it is traceable by
  construction, which is what the document asks of a reframe. Generating
  them needs a model, and the no invention rule governs what one may say.
- **The AI never going outside the protocol** (its principle 8). True in
  practice: the voice speaks only the run's own lines, and his recorded
  welcome is barred from the synthetic voice (`1a7083c`).

### Taken off his list, and why

- **The finished release card's "N cleared entirely"** (V3 audit question
  2). `ui/release.js` line 1359 prints it as fact, and it is a threshold on
  the formula, `cleared:(m.w1<=6)` at line 751. The standing rule is that a
  control never claims what it does not have, and his own drafted
  completion words at JX do not use "cleared". Rewording it to say what was
  measured is the team's job, not a ruling. `19.C1`. He is told, not asked.

### Blocked on infrastructure, not on him or on us

**The server deploy in `reboot-os`.** Round MW: the server workflow was
re-run after his billing fix and failed at the deploy step on an invalid
Cloudflare secret value. MZ: unchanged. NA's re-run is recorded only in
the chat reply, and this session's own report is that it still fails. At
NB he is "going to work on Cloudflare". The server itself is built: sign
up, sign in, sync and password reset routes, found at round MI.

**What waits on it:** real sign in, `19.E8`; the funnel's quiz becoming a
person's starting coherence and their story following them in, `19.E7`;
the Eleven Labs voice, `19.D4`; the Claude research that feeds the
energetics copy, `19.D3`; aggregate word learning, `19.D8`; Stripe; the
feedback page. And by his own sequencing at MY, the creative brief pass,
`19.F1`: "this will be our next steps to clean up once the attuned website
is posted."

### Documents he dropped in that are not in this repository

`TASKS.md` records each of these as "in this conversation's own history".
A conversation does not survive, so these exist nowhere this project can
read again. **The ask is the paste, not a rewrite**, the same as
`docs/RITUAL-ACCOUNTABILITY-source.md`, whose body never arrived either.

- Round LZ, the Impression Excavation Engine, "Foundation Specification,
  v0.1", 47 sections. **R2 cannot be built from without it.**
- Round MC, the browser state, cookie and session architecture, tasks
  COOKIE-001 to COOKIE-029.
- Rounds MG and ML, the two "ATUNED TDD MVP Architecture" documents,
  including the "mirror first" onboarding sequence `19.E1` should be
  checked against.
- Round MM, the "Rigorous Architecture Security Content Review".
- Round MO, the creative direction addendum and innovation brief.
- Round MA's parts three to eight, the discernment architecture. Its task
  list ran SRC-001 to SRC-030, the same numbering `SOURCE-TDD.md` section 40
  carries, so it may be superseded by that saved file. Not confirmed, since
  the original is not here to compare.

---

## The lines, by cluster

### A. The masks

Sources: `DESIGN-masks.md` and its three addenda; rounds MS to NB; section
17 rows 4 to 6. The page exists: the Character tab, `ui/character.js`, six
masks drawn as pixel grids, with the hover built at `cde720e`.

| Line | What | Status | Buildable now, or blocked on |
|---|---|---|---|
| 19.A1 | Each mask moves on its own clock, a period in a golden ratio relation to the Field's 4.2 second breath, so no two ever fall back into step. Finding 3 | MISSING. All six share one animation, `shell/head.html` line 4847 | Now. Needs `chSvg`'s merged paths split into groups first |
| 19.A2 | Brightness means how much charge; tier means how fused the cells are, not a brightness step, so the hottest tier stays saturated. Finding 4 | MISSING | Now |
| 19.A3 | Marks snapped to the cell size, and one grid across all six so sibling pixels match. Finding 1's craft notes | MISSING | Now. MZ settles the conflict the layout addendum raised: one grid across siblings, and the unread grid stays coarser as the reward |
| 19.A4 | Clicking a lit pixel opens that pixel's saboteur, or its address. On touch the press targets the saboteur's block, because one pixel is under the touch floor. Finding 6 | **BUILT, round NH, as the weave's own click.** `chCellAt` is factored out of the hover handler and shared with the click, `ui/character.js`. A lit pixel on the hero opens its saboteur through `runDrill`, the same renderer every other drill uses, not a second one. Touch-specific target widening not separately measured | Done for the core interaction; the touch-widening half of this row is not separately verified |
| 19.A5 | Never blank. Every mask's full outline always drawn, the rim and marks solved to 3:1 contrast per seat. Ruled MT | MISSING. The rim measured 1.43 to 1.99:1 in Dark | Now |
| 19.A6 | The egg broad at the brow, E2, the six canon marks cut as apertures with a one cell moat. Ruled MV | **BUILT, round NL/NM.** `MASK_FACE` is the recovered fitted path, `engine/data/canon.js`. Every mark repositioned as a cell rather than a stroke test, measured against `chGeo` directly in a real browser rather than copied from the design doc's own prose, which undercounted two of them: Child and Preteen's marks shortened from length 2 to length 1 once the round cap's own reach past each end was measured, and Adult's seam moved off a row boundary it used to straddle. Ideological's own bar, moved to the design's own y2.6, measured mk 0 at every grid size once the face's brow rose to y5 with it; moved again to y6.2, the first point down the egg's own curve where its full width clears the face, now mk 4/12/22 across the three grid sizes, measured directly against `chGeo` rather than assumed from the fix alone | none |
| 19.A-selected | The pressed state, a gold border, read as a button rather than the product's own aesthetic. His own words, round NK | **BUILT, round NM.** `.chv-m[aria-pressed=true]` no longer draws a border; the icon desaturates at rest, saturates on hover and on selection, and a selected or hovered icon lights a soft radial pool in the mask's own top seat colour, breathing on the same clock the rim already does. All four lightings carry their own figure, Punch a flat fill rather than a glow, per its own standing rule that a selected thing there is a fill | none |
| 19.A8 | The rail and hero layout. Ruled MX, detailed MZ and NA | **BUILT, round NH.** `.chv-stage` replaces the three column grid, `shell/head.html`: a rail of the five read masks, Child to Ideological, each at James's own 64px, and a hero that is whichever one a rail press names, at up to 560px. A rail press updates the hero and Selection together, NA's own ruling. First visit opens on Child, a return visit reopens the last one, held on `CURP.ui.chmask`. Phone moves the rail below the hero, a flat row, per MZ | Not yet in this pass: A1 motion, A2 brightness/tier, A3 grid snapping, A5 the never-blank rim, A6 the egg face, A7 the gradient frame, A9 the face as a body map, named open rather than built silently |
| 19.A11 | The Ideological halo as a flat line. Ruled MZ and NB | **BUILT, round NH.** `MASKS`'s own Ideological icon path in `engine/data/canon.js` changed from an arc to `M9 4h6`, a flat segment; every reader of it, the pixel mark and the small icon glyph, changes with it | none |
| 19.A12 | Six mask weights on every history row. Section 17 row 5 | Not started. A row carries counts only, `engine/schema.js` line 241 | Now, with a mapping version on the row, so a row written before R1's remap is not read as the person changing |
| 19.A7 | Each card's frame, a gradient from the mask's highest seat to its lowest | MISSING | **R1** |
| 19.A9 | The face as a small body map, the higher seat higher on the face. Confirmed MT | MISSING | **R1** |
| 19.A10 | The weave: pick a saboteur, complex or hyper complex and see it run down the rail's gutter to every mask it touches. Approved MX | **BUILT, round NH, the technical answer MX itself left open.** No line is drawn between a 64px rail icon and a 560px hero, two different sizes of the same face; instead the matching pixel rings on every mask that carries it (`.chv-weavepx`), and the rail icon holding one gets its own glow (`.chv-weave-on`), so "does this show up here" reads before a cell inside a small icon ever would. Picking the same pixel again puts it down | The 47-of-270 address-vs-group pixel gap this row's own addendum found is a separate, pre-existing defect in which saboteurs own a pixel at all, not in the weave's own routing; still open, `19.B1` |
| 19.A13 | Saboteur, complex and hyper complex masks, each drawn as the thing it names, toggled beside the six. Round MD | MISSING, no design | Not this round. About fifty new pictures and no brief yet |

### B. Story, imprints and the evidence under them

Sources: both TDDs and both audits. What the engine reads out of a story,
and what it keeps.

| Line | What | Status | Buildable now, or blocked on |
|---|---|---|---|
| 19.B1 | A saboteur can be named twice in one reading, and a complex can then pair a saboteur with itself, "Aggressor + Aggressor" | A real defect. Two loops push into one list unchecked, `engine/compute.js` lines 268 to 284; the pairing at 294 to 297 | Now. Readings move, so the roster diff is named in the commit |
| 19.B2 | One saboteur list, not two. Ruled MX | CONFLICT. `SAB33`, 33 names by charge range, and `SAB_LIB`, 14 by address, both run | After a proposal of ours, and after the masks rows, because the masks draw from the address list. MX sequenced it so |
| 19.B3 | A source credit for the twelve archetypes, Jung derived and not attributed to Jung, the way the Positive Intelligence saboteurs are already credited. Ruled MX | MISSING | Now |
| 19.B4 | One shared handler for "not", "never" and the rest. Three exist with different look back windows (`engine/sniff.js` 698, `engine/sourceai.js` 80, `engine/verp.js` 367), and the core charge path reads none | PARTIAL, **and narrower than that now.** Round NQ built the one piece of this that was an unambiguous bug and nothing else: `sniff.js`'s own `clauseFloor`, a shared sentence boundary read off `normMap`'s own map rather than a second copy of the text, because `sourceai.js`'s `srcHear` reuses `scanStory`'s own offsets and a bar inserted copy the way `lawNorm`/`leanNorm` build one would desync every offset past the first boundary. `srcNegated` now takes it as an optional third argument; every other caller, the gate's own direct call included, is unaffected. Measured first: "I am not afraid. Afraid now." read both occurrences negated before this, the second sentence voided by the first one's own "not". What this did NOT do, on purpose, in an unattended pass with nobody to rule on it: merge the three handlers' own word lists or look back widths into one. `sourceai.js`'s narrower two word window is its own file's measured tuning, cited against the owner's book, not an unfixed copy of the wider one, and round NQ left it exactly as measured rather than trust the audits' own "changes no reading" claim without re-checking it directly | Now for the merge itself, if a seat re-verifies the audits' claim against the real engine first, the same discipline this pass used. The core charge path reading it at all is still his, section 13 group A, and `BACKLOG-AUDIT.md` 2.6 item 56. `20.G6`, `20.G7`, `20.H1` and `20.H2` can now build on `clauseFloor` directly rather than waiting on the merge |
| 19.B5 | History rows carry which saboteurs, complexes and hyper complexes ran, and the nine axes, not only how many. The first audit's gap D5 | MISSING. `snapshot()` writes counts, and the boundary rebuilds each row from a list of allowed keys | Now, after `19.B1`, or the duplicates are written into history |
| 19.B6 | Every story entry stamped with the lexicon version that read it, so reading it again later is reproducible | MISSING | Now. Needed whichever way JM's question goes, and JX, "keep the record for the sniffer... their words", leans toward keeping |
| 19.B7 | The evidence index moved into the engine: which words in which entry put which charge where, keyed by entry and not by position in a list | PARTIAL. `atomIndex`, `ui/wheel.js` lines 230 to 244, lives in the interface and re-reads everything under today's lexicon | After `19.B6`. This is the port the audits recommend in place of V3's full trace graph, which conflicts with how the engine is built |
| 19.B8 | Limiters and desired outcomes: "I want to X, but Y" read as a wanted thing and what stands in the way. V3 sections 10 and 11 | MISSING | After `19.B4`. The channel half waits on six or seven channels. Nothing reads it yet, so it waits for a consumer, see "Not doing" |
| 19.B9 | A status on every structure: canonical, inferred, emergent or provisional | PARTIAL. Saboteurs and imprints carry one; complexes and hypers carry none | Now, and low value until something displays it |

### C. The release and the ritual schema

Sources: V3 sections 24 to 28, the V3 audit, and rounds JF, JX, LT and LY.
"Ritual schema", his words at NB, is read as what a ritual and a release
store, and whether the record holds it.

| Line | What | Status | Buildable now, or blocked on |
|---|---|---|---|
| 19.C1 | The finished card stops printing a formula's threshold as fact | A real defect, `ui/release.js` line 1359 | Now, under the standing rule. Taken off his list above |
| 19.C2 | The heavy mark a person presses during a release is kept on the record | MISSING. It lives in the run's memory, `RUN.log`, `ui/release.js` line 748, and `engine/schema.js` stores nothing of it | Now. His completion words at JX, "Note the patterns that felt heaviest... to optimize your experience", promise a use nothing stored can serve today |
| 19.C5 | **Ritual plans move onto the record.** The schedule, the weekdays, the seats, the timer and the release it came from | **Found this pass.** They live in browser storage beside the record, one key holding every profile's plans by profile id, `atuned-ritual-active`, `ui/ritual.js` line 171, chosen so "it is no schema change". So the boundary never checks them, no export path reads that key, and a sync of the record would not carry them. The avatar's ratings sit the same way under `atuned-avatar-side`, `ui/avatarui.js` line 149 | Now. Additive, with a one time read of the old keys. It belongs in the same pass as `19.B5`, before records live on a server |
| 19.C6 | Whether a ritual was actually done against how often it was set: V3's "intervention fidelity" | PARTIAL. The days done are on the record; the plan they are measured against is off it until `19.C5` | After `19.C5` |
| 19.C3 | Release measured, not calculated: a person's own rating before and after, a later one, and the unreleased address as a control | MISSING | **R3** |
| 19.C4 | A released pattern that comes back, recorded as returning rather than as new | MISSING | Ruling "when a released pattern comes back", and **R3** |
| 19.C7 | One ritual serving several patterns that share a mechanism, rather than one ritual each. V3 section 26 | MISSING | After `19.B7`; "share a mechanism" needs evidence first |
| 19.C8 | A release's own dose, cooldown and side names read from one place rather than typed twice. The release document's "Protocol Registry" | PARTIAL. `REL_DOSES` is already one array, `[25,50,100]`, `ui/release.js` line 121; the cooldown is one constant, `REL_SETTLE_S`, line 109; the four sides are one array, `CHAN`, line 36. So the registry's own goal, nothing hard coded twice, already holds; what is missing is letting a second set of numbers exist and be chosen between, which nothing today asks for | Not this round. No second configuration is asked for yet |
| 19.C9 | The run's own phases, named and ordered | PARTIAL, and thinner than the document's own fifteen. The real run moves `welcome` to `opening` to `pick` to `run` to `done`, one field, `RUN.phase`, set at `ui/release.js` lines 1473, 378, 704, 382 and 668, reset to `idle` at 194. The document's own fifteen states split `run` into observer, presentation, channel, release, somatic and reframe, none of which the record can tell apart today | Splitting the phase needs a reason to read them apart, which is `19.C3`'s own rating question |
| 19.C10 | A handshake before a release starts, checked rather than assumed: the record has what a release needs, the pattern is a real one, nothing is missing | MISSING. No check runs before `RUN.phase` leaves `idle`; a release starts on whatever `relPick` was last given by its callers in `ui/imprints.js`, `ui/drills.js`, `ui/map.js` and `ui/avatarui.js` | After `19.C3`; a handshake with nothing to verify is a form, not a guard |
| 19.C11 | Why a pattern was offered, kept rather than only felt | PARTIAL. `sniffOffer` already ranks by shadow, the heaviest first (`engine/sniff.js` lines 1047 to 1050), which is a real, explainable rule; what the document adds, recurrence, prior attempts and replacement risk, is not read because nothing tracks a pattern's own identity across runs, `19.C4`'s own gap | After `19.C4` |
| 19.C12 | Recycle, discard, Bank and Vault as four distinct things, rather than the one heavy mark the run has today | **R5** |
| 19.C13 | A trigger that used to bring a response and no longer does, recorded as that rather than left unremarked. The document's "negative evidence" | MISSING, and the V3 audit already found why: a person writes about what charged them, so an absence is never written down unless the product asks. Needs a prompted check-in, V3 audit question 8 | After that ruling, not this round |
| 19.C14 | One address weakening while another strengthens, read as one pattern replacing another | MISSING, and the V3 audit already measured the honest read: addresses derive from nine axes and release is aimed at the heaviest one, so this is mostly what releasing at one seat while writing about another looks like from outside, not a finding about the person | Not recommended as specified; `19.D6`'s own caution applies here too |
| 19.C15 | The three states the document asks never to conflate, what is on screen, what the engine is doing, and what is actually known to have happened, checked against the real run | Already mostly true by construction: `RUN.phase` is the engine's own state and the card's own text is written from it rather than kept separately, so screen and engine do not disagree today. What the document adds, a third, independent evidence state that can outlive the screen, is `19.C2` through `19.C4` together | Not its own line; tracked through `19.C2` to `19.C4` |
| 19.C16 | Every meaningful action in a run as one named event, a real history rather than only the current phase | MISSING. `RUN.log` exists (`ui/release.js` line 155) but holds the release lines themselves, not named actions; there is no `PATTERN_PRESENTED` or `RELEASE_STARTED` to read back later | After `19.C2`, since a heavy mark is itself the first event worth keeping |

### D. Source AI and the intelligence layer

Sources: both TDDs and both audits; rounds MA, MB, ME, MR, MX.

| Line | What | Status | Buildable now, or blocked on |
|---|---|---|---|
| 19.D1 | Which engine picks Source AI's question | Built one, ruled a second, a third proposed | **R2**, and the LZ paste |
| 19.D2 | "Move on" counted, then re-analysed after launch with a prediction of the other way. Ruled MX | MISSING, and needs real usage | After launch |
| 19.D3 | Claude researching before the energetics reading names "overlapping spiritual behaviors", feeding the Summary copy. Rounds ME and MR | MISSING, not designed | The server. A key in `source.html` is readable by every visitor |
| 19.D4 | The spoken release on Eleven Labs instead of the browser's own voice. Round MR | MISSING | The server, same reason |
| 19.D5 | Contradiction held as a question, not an error: "I don't care what people think" beside "I'm terrified they'll judge me" | MISSING | After `19.B4` and `19.B7`, and **R2**, because its output is a question |
| 19.D6 | The 90 day engine: how a person is changing as a system, at 30, 60 and 90 days | MISSING. **The audit's decisive finding:** on today's state, ninety days of perfect use moves the middle case from 25.00 to 25.54, so it would label nearly everyone unchanged and be describing the release formula, not the person | After `19.B5`, `19.B6`, `19.C2`, **R3**, and the "pattern" word |
| 19.D7 | Individual analytics from what is already stored: the six lean axes on Analytics as ruled at NA, laws over time, ritual follow through | PARTIAL. The Analytics tab exists (`0fcee17`); `leanSeries()` has had no caller since section 4 said so | Now. The follow through half after `19.C5` |
| 19.D8 | Learning across people: word and phrase combinations feeding the lexicon | MISSING. The lexicon already has a place for a fifth source with its own provenance | The server and a consent line saying exactly this. Anything beyond words: the "what may leave the device" ruling |
| 19.D9 | The AI handshake: what an AI must establish before it acts | MISSING, and nothing to guard: there is no model (`ui/storyui.js` line 438, "No model is called") | When a model is wired. Then as checks the code enforces, not a form the model fills in about itself, which the V3 audit rejected |
| 19.D10 | The emergent pattern engine: finding structures the canon has no name for | MISSING, and **largely not learnable from what the product collects**. An address's charge moves with its parent axis by construction (`engine/compute.js` line 236), and text reaches about 37 of 112 addresses | Not this round. See "Not doing" |

### E. The funnel, onboarding and the Day One tutorial

Sources: `DESIGN-onboarding-narrative.md`, his storyboard; rounds LW, MH,
MI, MP, MU.

| Line | What | Status | Buildable now, or blocked on |
|---|---|---|---|
| 19.E2 | The funnel's pages carry his storyboard's copy: "There is more running you than you can see", the six places people feel friction, and Mission, Vision and About in the navigation | PARTIAL. `funnel/about.html` carries mission and vision; the opening line appears nowhere in `funnel/` | Now. **Clear one line first:** the quiz's reading says low coherence "is what promotes mental, physical and spiritual disease" (`funnel/quiz.html`), the claim class `BRAND.md` section 5 and PO2 are about |
| 19.E3 | "How coherent are you right now?" as the assessment's own step | EXISTS in substance: the quiz and its seven band ring, `ec94db6` | A copy check against his words, riding `19.E2` |
| 19.E4 | A pattern glimpse before the account: one sentence of the person's, read into Story, Imprint, Pattern, Impact | **PARTIAL, and the storyboard's reconciliation says not built.** The quiz already reads one story through the app's own reader and prints what it found, `ac7e067`, 28 September. His Impact step is not something the reader produces | The Impact step needs a design of ours. "The user's work should follow them" is `19.E7` |
| 19.E6 | The funnel's look takes its cues from the Field and the masks. Round MU | MISSING on the funnel; login and onboarding already carry it (`a9c2e28`) | After `19.E2` |
| 19.E1 | The Day One tutorial, his storyboard sections 7 to 13: Discover, Play, Understand, Release, Flow, Embody, on the person's own words | **BUILT, round NF.** `ui/tutorial.js`, five screens, real engine output throughout: the entry is committed through `ui/storyui.js`'s own real `stCommit` (factored out of the Apply button for this, not a second copy of it), Discover and Understand read the real imprints and seats it found, Release quotes `sniffStory`'s own `offer` and its own stated reasoning rather than invented copy. Embody is folded into Flow rather than its own screen this round. Replayable from the account area, same promise as onboarding. The switch on the login screen is enabled now, `ui/login.js`; default still off, so a genuine first run meets onboarding unless the developer option is turned on | Open: whether the tutorial should **replace** onboarding on a real first run, follow it, or stay a developer-only alternate path, is not ruled yet and is named rather than decided silently |
| 19.E5 | The continuing journey as one page: journal, story bank, pattern bank, the four stations, progress | MISSING as one page; every piece exists on its own surface | Not this round. No drawing exists, and "progress over time" needs `19.B5` |
| 19.E7 | The quiz's answers become the person's starting coherence, their story follows them in, and a returning person skips the funnel. Round MI | MISSING | The server |
| 19.E8 | Real sign in against the server's existing routes. Round MP, "Wire the real login" | PARTIAL. The login screen is local and honest about it | The server |

### F. The voice and the creative brief

Source: `CREATIVE-BRIEF-voice.md`, read lightly at MY and read in full for
this pass. Most of it agrees with the house voice. What does not, found on
this read, so it is ported correctly rather than copied:

| Line | What | Status | Buildable now, or blocked on |
|---|---|---|---|
| 19.F1 | The brief checked line by line against `.claude/skills/atuned-voice/SKILL.md` and its runnable check | Not started | His own sequencing, MY: after atuned.world is live |
| 19.F2 | Porting rules for its examples, written into the voice skill before any example ships. Four of its screen examples are all capitals ("SEE THE PATTERN.", "AVOIDING THE NEXT STEP", "WHAT CHANGED", "YOUR WEEK"), against sentence case. Five lines carry an em dash, against the rule that there are none anywhere. "Coherence 72, Resistance 28" is a bare number, against his MP and JX rules, and the engine computes no resistance. The loop is drawn as a line, DISCOVER to EMBODY, against "a circle, never a list" | Found this pass | With `19.F1`. None of this edits his document; it governs what is copied out of it |
| 19.F3 | "Integrate" now means three things: the brief's verb after release ("Integrate the charge"), the TDDs' pattern state (RELEASED is not INTEGRATED), and the phrase "Integrate Protocol", which round GS removed from naming the mechanic. One word per concept | Found this pass | A copy decision of ours with `19.F1`. It reaches him only if the brief's verb is to reach the product |
| 19.F4 | V3's user loop, "Talk, Explore, Discover, Release, Practice, Live", stays inside working documents. The stations a person reads are ruled: discover, play, flow, embody, never translated (`DECISIONS.md`, "The loop's words") | Found this pass | Nothing to build. Recorded so no seat ships it |
| 19.F5 | The brief's evidence ladder on screen: what you said, what repeated, what it may mean, what is being tested, kept visibly apart | The rule matches the engine's own; the surfaces have nothing to draw it from | After `19.B7` |
| 19.F6 | A daily and weekly summary in the brief's shape, "Three patterns showed up repeatedly this week" | MISSING | After `19.B5`. "Repeatedly" needs identity over time, which no row carries today |

---

## The order, across all six

**This sits beside section 12, not above it.** Section 12's rows 2 to 5,
state corruption, the boundary, and writes that claim success, still go
before any new surface. Section 17 found them open at `6a2cfb3` and did not
re-measure them one by one, and neither did this pass. The only new surface
below is row 14, the tutorial, and it waits behind them.

| # | What | Who | Size | Depends on | Moves grade |
|---|---|---|---|---|---|
| 1 | R1 to R4 prepared and sent, each with its snapshot. For R1 that is two or three six mask mappings measured on the roster and drawn at 1600 and 390; for R2, the LZ paste asked for beside it | project manager, art direction for R1 | small for R2 to R4, medium for R1's drawings | nothing | no, and it releases rows 13, 14 and 15, and every change to how Source AI asks |
| 2 | `19.B1`, a saboteur named twice and a complex paired with itself | engineering | small | nothing | yes, a reading stops naming one thing twice. Everything below that follows a saboteur by name inherits it otherwise |
| 3 | `19.C1`, the finished release card stops calling a threshold a fact | copy, engineering | small | nothing | yes, a claim the product cannot back comes off the screen |
| 4 | `19.B3`, the archetypes credited to their source | copy, engineering | small | nothing | yes, it matches the credit Positive Intelligence already has |
| 5 | **The record keeps what it throws away, first half.** `19.B5` and `19.A12`: history rows carry which structures ran, the nine axes, and the six mask weights with a mapping version. Section 17 row 5 is inside this | engineering | medium: the row, the boundary's list of allowed keys, a series reader, a gate | row 2 | no on its own. Every longitudinal line on this page stands on it, and every day it waits is history not written |
| 6 | **Second half.** `19.B6` a lexicon version on every entry, `19.C2` heavy marks kept, `19.C5` ritual plans moved onto the record | engineering | medium | row 5, same file and same seat | yes for the heavy marks, which his completion words already promise |
| 7 | Masks, the structure. `19.A8` rail and hero, re-measured for six icons; `19.A6` the egg; `19.A5` never blank; `19.A11` the flat line | UX architect, art direction, engineering | large | nothing | yes. The page grades C, and the layout addendum measured structure from C to A minus |
| 8 | Masks, the data drawn. `19.A1` motion per mask, `19.A2` brightness and tier, `19.A3` snapping and one grid, `19.A4` the click | art direction, animation, engineering | large, two medium halves | row 7, same file | yes. The design's own estimate is C to B minus from these alone |
| 9 | `19.B4`, one handler for "not" and "never", replacing three, with no reading moved | AI director, engineering | medium | nothing | no. It is what limiters and contradiction both stand on |
| 10 | `19.B7`, the evidence index in the engine | engineering | medium | row 6 for the version stamp | no. It is what `19.F5` and `19.D5` stand on |
| 11 | `19.D7`, individual analytics from what is stored: the six axes on Analytics, and ritual follow through | engineering, UX architect | medium | row 6 for follow through | yes, a surface he ruled at NA |
| 12 | `19.E2` then `19.E6`, the funnel's copy to his storyboard, the disease line cleared first, then its look from the Field and the masks | copy, art direction, engineering | medium, then large | nothing | yes. It is the front door, ruled at LW, "The landing page is the funnel" |
| 13 | `19.A7`, `19.A9`, `19.A10`: the frames, the face as a body map, the weave, with the weave's "pick by address" fix | art direction, engineering | large | R1, rows 2, 7 and 8 | yes |
| 14 | `19.E1`, the Day One tutorial | UX architect, copy, engineering | large | R4, and section 12 rows 2 to 5 | yes. His storyboard is the copy, so copy before code is already met |
| 15 | `19.C3` with the check in, release measured rather than calculated | engineering, UX architect, game director | large | R3, row 6 | yes, "released" becomes something the person said |
| 16 | `19.B2`, one saboteur list: a proposal of ours, then the merge | AI director, engineering | large | rows 2, 8 and 13 | yes, one name for one thing |
| 17 | `19.F1` to `19.F3`, the brief against the voice skill, and the porting rules | copy | medium | atuned.world live, his sequencing | yes, but only once copy is written from it |

### Why this order, one line each

**Row 1 first because it is the cheapest thing on the page that releases
the most.** Four questions hold rows 13, 14 and 15 and the whole of
Source AI's question work. R1 cannot go without drawings, and the drawings
are ours.

**Rows 2 to 4 because they are small and they are truth.** Two are defects a
person can see today and one is a credit he asked for. None needs anyone.

**Rows 5 and 6 are the dependency under everything, and this is the last
cheap moment for them.** Section 4 said schema items get dearer with every
day of real records, and section 10 held them "until the server question
is answered, then done immediately". That question is answered: Cloudflare,
ruled 25 September ("The stack"), and the database created by round MR. The
deploy that would put records on it is stuck on one secret. That is exactly
the gap section 4 described, and it closes the day the secret is fixed.

**Rows 7 and 8 because every masks ruling but R1 is already in,** given
across rounds MT, MV, MX, MZ, NA and NB and listed above. The page he has
spent the most rounds on is the one with the most buildable, ruled work
sitting unbuilt.

**Rows 9 to 11 are the engine work the audits named as safe**, placed after
the masks because nothing a person sees moves until something draws them,
and row 11 is where the first of them is drawn.

**Row 12 runs in parallel from the start** and sits at 12 only because the
funnel is not reachable by a stranger until the deploy works. Its seat and
files touch nothing above.

**Rows 13 to 16 each wait on something named.** R1, R4, R3, and the masks
work that one saboteur list would otherwise land underneath.

**Row 17 last by his own words.**

### Where the order is arbitrary, said plainly

- **Rows 2, 3, 4, 7, 9 and 12 are parallel.** Different seats, no shared
  file. Ranking them against each other would be theatre.
- **5 then 6, and 7 then 8, are real sequences:** the same file and the same
  seat each time.
- **Rows 9, 10 and 11 can take any order after row 6**, except that 10 reads
  the version row 6 stamps.

## Section 17 and 18's masks rows, now

- **Row 4, the masks page specified: done.** `DESIGN-masks.md`, `6231bf0`,
  and three addenda.
- **Row 5, mask weights on history rows: not started.** Now inside row 5
  here.
- **Row 6, the masks page built: not started.** Now rows 7, 8 and 13 here.
- **Ruling 3, two masks that can never differ:** reopened as R1, in a new
  form, by NB.
- **Ruling 4, where the page lives:** answered in practice by the Character
  tab and the rail layout ruled for it. JZ's Body map question stays, under
  "holding nothing this round".

## Not doing this round

Named, so nothing disappears quietly.

- **The emergent pattern engine, TDD tasks EPE-001 to EPE-018.** The audit
  measured that most of it cannot be built honestly from what the product
  collects, independent of whether it should be. What would move it: a
  population under a designed consent and schema, on a server, and the
  "what may leave the device" ruling.
- **V3's trace graph as specified.** It conflicts with how the engine is
  built, canon tables recomputed on every reading. Row 10 ports the closest
  real thing instead, which is this project's rule: port, do not rebuild.
- **The behavioural ontology of 22 primitives, and the celestial engine's
  Kabbalah, name energetics and versioned mappings.** No surface asks for
  them. Name roots also sit against the standing "No etymology table".
- **The 90 day engine and its 30, 60 and 90 day reports, `19.D6`.** It
  would report the formula's constants until rows 5, 6 and 15 exist.
- **Limiter and channel detection, `19.B8`.** Buildable after row 9 and
  read by nothing. `leanSeries()` sat written and unread for the whole of
  section 4's life, and a second one is not wanted. What would move it: the
  ritual prompt he drafted at JX, "you're avatar wants to be a public
  speaker you're holding on to fear of judgments of others would you like
  to set up a release schedule for that", which is exactly a wanted thing
  and a limiter, designed as its reader.
- **The contradiction engine, `19.D5`.** After rows 9 and 10, and R2.
- **The AI handshake, `19.D9`.** No model exists to hold to it.
- **The mask tiers of round MD, `19.A13`.** No design, and about fifty
  pictures. After the rail.
- **The continuing journey page, `19.E5`.** No drawing, and it needs row 5.
- **Everything behind the server:** `19.E7`, `19.E8`, `19.D3`, `19.D4`,
  `19.D8`, Stripe, and the feedback page of rounds LW and LX.
- **"Move on" re-analysed, `19.D2`.** After launch, on real data, by his
  own word.
- **Ritual consolidation, `19.C7`, and a recurring pattern's return,
  `19.C4`.** Each waits on something named above.
- **The release document's own handshake, negative evidence and pattern
  replacement, `19.C10`, `19.C13`, `19.C14`.** The general handshake above
  has no model to hold to either; negative evidence needs the check-in
  ruling; pattern replacement is not recommended as specified, the V3
  audit's own reading applies here too, addresses derive from the nine
  axes and release is aimed at the heaviest one, so an apparent
  replacement is mostly a record of where someone released.
- **A named event log of a release run, `19.C16`.** After the heavy mark
  itself is kept, `19.C2`, which is the first event worth logging.
- **Editing any of his documents.** Where the brief or a TDD disagrees with
  a ruling, the port follows the ruling and the document stays as he wrote
  it.

## Found while doing this, and recorded where it lives

- **Section 6 and section 10 of this page said onboarding was stopped by
  his ruling twice.** Overtaken: round MH, "do onboarding and tutorial,
  first", round MP's redesign, built at `a9c2e28`, and his storyboard at
  MU. Both carry a pointer here now.
- **`BACKLOG-AUDIT.md` 2.13 listed the funnel as parked, "Do not ask."**
  Overtaken by LJ, which built its story step, by LW, "the landing page is
  the funnel", and by MU. A dated note is added there; nothing else in that
  file is changed.
- **`DESIGN-onboarding-narrative.md` says the pattern glimpse before the
  account is not built.** The quiz's story step shipped two days before
  that document, at `ac7e067`. A dated note is added under that bullet.
- **`DECISIONS.md` carries no ruling after 27 September.** Listed above,
  and owed.
- **Five of his documents are not in the repository.** Listed above.

---

# 20. 1 October. The three remaining documents, queued

His order, round NE in `TASKS.md`, recorded there as: "And a sequencing
instruction, his own order: finish the login first, do the onboarding copy
and the tutorial, then queue up every algorithm, tool and technique from all
five documents, plus modifications to the Story Engine and the sniffer,
"there's a lot of stuff so let's get it all in."" Login is built (round NE),
the tutorial is built (round NG, `19.E1`). Section 19 queued four of the
documents. This section queues what was left.

And his correction on the same round, which decides how the second document
here is read: "I didn't say build from scratch. It builds on top of what you
created." So the Impression Excavation Engine is read as an extension of
`engine/sourceai.js`, and every line in cluster H below names what it extends.

## The stamp on this measurement

    commit                b012b1e880bb872f363aa57b8d681ed7fc27490b
    tree                  NOT clean. Three files modified and uncommitted
                          by another seat, round NN's Field effects
                          dispatch: shell/head.html, ui/character.js,
                          ui/drills.js. None was read for this or touched.
                          engine/ and engine.js are clean.
    measured              1 October
    node tests/engine.js  1853 passed, 0 failed, on the committed engine.js
                          and again on the engine modules concatenated in
                          MANIFEST order into a scratch file, because the
                          committed engine.js predates b012b1e (see "Found
                          while doing this")
    browser gates         not run. This pass changes no source, and a
                          rebuild would dirty the tree to prove nothing

**Read in full:** `TDD-sniffer.md`; `DESIGN-sniffer.md`, which the TDD names
as carrying the questions for the owner (it carries thirteen, not the twelve
the TDD's line 5 says); `SOURCE-TDD-impression-excavation.md`; `TASKS.md`
rounds NE to NO; `AUDIT-source-tdd.md`; `AUDIT-source-tdd-v3.md`; this
page's section 19. **Checked against the code, not taken from the
documents:** `engine/sniff.js` 140 to 480 and 482 to 1101; `engine/sourceai.js`
whole; `ui/storyui.js` 383 to 398 and 440 to 779 and 1305 to 1318;
`engine/core.js` 367 and 378 to 399; `engine/compute.js` 243 to 300 and 355
to 466; `engine/lexicon.js` 80 to 110, 239 to 242 and 505 to 518;
`engine/verp.js` 1 to 23; `engine/data/canon.js` 393 to 420;
`engine/export.js` 14 to 16 and 159 to 181; `ui/imprints.js` 20 to 40.

**And the real engine, run rather than read.** Every "measured" below is one
call of `parseStory`, `sniffStory` or `srcHear` on the current engine source,
from a probe in this session's scratchpad. The probe was checked against a
known good case first: "I am afraid" must read root 16 and an empty string
must read nothing, and both did.

## The third document is the first one again

**`SOURCE-TDD-handoff-master.md` is byte for byte `SOURCE-TDD.md`.** Both
files hash to md5 `1bdd2ce41fa0e2250055262743873c61` and `cmp` finds no
difference, checked this pass rather than taken from the report that raised
it. `SOURCE-TDD.md` is already audited in `AUDIT-source-tdd.md` and queued in
section 19, so nothing new is queued from it. The two names are one document,
the way round NE found four re-attached files identical to saved ones.

## Read this first. What this adds to his list

Each goes with its snapshot, per the 21 and 25 September rulings. None goes as
it stands here. Row 1 of section 19's order is where they are prepared.

**S1. Three of the sniffer's open questions now hold real work.** Section 2
of this page filed `Q3` to `Q13` (the sniffer's thirteen, `TASKS.md` from
line 5805) under "blocks nothing and can wait for ever". His R2 answer at
round NE, that the Impression Excavation Engine goes into "all the features,
algorithms, tools, schemas, and systems", changes that for three of them:
- `Q4`, who acted. The engine's CONTACT step asks who was there, and its
  first rule is never to score another person. Measured: "I shouted at him"
  and "he shouted at me" both read solar 24. Holds `20.G6`.
- `Q5`, a charge described as past. Measured: "I used to panic and I do not
  any more" reads root 28, the same as "I panic every day". That sentence is
  the one piece of negative evidence a person ever volunteers, the thing
  `19.C13` says is never written down unless asked, and the reader charges it.
  Holds `20.G7`.
- `Q1`, event or stance. The engine follows BELIEF and MEANING, and a belief
  is a stance. Measured: "Rest feels like a moral failure" reads nothing.
  Holds `20.G10` and the belief half of `20.H1`.

**S2. Whether the document has already answered `Q13`.** `Q13` asks whether a
person may be shown an address name the text did not name. Measured: "I was
furious" returns Pride, Arrogance, Competition and Anger with `inferred`
false, and the Story page prints each as a named pill (`ui/storyui.js` line
1318). The document's first rule is "Never invent ... addresses", and his R2
answer puts the document into every feature. Read together that answers
`Q13` toward the narrower product: show the seat and the axis, never an
address off a sort order. **Confirmed with him rather than assumed**, the
same way section 19 treated R4. Holds `20.G3`.

**S3. "Registration is not causation", against his own why line.** The
document's rules 5 and 6: a body sensation is an observation and not proof of
cause, and "Registration is not causation." The shipped why line, ruled by him
at JX, says "The stress from this story is stuck in the nerves behind your
stomach" (`srcWhy`, `ui/storyui.js` lines 685 to 691), and the place it names
is the lexicon's seat for the word, which is a registration. The question: does
the why line stay as ruled, or move to the document's rule? The ways it could
go: keep it, as the product's own stated definition of Charge; reword it as
the mechanism without asserting it of this story; or remove it. Holds nothing
built, and decides what Source AI may say about a body.

**S4. Does a verified pattern gate the release, and what is an imprint?** The
document hands Release only a "RELEASE CANDIDATE" that has passed
VERIFICATION, and calls an imprint a pattern that "has earned a persistent
place" on the record. Today a commit queues its addresses into the release
straight away (`ui/storyui.js` line 1308, "its addresses are queued in the
release") and every commit makes imprints, which is his own content chain in
`CLAUDE.md`: "What a person enters in the journal is added to the imprints."
And at NE: "the release is rapid." The ways it could go: verification marks
evidence and gates nothing, which keeps every ruling; verification gates what
Source AI asks about but not the release; or it gates the release, which
reverses NE. Holds `20.H13`.

**S5. A question that offers two meanings.** The document asks, when language
is ambiguous: "Did you mean angry as in 'I needed to protect something
important' or angry as in 'I wanted to hurt someone because I felt hurt'?"
Round GO ruled that Source AI "doesn't use definitions", and
`engine/sourceai.js` lines 51 to 53 hold it to never naming one. Two offered
meanings are two definitions. Holds `20.H15`.

**S6. "Partly true".** The document's verification question has three
answers: true, partly true, not true. At NK he asked for presence only, "they
just need to feel it... just selecting the fact that it's even present."
Two answers fit that; the third is his. Holds the third state of `20.H4`.

---

## The lines, by cluster

Section 19 lettered A to F. This continues at G.

### G. The sniffer's own contract, `TDD-sniffer.md` and `DESIGN-sniffer.md`

**Most of this document describes the sniffer as built, and four of its
failure rows have moved since it was written.** Recorded first, so nobody
queues them:
- The stated fetter taken globally, `Object.keys(stated)[0]`. Fixed at round
  GR: `statedAt` is per seat, `engine/sniff.js` lines 347 to 350 and 390 to
  397. EXISTS.
- Offsets that do not address the person's text, question 11. Built at
  `fbe941c` as `ST1`: `normMap` and `marksOf`, `engine/sniff.js` lines 148 and
  444. EXISTS.
- Intensity modifiers not read. `LEXMOD`, `engine/lexicon.js` line 239,
  applied at `engine/sniff.js` lines 224 to 230. PARTIAL, see `20.G8`.
- Resistance dividing CQ, the "CQ contradiction" section. Settled by his 25
  September ruling: CQ is the 21 laws summed over 210, and Resistance "divides
  nothing any more" (`engine/compute.js` lines 358 to 388). EXISTS.
- An entry that reads as nothing reading as "you are clear", question 10. The
  Story page says "Nothing in this entry reads as held yet. Keep writing, or
  write where you felt it." (`ui/storyui.js` line 1307), and Source AI says
  nothing was read (line 750). EXISTS.

| Line | What | Status | Buildable now, or blocked on |
|---|---|---|---|
| 20.G1 | **Two saboteur readings of one story disagree.** `sniffStory` scores saboteurs on the ruled ramp and geometric mean (`sabMember`, `sabConfidence`, `engine/data/canon.js` lines 133 and 188). `compute()`, which is what every surface shows, still calls `sab33Detect` (`engine/compute.js` line 279), which rounds every level to an integer (`engine/core.js` line 381), scores a half point only at exactly one integer outside the band (line 392), averages arithmetically and cuts at 60 (lines 394 and 395). The TDD named this "the legacy path is half moved" and nothing queued it | CONFLICT. Also a dead branch with it: `L.anxiety` (`core.js` line 382) and the `'anxiety'` key at `compute.js` line 282, where measured 0 of 33 `SAB33` rows key on anxiety | Now as a measurement and a proposal of ours, then a build. `compute()` needs a set, and `DESIGN-sniffer.md` measured that a floor on a ramp recreates the cliff, so how the set is chosen is the decision. Readings move on the roster, named in the commit. **Rides with `19.B2`**, since one saboteur list has to say which rule it fires on |
| 20.G2 | A stated fetter at a seat another axis also holds is dropped by `parseStory`. Measured: "I am angry and exhausted" gives four Anger imprints and no Apathy; `sniffAxes` recovers Apathy 8.7, but `applyStory` and the Story page read the imprints | PARTIAL. The branch runs only when nothing else claimed the seat, `engine/sniff.js` line 393; repaired only in `sniffAxes`, lines 783 to 789 | **His, and already asked in shape.** Section 13 group A item 2 asks whether the field moves with the sniffer's contract for resentment; this is the same question for stated fetters, recorded open at round NE ("Sofia's line ... still waiting on a ruling"). Asked once, with one roster diff |
| 20.G3 | No address name printed off a sort order | CONFLICT on screen, `ui/storyui.js` line 1318 prints `im.name` whenever `inferred` is false | **S2.** Once confirmed, small and in the renderer: a named axis prints the axis and the seat, the way the inferred fold at line 1316 already does |
| 20.G4 | Disgust and Shock have words beyond their own names | PARTIAL. Measured: of the lexicon's entries that state a fetter, exactly one states Disgust, one Shock and one Surprise, which are the axis nouns the canon pass added. "I am disgusted" and "I was surprised" read nothing; "I was in shock" reads | **Now for Disgust and Shock**, as a coverage addition through `lexAdd` with provenance, the way round NO added self worth. `DESIGN-sniffer.md` counts both words in his book. Readings move. **Surprise is his**, question 7 |
| 20.G5 | Charge words seated where the seat's own addresses disagree. Measured: "I feel detached" reads crown Anger, inferred, naming Doubt Of God and Hubris. Round NE recorded three such cases and they reached no list | Open, and on no page: `ADJ2CHG` and "detached" both return nothing on this page before this section | **His**, question 6, `CHG2SEAT` against the addresses. Listed here so the round NE cases travel with it |
| 20.G6 | Who acted: "she lied to me" scored on the writer | MISSING. Measured: `sniffLaws` fires Truth, and `parseStory` places throat Disgust with Deceit and Lying under it. No subject model anywhere, `engine/sniff.js` lines 503 to 505 and 705 to 707 | **S1**, question 4, and `19.B4`'s clause reader underneath it |
| 20.G7 | A charge described as past | MISSING, measured as above | **S1**, question 5, and `19.B4`. The same look back machinery reads "used to" |
| 20.G8 | The degree words a person actually writes | PARTIAL. Measured: "a bit sad" and "unbearably sad" both read heart 16, because neither "a bit" nor "unbearably" is in `LEXMOD` | Now, small. Coverage, no new mechanism. Readings move only on stories carrying those words |
| 20.G9 | A shorter idiom eating a longer entry. Measured: "I cannot stop thinking about it" reads sacral, Addiction and Lust under Apathy, where the lexicon's own "cannot stop thinking" is rumination at the third eye | Open, held at exactly two rows by `LEX_DEAD`, `engine/lexicon.js` lines 516 to 518 | **His**, question 9. The document does not settle it |
| 20.G10 | The frame layer: sentences that carry charge with no feeling word | MISSING, specified in `DESIGN-sniffer.md` "The frame layer" | **S1**, question 1, then question 3. Port of `LEANFRAME` (`engine/verp.js` line 251), as specified |
| 20.G11 | Honest evaluation: a held set of about sixty lines, the count of what entries contain and the instrument reads as nothing, and a labelled set | MISSING, all three | The held set: now, written by a seat that did not write the tables, and kept out of `engine/`. The unread count: rides `19.D8`. The labelled set: his consent ruling, the same one as "What may leave the device" in section 19 |
| 20.G12 | `EXPRCUE` duplicating `EXPR` with different shadow words | A recorded debt, `engine/lexicon.js` line 670 | Not this round. Nothing reads it, see the finding under this table |

**The finding under this table.** Of the whole `sniffStory` contract, the
product reads one field: `ui/tutorial.js` line 183 takes `offer`. Saboteurs,
laws, flow, gates and depth are computed, exported (`engine/export.js` lines
163 to 181) and read only by `tests/engine.js`. So `20.G1`'s disagreement is
invisible today, which is why nobody saw it, and anything in cluster H that
wants evidence reads `sniffStory` rather than growing a third reader.

### H. The Impression Excavation Engine, `SOURCE-TDD-impression-excavation.md`

What Source AI is, read off the code: a count of how often a story comes back
to one seat, `srcRung`, which asks at seven and over (`engine/sourceai.js`
lines 99 to 105), four moves, `srcTurn` (lines 158 to 166), one why question
about a place (`srcAsk`, `ui/storyui.js` lines 598 to 606), and a second
button whose four questions already ask about the minute before, who was
there, what the body wanted and what came after (`SRC_DYN`, lines 629 to
633). The document's own ten core rules mostly hold already: the person's
words are kept (the entry stores its text, `ui/storyui.js` line 390) and
quoted back in the letters they typed (`engine/sourceai.js` lines 122 to
125); unknown is a valid result (the listen move; gates and depth return null,
`engine/sniff.js` lines 973 to 976 and 1038); one question, and Move on is
final (lines 158 to 166). What it adds is below.

| Line | What | Status | Buildable now, or blocked on |
|---|---|---|---|
| 20.H1 | **The question engine on top of `srcTurn`.** Read which of the document's dimensions an entry already answers (trigger, feeling, body, behaviour, prediction, belief, meaning, contact, goal) and ask the smallest question about one it has not | PARTIAL. `SRC_DYN` asks four of them and walks them by how many times the button was pressed (`lap`, `ui/storyui.js` line 637), not by what the entry left unanswered. Nothing identifies an unknown | **After `19.B4`**, so the cue tables do not become a fourth negation handler. Keeps `SRC_ASK` and Move on exactly as ruled at GO; only which question is chosen. The document names eight scoring factors and gives no values, and there is no labelled set to fit them, so the honest form is a stated order of precedence, not a weighted sum. New question wordings are taken from the document's own examples and pass the voice check first. AI director, engineering, copy. Medium |
| 20.H2 | **The body word the person used is where the body is.** The document's own failure test, run: "I felt tight in my chest when my boss called" reads throat 16, Disgust, with Deceit and Lying under it | PARTIAL. Body places are read only as fixed phrases, "chest tight", "jaw clenched" (`engine/lexicon.js` lines 84 to 89); split up by other words, "tight" falls back to its own seat, throat (line 101) | Now as a measurement, then a build: a place word in the same clause as a sensation word decides the seat. Needs the clause boundary `19.B4` builds. Readings move. The document's other body fields, side, temperature, texture, colour, size, are not this round: nothing reads them, and "side" already means the release's left and right (`CHAN`, `ui/release.js` line 36) |
| 20.H3 | The document's failure tests as a gate | PARTIAL. `tests/engine.js` already asserts no diagnosis and null over a guess | Now, small, the half that passes today: on the worked example Source AI listens and asks nothing (measured: rung 1, move listen). The seat half lands with `20.H2` |
| 20.H4 | **A verification move:** "Does that feel true, partly true, or not true?", and reject, refine and pause beside Move on | MISSING. Move on is the only answer a person can give (`ui/storyui.js` lines 738 and 777), and it is page memory cleared at commit (line 396) | After `20.H1`, since there has to be something to verify. Two states now under NK; **S6** for the third. This is the first answer a person gives that is about the reading itself, and nothing stores it, see `20.H5` |
| 20.H5 | **What Source AI asked, kept with the entry.** Which question, about which seat, and whether it was answered, refused or moved on from | MISSING. An entry stores time, text, an imprint count and seat totals (`ui/storyui.js` lines 390 and 391); every Source AI state is page memory (`SRC_PASSED` line 490, `SRC_DQ` line 626) | **Rides `19.B6`**, section 19 row 6: same field on the same entry, same pass through `validateProfile`. Privacy checked first: it stays on the device and stores a question kind and a seat, not text, so it sits inside the narrow version of `DESIGN-sniffer.md` question 12 that round GO built |
| 20.H6 | **What read as nothing, reported.** The document's matching order ends at NOVEL: a signal with no canon match is kept, not dropped | PARTIAL. Exact match is `scanStory`; fuzzy is the corpus confirmed fold (`LEX_FOLD_OK`, `engine/lexicon.js` line 467); semantic and related do not exist. Nothing reports the stretches of an entry that produced no hit | Now, small, engine only: the complement of `marksOf` (`engine/sniff.js` line 444). No reading moves. `20.H1` reads it to follow signal before label, and `19.D8`'s count is built from it once there is a server |
| 20.H7 | The excavation's states, UNSEEN to VERIFIED with five exits | PARTIAL. Four moves: open, listen, ask, pass, where pass is the document's ABANDONED_BY_USER | Not its own build. `20.H1` and `20.H5` carry what is needed; a separate state machine with nothing to read it is the `leanSeries()` lesson again |
| 20.H8 | The impression object, sixteen fields, the behaviour vector and protection | MISSING as structures. The real counterparts: `parseStory`'s hits carry word, seat, amount, fetter and degree (`engine/sniff.js` lines 420 to 422), and approach, avoidance and attachment cues already exist as `VERPCUE` (`engine/verp.js` lines 17 to 23) | **Not as specified.** Port, do not rebuild: `20.H1`'s reading of which dimensions an entry answers is the impression. The same call section 19 made on the trace graph |
| 20.H9 | Causal reasoning, relationship types and the trace graph | Conflicts with how the engine is built, as section 19 already found for V3's graph | Not doing, same reason. **S3** is the one place the document's causation rule bites shipped copy |
| 20.H10 | Candidate root: the smallest belief that organises several signals | Two meanings of one word. The built root is rung ten, a seat the story keeps coming back to (`engine/sourceai.js` lines 34 and 101), ruled at GO; the document's root is a sentence, "I have to avoid disappointing people to remain connected" | The sentence form needs belief read from text, which is `20.G10`, which is **S1**. Not this round |
| 20.H11 | Archetypes always present, and their expression moving with a story | PARTIAL. All twelve carry a value on every reading (`affinity`, `engine/core.js` line 367, read at `engine/compute.js` line 460); a story does not move it | Expression from a story: not this round, no surface asks. The ambiguity question: **S5** |
| 20.H12 | Post-release evidence returning to Source AI | MISSING. `srcPrior` reads only the seat totals earlier entries stored (`engine/sourceai.js` lines 90 to 95), nothing about releases | After `19.C2` and `19.C4`. Reading the person's own release record on the device is a wider grant than question 12's narrow version, so it is checked against that before it is built |
| 20.H13 | The handoff to Release carrying evidence, context and a verification state | PARTIAL. Release receives address ids, `relPick` (`ui/release.js` line 190) | **S4**, then `19.C10` and `19.C11` |
| 20.H14 | Attachment history as a low weight signal, and jouissance as three states, constriction, equilibrium, jouissance, cross checked by Temperance | CONFLICT on both words. Jouissance already means the opposite overshot, `n.jq` (`engine/compute.js` line 246); attachment is already a gate, `attach` (`engine/verp.js` lines 13 and 22) | Not this round. Added to the standing "one word or two" question in section 19's "His, real" list |

### Added to existing lines, not new lines

- **`19.B4`, the shared negation handler.** Two additions. First, the three
  handlers differ in more than width: `lawNegated` stops at a sentence end
  (`engine/sniff.js` lines 694 to 722) and `srcNegated` does not
  (`engine/sourceai.js` lines 83 to 86), so unifying them chooses a
  behaviour, and that choice moves Source AI. Second, `20.G6`, `20.G7` and
  `20.H2` each need the same clause boundary, so it is built as a clause
  reader the four can share, not only a yes or no on negation. The measured
  case for it stands: "I am not afraid but I could be afraid" reads root 32,
  double "I am afraid".
- **`19.B8`, limiters and desired outcomes.** Section 19 parked it because
  nothing reads it. `20.H1` is a reader: the document's GOAL dimension and
  its GOAL against BEHAVIOUR contradiction are this line's wanted thing and
  what stands in the way. It still waits on `19.B4`.
- **`19.B6`, a lexicon version on every entry.** `20.H5` writes to the same
  entry in the same pass.
- **`19.B7`, the evidence index.** The document's confidence bands, WEAK to
  VERIFIED, are written as "engineering thresholds, not claims about
  psychological truth", which agrees with keeping them inside the engine.
  Whether a person ever sees one is still his, in section 19's list.
- **`19.D5`, the contradiction engine.** R2 is answered: this document is the
  engine, and it gives eight contradiction types and six states. From text
  alone, word against word is reachable after `19.B4`; word against
  behaviour needs `VERPCUE`; goal and value against behaviour need `19.B8`.
  Its output is still a question, so it goes through `20.H1`.
- **`19.D8`, learning across people.** `20.G11`'s count of what reads as
  nothing, built from `20.H6`, is the word level version his ruling already
  allows.
- **`19.C13`, negative evidence.** `20.G7` is the one case a person writes
  down unprompted.

## What a seat could pick up without him

**Not placed in the live order, and said plainly why.** The live order is
section 19's table. Section 1's table says at its own head that it is
superseded, and the stamp at the top of this file still points at section 19.
This pass was told to add one section and touch nothing else, so it does not
renumber section 19's rows. These are flagged for the project manager to
place:

| Line | What | Size | Depends on |
|---|---|---|---|
| 20.H6 | What read as nothing, reported | small | nothing |
| 20.H3 | The failure test half that passes today, as a gate | small | nothing |
| 20.G8 | "a bit", "unbearably" and the rest as degree words | small | nothing; readings move |
| 20.G4 | Disgust and Shock coverage, Surprise left for him | small | nothing; readings move |
| 20.G1 | The two saboteur readings, measured and a proposal written | medium | proposal with `19.B2` |
| 20.H5 | Source AI's question kept with the entry | small inside row 6 | `19.B6`, section 19 row 6 |
| 20.H1, 20.H2 | The question engine, and the body word deciding the seat | medium each | `19.B4`, section 19 row 9 |

## Not doing this round

- **The impression object, the trace graph, the relationship types and the
  state machine as specified**, `20.H7` to `20.H9`. Port, do not rebuild.
- **The frame layer and the sentence form of a root**, `20.G10` and
  `20.H10`, until question 1.
- **The document's longitudinal set**, context transfer, pattern replacement,
  behavioural and outcome change. Section 19 already found pattern
  replacement not recommended as specified (`19.C14`) and negative evidence
  waiting on a check in (`19.C13`); context transfer needs context read from
  text, which nothing does.
- **Archetype expression from a story, attachment history and the three
  state jouissance**, `20.H11` and `20.H14`.
- **A labelled set**, `20.G11`, until his consent ruling.
- **Editing either sniffer document.** `TDD-sniffer.md` is out of date where
  listed in cluster G, including its gate count of 1083 against 1853 today.
  It is recorded here, not corrected there.

## Found while doing this, and recorded where it lives

- **The committed `engine.js` does not carry round NO's lexicon addition.**
  `grep -c 'no self worth'` reads 0 in `engine.js` and 4 in
  `atuned_src/engine/lexicon.js`; `engine.js` was last committed at `96e8e70`,
  the lexicon at `b012b1e`. Round NO said the build products wait for round
  NN's dispatch. Recorded so nobody measures the sniffer off `engine.js` and
  reads the old lexicon.
- **`19.B1` and `19.C1` are built and their rows do not say so.** `19.B1` at
  `engine/compute.js` lines 267 to 276, one saboteur one entry, with its gate
  group in `tests/engine.js`; `19.C1` at round NE. Not edited here.
- **The head of this file still names section 19 as the current stamp.** Not
  moved, for the same reason.
- **`DESIGN-sniffer.md` carries thirteen questions** and `TDD-sniffer.md`
  line 5 says twelve.
