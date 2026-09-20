# PRIORITY

The order. Owned by the project manager, scrubbed with the technical director
and the art director. `TASKS.md` stays the record and nothing here replaces it.
This file says what gets built, in what order, and what does not.

## The stamp on this measurement

Every count below was read off the file and off the run, not out of a document.

    commit                  64529da, tree dirty, 9 paths
    TASKS.md                5,769 lines, md5 cd980e93f724
    measured                20 September, 21:11 UTC

    open        [ ]         465
    his ruling  [?]         113
    specced     [~]          18
    built       [x]         266
                            862 lines carrying a state

    node tests/engine.js      1287 passed, 0 failed
    node tests/functional.js   758 passed, 0 failed
    node tests/collide.js      100 passed, 0 failed
    node tests/design.js       112 passed, 0 failed, run on its own, twice
    ./atuned_src/BUILD.sh        source.html 1,531,011 bytes, div balance 0
    ./atuned_src/BUILD-engine.sh engine is host free, 399 exports

**The list moved while it was being read.** At 20:52 it carried 428 open, 109
his, 260 built. At 21:06 it carried 465, 113, 266. Twenty five minutes, plus 37
open against plus 6 built, and a commit landed under the read. Five seats are
live in this tree. That is roughly one and a half new open items a minute
against one built every four minutes.

**So an ordering of 465 items is obsolete before it is read, and this file does
not attempt one.** It orders ten. Everything else is sorted into blocked,
stopped, or waiting behind a named ruling.

---

# 1. THE ORDER

| # | What | Who | Size | Depends on | Moves grade |
|---|---|---|---|---|---|
| 1 | `SY1-SY5` the journal box | UX, art direction, engineering | medium | nothing | yes, the surface he graded worst |
| 2 | `E7` then `E2`, the two field leaks | engineering | unsized, see below | nothing | protects it |
| 3 | `GT2` the frame rate measurement | engineering | small | nothing | no, it makes the grade readable |
| 4 | `RL1-RL4`, `RC10-RC13`, `SR1-SR5` the release panel and controls | UX, engineering | medium | 1 | yes, his second high priority |
| 5 | `SI1-SI3` the imprints panel | engineering | small to medium | 1 | yes |
| 6 | `SX2`, `SX3` the counting subtext and the pill treatment | copy, art direction | small | 1 | yes |
| 7 | `TD1-TD4` the two dials, one design | art direction, engineering | medium | nothing | yes |
| 8 | `FE1`, `FE3` the feathers, and the width channel | art direction | medium | nothing | yes |
| 9 | The ritual reconciliation. Not a build | project manager | small, and it is reading | nothing | no, it makes the next ten buildable |
| 10 | `LG1-LG7` the logo | art direction | medium | nothing | yes |

## The argument, one line each

**1. The journal box.** His words today: "This is high priority. The most
important portion of the product has gotten the least amount of attention." The
file agrees with him and the number is brutal: of the 31 items on the story and
release surfaces, **1 is built**, and it is `SY6`, which he caught himself.
Every other subject on the list is between 40 and 68 percent built.

**2. The two field leaks.** `E7` writes a reference persona into the person's
own store on a visit and `E2` is a second leak upstream of the release. `B1` in
the built column records this exact class shipping once already, with 50.6 of
borrowed charge, and records that two fixes were worse than the bug. A defect
that writes a stranger's reading into somebody's record outranks every
aesthetic item on this list.

**3. The frame rate measurement.** `design.js` gate 13 measured 24.8, 20.9 and
21.3 frames against a floor of 30 in a stacked run this afternoon, and 112 of
112 green when run on its own, twice. `GT1` already says it: a gate that cries
wolf gets ignored on the day it is right. Until the measurement is fixed, every
round ends in a judgement call about whether a red is real.

**4. The release panel and controls.** His other high priority, ruled today.
This is deliberately only the half that is not blocked: the panel before it
begins, the end button, the countdown in real minutes, selection by density,
the icon per pattern. The `RV` block is not here and cannot be, see section 3.

**5. The imprints panel.** `SI3`, "press several and it tells you how they work
through you together", is the only genuinely new thing in it, and the engine
already builds complexes out of pairs. So it renders a computation that exists
rather than inventing one.

**6. The counting subtext and the pill treatment.** `SX3` is one call site:
`ui/storyui.js` already calls `crPat`. `SX2` removes the counting subtext he
has now struck three times. Both land in the files item 1 is already open in.
**`SX1` is deliberately not here.** See section 5.

**7. The two dials.** His twelfth pass, one design used twice. The technical
director's finding makes this cheaper than it reads: `leanSeries()` in
`engine/verp.js:538` builds the oscillation series `TD3` asks for, it is
exported, it is covered by the engine gate, and **it has zero callers in the
whole UI.** The range is a render job, not an engine job. Both dials live in
`ui/ui.js`.

**8. The feathers.** `FE2` is already settled and establishes the facts: length
is the value, width is a constant per layer. `FE3` is therefore a real chart
defect, width reads as magnitude to every eye and here it carries a category.
His instinct found it. Art direction owns the fix.

**9. The ritual reconciliation.** Not a build, and it is the highest leverage
action on this list. The ritual carries **101 open items across 12 sections**,
specced by different seats on different days, and no later spec retires an
earlier one. Nothing in items 1 to 8 touches the ritual, so this costs nothing
to do now and saves weeks the moment anybody starts there.

**10. The logo.** Ruled today. It is last of the ten because it is the only one
that is genuinely new surface rather than a fix to something a person already
meets, and because it is a design language item, not a surface item. See
section 5.

## Where the order is arbitrary, said plainly

- **1, 2 and 3 are parallel, and the order between them is arbitrary.** They
  are three different seats in three different files with no shared path:
  `ui/storyui.js`, the leak in the store and release path, and
  `tests/design.js`. Ranking them against each other would be theatre.
- **4, 5 and 6 are one item in three parts,** not three items. They are all the
  story page, they touch the same files, and splitting them across blocks would
  mean opening `storyui.js` three times. Build them together or build them in
  this order, it does not matter which.
- **7 and 8 could swap with nothing changing.** Both are art direction on the
  Field and the strips, neither blocks the other, and neither is blocked.
- **9 can move anywhere in the ten** without cost, because nothing above it
  touches the ritual. It is placed at 9 so it happens this round rather than
  never.

---

# 2. THE 113 THAT ARE HIS, RANKED BY WHAT THEY UNBLOCK

Most of these block nothing and can wait for ever. Six block a great deal. The
first five are worth a month between them.

## The five, in order of what they release

### Q1. The twenty one laws, and what coherence is. `SN5`, `SN6`, `SN7`, and they are one ruling

**Ask him once, not three times.** The sniffer spec and the engine disagree
about which twenty one laws: 19 are shared, the spec has Ownership and Wisdom,
the engine has Responsibility and Accountability. That is the divisor. The spec
then defines coherence as the mean of the laws times ten; the engine computes
`CQ=(It*Ig)/Rz` at `engine/compute.js:140`. And malignancy is computed off
coherence, so either definition takes a blank profile from 28 malignant to
nought and flips it benign.

    measured    CQ is referenced in 21 files, 13 of them UI
    measured    a blank profile reads 28 of 100 malignant today  (BM5)
    measured    answering every funnel question in the middle lands at 24  (FD10)

Downstream and released by one answer: `BM5`, `FD10`, `SP12` (his own spec
lists E43 as retired in section 7 and live as Wisdom in section 6, and Wisdom
is one of the two disputed laws), `SP13` (his spec names the benign and
malignant polarity conflict as OPEN, and the lean work already scores on it),
`D16`, the whole lean surface, the funnel's result number, and the tier ladder
in `DECISIONS.md`, which is priced on CQ.

**Options:** adopt the spec's definition and accept that releasing every charge
moves coherence by nothing; keep the engine's and correct the spec; or keep
both with the spec's as a second reading under its own name.

### Q2. `D11`. The opening surface, and whether the avatar is a tab

    measured    TABDEF carries 9 entries in the built engine.js
    measured    none of them is the avatar
    measured    there is no ui/avatar.js; runAvatarDrill lives in ui/drills.js

This is the largest blocked pile on the list. **66 open items across 7
sections** wait on it: `BL`, `CS2`, `MK2`, `AV`, `KU`, `CH`, `AP`, `AVS`,
`BLOCK D`, plus `N2`, `AO3` and `N3`. It also decides `RT9` (is what the ritual
sets pulled from the avatar) and `CL13` (the reading picks the always on ritual
by the darkest band, the avatar picks it by the most live imprints, and for
Marcus those are two different seats).

**He should see this before he answers:** the opening surface has already
flipped twice and `CLAUDE.md` records both flips. A third flip is affordable.
A third flip that is not written down is not.

**Options:** the avatar is a tenth tab and the app opens on it; it is a tenth
tab and the app still opens on the Field; or it stays a drill and the character
sheet is folded into Summary.

### Q3. `RV7` and `RV8`. The audio

He ruled the release flow high priority today. Its entire `RV` block is blocked
on this and nothing in it can start.

    measured    source.html is 1,531,011 bytes
    measured    atuned-slim.html is 1,037,834, and the build already had to be
                compressed to arrive at all
    standing    one file, no dependencies, no network

**Options:** embed the recording as base64 and accept the size; fetch it at the
one network seam the accounts fork opens; or synthesise everything and keep no
recording, which loses `RV1`, his own voice opening the protocol.

Two things ride with it. `RV1` needs a recording only he can make. `RM1` names
a mobile app with a release flow he wants reviewed five times, and **it is not
in this repository**; it has to be handed over or that instruction cannot be
followed.

### Q4. The currency. Karma, points, or patterns

Its own line already says it blocks work. Three words are live for one thing in
three current documents: `DESIGN-progression.md` rules exactly one currency and
asks for a build gate against a second, `PRODUCT.md` and `AE1` say points,
`AK2` says karma.

Releases the gamification ladder, **24 open items**, plus what a mark is worth,
whether a balance is a number a person sees, and the gate that document is
waiting to have written. **Cost to him: one word.** This is the cheapest large
unblock on the list.

### Q5. `AS2`. Is there a server, and when

He has never been asked this cleanly. It is scattered across `D15` (paywall),
`D17` (the two API keys, which have nowhere safe to live until it exists),
`FN3` and `FD11` (running comments), `AS1` (login), the practitioner view and
push notifications. `CLAUDE.md` already says the fork is called to accounts.
What is not ruled is whether the service is built now or the app stays one file
for another round.

**This answer releases very little and cancels a great deal**, which is why it
is worth asking. About twenty items currently read as open that are in fact
impossible, and they should say impossible rather than open.

### And the sixth, because it is the cheapest thing on this page

**`SX1`. What replaces the word "addresses".** He ruled the word out today: "a
meaningless term to a person." He has not given the word in.

    measured    212 occurrences inside string literals, across 33 files
    measured    including engine/data/canon.js and cards.js, which are the codex

One word from him starts the largest language sweep on the list. Until he gives
it, every surface built prints the word again and the sweep gets bigger. See
the technical director's column.

## The other 107

They are real and they are not urgent. The honest sort:

- **Blocks one surface and nothing else.** `CB4`, `CB9`, `CB10` (the chakra
  band cannot be drawn until something says what high and low inside a band
  mean), `RQ1-RQ5` and `CL12`, `CL14`, `CL15` (ritual defaults), `SW6-SW10`,
  `AH5-AH7`, `AM4`, `AM5`, `PC3`, `D20`, `D4`, `D5`, `D7`, `D8`.
- **Blocks a claim, and the claim is a real exposure.** `PO2`, the word "heals"
  is a regulated therapeutic claim and the funnel cannot ship carrying it.
  `D10`, the therapy equivalence claim, same. `SF6`, six people in the roster
  reach a surface naming Psychopathy and Machiavellianism with a clinician on
  screen, and it has never fired. These three are small for him and they are
  the ones a lawyer would pick out first.
- **Blocks an asset only he can supply, so no answer unblocks it.** `VID1` and
  `D3`, the universal law videos live on his own drive and nothing in this
  container can reach it. `NS3`, he says we have the five nerve state icons and
  no table of nerve states exists in the source.
- **Blocks nothing and can wait for ever.** The bulk of the sniffer's thirteen
  questions, `Q3` to `Q13`, the six places the book and his spoken description
  disagree, `AH6`, the wording questions, and the two collisions named in
  `OB25`. They are worth having answered one day. Nothing stops today.

---

# 3. BLOCKED VERSUS MERELY UNSTARTED

These look identical on the list. They are completely different to plan with.

## Actually blocked. Effort cannot move them

| What | Open items | Blocked by | Can it be unblocked |
|---|---|---|---|
| The avatar and the character sheet | 66 across 7 sections | `D11` | yes, one ruling |
| The `RV` release flow | 6 | `RV7`, and `RV1` needs his voice | ruling, then an asset |
| The chakra band | 5 | `CB9`, nothing says what high and low in a band mean | yes, one ruling |
| The universal law films, `C9` | 4 | the files are on his drive, unreachable | only by handing them over |
| The nerve state icons, `NS` | 4 | the artwork is not in the repository | only by handing them over |
| Everything needing a server | about 20 | `AS2` does not exist | yes, by deciding to build it |
| The mobile release flow review | 1 | `RM1`, the app is not in this repository | only by handing it over |

## Merely unstarted. A seat could open the file tomorrow

**Every one of the top ten is in this column. None of them is blocked.** The
journal box, the field leaks, the frame rate measurement, the release panel and
controls, the imprints panel, the counting subtext, the two dials, the
feathers, the ritual reconciliation and the logo.

**That is the shape of the problem in one sentence.** The two largest piles on
the list, the ritual at 101 and the avatar at 66, are the two you cannot act
on: one is over specced and one is blocked. The work you can act on is a thin
layer at the top that arrived in the last twelve hours.

---

# 4. THE TECHNICAL DIRECTOR'S COLUMN

What it costs, and what it costs if it is done later rather than now.

## Gets much more expensive with every day of real records

**These are the schema items and they are the reason the order matters.** There
are no records off device today, so all of this is free. The moment `AS2`
exists, every one of them is a migration against live data.

- **The history whitelist.** `validateProfile` rebuilds every snapshot from a
  16 key whitelist. Measured in the record: 16 keys written, 15 returned,
  `lean` silently dropped, and it returns `ok: true` while doing it. Adding the
  line is free today. After the record store it is a migration plus a
  backfill plus a version check.
- **Schema v2.** Named as his in `CLAUDE.md`. The gates bump is additive and v1
  still loads, which is exactly the property that expires the day a second
  party holds a v1 record.
- **`Root_08_Unnamed`.** It carries no fetter, so the root can never fully
  conduct and the kundalini rise can never read 100 for anybody. Two fully
  installed reference people read 99. Naming it is a data table edit now and a
  reading change for every stored record later.

**The ruling this implies:** answer `Q5` before building the service, and land
the schema items in the gap between the answer and the build. That gap is the
last cheap moment and it closes once.

## Gets more expensive with every surface built

- **`SX1`, the addresses rename.** 212 string literals across 33 files today.
  Items 1, 4 and 5 of the order all print the word, and so does every ritual
  and avatar surface behind them. Six new surfaces built before the rename cost
  more than the rename plus six surfaces. The sequence that is actually honest:
  get the word this round, sweep next round, before the ritual and avatar work
  starts.
- **The logo.** It is drawn once and referenced at four sizes, and the boot
  animation builds the mark from its own paths, so the animation is rewritten
  with it. Every new surface that draws the wordmark adds a site.

## Gets cheaper, or already did, and the list has not noticed

- **`TD3` and `TD4`, the oscillation range.** `leanSeries()` is written,
  exported through `engine/export.js`, covered by the engine gate, and has zero
  UI callers. The data is built. This is a render.
- **`BL2` is stale and must be re-measured before it is built.** It says the
  release ceiling "already exists as a number and nothing surfaces it."
  Measured: `ui/release.js:100` reads `cqCeiling()` and `ui/summary.js:591`
  reads `cqHeadroom()`. Part of it landed. Building it as written would build
  something twice.

## Costs a little more every round it is not done

- **`GT2`.** Every round currently spends judgement on whether a red frames line
  is real, and `GT3` makes that a manual re-run. Small to fix, and it compounds.
- **The ritual reconciliation.** 101 open across 12 sections, and the last two
  passes each added a ritual section without retiring one. The cost of
  reconciling grows with every pass.

## Unsized, and what would size it

I will not invent a number for these.

| What | Why it is unsized | What would size it |
|---|---|---|
| `E2`, `E7` the field leaks | not reproduced | a failing test that demonstrates each, which is this project's own rule |
| `SY5` the box carrying its weight | it is a feeling, not a rule, and the list says so | three comps to grade |
| `SR5` the release buttons | named by him, not specified | a proposal, not a guess |
| `RV5` the counts | depends on whether it is heard or read | `RV7` |
| The avatar page | depends on whether it is a tab | `D11` |
| `R1` the knowledge base restructure | specified against a surface that has since been rebuilt | a re-scope against the deck of cards that now exists |

---

# 5. THE ART DIRECTOR'S COLUMN

The calibration for "everywhere" is already in the record. `SA5`, the
saturation bump, moved **17 colours in 4 tables**, plus the boot sheet's own
copy of the palette which carries a gate that fails if the two part company,
plus `funnel/tokens.css`, which `BUILD.sh` generates and which the run reports
as 44 tokens. Five files and a gate. That is the floor for a design language
item, not the ceiling.

    measured    7 lightings: dark, snow, punch, glass, glasswhite, flat, lumen
    measured    9 surfaces in TABDEF, plus Settings and Analytics folded
    so          a design language change is 63 render states before the funnel

## One surface. Schedule these as surface items

- `SY1-SY4`, the journal box. `ui/storyui.js`, 281 lines.
- `SI1-SI3`, the imprints panel.
- `RL1-RL4`, the release panel.
- `RC10-RC13`, the release controls.
- `TD1-TD4`, both dials. Both live in `ui/ui.js`.
- `FE1`, `FE3`, the feathers. The Field canvas.
- `SX3`, the story cloud pills. `ui/storyui.js` already calls `crPat`, so it is
  one call site.

## Design language. Do not schedule these as surface items

- **`SX1`, the addresses rename.** 212 string literals, 33 files. It reaches
  `engine/data/canon.js` and `engine/data/cards.js`, which are the codex, so
  the knowledge base text changes and `BOOK-ERRATA.md` needs a pass in the same
  breath. **This is the largest language item on the list and it is currently
  filed beside `SX2` and `SX3`, which are both one surface.** Splitting them is
  the single most useful edit anybody could make to that section.
- **The logo, `LG1-LG7`.** `LG3` says the blue moves per lighting and `LG4`
  says the white dot does not, so the mark is specified **7 times, not once**,
  then at 4 sizes, then in the boot animation which builds it from paths. The
  funnel inherits it only if it is tokenised, because `tokens.css` is generated
  from the stylesheet.
- **`N4` and `AR1`, the copy editor pass on every number.** Standing. This is
  the rule that changed every stat card in the product. It is not a task, it is
  a property, and it gets re-broken by every new surface.
- **The figure treatment.** Measured adoption: `cr()` in 9 files, `crBadge()`
  in 3, the `crNode` family in 4. Changing the component lands on every one.
- **`SX2`, all the counting subtext goes.** Reads as one surface and is not.
  The counting subtext pattern is on the story page, the release, the ritual
  and the Summary. It is on the order at 6 because the story page half is the
  half that is in flight; the rest is a sweep.
- **`CP`, the copy sweep of the whole product, and `TX`, the scale phrasings.**
  Both are whole product by name and both are filed as ordinary items.

---

# 6. WHAT TO STOP

Nothing here is deleted. Every line stays in `TASKS.md` with its wording. These
are marked, with the reason, so they stop competing for attention.

## Stopped by his own ruling

**The onboarding block. 25 open items.** `0p` `OB` carries 15, `SIG` 6, `OBS`
4. He ruled onboarding off today, `PZ2` records it, and the seat stood down and
wrote what it measured to `DESIGN-onboard.md`. `AN3` and `AN7` in `2f` are the
same item in the old section and go with them. **This is the single largest
stoppable pile on the list and it proves the category exists.**

**One exception, keep it.** `OB22` is a real defect: `proto/signal/signal.html`
prints 62 out of 100 and 74 degrees out of 180 on a reading. It is cheap, it is
in a prototype, and it survives the stop.

## The product has moved past it, and the line now says something false

**`AO0`. "The funnel. Zero pages exist. He thought it was built."** Measured:
`funnel/` holds `index.html`, `about.html`, `buy.html` and `quiz.html`, plus
`tokens.css` generated by the build, plus ten screenshots. **The line is false
and it is the exact defect this repository has written down nine times.** It
should read as built or be rewritten. It must not stay as it is, telling the
owner the funnel does not exist.

**`R1`, the knowledge base restructure, as written.** The KB was rebuilt:
`KB1-KB5` record rows above the fold going from 12 to 39 at 1600, the glossary
leaving the decks, and 258 of 332 rows carrying a figure. `R1` specifies
headers with icons and narrative framing against a wiki list that is now a deck
of cards. Building it as written would regress the rebuild. Re-scope, do not
build.

**`2g`, the closing review. `AP1-AP5`.** The architecture run six times, the
persona simulation, the focus group at scale, then the release. Real work, and
it will never again be the most important work in its current form, because the
product it was written against has been rebuilt underneath it. Re-scope or
retire. Note also that `AP1`, `AP2` and `AP3` are three of the colliding
identifiers below.

## Two seats solving the same thing from different ends

**The avatar has two incompatible designs and nothing reconciles them.** `0o`
`AV`/`KU`/`CH` says the product opens on the avatar and the kundalini is the
progress bar. `0i2` `BL`/`CS2` says the avatar is a character sheet whose stats
are ceilings being held down, and that "one inversion decides every gauge on
the page." Those are different products. One of them has to lose before a line
of it is built, and `D11` is where that starts.

**The always on ritual has two sources that disagree.** `CL13`: the reading
picks by the darkest band, the avatar picks by the seat carrying the most live
imprints, and for Marcus those are two different seats.

**The currency has three words in three documents.** Covered at Q4.

**The ritual page has been specced seven times.** `0q` as a system, `0v` as
design B as a calendar, `0v` again as a D minus, `0j2` as a C minus with a
second rebuild, `0t` as a calendar, `0y` as a comp, `0h2` and `0m` as two
deliveries. **101 open items, 12 sections, 45 built.** Stop adding ritual
specs. Item 9 of the order is the reconciliation.

## Real, and will never be the most important work again

- **`MK2`, the masks as pixel art.** It is his original idea, so it is not mine
  to kill. But `MK12` already states the problem against itself: this product's
  look is argued from autonomic response, and pixel art is a different
  argument. Mark it as needing its argument before it is scheduled, rather than
  scheduling it on enthusiasm.
- **`AI3`. "He does not like the design. Run it again."** Not actionable as
  written. It needs the specific objection or it will be run again and
  disliked again.
- **`R6`. Every piece of art gathered for his ruling.** Standing obligation,
  "sent twice, never complete." It is a process, not a task, and it belongs in
  section 6 with the other standing rules rather than in the open column where
  it can never be closed.

## One item filed in three places, which is three items' worth of attention

- The avatar as a page: `N2`, `AO3`, and the whole `BL`/`CS2` block.
- The release rebuild: `C3` in `2f`, `C3` in section 5, and the whole `0c2`
  block.
- The Summary rebuild: `N3`, `AH1`, and `GL`.

---

# 7. DEFECTS IN THE RECORD ITSELF

This repository's own rule is that a number typed into a document the product
then grows past is the same defect as a number typed into a gate. `CLAUDE.md`
counts nine occasions. Here are the ones measurable today. I do not own these
files and have not edited them.

**The gate counts are wrong in two places and in this list.**

    stated in CLAUDE.md     843   740   100   105
    measured today         1287   758   100   112

    TASKS.md section 0t says the design gate is "105 of 105". It is 112.

**"The bar is eight" is wrong by one, in the paragraph that scolds the file for
having said otherwise.** `CLAUDE.md:117` and `atuned_src/engine/core.js:102`
both say it. `TABDEF` carries **9** entries, counted in the built `engine.js`:
Energetics, Ritual, Story, Field, Body, Compass, Knowledge, Games, Summary.

**`BL2` claims the release ceiling is surfaced nowhere.** `ui/release.js:100`
and `ui/summary.js:591` both read it.

**`AO0` claims the funnel has zero pages.** It has four.

**The list's identifiers do not identify.**

    measured    725 distinct item ids
    measured    57 of them used more than once, across 121 lines
    measured    13 section ids used twice, so 26 of 100 sections are ambiguous

The sharpest case is live right now. **`RL1` means two unrelated things.** At
line 85 it is "it names what was selected", from today's high priority release
ruling. At line 2109 it is "the ritual plan is saved and never read back, worth
72 of 1000 at day 30, the largest single item and nearly free." A seat told to
build `RL1` can build the wrong one. `VB1` means three different things and two
of its three homes are marked built while the third is open, so "VB1 is done"
is both true and false.

**Recommended, and it is cheap:** new items take a section prefix, so today's
release panel is `0c2.RL1` and the ritual plan item stays `0f.RL1`. Nothing
already written has to change.

---

# 8. THE SHAPE OF THE LIST, MEASURED

Grouped by subject rather than by the pass that wrote it. This is the same 862
lines, counted a second way.

| Subject | Open | His | Built | Sections it is specced across |
|---|---|---|---|---|
| Ritual | 101 | 26 | 45 | 12 |
| Avatar | 66 | 14 | 19 | 7 |
| Funnel and quiz | 39 | 9 | 14 | 5 |
| Onboarding | 31 | 9 | 14 | 3 |
| **Story and release** | **30** | **3** | **1** | **2** |
| Marketing and copy | 24 | 1 | 10 | 3 |
| Gamification | 24 | 11 | 13 | 2 |
| Sniffer | 21 | 17 | 11 | 4 |
| Feathers and Field | 13 | 1 | 14 | 4 |
| Knowledge | 11 | 0 | 14 | 2 |
| Compass | 7 | 0 | 15 | 3 |
| Summary | 6 | 0 | 4 | 2 |
| Everything else | 92 | 22 | 92 | 20 |

**The list is not 465 tasks. It is about twelve subjects, each specced between
two and twelve times, with no later spec retiring an earlier one.**

Two readings fall out of the table and both matter.

**His instinct was right and the arithmetic proves it.** Story and release
carry 31 items and **1 built**. Every other substantial subject sits between 40
and 68 percent built. He said the most important portion of the product has had
the least attention. That is not a feeling. It is the lowest ratio on the page
by a factor of thirteen.

**The ritual and the avatar are 167 open items, 36 percent of the open column,
and neither can be built today.** One needs a reconciliation and the other
needs a ruling. That is where the list's weight sits and it is not where the
work is.

## The part of the file nothing counts

    measured    lines 1 to 3997 carry all 862 checkboxes
    measured    lines 3998 to 5769 carry 0 checkboxes
    measured    and 61 bullets and 5 numbered items that are work

**1,772 lines, 31 percent of the file, is the record half, and it holds work in
prose that no count reaches.** "The numbers, everywhere", "Tooltips on every
number and every button", "Screen zones", "Badges, achievements and score" are
requests of his sitting in paragraphs, some of them since built under other
names and some never started, and nothing distinguishes the two.

The record must not be compressed. That is what has kept this project honest.
But the items inside it should be mirrored into the ledger as checkboxes so
they are counted, and the prose left exactly as he said it.

---

# 9. NOT DOING THIS ROUND

Named, so nothing disappears quietly.

- **The whole avatar and character sheet.** 66 items. Blocked on `D11`.
- **The `RV` release flow, the heard half.** Blocked on `RV7` and on a
  recording only he can make.
- **The ritual build.** 101 items. Item 9 reconciles it; nothing is built from
  it this round.
- **`SX1`, the addresses rename.** Blocked on one word from him, and it should
  land before the ritual and avatar surfaces, not after.
- **Anything needing a server.** About 20 items. Blocked on `Q5`.
- **The chakra band.** Blocked on `CB9`.
- **The universal law films and the nerve state icons.** Blocked on assets that
  are not in this repository.
- **Onboarding.** Stopped by his ruling, not deferred.
- **The schema items.** Deliberately held until `Q5` is answered, then done
  immediately, in the gap before the service is built. That gap is the last
  cheap moment.

---

# 10. NEEDS A RULING

Only the ones where the answer changes what gets built. The full argument for
each is in section 2.

1. **The twenty one laws and the coherence definition.** `SN5`, `SN6`, `SN7`,
   asked once. Options: adopt the spec, keep the engine and correct the spec,
   or carry both under separate names.
2. **The opening surface, and whether the avatar is a tab.** `D11`. Options:
   tenth tab and it opens there; tenth tab and the Field still opens; or it
   stays a drill folded into Summary.
3. **The audio.** `RV7`. Options: embed as base64, fetch at the sign in seam,
   or synthesise only and lose his voice from the opening.
4. **The currency.** Karma, points, or patterns. One word.
5. **The server.** `AS2`. Options: build it this round, or the app stays one
   file and about twenty items are marked impossible rather than open.
6. **The word that replaces "addresses".** `SX1`. Cheapest answer on the page,
   212 string literals waiting on it.

Three more that are small for him and are the ones a lawyer would find first:
**`PO2`** the word heals, **`D10`** the therapy equivalence claim, and
**`SF6`** the safety referral that names Psychopathy on screen and has never
fired.
