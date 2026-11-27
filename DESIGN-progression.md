# Progression, scoring and reward

One system. The score, the markers, the dated firsts, the badges, the
allowance, the store, the referral and the comparison surface, all reading one
number that cannot go down.

This document is a design, not a build. It changes no code. Where it
recommends against a mechanic the owner has named, the recommendation is
stated as a refusal with the argument attached, because a mechanic that cannot
be made safe is cheaper to decline now than to surround with scaffolding
later.

**What it inherits and does not re-derive.** `RESEARCH-ladder.md` holds the
evidence, the harms analysis and the crisis case, and all of it stands. Its
rejections of consecutive day streaks, variable reward, leaderboards and loss
framing are upheld here, not reopened. `DECISIONS.md` holds the rulings on the
gift, the plan ladder, density, privacy, the practitioner and the data
promise. `PANEL-10k.md` holds the segment sizes, the willingness to pay and
the words that cost people. `.claude/skills/atuned-ux/SKILL.md` holds the
measured floors.

**On case.** Copy blocks in this document follow the case ruling in
`DECISIONS.md`: a header on a surface takes a capital on every word, body text
is sentence case. The document's own headings follow the precedent of
`RESEARCH-ladder.md` and `PANEL-10k.md`.

**On sourcing.** Outbound page fetching is refused in this environment.
Section 1 rests on search result snippets, not on sources read end to end, and
every item that does is marked **[snippet]**. Mechanics I can state precisely
from the game itself are marked **[mechanic]** and carry no citation claim
beyond the statement of how the system works.

---

# 0. The four findings that come before the design

These came out of reading the code. Three of them change the shape of what can
be built, and the first one blocks the marker surface outright.

### 0.1 The markers sit outside the meter's key space. Measured.

`meterKey(nodeId,chan)` at `engine/schema.js:244` builds one key per address
per channel. `release.js:7` declares four channels, and `release.js:53` to
`:54` writes one key per channel per queued address. So the set of distinct
keys a person can ever hold is the number of releasable addresses times four.

Measured by executing `engine.js` this session: 107 of the 112 addresses carry
a child fetter and are therefore releasable, and a saturated profile holds
**428** unique keys. That is the ceiling. Every address, every channel, run
once.

`MARKERS` at `engine/schema.js:278` to `:284` places six fixed distances at 1,
2500, 3500, 4500, 10000 and 12000 unique ground. **Five of the six are outside
the key space.** At nine channels instead of four the ceiling is 963 and four
of them are still outside it.

The same disagreement shows in the horizon. `PAT_PER_YEAR=200` at
`engine/schema.js:264` puts a 43 year old's own total at 8600, and
`meterRead().cleared` at `:303` divides ground opened by that estimate. With a
ceiling of 428, `cleared` cannot exceed 5 percent for that person no matter
what she does. The estimate and the meter are about twenty times apart.

The comment at `engine/schema.js:265` to `:277` already knows the seam is
there: the owner's own ladder counted total releases including repeats, the
meter counts unique ground, and the thresholds were held against the harder
number with the difference stated rather than rescaled. The measurement now
says the difference is not a rounding matter. It is a factor of fifty.

**What resolves it, and it is already ruled.** `DECISIONS.md:198` records the
catalog's confirmation that a pattern is one sentence, and `DECISIONS.md:203`
that a card is two hundred statements at one address. Key by statement and the
ceiling becomes 107 times 200, which is **21,400** measured, and the six
markers land at 0, 12, 16, 21, 47 and 56 percent of it. The horizon at 8600
then sits at 40 percent of the ceiling, which is coherent for a quantity that
means what one person is carrying against all the ground there is.

The owner's own referral arithmetic is the third witness. Twenty five patterns
is "like three therapy sessions", and `DECISIONS.md:96` prices a session at
one to six patterns. That is about eight patterns to a session. Under
statement keying, 25 patterns is an eighth of a card and the sentence is true.
Under address by channel keying, 25 patterns is six addresses swept to the
floor, which is not three therapy sessions by any reading.

So the recommendation is statement keying, and the ruling is his because
`DECISIONS.md:52` names it as open and it moves the price by a factor of two
hundred. Nothing else in this document is blocked by it except the marker
surface and the printed allowance.

### 0.2 Under the current keying, every plan above the first is unsellable inside two months

At four keys per address, plan one at 400 patterns a month buys 100 addresses
a month. The whole field is 107. A person on plan two at 800 exhausts every
piece of new ground in the product in about five weeks, after which the plan
sells nothing, because `meterRun` at `engine/schema.js:253` only counts a key
once and reruns are free forever by construction.

Statement keying fixes this too. Plan one becomes two addresses fully cleared
a month, the field becomes about four and a half years of work, and the
markers span roughly a year to two and a half years of paid use. That is a
subscription arc rather than a six week one.

### 0.3 The blank meter is written in four places and they disagree

`engine/schema.js:36` declares `meter` with `firsts`. The repair path at `:51`,
the guard in `meterRun` at `:247` and the guard in `meterFirst` at `:321` each
rebuild it without `firsts`. Nothing breaks today because `meterFirst` checks
the array before pushing at `:322`, but the shape of the product's only
achievement primitive is defined four times and agreed on once. One factory,
called by all four.

### 0.4 The boundary bounds the keys and not their number

`engine/schema.js:201` to `:203` filters `meter.unique` to strings under 64
characters and accepts any quantity of them. An import of a million keys is
accepted, saved, and fills the person's storage. Measured: a saturated profile
under statement keying is 178 KB of JSON, so a cap of 25,000 keys refused by
name is both generous and sufficient. The boundary already refuses out of
range numbers by name at `:129` to `:133`, so this is the same discipline
applied to a length.

---

# 1. Simulated against the best built games

Thirteen systems. For each: the mechanic stated precisely, what it solves,
and what this product takes or refuses. The ones this design is actually built
out of are marked **taken**.

### 1.1 Hades, the Mirror of Night and Darkness. Taken.

Darkness is earned inside a run and survives the run's failure. It is spent on
the Mirror for permanent account wide talents, and the Mirror can be respecced
cheaply with a full refund of Darkness. **[snippet]**

**Solves:** effort that produced no win still produced progress. Nothing a
person did is wasted, so a bad attempt is not a loss event.

**Taken:** ground opened is the Darkness of this product. `meter.unique` at
`engine/schema.js:36` only grows. A release that reads worse afterwards still
opened the ground it opened. The nine day absence in the crisis case costs it
nothing, which is exactly why it is the spine and not the coherence band.

**Refused:** the respec. Undo exists at `engine/undo.js:37` for the inputs,
and ground opened is a record of an event rather than a configuration, so
there is nothing to refund.

### 1.2 Guild Wars 2, masteries and horizontal progression. Taken.

No gear treadmill. New content does not obsolete old gear. The mastery system
is account wide and pays in capabilities and access rather than in numbers
going up. **[snippet]**

**Solves:** a ladder that never invalidates what a person already has, and a
top that is not a treadmill.

**Taken:** the markers are horizontal. Nothing unlocks at one, nothing
obsoletes at one, and a person who reaches one has not been promoted. This is
also the answer to the `PANEL-10k.md` director note that Mastery at CQ 90 is
arithmetically out of reach: a vertical top band that nobody can stand on is
decoration, and a horizontal distance that anybody can walk toward is not.

### 1.3 Old School RuneScape's collection log and Animal Crossing's Nook Miles. Taken.

The collection log is a finite, permanent, itemised record of what a player
has obtained, kept in one book. **[snippet]** Nook Miles are one currency,
earned from named activities, spent in one catalogue, with titles that are
cosmetic and carry no power. **[snippet]**

**Solves:** a shelf of facts instead of a scoreboard, and one currency instead
of six.

**Taken:** both. `meter.firsts` at `engine/schema.js:319` to `:327` is already
the collection log, written at `ui/release.js:60` to `:67`, dated, deduplicated
and never removable. One currency is the hardest rule in section 2 and this is
its precedent.

### 1.4 The Souls series and Elden Ring. Taken.

There is no score. Progress is the state of the world: a shortcut opened, a
boss dead, a bonfire lit. Death costs runes at a named location and asserts
nothing about the player. **[mechanic]**

**Solves:** a product can carry deep progression with no number attached to
the person.

**Taken:** the product prints no score of a person. `engine/compute.js:142`
names a coherence band and it moves in both directions, so it is a reading and
never a rank. The ladder is made of world state: which addresses are open,
which opposites are installed.

### 1.5 Factorio. Taken.

There is no experience bar. The factory is the progress. The player reads
their own advancement off the thing they built. **[mechanic]**

**Solves:** the progression surface and the working surface are the same
object, so nothing has to be invented to represent progress.

**Taken:** the field is the factory. The wheel already shows what is held and
what is installed, and `DECISIONS.md:36` already names the imprints as the
bank a person fills. The ledger annotates that, it does not replace it.

### 1.6 Riot's ranked ladder. Refused, and instructive.

Hidden matchmaking rating, visible divisions, a demotion protection shield for
a set number of games on promotion, tier loss protection tied to the hidden
rating, promotion series, and decay. **[snippet]**

**Solves:** nothing this product needs. What it demonstrates is the cost of
the mechanic: a competitive ladder needs shields, series, warnings and decay
before it is tolerable, which is the same finding `RESEARCH-ladder.md` records
for the Duolingo streak. The scaffolding is the evidence that the bare
mechanic hurts.

**Refused:** ranking people who are handing a machine somatic and
psychological self report.

### 1.7 Peloton's "Just me" filter and Just Ride. Taken.

The leaderboard can be filtered to the rider alone, labelled as you against
you, comparing the current ride to that rider's own previous attempts. Just
Ride has no leaderboard at all, and there are controls to block members and
hide tags. **[snippet]**

**Solves:** the thing a leaderboard is for, which is a reference point,
without ranking persons.

**Taken:** the only comparison surface in this product is a person against
their own record, and it is already built at `ui/record.js:47` to `:115`. That
is the leaderboard, and section 3 argues it is the only one that can ship.

### 1.8 Death Stranding's likes. Taken in shape.

Appreciation is the only social quantity. It cannot be spent, it cannot be
taken away, there is no negative, and nobody is ranked by it. **[mechanic]**

**Solves:** the feeling of not being alone, with no comparison.

**Taken in shape:** one aggregate number, all the ground everybody has opened,
printed as a scale and not as a position. No individuals, no rows, no rank.
See 2.8.

### 1.9 Fortnite Save the World's X-Ray llamas. Taken, and it is the answer to the box.

In January 2019 Epic replaced blind purchased llamas with llamas whose exact
contents are shown before purchase, one at a time, with the store refreshing
if the player does not want what is on offer. **[snippet]**

**Solves:** the box ceremony survives and the gamble does not. The company
that runs the largest such store on earth removed the blindness voluntarily.

**Taken:** the counter shows the quantity and the price before the purchase,
one purchase at a time, with no bulk buy and no obscured contents. See 3.5.

### 1.10 Gacha pity and disclosure. Refused, and the refusal is the point.

Genshin's hard pity is 90 wishes on the character banner and 80 on the weapon
banner, soft pity is community measured and not officially described, and
China has required publishers to disclose chance based drop probabilities
since 2016, which is why a probability button now sits beside almost every
banner. **[snippet]**

**Solves:** it bounds the worst case for the player. It is harm reduction on a
mechanic, not a safe mechanic.

**Refused:** a published probability is a disclosure that the product is
running a lottery. This product speaks mechanically about what is in a person's
body. It does not run a lottery and then print the odds.

### 1.11 The Belgian and Dutch loot box rulings. Decisive.

The Belgian Gaming Commission ruled in April 2018 that paid loot boxes
constitute gambling under the Gambling Act of 7 May 1999, having found the
four elements of a game of chance present: a game, a wager, chance, and a
prize that can influence progression, with non compliance exposed to criminal
prosecution and fines reported up to 800,000 euro. The Netherlands classified
paid loot boxes as illegal gambling, and a later court reversed a fine against
one publisher on the ground that the mechanic was integrated into gameplay
rather than sold as a standalone product. **[snippet]**

**Why it decides this case and not only the general one.** The Belgian test
asks whether the random prize can influence progression. In this product the
prize would be patterns, patterns open ground, and ground is what the markers
measure and what the plan sells. A paid random pattern is a wager whose prize
is progression, by the product's own definition of progression. See 3.5.

### 1.12 Battle passes. Refused.

Seasonal passes expire and unearned rewards are lost, which is the documented
source of the pressure players report. Halo Infinite's passes do not expire
and Overwatch removed the seasonal limit on some past passes to reduce it.
**[snippet]**

**Refused:** nothing in this product expires. The allowance is a rate of
supply, not a reward that evaporates, and the difference has to survive into
the copy: print what is available, never a countdown.

### 1.13 Slay the Spire's run summary and Hades' God Mode. Taken in part.

Slay the Spire prints an itemised account after the run, not during it.
**[mechanic]** Hades' God Mode is an opt in damage resistance that increases
each time the player dies, described plainly and never announced as a
consolation. **[mechanic]**

**Solves:** an honest ledger delivered after the fact rather than a reward
dangled in front of the work, which is exactly the contingency class the Deci
finding in `RESEARCH-ladder.md` attaches undermining to. And an assist that
scales with difficulty without naming the person as failing.

**Taken:** the firsts are printed after the run, at the point
`ui/release.js:96` to `:111` already renders the done card. And the crisis
floor in section 4 is God Mode's shape: it engages quietly, it is not
announced as charity, and it is not a discount offer.

---

# 2. One system. The ledger.

## 2.1 The name, and the three words that are already taken

**The system is called the ledger.** A ledger is a record of events that
happened. That is the distinction `RESEARCH-ladder.md` section 5 draws and it
is what makes this whole design legal under the product's own rulings: a
reading is about the person and may not be counted, a ledger is about the work
and may.

Three collisions have to be settled before a word is put on a surface, because
`DESIGN-ia.md` section 2 has already measured what it costs when they are not.

| Word | Already means | So the new thing is called |
|---|---|---|
| tier | the coherence band, `canon.js:213`, and `DESIGN-ia.md:362` reserves the word | **plan**. The paid ladder is a plan, never a tier |
| store | the storage binding, `schema.js:94`, and the quiz record store in `DECISIONS.md` | **the counter**. Where patterns are bought |
| record | the snapshot surface, `ui/record.js`, and the off device quiz record | **the ledger**. The progression system and its surface |

`ledger` appears once in `atuned_src`, at `engine/intake.js:16`, inside the
prose hint "give without a ledger". That is a sentence and not a label, and it
stays, on the precedent `DESIGN-ia.md:391` sets for "letting go".

**Banned from every surface, and enforceable.** points, XP, score, level,
badge, achievement, trophy, streak, coin, gem, token, loot, box, spin, prize,
rank, leaderboard. `tools/terms.py` already pulls every user visible string
and checks synonym sets, so this list goes in its `SETS` dictionary as one
more set and the gate fails if any of them lands.

## 2.2 One currency. Patterns.

There is exactly one currency and it is the one `DECISIONS.md:28` already
rules: a pattern is one sentence, one release line delivered. Nothing else is
a currency. There is no second unit that buys anything, converts into
anything, or accumulates.

Four quantities exist beside it and none of them is a currency, because
nothing can be bought with them and nothing prices anything in them.

| Quantity | What it is | Direction | Source |
|---|---|---|---|
| patterns available | supply the product owes the person | up when granted, down when new ground opens | stored, one integer |
| ground opened | unique keys the person has ever opened | up only | `meter.unique`, `schema.js:36` |
| lines spoken | every line ever said, reruns included | up only | `meter.lines` |
| firsts | dated facts about ground | up only, never removable | `meter.firsts`, `schema.js:319` |

The markers are not a quantity. They are six fixed distances printed on the
same ruler as ground opened, `schema.js:278`.

## 2.3 What feeds what. The whole spine in one table.

Every arrow in this table exists in code today or is a named addition in
section 5. Nothing else writes to the ledger.

| Act | Writes | Where |
|---|---|---|
| a release run finishes | `lines += every line`, `unique += new keys only`, `firsts` for each new address and seat, a snapshot | `ui/release.js:50` to `:70`, `meterRun` at `schema.js:245` |
| the same run again | `lines` only. Costs nothing, forever | `schema.js:253`, tested at `tests/engine.js:271` to `:275` |
| density marked at an address | `kept += that address` | new, section 5 |
| the gift at sign up | `supply.granted += 100` once | `DECISIONS.md:9`, `giftLeft` at `schema.js:298` |
| a week or a month elapsing | `supply.granted += the plan rate` | new, section 5 |
| a purchase at the counter | `supply.granted += the block bought` | new, at the network seam |
| a friend joining | `supply.granted += 25` to the joiner, the ruled credit to the inviter | `DECISIONS.md:12` and the new ruling |
| nothing at all | can reduce ground, lines, firsts or a marker reached | by construction |

**Read the last row as a contract.** Four of the five progression quantities
are monotone. The fifth, patterns available, is a supply the product owes and
is printed as what is available rather than as what has been used, per
`RESEARCH-ladder.md` section 6.2.

**The one surface.** One place renders all of it, and it is the ledger. It
holds, in this order: ground opened and lines spoken as one sentence, patterns
available as one sentence, the firsts as a dated list, the next marker as one
distance, and the record's own comparison strip which already exists. Five
blocks, one surface, no tabs inside it. `ui/record.js:80` to `:85` is already
the first block and `ui/analytics.js:163` is already hosting the last one.

## 2.4 Earned, bought, given, and never either

| Earned, by doing the work | Bought, with money | Given | Never bought and never given |
|---|---|---|---|
| ground opened | patterns available, in printed blocks | the gift of 100 | a first. It has a date and the date is either true or it is not |
| lines spoken | the plan's monthly rate | 25 patterns to a person who joins on an invite | a marker reached. Money buys the chance to do the work, never the fact |
| a first | the plan's scope of sight, per `DECISIONS.md:15` | the ruled credit to whoever invited them | the reading, the band, the accuracy, the record's dates |
| a marker reached, through kept ground | nothing else | nothing else | sight of another person's data. That is consent, and only consent |

**The one thing money buys is supply.** Not a first, not a marker, not a
surface, not a rank, not a shortcut. `DECISIONS.md:24` already puts the pain
map and the tools on all four plans, and this design adds that the whole
ledger is on all four as well. A person on the free plan sees every one of
their own facts.

## 2.5 The badges. They are the firsts, and they are already written.

There is no badge system, because `meter.firsts` is one. It is finite, dated,
deduplicated at `schema.js:323` to `:324`, validated at the boundary at
`:211` to `:221`, and it survives an import. Render rules, all inherited from
`RESEARCH-ladder.md` section 6.4:

- A dated list, newest last. Nothing not yet true appears. An empty slot is a
  demand and there are no empty slots.
- No rarity, no count of how many exist, no progress toward the ones absent.
- The label names ground and seat, never the person.
  `ui/release.js:62` already writes `Fear, Root` and `:66` writes
  `first release at the throat`.
- The word "first" is allowed as sequence. It is the one place a superlative
  is a description.

Copy, exactly as it should read:

> **Firsts**
> 14 Mar. First line spoken.
> 2 Apr. First release at the heart.
> 19 Apr. Fear, Root.

**Add to the set, finitely.** The set is the one `RESEARCH-ladder.md` lists,
roughly twenty one facts, plus two the code can already detect and does not:
the first opposite installed at an address, readable from `n.pole` at
`engine/compute.js:57`, and the first sweep, meaning every channel run at one
address in one pass, which `release.js:53` already knows because it builds
every channel key in one loop. Nothing beyond the finite set. An endless
ladder is a treadmill.

## 2.6 The markers. A ruler, and it reads kept ground.

`meterRead` already returns every marker with its distance and the next one
only, at `schema.js:304` to `:310`, and the comment at `:265` to `:277`
already forbids gating anything behind one. Four rules hold, unchanged from
`RESEARCH-ladder.md` section 6.3: never a gate, print the count and never a
claim about the person, no graphic that reads as a trophy, and `cleared` stays
unrendered.

One change, and it is the structural fix for the buyable marker. **A marker
counts kept ground, not opened ground.** See 3.3.

Copy:

> **The Ruler**
> Ground opened, all time. 218.
> Next marker, Buddha nature, at 2500. It is a count of ground opened. It is
> not an attainment about you.

That last sentence is `PANEL-10k.md`'s own recommended line for segment 16,
the 300 people whose tradition warned them about scores. It is the only
sentence that does not make it worse for them, and it is true, so it ships as
part of the surface rather than as a footnote.

## 2.7 The allowance, the gift and the counter

The gift is ruled: 100 patterns, everything visible, then it reverts
(`DECISIONS.md:9`). `giftLeft` and `inGift` are built at `schema.js:298`. It
is also, without being designed as one, the strongest available form of the
endowed progress effect, because the progress is real and the person owns it.

Four copy rules, and the fourth is the one that decides whether the wall reads
as a limit or a refusal:

1. Print what is available. Never what was used up.
2. One statement when it runs low. No countdown, no escalation, no red.
3. Nothing expires. The bank holds at most two cycles of unaccrued allowance
   and then stops growing, and that is never printed as a loss because
   nothing was taken.
4. The wall carries the free rerun, because the code guarantees it at
   `schema.js:253`.

> Ten new patterns a week on the free plan. Anything already opened runs again
> as often as you want, at no cost.

**The counter.** One purpose: it sells patterns. Blocks, at a printed price,
quantity and price visible before the purchase, one purchase at a time, no
bulk button, no bundle that disappears, no discount clock. It sells nothing
else: not themes, not density, not a surface, not a marker, not a first.
Themes and density are accessibility controls and are free on every plan.

Price from the anchors and not from the pattern counts, per the
`PANEL-10k.md` director note: the volume rung near 12, the working rung near
29, the practitioner rung near 59. Patterns per month stay as the mechanism
and stop being the pricing story, which also removes the invitation to divide
a lifetime horizon by a monthly rate.

**One hard layout rule from the panel:** the horizon estimate and the plan
rate never appear on the same screen. 790 people in the two most
arithmetically inclined segments will run the division and publish it.

## 2.8 The comparison surface

Three things ship and one does not.

**You against you.** `ui/record.js` already is this. Two snapshots, the
distance between them, and the sentence at `:104` to `:107` that what moved
them is not in this record. Peloton's own label for the same idea is "it is
you vs you".

**The field.** One number: all the ground everybody has ever opened, printed
as one sentence, refreshed at the sign in seam. No individuals, no rows, no
rank, no position, no percentile. It carries the only thing a leaderboard
actually delivers to a person in this product's audience, which is scale.

> The field. 4.1 million patterns run, all people, all time.

That is one integer off device. It is not a list, so there is nothing to rank
and nothing to leak.

**The practitioner panel.** Already ruled at `DECISIONS.md:119` to `:133`.
Explicit consent, a visible list of who has sight, revocation on the row. It
is the only place one human sees another's ledger, and it is a consented one
to one relationship, not a precedent for a feed.

**Not shipping: a ranked list of people.** Argued in 3.4.

## 2.9 The referral

The owner's ruling: the friend gets 25 patterns, "it is like three therapy
sessions", and the chain continues, so a friend of a friend pays again.
`DECISIONS.md:12` already rules that sharing earns 10 per person who joins.

The design:

| Event | Credit | To |
|---|---|---|
| a person joins on an invite | 25 patterns | the joiner, immediately |
| that person opens their first ground | 10 patterns | whoever invited them |
| a person they invited opens their first ground | 10 patterns | the original inviter, once |
| any deeper generation | nothing | recommended against, see below |

**Why the credit to the inviter waits for the joiner's first release, and why
the inviter is never told it is waiting.** The FTC's own line on multi tier
programmes is that reward has to attach to genuine product use rather than to
headcount, and that guidance notes a network selling health products warrants
more supervision than one selling fashion. **[snippet]** Crediting on a
signup pays for names. Crediting on first ground pays for a person who
actually used the thing. And the inviter is never shown why a credit has not
landed, because that sentence turns a friend into a target.

**Why depth is capped at two, which is a recommendation against part of the
ruling as stated.** An uncapped chain pays for recruitment as such, which is
the exact line the FTC draws, and the practical guardrails in that guidance
are to cap depth at two or three, tie reward to usage, and never charge to
join. **[snippet]** Two generations honours "it pays again" and stops before
the shape becomes a recruitment ladder in a product that reads distress. His
call, and this is the one place I would argue back.

**Three things the referral never does.** It never shows a count to anybody
else, it never confers a rank or a name like ambassador, and the share message
never contains a reading. That last one is not a style rule: `PANEL-10k.md`
finds that referral is the entry route for about half the panel, so the thing
that travels has to be safe to travel.

**A cap, because a credit is money.** Twenty credited joins in a month. Above
that the counter is the route, not the invite.

## 2.10 What the person actually sees, in order, on an ordinary day

1. The instrument. Unchanged. The wheel, the pain map, the imprints.
2. After a release: the done card, and one line at the bottom of it. "Ground
   opened, all time. 218 addresses and channels. 12 of them new today." Then
   any first, dated, plainly.
3. In the profile sheet: ground opened, patterns available, the next marker.
   Two of those three rows exist already at `ui/panels.js:272` to `:273`.
4. In the ledger: the five blocks from 2.3.

That is the whole system. There is no notification that names an absence, no
daily prompt, no counter of days, and nothing on any screen that a person can
lose.

---

# 3. The hard part

Five collisions between what the owner has asked for and what the product
refuses to do. Each one is resolved or refused, and the refusals are the
shorter section on purpose.

## 3.1 The product refuses to print a count against a total

A count against a total is a score with a denominator. The test, from
`RESEARCH-ladder.md` section 5: if the number went up, would printing it be
praise. If yes, it is not printed.

What that permits and forbids here:

- **Permitted:** patterns available against the allowance, because it measures
  what the product owes the person. `giftLeft` at `schema.js:298` is already
  this shape and is already correct.
- **Permitted:** ground opened, alone, with no denominator, exactly as
  `ui/record.js:80` to `:85` already prints it.
- **Permitted:** the distance to the next marker, because a distance is not a
  fraction.
- **Forbidden:** `cleared` at `schema.js:303`, the percentage of a person's
  own horizon. The engine may know it. The product does not say it.
- **Forbidden:** kept ground against opened ground. That reads as a failure
  rate on a person's own attention and it is the one new number this design
  creates that could become one. Kept is printed alone or not at all.
- **Forbidden:** any completion percentage over the 112 addresses. `accuracy`
  at `engine/compute.js:197` is the honest version and it already carries an
  interval.

## 3.2 The product refuses to claim causation

Nothing in the ledger may reference a reading moving. No first, no marker, no
line of copy anywhere in the system may be of the form "coherence up ten".
The reason is in the code's own comment at `ui/record.js:11` to `:16`: charge
deltas move with how a person happened to word a story, so a fall in charge is
not evidence on its own, while ground opened is, because a line was either
spoken at an address or it was not.

Two consequences that constrain the build:

- The firsts key off ground, never off a quotient crossing a threshold. The
  two additions in 2.5 obey this: an installed opposite is a state of an
  address, not a movement in a reading.
- `careState` in section 4 reads the arithmetic and not the band name, so the
  crisis path does not become a claim either, and a rename of the band words,
  which `PANEL-10k.md` makes the single largest commercial item in the file,
  does not break it.

## 3.3 A marker can be bought, because money buys the thing markers measure

This is the sharpest conflict in the brief and it is real. `DECISIONS.md:31`
rules that unique ground is what a plan buys. `schema.js:278` measures the
markers in unique ground. Therefore a person can sweep addresses they feel
nothing at and arrive at Buddha nature on a schedule set by their card.

The arithmetic, under statement keying, makes the size of the problem plain.
Buddha nature at 2500 is about three months on plan two and a bit over two
months on plan three. Ascension at 12000 is about ten months on plan three.
The whole marker ladder is inside a year and a half of paid use, and at the
panel's own price anchors that is roughly 90 dollars to the first marker.
Meanwhile the same marker is about five years on the free plan. A marker that
is three months paid and five years free is a receipt.

**The fix, and it is already ruled, just not for this.** `DECISIONS.md:38`
rules the density swipe: felt density, keep it, no density, let it go. Make
that the marker's qualifier.

- `meter.unique` keeps its meaning exactly. It is what the plan sells and what
  the allowance spends. Unchanged, and the pricing does not move.
- `meter.kept` is new. An address enters it when the person has marked density
  at it at least once.
- **The markers read kept. The allowance reads unique.**

What that buys: money buys the opportunity to open ground, and attention is
the only thing that moves a marker. A sweep of addresses that land on nothing
spends the allowance and moves no marker, which is the correct outcome and it
is also the one that stops the metric from attracting gaming, because the
metric no longer allocates anything that money can reach.

Four rules ride along with it:

1. **Nothing is gated behind a marker, ever.** Already in the comment at
   `schema.js:274` to `:277`. It is restated here because it is the obvious
   paywall win and somebody will propose it.
2. **The marker surface does not ship before the density swipe does.** Without
   density, a marker measures spending. `RESEARCH-ladder.md` section 8
   recommends this and this design makes it a build order dependency, section
   5.4.
3. **Density is never scored.** How much a person marks is not a number the
   product prints. It qualifies ground and nothing else.
4. **A marker prints the count and the name and nothing else.** Buddha nature
   and the rest are not neutral words and what reaching one makes somebody is
   not the app's to say. That is the owner's voice ruling and it stands.

This also closes an open item. `RESEARCH-ladder.md` section 8 asks whether
referral patterns should be distinguishable from bought patterns, since a
person could be gifted toward a marker by their friends. Under kept, they
cannot be, and the supply log keeps the source for a receipt rather than for a
status.

## 3.4 A leaderboard ranks people who handed a machine their distress

**Recommendation: do not build a ranked list of people. This is not a reversal
of the previous research, it is the same finding with the owner's new ruling
satisfied a different way.**

The owner's ruling was that the leaderboard, badges, achievements and the
scoreboard must be one system rather than four. This design satisfies that
ruling more strictly than four systems would, because all four collapse into
one object: the firsts are the badge shelf, the markers are the achievement
ladder, the ledger is the scoreboard, and the comparison surface is a person
against their own record. One data source, `meter`. One surface. That is one
system.

What the refusal rests on, stated once:

- The self determination literature finds competitive metrics generate anxiety
  and damage the sense of competence in health contexts, which is the thing the
  mechanic was meant to build.
- Fitbit killed Challenges, Adventures and open groups in March 2023, citing
  limited use. That is the closest available precedent for a social ladder in a
  health product and it is negative on both counts, cost and uptake.
- Instagram's like count test is the decisive one for sequencing: hiding a
  score already built did not depressurise the experience. The decision whether
  to print it at all is available now and will not be later.
- `PANEL-10k.md` puts the only segment that converts on comparison, executive
  readers, at 210 people and 0.1 percent of simulated revenue, and records that
  a comparison turns a diagnostic into a leaderboard and corrupts his own
  answers. The commercial case for the mechanic is 0.1 percent of revenue
  against the product's whole posture.

What ships instead is in 2.8: you against you, one aggregate field number with
no people in it, and the consented practitioner panel. If a person wants
another person to see their ledger, the route already exists and it is consent
with a revocation control, not a list.

**One shape to refuse explicitly, because it will be proposed as the friendly
version.** A private group of friends who can see each other's ground opened
is a leaderboard with four rows. It is worse than a public one, because the
people in it know each other and can read a number that moves with somatic
distress. If the owner wants it, the only safe construction is the
practitioner grant applied symmetrically: explicit, listed, revocable, and no
numbers unless both sides have granted.

## 3.5 A loot box is a paid random reward, and the prize here is progression

**Recommendation: do not sell a random pattern. Build the ceremony without the
gamble. Two designs below give the owner the box and the wheel.**

Why not, in one paragraph. The Belgian test for a game of chance is a game, a
wager, chance, and a prize that can influence progression. A box that costs
money and returns a random quantity of patterns satisfies all four by this
product's own definitions, because patterns open ground, ground is what the
plan sells and what the markers measure. `RESEARCH-ladder.md` already rejected
variable reward on its own advocates' description of it as a gambling
schedule, and that finding is not weakened by the mechanic being popular. And
an instrument does not surprise you. The voice ruling and the regulatory
posture point the same way here, which is rare and worth using.

**What ships instead, and it is already half built.**

**The deal.** `ui/games.js:46` to `:55` already shuffles a deck of twenty four
addresses drawn from the person's own field, deals them face down, and runs a
clock. That is the box opening ceremony, it exists, it is free, and the
randomness in it selects **which address is dealt**, never **how much a person
gets**. There is no dispersion in value, so there is no wager and no prize.
Give it the ceremony: the deal, the turn, the line, the card going down.
`ui/games.js:36` to `:44` already draws the pool from what is actually held,
so the deal is honest about the field it came from.

**The wheel.** The owner wants something that spins. Let it spin over
addresses, not over rewards. One spin selects the next address to run from the
person's own held set, weighted by nothing but what is carrying. The outcome
of a spin is always exactly one address and one run, so every spin is worth
the same and nothing is won. A person who does not want the address the wheel
gave them spins again, free, which is the X-Ray llama's store refresh with the
money taken out.

**And the one thing that must not be dressed as either.** Patterns are sold at
the counter, in printed blocks, at a printed price. If the owner wants the
purchase to feel like something, the ceremony belongs on the **use** of the
patterns and not on the **acquisition** of them. That is the whole difference
between this and a gacha banner.

## 3.6 The two collisions nobody has named yet

**A ceiling the markers are outside of.** Section 0.1. Until the pattern
ruling lands, the marker surface cannot be built honestly, because five of the
six distances are unreachable and the app would be printing a destination that
does not exist. This is the same defect `PANEL-10k.md` names for Mastery at CQ
90, and it is the second time the product has put an unreachable point at the
top of a ladder.

**Local clocks are free money.** An allowance that accrues on the device's
clock accrues as fast as a person moves their clock. Supply is a paid
entitlement, so accrual is authoritative at the one network seam and advisory
on the device. The device computes and displays, the record decides, and a
mismatch resolves to the record with a plain sentence through `status()` at
`ui/component.js:90`. Never silently, because this file already forbids lying
about what happened.

---

# 4. The crisis case

A person whose reading comes back Severe or Collapsed opens the app. The
engine hands those words down at `engine/data/canon.js:234` and `:238`, and
`PANEL-10k.md` measures that 2,673 of 10,000 in the reachable audience sit
below CQ 21, so this is not an edge case. A store, a ruler and a shelf of
firsts in front of a person in acute distress is the worst version of this
product.

## 4.1 The rule that decides every detail

**The product may hide what it sells. It may never hide what it measures.**

Everything below follows from that one line. The instrument stays whole: the
pain map, on all four plans per `DECISIONS.md:24`, the imprints, the release,
the record. What retracts is the commercial and comparative layer, because
that layer is the product asking for something from somebody who has nothing
to give it right now.

And nothing announces the state. `DECISIONS.md:226` rules that we are not
judging anybody. A sentence like "you seem to be in crisis" is a verdict
handed down by software with no standing. The surface is simply quieter, and
the person can reach everything they are entitled to.

## 4.2 The gate, in the engine, reading arithmetic and not words

A pure function, host free, in `engine/compute.js` beside `accuracy`:

    careState(r) -> 'ordinary' | 'high load' | 'acute'

It reads `r.CQ`, `r.DQ`, `r.loaded.length` and `r.excess`, never `r.tier`,
because the band names are under review as the largest commercial item in
`PANEL-10k.md` and a rename must not move a safety gate. It returns `acute` on
the arithmetic that currently produces Severe and Collapsed, and `high load`
one step above that.

Two additions that are not arithmetic:

- **A person may state it.** One control, always present, never hidden, that
  sets the state for this session. A person who says they are not okay is
  right, and the instrument does not argue with an input it asked for.
- **It never persists as a label.** The state is computed per session and is
  not written into the profile as a flag about a person. Nothing in the schema
  says somebody was in crisis in April.

## 4.3 What is on screen at acute

**Present, in this order.**

1. The pain map. One object, one action, the verb in the thumb arc, which is
   the fix `PANEL-10k.md` already costs at plus 21 payers for other reasons.
2. One address and one line. `canon.js:237` already carries the right register
   for this: one seat, one address, one line, not a programme. The engine's own
   `toward` string for Severe is the model for the whole surface.
3. The route out, with a number on it, before anything is sold. This is the
   `PANEL-10k.md` director note for the 180 people in segment 17, and it is
   built before any paid surface, not after.
4. The free rerun sentence, at the top of the release preview rather than at
   the bottom of a paywall. "Anything already opened runs again as often as you
   want, at no cost." `schema.js:253` guarantees it.

**Absent.**

The counter. The marker ruler. The firsts shelf. The field number. The plan
comparison. Any invite control. Any upsell of any kind. Not greyed out, not
disabled with a tooltip, because a disabled control still asks a question.
Absent from the render.

**Reachable, and labelled.** UX rule 10 forbids hiding a control with no
affordance. The ledger is one labelled control away, named plainly, so a
person who wants their own record gets it immediately. What is gone is the
selling, not the seeing.

**The one thing that must never happen.** The allowance running out in front
of somebody in this state. `PANEL-10k.md` and `RESEARCH-ladder.md` both name
it as the worst available outcome, because a paywall that reads as a refusal
to help arrives on the day the tool is most needed.

Two mitigations, the second of which is his call because it costs money.

1. **The rerun is free and the copy says so first.** Everything the person has
   already opened is available without limit. This is already true in code and
   is currently unsaid.
2. **The floor.** At `acute`, one address is always runnable regardless of
   supply. Not a gift, not a discount, not an emergency grant, and never
   announced as any of those. One sentence, mechanical: "One address is always
   open." It is funded as a cost of doing business, and the alternative is a
   product that stops working for the people it was built for at the moment it
   matters. Hades' God Mode is the shape: it engages quietly and it does not
   name the person as failing.

## 4.4 The return after an absence

Unchanged from `RESEARCH-ladder.md`, which designed this case explicitly, and
restated here only so the build has it in one place.

- The first surface is the reading and the pain map, not the ledger.
- Ground opened renders unchanged, because it is unchanged. Nine days cost it
  nothing.
- The gap is not mentioned. Not as a welcome back, not as a gentle note, not
  as a freeze that was helpfully applied. Naming the absence makes it a
  subject.
- No notification sent during the absence may reference it. A notification may
  name the practice. It may never name the gap.
- There is nothing to repair, because nothing broke and no all or nothing
  standard was held for the person to violate.

## 4.5 One more absence, on the practitioner side

`PANEL-10k.md` puts practitioners and the clients they refer at 600 people and
33.5 percent of simulated revenue. A practitioner looking at a client whose
reading is acute must not be shown that client's ledger as a performance. The
same rule applies on that panel: ground opened is a fact, and nothing on that
surface may rank one client against another or against a norm. A practitioner
panel with a sortable column of coherence is a leaderboard with a licence
attached.

---

# 5. Specified to build

`SCHEMA_V` is 2 at `engine/schema.js:13`. Everything below is additive and
lands as v3, and a v1 or v2 profile loads with the new fields filled from the
blank, which is the migration pattern the file already uses for gates at `:68`
and for renamed laws at `:62` to `:66`.

## 5.1 Schema additions

    /* v3. The ledger. Additive: a v2 profile has no plan, no supply and no
       kept ground, which reads as the free plan, the gift unspent, and no
       density marked. Saving upgrades it. */

    plan:{k:0, since:null},               /* 0 free, 1..4 paid. NEVER "tier" */
    supply:{granted:100,                  /* every pattern ever made available */
            accruedTo:null,               /* ISO, the end of the last accrual */
            log:[]},                      /* {t,n,src} src: gift|plan|counter|invite */
    refer:{code:'', joins:0},             /* a count. no names, ever */
    meter:{... kept:[]}                   /* address keys with density marked */

Four notes on the shapes.

**Spend is never stored.** `available = supply.granted - meter.unique.length`.
That is one subtraction and it makes the invariant "only new ground spends"
true by construction rather than by discipline, because `meter.unique` only
grows on new ground at `schema.js:253`.

**`supply.log` is bounded.** 400 entries, coalesced by month and source above
that. It exists for a receipt, not for a history.

**`refer.joins` is a count and holds no names.** The data ruling at
`DECISIONS.md:236` is the strongest in the file. A referral graph joined to
somatic self report is exactly the asset we promised not to hold.

**`meter.kept` holds address keys, not channel keys.** At most 112 entries, so
it costs nothing.

## 5.2 Validation, at the boundary

In `validateProfile`, `engine/schema.js:134` to `:237`, in the style already
there: typed, bounded, refused by name, never clamped.

- `plan.k` integer 0 to 4. Out of range is refused by name, not clamped,
  because a clamped plan is a person granted sight they did not buy.
- `supply.granted` integer 0 to 1e7. `supply.log` array, each entry typed like
  `meter.firsts` at `:211` to `:221`, capped at 400.
- `meter.kept` strings under 64 characters, **capped at 200 entries**.
- **And the fix `meter.unique` needs anyway**, from 0.4: cap the list at
  25,000 and refuse the excess by name. Measured: a saturated profile under
  statement keying is 178 KB, so the cap is generous.
- One blank meter factory, called from `:36`, `:51`, `:247` and `:321`, which
  closes 0.3.

Extend `tests/engine.js` section 15d, currently `:259` to `:332`, with: a
rerun does not spend supply, an accrual is idempotent across two calls at the
same timestamp, a marker does not move on opened ground that was never kept, a
v2 profile round trips with the new fields filled from the blank, and an
import of 30,000 keys is refused by name.

## 5.3 Engine seam. Host free, no `fetch`, per `CLAUDE.md`.

New pure functions in `engine/schema.js` beside the meter:

    planOf(p)                -> {k, nm, rate, cycle, sees}
    supplyAccrue(p, now)     -> {added, periods}   idempotent on accruedTo
    supplyGrant(p, n, src)   -> granted            one writer, logged
    supplyRead(p, now)       -> {available, granted, opened, inGift, giftLeft,
                                 rate, banked}
    meterKeep(p, addrKey)    -> bool               density marked at an address
    relCost(keys, p)         -> {newKeys, rerunKeys, cost, have, ok}

And two changes to what exists:

- `meterRead` gains `kept` and its `markers` read `kept` instead of `unique`.
  Its signature does not change, and `ui/record.js:49` and `ui/panels.js:264`
  keep working.
- `meterKey` gains a third argument if the pattern ruling lands on the
  statement: `meterKey(nodeId, chan, idx)`. The call at `ui/release.js:54` is
  the only site. The signature is backward compatible with the argument
  omitted, which keeps the port rule at `CLAUDE.md`.

In `engine/compute.js`, beside `accuracy` at `:197`:

    careState(r) -> 'ordinary' | 'high load' | 'acute'

**The one network seam stays one.** Purchases, accrual authority, the field
number and referral credits all resolve in the record fetched at sign in, and
`validateProfile` is its boundary, which `CLAUDE.md` already names as the
boundary's first real caller. No `fetch` in `engine/`.

**The gate before the run, not the apology after it.** `relCost` is called
when the release preview renders at `ui/release.js:112` to `:123`, which
currently prints only a duration. It prints the cost first:

> Four addresses. 12 new patterns, 4 already open and free. You have 88
> available.

And a run that exceeds supply does not start. It offers the free subset, which
is every key already in `meter.unique`, and says so. Atomic, like `pImport` at
`schema.js:330`: a run either has its supply or it does not begin, and a
failure reports through `status()` at `ui/component.js:90` and never claims
success it does not have.

## 5.4 Build order. Each item ships alone.

**Blocked on the owner, and it blocks item 7 only.** The pattern ruling,
`DECISIONS.md:52`, and with it the marker scale. Items 1 to 6 do not depend on
it.

1. **Surface the ledger.** No new data, no schema change. `meterRead` is
   called in two places today. Print ground opened and lines spoken at the end
   of a release, in the words `ui/record.js:80` to `:85` already uses. Per
   Harkin, making the record visible is the best evidenced mechanism in the
   whole research file, and it costs a render.
2. **The firsts shelf.** Data exists, written at `ui/release.js:60` to `:67`
   and validated at `schema.js:211`. A dated list, no empty slots, in the
   ledger surface.
3. **The if then plan on the ritual.** The highest evidence item in
   `RESEARCH-ladder.md`, d = 0.65, and `ui/ritual.js:69` to `:74` is already
   three quarters of it. Add a when and a where in the person's own words and
   print the plan back on the next open. It also closes the thing
   `DECISIONS.md` names: the log is written and nothing reads it back.
4. **The blank meter factory and the boundary caps.** Items 0.3 and 0.4. Small,
   and they protect everything above.
5. **Supply.** `plan`, `supply`, accrual, `relCost`, the preview line, the wall
   copy with the free rerun. The schema bump lands here.
6. **The density swipe.** `DECISIONS.md:38`, writing `meter.kept`. It is a
   product feature in its own right and it is the prerequisite for the markers.
7. **The marker ruler.** After 6, and after the pattern ruling. Not before
   either, per 3.3.
8. **The counter.** After sign in exists, because a purchase needs the seam.
9. **The invite.** After the counter, capped at two generations, no public
   counts, no reading in the share message.
10. **The crisis path.** `careState` and the suppression rules land with item
    5, because item 5 is the first thing that puts a price in front of
    somebody. The route out for segment 17 lands before item 8, per the panel.
11. **The deal and the wheel as ceremony.** Free, and `ui/games.js` is already
    most of it.

**Never.** A ranked list of people. A paid random reward. A consecutive day
streak or any counter that resets. A notification that names an absence. A
marker as a gate. A percentage of a person's own horizon.

---

# 6. The two gates, run on this design

**Innovation audit: the ledger**
**Verdict: INSPIRED (86%)**

    Core Loop:         9/10   run, ground opens, a fact is dated, the field changes
    Progression:       9/10   markers span years and nothing can be lost
    Variable Reward:   4/10   refused deliberately. The deal varies content, not value
    Novel Interaction: 8/10   a wheel that selects an address rather than a prize
    Visual Invention:  8/10   the ruler and the field ride the existing wheel language
    Data as Story:     9/10   a dated list of firsts is the record as narrative
    Ceremony:          8/10   the deal and the done card carry it, unpaid
    Social Proof:      7/10   one aggregate number, no people. Deliberately capped
    Flow State:        9/10   cost stated before the run, no gate mid run
    Switchability:     9/10   the ledger is the person's own history and cannot be rebuilt
    TOTAL:             86/100

    OPPORTUNITIES
    - The firsts set is finite at about twenty three facts. Name all of them once
      and freeze the list, so nobody adds a twenty fourth under pressure.
    - The deal has a clock and no record. Store nothing, but print the last time.
    - The field number is one integer and could carry the seats. Do not, yet.

    NEXT: the if then plan on the ritual. Largest effect, smallest build.

**Ship review: the progression system as specified**
**Verdict: HOLD (84%)**

    ICP Alignment:     9/10    Monetization:      7/10
    First-Touch:       8/10    Retention:         9/10
    Core Loop:         9/10    Referral:          9/10
    Emotional:         8/10    Visual/Kinetic:    8/10
    Behavioral Flow:   9/10    Technical:         8/10
    TOTAL:             84/100

    SUMMARY: The spine is right and it is mostly already built. Two things
    hold it. The markers point at distances outside the meter's key space, so
    the headline progression surface cannot be printed honestly yet. And the
    price still rides the pattern count, which the panel says loses either the
    volume half of the audience or the paying half.

    DIRECTOR NOTES
    - [Owner] Rule the pattern question. It is the only thing blocking the
      marker surface and it moves the price by a factor of two hundred.
    - [Owner] The floor at acute costs money. Rule it before the counter ships.
    - [Owner] Referral depth. The design caps at two generations and argues it.
    - [PL] Price from the therapy, coaching and app anchors, not from patterns
      per month.
    - [TD] One blank meter factory, and cap `meter.unique` at the boundary.
    - [TD] `careState` reads arithmetic, never the band name.

---

# 7. Open, and whose call

- **Is a pattern a statement or a card.** `DECISIONS.md:52`. Blocks the marker
  surface and the printed allowance. Everything in section 0 argues for the
  statement.
- **The marker scale, if the keying does not move.** Either the key space
  grows or the six distances come down by about a factor of fifty. His, because
  the numbers are his.
- **The floor at acute.** One address always open. It costs money and it is the
  one place the paywall must yield.
- **Referral depth.** Capped at two here, against a ruling that says the chain
  continues.
- **Whether the field number ships at all.** It is one integer off device and
  the product currently has no off device anything except the planned record.
- **Plan one, 400 a month or 100 a week.** `DECISIONS.md:187`, still open, and
  the allowance copy cannot be written until it lands.
- **The band names.** Not this design's to settle, and `careState` is built so
  that settling them changes nothing here.
