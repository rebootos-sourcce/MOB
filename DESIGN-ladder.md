# The ladder. Scoring, marks and awards, built on the loop he ruled

His ruling: "It sounds like you need to send the team on the scoring, the badge
and achievement system. So I want to go ahead and do that." `TASKS.md` GB1 says
what was missing, and it is the right diagnosis: both design documents exist and
**the ladder has never been designed against the loop**. This one is.

Everything below is measured. `proto/ladder/probe.js` prints every figure in
this file off the real engine, and `proto/ladder/index.html` renders the same
figures live in a browser off `../../engine.js`, so the document and the
prototype cannot disagree. Run the probe before quoting any number here: if it
has moved, the run is right and this file is wrong.

    node proto/ladder/probe.js
    NODE_PATH=$(npm root -g) node proto/ladder/shot.js

---

# 1. What is scored, and off what

## 1.1 The one sentence

> **One closed circle is one turn, and a turn is the only thing this design
> counts.**

The word is his. "The gamification exists to keep that turning." A turn is one
traverse of discover, play, flow, embody. It is a count of events that happened,
which is the only kind of count this product allows, and it is never printed
against a total.

**Nothing else is scored, and that is the whole answer to the word scoring.**
The reading is not a score, the band is not a score, the avatar is not a score,
and patterns stay the one currency `DESIGN-progression.md` 2.2 already rules.
What a person sees moving is a count of times they went round.

## 1.2 What the engine already holds, by name

Every one of these is a live function or a stored field today. Nothing here
needs building.

| Quantity | Read by | Where |
|---|---|---|
| coherence, integrity, the band | `compute().CQ`, `.JQ`, `.tier` | `engine/compute.js` |
| the person's own ceiling | `cqCeiling()` | exported, pure |
| addresses loaded, carrying, and the release candidates | `compute().loaded`, `.carrying`, `.excess` | `.excess` is `W.filter(n=>n.jq>=4)` at `compute.js:123` |
| the nine axes, held and at the pole | `p.axes[name]` | written by `saveProfile` off `S.charge` and `S.replace`, `schema.js:115` |
| ground opened, lines spoken | `ledgerRead().ground`, `.lines` | `meter.unique`, `meter.lines` |
| the dated firsts | `meterRead().firsts`, `meterFirst()` | `schema.js` |
| the seven markers, scaled to the person | `meterRead().markers`, `.next`, `markersFor()` | `MARKERS`, `PAT_PER_YEAR` |
| the gift | `meterRead().giftLeft`, `.inGift` | 100 of new ground |
| minutes practised, planned and done | `ledgerRead().minutes`, `.planned`, `.done` | `engine/ladder.js` |
| days practised, the run, the longest row | `streakRead().days`, `.run`, `.best` | halves with one grace day |
| axes at the pole, axes carrying | `ledgerRead().clear`, `.carry` | threshold 4 |
| readings on file | `ledgerRead().snaps`, `p.history` | `snapshot()` |
| coherence over time | `seriesRead()` | `engine/ladder.js` |
| the sixteen marks and the next one | `MARKS`, `ladderRead()` | `engine/ladder.js` |
| intake complete, type stated, purpose set | `p.intake.completedAt`, `p.seed`, `purposeReady()` | |
| the plan and the allowance | `planState()`, `planAllowance()`, `PLANS` | `engine/plan.js` |
| the ritual's track and minutes | `p.rituals[].track`, `.min`, `.done` | four tracks, read off `PRACTICE` |

**The finding that decides the design: the loop is already instrumented and
nothing reads it.** All four quarters carry a timestamp today. A story entry is
stamped at `ui/storyui.js:85`. A ritual is stamped when it is saved and again
when it is marked done, at `ui/ritual.js:193` and `:186`. A reading is stamped
by `snapshot()`. So the turn costs **no schema change and no new write
anywhere**. `turnRead` merges the four streams, walks them once, and closes a
turn when all four have been touched since the last one closed.

## 1.3 What does not exist and has to be computed, named and sized

| Needed for | What it is | Size |
|---|---|---|
| the turn | `turnRead(p, now)` | a pure read of four existing stamps. No storage |
| the Cleared awards | reads `n.pole` per address off `compute()` | no storage |
| the Moved awards | reads `cq` across `p.history` against `TIERDEF` | no storage |
| the Held awards | the nine held and nine pole values on a snapshot | **18 base thirty six characters per snapshot. 3.6 kB at 200 snapshots** |
| the Closed awards | `cqCeiling()` at the moment of the reading | **one number per snapshot** |
| the short run mark | a `floor:true` flag where `done` is written | **one boolean per ritual entry** |
| the award shelf | `p.awards`, `{k, t, at}`, conferred once, capped at 400 like `supply.log` | **one array** |

That is the whole build: one boolean, one array, and two fields on a snapshot.
`snapshot()` today carries `cq, dq, sq, pole, jq, rad, loaded, sab, cx, hy, ch,
dark, tier, arch` and does not carry the nine axes or the ceiling, which is why
two of the four award families cannot be computed off the record as it stands.
The prototype writes both fields in its harness and shows what they are worth,
so the schema change is made on evidence rather than on a promise.

## 1.4 Five defects in the sixteen marks as they ship

Found by running `MARKS[].t` against real profiles. Each is corrected in
`proto/ladder/turn.js` with the correction named in the comment beside it.

**1. Three marks demand a perfect row from a product built not to demand one.**
`week`, `month` and `season` test `s.best`, the longest strictly consecutive
run. Six lines above, `streakRead` halves the run with one grace day on Lally
2010, and the citation says a missed opportunity does not materially affect
habit formation. So the badge is stricter than the mechanic beside it.

Measured, Diane, ninety days, the same fortnight off in all three cases, read
off section 4b of the probe:

| cadence | days practised | the run | longest row | turns | seven days, as built | thirty days, as built |
|---|---|---|---|---|---|---|
| daily | 76 | 53 | 44 | 76 | earned | earned |
| twice a week | 22 | 1 | 1 | 22 | **no** | **no** |
| weekly | 11 | 1 | 1 | 11 | **no** | **no** |

**A person who practised religiously twice a week for three months earns neither
mark, and their run reads 1.** Twice a week is the cadence
`DESIGN-gamification.md` costs its whole retention case on. The shipped ladder
is a daily ladder and is silently hostile at every other session shape, which is
the failure mode I own: most products are built for one length and are hostile
at the other. Corrected: the practice marks count **days practised**. The run is
still drawn and is still live or not. It is simply not what the mark reads.

**2. Two marks say addresses and count lines.** `ten` reads
`ledgerRead().ground`, which is `meter.unique.length`, and a meter key is
`nodeId:channel:line`. One address across the four channels is four of those. So
"Ten distinct addresses opened. Not ten runs. Ten places." sits above a test that
passes at two and a half places. Measured on the day one profile: one address
opened, ground reads 4. Corrected to count distinct node ids.

**3. One mark rewards ten minutes of typing.** `kept` reads ten story entries.
Ten lines in one sitting is volume in one quarter of the loop, which is exactly
what this design refuses to pay for. Corrected to ten distinct days with an
entry, which is the claim the copy was already making.

**4. One mark's test disagrees with its own description.** `nine` says "Every one
of the nine has a value you entered. Nothing is a default" and tests
`clear + carry >= 9`, which counts only axes at 4 or above. A person who entered
a 2 on three axes had entered nine values and the mark said they had not.
Corrected to read what the copy claims.

**5. One key takes a word this design needs.** `turned` becomes `poled`. The user
facing name, First clearing, does not change, so nothing anybody has already
earned reads differently. One word per concept: a turn is one closed circle.

Fifteen of the sixteen keys are kept unchanged, because a key is identity and is
compared against a record somebody already holds.

## 1.5 And the finding underneath all of it

`compute().excess` is the release candidate list, `W.filter(n => n.jq >= 4)`, and
`jq` is zero everywhere until an opposite has been installed. Measured on the
fourteen person roster:

    release candidates empty for 7 of 14: Gordon, Tomas, Ana, Nkem, Wren,
    Abraham, Rosa
    empty at both ends: lowest CQ Gordon at 0.8, highest Rosa at 100.0

Gordon carries 107 addresses, has 97 loaded, and the release mechanic has
nothing to offer him. Rosa at 100 has nothing to offer either.
`DESIGN-gamification.md` 6.2 found one end of this, the 465 of 1000 who reach a
calm reading with nothing to release, and designed the Held family around it.
**The other end was never named, and it is the half in a bad month.** Any award
family that needs a release run is shut to both.

Also measured, and it is not mine to rule: twenty two releases run with the
product's own arithmetic move Sofia from 56.6 to 55.1 and Lance from 87.6 to
84.7. Two of the fourteen go backwards for doing the work. Question 4 below.

---

# 2. The ladder

## 2.1 There is one ruler and it is already built

`MARKERS` is the ladder: seven fixed distances on ground, scaled to a person's
own load rather than to one man's numbers at one man's age, forbidden from
gating anything, and printing only the next one. Nothing here replaces it. What
this design adds is the curve that makes it reachable and the count that moves
daily, because a ruler that spans years cannot answer "did today happen".

So there are two things and they must never be confused:

- **The ruler.** Seven markers, a whole life, and it answers how far.
- **The turn.** One closed circle, and it answers whether the loop is turning.

## 2.2 The curve, stated as arithmetic

    turns(d, c) = floor(d * c / 7)

d is days since the first session, c is circles closed in a week.

| cadence | d1 | d7 | d30 | d90 |
|---|---|---|---|---|
| the whole ring, daily | 1 | 7 | 30 | 90 |
| the whole ring, twice a week | 0 | 2 | 8 | 25 |
| the whole ring, weekly | 0 | 1 | 4 | 12 |
| the short run only | 0 | 0 | 0 | 0 |

**The fourth row is the one that matters and it is why this is the right
mechanic.** A person who only ever runs the sixty second floor closes no
circles. The design pays them nothing for a turn, which is correct, and takes
nothing from them, which is the rule: they keep every day, earn Seven days,
Thirty days and Ninety days on days practised, carry a live run, and the word
turn never appears on their screen as something they are missing.

**And a turn cannot be farmed.** Ten entries close no turns. Ten rituals close no
turns. To close one, a person has to go round. That is the whole reason to count
the circle rather than the acts, and it is the mechanical answer to "kill any
badge that rewards volume over release".

**A turn does not have to close inside one session.** Write on Monday, practise
on Tuesday, and the reading moves on Wednesday: the turn closes on Wednesday. A
circle that had to close inside one visit would be a twenty minute product with
a hostile five minute mode.

## 2.3 What unlocks, and nothing is set by a number anybody chose

**A surface appears the moment the arithmetic behind it can be stated honestly,
and never before and never later.** `seriesRead` already works this way: nothing
is one state, one reading is a second, and two or more is a line, because one
point is not a flat line, it is one reading. Every rung is the minimum data a
statement needs to be true.

| readings | what can then be said | where it shows |
|---|---|---|
| 1 | a reading | the field, the body, the ladder |
| 2 | a direction | the graph draws its first line |
| 7 | an axis held its pole | the award shelf appears |
| 13 | a quarter of the graph | the quarter span stops being empty |
| 30 | a month at a daily cadence | the month span |

That is not a gate and it is not a withholding. It is the product refusing to
draw a flat line through one point.

## 2.4 Day one, seven, thirty, ninety, and what changes on screen

Measured, twice a week, the marks earned against the day, from section 4 of the
probe:

| who | d1 | d7 | d14 | d30 | d60 | d90 |
|---|---|---|---|---|---|---|
| Gordon, CQ 0.8 | 6 | 6 | 7 | 9 | 13 | 14 |
| Diane, CQ 28.1 | 7 | 7 | 8 | 10 | 14 | 15 |
| Angela, CQ 40.9 | 7 | 7 | 8 | 10 | 14 | 15 |
| Rosa, CQ 100 | 8 | 8 | 9 | 11 | 14 | 15 |

**The curve is flat between d1 and d7 and that is the thing to look at.** A first
session is generous because a first session is genuinely a lot of firsts, then
nothing lands for a week. That is the honest shape of slow work and it is also
where a product loses people. The answer is not to add a mark at day three. It
is that the graph starts drawing at two readings and the award shelf opens at
seven, which is what the readiness table above is for: between d1 and d7 the
thing that changes is not the shelf, it is that the record starts being able to
say something.

**Day one.** A story told, a ritual dealt and marked done, a reading on file, the
intake done or a type stated. The circle closes once. Six to eight marks land.
The ruler says Entry is behind and names the next distance, scaled to the
person's own load. The graph says one reading and refuses to draw a line. The
award shelf is empty and says so as a fact, not as a demand.

**Day seven.** The run is live or it is not, and either way seven days of
practice is on the record if seven days happened. The graph draws. Held becomes
computable at seven readings in a row. What changed on screen: the span buttons
became a graph and the award shelf appeared.

**Day thirty.** Thirty days of practice, sixty minutes, ten addresses. A band
crossing is possible and confers a Moved award if it happened upward. What
changed: the graph carries a month, the dated firsts have a list, and the avatar
has moved in the seats that moved.

**Day ninety.** Ninety days of practice, ten readings, and the ruler has moved a
measurable distance. Measured: twenty two turns at twice a week with a fortnight
off in the middle, fourteen to sixteen marks, three to eleven awards. What
changed: the compass oscillation range becomes readable because there are enough
readings to have a range.

## 2.5 What it costs, in the one currency

Nothing in this design introduces a second unit. `DESIGN-progression.md` 6.4
already prices the acts in patterns and those rates stand. The turn is a count,
not a currency, and it buys nothing, which is deliberate: the moment a turn buys
something, closing one becomes a transaction and the loop becomes a grind.

---

# 3. Marks and awards

## 3.1 The structure, and it is the thing GB1 asked for

**One family per quarter of the circle, and the family sits at that quarter's
seat.** That is the sewing. The marks already had three families at three seats
and no relationship to the loop at all. Now the shelf reads as the circle:

| quarter | seat | what the family counts |
|---|---|---|
| Discover | 3rd Eye | what you found |
| Play | Sacral | what you ran |
| Flow | Root | what you kept |
| Embody | Heart | what moved |
| the turn | Solar | the whole ring, and it is the only one that is not a quarter |

**And an award's colour is where it happened, not which family it is in.** This
overrules `DESIGN-gamification.md` 6.2, which set Cleared at the throat, Held at
the heart and Moved at the root as family colours. An award is about a place in
the body, so the body has already decided its colour: a Cleared at the root is
root coloured, and Trust held is root coloured because Fear sits at the root.
The family is carried by the ring geometry instead, which is Apple's own
taxonomy and the one that document already cites. The shelf then reads as a body
map at a glance, which is the layer sewing he ruled: the award to the body, the
body to the story.

## 3.2 The marks. Counted off the list

Read off `MARK2` by the probe, never typed here:

    marks in engine/ladder.js today : 16
    marks in this design            : 22
      by quarter                    : discover 5, play 4, flow 4, embody 7, turn 2
      kept keys                     : 15 of 16
      key renamed                   : turned -> poled
      added                         : named, tracks, floor, back, ring, rings

**Discover, 3rd Eye.** First story, one entry. Ten stories, ten distinct days
with an entry. Ten addresses, ten distinct node ids. Fifty addresses. Every seat
opened, ground at all seven seats.

**Play, Sacral.** First run, one ritual. Sixty minutes practised. Every track
run, one run in each track, the count read off `PRACTICE` at run time and never
typed. The short run, one floor length ritual marked done.

**Flow, Root.** Seven days, Thirty days and Ninety days, all on days practised.
And **Came back**: a gap of fourteen days or more, and then a day of practice.

**Embody, Heart.** Nine axes. Laws measured. Blueprint stated. Purpose set.
First clearing. Five clear. Ten readings.

**The turn, Solar.** First turn. Ten turns.

## 3.3 Came back is the mark this design exists to make possible

Every practice badge in every product of this kind pays for an unbroken row,
which means the only thing it can say to somebody who stopped is that they
failed. **Came back requires the gap.** It cannot shame an absence because an
absence is its condition, and it is the only mark here that a person in a bad
month can earn by doing the single hardest thing available to them, which is
opening the thing again.

Measured on the heavy column, which carries a deliberate fortnight of nothing at
days 44 to 58: earned by 14 of 14.

It is also the one mark that reads a gap at all. `gapMax` is read by exactly one
test and is never rendered on its own, because a number printed beside the word
gap is a product naming an absence.

## 3.4 The awards. Counted off the list

    awards in this design : 29
      by family           : Cleared 7, Held 9, Moved 9, Closed 4
    marks plus awards     : 51

- **Cleared, 7,** one per seat. An address at that seat whose far pole exceeds
  what it carries. Reads `compute()` and works today. It reads the pole per
  address rather than a release run, which is what keeps it open to the people
  section 1.5 measured as having no release candidates.
- **Held, 9,** one per axis, named after the opposite rather than the fetter.
  Trust held, not Fear held. The award is for the thing being held. Needs the
  eighteen characters on the snapshot.
- **Moved, 9,** one per band boundary, `TIERDEF` carries ten bands, **upward
  only.** `DESIGN-gamification.md` 6.2 has this in either direction on the
  argument that a crossing is a fact and a fact claims nothing. The fact is not
  in dispute. Putting a downward crossing on a shelf is, because a shelf is read
  as a list of what somebody achieved and an entry saying the reading fell is a
  product congratulating somebody for getting worse. The downward crossing
  belongs on the graph, which already draws it, because a graph is a record and
  a shelf is a reward.
- **Closed, 4.** New, and it exists because of a measurement.

## 3.5 Why Closed exists, and it is the number that decides the design

Measured at ninety days and twenty two closed circles, before Closed was added:

    the award shelf holds nothing for Gordon and Tomas, and one award for
    Ana and Nkem.

The four most loaded people on the roster do ninety days of work and the shelf
cannot say anything about any of it. **Not because they did less.**

| who | cq day 1 | cq day 90 | moved | their ceiling | of the drag, off |
|---|---|---|---|---|---|
| Gordon | 0.8 | 3.0 | +2.2 | 3.1 | 94% |
| Tomas | 2.1 | 6.6 | +4.5 | 6.8 | 96% |
| Nkem | 10.6 | 19.9 | +9.3 | 20.1 | 98% |
| Ana | 8.5 | 16.7 | +8.2 | 18.2 | 85% |

Gordon closed ninety four percent of the distance available to him. Every one of
the nine band boundaries sits at 11 or above, so all of that happens inside one
band and Moved is blind to it. He has no address with a pole, so Cleared is
blind to it too.

**The band ladder measures a person against everybody. The ceiling measures a
person against themselves,** and the owner has already ruled which of those two
this instrument is: a person is the most powerful version of themselves and the
reading is the drag against it, which is the comment above `cqCeiling` in
`engine/export.js`. So the fourth family reads the drag coming off, in quarters
of the distance that was there on the first reading.

    closed = (cq now - cq first) / (ceiling first - cq first)

Four awards: a quarter, a half, three quarters, all of it. It is the same move
`MARKERS` already makes for ground, where the distances are fractions of a
person's own load. Somebody already at their ceiling holds all four on the first
reading, which is honest: they are at their ceiling.

With Closed added, the measured range at ninety days moves from **0 to 8 awards**
to **3 to 11.** Nobody scores nothing for ninety days of work.

## 3.6 What was killed, and why

| Killed | Why |
|---|---|
| `week`, `month`, `season` as written, testing `s.best` | shames a gap, and unearnable at every cadence but daily. Measured in 1.4 |
| `kept` as written, ten entries | volume in one quarter, farmable in ten minutes |
| `ten` and `fifty` as written, counting lines | the copy says places and the test counts lines |
| `nine` as written | the test disagrees with its own description |
| Moved in the downward direction, as designed in 6.2 | an award for getting worse |
| an award family gated on a release run | measured shut to 7 of 14 at both ends of the range |
| a fourth quarter with no mechanic | Embody had seven marks and Play had two. Play gained the tracks and the floor |

Nothing was killed for being too generous. Every kill is a mark that could not be
earned by somebody doing the work honestly and slowly, or one that could be
earned without doing the work at all.

---

# 4. The anti design

The mechanic is named in every row, because a refusal without the mechanic
attached is a preference.

**1. A streak that resets, and a mark that demands a row.** Mechanic:
`streakRead().best`, read by three of the sixteen marks. The run already halves
with one grace day. Corrected so the badge is not stricter than the mechanic
beside it.

**2. A variable ratio reward.** Mechanic: never. Schull, *Addiction by Design*.
Every threshold here is fixed, announced, and visible before it is reached, so a
person can see it coming and decide not to chase it.

**3. A near miss.** Mechanic: `markRead().next` returns one mark and never a
list. The ones past it are not enumerated, because a list of somebody's
unfinished self is a completion bar on a nervous system.

**4. A count against a total.** Mechanic: never a denominator. The length of
`MARK2` exists in the code and is never handed to a surface as the bottom half
of a fraction.

**5. Any sentence naming an absence.** Mechanic: `gapMax` is read by one test and
never rendered. No welcome back, no gentle note, no freeze that was helpfully
applied. The return is marked. The absence is not mentioned.

**6. An award for getting worse.** Mechanic: Moved, upward crossings only. Two of
the fourteen go backwards over ninety days and neither of them is congratulated
for it.

**7. Volume in one quarter paying for anything.** Mechanic: `turnRead` walks all
four streams and closes only when all four have been touched.

**8. A scarcity timer, an expiry, or a season that can be lost.** Mechanic:
never. Nothing in this product expires and no award is ever taken back.

**9. A rank, a list of people, or a shared number.** Mechanic: never. It would
rank people who handed a machine their distress.

**10. An award family that is shut to the people who need it most.** Mechanic:
measured, and it is why Closed exists.

## 4.1 The hardest case, which is the one it will be judged on

A person in a bad month. Gordon, coherence 0.8, band Collapsed, 107 addresses
carrying, nothing the release mechanic will offer him, and a fortnight where he
could not open it at all.

What the design does for him, measured rather than asserted. Fourteen marks at
ninety days. Three awards, all of them Closed, because he took ninety four
percent of the drag off a ceiling of 3.1. Twenty two turns. **Came back**, which
is the one mark that required the fortnight. Seven days, on days practised,
which the shipped ladder would refuse him.

What the design never shows him. His run, which reads 1 and means nothing. A
count of anything against anything. The fourteen day gap, anywhere, in any
words. A near miss on a mark he will not reach. A list of the marks he has not
got. An award saying his reading fell.

And the rule that decides the rest of it stands unchanged from
`DESIGN-progression.md` 4.1: the product may hide what it sells, it may never
hide what it measures. At `careState` acute the counter, the ruler, the field
number and every upsell are absent from the render. **The marks and the awards
stay,** because they are his own record of his own work and hiding a person's
record from them at the moment they most need to see it is the same refusal as a
paywall, wearing kindness.

---

# 5. Build order

Each item ships alone and each is small.

1. **`turnRead` and the ring.** No schema change, no new write. Reads four
   timestamps the profile already carries. This is the whole scoring system and
   it is a pure function plus a drawing.
2. **The five corrections to `MARKS`.** Data and one line per test. Nothing a
   person has already earned changes except that three marks become earnable at
   cadences other than daily.
3. **The six new marks.** `named`, `tracks`, `back`, `ring`, `rings` need
   nothing. `floor` needs one boolean where `done` is written.
4. **Cleared and Moved.** Compute off the reading and off `p.history`. Needs
   `p.awards` to record the date a thing first became true.
5. **The snapshot gains two fields.** The ceiling as one number, the nine axes as
   eighteen characters. Additive, and an older snapshot without them reads as a
   snapshot that cannot answer, which is the migration pattern `schema.js`
   already uses.
6. **Held and Closed.** After 5.
7. **The award shelf on the surface the release happened on**, per
   `DESIGN-gamification.md` section 9 requirement 1: the loop pays out where the
   act happened or it does not pay out.

**Never.** A marker as a gate. A turn that buys anything. A consecutive day
counter that resets. A notification naming an absence. A shelf of awards a person
has not got.

---

# 6. Open, and whose call

**1. Is the word turn his?** It is his own phrase made literal: "the
gamification exists to keep that turning". It takes the key `turned` off the
existing First clearing mark, which is free because the key is internal. If he
wants another word, every rate and every arithmetic in this design is unchanged
and only the label moves. **His.**

**2. Does a person see the turn count as a number on the screen, or only the
ring drawn?** This design prints it, because a count a person cannot read is not
a record. It is the one place this design comes closest to the standing ruling
that a reading is never a score, and a turn is a count of events rather than a
reading, so I believe it passes. `DESIGN-gamification.md` question 6 asks the
same question about the karma balance and it is the same question.
**His, and it is the same ruling for both.**

**3. Does the snapshot get the two new fields?** Eighteen characters and one
number per snapshot, and without them two of the four award families cannot be
computed at all, including the only one that works for a person in a bad month.
Schema, so it is the cross compatibility contract with SOURCE.
**His, and it blocks items 5 and 6 only.**

**4. Twenty two releases run with the product's own arithmetic move Sofia from
56.6 to 55.1 and Lance from 87.6 to 84.7. Is a release supposed to be able to
lower coherence, or is that a defect in the `replace` term?** Measured with the
exact constants at `ui/release.js:107` to `:113`. It decides nothing in this
design, because Closed confers on a rise and never punishes a fall, but a person
who does ninety days of work and watches the number go down is the worst
outcome this product has. **His, and it is the engine seat's to reproduce.**

**5. Is Came back one mark or a family?** It is one mark here, earnable once.
Earnable every time is warmer and is also a product paying repeatedly for
absence, which I will not propose. **Mine to propose, his to rule.**
