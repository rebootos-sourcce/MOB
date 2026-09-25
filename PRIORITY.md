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
- **Onboarding.** Stopped by his ruling, twice, not deferred.
- **The schema items, including `CP5`.** Deliberately held until the server
  question is answered, then done immediately, in the gap before the service is
  built. That gap is the last cheap moment.

---

# 11. Needs a ruling

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
