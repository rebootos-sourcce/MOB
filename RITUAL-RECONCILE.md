# The ritual, reconciled

Owned by the project manager. `PRIORITY.md` item ten, and it is reading rather
than a build. This file changes no other file. It says what the ritual is, what
was ruled, what is genuinely open, what is already built, and what should be
cut.

Read section 2 first if you read nothing else. It corrects a number of my own.

**Applied 21 September 2026. This file is now a record rather than a plan.**
Sections 5a, 5b, 5c, 9a, 9b, 9c and 9d are done in `TASKS.md`: 22 lines closed,
6 folded, 1 cut, 19 marked as not ritual work in place rather than moved, and 24
identifiers disambiguated. Section 9e is done in `DECISIONS.md`,
`MILESTONES.md`, `DESIGN-ritual.md` and `PRIORITY.md`. Section 9f is annotated
rather than deleted, because only the owner can supply what is missing. What is
not done is section 8: those five are builds and they belong to engineering, art
direction and UX, and item 1 of them is now `RT22` in the backlog. Do not apply
this file again. Read `TASKS.md`, which carries the result.

## 1. The stamp on this measurement

    commit                  41b07e4, working tree clean
    TASKS.md                7,771 lines, md5 ee42d5bd1b0567d62274c251fa3e6d54
    DESIGN-ritual.md        759 lines, md5 5ed985d23b15bc66cc380f3fd88fd193
    measured                21 September 2026, 02:23 UTC

Every count below was read off the file or off a run. Every claim a document
makes about the code was checked against `atuned_src/` before it was repeated
here, and where it did not survive that check it is named in section 6.

### The count, three ways, and the method for each

**Method A. The nine sections whose heading names the ritual.** Runnable:
`grep '^## .*RITUAL' TASKS.md`. It returns `0h2`, `0j2`, `0m`, `0q`, `0t`, `0y`,
`0d`, `0f` and `0v`, the last being the D minus pass and not the fifth pass
calendar, which carries `0v` as well. The span of each runs to the next `##`, so
its subsections are inside it. **This said "`0v` at line 5052" until 21
September**, which is a line reference in the document whose own finding is that
544 inserted lines moved every line reference in this file once already. The
grep does not move.

    open        [ ]          85
    his ruling  [?]          25
    specced     [~]           0
    built       [x]          39
                            149 lines carrying a state, 26 per cent built

**Method B. The ritual items only, with the hitch-hikers taken out.** Those
nine sections carry work that is not the ritual: `BT5`, `BT6`, `CP1` to `CP3`,
`CF1` to `CF5`, `QJ1`, `QJ2`, the whole `SW` four fields brief, `AO1`, `PO1` to
`PO3`, `HW1`, `HW2` and five unidentified currency questions. Taken out, and
`RC1` to `RC7`, `QU1` to `QU4` and `AT1` added back in from the fifth pass,
which is a ritual section whose heading does not say so:

    open        [ ]          76
    his ruling  [?]          16
    built       [x]          31
                            123 items

**Method C. Every checkbox line anywhere in the file whose own text names the
ritual, a practice, a streak, recurring or accountability.**

    open        [ ]          33
    his ruling  [?]          10
    specced     [~]           1
    built       [x]           9
                             53 lines

**The number I use below is method B: 123 items, 76 open, 16 his, 31 built.**
Method A is the honest count of the sections and it over-counts the subject.
Method C under-counts, because most ritual items do not use the word.

## 2. A correction to my own number, and it is load bearing

`PRIORITY.md` section 9 states the ritual at **114 open, 26 his, 40 built,
across 9 sections**, and section 4 uses that figure to argue the pile "got
worse: 114 open across 9 sections tonight, against 101 across 12 at the last
stamp." Item ten of the order exists on that argument.

**The 114 does not reproduce.** `PRIORITY.md` stamps commit `f87595d`, TASKS.md
md5 `b22ddf038227`. I checked out that exact file and counted it four ways.

| method, at `f87595d` | open | his | built |
|---|---|---|---|
| the nine sections whose heading names the ritual | **85** | **25** | **39** |
| the nine sections whose body mentions the ritual most | 108 | 22 | 27 |
| every line whose own text names the ritual | 33 | 10 | 9 |
| stated in `PRIORITY.md` | 114 | 26 | 40 |

No definition I could construct that yields nine sections produces 114, and the
closest, 108, shares no column with 26 or 40. `PRIORITY.md` says its method is
"by section, naming the sections" and then does not name them, so the figure
cannot be checked by anybody reading it.

**And the pile has not moved.** The nine ritual sections read 85, 25 and 39 at
`f87595d` and they read 85, 25 and 39 tonight, across two passes and 1,125
added lines. The ritual did not get worse. It did not change at all.

This is the eleventh time this repository has been bitten by a number typed into
a document, and it happened inside the document whose own section 8 is titled
"Defects in the record itself". The count was mine. Whoever owns `PRIORITY.md`
next should replace the ritual row with the nine named sections and the 85, or
delete the row.

The reason for item ten stands anyway, and it is better than the one I gave. The
ritual is not the largest pile in the project. It is the pile with the most
finished work sitting unmarked inside it.

## 3. What the ritual actually is in this product today

Measured off `atuned_src/ui/ritual.js`, 205 lines, and the shipped
`source.html`.

**One card, on one tab.** `ritFor()` at `ui/ritual.js:9` takes the heaviest
seat from `compute()`, maps it to one of four tracks through `TRACK4BAND`, picks
a tier off `r.DQ`, and calls the shortest practice in that track. The card then
renders, in order:

- The track name, alone, in `.rel-node`, which is 30px at
  `atuned_src/shell/head.html:2791`. It is the largest object on the surface and
  it says Body, or Mind, and nothing else.
- One sentence saying which seat is carrying the most and which track that
  calls for.
- Today's saved ritual, read back, with its when and its where and one control
  that marks it done.
- One practice, the one called for, with every other candidate behind a single
  control reading "Choose something else".
- The steps of whatever is selected, with the minutes.
- Two optional fields, when and where, and a sentence built from them.
- Close and Save ritual.
- `ladderHtml()` from `ui/cone.js:902`, which draws the run, the ledger and the
  marks.

`CURP.rituals` stores `t`, `track`, `band`, `steps`, `min`, `when`, `where` and
`done`. `streakRead()` at `engine/ladder.js:46` halves a broken run rather than
resetting it, with a two day grace.

**What is not on it.** No ring. No week. No heat map. No waveform. No analytics.
No icon for the kind of practice. No edit of history. No queue. No sniffer feed.
No journal snippet. The four words of the loop appear once in the whole of
`source.html`.

**What exists and is not shipped.** Six runnable prototypes in
`proto/ritual/`: `compass.html`, `board.html`, `tape.html`, `calendar.html`,
`ritual.html` and `ritual2.html`. `ritual2.html` is the current front and it
carries the five one word figures, the segmented ring whose dashes are the
count, the week grid and the three shapes model. Measured: `Streak` appears 9
times and `Missed` 11 times in `proto/ritual/ritual2.html` and **0 times in
`source.html`**. None of the rebuild is in the product.

So the sentence to hold on to is this. The ritual page he graded a D minus is
still the page that ships. Everything built since is a prototype, and the four
loop fixes that did land are the only ritual work a person can touch.

## 4. What the owner has ruled, in the order he ruled it

`TASKS.md` is newest first, so the file order is the reverse of the ruling
order. Reading it top down makes three incompatible shapes look simultaneous.
They are not. This is the sequence.

| # | pass | ruling | where |
|---|---|---|---|
| 1 | the D minus | It looks like a compass. Iconography per kind, a daily tracker, an edit control, a heat map, analytics, clean and simple | `0v` at 5052, `RB1` to `RB8` |
| 2 | the D minus | Points tied to the ritual and the tracker. Fail and lose, succeed and gain | `0v`, `RB9` to `RB11` |
| 3 | the D minus | The where and when does not belong there. The record does not belong there | `0v`, `RB13`, `RB14` |
| 4 | fifth | Design B, the board, and it has to look like a calendar | `RC1` |
| 5 | sixth | The loop is discover, play, flow, embody, and it is a circle | `FL1`, `FL2` |
| 6 | seventh | Against the calendar on aesthetic. Stats on top, the week second from Monday, three bands in his order, cards that open, a journal snippet, where to improve, and Monday to Friday reads as a pixelated audio waveform | `RU1` to `RU9` |
| 7 | seventh | A practice is part of the content chain. A snippet goes from here to the journal | `RJ2` |
| 8 | ninth | A figure takes one word. Recurring, missed, active, streak | `NW1` |
| 9 | ninth | The ring is a dotted line and the dashes are the count | `RT1` |

**The shape is not open.** Ruling 1 is the oldest of the three and rulings 4 and
6 each superseded it. Ruling 9 is the newest thing he has said about this page,
and `0h2` delivered it. `DESIGN-ritual.md` section 7 recommends Design A, the
compass, which is ruling 1, and that document is the oldest live opinion in the
pile. Nothing should be sent to him asking which shape.

**The object list is what survives from ruling 1.** He asked for iconography,
a daily tracker, an edit control, a heat map and analytics. `RT15` gives a
practice ring its seat's colour, `RT16` gives add, remove, generate and history
a home, and the week grid plus the record grid is close to a heat map without
being one. Analytics is `RJ1` and is unbuilt. So `RB2` to `RB7` of `0v` stay
open as requirements under the newest shape, and only `RB1` is superseded.

## 5. The ledger. Every open ritual item, with a verdict

### 5a. Built already and not marked. 21 items

Each one names the twin that delivered it. Fourteen were delivered in a later
pass of the same file under a different identifier. Four are in the shipped
build. Two are tools. One is not a task.

| item | verdict | the twin, or the code |
|---|---|---|
| `RT1` the dotted ring, dashes are the count | built | `RT12`, built and gated, in `proto/ritual/ritual2.html` |
| `RT3` the week's boxes fill their cell | built | `RT14`, which repeats the sentence verbatim |
| `RT4` a practice icon takes the colour of what it supports | built | `RT15` |
| `RT5` the journal goes to the upper right | built | `RT16` |
| `RT6` where to improve becomes day, week, month | built | `RT16` |
| `RT7` the three shapes card comes off the page | built | `RT16` |
| `RT8` add, remove, generate and history get a home | built | `RT16` |
| `RT10` simulate the page against the panel a thousand times | built | `tools/ritualsim.js`, `PANEL-ritual-1000.md`, and 18 validation checks passed tonight |
| `NW1` a figure takes one word | built and gated | `RT11`. The build fails if a figure label is more than one word |
| `RC2` it sorts by day, week and month | built | `CL1`, three spans one object |
| `RC3` it shows what is running and what is due | built | `CL2` and `CL3` |
| `RC4` three kinds, organised by what they are for | built | `CL6`, a closed field with three values |
| `RC5` the person chooses what they optimise for | built | `CL7`, which names `RC5` by identifier |
| `RC6` colour | built | `CL4`, one colour axis, kind to seat |
| `RL1` the plan is saved and never read back | **built in the shipped app** | `ui/ritual.js`, `ritToday()` and `ritSteps()`, the `rit-saved` block, three matches in `source.html` |
| `RL2` the record is locked inside the Compass | **built in the shipped app** | `ui/ritual.js` calls `ladderHtml()` into `rit-rec`, two matches in `source.html` |
| `RL3` a broken run resets instead of halving | **built in the shipped app** | `engine/ladder.js:71`, `Math.max(1,Math.ceil(run/2))`, grace at `gap<=2` |
| `RL4` nineteen choices on the ritual card | **built in the shipped app** | `rit-list one` shows the called practice only, and `ritFor` now takes the lightest in the track |
| `AP2` simulate the ritual builder a thousand times | built | `tools/ritualsim.js`, whose header cites `AP2` as its brief. Twin of `RT10` |
| `AP3` benchmark the top two ritual builders, named and measured | built | `DESIGN-ritual.md` section 2. Five comps, not two. Sourced through a search index because egress is blocked, and the document says so |
| `AT1` he passed it, number two is okay | not a task | It records a pass. Its own text says everything else in its section is the calendar above |

**Marking these closes 21 of 76 open items and costs nothing.** Nobody can read
a backlog where a spec sits three hundred lines below its own delivery.

### 5b. Duplicate by identifier. 15 lines, and this is the worst of it

Three identifier ranges each mean two unrelated things, live, in one file.

| range | one meaning | the other meaning | lines |
|---|---|---|---|
| `RB1` to `RB8` | the loss simulation and the record grid, `0y` at 3469 | what the ritual builder has to be, `0v` at 5065 | 8 |
| `RB9` to `RB11` | what a behaviour ritual is, three shapes, `0q` at 2747 | the gamification wired his way, `0v` at 5079 | 3 |
| `RL1` to `RL4` | the four cheap loop fixes, `0f` at 3776 | the release panel before it begins, `0c2` at 1336 | 4 |

`RB1` is both "how much comes off on a missed day" and "it looks like a
compass". `RL1` is both "the ritual plan is saved and never read back" and "the
release panel names what was selected". Any instruction that says build `RB1`
is ambiguous, and `PRIORITY.md` section 8 already flagged the `RL1` half of it.

**Applied 21 September, and the fix is a suffix and not a prefix.** The
recommendation below was `0y.RB1`, and it is wrong: `tools/questions.js` reads
an identifier as letters, then digits, then one optional letter, so `RB1y`
parses and `0y.RB1` does not, and the owner's own questions document is
generated by that reader. The letter also follows a convention `TASKS.md`
already set at `SW1b` and `SW1c`. What shipped is `RB1y` and `RB1v`, `RB9q` and
`RB9v`, `RL1c` and `RL1f`, and the same for `CP1` and `AP1`, which this section
missed and section 9c caught. `AP4`, `SW6` and `SW7` were found in the same
sweep and are in it too. Twenty four identifiers, and `TASKS.md` explains the
convention under How a line moves.

**And there are 46 more, none of them in the nine ritual sections.** Measured
at the applying commit off `TASKS.md`, including the items whose identifier is
not bold, which the first sweep missed. Section, line and state for each:

    AK1  08g:118[ ]   0c:5761[ ]
    AK2  08g:122[ ]   0c:5763[ ]
    FN1  08f:186[x]   0x:3619[ ]
    FN2  08f:192[x]   0x:3629[ ]
    FN3  08f:199[x]   0x:3632[?]
    FN4  08f:202[x]   0r:3078[ ]
    FN5  08f:206[x]   0r:3082[ ]
    FN6  08f:210[x]   0r:3085[ ]
    FN7  08f:215[x]   0r:3090[ ]
    FN8  08f:220[x]   0r:3092[ ]
    LK1  08f:390[x]   0f2:1819[ ]
    BC1  08e:891[x]   0i2:2066[ ]
    AVS1  08b:1130[x]   0h:4308[ ]
    AV5  0k3:2302[x]   0g:4203[ ]
    VB1  0l:2423[x]   0u:3321[ ]   0o:4706[x]
    VB2  0l:2428[x]   0u:3326[ ]   0o:4710[x]
    VB3  0l:2431[x]   0u:3330[ ]   0o:4714[x]
    VB4  0l:2433[x]   0o:4718[ ]
    KB1  0p:2667[x]   0w:5438[ ]
    KB2  0p:2671[x]   0w:5441[ ]
    KB3  0p:2675[x]   0w:5442[ ]
    KB4  0p:2678[x]   0w:5446[ ]
    KB5  0p:2681[x]   0w:5448[ ]
    AV1  0o:2737[ ]   0g:4193[ ]
    AV2  0o:2742[ ]   0g:4195[ ]
    AV3  0o:2744[ ]   0g:4197[ ]
    AV4  0o:2746[ ]   0g:4200[ ]
    SN1  0u:3334[x]   0j:4409[ ]
    SN2  0u:3341[x]   0j:4411[ ]
    SN3  0u:3349[x]   0j:4415[ ]
    SN4  0u:3352[x]   0j:4419[ ]
    AH1  0c:5644[ ]   2:6200[~]
    AH2  0c:5648[x]   2:6209[x]
    AH5  0c:5687[?]   2:6216[x]
    AH6  0c:5696[?]   2:6220[x]
    AH3  0c:5712[ ]   2:6213[x]
    AH4  0c:5715[ ]   2:6215[ ]
    AI1  0c:5721[ ]   2:6228[x]
    AI2  0c:5722[ ]   2:6229[x]
    AI3  0c:5723[ ]   2:6234[ ]
    AM2  0c:5819[~]   0c:5848[ ]
    AE1  0b:5956[ ]   1:6057[x]
    C1  2:6255[ ]   5:6455[~]
    C2  2:6256[ ]   5:6456[~]
    C3  2:6257[ ]   5:6457[~]
    C4  2:6259[ ]   5:6458[~]

That list is not this pass's work and is recorded so the next seat does not
have to find it again. Read it off a run rather than off this block: the
measurement is every line matching `- [state] **ID.` or `- [state] ID.`,
grouped by identifier, keeping the ones that appear more than once.

**The fix is the one already recommended: a section prefix.** `0y.RB1`,
`0v.RB1`, `0q.RB9`, `0v.RB9`, `0f.RL1`, `0c2.RL1`. Nothing already written has
to change except the prefix.

### 5c. Duplicate by content. 10 open items twin another open item

| item | twin | which survives |
|---|---|---|
| `RQ3` always on red, or does it move to Heart | `CL12` | `CL12`. It carries the drawing and says "same ruling as RQ3" in its own text |
| `RQ5` can a release be scheduled onto a weekday | `CL14` | `CL14`. It names the default taken and the shot to look at |
| `RQ4` does an untested stance day count as kept | `RS2`, which is built | Neither. `RS2` shipped the third state. `RQ4` is asking him to rule on something already built one way |
| `SA2` does the sniffer add by itself or propose and wait | `QU2` | `QU2`. The two carry the same sentence word for word |
| `AP2` simulate a thousand times | `RT10` | `RT10`, and both are built |
| `RT2` the tracker is a feature, so it gets the room | `0v.RB7`, the tracker is a surface of its own | `0v.RB7`. It is the stronger form of the same ask |
| `RD4` the week reads mostly empty at 1600 | `CL9`, `CL10` | `CL10`. One finding at three spans: the wall of absence |
| `CL9` the month grid is mostly empty | `RD4`, `CL10` | `CL10` |
| `0y.RB8` one ritual a day, or a stack | `RU3`, `RU4`, and question 2 of `DESIGN-ritual.md` | `0y.RB8`. It is the one with the four dependent rulings named |
| `QU1` a person adds from the queue | `RC7`, his own question | Both. `RC7` is the question and `QU1` is our proposed answer. They must travel together |

### 5d. The whole `RU` block is the spec that `0h2` delivered

`RU1` to `RU9` are his seventh pass layout. `0m` opens with "Built to his
layout: stats on top, the week second starting Monday, the three bands in his
order, cards that open, the journal snippet, and where to improve." That is
`RU1` to `RU6` in one sentence. `RT14` built `RU8`. `RU7`, the waveform, is
drawn and `RD4` and `CL10` are its two open defects. `RU9`, no wasted space, is
his test for the page rather than an item.

**Nine open items, eight of them delivered in the prototype, and none of them
in `source.html`.** They should not be marked built, because the build does not
carry them. They should be folded into one item: port `proto/ritual/ritual2.html`
into `atuned_src/`. That is section 8 item 5.

### 5e. A proposal nobody ruled. 12 items

These are ours, not his. They are real and they are not rulings, and a plan
should say which is which.

`0y.RB3` who pays, the deduction lands on the 465 who cannot run a release.
`0y.RB7` the record becomes the other half of the surface.
`RJ5` feedback on success and failure, with the protocols named.
`QU4` ordered, not listed.
`NW2` the one word rule goes in the voice skill as a checkable rule.
`RL5` the tier inversion.
`RL6` the card titled with the address cleared.
`RL7` the stake sentence.
`RL8` the season, seven days with an end.
`RL9` karma earned and spent, blocked on the currency word.
`RL10` push, behind the server.
`CL11` the panel's stale practice and minutes columns, and `build-data.js`
citing a section `A1` that does not exist in that file.

Of these, `RL5` should be re-measured before it is built. Its stated
consequence, six choices for the loaded person against nineteen for the calm
one, is gone: the card shows one practice for everybody now. The tier mapping
at `ui/ritual.js:11` is unchanged, so if it is still backwards it is backwards
about something else.

### 5f. His ruling, not built, and not blocked by anything

`RU7` the waveform, `RB2` to `RB7` of `0v`, `RJ1` to `RJ4`, `SA1`, `QU1` to
`QU3`, `FL1` and `FL2`, `RT18` and `RT19`. Nineteen items, counted off the list and not
estimated. All of them wait on the port in section 8 item 5, because there is no
surface in the build to put them on.

## 6. Where a document says something about the code that is no longer true

Every one of these was checked tonight against `atuned_src/`, not against
another document.

**`DECISIONS.md:195`. "The ritual builder as a real builder. The overlay logs a
practice and nothing reads the log back."** False. `ritToday()` and `ritSteps()`
read it back and render today's ritual with its when, its where and a control
that marks it done. It is listed under "Tools not yet in the app".

**`DECISIONS.md:196`. "The accountability tracker", under tools not in the
app.** Half false. `ladderHtml()` at `ui/cone.js:902` draws the run, the ledger
and the marks, and since `RL2` landed it renders on the Ritual surface. What is
missing is the surface he asked for, not the arithmetic.

**`MILESTONES.md:161`. "`ritual.js` writes a completed ritual into
`CURP.rituals`, and grep finds no other" reader.** The same stale claim as
`DECISIONS.md:195`.

**`DESIGN-ritual.md` section 7. "Design A, the compass. Build that one."**
Superseded twice by his own later rulings, at the fifth pass and the seventh.
The document is the oldest live recommendation about this page and it reads as
current.

**`DESIGN-ritual.md` section 1.4. Centre stage, 11 simultaneous choices.**
Stale. The card shows one practice and one control to see the rest. The 94 for
the whole screen stands, and it is dominated by the 52 control left rail, which
is `PRIORITY.md` item 9 and not this page's to fix.

**`DESIGN-ritual.md` section 1.5. The record prints a bare zero above "days ,
last run" with a space before the comma.** Half fixed. The comma is fixed and
`ui/cone.js:909` carries the comment saying so. The headline zero stands, and it
now has "Nothing on the record yet" under it.

**`DESIGN-ritual.md` section 1.1. The largest object is a word with no
referent.** Still true. `.rel-node` is 30px and `ui/ritual.js:62` writes the
bare track name into it.

**`0y.RB6`. `.pm-eye` carries `text-transform:capitalize`.** Still true.
`shell/head.html:971` sets it, `ui/ritual.js` writes `<div class="pm-eye">Build
a ritual</div>` with no `plain`, so the shipped build reads Build A Ritual.

**`tools/ritualsim.js:162`. The `current` configuration is
`{ifthen:0, monitor:0, season:0, coin:'none', halving:0, push:0, oneChoice:0}`.**
Four of those now ship. `ifthen` is `RL1`, `monitor` is `RL2`, `halving` is
`RL3` and `oneChoice` is `RL4`. The harness that priced the four fixes still
models the product as though none of them landed, and `tools/ritualsim.js:114`
still counts `c.all.length+2` choices on a card that shows one. So
`PANEL-ritual-1000.md`'s "as built, 59 of 1000 at day 30" is a measurement of a
product that no longer exists, and the 167 the four fixes were supposed to buy
has never been measured.

**`docs/RITUAL-ACCOUNTABILITY-source.md`.** Ten lines. It says "Read Part Five
first. Five contradictions are named there as blocking and unruled, and
anything built before they are settled is built twice." There is no Part Five.
The owner's consolidated history was never pasted into the file. Either it is
recovered from him or the file is deleted, because as it stands it tells a
reader that five blocking contradictions exist and then does not name one.

## 7. The daily assumption, and it is real

The brief asked whether the ritual backlog is built on an assumption of daily
practice. It is, and the assumption is in the shipped code and not only in the
documents.

**Measured in `atuned_src/engine/ladder.js`.** The marks `week`, `month` and
`season` at lines 128 to 139 each test `s.best>=N`. `best` is computed at
line 72 as `if(days[j]===days[j-1]-1){cur++}`, which is strictly consecutive
calendar days. A person practising twice a week has `best` of 1 for ever, at any
length of record.

**Measured in `DESIGN-ladder.md` section 4b, off the probe, Diane at ninety
days with the same fortnight off in all three cases.**

| cadence | days practised | the run | longest row | seven days | thirty days |
|---|---|---|---|---|---|
| daily | 76 | 53 | 44 | earned | earned |
| twice a week | 22 | 1 | 1 | **no** | **no** |
| weekly | 11 | 1 | 1 | **no** | **no** |

`season` needs ninety in a row, so a twice a week person earns none of the
three. That is the ladder pass finding and it reproduces against the code.

**And the badge is stricter than the mechanic beside it.** `streakRead` halves a
broken run with a two day grace, on Lally 2010, and cites it in the file. The
three marks read a quantity that grace never touches.

**Where else the assumption sits.**

- `RU3`. "Always on is always the top three. Three defaults, fixed position,
  every day."
- `RQ1`. Behaviour rituals default to Monday to Friday, which is what is built.
- `RQ2`. Asks whether all three always on slots must be daily practices.
- `RT11`. The five figures are Active, Recurring, Streak, Kept and Missed. Four
  of the five are daily words and Missed only means anything against an expected
  day.
- `RT21`. His own question, and it is the same one: a daily target, or a session
  target.
- `ritToday()` keys the saved ritual to the calendar day, so a ritual saved
  yesterday is not today's.
- The ninety day ceiling case in `sim/runs.json` runs ninety **consecutive**
  days.

**The contradiction underneath it.** `DESIGN-gamification.md` costs its whole
retention case on twice a week, per `DESIGN-ladder.md` section 4b. So the
shipped ladder is hostile to the cadence the business case is priced on. That is
not a preference, it is two parts of the product disagreeing about who the
product is for, and it is `LD3`.

## 8. The first five buildable pieces

Sized against this codebase, honestly rather than encouragingly. None of the
five is blocked, and the fifth is blocked only in the sense that it is large.

| # | What | Who | Size | Depends on | Moves grade |
|---|---|---|---|---|---|
| 1 | Re-measure the loop with the four fixes on. `tools/ritualsim.js:162` sets `ifthen`, `monitor`, `halving` and `oneChoice` to 0 and all four ship. Flip them, re-port `ritFor` and the choice count at `:114`, re-run, and write the measured day 30 number onto `RL1` to `RL4` | engineering | small | nothing | no, and it is the only honest number anybody has about this page |
| 2 | Close the 21 items in 5a, each pointing at the twin that delivered it, and apply the section prefix to the 15 colliding lines in 5b | project manager, whoever owns `TASKS.md` | small | nothing | no, and it takes the ritual from 76 open to 55 |
| 3 | The three practice marks count days practised, not consecutive days. `engine/ladder.js:128` to `:139`, with rows in `tests/engine.js` for daily, twice a week and weekly | engineering | small | nothing | yes. It is `LD3` and it is the whole non daily half of the roster |
| 4 | The bare track name comes off the card. Put the practice in the 30px slot at `ui/ritual.js:62` and the track in the sentence under it, and add `plain` to the `pm-eye` so it stops reading Build A Ritual | UX, art direction, engineering | small | nothing | yes. `RB12` and `0y.RB6` are his own two complaints and both are still true |
| 5 | Port `proto/ritual/ritual2.html` into `atuned_src/`. It carries `RT11` to `RT20` built and gated and none of it is in `source.html` | engineering, art direction | large | items 3 and 4 do not block it, but every other ritual item does wait on it | yes. It is the only thing that moves a D minus |

**Why item 1 is first.** It costs an hour and it is the only item on the page
that tells anybody whether the work already done was worth what it was priced
at. Four fixes were built on a measurement of 59 of 1000 at day 30 rising to
167. Nobody has re-run the measurement. Until somebody does, every retention
argument about this page is quoting a number from a product that has changed.

**Why item 5 is large and not medium.** The prototype is standalone, with its
own stylesheet, its own data builder and its own shell. The port is a MANIFEST
entry, a renderer, the ring geometry, the week grid, the five figures, the three
shapes model, a `TABDEF` surface that already exists, plus rows in
`tests/design.js` and `tests/collide.js` and a `tools/monitor.js` surface that
has to come back non empty. It is not a copy.

**Sixth, if a seat is free.** `FL1` and `FL2`, the loop drawn as a circle. `LD2`
records that all four quarters already carry a timestamp, so the turn costs no
schema change, and "embody" appears once in the whole of `source.html`. It is
his ruling and nothing on any surface honours it.

## 9. What should be deleted

A backlog of 114 items nobody can act on is worse than 30 somebody can, and
deciding that is mine rather than his. These are recommendations by identifier
for whoever owns `TASKS.md` next. Nothing here needs a ruling.

### 9a. Delete the line. 21 items

The wording is preserved in section 5a of this file, with the twin that
delivered it, so nothing is lost.

    RT1  RT3  RT4  RT5  RT6  RT7  RT8  RT10    delivered as RT11 to RT20, one
                                               section above them in the same
                                               file
    NW1                                        delivered and gated as RT11
    RC2  RC3  RC4  RC5  RC6                    delivered as CL1 to CL8, and CL7
                                               names RC5 by identifier
    RL1  RL2  RL3  RL4                         built in the shipped app, see 5a
    AP1                                        "specced, not built" is false.
                                               DESIGN-gamification.md is 67
                                               kilobytes and 0k records it
                                               delivered. The build half is
                                               0v.RB9 to 0v.RB11 already
    AP2                                        twin of RT10, both built
    AP3                                        built as DESIGN-ritual.md
                                               section 2
    AT1                                        not a task. It records a pass

### 9b. Fold into one, keep the named survivor. 6 items

    RQ3   -> CL12      CL12 says so in its own text
    RQ5   -> CL14      same question, CL14 carries the default taken
    SA2   -> QU2       the same sentence twice
    RT2   -> 0v.RB7    the tracker as a surface is the stronger form
    RD4   -> CL10      one finding at three spans
    CL9   -> CL10      same

### 9c. Move out of the ritual sections. 19 items

**This changes no count in section 1 method B, which already excludes them. It
changes every count anybody takes by section, which is how the ritual gets
measured.** None of these is the ritual. `CP1` to `CP3` also collide with `CP1`
to `CP3` the child pattern, live, in the same file.

    CP1 CP2 CP3            the whole product copy sweep
    CF1 CF2 CF3 CF4 CF5    the frequencies
    QJ1 QJ2                the quiz and the archetypes
    PO1 PO2 PO3            the positioning line
    HW1 HW2                the how it works page
    AO1                    the wordmark gap
    TG1 TG2 TG3            the tag system

### 9d. Re-measure before building, or cut. 1 item

    RL5   its stated consequence is gone. The card shows one practice for
          everybody. The tier mapping at ui/ritual.js:11 is unchanged, so if it
          is still backwards it is backwards about something else, and this
          repository's rule is reproduce before fixing

### 9e. Fix the record, in files I do not own. 6 lines

    DECISIONS.md:195           the plan is read back now. RL1 shipped
    DECISIONS.md:196           ladderHtml exists and renders on Ritual
    MILESTONES.md:161          the same stale claim as DECISIONS.md:195
    DESIGN-ritual.md sec 7     recommends the compass, superseded twice by him
    DESIGN-ritual.md sec 1.4   the centre stage figure predates the one
                               practice card
    PRIORITY.md sec 9          the ritual row reads 114 and the file reads 85

### 9f. Recover it from him, or delete the file

    docs/RITUAL-ACCOUNTABILITY-source.md

Ten lines, and it says to read a Part Five that is not in it. It is either the
owner's consolidated history of this surface, which would be the most valuable
document in the pile, or it is an empty wrapper telling readers five blocking
contradictions exist without naming one. It cannot stay as it is.

### The net

Counted against method B, 76 open and 16 his.

    open  76   -21 deleted as built in 9a
               -4  folded in 9b, being SA2, RT2, RD4 and CL9
               -1  RL5, if it is cut rather than re-measured
          50

    his   16   -2  folded in 9b, being RQ3 into CL12 and RQ5 into CL14
          14

    92 items become 64. Of the 14 left in his column, 4 are the rulings in
    section 11 and the rest are already in the five that go to him.

And 15 lines stop carrying an identifier that means two things.

## 10. Not doing this round

- **The whole rebuild.** The port is item 5 and it is large. Nothing else on the
  page can be sized until it lands, because there is no surface in the build to
  put anything on.
- **The gamification wiring, `0v.RB9` to `0v.RB11`.** Blocked on the currency
  word, which is already one of the five rulings in `PRIORITY.md` section 2.
- **The sting, `0y.RB1`.** His, and it is the one number the mechanic turns on.
- **`RL9` karma, `RL10` push.** One behind the currency word, one behind the
  server.
- **The queue, `QU1` to `QU4` and `SA1`.** Ruled and unbuilt, and it needs a
  surface first.
- **`TG1` to `TG3` the tag system.** Moved out of the ritual, and the answer
  there is probably no.
- **`CL11`.** A defect in a prototype's own data file. It should not compete
  with the shipped app.

## 11. Needs a ruling

Only where the answer changes what gets built, and the shape is not one of them.
Section 4 settles that.

**1. The three reversals, asked once.** `0v.RB13` says the where and when does
not belong on this page and `0v.RB14` says the record does not. Both are now
built in the shipped app, and both were measured: the if then plan at 72 of 1000
at day 30 on Gollwitzer and Sheeran, 94 studies at d 0.65, and the record at 40
of 1000 on Harkin, 138 studies at d 0.40.

  - What it is. Two mechanics he has struck, both of which are on the page he
    graded, both of which carry the two largest retention numbers in the loop.
  - At stake. 112 of 1000 at day 30, and whether the reversal is of the mechanic
    or of its placement.
  - The team's recommendation, which he can take as it stands. Keep both
    mechanics and move both off the builder. The plan becomes one line on the
    confirmation after a ritual is saved, read back on the daily tracker, which
    is where Gollwitzer and Sheeran put the effect anyway. The record stops
    being a card under the builder and becomes the other half of the surface,
    which is his own `0v.RB7`.
  - Look at. `ui/ritual.js`, the `rit-plan` and `rit-rec` blocks.
    `DESIGN-ritual.md` sections 6.1 and 6.2.

**2. Is the ladder a daily ladder.** `LD3`, and section 7 is the whole
argument.

  - What it is. `week`, `month` and `season` test the longest strictly
    consecutive run. A person practising twice a week for ninety days earns none
    of the three.
  - At stake. Twice a week is the cadence `DESIGN-gamification.md` costs its
    retention case on, so the ladder is hostile to the person the business case
    is written for.
  - Either way. Count days practised, and the three marks reach every cadence
    and "seven days in a row" has to stop being the copy. Keep consecutive, and
    the product says out loud that it is for daily people.
  - Look at. `engine/ladder.js:128` to `:139`, and `DESIGN-ladder.md`
    section 4b.

**3. One ritual a day, or a stack.** `0y.RB8`, and it is the one question with
four rulings hanging off it: the sting, whether the dial is the seven seats or
the twenty one laws, whether the record is half this surface or its own tab, and
whether the sniffer adds to tomorrow or proposes and waits. Send it once, with
those four named under it.

**4. What sets the target the ring counts against.** `RT21`, with `0q.RB11`
folded into it. The ring cannot be drawn at all without it, and `RT18` measures
the cost of not having it: 50 of the 52 rows the generator produces carry a
target of one, so the ring is a single dash for almost everybody.

**Already in the five that go to him, and not repeated here.** The currency
word, which blocks `RL9` and the whole badge ladder. `CL13`, which source owns
the always on ritual. `CL12`, the always on colour, with `RQ3` folded in.

**And one that is his and costs nothing.** `RQ4`. A stance day that nothing
tests is recorded as neither kept nor missed, which is built, and it means a
stance can never lower a rate. If `0v.RB9` ships, that a person loses points on
a failure, then the cheapest practice on the board is the one that cannot be
failed. He should see those two sentences beside each other.
