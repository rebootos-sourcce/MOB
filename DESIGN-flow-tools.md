# DESIGN-flow-tools

The rules for Flow, which is one page of three columns: inputting new on the
left, the ritual in the centre, the accountability tracker on the right. This
file is the extension of `ATUNED-practice-ritual-accountability-trace-graph-TDD.md`
(section 45 there points here), and it is written so that every rule has a
gate, and every gate is named.

The gate is `tests/flowtools.js`. It runs alone with `node tests/flowtools.js`
and it is called from `tests/functional.js`, so a full run holds it through the
same code. Rule 15 fails the run if this list and that file disagree.

## 1. What was ruled, and it has been ruled three times

His words, round QF, 2 October, verbatim and not paraphrased:

> "And if you'll notice, we're re-merging the knowledge base and the
> accountability tracker. Left menu will be for inputting new. Right side of
> the menu is for the accountability tracker. Center piece is for the ritual."

Read as four things, and the reading is stated so it can be corrected:

1. Flow is one page again, not two. Accountability stops being a tool set with
   a door of its own and becomes a column of the Ritual page.
2. The left column comes back, with a job: inputting new. That is the builder,
   closed to one press and seven tags until it is wanted.
3. The centre is the ritual and nothing else: the chain from story to work,
   and the Active list.
4. The right column is the accountability tracker: what is due, what was done,
   what was missed, and the record.

**This reverses round PO on both counts, and the churn is the record.** Round
JQ, 27 September: "attach the accountability tracker to it", so it was built
inside the Ritual page. Round PO, 2 October: "get rid of the left and right
menu. Actually, sorry. Move the new ritual to the right menu. And you're
supposed to move accountability to its own tool set", so the left column went,
the builder went right, and Accountability got a door. Round QF, the same day,
is the shape above. Nothing about the previous rounds was wrong when it was
built, and the integers did not move through any of it.

**What the one sentence in it does not settle, and it is named rather than
guessed.** "Re-merging the knowledge base and the accountability tracker" names
two things, and only one of them has a column in the three he then listed. The
accountability tracker is merged, in full. The Knowledge tab, integer 6 in
Embody, is left where it is: what it holds is the universal laws, the seats,
the cards, the gates, the archetypes, the domains, the masks, moral integrity,
the saboteurs, the child emotions and the fetters, and none of those is a
ritual, an input or a record of days. Dissolving a reference surface into this
page on one clause would cost more to undo than to leave. It is the one open
question in the round and it is written down open.

## 2. Where the repo already said something, and which way it was followed

| Where | What it said | What was done |
|---|---|---|
| `engine/core.js`, the note at `TAB.RITUAL` | "the accountability tracker built inside it rather than beside it" | True again, by his own word of round QF. Both earlier notes are kept beside the new one. |
| `DESIGN-flow-tools.md` at round PO | "Flow has no left column" | Superseded. The left column has a job now, which is the thing it did not have then. |
| `CLAUDE.md`, never renumber TAB | Integers are identity | Followed. Accountability is still 14. It lost its door and kept its integer, through `TABFOLD`. |
| `CLAUDE.md`, a tab host that carries a folded surface cannot also be one | Fold deletes the child | Followed, and it is the reason the tracker is drawn into the right rail and not into a host inside `#rit`. The rails are siblings of the stage, so the stage's own paint cannot reach them. |
| `CLAUDE.md`, Analytics and Games | A folded surface keeps its integer and its renderer and loses its door | Followed exactly. `acctRender` kept its body and became `acctSideHtml`; nothing about what it reads changed. |
| `ui/ui.js`, "the field left panel starts closed" | The left column starts shut | Followed where it was ruled, which is the Field. Flow's left column has its own store key and defaults open, because a menu that arrives shut is a control hidden with no affordance. |
| round PE, "all information is on the right hand side" | The right rail is where detail lives | Followed. The tracker is detail about the ritual and it is on the right. |

## 3. The three columns

| | Inputting new (`#flownew`) | The ritual (`#rit`) | The tracker (`#flowrail`) |
|---|---|---|---|
| Question it answers | What shall I start? | What am I doing, and is it working? | Did I do it? |
| Holds | New ritual closed to one press and seven tags, and Suggested; open, the builder | Six cards, round QN: Ritual to avatar, Ongoing goal, Active today, Did it work, Keep or delete, Practice analytics (the chain is inside it) | Due today, the Thirty day loop, Done, Missed, History, the Record |
| Reads | `PRACTICE`, `ritFor`, the Avatar page's queue `avRituals`, the bank's `relQueueOf` | plans, the record, `avCycles`, `avRows`, `ritBecoming`, `ladderRead.next`, the snapshot history, `compute().loaded` | plans, the record, the ladder |
| Writes | start, edit, move, stop, delete a ritual; start a suggested one; the timer | mark a day done; the timer; a release schedule; keep a week more; delete and put back | mark a day done or take it off; delete an entry and put it back; back in rotation |
| Files | `ui/ritual.js`, `ui/ritstage.js` | `ui/ritual.js`, `ui/ritstage.js` | `ui/accountability.js`, written by `ritRender` |

All three are painted by `ritRender` on every paint, because a column written
only on some paths is a column that goes stale.

## 4. The rules

Each rule is a sentence a gate can fail. The `Gate:` line names the check by
the prefix it opens its message with.

### FT1. Flow is one page with one door, and Accountability keeps its integer.

`TABDEF` carries `TAB.RITUAL` alone with `sec:'flow'`, and the markup carries
one button in the Flow group. `TAB.ACCOUNT` is still 14, no integer is shared,
and `TABFOLD` maps it onto `TAB.RITUAL`, so `TABREAL` answers Ritual and
`SECOF` still answers flow. A tab stored by anybody who used Accountability
while it had a door still resolves to the surface that carries it. Any code
that needs a tab's entry reads it by `.k`, never by position.

Gate: `tests/flowtools.js`, messages beginning `FT1:`. Also `tests/engine.js` and
`tests/functional.js`, which hold the whole TAB table to its values.

### FT2. All three columns are drawn, each holds the thing it is for, and they never overlap.

At 1600 the three sit side by side in the order input, ritual, tracker. At 390
they stack, and the order is the ritual, then the tracker, then inputting new.
No rail section (`.lsec`) is visible on either side.

Gate: `tests/flowtools.js`, `FT2:`.

### FT3. Each rail holds exactly one panel on Flow, and both go away off Flow.

The one visible child of the left panel, apart from its fold control, is
`#flownew`; of the right panel, `#flowrail`. Root Energetics, Awareness, Child
emotions, the Matrix, the Energetic Summary, the Reading, Selection, Running,
Moral integrity and Run a release are not drawn here. Off Flow both menus are
shut and empty and both rails have their sections back. The child selector
hides the rest, so a section added to either rail later does not turn up here.

Gate: `tests/flowtools.js`, `FT3:`.

### FT4. Inputting new is the left column, and only there.

Closed, it is one press and the seven tags. Pressing it opens the builder in
the same place: tags, steps, timer, how often, days, when, where, how long,
Start. No builder control, tag, field or Start is on the stage or in the right
column. The Active list stays on the stage. While the builder is holding
something the body carries `ritbuild`, which is what brings the column to the
front on a phone.

Gate: `tests/flowtools.js`, `FT4:`.

### FT5. The Ritual stage holds no tracker.

Due today, the streak and its figures, the earned marks, Missed and the Record
month are the right column's and none of them is drawn on the stage. Round QN
put reads on the stage (the six cards of FT17), and none of them is a tracker
part under another name: the avatar's cycles, the next mark, before and after,
and kept days by seat are reads of what the practice did. The one press the
stage shares with the tracker is still the ring on an Active row that marks
today done. Round QX put his "success win ... over a period of a year" in the
centre, as Success over time, and a week and a month of goals in the Goals
card: both carry figures and a key of their own, and both are reads over a
span he picks, not the tracker's parts, so this rule does not count them and
FT30 and FT32 hold them. Due today, the streak, the earned marks shelf,
Missed and the Record month are still the right column's alone.

Gate: `tests/flowtools.js`, `FT5:`.

### FT6. The tracker is the right column, in one order, with no door and no host of its own.

`setTab(TAB.ACCOUNT)` lands on the Ritual page, the Flow group has no button
for 14, and there is no `#acct` in the document. The right column holds Due
today, the Thirty day loop, Done, Missed, History and the Record, in that order, on a
blank profile and a loaded one.

Gate: `tests/flowtools.js`, `FT6:`; `tools/monitor.js`, which walks every
surface `TABDEF` names at both widths and exits non zero on an empty one;
`tests/design.js`, whose tap floor sweep walks every `TABDEF` tab.

### FT7. The tracker reads three things and invents nothing.

It reads the plans, the record (`CURP.rituals`) and the ladder (`ladderRead`).
A number printed is a count of days or minutes taken off those. Missed days are
counted over the last 14 days (`ACCT_SPAN`) for a ritual that is still active,
on the days it was due, with no entry marked done, and the count is the same
one the month draws as dashed rings. A ritual kept on one weekday is not missed
on the others. Most missed is first. Edit is offered at `PR_MISS_AT` misses or
more, the engine's own constant, and below that a miss is only counted. The
streak is the ladder's, so this column cannot disagree with the Summary. No
score and no rate anywhere on the page. A percent appears in one place only,
round QS, 3 October, on his words "a UI element that's tied to the system to
show the percent complete": the pill of a percent complete badge (FT25), and
nowhere in running text, where the only word for it is "percent complete". The gate works the expected
counts out from the days and the entries and does not ask the page's own
function.

Gate: `tests/flowtools.js`, `FT7:`.

### FT8. Empty states say what is empty and offer the one press, never a second builder.

Nothing active: Due today says "Nothing active yet" and offers New ritual,
which opens the builder in the left column and goes nowhere, because there is
nowhere to go. Missed says "Nothing to miss yet". The streak reads a real 0 as
the house dash. The tracker carries no Start and no field of its own, and it
names no column by its side, because on a phone the columns stack and neither
of them is on a side.

Gate: `tests/flowtools.js`, `FT8:`.

### FT9. Every write goes through the one writer, and says how it went.

Marking a day done, taking it off, deleting an entry and putting it back are
`ritWrite`. Success says Done or Taken off through `status()`. A save that fails
says "Could not save that. Nothing changed.", keeps nothing, and leaves the ring
open. A worked example is refused by name, and the page says once, in the
centre, that nothing there is saved. Edit on a missed ritual opens that ritual
in the left column and never leaves the page.

Gate: `tests/flowtools.js`, `FT9:`.

### FT10. Add to my ritual on the Compass teacher panel still lands, and the ritual shows in two columns at once.

The button writes the plan through `ritStartPlan`, says Added, and the ritual
is on the centre's Active list (as "Toward" the teacher) and on the tracker's
Due today, on one screen.

Gate: `tests/flowtools.js`, `FT10:`; `tests/functional.js`, the group named "a
teacher on the compass opens the behaviour complex and adds a starter ritual".

### FT11. A caller off Flow goes to Flow, and a ritual write off Flow paints nothing.

The release, the avatar's queue, the Summary and the Compass reach the ritual
through `ritOpen`. The builder lives in a column that exists on Flow only, so
`ritOpen` off the tab goes to the tab with the log or the queue already in the
builder. A ritual write while the Compass is showing does not draw a ritual
over it, in any of the three columns.

Gate: `tests/flowtools.js`, `FT11:`.

### FT12. Both widths hold: inside the screen, no sideways scroll, the builder's week fits.

At 1600 and at 390 every column is inside the viewport, the page does not
scroll sideways, and the builder's seven day row, seven presses of the 44 pixel
floor, sits inside the left column. Both side columns are 400 wide for that
reason: the week on the left and the month's seven days on the right are the
same floor, and 360 was tried first and cut the seventh day off, which a shot
caught and a number in a stylesheet would not have.

Gate: `tests/flowtools.js`, `FT12:`; `tests/design.js` gate 8, the tap floor.

### FT13. Both folds are the person's and still work.

Shutting either column on Flow shuts its menu to the one control that opens it
again, and opening it brings the menu back. Nothing forces either open: it is
their arrangement of the screen. The left column's default on Flow is open,
under its own store key, because his ruling that it starts shut names the
Field, where the column is a rail of readings, and here it is the menu the page
is for.

Gate: `tests/flowtools.js`, `FT13:`.

### FT14. Every heading says what it means, in the same place.

Each of the three columns names its job and says in a sentence what it is. Due
today, Done, Missed, Record and Active today each carry a sentence. Since round
QS the sentence is on the heading's press and not under it (FT26): his words,
"more show less tell if you want tell you press on something to get
information".
Streak, Best, Kept and Practised are explained under the figures. The rings on
the month are explained under the key. This is the owner's unpack rule of 2
October (`CLAUDE.md`, "UNPACK EVERY SYMBOL").

Gate: `tests/flowtools.js`, `FT14:`; `python3 .claude/skills/atuned-voice/check.py
--objections` for the voice.

### FT15. The rules and the gates are one list.

Every `### FTn.` in this file has a `Gate:` line naming `tests/flowtools.js`,
every `FTn:` check in that file has a rule here, and the practice TDD links this
file and names the gate.

Gate: `tests/flowtools.js`, `FT15:`.

### FT16. Inputting new lists every ritual suggested, and each one is a real read.

Round QN, his words: "on the left hand side ... I not only want the input there
but I want all the suggested ones that have come from the sniffer." The left
column holds the input, New ritual and the seven tags or the builder they
open, and Suggested under it (FT24 says when). The sniffer
(`engine/sourceai.js`) suggests nothing itself, so Suggested lists the three
reads that already turn the sniffer's seat reading into a practice: the
practice the seat carrying the most calls for (`ritFor`, which was the chain's
own Start and moved here), the Avatar page's own queue (`avRituals`: each
avatar story's bad day line goes through `readSeat`, the seat carries a load,
and the seat names its practice), and the heaviest held place at each seat as
a release schedule (`relQueueOf`). One card per practice, each reason on its
own line, the seat as its tag. The becoming's seat is the Ongoing goal card's,
so the bank offers nothing at that seat. Start for a week goes through
`ritStartPlan`, says so, and the card leaves the list. The chain carries no
Start. Achievements do not exist yet, so nothing on the page names one: the
link point is the row `ritSuggest` returns, named in `ui/ritstage.js`.

Gate: `tests/flowtools.js`, `FT16:`.

### FT17. The centre is six cards in his slots.

Round QN: "ideally this would be about six stack tall my upper right would be my
ongoing goal challenge the middle would be my active challenge and then my top
left would be Ritual to avatar." At 1600, Ritual to avatar is top left and
Ongoing goal top right on one row; Goals is the middle, across both;
Did it work and Keep or delete share the row under it; Success over time is
last, across both. At 390 they stack in that order. Round QX renamed two of
the six on his words, "my complete list of daily, weekly, monthly goals, and
my success win": Active today is now the Today of Goals (his "active
challenge", the Active list unchanged inside it), and Practice analytics is
Success over time, its thirty day charts now drawn for whichever span he
picks.

Gate: `tests/flowtools.js`, `FT17:`.

### FT18. Ritual to avatar reads the Avatar page's own cycle and the seats it is feeding.

The days kept are `avCycles`, the read the Avatar page draws its Cycles from,
so the two pages cannot disagree: distinct days with a ritual marked done.
Three rings, one a cycle, each cut in three turns of seven days, and a full
cycle takes a tick. Round QS put the avatar's own percent complete beside them
as the hero, `avState().overall`, the figure the Avatar page draws round its
core, in `cr()` at its hero size. Under them, each seat an avatar story sits at
is a tile, a `crBadge` with the Avatar page's own mark for that area (`AV_IC`)
and the area's percent complete as its ring; its press says the line the
person wrote and which active ritual is kept at that seat, or that none is.

Gate: `tests/flowtools.js`, `FT18:`.

### FT19. The ongoing goal is the avatar's own line, the place held in its way, and the next mark.

The becoming is the newest avatar line whose seat holds a place at four or
more, quoted and never paraphrased, with that place named and a schedule for
it offered once (A week, Two weeks). Once scheduled it says so and offers
nothing. The next mark is the ladder's own (`ladderRead`) and is on this card
only; the right column keeps the marks already earned.

Gate: `tests/flowtools.js`, `FT19:`.

### FT20. Did it work and Keep or delete say what happened and offer the decision at the end.

Did it work lists a ritual from its third day: kept days and missed days off
the record, and the held places the last reading before it started recorded
against the field now, or that there was no reading before it. It says the two
moved together and not that one moved the other. Keep or delete lists a
ritual in its last three days. Keep runs it a week more through the one
writer; Delete takes it off with Put back offered in the same card. A ritual
with no end never comes here.

Gate: `tests/flowtools.js`, `FT20:`.

### FT21. The thirty day loop is the record of thirty days, and the figures over it are counts.

Round QS, his words: "the accountability should have the 30 days of cubes
showing my progression and my achievements and badges and whatnot attached to
it". Thirty cubes, one a day. Round QX, "the whole thing should look
effectively like a calendar", made them one: the columns are the days of the
week, Monday first under their letters; each cube carries its date and the
first of a month its month; the month or months are named over the grid; and
the rest of this week is drawn ahead of today, so a ritual set for Tuesday,
Thursday and Saturday shows on the days still to come. A day ahead is never
counted and never a miss. A cube is done, planned, missed or empty off `ritDaySegs`, the month's own
read, so the cubes and the month cannot disagree; a done cube carries the seat
colour of every ritual kept on it. The figures over the cubes are days kept,
days missed and minutes in those thirty, never a rate. The cubes replace round
QN's ring: one read, one drawing of it. Each cube's press says its day.

Gate: `tests/flowtools.js`, `FT21:`.

### FT22. History is one card per ritual run, and one that ended goes back in rotation with one press.

Read off the plans and the record and no third store, grouped by the steps a
ritual carries. Active cards say Active. An ended one offers Back in rotation,
which starts it again from today through `ritStartPlan`, for the span it ran
last, and says so. The Record list no longer carries Ended rows and Again,
which were the same choice under a second name.

Gate: `tests/flowtools.js`, `FT22:`.

### FT23. Alive at rest, and still for a person who asked for stillness.

Behind the stage, one soft pool per seat holding charge, at the seat's angle
on the Avatar ring, breathing on the product's own breath; with nothing held,
one quiet pool. The readings draw in once when the page is arrived at and not
on every press. Under `prefers-reduced-motion` no animation runs on the page.

Gate: `tests/flowtools.js`, `FT23:`.

### FT24. Suggested is there with the input, on a first visit too, and says each choice once.

Found by walking the built page as Angela, Derek and James rather than by
reading it. The first cut of round QN wrote the left column as the builder or
Suggested, never both, and the builder opened itself whenever nothing was
active, a rule from round JQ written when the builder was the only place the
called practice had a Start. So a person with nothing running, the one who
most needs a suggestion, was shown none. His words ask for both.

The builder no longer opens itself. Suggested sits under the input whether the
builder is shut or open, and goes only while an existing ritual is being
edited, a different job, where a Start would leave the edit half done. A
practice already picked in the builder's draft is not offered again beneath
it. The same practice at the same seat is one card: walking James, the sacral
carried the most charge and held envy, and The Somatic Truth Check was offered
twice at the sacral. The held place is the more particular reason, so the card
already there takes it as a second line and its Start sets the release
schedule for that place.

Measured 3 October on a first visit at 1600, the left column's controls on
screen at once: 28 with the builder open on its own and no suggestion shown,
for Angela, James and a blank profile alike; after, 10 for Angela and the blank
profile and 12 for James, with every suggestion visible.

Gate: `tests/flowtools.js`, `FT24:`.

### FT25. A ritual is a symbol carrying its percent complete.

Every ritual row, in Active today and in Due today, carries a `crBadge`: its
seat's mark (`SEATGLYPH`) inside, a ring in its seat's colour, the figure in a
pill. The ring is percent complete: days kept over the days its span is set
for, `ritPct`, which only fills. A ritual with no end has nothing to complete,
so its ring is empty and the pill is the days kept. The seat tag is the badge
now, so a row prints no seat word; a second seat is a second mark. The badge's
press says what the ring and the pill are, with the figure and what it is out
of. The gate works the expected percent out from the days and the span.

Gate: `tests/flowtools.js`, `FT25:`.

### FT26. The tell is on the press.

His words, round QS: "more show less tell if you want tell you press on
something to get information". The first sentence of every part moves onto its
heading, which becomes a carrier for the one tooltip (`ui/tip.js`): the shape
the unpack gate already accepts, the term inside a carrier whose tooltip is
its sentence. The sentence stays in the document, folded. A second sentence
that is advice tied to a state stays where the state is.

Gate: `tests/flowtools.js`, `FT26:`.

### FT27. A suggestion wears its seat's colour and its seat's or pattern's mark.

His words, round QS: "the cards that come from the ritual builder they should
be colorized and related to the color of the chakra or fetter with their
symbol." Each Suggested card takes its seat's colour (`seatCol`) as a wash and
an edge. Its mark is a `crBadge`: for a release schedule, the held place's
pattern, the fetter's own mark from `CHILD`, with that place's charge as the
ring (`crbNode`'s shape); otherwise the seat's mark from `SEATGLYPH`, with the
heaviest place held at that seat as the ring. The mark is the press that opens
the reasons in place. Each seat tag carries the seat's mark beside its name.
The active rituals wear their seat as a wash too.

Gate: `tests/flowtools.js`, `FT27:`.

### FT28. The marks are attached to the days that earned them.

The marks are the ladder's (`engine/ladder.js`), with round QS's slice 0 of the
points and achievements TDD: First run reads a ritual marked done, Seven,
Thirty and Ninety days read days practised and not a strict row, and Every
track run and Came back are new. `markDays` dates each earned practice mark off
the record. A mark whose day is in the thirty is pinned on that cube; every
earned mark is on the shelf under the cubes, each with its meaning and its date
on the press. Only earned marks: the next is the Ongoing goal card's, and the
rest are never listed.

Gate: `tests/flowtools.js`, `FT28:`.

### FT29. A suggestion says what it is, what it is for and your record with it, and takes three answers.

Round QX, his words: "The ones on the left add a text description. And the
success of what it leads to ... allow me to add them to my daily practice or
bank them to my vault or dismiss." At rest each card shows the practice's own
line from the library, what it is for (the coherent opposite of the pattern
held at its place, CHILD's opp, only when a held place gives it one), and the
person's own record with that practice: days kept, or Not tried yet. No rate
is shown, because no measure of how well a practice works exists anywhere in
the engine, for anyone; a made up one would be the status lie. Three answers,
each 44 by 44: Add to daily practice (the old Start for a week), Save for
later, and Dismiss. Save for later is his "bank to my vault": Bank and Vault
already mean the imprints held and what has been released, so the saved
shelf has its own name. Dismiss offers Put back in place, and Bring back
dismissed at the foot returns them all. Both are kept beside the record under
`atuned-ritual-more`, refused on a worked example by name.

Gate: `tests/flowtools.js`, `FT29:`.

### FT30. Goals is today, this week and this month.

His words: "my complete list of daily, weekly, monthly goals". Today is the
Active list, three affirmations and the challenges, each with a ring pressed
once done today and pressed again to take it off. A said affirmation or a done
challenge is not a kept ritual day: the record, the streak, the avatar's
cycles and the thirty day loop do not move. This week is a calendar week,
Monday first with each date, one row per active ritual drawn on the days it is
set for: his "Tuesday, Thursday, Saturday" shows on those three days and no
other. This month is each active ritual with where its span ends, and the
month's counts.

Gate: `tests/flowtools.js`, `FT30:`.

### FT31. The affirmations and the challenges are real content and say where they came from.

His words: "I should see three. Daily affirmations. Three challenges." An
affirmation is the person's own avatar line first, newest first, then one line
per pattern held at four or more from `AFFIRM` (engine/data/affirm.js), each
said as the coherent opposite of that pattern. A challenge is a named
saboteur's own intervention from `SABDEF`, heaviest first; an inferred one
(seat and agent noun, "the Root Mourner") takes its fetter's line from
`CHALLENGE`, and says it is inferred; then a place held. Fewer than three is
said, never padded. Every one of the nine axes has both lines, first draft and
his to change, and none carries a dash.

Gate: `tests/flowtools.js`, `FT31:`.

### FT32. Success over time is his ten spans, counted off the record, and honest before it starts.

His words: "my success win in my accountability tracker that I can look at
over a period of a year, broken up into a year, six months, three months, two
months, one month, two weeks, one week. Five days, three days, one day." Ten
spans in his order. The figures are days kept, days missed, minutes and marks
earned in the span, counts and never a grade. The span is drawn a day a
square: a calendar of weeks for two months or less, and a year folded weeks to
columns past that. A span that reaches back before the record starts draws
those days blank, says how many, and counts none of them missed. A person with
no record is told so.

Gate: `tests/flowtools.js`, `FT32:`.

## 5. Not built, and why

These are in the practice TDD and are not in this change. Each is named so the
gap is not read as an oversight.

- **A success rate per practice** (round QX, "the success of what it leads
  to"). Nothing in the engine measures how well a practice works, for this
  person or anyone. A suggestion shows the person's own record with it and
  what it is for, and no rate, until the practice domain's Outcome records
  are written by a ritual.
- **Said and done travelling with an export** (round QX). Affirmations said,
  challenges done, and suggestions saved or dismissed sit beside the record
  under `atuned-ritual-more`, like the plans, because adding fields to the
  record is schema v2 and his. They survive a reload and stay in this browser.
- **One calendar where there are now two** (round QX). The thirty day loop is
  a calendar now and the Record month under it is the older one, with day
  presses that mark yesterday and delete an entry. Folding the Record's
  presses into the cubes and retiring the rings is the next cut, and changes
  FT8 and the Record's gates, so it is named and not made here.

- **The reason a day was missed.** TDD section 24 lists the classes
  (`wrong_time`, `too_long` and the rest, `PR_MISS` in the engine). The profile
  has nowhere to keep one yet, and a control that took an answer and dropped it
  would be the status lie. Edit is the only response offered at `PR_MISS_AT`.
- **Evidence and outcome** (TDD sections 11 to 14: what changed because you
  practised). They need the practice domain's own records wired to this
  surface, which is the P1 build order, and the surface would otherwise print
  an outcome nobody recorded.
- **The 30, 60 and 90 day change record** (TDD section 35). Round QN built the
  first thirty as a record of days (FT21) and the held places before and
  after a ritual as a read (FT20). The TDD's change record, an outcome per
  practice event, still waits on the practice domain being written by a
  ritual, which nothing does yet.
- **Achievements, past slice 0.** His round QN words, "links it up with the
  achievements when that system comes online". Round QS built the TDD's slice 0
  for the practice marks and attached them to the cubes (FT28). Points, stored
  marks (`p.progress`), the quarter families and the evidence drawer are not
  built: storing is a schema change and the schema is his. The link point for a
  suggestion is still the row `ritSuggest` returns in `ui/ritstage.js`.
- **What "a second design" means.** Round QN ends "I think I mentioned we're
  going to use a second design." Searched `TASKS.md`, `DECISIONS.md`, the
  `DESIGN-*.md` files, `mockups/` and `proto/` for it. Two older candidates
  exist and neither is certain: round RC, 20 September, "for the ritual design,
  let's start with B" (the board, `proto/ritual/board.html`), and
  `proto/ritual/ritual2.html`, which names itself "the ritual page, second
  rebuild". Both were folded into the build long ago. This round is built in
  the product's current skin and the question is open.
- **Points lost for a miss.** His line from the original ritual brief, "if I
  fail an accountability I lose points", is a gamification rule, and the TDD
  says a miss is investigated and not punished. The two disagree and the
  ruling is his.

## 6. The gate map

| Rule | Gate |
|---|---|
| FT1 to FT32 | `tests/flowtools.js` |
| FT1, and every TAB integer | `tests/engine.js`, `tests/functional.js` |
| FT6, FT12 | `tests/design.js`, `tools/monitor.js` |
| FT10 | `tests/functional.js` |
| Practice domain, schema and graph under the surface | `tests/practice.js`, `tests/trace.js` |
| FT14 voice | `.claude/skills/atuned-voice/check.py --objections` |
