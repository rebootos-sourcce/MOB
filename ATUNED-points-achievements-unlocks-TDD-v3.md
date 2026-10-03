# Atüned points, marks and unlocks
## Technical design document, implementation handoff, version 3

**Product:** Atüned
**System:** points, marks (the product's word for an achievement), the streak, the turn, unlocks
**Status:** build specification. Decided, except where section 30 names an item as the owner's and already open
**Written:** 2 October 2026, round QA, against `claude/laughing-feynman-xhfyj3` at `f2fd8ff`
**Builds on:** `ATUNED-points-achievements-unlocks-TDD-v2.md` (the owner's own handoff, saved 1 October, whose header says version 1.0), `POINTS-AUDIT.md` (the review of v2 against the code), `DESIGN-ladder.md` with its prototype `proto/ladder/turn.js`, and the rulings quoted in section 2

---

# 0. How to read this document

**What this is.** The owner asked on 2 October, round QA: "The achievements, you
have a new TDD, review that." The new TDD is his v2. It was reviewed on 1 October
in `POINTS-AUDIT.md`, which classed 72 requirements against the code and ended
in twelve open questions. Nothing since had turned that review into one
document a builder can build from, end to end. This is that document. Where v2,
the audit and `DESIGN-ladder.md` disagree, this file says which one wins and why,
and section 29 walks v2 section by section so nothing of his is lost by omission.

**What this is not.** It is not code. No file under `atuned_src/` changes with it.
It is not a replacement for v2: v2 stays as his record of what he asked for.

**A correction to the record, said first.** `WAITING-ON-YOU.md` item 18 told the
owner "no TDD exists yet". That was wrong: his own v2 existed and had been
audited. What did not exist was this, the build specification reconciled
against the code and his later rulings.

**Counts are not typed here.** This repository records twelve times that a number
typed into a document goes stale the day the product grows past it. Where a
count matters, the command that reads it is given instead. The few figures that
are typed are dated and say where they came from.

**Plain words.** Every term of art gets its plain meaning in the sentence that
first uses it (round PO, "unpack every symbol"). Section 4 is the full list.

---

# 1. Executive architecture

## 1.1 The core loop, in one sentence

> **A person does a thing in the loop, the record already holds it, and the
> instrument says once, after the fact, what that thing earned, and never takes
> it back.**

The loop is the owner's: discover, play, flow, embody, drawn as a circle. Points
and marks exist to keep it turning (his words, TASKS LD1: "the gamification
exists to keep that turning"). Every feature below is measured against that
sentence. A feature that only works because leaving is punished does not ship.

## 1.2 The one architectural rule

> **Derive everything. Store only the facts that can no longer be derived once
> the record changes under them.**

The record already holds every act: story entries, ritual entries, the opened
ground, the dated firsts, the readings. Events, counters, the streak, the turn
and "which marks are true right now" are all pure reads of that record, and none
of them is stored. Two things cannot be derived after the fact, because the
record they came from can be corrected or deleted:

1. **That a point was credited.** If a ritual day is later deleted, a read of the
   record can no longer see it, but the owner ruled the point stays.
2. **That a mark was earned, and when.** If an axis falls back, a read of the
   record says the mark is false now, but v2 rule 27.6 says marks do not expire.

So exactly those two are stored, in one new top level field, `p.progress`.
Nothing else is. This is the split `POINTS-AUDIT.md` section 5 recommended, and it
agrees with the architecture review's verdict (`REVIEW-arch/TALLY.md`, round PK):
"no second store (a derived view instead)". The credits and the marks are not a
second store of events. They are receipts.

## 1.3 The shape

```text
THE RECORD (already stored, already validated)
  story entries, ritual entries, meter.unique, meter.firsts, history, axes, intake
        |
        |  pure reads, nothing stored
        v
EVENTS            progressEvents(p, now)     deterministic ids
COUNTERS          ledgerRead, streakRead, turnRead
MARKS TRUE NOW    markTest(p, now)
        |
        |  settle: compare with what is already stored, append only
        v
P.PROGRESS (new, stored, append only)
  credits   one per credited event id, with its points, never removed
  marks     one per earned mark key, with its date, never removed
  seen      one per introduction shown, never removed
        |
        |  pure reads
        v
POINTS    sum of credits          never goes down
MARKS     the stored set          never shrinks
NEXT      one unearned mark       never a list
```

Readings (CQ, the band, the avatar, node state) sit beside this and never inside
it. A reading is what is true of a person now. The record is what they did. v2
section 4: "CQ is not Points. Points are not Worth." That line is kept and
enforced by a gate (section 25).

---

# 2. What is already settled, and by whom

Each line is a ruling or a measurement this design takes as given. Quoted, with
where it is recorded.

| Settled | His words or the record | Where |
|---|---|---|
| Points never go down | "You just don't get points for the day, or for that particular thing that you didn't do." | `DECISIONS.md`, round OI |
| Points exist, and only rise | "Copy that on no points. Run with it." Recorded as: points only rise; whether they can ever buy patterns waits for accounts | `DECISIONS.md`, round OJ |
| Sight by tier is real | "tier one can see saboteurs, tier two can see saboteurs and complexes, tier three and four can see hyper complexes on" | `DECISIONS.md`, rounds OJ and OK |
| The loop is a circle | "we're showing a core game loop mechanic" | `CLAUDE.md`, ruled 20 September |
| A reading is never a score; no count against a total | the ladder's own header, and the standing rule | `engine/ladder.js` 4 to 16 |
| The run halves, it does not reset | `Math.max(1, Math.ceil(s/2))` with one grace day | Bible 1133, `engine/ladder.js` 55 to 77 |
| A zero is a dash | "'0 days', '0.0', '0%' and 'Commit 0' are out" | `COPY.md`, round J13 |
| No stages, no day numbers, nothing stored that can be derived | "no second store (a derived view instead), no stages or days" | `REVIEW-arch/TALLY.md`, round PK |
| The loop ring never changes with time; the date of the last act is written beside it | ruling 3 of pass 3 | `REVIEW-arch/TALLY.md` |
| While care holds, locks and the ladder stay gone | ruling 1 of pass 3 ("care" is the state the product enters when a story reads as distress) | `REVIEW-arch/TALLY.md` |
| On a downgrade, opened ground is kept, points included | "OPENED GROUND is kept (opened addresses, reruns, journal, history, points)" | `PLAN.md` J11 |
| Seats decide and ask at most one question, only when blocked | "super brain fatigue from all your questions" | `DECISIONS.md`, round PD |
| The marks count days practised, distinct addresses and distinct story days | LD3 and LD4, designed and measured, not yet built | `TASKS.md` LD3, LD4; `DESIGN-ladder.md` 1.4 |
| One closed circle is one turn | LD1, checked | `TASKS.md` LD1 |

---

# 3. What exists in the code today

Read at `f2fd8ff`. A line number is a place to start reading, not a promise.

| Piece | What it does now | Where |
|---|---|---|
| `pracDay(t)` | a local calendar day key from a stored ISO stamp | `engine/ladder.js` 27 |
| `pracDays(p)` | distinct days with a ritual, newest first. **Fixed tonight for 21.J2:** skips an entry whose `done` is exactly `false` | `engine/ladder.js` 37 to 42 |
| `streakRead(p, now)` | `run` (halving), `best` (strict row), `live`, `last`, `days`, `gap` | `engine/ladder.js` 52 to 81 |
| `ledgerRead(p)` | minutes done and planned, rituals saved, lines, ground, axes clear and carrying, snapshots | `engine/ladder.js` 90 to 113 |
| `MARKS` | sixteen marks in three families, each a test function, an icon path and a seat | `engine/ladder.js` 166 to 234 |
| `ladderRead(p, now)` | which marks are true right now, and one next mark | `engine/ladder.js` 242 to 250 |
| `meterFirst(p, key, label)` | a dated first, once per key, stored on `p.meter.firsts` | `engine/schema.js` 1642 |
| `ladderHtml()` | the record on the Compass: streak, ledger, marks, next | `ui/cone.js` 3321 |
| `MARK2`, `turnRead` | the corrected marks (22) and the turn, designed and measured, prototype only | `proto/ladder/turn.js` |
| `validateProfile(o)` | the boundary. Runs on import **and on every stored record at boot** (`pStore`, `engine/schema.js` 451). A refused stored record is kept on disk and not loaded | `engine/schema.js` 858 |
| undo | restores charges, opposites, laws, `p.work` and the soul. Never the meter, the story, the rituals or anything else | `engine/undo.js` 82 to 126 |
| Daily Summary engine | frozen days and aim events on `p.summaries`; refuses the words points and streak in its own sentences as loss language (`DLY_LOSS`) | `engine/daily.js` 110 |

**What is still wrong in the shipped ladder, measured or read:**

- `first` (First run) tests `l.rituals>=1`, which counts every entry, so pressing
  Start on a ritual and never finishing it still earns First run. 21.J2 named this
  ("First run reads done entries") and tonight's fix did not reach it. The
  prototype's `MARK2` carries the same test. **Open, slice 0.**
- `week`, `month`, `season` test `best`, the strict row. Twice a week for ninety
  days earns none of them (LD3, measured).
- `ten` and `fifty` count thought lines and say addresses (LD4, measured).
- `kept` counts entries, so ten entries in ten minutes earns it (LD4, probe X3).
- A future dated ritual counts toward the streak (probe X7).
- Every mark is recomputed on every read, so a mark vanishes when its state falls
  (probes X9, X10).
- `validateProfile` drops an unknown top level key without a word (probe X11), so a
  `p.progress` written before its validator exists is deleted on the next load.
- `ladderHtml` prints "The run ended N days ago", which names an absence. The
  ladder's own anti design rule 5 forbids that (`DESIGN-ladder.md` section 4).

---

# 4. Vocabulary. One word per concept, each with its plain meaning

| Word | Plain meaning | Stored or derived |
|---|---|---|
| **record** | everything a person entered or did, held in their browser | stored, already |
| **reading** | what the instrument computes is true of a person right now (CQ, the band, the body) | derived, already |
| **event** | one thing that happened, read off the record, with an id that is the same on every read | derived |
| **point** | one unit of credit for one thing done. Points add up and never go down | the sum is derived |
| **credit** | the stored receipt that says one event was paid, how much, and when | stored |
| **mark** | a named fact about what a person did, earned once and kept for good. The engine word for an achievement or badge | the set is stored |
| **family** | the quarter of the loop a mark belongs to, which decides its seat colour | derived from the definition |
| **next mark** | the one unearned mark nearest to what the person is already doing. Never a list | derived |
| **days practised** | how many separate days have a ritual marked done | derived |
| **streak** | the ruled one word label for the run | derived |
| **run** | days practised counted forward with one free day of grace, halved by a longer gap | derived |
| **turn** | one trip all the way round discover, play, flow and embody | derived |
| **introduction** | a one time card the first time a layer the person can already see has something in it. It shows, it never withholds | the fact it was shown is stored |
| **settle** | the moment the engine compares what is true now with what is stored, and appends any new credit or mark | an action |
| **example record** | a fixed sample record shown beside a worked example person, never the person's own | derived from a fixture |

The UI word for a mark is the owner's open item (`PLAN.md` H, question 9: "the
word (marks or achievements)"). The engine word is `mark` and is not renamed. The
surface reads its word from one constant, `PG_MARK_WORD`, the way the Daily
Summary reads `DLY_AIM_WORD`, so his ruling is a one line change.

---

# 5. The loop, the session and the week

Three passes, in the order this seat works: loop, then session, then week.

## 5.1 The loop

Each quarter of the circle has one thing that pays, and paying never depends on
the other three:

| Quarter | Act | Pays | Why it is this act |
|---|---|---|---|
| Discover | a story that reads at least one place in the body | 2 points, once a day | one per day, so ten entries in ten minutes pay what one entry pays |
| Play | the first release at an address | 5 points, once per address, at most 112 addresses | a place opened is a place opened; a rerun opens nothing new and pays nothing |
| Flow | a day with a ritual marked done | 5 points, once a day | done, never set (21.J2) |
| Embody | a reading on file | nothing | a reading is never a score. Embody earns marks, never points |

The turn is drawn as a ring and counted by marks (First turn, Ten turns). It
earns no points of its own, because `DESIGN-ladder.md` 2.5 is right: "the moment
a turn buys something, closing one becomes a transaction and the loop becomes a
grind."

## 5.2 The session

**The two minute visit.** Open, mark today's ritual done, close. That is 5 points
and a credit dated today, and if it is the seventh day practised, the Seven days
mark. Nothing about the visit is short of anything. The surface never says what
a longer visit would have earned.

**The twenty minute visit.** Write a story, run a release, mark a ritual done.
At most 7 points from the day's acts plus 5 per new address. Nothing beyond that
is reachable by staying longer, so there is no reason to stay past the point the
work is done. That is the rule this seat holds every mechanic to: **a person must
be able to stop and be glad they used it.**

**The first session.** Minute by minute is the onboarding seat's
(`ATUNED-onboarding-first-experience-TDD.md`, and `PLAN.md` X1: "achievements
hidden at first"). What this system owes it: the first story that reads earns
First story and 2 points, the first release earns 5 points per address opened
and a dated first, and none of it is announced before it happens. The record
panel stays out of the first session (X1). The person meets their points the
first time they open the Compass, already earned.

## 5.3 The week, and day thirty

A twice a week person, the cadence `DESIGN-gamification.md` costs its retention
case on, earns in a week: 2 ritual days (10 points), 2 story days (4), whatever new
addresses they opened. Over ninety days with a fortnight off, measured by
`DESIGN-ladder.md` 1.4 and 2.4 on the roster: 22 days practised, 14 to 15 marks,
and Seven days earned in the fourth week. Thirty days is not reachable inside
ninety days at that cadence, and the shelf does not say so: the next mark simply
names it. Before LD3 that person earned none of the day marks. That is the single largest
change this design makes to anyone's experience of the record.

The reason somebody opens it on day thirty is not the points. It is that the
record has started to be able to say something (the graph draws at two readings,
`DESIGN-ladder.md` 2.3) and the next mark is one honest step away.

---

# 6. Events

## 6.1 The shape

```js
/* derived, never stored. no userId: the record has no user and refuses one
   by name (engine/practice.js 100). An event belongs to the record that holds it. */
ProgressEvent = {
  id:   string,   // type prefix plus the record's own key. Same id on every read.
  type: string,   // one of PG_EVENTS below
  at:   string,   // ISO stamp of the act, read off the source entry
  day:  number,   // pracDay(at), the local calendar day key
  src:  string,   // where in the record it was read: 'rituals', 'story', 'firsts', 'history'
  ref:  string    // the key of the source entry, so the evidence drawer can find it
}
```

The id is the idempotency guarantee (v2 section 6: "the same event must never
award points twice"). It is built from the record's own key, so a second read
returns the same id and a second settle finds it already credited.

## 6.2 The events, version 1

| Type | Id | Read off | Rule |
|---|---|---|---|
| `ritual.day` | `rd:<day>` | `p.rituals` | a local day with at least one entry whose `done` is not `false` and whose day is not more than one day after `now` |
| `story.day` | `sd:<day>` | `p.story.entries` | a local day with at least one entry whose `imprints` is 1 or more (an imprint is a place in the body the story read). Same one day future rule |
| `address.first` | `ad:<n>` | `p.meter.firsts`, key `addr:<n>` | the first release at address `n`, 0 to 111. Dated by the first's own stamp |
| `seat.first` | `st:<seat>` | `p.meter.firsts`, key `seat:<seat>` | the first release at one of the seven seats. Feeds the Every seat opened mark; pays nothing |
| `reading` | `rg:<i>:<t>` | `p.history` | a snapshot on file. Feeds Ten readings and the turn; pays nothing |
| `turn.closed` | `tn:<n>` | `turnRead` | the nth closed circle. Feeds the turn marks; pays nothing |

The count of event types is read off the build, not typed:

    node -e "const E=require('/tmp/engine.js');console.log(E.PG_EVENTS.length)"

## 6.3 Events v2 named that version 1 does not emit, and why

| v2 event | Why not now | What unblocks it |
|---|---|---|
| `journal.entry.completed` | farmable one letter at a time (probe X3). Folded into `story.day` | nothing, by design |
| `ritual.completed` per entry | farmable up to the number of distinct step lists per day. Folded into `ritual.day` | nothing, by design |
| `protocol.completed`, `protocol.pattern.executed` | no protocol is ever finished in the code, and a pattern opened costs supply, so a point per pattern would track money spent (section 7.4) | a Practice writer that records a completed protocol, and a ruling |
| `fetter.released`, `node.completed` | `fetter` here means address (audit question 4, recommendation B); emitted as `address.first`. A finished node is undefined | a definition of finished |
| every `saboteur.*`, `complex.*`, `hypercomplex.*`, `mask.*`, `character.*` | these are readings rebuilt from charge on every call, with no id and no state (`engine/compute.js` 266 to 326) | the Becoming build giving them identity (section 13) |
| `cq.*` | a reading is never a score (section 13) | nothing, by design |
| `integration.verified` | self report of a self catch; paying it produces over reporting (`TASKS.md` SIG17) | nothing, by design |

---

# 7. Points

## 7.1 What a point is

A point is one unit of credit for one thing a person did, paid once, after the
fact, and never taken back. It is a count of acts, weighted by a fixed published
table. It is not a reading, not a currency yet, and not a measure of a person.

## 7.2 The rate table, version 1

```js
var PG_RATES=[
 /* index is the rule version. Append only: a new version is pushed, an old
    one is never edited, so every stored credit can be checked against the
    table it was paid under. */
 null,
 {'ritual.day':5, 'story.day':2, 'address.first':5}];
var PG_RULE=1;   /* the version new credits are paid under */
```

What each of v2's sixteen rows became:

| v2 row | v2 value | v3 | Reason |
|---|---:|---|---|
| Journal entry | 1 | folded into story day | farmable (X3) |
| Journal day | 1 | **story day, 2** | his two rows for a one entry day add to 2; that total is kept and the farmable half goes |
| Ritual completed | 5 | **ritual day, 5** | per day, not per entry: one press cannot be split into many |
| Fetter released | 5 | **address first, 5** | fetter read as address (audit question 4) |
| Protocol completed | 10 | deferred | no protocol is ever recorded as finished |
| Pattern executed in protocol | 1 | struck | a pattern costs supply, so it would pay people for paying (7.4) |
| Saboteur released | 15 | deferred | no saboteur entity (section 13) |
| Complex resolved | 30 | deferred | no complex entity; and paid by heaviness it is an award for carrying more (audit C8) |
| Hyper complex resolved | 75 | deferred | as above |
| Mask released | 50 | deferred | as above |
| Integration verified | 20 | struck | self report (SIG17) |
| CQ +1 verified | 1 | struck | v2's own rules 4, 27.10 and 36 |
| CQ +5, +10, +15, +20 | 5 to 20 | struck | as above; all 21 laws at 10 reads CQ 100 with nothing done (probe X13) |

## 7.3 The credit

```js
/* stored on p.progress.credits. One per event id, ever. */
Credit = {
  id: 'rd:20363',   // the event id. Unique in the list
  n:  5,            // the points, read off PG_RATES[r] at the moment of paying
  r:  1,            // the rule version it was paid under
  at: '2026-10-02T07:14:00.000Z'  // the act's own stamp, not the moment of settling
}
```

`at` is the act's own time because a credit is a receipt for an act. Settling
late (the person was offline, or the record was backfilled) must not move the
date of what they did.

`n` is stored, never recomputed, so a later rate change cannot lower a point
already paid (section 8).

## 7.4 The four rules on what may pay

1. **A point is paid after the act and is never priced before it.** No surface
   prints "+5" on a control before it is pressed. The repository's own model
   prices an announced, contingent reward at **minus 3.4 points per hundred people
   still active at day 30** (`DESIGN-gamification.md` 6.3, re-measured 27
   September; Deci, Koestner and Ryan 1999, d minus 0.40, 128 studies). The
   meaning line under the label "Points" says what kinds of acts count, which is
   a definition and not a promise attached to a control.
2. **A point never tracks money.** Opening a thought line spends supply, and a
   paid tier holds more supply, so a point per line would print a bigger number
   for a person who pays more. The one paid act that does pay, a first at an
   address, is capped at 112 addresses, and the free gift alone opens 25 of them.
3. **A point never reads a reading.** No rate references CQ, a band, node state,
   charge or the avatar. A gate (section 25) asserts no settle function reads
   them.
4. **A point never reads a view.** Opening, scrolling and reading pay nothing
   (v2 rule 27.3). A gate asserts no event derives from a render.

## 7.5 Spend

None. Points buy nothing in this version. The owner's ruling is that whether
they can ever buy patterns waits for accounts (round OJ). When it comes, minting
must move behind the one network seam, because the record is a file the person
can edit (section 17.5). This design does nothing that makes that harder: every
credit already carries its event id and its rule version, which is what a server
would need to check it.

---

# 8. Points never go down. The invariant, and how each part of it holds

## 8.1 Stated

> For one record, under any build that knows `p.progress`, at any two moments
> t1 before t2: points at t2 are at least points at t1, and the set of marks at t2
> contains the set at t1.

## 8.2 Why it holds, mechanism by mechanism

| Threat | What stops it |
|---|---|
| A ritual day deleted or taken back | the credit is a receipt, not a read. The record losing the entry does not touch `p.progress.credits` |
| An undo | `undoState` captures charges, opposites, laws, `work` and the soul only (`engine/undo.js` 82 to 89). `p.progress` is outside it by construction. A gate asserts `undoState` never carries a `progress` key, so a later edit cannot quietly add it |
| A rate lowered in a later build | `n` is stored per credit and never recomputed. `PG_RATES` is append only |
| A mark whose state falls back | the mark is stored with its date. `markTest` saying false today does not remove it |
| A mark definition retired | retired definitions stay in the table with `retired:true`: they render and are never newly granted. A key is never reused |
| A partly invalid `progress` | the boundary refuses the whole record by name rather than trimming the bag (section 17). A refused stored record is kept on disk, not loaded, and not overwritten (`pStore`) |
| Settle | the only writer, `progressApply`, appends. It has no remove path. A gate asserts the output list is a superset of the input |
| A persona loaded | settle reads `CURP`, the person's own record, and never `S`, the live field a persona is loaded into. A gate settles with a persona loaded and without, and asserts identical results |

## 8.3 The one known route down, said rather than hidden

**A build from before `p.progress` existed.** Every build shipped today drops an
unknown top level key on load (probe X11) and then writes the record back without
it. A person who opens their record in an old copy of the file loses the bag.
`CLAUDE.md` records this is real and not theoretical: the committed
`atuned-packed.html` was found serving a build seventeen hours older than
`source.html`.

What limits the damage. On the next open in a current build, settle backfills
from the record (section 17.3), and every credit and mark whose source is still in
the record comes back with its original date, because `at` is the act's own stamp.
What is lost is only the credits whose source entry was deleted in between, and
the marks whose state fell in between.

What closes it. `tools/packcheck.js` (planned in `PLAN.md`, QA pass 3) must fail a
packed file older than the build. And the progress slice ships in the same build
as its validator, never before it.

## 8.4 What "never goes down" does not cover

- **A new record.** Reset, a new profile, or an import makes a separate record
  (`pImport` pushes a new profile, `engine/schema.js` 1653). Points belong to a
  record. A new record starts at nothing.
- **Deleting a record.** The record and its points end together.
- **The streak's run.** The run halves after a long gap, by ruling (Bible 1133).
  The run is not a point. It never pays and no mark reads it (section 10).

---

# 9. Marks

## 9.1 What a mark is

A mark is a named fact about something a person did, earned once and kept for
good, dated with the moment it first became true. It pays no points. It is the
recognition. Points are the count.

```js
MarkDef = {
  k:  'week',              // key. Identity. Never renamed after storage begins, never reused
  q:  'flow',              // quarter of the loop: discover, play, flow, embody, turn
  nm: 'Seven days',        // the name a person reads
  d:  'Seven days of practice on the record.',  // the plain meaning, shown with it
  ic: 'M4 6h16v14H4z ...', // ring icon path. Ring, not fill
  t:  function(c){...},    // the test, over one context object c (9.4)
  v:  1,                   // the definition version
  retired: false           // true keeps it renderable and never grants it again
}

Mark = { k:'week', at:'2026-10-02T07:14:00.000Z' | null, v:1, ev:['rd:20357', ...] }
```

`ev` is the event ids the test used, so the drawer can answer "what earned it"
(v2 section 26). For a count mark it is the ids up to and including the one that
crossed the line. For a state mark (First clearing) it is empty and the drawer
says the mark records a state on its date.

## 9.2 The families, and their colours

From `DESIGN-ladder.md` 3.1. One family per quarter, and the family sits at that
quarter's seat, so the shelf reads as the circle. Icons are ring, not fill; the
colour is the seat's (`seatCol`).

| Quarter | Seat | What the family counts |
|---|---|---|
| Discover | 3rd Eye | what you found |
| Play | Sacral | what you ran |
| Flow | Root | what you kept |
| Embody | Heart | what is on file |
| Turn | Solar | the whole ring |

This replaces the shipped three families (Practice, Ground, Structure). Stored
marks carry only the key, so the family move costs no migration.

## 9.3 The marks, version 1

`MARK2` from `proto/ladder/turn.js`, ported into `engine/progress.js` with one
correction the prototype also missed (First run) and one mark held back
(The short run). Read the count off the build, never off this table:

    node -e "const E=require('/tmp/engine.js');console.log(E.PG_MARKS.filter(m=>!m.retired).length)"

| Key | Quarter | Name | Test | Change from shipped |
|---|---|---|---|---|
| `told` | discover | First story | one story entry | none |
| `kept` | discover | Ten stories | ten distinct days with an entry | was ten entries (LD4) |
| `ten` | discover | Ten addresses | ten distinct address ids opened | was ten line keys (LD4) |
| `fifty` | discover | Fifty addresses | fifty distinct address ids | as above |
| `named` | discover | Every seat opened | ground at all seven seats | new |
| `first` | play | First run | **one ritual marked done** | was any entry. 21.J2's open half |
| `hour` | play | Sixty minutes | sixty minutes marked done | none |
| `tracks` | play | Every track run | one done ritual in each track in `PRACTICE`, read at run time | new |
| `week` | flow | Seven days | seven days practised | was a strict row (LD3) |
| `month` | flow | Thirty days | thirty days practised | as above |
| `season` | flow | Ninety days | ninety days practised | as above |
| `back` | flow | Came back | a gap of fourteen days or more, then a day practised | new |
| `nine` | embody | Nine axes | every axis carries a value the person entered | test now matches its copy |
| `laws` | embody | Laws measured | intake complete | none |
| `stated` | embody | Blueprint stated | a type stated | none |
| `aimed` | embody | Purpose set | six values placed | none |
| `poled` | embody | First clearing | one axis at the far pole | key renamed from `turned` |
| `seat` | embody | Five clear | five axes at the far pole | copy says axes, as the test counts |
| `watched` | embody | Ten readings | ten snapshots on file | name was Ten snapshots |
| `ring` | turn | First turn | one closed circle | new |
| `rings` | turn | Ten turns | ten closed circles | new |

**Held back:** `floor` (The short run) needs a `floor:true` flag on the ritual
entry, and the ritual entry is a closed key set (`RIT_KEYS`, `engine/schema.js`
583). It lands with that flag, as its own named schema change.

**The rename happens before storage, or never.** `turned` becomes `poled` in the
same build that starts storing marks. No record yet holds a stored `turned`, so
the rename is free today and a migration from tomorrow.

## 9.4 The test context

A test reads one object, built once per settle:

```js
c = { p, now, ledger:ledgerRead(p), streak:streakRead(p,now),
      turn:turnRead(p,now), addrs, seats, storyDays, tracks, gapMax }
```

Nothing in a test reaches outside `c`. No test reads `S`, `compute()`, CQ, a band
or node state.

## 9.5 State marks

`nine`, `poled` and `seat` read the state of the axes, and the state can fall.
Once stored they stay, and they render as a dated fact, never a present claim:
"First clearing. An axis held at the far pole on 2 October." The audit's question
7 recommended exactly this ("held on 12 March"). The shelf never shows a state
mark as if it were still true; the reading surfaces say what is true now.

## 9.6 The next mark

One, never a list, chosen the way `ladderRead` already chooses: the nearest
unearned, non retired mark in the family the person is furthest into. Printed with
its name and its meaning and nothing else. No progress bar, no "3 of 7", no count
of how many marks exist (DESIGN-ladder anti design 3 and 4).

---

# 10. The streak model, in full

21.J2 fixed one line of this. This section specifies the whole model the line sits
inside, so the next change to it has one place to start.

## 10.1 The day

A day is `pracDay(t)`: the local calendar day of the stored stamp, computed with
the reading device's time zone rules for that date. One day key per entry, from
the entry's own `t` (the day the ritual is for), never from its `done` stamp, so a
ritual for yesterday marked done this morning counts for yesterday.

**Known limit, stated:** a person who reads their record in a different time zone
from the one they wrote it in can see a late night entry move by a day. The Daily
Summary uses the same rule and accepts the same limit (`engine/daily.js` header,
"ONE LOCAL DAY").

## 10.2 A day practised

A day with at least one ritual entry where:

- `done` is not exactly `false` (a missing `done` is an entry older than the field,
  read as done, the reading `ledgerRead` and `ritIsDone` already give it), and
- the day is not more than one day after `now` (the one day slack the Daily Summary
  uses for a person who flew west and back). **New.** Today a future dated entry
  counts (probe X7). It is ignored, not refused: refusing it at the boundary would
  set the person's whole record aside at boot over one clock error.

## 10.3 The four numbers

| Number | Definition | Who reads it |
|---|---|---|
| `days` | count of days practised | the flow marks, the ledger |
| `run` | days practised walked oldest to newest: a gap of one or two days continues, three or more halves what was standing, minimum one | the streak figure on the Ritual page and the Compass |
| `best` | the longest strictly consecutive row | the "longest held" line, and nothing else |
| `live` | the newest day practised is today or yesterday | the streak figure's state |

`last` (the newest day practised) is also returned, for the date beside the ring.

## 10.4 What reads the streak, and what never does

- **Marks never read `run` or `best`.** Seven, Thirty and Ninety days read `days`.
  A mark that demands a row shames a gap, and the badge was stricter than the
  mechanic beside it (DESIGN-ladder anti design 1, measured in its section 1.4).
- **Points never read the streak.** A day pays 5 whether it is the first day or the
  fortieth in a row. No multiplier, no bonus for a row. A row bonus is a loss
  framed streak with the frame turned round: missing a day costs the bonus.
- **Nothing is sent about the streak.** No notification that a run is "about to
  end". The voice gate already stops "Your streak is about to end" by name
  (`notification-plain` in `check.py --brief`).

## 10.5 How the streak is shown

- The run as a figure under the ruled one word label **Streak**, the unit on the
  figure: "14 days". A zero is a dash.
- **No absence line.** "The run ended 5 days ago" is replaced with the date of the
  last act: "Last practised 28 September." The architecture review ruled the date
  of the last act is written beside the ring (ruling 3), and the ladder's anti
  design rule 5 rules the absence is never mentioned. This is a change to
  `ladderHtml` and to the Ritual page's record.
- `best` prints only when it is longer than `run`, as it does today.
- **Never a day number.** No "Day 12", no "day 12 of 90", no days since the person
  started, no countdown. A count of days practised is a count of things that
  happened, which is allowed. An index of where the person is in a journey is a
  stage, which the architecture review ruled out.

## 10.6 The tension this seat names and does not hide

The run halving is a number that goes down after an absence, on a product whose
owner ruled points never go down. It is not a point, it pays nothing and no mark
reads it, so the ruling is not broken. It is still a figure that falls, and the
halving was ruled (Bible 1133) and costed: a reset to zero would hold **4.3 more
people per hundred at day 30** in the repository's model, which is what the
halving gives up (`DESIGN-gamification.md` 6.6, 27 September). Days practised
sits beside it and never falls. If the owner ever wants the run gone, the
streak label goes and days practised takes its place; nothing else in this design
changes.

---

# 11. The turn

`turnRead(p, now)` is ported from `proto/ladder/turn.js` 75 to 115, body unchanged
except that the play quarter is touched by a ritual entry and the flow quarter by
a ritual marked done (as the prototype already does), and stamps more than one day
after `now` are skipped (10.2).

It merges four streams that already carry a timestamp (story entries, ritual
entries, ritual done stamps, snapshots), walks them once in time order, and closes
a turn when all four quarters have been touched since the last close. Ten entries
close no turn. A turn may close across days.

It is drawn as a ring with the touched quarters lit, never as "3 of 4". Whether
the count of turns is ever printed, and whether "turn" is the word, are the
owner's and already open (LD10, LD11). Until he rules, only the two turn marks
carry it.

---

# 12. Unlocks, as introductions

## 12.1 The ruling this sits under

Sight by tier is real (rounds OJ and OK): the plan decides which layers a person
can see. v2 section 20 adds a second gate on top ("First Complex, Complex Map").
Two gates on one layer means a person who paid for complexes still cannot see
them until they earn a mark, which hides what they bought.

**Decision: the plan is the only gate. An unlock is an introduction.** The first
time a layer the person's tier already shows has something in it, the product
shows a one time card: what the layer is, in plain words, and the knowledge entry
that goes with it. Nothing is withheld that the tier allows. This is audit question
5, recommendation A, and it keeps `DESIGN-progression.md` 4.1: "the product may
hide what it sells, it may never hide what it measures."

## 12.2 The introductions, version 1

| Key | Shown the first time | Card says, in plain words |
|---|---|---|
| `i.saboteur` | a saboteur is present and the tier shows saboteurs | what a saboteur is, and where it shows on the body |
| `i.complex` | a complex is present and the tier shows complexes | what a complex is (where saboteurs join) |
| `i.hyper` | a hyper complex is present and the tier shows them | what a hyper complex is (where complexes join) |
| `i.graph` | the second reading lands and the graph can draw a line | why one reading is a point and two are a direction |

Stored in `p.progress.seen` as the key and the date, because "was this shown"
cannot be derived from the record. Never shown while care holds (section 21.6).

v2's capability unlocks (Pattern Map, Complex Map, Integration Tracker, Protocol
Customization, Advanced Ritual Builder) and perspective unlocks (System View,
Embodiment View) name surfaces that do not exist (`POINTS-AUDIT.md` P40, P42). They
are not specified here. When a surface exists, its introduction is one row in this
table.

---

# 13. Deferred families, and the rule that guards them

**Saboteur, complex, hyper complex, mask, character and integration marks** are
deferred until the Becoming build gives those things an id and a state. Today
they are recomputed from charge on every call with no id (`engine/compute.js` 266
to 326), so "released" and "resolved" have nothing to observe. When they land,
two rules hold:

1. **Pay for what the person did to them, never for how much they carry.** A mark
   for "First complex" goes first and fastest to the heaviest person on the roster
   (Gordon reads 19 complexes at CQ 18, audit C8). A mark for opening all three
   addresses of a saboteur is an act.
2. **A mark never names a layer the person's tier cannot see.** A free person
   cannot see complexes (round OJ), so a mark that said "First complex" would
   reveal a locked layer through the shelf.

**Transformation (CQ) marks and points are struck, not deferred.** v2 contradicts
itself here (section 7 pays CQ, sections 4, 27.10 and 36 forbid it), and the
standing ruling is that a reading is never a score. The band crossing award
designed in `DESIGN-ladder.md` 3.4 (Moved, upward only) reads a reading and is the
owner's call; it is listed in section 30 and not built.

**The four award families** of `DESIGN-ladder.md` 3.4 (Cleared, Held, Moved,
Closed) are deferred. Held and Closed need two new fields on every snapshot, which
touches the cross compatibility contract with SOURCE and is the owner's open LD12.

---

# 14. The data model

## 14.1 The stored field

```js
p.progress = {
  v: 1,                                   // PG_SCHEMA_V, this bag's own version
  credits: [ Credit, ... ],               // 7.3. Append only. Unique by id
  marks:   [ Mark, ... ],                 // 9.1. Append only. Unique by k
  seen:    [ { k:'i.complex', at:ISO }, ... ]  // 12.2. Append only. Unique by k
}
```

Top level, beside `summaries`, `trace` and `practice`, with its own version, the
pattern the architecture review ruled for `p.declined` (ruling 6). `SCHEMA_V` does
not move: a missing `progress` is an older record and is filled from the blank,
which is additive.

## 14.2 The blank

```js
function progressBlank(){ return {v:PG_SCHEMA_V, credits:[], marks:[], seen:[]}; }
```

`blankProfile` gains `progress: progressBlank()`.

## 14.3 Size

A credit is about 60 bytes written out. A daily person writing and practising
every day for a year stores about 730 credits and at most 112 address credits,
about 50 kilobytes. Marks and introductions are a few dozen rows. Capped like the
Daily Summary's bank: `PG_CAP = {credits: 8000, marks: 200, seen: 50}`, refused by
name above the cap. 8000 credits is more than ten years of every daily act.

## 14.4 What is never stored

A total. A balance. A level. A streak. A turn count. A user id. `points`,
`balance`, `total`, `level`, `userId` and `user_id` under `progress` are refused by
name (17.2), because a stored total is a second truth that can disagree with the
credits under it.

---

# 15. The engine API

New file `atuned_src/engine/progress.js`. Host free: no `document`, `window`,
`navigator`, `localStorage`, `fetch`. `hostfree.py` checks it. In `MANIFEST` after
`engine/ladder.js` (it calls `pracDay`, `streakRead`, `ledgerRead`) and before
`engine/daily.js` (which may cite marks, 21.4).

`validateProfile` in `schema.js` calls `progressValidate`, defined in a later file.
That is safe for the same reason `practiceValidate` and `dlyValidate` are: the call
runs after the whole build has parsed. Tables in `progress.js` are declared with
`var` and are never read at parse time by an earlier file.

```js
progressEvents(p, now)          -> [ProgressEvent]      pure
pointsRead(p)                   -> { n, credits, byType } pure. n is the sum of credits[].n
markTest(p, now)                -> [ { k, ev } ]        pure. marks true right now
progressSettle(p, now)          -> { credits:[], marks:[], seen:[] }  pure.
                                   what is true now and not yet stored. Writes nothing
progressApply(p, add)           -> { ok, progress } | { ok:false, errs }
                                   returns a NEW progress bag with add appended,
                                   through progressValidate. Never mutates p on refusal
progressRead(p, now)            -> { points, marks, next, streak, turn, odd }
                                   everything a surface needs, one call
progressWhy(p, id)              -> { kind, rows } the evidence for one credit or mark,
                                   with each source entry's status: present or removed
progressExample(i, now)         -> a read only progressRead for example person i (20)
progressValidate(errs, o, path) -> a clean bag, refusals pushed to errs by name
progressBlank()                 -> the blank bag
```

`odd` lists what the boundary kept and wants a person to know about (17.2): a
credit dated more than a day ahead, a credit under a rule version this build does
not know. Derived on read, never stored.

All moments are passed in. Nothing in this file calls `Date.now()` or `new Date()`
without an argument, matching `engine/ladder.js` ("the caller passes the moment").

---

# 16. Settling

## 16.1 When

The host calls one function, `pgSettle()` in `ui/`, which is:

```js
var add = progressSettle(CURP, Date.now());
if(add.credits.length || add.marks.length || add.seen.length){
  var r = progressApply(CURP, add);
  if(!r.ok){ status('Points were not saved: ' + r.errs[0]); return; }
  CURP.progress = r.progress;
  if(!pSave()) status('Points were not saved. ' + saveState().err);
}
```

Called after each writer that can change what is earned: a ritual marked done or
saved, a story committed, a release completed, the intake completed, a snapshot
taken, a type stated, the purpose map saved, and once at boot. Every write that can
fail reports through `status()`; nothing claims a point it has not saved.

## 16.2 Never

- On an example person's record (section 20). `CURP` is always the person's own
  record; the persona lives in `S`, and settle never reads `S`.
- From a render. Opening the Compass settles nothing.

## 16.3 What a person sees at the moment of settling

A new mark plays its sound once (`ui/sound.js` already plays for newly earned
marks; it switches from an in memory diff to "stored in this settle", which also
stops a mark replaying its sound after a reload). No toast, no confetti, no modal.
The points figure on the record moves the next time the record is drawn. A point
appearing is a fact being written down, not an event being staged.

---

# 17. Boundary, migration and versioning

## 17.1 The rule this follows

From `CLAUDE.md`: a missing field is an older record and is filled from the blank;
a field of the wrong type or out of range is refused by name and never silently
clamped. And one fact from `engine/schema.js` that sharpens it here: the boundary
also runs on every stored record at boot, and a refused stored record is kept on
disk but not loaded. So every refusal below must be something only a hand edit or
another program could produce. Anything the app itself can produce over time must
pass.

## 17.2 What `progressValidate` does

| Input | Treatment | Why |
|---|---|---|
| `progress` missing or null | filled from the blank | an older record |
| `progress` not an object | refused: `progress is not an object` | wrong type |
| unknown key under `progress` | refused by name: `progress may not carry <key>` | a closed bag, as trace and summaries are |
| `points`, `balance`, `total`, `level`, `userId`, `user_id` under `progress` | refused by name: `progress.<key> is not held by this product` | a stored total is a second truth (14.4) |
| `v` not a number from 1 to `PG_SCHEMA_V` | refused by name | wrong version |
| a list not a list | refused by name | wrong type |
| a credit id not of a known shape (`rd:`, `sd:` with an integer day; `ad:` with 0 to 111) | refused by name, with the id | only a hand edit makes one |
| two credits with one id | refused: `progress.credits lists <id> twice` | the writer dedupes, a gate proves it; a duplicate is a hand edit |
| a credit's `n` not the rate its type had under its rule `r`, where this build knows `r` | refused by name, never corrected to the table | a clamped value reads as a payment that was never made |
| a credit under a rule `r` newer than this build knows | **kept as written, counted at its stored `n`, and listed in `odd`** | the same posture as an unknown `plan.status`: a newer build wrote it, and refusing it would set the person's whole record aside in an older build |
| `at` not a date | refused by name | wrong type |
| `at` more than a day after the moment of reading | **kept, counted, listed in `odd`** | a clock error, not a forgery. Refusing it at boot would lock a person out of their record over a clock |
| a mark `k` not in `PG_MARKS` (live or retired) | refused by name | a mark cannot be invented by editing the file |
| two marks with one `k` | refused by name | as credits |
| a mark `at` null | kept | a mark whose crossing date could not be derived at backfill (17.3) |
| a seen `k` not in `PG_INTROS` | refused by name | as marks |
| more rows than `PG_CAP` | refused by name with the count | a bound, never a truncation |
| a credit whose source entry is no longer in the record | **kept, counted.** `progressWhy` reports it as removed | points never go down. This is the line that departs from `POINTS-AUDIT.md` section 5, which proposed refusing unresolved evidence. That would have refused, at boot, every record whose owner deleted a ritual day. |

## 17.3 The backfill, the first time a current build opens an older record

`progress` is filled from the blank, then settle runs once. Every event already in
the record gets a credit, dated with the act's own stamp. Every mark already true
gets stored with `at` set to the moment its test first crossed, where that can be
read off stamps (the seventh day practised, the tenth story day, the tenth
snapshot) and `null` where it cannot (a state mark, which records a state and not a
moment). A mark is never dated with the moment of backfill, because that would
claim a date the work did not have.

**Order matters.** The First run correction (9.3) and the future date rule (10.2)
land before or with the backfill, never after, or the backfill stores a mark that
the corrected rules would not grant, and it then stays for good.

## 17.4 Versioning

| Version | Where | Bumped when | Old values |
|---|---|---|---|
| `PG_SCHEMA_V` | `p.progress.v` | the shape of the bag changes | a lower `v` is read and upgraded on load |
| `PG_RULE` and `PG_RATES` | `credit.r` | any rate changes | `PG_RATES` is append only; old credits keep their `n` |
| mark `v` | `mark.v` | a mark's test changes meaning | an earned mark keeps its stored `v`; a changed test applies to new grants only |
| `SCHEMA_V` | `p.v` | not bumped | the field is additive |

The cross compatibility contract with SOURCE (the owner's, per `CLAUDE.md`) is
touched only by adding an optional top level key, which is the same move
`summaries`, `trace` and `practice` already made.

## 17.5 Forgery, honestly

The boundary cannot stop a person editing their own file. It can make a forged
point cost more than it is worth. The worst a hand edit can do and still load: a
credit for every day in the cap and every address, all at the published rate,
which is a number that buys nothing (7.5). The day points buy anything, minting
moves behind the network seam and the server signs credits. Until then, this is
harmless, and the audit's probes X4, X6 and X7 are answered for this bag.

---

# 18. Corrections, undo and imports. Every edge case

| # | What happens | Points | Marks | Evidence drawer |
|---|---|---|---|---|
| E1 | A release is undone | unchanged. The address first and its credit stay; undo restores the reading and leaves the record (`TASKS.md` FB7) | unchanged | the address shows as opened |
| E2 | A story commit is undone | unchanged. Undo restores charges; the entry stays | unchanged | the entry is present |
| E3 | A ritual pressed done, then taken back the same day | unchanged. The credit for that day stays. Pressing again finds the id already credited, so nothing is paid twice | unchanged | "5 points. A ritual marked done on 2 October. The entry was later removed from the record, and the points stay." |
| E4 | A ritual day deleted from the record weeks later | unchanged | unchanged, even if it was the seventh day of Seven days | as E3 |
| E5 | An axis falls back from the far pole | unchanged | First clearing stays, dated | "Recorded a state on 2 October. The reading today may differ." |
| E6 | The same ritual done twice in one day | the second pays nothing. The day pays once | unchanged | one credit for the day |
| E7 | A rerun of an opened address | nothing. No new address first | unchanged | none |
| E8 | A record imported | a new record with its own bag, validated (17.2). If it has no bag, backfilled (17.3). Never merged into the open record | as points | as points |
| E9 | The same export imported twice | two separate records, each with its own points. No merge, no doubling of one record | as points | as points |
| E10 | An older build opens and saves the record | the bag is dropped. The one known route down (8.3) | as points | none |
| E11 | Rates retuned in a later build | old credits keep their `n` | unchanged | each credit names the rule it was paid under |
| E12 | A mark's test is corrected in a later build | an earned mark stays with its old `v`; new grants use the new test | unchanged | names the version |
| E13 | Device clock set ahead, then corrected | credits dated ahead are kept and listed in `odd`; no new credit is paid for a day more than one day ahead | unchanged | "Dated after today. Check the clock on this device." |
| E14 | Device clock set back | nothing new is paid for a day already credited | unchanged | none |
| E15 | A tier downgrade | unchanged (`PLAN.md` J11) | unchanged, and a mark that names a now locked layer is never shown (13.2) | unchanged |
| E16 | Reset, or a new profile | a new record starts at nothing; the old record is untouched until deleted | as points | none |
| E17 | A persona loaded while settling runs | settle reads `CURP`, never `S`; identical result (8.2) | as points | none |
| E18 | Care holds | settle still runs and still writes, because credits are facts; nothing about points or marks is shown and no sound plays | as points | hidden |
| E19 | A stored bag is refused at boot | the record is kept on disk, not loaded, not overwritten (`pStore`). The person sees the existing "could not be read" notice. Nothing is lost | as points | none |
| E20 | Travel across time zones | a late entry may move a day (10.1). A day already credited stays credited under its old key; the moved key may pay once more | unchanged | both credits listed |

E20 is the one place one act can pay twice. It is bounded at one extra credit per
moved entry, it needs a person to cross a time zone, and fixing it means storing the
zone on every entry, which is a schema change for a few points. Accepted, and named.

---

# 19. A blank profile

- `p.progress` is the blank. Points read 0, shown as a dash under the label
  "Points" (`COPY.md` J13).
- No marks. The shelf heading does not render; an empty shelf is not drawn as a
  row of locked shapes, which would be a checklist of a self not yet started.
- The next mark is named: First story if there is no entry, First run otherwise.
  One line, its name and its meaning.
- The record panel follows the unread rule (`CLAUDE.md`, "The app opens on the
  Field"): while the profile has no reading, the surfaces that print a reading show
  the four doors, and the record panel shows its existing line "Nothing on the
  record yet. Build one ritual and save it, and the first day is on."
- Nothing is backfilled because nothing is there.

---

# 20. Example people. A fixed sample record, never zero, never theirs

**The call.** An example person (Sofia, Diane, Gordon and the rest of the roster in
`engine/data/people.js`) shows a **fixed sample record**: a small, representative
set of points and marks, the same every time that person is opened, computed by the
real engine from a fixture, labelled as a sample, and never written anywhere.

**Why not zero.** An example exists to show what the product does with a real
person in it. The owner asked tonight that every example be fully unlocked (round
QA: "all of the personas profiles that we have are all tier four, they're all
unlocked"). A record panel reading a dash beside a fully unlocked example shows the
one part of the product an example cannot demonstrate, and it is the part a new
person most needs to see the shape of. Today it is worse than zero: `ladderHtml`
reads `CURP`, so beside Sofia's reading it shows the person's own record, which is
two people on one screen.

**Why not a typed number.** A typed "247 points" beside Sofia is a fabricated
record presented as hers. The sample is generated by `progressExample(i, now)`: it
builds a throwaway record from a fixture (ritual days, story days and address
firsts at fixed offsets back from `now`) and runs the same `progressSettle` and
`pointsRead` over it. So the sample obeys every rule a real record obeys, and a
change to the rates moves the sample too.

**Why the sample is not tied to their reading.** If Gordon at CQ 0.8 showed fewer
points than Rosa at CQ 100, the examples would teach that a better reading earns
more points, which is the worth score this whole system refuses. So the fixture is
chosen by cadence, not by reading: v2 section 32's five cadences (light, steady,
deep, power, sporadic), assigned by the person's position in `PEOPLE` modulo five.
A gate asserts `progressExample` reads nothing from `PEOPLE[i]` except its index.

**The label, with its meaning in the same place:** "Sample record. Sofia is a
worked example, so this record is a fixed sample that shows the shape a record
takes. None of it is yours."

**Never:** settled, saved, exported, or counted into the person's own record. A
gate loads every example, settles, and asserts the person's own bag is byte for
byte unchanged.

---

# 21. Where this shows

## 21.1 Where it lives

**The record lives on the Compass and on the Ritual page, where `ladderHtml` and
the Ritual record already draw it.** The Compass comment says why
(`ui/cone.js` 3300 to 3320): "What you have done belongs beside where you are
pointed. It does not go on Summary, which is the reading, and a reading is not a
record of effort."

## 21.2 Not on Summary

Two other seats are building the Daily Summary and the Trace graph view tonight in
their own worktrees. This spec does not touch their files. What it settles for them:

- **Summary is the reading.** A points total does not go on it. v2's own Progress
  Hub put "POINTS 247" above "CQ 74" and then said "Do not combine these into one
  score". Putting them on one card is the combining (audit C6).
- **The Daily Summary may cite a mark as a dated fact.** It already cites dated
  firsts as a record type (`DLY_REC` includes `first`). A mark earned that day is
  the same shape of fact: "You earned Seven days on 2 October." Proposed to the Daily
  Summary seat as a new record type `mark`, read through `progressRead`. Its
  sentences never print points or the streak; its own `DLY_LOSS` list already
  refuses both words, and that stays.
- **Marks never enter the Trace graph.** A mark is a receipt about the record, not
  an object in a person's pattern system (audit 3c). The graph is where the
  evidence drawer can walk from a story to the release it led to, when the drawer
  asks it.

## 21.3 What the record panel shows, top to bottom

1. **Streak**, with the run as its figure and the date of the last act (10.5).
2. **Points**, the figure, with its meaning line.
3. The ledger rows that exist today (Practised, Planned, Saved, Opened,
   Installed), with **Opened** corrected to count addresses, not lines.
4. **Marks**, the earned ones as ring icons in their seat colour, each with its
   name, its meaning and its date.
5. **Next**, one mark, named with its meaning.

Each figure follows V17 (a one word label, the unit on the figure) and V23 (the
meaning in the same place).

## 21.4 Labels and their meanings, in the same place (round PO)

| Label | Meaning shown with it |
|---|---|
| Streak | Days practised, counted forward: one day off costs nothing, and a longer gap halves the count. |
| Points | Points count what you did: a day you practised, a day your story found a place in your body, the first time you opened a place. They never go down. |
| Marks | A mark is a dated fact about something you did. Once earned it stays. |
| Next | The one mark closest to what you are already doing. |
| Sample record | (20) |
| each mark | its `d` line, then "Earned 2 October." or, for a backfilled state mark, "Earned before marks were dated." |

## 21.5 The evidence drawer: "What earned it"

A press on the points figure or on a mark opens one drawer, built from
`progressWhy`. For points, the credits newest first, each one line: "5 points. A
ritual marked done on 2 October." For a mark, the events that crossed its line. A
removed source says so (E3). A dated ahead credit says so (E13). Nothing else: no
chart of points over time, which would turn a receipt list into a graph to chase.

## 21.6 Care

While care holds (`REVIEW-arch/TALLY.md` ruling 1), the record panel, the points
figure, the marks shelf, the next mark, introductions and mark sounds are all
absent. Settling continues silently (E18). When care clears, the record is simply
there, unchanged, with no catch up announcement.

## 21.7 The first session

Achievements are hidden at first (`PLAN.md` X1). The record panel does not appear
in onboarding. The first time a person opens the Compass after onboarding, what
they earned is already there, dated.

## 21.8 Proposed strings, checked

Every string in 21.4, 21.5, 20 and 10.5 was run through
`python3 .claude/skills/atuned-voice/check.py --line` before this file was
committed. Results are in section 31.

---

# 22. Anti farming, against this model

| Scenario | What this model does | Verdict |
|---|---|---|
| Ritual spam, one ritual hundreds of times a day | one credit per day; marks count days | closed |
| Journal spam, fifty one letter entries | an entry must read an imprint to count; one credit per day; Ten stories needs ten days | closed |
| Pattern spam, one easy pattern rerun | reruns open nothing new and nothing pays per pattern | closed |
| Point injection, a hand edited record | refused by name unless every credit has a known shape, the published rate and a unique id; the forged ceiling buys nothing (17.5) | bounded, harmless until spend exists |
| CQ oscillation 70, 75, 70, 75 | nothing reads CQ | closed |
| Achievement replay, the same evidence again | one credit per id, one mark per key | closed |
| Delete and re add a day | the id is the day, so re adding finds it already credited | closed |
| Device clock moved a day at a time | a day ahead of the real clock pays nothing new past one day of slack; walking the clock pays one credit a day, at the speed a person can walk a clock | bounded, harmless until spend exists |
| Lose a mark by recovering | marks are stored | closed |
| Pay for a self catch | integration is never paid | closed |

---

# 23. What it costs, and what it earns, priced

Figures from `DESIGN-gamification.md` are the repository's own model on a
synthetic panel of 1000 people, last recorded 27 September. **The harness behind
them, `tools/loopsim.js`, was run for this document on 2 October and still fails
its own validation (44 passed, 6 failed, the three level pins), so none was
re-measured.** They are benchmarks from that model, not promises. Where there is no
figure, my estimate is labelled as mine.

| Choice | Retention at day 30 | Build | What it does to the loop |
|---|---|---|---|
| Never subtract a point (ruled) | gives up **2.9 per hundred** that loss framing would hold, on a base of **20.7** | none | the hard line: the person can stop and be glad they used it |
| Never price a point before the act | avoids **minus 3.4 per hundred** | none, a copy rule and a gate | play is chosen for itself |
| Halve the run, never reset it (ruled) | holds **4.3 per hundred** a reset would cost | none, shipped | flow survives a bad week |
| Day marks on days practised (LD3) | unmodelled. Measured effect: a twice weekly person earns Seven days in the fourth week instead of never | small | flow pays the cadence the retention case is built on |
| Store marks so they never vanish | my estimate, 0 to 1 per hundred | slice 2 | a setback no longer takes anything |
| Show a points total at all | unmodelled. My estimate, within 1 per hundred either way. A visible sum is a number to chase; shown after the fact and capped by days, it is a slow one | slice 3 | watch it with a person before claiming either way |

What this design refuses outright, because it works by exploiting the machinery
this instrument reads: a variable ratio reward, a row bonus, a scarcity timer, a
near miss, a social nudge, a rarity shown, a notification about a run at risk.
None is modelled, deliberately (`DESIGN-gamification.md` 6.6).

---

# 24. Measurement

Device only. The outbox refuses `history` and `meter` by name today
(`engine/outbox.js` 28 to 34) and points add nothing to it. Whether any of this may
ever leave the device is the owner's, already open (`PLAN.md` J: "whether the
experience metrics may ever leave the device").

The question to answer, v2's own and the right one: "Did the progression system
cause deeper engagement with the transformation loop?" Not "how many points". The
number never says why somebody left, so every reading of the funnel is paired with
one person watched using it: the first visit to the Compass, a two minute visit,
and a visit after a fortnight away.

v2 section 28's rarity targets are not used. A rarity shown to a person is a
scarcity signal, and tuning a threshold to make a mark rare is manufacturing
scarcity out of their work. Its four reference figures ("First Complex about 24%")
have no source in the repository (audit P56).

---

# 25. Testing requirements

A new gate, `tests/progress.js`, headless, run from the repo root beside
`tests/engine.js`. Checked against a known bad case first, as `CLAUDE.md` requires:
each property below must fail on the shipped `ladder.js` where it describes a
defect, and pass on the build.

**Invariant**
- Points never go down: a seeded random walk of a few thousand operations (ritual
  press, take back, delete day, story commit, release, undo, redo, rerun, export and
  import round trip, boot validation round trip, persona load and unload, clock
  forward and back) asserts points and the mark set never shrink after any step.
- `undoState()` never has a `progress` key.
- `progressApply` output is a superset of its input; it refuses rather than trims.

**Events and points**
- The same record read twice gives the same event ids.
- Set and not done earns no ritual day, no First run, no day marks (the 21.J2
  fixture, extended to First run).
- A day ninety days ahead pays nothing and counts toward nothing (probe X7).
- Fifty one letter entries pay at most one story day per day (probe X3).
- Two rituals in one day pay one day.
- No settle function reads `S`, `compute`, `CQ`, `tier`, `nodeStateOf` or `PEOPLE`
  (a source scan of `progress.js`, the way `hostfree.py` scans).

**Marks**
- The equivalence gate: on every roster profile driven by `proto/ladder/roster.js`,
  the marks true now match `MARK2`'s results except for the named corrections.
- Every mark has a ring icon path, a family, a seat colour and a meaning line.
- Twice a week for ninety days earns Seven days (LD3).
- Ten line keys at one address do not earn Ten addresses (probe X5).
- An axis falling back after First clearing keeps First clearing (probe X10).

**Boundary**
- Each refusal in 17.2 is produced by name on a fixture, and each "kept" row loads.
- A record with a deleted source still loads at boot.
- A record without `progress` loads, backfills, and dates its credits with the
  acts' own stamps.
- Export then import preserves `progress` byte for byte.

**Examples**
- `progressExample(i)` is identical for every `i` with the same index modulo five,
  and reads nothing of `PEOPLE[i]` but the index.
- Loading every example and settling leaves the person's own bag unchanged.

**Copy and surfaces** (after slice 4, in the existing gates)
- `tests/unpack.js` seeds Points, Marks, Streak and Next as terms that must carry
  their meaning.
- `tools/terms.py`: one word per concept for mark, point, streak.
- `node tools/shots.js` at 1600 and 390, then look at the images.

---

# 26. Implementation status

| Component | Status at `f2fd8ff` |
|---|---|
| Day key, days practised, halving run | EXISTS |
| `pracDays` skips set and not done | EXISTS, tonight |
| First run reads done only | MISSING |
| Future dated days ignored | MISSING |
| `turnRead`, `MARK2` | PARTIAL, prototype only |
| Events with stable ids | MISSING |
| Credits, points | MISSING |
| Stored marks | MISSING |
| `progressValidate`, backfill | MISSING |
| Evidence drawer | MISSING |
| Introductions | MISSING |
| Example records | MISSING; today the record beside an example is the person's own |
| Absence line removed from the record | MISSING |
| Saboteur to mask families | DEFERRED, needs Becoming |
| CQ rewards | STRUCK |

---

# 27. Build order

Sizes are lines of source and gate, this seat's estimate, against
`engine/practice.js` at 1,135 lines with 713 of gate as the nearest comparison.
Each slice runs the full gate list in `CLAUDE.md` before it merges.

| Slice | What | Needs | Size |
|---|---|---|---|
| 0 | First run reads done only; future dated days ignored in `pracDays` and the turn; the absence line replaced by the last practised date; gates for each | nothing | 40 lines, 15 asserts, plus a few lines of `ui/cone.js` and the Ritual record |
| 1 | `engine/progress.js`: `PG_EVENTS`, `progressEvents`, `turnRead` port, `PG_MARKS` from `MARK2` with the key rename, `markTest`, the equivalence gate | slice 0 | 300 lines, 50 asserts |
| 2 | `p.progress`: blank, `progressValidate` wired into `validateProfile`, `progressSettle`, `progressApply`, backfill, the invariant random walk. Must ship in one build with its validator (8.3) | slice 1 | 250 lines, 60 asserts |
| 3 | Points: `PG_RATES`, credits, `pointsRead`, `progressWhy` | slice 2 | 120 lines, 30 asserts |
| 4 | Surfaces: the record panel order (21.3), meanings (21.4), the drawer, `pgSettle` at each writer, sound from stored marks, care hiding, example records (20), the unpack and terms seeds, shots at both widths | slice 3; coordinate `ui/cone.js` with the Compass seat | 250 lines UI and CSS |
| 5 | Introductions (12) | slice 2; sight by tier built | 80 lines |
| 6 | The short run mark with its `floor` flag; the award families; the deferred mark families | the flag; LD12; the Becoming build | not sized until defined |
| 7 | Spend, server signed credits, any sync | accounts | not sized |

Slices 0 to 5 need no backend.

---

# 28. Non negotiable rules

1. Points never go down. No path in the engine removes a credit.
2. A mark, once stored, is never removed.
3. Derive everything; store only credits, marks and introductions shown.
4. A point is never priced before the act.
5. A point never tracks money, a reading, or a view.
6. No mark or point reads the run or the strict row.
7. No mark names a layer the person's tier cannot see.
8. No count against a total, no list of unearned marks, no rarity shown.
9. No sentence names an absence. The last act is dated; the gap is not counted aloud.
10. No day number, no stage, no countdown.
11. The boundary refuses by name, never clamps, and never refuses what the app
    itself can produce over time.
12. Every term on the record panel carries its meaning in the same place.
13. Examples show a fixed sample made by the real engine, labelled, and never
    written.
14. While care holds, nothing about points or marks is shown.
15. Nothing here leaves the device without an owner ruling.
16. No em dashes, sentence case, ring icons, seat colours.

---

# 29. The owner's v2, section by section

| v2 | Disposition here |
|---|---|
| 1 Purpose, core principle | kept verbatim as the governing rule (32) |
| 2 Architecture, four outputs | kept; points and marks are derived, readings stay separate (1.3) |
| 3 Ontology, provenance statuses | the chain is real as readings; the four statuses map onto the Practice build's five, in the document, not the code (audit P05) |
| 4 Progression dimensions | breadth is distinct addresses and seats, consistency is days practised, depth waits for a definition (13) |
| 5 Event ledger | events derived with stable ids, no `userId`, not stored (6) |
| 6 Event integrity | held by deterministic ids and the append only bag (6.1, 8) |
| 7 Points economy, values | kept for days and places; protocol, entity and CQ rows deferred or struck (7.2) |
| 8 Point rules | kept, and sharpened: never priced before, never money (7.4) |
| 9 Achievement model | `MarkDef` (9.1); `pointReward` dropped (marks pay nothing), `rarityTarget` dropped (24), `repeatable` not needed in version 1 |
| 10 Activity achievements | the count ladders 3, 5, 10, 25, 50, 100 are not built; the shipped day marks are kept on days practised. More rungs is a later data change, never a near miss list |
| 11 Fetter achievements | fetter read as address: Ten and Fifty addresses, Every seat opened |
| 12 to 15 Saboteur to mask | deferred (13) |
| 16 Transformation | struck (13) |
| 17 Integration | recorded never paid (6.3) |
| 18 Universal state machine | not stored per reading (audit P37); waits for Becoming |
| 19 to 21 Unlocks, knowledge | introductions, the plan as the only gate (12) |
| 22 Achievement to unlock to action | kept as the loop sentence (1.1) |
| 23 Turn integration | kept, one turn definition, `turnRead` (11) |
| 24 Evaluation pipeline | `progressSettle` then `progressApply` (15, 16) |
| 25 Declarative requirements | not in version 1. Tests stay functions over one context object (9.4), held equal to `MARK2` by a gate. A data format can replace them later with the same gate |
| 26 Evidence | `ev` on marks, `progressWhy`, the drawer (21.5) |
| 27 Anti farming | all ten kept (22) |
| 28 Rarity targets | not used (24) |
| 29 API | none; device only (24) |
| 30 User progress model | `p.progress` without balances or a user id (14) |
| 31 Event sourcing | the record is the source; the bag is receipts (1.2) |
| 32 Simulation | the five cadences drive the example records (20); the 1000 person run waits on the harness repair |
| 33 Anti gaming simulation | made a gate (25) |
| 34 UI | no Hub; the record on the Compass and Ritual, sentence case, meanings in place (21) |
| 35 Analytics | device only, paired with a person watched (24) |
| 36 Guardrails | all nine kept, and enforced (28) |
| 37 Phases | re-ordered as slices (27) |
| 38 Definition of done | holds slice by slice; "Complex and hyper complex are first class" waits for Becoming; "the 1000 person simulation passes" waits for the harness |

---

# 30. Open, and whose

Round PD: the seats decide and ask at most one question, only when blocked. This
design is not blocked, so it asks nothing new. The items below are the owner's and
were already put to him elsewhere. They are listed so a builder knows which lines
of this document move when he answers. None of them blocks slices 0 to 5.

| His, already open | Where | What moves when he answers |
|---|---|---|
| The word: marks or achievements | `PLAN.md` H, question 9 | `PG_MARK_WORD`, one constant |
| Is "turn" the word for one closed circle | `TASKS.md` LD10 | the two turn marks' names |
| Is the turn count printed | `TASKS.md` LD11 | whether the record prints a turn figure |
| Do snapshots get the two new fields | `TASKS.md` LD12 | whether the Held and Closed families can exist |
| Is Came back earnable once or each time | `TASKS.md` LD13 | `back` becomes repeatable or stays once |
| Can points ever buy patterns | `DECISIONS.md` round OJ: waits for accounts | slice 7 |
| A band crossing as a mark (Moved, upward only) | `DESIGN-ladder.md` 3.4; audit question 3 | one more family, reading a reading |

---

# 31. The review: this document checked against the house rules

The owner asked for the TDD to be reviewed. Most of that review is the audit of
v2. This section is the review of v3 itself: one pass against `CLAUDE.md`, the
voice rules and the owner's own rulings, run on this file before it was committed.
What was found and fixed is written down, not just the result.

## 31.1 The mechanical checks, and their commands

    grep -nP '\x{2014}' ATUNED-points-achievements-unlocks-TDD-v3.md        em dash
    grep -nP '\x{2013}' ATUNED-points-achievements-unlocks-TDD-v3.md        en dash
    grep -nw '108' ATUNED-points-achievements-unlocks-TDD-v3.md             the lower count
    grep -niE 'clamp' ATUNED-points-achievements-unlocks-TDD-v3.md          silent clamping
    grep -niE '\bday [0-9]+\b|day n\b|[0-9]+ of 90' ATUNED-...-v3.md        a day number
    grep -niE 'journey|wellness|healing|gentle|relax|self.care|mindful' ...  soft words
    python3 .claude/skills/atuned-voice/check.py --line "<each string in 21.4, 21.5, 20, 10.5>"

Results are in 31.3.

## 31.2 The judgement checks

| Check | Against | Result |
|---|---|---|
| Points can go down anywhere | DECISIONS OI and OJ | one route found and written down (8.3), not hidden; all others closed by mechanism (8.2) |
| A stored count or day number | the architecture review, "no stages or days" | none stored; the streak and turn are derived; no "Day N" anywhere in proposed copy |
| Silent clamping | `CLAUDE.md`, validate at the boundary | none. Every out of range value is refused by name or kept and reported in `odd` |
| A refusal that locks a person out of their own record | `pStore` at boot | found in the audit's proposal (refuse unresolved evidence) and reversed (17.2, last row) |
| Unpack every symbol | round PO | every record label has its meaning in 21.4; every term in this file is defined in section 4 or where it is first used |
| A reading turned into a score | `ladder.js` header, v2 rules 4 and 27.10 | no rate or mark test reads a reading; a gate enforces it (25) |
| A manipulation pattern | the hard line | none; each refused pattern priced or named (23) |
| A question to the owner | round PD | none new (30) |
| Counts typed into the document | `CLAUDE.md`, the twelve times | counts of events and marks are read off commands; typed figures are dated and sourced |

## 31.3 What the pass caught, and what was fixed

1. **The first draft refused a credit whose source entry no longer resolved,**
   carried over from `POINTS-AUDIT.md` section 5. Because the boundary runs at boot
   and a refused record is not loaded, that would have locked out every person who
   ever took back a ritual press. Reversed: kept, counted, and reported as removed
   in the drawer (17.2).
2. **The first draft refused a credit dated in the future,** for the same reason
   the Daily Summary does. Changed to keep and report it, because a clock error is
   not a forgery and a whole record should not be set aside over one.
3. **The first draft paid 1 point per thought line opened,** v2's "pattern executed"
   row. A thought line spends supply, so a paid tier would read more points for
   paying. Struck (7.4 rule 2).
4. **The first draft dated backfilled marks as null across the board.** Changed to
   date them from the act that crossed the line where stamps allow, so a person's
   history keeps its real dates (17.3).
5. **The absence line in the shipped record,** "The run ended N days ago", was
   found while specifying the streak display. It breaks the ladder's own anti
   design rule 5. Specified out in slice 0 (10.5).
6. **First run still counts set and not done entries,** in the shipped `ladder.js`
   and in the prototype `MARK2`, after tonight's 21.J2 fix. Specified in slice 0, and
   ordered before the backfill so it can never be stored wrongly (17.3).
7. **An example record keyed to the person's reading** was the obvious design and
   was rejected, because it teaches that a better reading earns more points. Keyed
   to cadence by index instead (20).
8. **The heading of the model TDD carries an em dash** (`ATUNED-practice-ritual-
   accountability-trace-graph-TDD.md` line 2). Not copied. Not this document's to
   fix.
9. **The proposed meaning for Points** first read "a day you wrote something that
   read", which a ten year old cannot parse. Rewritten as "a day your story found a
   place in your body" (V21).
10. **Section 5.3 claimed a twice weekly person reaches Thirty days near day 90.**
    Caught by the day number grep below. False: that cadence practises 22 days in
    ninety (`DESIGN-ladder.md` 1.4), so Thirty days is out of reach. Corrected, and
    the correction is a reason the next mark names one step and never a list.
11. **The Streak meaning line was flagged** by `check.py --brief --layer tooltip`
    (`tooltip-one-idea`, three sentences in a tooltip). Rewritten as one sentence;
    the rewrite is clean.

## 31.4 The mechanical results, run 2 October on this file

| Check | Result |
|---|---|
| em dash, en dash, minus sign (read with Python; `grep -P` cannot take the code point in this locale) | none |
| `108` | one hit, the grep command in 31.1 itself |
| `clamp` | every hit says the boundary never clamps |
| a day number | every hit is an analysis figure at day 30 from the retention model, or the rule forbidding a day number; none is proposed copy. One hit found the error fixed in 31.3 item 10 |
| soft words | one hit, "journey", in the sentence ruling a journey stage out |
| `check.py --line` on all fifteen proposed strings | no hard failures on any |
| `check.py --brief --layer tooltip` on the three meaning lines | Points and Marks: a review note (two sentences), kept, since each second sentence is the "never goes down" and "stays" claim the owner ruled. Streak: one flag, fixed (item 11) |
| `tools/loopsim.js` | 44 passed, 6 failed, report suppressed. Every retention figure here is labelled as last measured 27 September |

What this pass could not check, said as the voice gate says it: whether these
strings land for a person on the worst day of their year. That needs the strings on
a screen, with a profile loaded, at both widths, after slice 4.

---

# 32. The canonical model

```text
                 THE LOOP, A CIRCLE
        discover    play    flow    embody
            \        |       |       /
             \       |       |      /
              v      v       v     v
                   THE RECORD
        (stories, rituals, ground, firsts, readings)
                       |
             pure reads | nothing stored
                       v
     events    counters    streak    turn    marks true now
                       |
              settle    | append only
                       v
                  P.PROGRESS
          credits       marks       seen
                       |
                       v
     POINTS (never down)   MARKS (never lost)   NEXT (one)
                       |
                       v
        the record on the Compass and the Ritual page
        never on Summary, never beside a reading
```

## Governing rule

> **Atüned does not reward a person for becoming a higher scoring person. It
> records what they did, says so once, after the fact, and never takes it back.**

The first sentence is the owner's, from v2. The second half is this version's,
because "never takes it back" is the ruling v2 was written before.
