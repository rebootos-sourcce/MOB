# Gamification systems

Design brief for the desktop port of Atüned / SOURCE. Section owner: game
director.

Read off the source tree at commit `eb788a2` on 25 September 2026. Every claim
below says which file it came from. Where a number appears, it was read off a
run on that date. Treat it as dated, not as a constant: this repository has been
caught more than a dozen times by a number typed into a document that the
product then grew past.

Out of scope, because other seats cover them: module wiring and build
architecture, and the charge measurement itself (the sniffer, `compute()`, the
release arithmetic). Where gamification depends on one of those, this brief
names the dependency and stops there.

---

## 0. How to read the status tags

The product has a documented habit of design documents describing things as
built when they are not. CLAUDE.md records two cases: the Games fold, and
"Undo is built, and this paragraph said otherwise for longer than it was true".
So every mechanic in this brief carries one tag, and each tag was checked
against `atuned_src/`, not against a design document.

| Tag | Meaning for the port team |
|---|---|
| **BUILT** | Live code in `atuned_src/`. The file is cited. Port it as an existing contract: same inputs, same outputs, same stored fields. Where the built version has a defect, the defect is named and the brief says whether to copy it or fix it. |
| **DESIGNED** | Specified in a design document or a runnable prototype under `proto/`. Not in `atuned_src/`. Build it new from the cited spec. It is not a contract, and nothing stored depends on it yet. |
| **OPEN** | The owner has not ruled. Do not pick an answer. Build the seam so either answer fits. |

"Designed" does not mean approved. Several designed items disagree with each
other, and those disagreements are listed as OPEN.

---

## 1. The short answer: what the gamification is

The owner asked what the gamification is. Here is the honest answer at this
commit.

**What a person can actually use today (BUILT):**

1. **The record.** A practice streak that halves on a miss and does not reset,
   a ledger of four counts of things that happened, and sixteen named marks in
   three families. It renders in two places: the Ritual surface and the
   Compass rail. Source: `engine/ladder.js`, `ui/cone.js` `ladderHtml()`.
2. **Games.** A top level tab with two card games, "The letting go run" and
   "The match". Source: `ui/games.js`, `engine/data/cards.js`.
3. **The progression spine underneath.** Unique ground opened (`meter.unique`),
   lines spoken (`meter.lines`), dated firsts (`meter.firsts`, written but never
   shown), and seven markers on a ruler scaled to the person's age. Source:
   `engine/schema.js`.
4. **The economy.** Patterns as the one unit a plan sells: a gift of 100,
   10 a week free, paid tiers. Source: `engine/plan.js`.

**What is designed but not built, and is most of the ambition:**

- The loop itself (discover, play, flow, embody) drawn as a ring, and the
  "turn" counter that closes when a person has been all the way round.
- A corrected and expanded set of 22 marks, and a 29 strong award shelf in four
  families.
- Karma as the reward currency.
- The content chain's middle: the person's own words grafted into the
  practice, an affirmation hedged from their sentence, and a sixty second
  "floor" ritual.
- The five quotients as readings (only CQ exists).
- The avatar as a figure. The engine half of the avatar exists. No picture of
  it exists anywhere in the product.

**The one sentence the whole system is judged against**, in my words and
unchanged across every design pass: *a person must be able to stop and be glad
they used it.* If a mechanic only works because leaving is punished, it does
not ship.

---

## 2. The rules under everything (contract)

These are rulings, not preferences. Every design pass has been held to them, and
the port must be too. Each one is enforceable in code, and the brief says where.

| Rule | What it forbids | Where it is held in the build |
|---|---|---|
| **A reading is never a score.** | Coherence, the band, the avatar and any quotient must never be shown as an achievement, a rank or a level. | `ladder.js` header; `DESIGN-ladder.md` 1.1 |
| **Never a count against a total.** | "3 of 14". A list of unearned marks. A completion bar on a person's own nervous system. | `ladderRead` returns only earned marks plus one next mark, by construction (`ladder.js:192`) |
| **A fact, never a cause.** | "Coherence up ten because you released." An award records that something became true on a date and says nothing about why. | `DESIGN-progression.md` 3.2; `DESIGN-gamification.md` 6.2 rule 1 |
| **Fixed, announced thresholds.** | Variable ratio reward, surprise, near miss, random prizes. Randomness may pick *which address* is dealt. It may never pick *how much* a person gets. | `DESIGN-progression.md` 3.5 |
| **Nothing expires, nothing is taken back.** | Scarcity timers, limited edition awards, battle passes, seasons that can be lost. | `DESIGN-progression.md` 1.12; `DESIGN-ladder.md` 4 item 8 |
| **Never name an absence.** | "Welcome back", "you missed", a streak freeze announced, a notification about a gap. | `DESIGN-progression.md` 4.4; `DESIGN-ladder.md` 4 item 5. **The build breaks this once**, see 5.9 |
| **No ranking of people.** | Leaderboards, friend groups with visible numbers, practitioner lists sortable by coherence. | `DESIGN-progression.md` 3.4; `DECISIONS.md` line 507 |
| **Reward is paid for the record, after the fact.** | A reward announced in advance for doing the practice. | `DESIGN-gamification.md` 6.3, measured at 3.2 points of 1000 at day 30 |
| **In a crisis, the product may hide what it sells. It may never hide what it measures.** | Upsells, the store, the marker ruler in front of a person at an acute reading. The marks and the record stay visible. | `DESIGN-progression.md` 4.1; `careState` is **DESIGNED**, not built |

**Refused mechanics, with their measured price.** A refusal without a price is
a preference. These are the design's own figures, from `tools/loopsim.js`: a
simulation on a weighted 1000 person panel, not an install cohort. They are
benchmarks, not promises.

| Refused | What it would buy (model, day 30) | Why not here |
|---|---|---|
| Loss framed streak or stakes | +3.0 points of 1000 | It works by making stopping feel like a loss, on a product that reads distress |
| Streak reset to zero (instead of halving) | The halving is worth 4.4 points, so resetting costs that | Lally 2010: habit formation does not reset when the counter does |
| Reward announced in advance for the act | minus 3.2 points | Deci, Koestner and Ryan 1999, d minus 0.40 |
| Asserted affirmation ("I am worthy") | minus 0.2 points | Wood, Perunovic and Lee 2009: it made the people who most needed it feel worse |
| Party damage (Habitica) | Not modelled separately. Loss framing with a social multiplier | It makes one person's distress another person's failure |
| Variable ratio reward, near miss, scarcity timer, leaderboard, fear of missing out push | Not modelled, on purpose | Schull, *Addiction by Design* |

In the model, the refusals got cheaper as the honest design improved. The loss
framing refusal was first estimated at "half again on day thirty" and measured
at a sixth once the rest of the design was in. That is the commercial argument
for the hard line.

**Vocabulary: OPEN.** `DESIGN-progression.md` 2.1 bans points, XP, score,
level, badge, achievement, trophy, streak, coin, rank and leaderboard from every
surface, and asks `tools/terms.py` to enforce it. **That gate was never
written.** `terms.py` contains none of those words. A later owner ruling,
recorded in the `ladder.js` header and TASKS GB1, says "badges, achievements
and a score" are in. The build uses "The record", "Marks", "running" and "last
run" on screen, not "streak" or "badge". The port should keep the built words
and treat the user facing vocabulary as the owner's call.

---

## 3. The core loop: discover, play, flow, embody

### 3.1 The ruling

In the owner's words (CLAUDE.md, 20 September): **"The process is discover,
play, flow, embody."** He corrected the last word himself: embody, not body.
Some design documents written before the correction still say "Body"
(`DESIGN-gamification.md` section 4, TASKS GM1 and AN3). Read those as embody.

**It is a circle, never a list.** In his words: "we're showing a core game loop
mechanic." A numbered column of four says the fourth step is the end, which is
the opposite of a loop. Wherever the four appear together, they close into a
ring.

**The core loop in one sentence**, from `DESIGN-gamification.md` section 4:

> A sentence is read for charge, the charge is released, the release deals a
> practice built out of that same sentence, the practice keeps the day, and the
> day is what the body is measured against next time.

### 3.2 Build status

**The loop as a drawn object: DESIGNED, NOT BUILT.** No live surface in
`atuned_src/` draws the ring, names the four quarters or counts a turn. The
words "discover" and "embody" do not appear in the live UI at all. The loop is
drawn only in two prototypes, `proto/onboard/onboard.html` and
`proto/ladder/index.html`, and those two map it differently.

The acts the loop is made of are mostly built: writing a story, releasing,
building and marking a ritual, taking a reading. What is missing is anything
that shows a person they are going round.

### 3.3 Four mappings, and they disagree (OPEN)

Four documents say what each quarter is, and no two agree. The owner has not
ruled on which one is correct.

| Quarter | `DESIGN-gamification.md` §4 (by act) | `proto/ladder/turn.js` (by timestamp) | `proto/onboard` (by tab) | TASKS AN3 (owner note) |
|---|---|---|---|---|
| Discover | Write or speak one entry; imprints named on the body | A story entry's `t` | Story | The journal |
| Play | The ritual dealt from the reading; practice and affirmation | A ritual saved, `rituals[].t` | Field | The imprints |
| Flow | Keep the day: mark it done or run the floor; the run, ledger and marks | A ritual marked done, `rituals[].done` | Ritual | The release |
| Embody | See what moved: the next reading, awards, the avatar | A snapshot, `history[].t` | Body | The ritual |

`proto/onboard/onboard.html` (lines 254 to 262) names the collision itself. The
by-act mapping puts one surface, Ritual, at two stations. So the tour uses the
by-tab mapping, which lets a person name four doors, and leaves the by-act
mapping to its own job of costing mechanics.

**Game director's recommendation, not a ruling:** build the counter on the
by-act mapping, because it is the only one that can be instrumented from
timestamps the profile already stores. Use the by-tab mapping only as the
onboarding tour's vocabulary. Keep the two separate in code, so that when the
owner rules, only a label changes.

### 3.4 The turn: the loop as a counter (DESIGNED)

Source: `DESIGN-ladder.md` sections 1 and 2; `proto/ladder/turn.js`
`turnRead`. It is not in `atuned_src/`. TASKS LD1 and LD2 are marked
delivered, which means the design was delivered. The code was not.

> **One closed circle is one turn, and a turn is the only thing this design
> counts.** In the owner's words: "the gamification exists to keep that turning".

**The arithmetic.** Merge four timestamp streams in time order and walk them
once. Keep the set of quarters touched. When all four are in the set, one turn
closes at that moment and the set empties.

```
turnStamps(p):
  discover <- p.story.entries[].t
  play     <- p.rituals[].t              (saved)
  flow     <- p.rituals[].done           (ISO string when marked done;
                                          legacy entry with no done key reads as done at t)
  embody   <- p.history[].t              (every snapshot)
turnRead(p, now) -> { n, turns[], last, lit[], open[], stamps, at{} }
```

Properties the design claims, with whether they hold:

- **It cannot be farmed.** Ten entries close no turns, and neither do ten
  rituals. A person has to go all the way round. This holds.
- **A turn does not have to close in one session.** Write on Monday, practise on
  Tuesday, see the reading move on Wednesday, and the turn closes on Wednesday.
  This holds.
- **It needs no schema change.** Holds for the counter. The floor mark and the
  awards need small additions, listed in section 6.
- **Curve:** `turns(d, c) = floor(d * c / 7)`. At a whole ring daily, that is
  1, 7, 30 and 90 turns by days 1, 7, 30 and 90. Twice a week gives 0, 2, 8
  and 25. The floor only gives 0. By design, a person on the floor alone never
  sees a turn as something they are missing.

**Defect in the design, found for this brief. Fix it before building.**
Committing a story writes a snapshot: `ui/storyui.js:104` calls `pSave();
pSnap();`. Running a release and saving the intake also snapshot
(`release.js:158`, `intakeui.js:361`). So the Discover act stamps Embody at the
same moment. As prototyped, a turn is really three acts: a story, a ritual
saved, and a ritual done. Embody, "see what moved", is never required as a
separate act. There are two ways to fix it: (a) Embody reads only snapshots
taken *after* the play stamp in the current open set, or (b) Embody is stamped
by viewing a reading surface, which needs a new write. Either way this is
**OPEN**, for the owner and the ladder seat. Do not port `turnRead` as written.

**Word collision, OPEN.** "Turn" is claimed twice. `DESIGN-ladder.md` uses it
for one closed loop. `DESIGN-quotients.md` and `proto/quotients/quotients.js`
use it as the word for EQ, the share of a held charge that has turned over.
The product rule is one word per concept, so one of the two has to move.
TASKS LD10 asks the owner whether "turn" is his word at all.

**The count shown as a number or only drawn: OPEN.** TASKS LD11. The prototype
prints the count. The alternative draws the ring with its lit quarters and no
number. The karma balance question is the same question.

### 3.5 The readiness ladder: what appears when (DESIGNED)

`DESIGN-ladder.md` 2.3; `turn.js` `READY`. A surface appears when the data can
support an honest statement, and not before. This is the progression-by-access
principle, and it is already how `seriesRead` behaves (BUILT: none, one, or a
line).

| Readings on file | What can then be said | Where it shows |
|---|---|---|
| 1 | a reading | the field, the body, the ladder |
| 2 | a direction | the graph draws its first line |
| 7 | an axis held its pole | the award shelf appears |
| 13 | a quarter of the graph | the quarter span stops being empty |
| 30 | a month at a daily cadence | the month span |

### 3.6 Session shape (DESIGNED)

`DESIGN-gamification.md` section 4. Most products are built for one visit
length and are hostile at the others. This table is the contract for what each
length gets.

| A visit of | Gets | And is not punished for it |
|---|---|---|
| 60 seconds | The floor: one sentence held against the body, and the day is kept | Recorded honestly as a floor day |
| 5 minutes | The practice called for, marked done | The journal entry can wait |
| 20 minutes | Write, commit, release, ritual, plan the next one | The whole ring once |
| An hour | Several releases, and the record read back | Nothing rewards this over the twenty minute visit |

The floor does not exist in the build, so today a 60 second visit can keep the
day only by saving a ritual. That works, because the streak counts a saved plan
(see 5.3), but the practice behind it is not sixty seconds.

### 3.7 Where each system sits on the ring

| System | Quarter | Status |
|---|---|---|
| Journal, the sniffer, imprints | Discover | BUILT (another seat) |
| Games: the match's "See the N running you" door into the Story tab | Discover | BUILT |
| Release run | Play (by act) or Flow (AN3) | BUILT |
| Ritual dealt by the seat carrying most | Play | BUILT |
| Games: the letting go run | Play, as practice at speed. No mapping places it | BUILT; placement OPEN |
| If-then plan (when and where) | Flow | BUILT |
| Streak, ledger, marks | Flow | BUILT |
| Floor ritual, stake sentence, season | Flow | DESIGNED |
| Awards (Cleared, Held, Moved, Closed) | Embody | DESIGNED |
| Quotients (CQ built; IQ, EQ, AQ, PQ) | Embody | CQ BUILT, the rest DESIGNED |
| Avatar figure and the kundalini rise | Embody, and the centre of the ring | DESIGNED |
| Turn count | The whole ring | DESIGNED |

---

## 4. The content chain

### 4.1 The ruling

In the owner's words (CLAUDE.md; TASKS GM3):

> What a person enters in the journal is added to the imprints. Part of that
> becomes a story they have to release. Part becomes a practice inside the
> ritual. Sometimes it becomes an affirmation, also in the ritual. The
> gamification exists to keep that turning, which means the content has to be
> driven enough to make it sticky.

**The design finding that shaped every pass** (`DESIGN-gamification.md` 5.1):
the loop was not short of mechanics. It was short of content. Measured through
the real `parseStory` against the fourteen persona voices the repository wrote
for its own target users: as built, the sniffer can cut a quotation out of
**1 of 14** of them, and **0 of 1000** of the weighted panel. Every mechanic
downstream of the journal starves at the source. "Tie the ritual to the
sentence it came from" was measured at exactly zero until that was fixed.
Sniffer quality belongs to the charge seat. The gamification consequence
belongs here: **a content chain mechanic is worth nothing until the content
arrives.**

### 4.2 The chain, step by step

| Step | What happens | Status | Where |
|---|---|---|---|
| **1. Journal to imprints** | A person writes. `parseStory` returns imprints, each with an address, a band and an amount. **Commit** is disabled until at least one imprint exists. On commit: `applyStory`, `verpApply` and `leanApply` write charge; an entry `{t, text, imprints:<count>, bands}` is pushed onto `p.story.entries`; the profile saves and a snapshot is taken. Undo is pushed first. The commit is refused on a reference persona. | **BUILT** | `ui/storyui.js:78` to `:107` |
| **2. Imprints to a story to release** | The release queue is the loaded addresses, heaviest first, or the ones this entry found. A run lowers charge, installs the coherent opposite, writes `meter.unique` and `meter.lines`, stamps `meter.firsts`, and takes a snapshot. | **BUILT** (arithmetic owned by another seat) | `ui/release.js:88` to `:159` |
| **3a. Story to practice: which practice** | `ritFor(compute())` takes the seat carrying the most (`r.darkB`), maps it to a track (`TRACK4BAND`: Root and Heart to Body, Sacral and Solar to Somatic, Throat and 3rd Eye to Mind, Crown to Energy), picks a tier from load (`DQ>=8` gives tier 1, `>=4` gives 2, otherwise 3), and calls the **shortest** practice in that track at or below that tier. The card shows one practice; the rest are behind a toggle. After a release, the ritual card says "After releasing N: ...". | **BUILT** | `ui/ritual.js:9` to `:32`, `:86` |
| **3b. The if-then plan** | "When" and "Where" fields in the person's own words, read back as "When X, at Y, you will Z." A saved ritual is a plan (`done:false`). **I did it** writes `done` as an ISO string. | **BUILT** | `ui/ritual.js:137` to `:205` |
| **3c. The practice carries the person's own words (the graft)** | One verbatim span of the person's own sentence, cut by the chain, becomes the practice's "contact line". It attaches only to Somatic and Mind track practices, never to breath or energy work. | **DESIGNED** | `DESIGN-gamification.md` 5.4 step 3; `proto/game/chain.js` |
| **4. Story to affirmation** | Never an assertion. Two forms, and the person's own text decides which. **Swap:** if the entry states an absolute about the self (an auxiliary plus never or always, or a bare cannot, with a first person pronoun within four words before it), the affirmation is that sentence with one word hedged. For example, "I ~~can never~~ **can not yet** say what I mean". The struck words and the replacement are both shown, the replacement in its own colour, and the person can edit it. **Question:** otherwise nothing is asserted. The coherent opposite and its seat are named as something to check against the body. | **DESIGNED** | `DESIGN-gamification.md` 5.4 step 4 |
| **5. Affirmation as the floor** | The affirmation *is* the sixty second version of the whole ritual. On a day with no twenty minutes, hold one sentence against the body and the day is kept. | **DESIGNED** | `DESIGN-gamification.md` 5.4 step 5 |
| **Frame layer** | Eighteen sentence *forms* (a negated receipt, a never clause, an inability to ask, a cost, an onset) read as charge and return a span. It is a third `kind` in the sniffer's hit list, under the same longest-match-wins rule. | **DESIGNED** (charge seat) | `proto/game/frames.js` |
| **Stemmer fold** | The proto version folds a word to its stem at scan time and keeps a back map so the quotation stays verbatim. **A different fold is built:** `lexFold()` in `engine/lexicon.js:429` pre-generates allowlisted inflections into `LEX` at load. They are not the same mechanism. | Proto **DESIGNED**; a fold **BUILT** in another form | `proto/game/stem.js`; `engine/lexicon.js` |

**The safety invariant, and it is a contract for whoever builds 3c to 5:**

> Every span the chain returns is a verbatim substring of the text the person
> wrote. The product may find, cut and mark. It may not write, complete or
> correct. One position is the exception: the hedge. It is named, marked in its
> own colour, and the person can overwrite it.

`tools/loopsim.js` validation 5 checks this across 42 runs.

**Schema the chain needs (DESIGNED, not present):** three fields on a saved
ritual, `span`, `graft` and `affirm` (`DESIGN-gamification.md` 5.4), and
`floor:true` on a ritual entry (`DESIGN-ladder.md` 1.3).

### 4.3 Two flow mechanics that sit on the chain (DESIGNED)

- **The stake sentence.** "What's at stake for you not doing this?" (TULA page
  219), asked once and read back. The comp is I Am Sober's onboarding.
  Modelled at 0.2 points.
- **The season.** Seven days with an end, and grace inside it. It is the only
  place in the design where stopping is a designed outcome rather than a
  failure. Modelled at 0.1 points and kept anyway, because the model has no way
  for a person to lapse and return, and the season exists for exactly that case.

### 4.4 The first session ends by showing what landed (DESIGNED, highest value)

`DESIGN-gamification.md` section 7, pass 9. This is worth 3.2 points on its own
in the model, more than any other single mechanic. Today, committing one entry
earns the **First story** mark (`told`), but the ladder renders only on Ritual
and the Compass, not on Story. So the first thing the product gives a person is
invisible at the moment they earn it. The design shows it on the surface where
it was earned.

### 4.5 Gating dependency to know about

The chain enters only through a commit, and a commit needs at least one imprint.
A person whose sentence the sniffer cannot read never enters the loop at
Discover. That is the charge seat's problem to fix. It is the gamification
seat's reason for saying the loop is content bound.

---

## 5. The ladder as built (contract)

Source: `atuned_src/engine/ladder.js`, 250 lines, host free and pure: every
function takes a profile and a moment. Exported in `engine/export.js:65`.
Rendered by `ladderHtml()` in `ui/cone.js:902`.

### 5.1 Its philosophy, from its own header

> Ruled: badges, achievements and a score. The last word is the hard one,
> because this product has a standing ruling that a reading is never a score
> and that a count is never printed against a total. Both hold here and neither
> is in the way, because a reading and a record are different things.

The **reading** is what is true of a person now. It has no maximum and is
nobody's business to score. The **record** is what they did. A count of what
happened is honest. What is refused is the shape "3 of 14". **Earned marks are
shown. The next one is named with what it takes. The ones beyond it are not
enumerated.**

### 5.2 Day keys: `pracDay`, `pracDays`

```js
var DAY_MS = 86400000;
function pracDay(t){           // t: anything new Date() accepts
  var d = new Date(t); if (isNaN(d)) return null;
  return Math.floor((d.getTime() - d.getTimezoneOffset()*60000) / DAY_MS);
}
function pracDays(p){          // distinct day keys with a saved ritual, newest first
  // walks p.rituals[], keys each x.t, dedupes, sorts descending
}
```

- The day key is a local calendar day number. It is derived from the stored ISO
  timestamp and never stored itself, so an old record still counts.
- **Port note.** The comment says "the local frame of whoever recorded it". The
  code actually uses the time zone rules of the machine *reading* the record
  (`getTimezoneOffset` at time `t` on the host). On a desktop build that is the
  same device, so it matches. A person who travels across time zones can see day
  keys shift. Keep the behaviour and do not store day keys.
- **What counts as a practice day: any ritual *saved* that day** (`x.t`), done
  or not. A plan saved and never done keeps the streak. The ledger separates
  planned from done (5.4). The streak does not. This is the build's contract,
  and whether it is right is **OPEN** (see 5.9 h).

### 5.3 The streak: `streakRead(p, now)`, exact

```js
function streakRead(p, now){
  var days = pracDays(p), today = pracDay(now || Date.now());
  if (!days.length || today === null)
    return {run:0, live:false, last:null, best:0, days:0};
  // RUN: walk oldest to newest
  var asc = days.slice().reverse(), run = 1;
  for (var i = 1; i < asc.length; i++){
    var gap = asc[i] - asc[i-1];
    if (gap <= 2) run++;                         // 1 = consecutive, 2 = one grace day, both extend
    else run = Math.max(1, Math.ceil(run / 2));  // 3+ halves; this day sits inside the halved run
  }
  // BEST: longest strictly consecutive run (gap exactly 1), no grace
  var best = 1, cur = 1;
  for (var j = 1; j < days.length; j++){
    if (days[j] === days[j-1] - 1){ cur++; if (cur > best) best = cur; } else cur = 1;
  }
  var gap = today - days[0];
  return {run, live: gap <= 1, last: days[0], best, days: days.length, gap};
}
```

The ruling behind it (Bible 1133): `Math.max(1, Math.ceil(s/2))` with one grace
day. **The run halves. It never resets.** Lally 2010 found that missing one
opportunity does not materially affect habit formation, so a miss costs a
penalty, not a demolition. The model puts the value of halving over resetting at
4.4 points of 1000 at day 30.

**What breaks it and what does not**, verified by running the shipped engine
for this brief:

| Case | run | live | best | Note |
|---|---|---|---|---|
| Practised today only | 1 | true | 1 | |
| Yesterday only, not today | 1 | true | 1 | **Today is not required.** Live while the last day is today or yesterday |
| Two days ago only (missed yesterday) | 1 | **false** | 1 | Reads lapsed, although practising today would continue it (see defect a) |
| Two days ago, then today | 2 | true | 1 | **The grace day costs nothing.** The run counts days practised, not calendar days. `best` does not honour grace |
| Ten days in a row, ended three days ago | 10 | false | 10 | A lapsed run is still reported at full length: "the thing a person built is not deleted by having stopped" |
| Ten in a row, a gap of 3, then today | 5 | true | 10 | Halved once |
| Ten in a row, a gap of **30**, then today | 5 | true | 10 | **A gap of 3 and a gap of 30 cost the same:** one halving per gap, whatever its length |
| Every other day, eight times | 8 | true | **1** | The run counts it. `best` never does |
| Twice a week, eleven practices | 1 | true | 1 | Every gap of 3 or 4 halves, so the run never climbs |
| A ritual saved today, not done | 1 | true | 1 | A plan keeps the streak |

In one line: **nothing breaks the run to zero. A gap of three days or more
halves it once. A single missed day costs nothing. Today is never required.**

### 5.4 The ledger: `ledgerRead(p)`

These are counts of events, with no denominators. It returns:

| Field | Computed as | Meaning |
|---|---|---|
| `minutes` | sum of `rituals[].min` where done | Minutes practised. A legacy entry with no `done` key counts as done ("a person's history is not ours to delete over a schema change") |
| `planned` | sum of all `rituals[].min` | Minutes planned |
| `done` | count of done rituals | |
| `rituals` | `rituals.length` | Rituals saved |
| `lines` | `meter.lines` | Every line spoken, repeats included |
| `ground` | `meter.unique.length` | **Pattern keys**, `nodeId:channel:line`. Not addresses (see 5.9 d) |
| `clear` | axes in `CHILD` (the nine) with `p.axes[nm].opp >= 4` | A count of **axes**, although the source comment says "addresses". The only quantity that can go down, because it is a state |
| `carry` | axes with `p.axes[nm].held >= 4` | |
| `snaps` | `history.length` | Readings on file |

### 5.5 The marks: `MARKS`, all sixteen

Every mark is `{k, fam, b, nm, d, ic, t}`. The key `k` is identity, and must be
kept, because a mark is compared against records people already hold. `fam` is
the family. `b` is the seat whose colour the family takes. `ic` is an SVG path
in a 24 by 24 box, stroked and not filled. `t(ledger, streak, profile)` returns
a boolean. Nothing in a test reaches outside those three arguments. A throwing
test counts as not earned.

**The families, and why each sits at its seat.** Practice sits at the **Root**,
because keeping up is what everything else stands on. Ground sits at the
**Throat**, because opening ground is the act of saying the thing. Structure
sits at the **Heart**, because it is what changed in the field.

| k | Family (seat) | Name shown | Test as built | Can be lost? |
|---|---|---|---|---|
| `first` | Practice (Root) | First run | `l.rituals >= 1` | no |
| `week` | Practice (Root) | Seven days | `s.best >= 7` (strictly consecutive) | no |
| `month` | Practice (Root) | Thirty days | `s.best >= 30` | no |
| `season` | Practice (Root) | Ninety days | `s.best >= 90` | no |
| `hour` | Practice (Root) | Sixty minutes | `l.minutes >= 60` (done only) | no |
| `ten` | Ground (Throat) | Ten addresses | `l.ground >= 10` (pattern keys) | no |
| `fifty` | Ground (Throat) | Fifty addresses | `l.ground >= 50` | no |
| `told` | Ground (Throat) | First story | `p.story.entries.length >= 1` | no |
| `kept` | Ground (Throat) | Ten stories | `p.story.entries.length >= 10` | no |
| `nine` | Structure (Heart) | Nine axes | `l.clear + l.carry >= 9` | **yes** |
| `laws` | Structure (Heart) | Laws measured | `!!p.intake.completedAt` | no |
| `stated` | Structure (Heart) | Blueprint stated | `!!p.seed` | yes, if the seed is cleared |
| `aimed` | Structure (Heart) | Purpose set | `purposeReady(p.purpose)` (three soul and three ego values) | yes, if edited below six |
| `turned` | Structure (Heart) | First clearing | `l.clear >= 1` | **yes** |
| `seat` | Structure (Heart) | Five clear | `l.clear >= 5` | **yes** |
| `watched` | Structure (Heart) | Ten snapshots | `l.snaps >= 10` | no |

The full `d` copy (what each mark means) is in `ladder.js:122` to `:190`.
Carry it verbatim. It is the owner's voice.

**Marks are not stored.** They are recomputed on every render, carry no earned
date, and there is no `p.marks` field. So any mark whose test reads a state
(`nine`, `turned`, `seat`, `stated`, `aimed`) can disappear if the state moves
back. See 5.9 g.

### 5.6 Earned and next: `ladderRead(p, now)`

```js
function ladderRead(p, now){
  var l = ledgerRead(p), s = streakRead(p, now), got = [], left = [];
  MARKS.forEach(m => (safe(m.t)(l, s, p) ? got : left).push(m));
  var by = {}; got.forEach(m => by[m.fam] = (by[m.fam] || 0) + 1);
  var lead = null, best = -1;
  left.forEach(m => { var n = by[m.fam] || 0; if (n > best){ best = n; lead = m; } });
  return {earned: got, next: lead, ledger: l, streak: s};
}
```

- **`next` is exactly one mark:** the first unearned mark, in `MARKS` order, in
  the family where the person has earned the most. Ties go to the earlier
  family in `MARKS` order. On a blank profile it is `first`.
- "Nearest" means nearest in table order, not nearest in distance. With only
  `first` earned, `next` is `week`, even if `hour` is closer.
- **Everything past `next` is not returned**, so no caller can render a
  checklist of a person's unfinished self. **Port this shape exactly.** The
  length of `MARKS` must never reach a surface as a denominator.
- `next` is shown with its name and its `d` sentence. There is no progress
  meter toward it.

### 5.7 The series: `seriesRead(p, spanKey, now)`

`SPANS`: day 1, week 7, month 30, quarter 90 (the default), year 365, five years
1826. It returns `{span, state:'none'|'one'|'line', pts[{ms,cq,ig}], n, lo, hi,
first, last, dir, t0, t1}`. **One reading is not a flat line.** `dir` is set
only in the `line` state. It feeds the graph on the Compass and on Summary,
which the ruling says "opens Summary". Minor: `pts[].ig` is filled from the
snapshot's `jq` (overshoot), not from integrity. Check the naming before
porting.

### 5.8 How it renders: `ladderHtml()` in `ui/cone.js:902`

It takes no arguments. It renders on two surfaces: inside the Ritual builder
(`ui/ritual.js:161`, "the record, on the surface that earns it") and in the
Compass information rail (`cone.js:804`). Both use the same function, so there
is only one place a streak can be wrong from. In order:

1. **The run.** A large number `s.run`, then "day" or "days", then "running" if
   live or ", last run" if not.
2. A line under it: nothing on the record yet, or the lapsed message (defect a
   and b), or "Longest held: N days" when `best > run`.
3. **The accountability half.** "Today is on the record." or "Today is not on
   the record yet.", plus one button, "Build today's ritual" or "Run another",
   that opens the existing builder. The ladder writes nothing itself.
4. **The ledger**, with one word per label and the unit on the figure:
   Practised (minutes), Planned (only when it differs from practised), Saved
   (rituals), Opened (`ground`, labelled "addresses"), Installed (`clear`,
   "axes").
5. **Marks.** Each earned mark shows its ring icon in the seat colour, its name
   and its sentence.
6. **Next.** The name of the next mark in bold, then its sentence.

### 5.9 Defects in the built ladder

For each: do not copy it blindly, and do not silently fix it either. Each has a
source.

| # | Defect | Evidence | Recommendation |
|---|---|---|---|
| a | **The copy denies the grace day.** With the last practice two days ago, `live` is false and the surface says "The run ended 2 days ago ... Practise today and a new one starts." Practising today continues the run (gap 2 extends it). | Reproduced, 5.3 row 3; `cone.js:916` | Fix: `live` should be `gap <= 2` to match the walk, or the copy must stop claiming a restart |
| b | **It names the absence.** "The run ended N days ago" prints the gap, which the design forbids. | `DESIGN-progression.md` 4.4; `DESIGN-ladder.md` 4 item 5 | Fix: drop the day count. "Last run" alone carries it |
| c | **Three practice marks demand a perfect row.** `week`, `month` and `season` read `best` (strict), while the run beside them honours grace. Measured: eight practices every other day give a run of 8 and no Seven days mark. Twice a week never earns one. | 5.3; `DESIGN-ladder.md` 1.4 item 1; TASKS LD3 (open) | `DESIGN-ladder.md` corrects them to count days practised (`s.days`). OPEN until built |
| d | **"Ten addresses" counts pattern keys.** One address run across four channels is four keys, so the mark passes at about 2.5 places, under copy that says "Not ten runs. Ten places." The ledger row "Opened N addresses" and the marker line on the record surface (`ui/record.js:113`) share the mislabel. | `DESIGN-ladder.md` 1.4 item 2 | Count distinct node ids (`key.split(':')[0]`) |
| e | **"Ten stories" is farmable.** Ten entries in one sitting earns it. | `DESIGN-ladder.md` 1.4 item 3 | Ten distinct days with an entry |
| f | **"Nine axes" disagrees with its own copy**, and double counts. "Every one of the nine has a value you entered" tests `clear + carry >= 9`, which ignores axes below 4, and one axis with both `held>=4` and `opp>=4` counts twice. "First clearing" and "Five clear" say addresses but count axes. | `DESIGN-ladder.md` 1.4 item 4 | Test what the copy claims. Say "axes" |
| g | **Marks can be lost and carry no date.** They are recomputed each render from state. | 5.5 | OPEN. The designed awards are "conferred once, dated, never removed" in `p.awards`. Whether marks get the same treatment is not ruled. I recommend they do |
| h | **The streak counts saved plans, not practice.** | 5.2; `ritual.js:192` to `:198` | OPEN. The designed turn separates saved (Play) from done (Flow). A floor day (60 seconds, marked done) is the honest replacement for "save a plan to keep the day" |
| i | **The engine is not strictly host free.** `streakRead` falls back to `Date.now()` when `now` is omitted. | `ladder.js:47` | Callers pass `now`. Keep that |

### 5.10 The progression spine the ladder sits on (BUILT, engine)

`engine/schema.js:795` to `:1010`.

- **`meter`**: `{lines, unique[], firsts[], first, last}`. `meterKey(nodeId,
  chan, line)` builds `"id:chan:line"`. `LINES_PER_CH = 50`. `meterRun` counts
  every line spoken but adds a key to `unique` only if it is new, so **a rerun
  of ground already opened is free, forever**.
- **Dated firsts (`meter.firsts[]`)**, each `{k, t, nm}`. They are written at the
  end of every release run by `meterFirst`: `addr:<id>` labelled "Key, Seat",
  and `seat:<seat>` labelled "first release at the seat". Deduplicated, never
  removed, validated at the boundary. This is the product's own collection log.
  **It is written and never rendered**: `RUN.firsts` is filled and nothing reads
  it. `DESIGN-progression.md` 2.5 designs a firsts shelf: a dated list, newest
  last, no empty slots, no count. **DESIGNED.**
- **Markers (`MARKERS`, `markersFor`, `meterRead`)**: seven distances on one
  ruler. Entry is at 1. Then Breaking duality at 1/30, The Still Mind 5/30, The
  Open Heart 7/30, Clear Perception 9/30, Beginning of Nirvana 20/30, and
  Ascension at 30/30 **of the person's own load**, which is `age x
  PAT_PER_YEAR (300)`. Without a birth date the reference is 50 years (15,000).
  `meterRead().next` returns one marker only. The marker is rendered as the
  next distance on the record surface (`ui/record.js:110`). **A marker never
  gates anything** (`schema.js:941`). Its scale against the key space is
  **OPEN**: `DESIGN-progression.md` 0.1 finds most distances outside what the
  meter can ever hold, and asks for statement keying. That is the owner's call.

---

## 6. The ladder as designed (DESIGNED)

Source: `DESIGN-ladder.md` (written later than `DESIGN-gamification.md`, and it
overrules it where they differ) and `proto/ladder/turn.js`, the module written
in the shape it would take as `atuned_src/engine/turn.js`. It is host free, and
the caller passes the moment.

### 6.1 Three kinds of recognition, three different jobs

`DESIGN-gamification.md` section 6:

> **A mark counts what you did. An award records what moved. Karma is what
> either one pays.**

### 6.2 Marks: `MARK2`, 22, one family per quarter of the loop

The family sits at that quarter's seat. That is the "sewing" the owner asked
for: the shelf reads as the circle.

| Quarter | Seat | Marks |
|---|---|---|
| Discover | 3rd Eye | `told` First story; `kept` Ten stories (**10 distinct days**); `ten` and `fifty` (**distinct node ids**); **`named` Every seat opened** (new: ground at all seven seats) |
| Play | Sacral | `first` First run; `hour` Sixty minutes; **`tracks` Every track run** (new: the track count is read from `PRACTICE` at run time, never typed); **`floor` The short run** (new: needs `floor:true` on a ritual entry) |
| Flow | Root | `week`, `month`, `season` (**`s.days`**, days practised, not a strict row); **`back` Came back** (new: a gap of 14 days or more, then a day of practice) |
| Embody | Heart | `nine` (tests what the copy says); `laws`; `stated`; `aimed`; **`poled`** First clearing (the key renamed from `turned`, the name shown unchanged); `seat` Five clear ("Five axes"); `watched` Ten readings |
| The turn | Solar | **`ring` First turn**; **`rings` Ten turns** |

Fifteen of the sixteen keys are kept. The one rename, `turned` to `poled`,
frees the word "turn". **Porting note:** `markRead` returns `total:
MARK2.length`. That value must never reach a surface.

**Came back is the mark this design exists to make possible.** Every practice
badge in this category pays for an unbroken row, so the only thing it can say to
someone who stopped is that they failed. Came back *requires* the gap. It cannot
shame an absence, because an absence is its condition. It reads `gapMax`, which
is never rendered, because a number beside the word "gap" is a product naming an
absence. Whether it is earnable once or every time is **OPEN**
(`DESIGN-ladder.md` 6 Q5). The design proposes once.

### 6.3 Awards: 29, four families, conferred once

| Family | Count | What it records | Needs | Ready today? |
|---|---|---|---|---|
| **Cleared** | 7, one per seat | An address at that seat whose far pole exceeds what it carries | `compute()` per address | computable now |
| **Held** | 9, one per axis, **named for the opposite** ("Trust held", not "Fear held") | That axis at its coherent pole for **7 readings in a row** | The nine held and nine opposite values on each snapshot (18 base-36 characters, about 3.6 kB at 200 snapshots) | **no**, needs a schema addition |
| **Moved** | 9, one per band boundary (`TIERDEF`) | Coherence crossed a band boundary **upward**, on a date | `p.history[].cq` | computable now |
| **Closed** | 4 (a quarter, half, three quarters, all of it) | `(cq now − cq first) / (ceiling first − cq first)`: the drag coming off, against the person's own ceiling | The ceiling on each snapshot (one number) | **no**, needs a schema addition |

**Why Held exists** (`DESIGN-gamification.md` 6.2): four of the sixteen marks
can never be earned by the 465 of 1000 on the panel whose reading holds nothing
above the release threshold (`sq >= 4`). An award family that needed a release
would repeat that mistake.

**Why Closed exists** (`DESIGN-ladder.md` 3.5): at ninety days, before Closed,
the shelf was empty for the two most loaded people on the roster. Gordon moved
from 0.8 to 3.0 against a ceiling of 3.1, which is 94 percent of the distance
available to him, all inside one band and with no pole anywhere. **The band
ladder measures a person against everybody. The ceiling measures a person
against themselves.** With Closed, the measured range at ninety days moves from
0 to 8 awards to 3 to 11. Nobody does ninety days of work and gets nothing.

**Rules the awards inherit:**

1. A fact, never a cause.
2. Fixed thresholds, announced. A person can see the next one coming and choose
   not to chase it.
3. **An award's colour is where in the body it happened, not which family it is
   in.** A root Cleared is root coloured, and Trust held is root coloured because
   Fear sits at the root. The family is carried by ring geometry instead: open,
   solid, half, quarter. Moved and Closed take the neutral ink. This overrules
   `DESIGN-gamification.md` 6.2, which coloured by family.
4. **Moved is upward only.** This overrules `DESIGN-gamification.md` 6.2, which
   allowed both directions. A shelf is read as a list of achievements, so a
   downward crossing on it would congratulate someone for getting worse. The
   downward crossing belongs on the graph.
5. Conferred once, dated, never removed. Stored in `p.awards[] = {k, t, at}`,
   capped at 400 like `supply.log`. Nothing about a person's state is stored:
   the entry says an award became true on a date.
6. The shelf appears at 7 readings (3.5), and it lives on the surface where the
   release happened (`DESIGN-gamification.md` section 9 requirement 1).

`turn.js` `AWARD_READY = {Cleared:true, Moved:true, Held:false, Closed:false}`
says, in code, which families work today.

### 6.4 Build order (DESIGNED)

From `DESIGN-ladder.md` section 5. Each step ships alone.

1. `turnRead` and the ring, after the embody defect in 3.4 is fixed.
2. The five corrections to `MARKS`.
3. The six new marks. `floor` needs `floor:true`.
4. Cleared and Moved, plus `p.awards`.
5. The two snapshot fields: the ceiling, and the nine axes as 18 characters.
6. Held and Closed.
7. The award shelf on the surface where the release happened.

**Never:** a marker used as a gate, a turn that buys anything, a consecutive-day
counter that resets, a notification that names an absence, or a shelf that shows
awards the person does not have.

### 6.5 Open, the owner's calls

- **LD9.** Is a release allowed to *lower* coherence? Twenty two releases with
  the product's own arithmetic move Sofia from 56.6 to 55.1 and Lance from 87.6
  to 84.7. Closed never punishes a fall, but a person watching the number drop
  after ninety days of work is the worst outcome this product has.
- **LD10, LD11.** Is "turn" the word? Is the count printed, or only drawn?
- **LD12.** Do snapshots get the two new fields? This is a schema question, so
  it is the owner's under the SOURCE compatibility contract.
- **Came back:** earnable once, or every time?
- **`DESIGN-gamification.md` Q8.** What happens to a Held award for a state the
  person is no longer in? It is still a true fact about a date, but a wall of
  awards about a state someone has left is its own kind of cruelty. No rule has
  been proposed that is neither dishonest nor unkind.

---

## 7. The reward: karma and the economy

### 7.1 What is built (BUILT, `engine/plan.js`)

The only unit is the **pattern**: one release line delivered, keyed
`node:channel:line`.

- **The gift:** 100 patterns, once, with everything visible.
- **Free:** 10 a week, for life.
- **Tiers one to three:** 400, 800 and 1,200 a month.
- **Tier four:** 1,200 a month plus the cohort lead suite.
- **Sight is not for sale.** Every tier, free included, sees the whole reading.
  What money buys is new ground.
- **A rerun costs nothing.** `planAllowance` charges unique keys only.
- **Runs:** `RUN_MAX = 25` caps a run. `RUN_MIN = 4` is the smallest run (one
  address across four channels), and it is the unit allowances are counted in.
- **Spend is never stored:** it is always the unique count minus the base.

**Nothing in the build pays a pattern for a mark, a streak or a game.**
Earned currency does not exist.

### 7.2 Karma (DESIGNED)

`DESIGN-gamification.md` 6.3 to 6.5; `proto/game/one.html`; rates in
`proto/game/data.json`.

**Paid for the record, after the fact. Never promised in advance for the act.**
The design is costed on reading karma as *the name for patterns a person earned,
not a second unit that buys them*. That gives one supply from two sources:
granted (the gift, the plan, a purchase) and earned (karma). It also passes the
single currency gate in `DESIGN-progression.md` 2.2. And it is the owner's own
line made literal: "all the stories basically are karmic patterns" (TASKS AK5).

| Act | Pays, in patterns (prototype rates) |
|---|---|
| A ritual marked done | 1 |
| A journal entry that produced at least one imprint | 1 |
| A mark earned | 5 |
| An award conferred | 5 |
| A season finished (seven of seven, with grace) | 8 |
| A floor day | 1, ritual only, recorded as a floor day |

| Spend | Costs |
|---|---|
| One address across four channels (the floor run) | 4 |
| A release run at the cap | 25 |

A person who runs the whole ring every day earns 22 a week. With the free 10,
that is about 139 a month: 35 percent of tier one, earned only by using the
product every day. Twice a week reaches a full-cap run every 1.8 weeks.
Simulated over 90 days: 95.2 percent of the panel could afford a floor run,
median day 1, and 42.3 percent a full-cap run, median day 7.

The owner's own words on the economy (TASKS AN4 and AK1 to AK6):
"Whenever you get an achievement or badge, that's your good karma." Points are
drawn as "a lightning bolt with lines coming off it" and buy patterns at the
store. Achievements are "success: you cleared a fetter, a saboteur, a hyper
complex, and they scale by the fetters upward." The referral pays 25 patterns.
Karma gets a ring icon.

**The owner's achievement idea is not designed anywhere.** Achievements for
clearing a saboteur or a hyper complex, scaling upward by fetter, do not appear
in either ladder design. The nearest is the Cleared award family. Treat it as an
unbuilt, undesigned requirement and **OPEN**.

### 7.3 Open, the owner's calls

- **Which word:** patterns, points or karma, and is karma a second unit with an
  exchange rate? `DESIGN-progression.md` rules one currency (patterns),
  `PRODUCT.md` says points, and AK2 says karma. This blocks every rate above.
- **The rate per mark.** The prototype pays 5. TASKS asks "25 or 10". **The
  documents disagree.** At 5, all sixteen marks are worth 80 patterns, 20
  percent of a tier one month, handed to someone who never pays. Either call
  that the second half of the gift, out loud, or lower the rate.
- **Is the balance printed as a number?** The prototype prints it, which is the
  only place the design may break the no-totals rule. It is the same question
  as LD11.
- **A cap on Held awards over years**, which needs a rule before it needs a
  rate.
- **Is a floor day equal to a full day on the record?** The design pays it 1
  instead of 2 and marks it as a floor day. The alternative is simpler, and it
  is what Finch does.

---

## 8. The card games (Games tab)

### 8.1 The ruling and the tab

**BUILT.** `TAB.GAMES = 7` (`engine/core.js:55`), with its own `TABDEF` entry
(`core.js:106`) and a host `#games`. `ui/panels.js:214` calls `gmRender()` when
the tab is shown, defaulting to the letting go run, and `lgStop()` on leaving.
The ruling, recorded at `core.js:99`:

> GAMES COMES BACK OUT. Ruled, and it reverses the fold that put it inside
> Knowledge to get the bar to seven. They are independent games, a place a
> person goes for brain release, and a game folded into a reference page is
> neither.

The comment at `core.js:68` to `:73` still describes Games as folded inside
Knowledge. It is stale. The code at `:106` and `TABREAL` (`:123`) is the truth.
Do not port the comment.

The surface's own framing is "The instrument at practice speed". The header
comment says the games are "the instrument at practice speed rather than a
diversion bolted on the side", and **"Both deal from the engine. Neither invents
a pattern."**

**Games writes nothing to the profile.** There is no charge change, no meter
entry, no streak day, no mark and no snapshot. All state is module level (`GAME`,
`LG`, `MT`) and is lost on reload. A game played is invisible to the ladder.
Whether it should count is **OPEN**. My view: a completed letting go run is a
practice in the Play quarter and should be able to keep the day as a floor-sized
act. It should never pay patterns, because it opens no ground.

### 8.2 Game one: The letting go run

**Premise**, from the file: 24 cards face down, a pole, and a clock. Turn a
card, say the line at that address, turn it back. "The clock is the point: the
practice is two or three minutes and a person who has never timed it does not
believe that."

**The deal: `lgPool()` then `lgStart()`, exact:**

```js
const LG_N = 24;
function lgPool(){
  var r = compute(), held = r.loaded.slice();          // addresses with sq >= 4, in field order
  if (held.length < LG_N){                              // pad from the rest, by sq descending
    var rest = W.filter(n => held.indexOf(n) < 0).sort((a,b) => b.sq - a.sq);
    held = held.concat(rest.slice(0, LG_N - held.length));
  }
  return held.slice(0, LG_N);
}
// lgStart: Fisher-Yates shuffle with Math.random; each card {n, face:false, m:false, f:false};
// pole = 'm'; clock t0 = now; a 250 ms interval repaints #lgclock
```

**Card state and turning (`lgTurn`):**

- The first press flips a card face up and makes it the open card. Pressing a
  different card flips the open one back down without marking it.
- A second press on the open card puts it down and marks **the current pole's
  side** done: `c[LG.pole] = true`.
- A card already done on this side, or fully done, ignores presses.
- **The pole** is chosen with two chips from `C3_POLE`: Masculine (right
  channel, sympathetic, structure and direction) and Feminine (left channel,
  parasympathetic, energy and receptivity). The spec says feminine is not women
  and masculine is not men. Switching pole puts every card face down and closes
  the open card.
- **A card is done** (`lgDone`) when every side it actually has has been run.
  A split card needs both `m` and `f`. A bilateral card needs either one.
- **The run is complete** when every card is done. The clock stops, and the
  surface says "Run complete. Twenty four addresses cleared in m:ss. Deal again,
  or open the release to commit it."

**What the card says (`lgLine(n)`).** There is a fixed priority, and the source
is always named on the card so a catalogued sentence can be told from a
constructed one:

1. **A printed card** (`CARDSET`, the owner's Soulcraft Release Protocol cards
   No.01 to No.03), if the address's fetter `n.cf` has one: Anxiety on
   `Anticipation`, Grief on `Sad`, Anger on `Anger`. The line index is
   `|n.i| mod 5` (five paired lines per side), so one axis does not repeat.
   Release: `C3_STEM + side.rel[i]`. Truth: `C3_TRUTH + side.tru[i]`. **Split:**
   the masculine and feminine sides say different things, so both must be run.
2. **Else an axis card** (`AXCARD`, the nine axes Letting Go cards), if the
   fetter has one: Fear, Shame, Disgust, Apathy or Shock (Anger and Sad are
   taken by rule 1). It shows the track statement, the release built on the
   axis card's own gate roster (`AX_STEM` over `C3_GATE9`), and the card's
   install sentence as the truth. **Bilateral:** one pass clears it.
3. **Else the strict syntax** at the address: `C3_STEM + key + "."`, with the
   truth `C3_TRUTH + "moving toward <coherent opposite> at this address."`, or
   `"not <key>."` when the axis is unknown. Surprise lands here. Bilateral.

`C3_STEM` is "I am letting go of believing, perceiving, thinking, behaving,
acting, feeling, speaking, saying, and doing that I am ". `C3_TRUTH` is "I now
embody the truth that I am ". The nine gate verbs are shown as chips on the
intro. Two gate rosters exist, and the disagreement is recorded rather than
resolved (`cards.js:36` to `:44`). **Nothing in this game writes a sentence the
catalogue does not.** Port the catalogue verbatim: every string in `cards.js`
is the owner's wording.

**Copy on the surface** (verbatim, owner's): `CARD_OPEN` ("Turn your senses
inward before you read..."), `CARD_SHUT` ("If you felt resistance on any line,
stay with it..."), and `C3_BILATERAL` ("All releases run bilaterally, fifty left
and fifty right...").

**Relationship to charge, and the defects found:**

- **On a blank profile it deals 24 addresses with zero charge.** Reproduced for
  this brief. `loaded` is empty. Every `sq` is 0, so the pad sort does nothing
  and the deal is the first 24 addresses in field order: all 16 Root and 8
  Sacral. The same happens for anyone carrying nothing (Rosa on the roster).
  The intro copy "dealt from what you are carrying" is false for these people.
  This matches the defect CLAUDE.md records.
- **One of those 24 is `Root_08_Unnamed`,** which has no fetter (`cf` null).
  Rule 3 then prints "...that I am root_08_unnamed." and "I now embody the truth
  that I am not root_08_unnamed." That is a developer placeholder read aloud as
  a release line. `Root_08_Unnamed` is already on the owner's open list.
- **For a heavily loaded person, the deal is not the heaviest 24.** `loaded` is
  in field order and is truncated, not sorted. Gordon, with 97 loaded, is dealt
  15 Root and 9 Sacral, and only 13 of his heaviest 24. "Drawn from the
  heaviest" is true only for the padding.
- **"N of 24 cleared"** on the meter is a count against a total. "Twenty four
  addresses cleared" claims a clearing the engine never records: nothing in the
  field changes.
- **Recommendation for the port:** deal from `compute().carrying` (every address
  with `sq > 0`, already sorted heaviest first), and pad only if needed. On an
  unread profile, do not deal: show the four doors, the way both reading
  surfaces do. Drop the denominator and say what happened ("said", not
  "cleared"). The owner rules on the copy.

### 8.3 Game two: The match

**The deck is fixed, not dealt from the field.** It is `CHILD.slice(0, 8)`: the
first eight of the nine axes (Fear, Anger, Shame, Disgust, Apathy, Shock, Sad,
Surprise), two cards each, Fisher-Yates shuffled. Anticipation, the ninth, is
never in the deck, and the finish screen says so: "The ninth, Anticipation, is
not in this deck." The header copy "Both deal from your own field" is false for
this game. Only the reveal reads the field.

**Rules (`mtTurn`):** turn two cards. A match marks both done, increments
`found` and opens the pair. A mismatch locks input for 700 ms, then turns both
back. Faces show the axis's ring icon (`c.ic`) in its seat colour.

**What a match opens (`mtBlock`):** the axis's seat, its name, "toward <coherent
opposite>", the address and location, how many addresses it runs, how many of
those are carrying in *this person's* field (`sq >= 4`), held and installed
values from `S.charge` and `S.replace`, and the line "Release empties the
address, the opposite is what fills it." If anything is carrying, a button reads
**"See the N running you"**. It preselects those addresses (`IMP_PICK`) and
jumps to the Story tab. **This is the only built link from a game back into the
loop, and it enters at Discover.**

"N of 8 matched" on the bar is a count against a total. The same fix applies.

### 8.4 Designed extensions (DESIGNED)

- **Phase two** is printed on the live surface as "A narrated walkthrough of how
  a matched pair actually runs, unlocked by matching it. Not built." No design
  document specifies it beyond that sentence. Unlocking by *understanding* (the
  Obra Dinn model) is the right shape for progression here.
- **The deal as ceremony, and the wheel** (`DESIGN-progression.md` 3.5). The
  owner wants something that spins. It spins over **addresses, not rewards**:
  one spin selects the next address to run from what is carrying, weighted by
  nothing but what is carrying, with a free respin. Every spin is worth the
  same, so nothing is won. This is the design's answer to the loot box. A paid
  random reward is refused: the Belgian four-element test (a game, a wager,
  chance, and a prize that influences progression) is met exactly if patterns
  come out of a box.
- **Print the last time of the deal** (`DESIGN-progression.md` section 6
  opportunities). Store nothing else.

---

## 9. The five quotients

Source: `DESIGN-quotients.md` (ruled 21 September; TASKS QT1 to QT7) and
`proto/quotients/quotients.js`, which is written to load the real engine. **Only
CQ exists in `atuned_src/`.** A search of `atuned_src/**/*.js` for `IQ`, `EQ`,
`AQ`, `PQ`, `WQ`, `apertureRead` and `releaseRead` returns nothing, apart from
glossary text.

Every quotient is a function of the record. **None is ever stored.** A stored
quotient drifts when the model moves (`DESIGN-quotients.md` section 8). Each
reads its own unread state: a blank profile shows "unread", never nought.

| Q | Word | What it measures | Formula (designed) | Built from | Status |
|---|---|---|---|---|---|
| **CQ** | coherence | Absence of internal contradiction. "Coherence is the laws." | `(Intention x Integrity) / Resistance`, 0 to 100; `tier` from `tierOf(CQ)`; `unread` when nothing is entered | `compute().CQ`, `cqCeiling()` (not exported from `export.js`, a known gap) | **BUILT** (`engine/compute.js:140`) |
| **IQ** | aperture | Awareness. The owner: **"Fetters narrow awareness. We probably have a more realistic measure of awareness, of IQ, based off the fetters a person adds to their system."** Tied to fetters held, not to self report | `radius = mean(n.open over addresses that can hold) / clamp ceiling (1.18, measured at load)`; `area = radius²`; `factor = 1 / (aware share x 0.70 + ignorant share x 1.30)`, which is 1 when there are no gate cues; `aperture = clamp(area x factor − JQ x 4.2 / 100, 0, 1) x 100` | `n.open` (already computed at `compute.js:62`), `verpScan` gate cues, `JQ` | **DESIGNED** |
| **EQ** | turn (and WQ, wisdom) | Transmuting: how much of what sits at an address has turned over to its opposite | `turn at address = n.rep / (n.rep + n.held)`; `EQ = mean over addresses where either is present − JQ x 4.2`, clamped. Uses `rep`, not `pole`, so an opposite installed but still under water counts | `n.rep`, `n.held`, `JQ` | **DESIGNED** |
| **AQ** | release | Adversity met. The owner: "it is the release mechanism". Not a count of cleared addresses, because a release takes the condition off the thing and the thing survives | `met = highest shadow weight ever recorded`; `AQ = clamp((met − now) / met, 0, 1) x 100`. States: none and one read as unread, a line reads. "Nothing carried" is not applicable, not nought | `p.history`, the snapshot shadow weight | **DESIGNED** |
| **PQ** | boundary | The physical, as navigated by the ego. His list: nutrition, mindset, the patterns held, growth, "think about a boundary" | `PQ = boundaryCount(p.purpose).filled / 30 x 100`, labelled **stated** everywhere, because it is coverage of what was typed, not a measurement. `boundaryCross` is shown as a notch on a side and never folded in | `boundaryCount` (**BUILT** in `avatar.js`) | **DESIGNED** |

**Why AQ matters to the gamification.** It is the credit the instrument was not
giving. Measured on Ana: two release runs move coherence 9 points and leave her
near the bottom of the band ladder. AQ reads 98: "she has spent ninety eight of
the hundred that was ever available to her". The same finding drives the Closed
award family and the kundalini rise. For about half the panel, coherence barely
moves under release, and something else has to show the work.

**How each ties to the loop.** IQ's recognition term is reachable only through
what a person writes (Discover). EQ moves with installed opposites, from release
and reframe (Play and Embody). AQ is the Embody reading of Play. PQ comes from
the purpose map and boundary (the avatar). CQ is the laws, which move by conduct,
not by release.

**The drawing (DESIGNED): one iris, not five gauges.** The rim is PQ (six arcs,
thinner, because it is stated). The clear opening is IQ, area true. Nine blades,
one per axis in seat colour, are EQ: radial when nothing has turned, tangential
when the opposite is fully in, with a ring at the tip for overshoot. A sweep
around the track is AQ. The centre shows the CQ number and tier word, not a ring,
because the Field already draws coherence. A radar chart is refused, because
reordering its axes changes its area. The iris would *replace* the Summary glance
row of six rings.

**Open, the owner's calls** (`DESIGN-quotients.md` section 7):

- Q1: should overshoot close `n.open` in `compute()` itself, or only in the
  reading? That is an arithmetic core change.
- Q2: is WQ a sixth quotient, or EQ's second name?
- Q3: `iqScore`, `iqList`, `iqApply` and `IQ_STEM` already mean "intake
  question" in `engine/intake.js`. Keep the engine name `aperture` and use IQ on
  the surface only?
- Q4: does the iris replace the glance row or sit beside it?
- Q5: **a blank field computes an aperture of 71.8, above most real readings**,
  so a person's first honest entry moves it *down*. Show it, or hold it until a
  second reading?
- Q6: ship PQ as a stated boundary, or wait for `p.physical` (sleep, movement, a
  three state fuel mark)? The second is a schema change.

The "turn" collision with the loop counter (3.4) is also open.

---

## 10. The avatar

### 10.1 The ruling

In the owner's words (CLAUDE.md; `DESIGN-avatar.md`): **"What is Atuned? Your
avatar."** It is the centre of the product, not a page in it. "You are looking at
your avatar improve, shown by the releases, by going through the discover play
flow mechanic." The layers are sewn: the avatar to the ritual, the ritual to the
psyche, the psyche to the body locations, the body to the story.

Then, sharper (`DESIGN-avatar.md` Part Two, section 16, ruled 20 September):

> What you're improving is the conductivity of the kundalini. That's our primary
> goal with the avatar, to reconnect people's kundalini. So we should have
> progress bars of the kundalini snaking around the chakras, and we use that as a
> progress bar of how a person is doing. Like where their starting point is and
> how it's rising. Whether it's blocked or open, and where it's blocked.

And: **the app opens on the avatar.** `DESIGN-avatar.md` section 16 says this
reverses the 19 September ruling that it opens on the Field. **The build still
opens on the Field** (`core.js:150` `tab:TAB.FIELD`, `ui.js:1081`), and
CLAUDE.md still states the Field ruling. So the opening surface is **OPEN** in
practice: the latest recorded ruling and the code disagree. Confirm with the
owner before porting either.

### 10.2 The data model that exists (BUILT, `engine/avatar.js`, validated in `engine/schema.js`)

**No figure, glyph or drawing of the avatar exists anywhere in the product.**
This is the state, and it is precise.

```
profile.avatar = {
  built:      false,         // boolean. Set true only by validateProfile on import (schema.js:711)
  at:         null,          // ISO date, first written
  reviewedAt: null,          // ISO date, last monthly review
  pairs:      [ {be:'', notbe:''} ]   // each side a string, 1 to 199 chars; anything else refused by name
}
profile.purpose = {
  soul:  ['', '', ''],       // the higher purpose, three universal values (freedom, wisdom...)
  ego:   ['', '', ''],       // the earthly purpose, three "with a body attached" (health, wealth, family...)
  sides: { partner:[], family:[], friends:[], community:[], coworkers:[], alone:[] }
                             // the boundary hexagon: six sides, up to five commitments each, thirty in all
}
```

A **pair** is written as a pair because, in the file's words, "a value has no
address and a sentence about a bad day does". `be` is who the person is at their
best. `notbe` is who they are not, in their own words. The product never rules on
whether an attribute is a real edge or "a saboteur wearing a virtue".

| Function | Returns | Notes |
|---|---|---|
| `AV_MONTH` | 30 days in ms | the review clock |
| `avatarBlank()` | `{built:false, at:null, reviewedAt:null, pairs:[]}` | |
| `avatarValid(pair)` | true if both `be` and `notbe` are non-empty after trim | |
| `avatarDue(av, now)` | true if built and 30 days or more since `reviewedAt` (or `at`) | |
| `avatarDaysLeft(av, now)` | days to the next review, or null if not built | a countdown |
| `avatarGap(pair, seat, seatLoad, seatIg)` | `{seat, load, ig, clear: load <= 0, at: mirrorAt(load, ig)}` | "the distance between who somebody is and who they are becoming is not a mood, it is a number at an address". The load and integrity are passed in to keep it pure |
| `avatarProgress(rows)` | `{done, total, pct}` over rows whose gap is clear | **A completion bar** (see below) |
| `purposeBlank()`, `purposeReady(p)` | ready when all six soul and ego slots are filled | feeds the `aimed` mark |
| `purposeCentre(three)` | the three words joined, or null | "the centre is the sum of the corners and is never entered" |
| `purposeRead(p)` | `{higher, earthly, between}` | `between` is fixed copy: "Where those two meet is how you make money and how you find fulfilment doing it." |
| `boundaryCount(p)` | `{filled, of:30, thin:[sides under five]}` | PQ's raw material |
| `boundaryCross(text)` | the first of the six sides whose regex matches (for example wife or husband gives partner; boss or client gives coworkers; myself or alone gives alone), or null | **called by no renderer** |

**The UI half** (`ui/drills.js:797` to `:880`; entered from the fourth start door
"Say who you are becoming", `ui/component.js:425`). `avRows()` resolves each
pair's `notbe` to a seat through `readSeat()` (which calls `parseStory` and takes
the band with the most imprint weight), computes that seat's mean `sq` and
`bandIg(seat)`, and calls `avatarGap`. `runAvatarDrill` lists the pairs.
`runAvPair` shows one pair, its seat, its position on the mirror axis and the
five heaviest addresses at that seat. The design rule: **the right-hand sentence
steers the release, the left-hand one steers the reframe, never the other way
round.**

**Built but dead or wrong.** From `DESIGN-avatar.md` section 1, re-verified for
this brief:

- **Nothing in the app can write a pair.** `pairs` has readers and no writer.
  `built` becomes true only through an import, and there is no import control.
  So the monthly review clock can never fire. The drill tells the person "the
  journal asks for it in two questions", and those questions do not exist.
- **The Summary prints a guaranteed all clear** (`ui/summary.js:269` to `:276`).
  It matches pairs on `pair.seat` and prints `pair.becoming`. Neither field is
  ever written, so `clear` is always true and the page says "Every seat your
  avatar depends on is passing." It has never fired only because no pair can
  exist. **It becomes a false statement to a person the moment a pair writer
  ships. Fix it before, or together with, the writer.**
- **The drill prints "N of M clear"** (`drills.js:843`), a count against a total
  on a person's own values. `DESIGN-avatar.md` section 2 overturns
  `avatarProgress` as an improvement channel: it stays as arithmetic and is never
  drawn.
- `boundaryCross` is exported and tested, and nothing calls it.

### 10.3 What improves the avatar (DESIGNED)

**The three channels, and the honesty mechanism** (`DESIGN-avatar.md` section 5):

- **RECORD.** Append only, and it is the drawing: addresses a release has
  touched (`meter.firsts`, BUILT), addresses taken to nothing (`meter.emptied[]`,
  DESIGNED), seats reached, runs done, days. Keyed on **contact**, not
  completion. Gordon does four real runs and has emptied nothing, because his
  charge is too high, but he has contacted 20 addresses.
- **REACH.** How far this person gets with nothing held: `cqCeiling()` overall,
  and `mirrorAt(0, bandIg(seat))` per seat. It moves only by conduct, through
  the 21 laws, which are "the pegs".
- **WEATHER.** Load today, and the only channel allowed to move both ways.
- **The record and the reach never trade against each other, and neither is ever
  drawn as the same mark as the weather.** A hard month moves the weather and
  leaves the drawing byte identical. There is no level to fall out of, because
  there never was a level. Do not add a level, rank, stage or tier to the avatar:
  anything that can go down is a demotion.

**The kundalini rise, the progress bar** (Part Two, sections 17 to 19;
`proto/avatar/rise.js`, `proto/avatar/dash.html`):

```
t(seat) = clamp( mean(n.open at that seat) / 1.18, 0, 1 )   // per seat, root to crown
cum(i)  = t(seat 1) x ... x t(seat i)                         // a channel in series
reach   = cum(1) + ... + cum(7)                               // 0 to 7 seats
pct     = round(100 x reach / 7)
```

- A shut root throttles everything above it, which is the owner's model.
  Averaging the seven would let a clear crown hide a blocked solar plexus.
- The **blocked seat** is the seat with the lowest transmission, named with its
  heaviest carrying address (a name, a plexus, a fetter and a weight).
- **Two levers**, each computed on copies of the state: release at that seat,
  and the weakest law carrying that seat, each shown with what it costs.
  Measured: coherence answers to conduct, and the rise answers to release. At
  the blocked seat, release is the bigger lever for 985 of 1000.
- **`avatar.rise0`**: seven per-seat `open` values plus a date, **written once**,
  the first time `compute()` returns `unread:false`. It is never recomputed.
  Refused by name at the boundary when a seat is unknown or a value falls outside
  0 to 1.18. Without it, the bar still draws; only the starting mark is missing,
  and the surface says so.
- **On `unread` the bar does not draw.** A blank field computes to 54 percent,
  which would be the largest lie on the screen. The channel and the seven seats
  still draw, and the four doors take the place of "where it stops".
- **`avatar.protocol`**: per seat, a list of `PRACTICE` keys the person chooses
  (the owner's "tags"). It is called protocol, not tags, because in this product
  a tag is the injury (`GLOSS`).

**Requirements the gamification places on the avatar** (`DESIGN-gamification.md`
section 9). If the avatar does not meet these, the loop does not close.

1. One frame that changes when a release lands, **on the surface the release
   happened on**. The avatar is the only thing a person *watches*.
2. Seven regions mapped to the seven seats, so an award at the solar plexus
   changes the solar plexus and nothing else.
3. A state that can only be read, never scored: no bar percentage printed as a
   grade, no level, never a count against a total. (The rise's percentage is the
   owner's own request for "progress bars". See the open item below.)
4. **A figure that still moves for the 465 of 1000 who cannot release.** Show
   holding, not only clearing. An avatar driven only by releases never moves for
   nearly half the panel.

And one thing it must not do: become a collection. Voidpet Garden is the nearest
market comp, and the criticism it draws is that the creature collection ate the
product it served. Here there is one figure, and it is the reading.

**Status of all of 10.3: DESIGNED.** None of `rise0`, `meter.emptied`,
`avatar.protocol`, the figure, the levers or the dashboard is in `atuned_src/`.

### 10.4 Open, the owner's calls

- Body, light or diagram? `DESIGN-avatar.md` recommends the armature
  (`proto/avatar/one-armature.html`); Part Two narrows it to the channel and the
  seven seats.
- The normaliser 1.18: clearing alone tops out at 85 percent, and only an
  installed opposite reaches full conduction.
- `Root_08_Unnamed` caps the root, so **no one can ever read 100**. Fully
  installed profiles read 99.
- Does the rise replace coherence as the headline number anywhere? A person
  shown both will ask which one is them.
- May a practitioner see the rise?
- The printed rise percentage against the no-score rule. It is the owner's own
  request, and it is the same question as LD11 and the karma balance.
- The opening surface: Field, as built, or the avatar, as the latest ruling
  says.

---

## 11. Status register

One row per mechanic, for the port team's planning.

| Mechanic | Status | Source of truth |
|---|---|---|
| Streak (halves, one grace day, today not required) | BUILT | `engine/ladder.js` `streakRead` |
| Day keys from local time, never stored | BUILT | `ladder.js` `pracDay`, `pracDays` |
| Ledger (minutes done or planned, rituals, lines, ground, clear, carry, snaps) | BUILT | `ladder.js` `ledgerRead` |
| Sixteen marks in three families | BUILT, defects 5.9 c to g | `ladder.js` `MARKS` |
| Earned plus one next mark, never a total | BUILT | `ladder.js` `ladderRead` |
| Coherence series and spans | BUILT | `ladder.js` `seriesRead`, `SPANS` |
| Record rendering on Ritual and Compass | BUILT, defects 5.9 a and b | `ui/cone.js` `ladderHtml`; `ui/ritual.js:161` |
| If-then plan (when and where); planned and done split | BUILT | `ui/ritual.js` |
| Ritual dealt by the seat carrying most, shortest practice | BUILT | `ui/ritual.js` `ritFor` |
| Unique ground, lines, free reruns | BUILT | `engine/schema.js` `meterRun` |
| Dated firsts | BUILT (written), NOT RENDERED | `schema.js` `meterFirst`; `ui/release.js:148` |
| Seven markers on the person's own scale | BUILT; scale OPEN | `schema.js` `MARKERS`, `meterRead`; `ui/record.js:110` |
| Plans, gift, allowance, sight not for sale | BUILT | `engine/plan.js` |
| Games tab, independent | BUILT | `engine/core.js:99`, `:106` |
| The letting go run | BUILT, defects 8.2 | `ui/games.js`; `engine/data/cards.js` |
| The match | BUILT, defect 8.3 | `ui/games.js` |
| Avatar pair and purpose data model, and its functions | BUILT (engine), no writer | `engine/avatar.js`; `schema.js` |
| Avatar drill (text) | BUILT, defects 10.2 | `ui/drills.js:797` |
| CQ | BUILT | `engine/compute.js` |
| The loop drawn as a ring | DESIGNED | `proto/onboard/onboard.html`; `proto/ladder/index.html` |
| Turn counter | DESIGNED, embody defect 3.4 | `proto/ladder/turn.js` `turnRead` |
| 22 marks re-keyed to the loop (5 corrected, 6 new, including Came back) | DESIGNED | `turn.js` `MARK2`; `DESIGN-ladder.md` 3.2 |
| Awards: Cleared, Held, Moved (up), Closed; `p.awards` | DESIGNED | `turn.js` `awardRead`; `DESIGN-ladder.md` 3.4 |
| Snapshot additions (nine axes, ceiling) | DESIGNED; OPEN (schema) | `DESIGN-ladder.md` 1.3 |
| Karma: earned patterns, paid after the fact | DESIGNED; word and rate OPEN | `DESIGN-gamification.md` 6; `proto/game/` |
| Firsts shelf | DESIGNED | `DESIGN-progression.md` 2.5 |
| Crisis gate `careState` | DESIGNED | `DESIGN-progression.md` 4 |
| Content chain: span graft into the practice | DESIGNED | `proto/game/chain.js` |
| Affirmation (hedge swap or question) | DESIGNED | `DESIGN-gamification.md` 5.4 |
| Floor ritual (60 seconds), `floor:true` | DESIGNED | `DESIGN-gamification.md` 5.4; `DESIGN-ladder.md` |
| Frame layer | DESIGNED (charge seat) | `proto/game/frames.js` |
| Stake sentence; season | DESIGNED | `DESIGN-gamification.md` 4 |
| First session shows what landed | DESIGNED | `DESIGN-gamification.md` 7 pass 9 |
| The wheel over addresses; the deal as ceremony | DESIGNED | `DESIGN-progression.md` 3.5 |
| Games phase two, narrated walkthrough | DESIGNED (one sentence only) | `ui/games.js:234` |
| IQ aperture, EQ turn, AQ release, PQ boundary | DESIGNED | `proto/quotients/quotients.js`; `DESIGN-quotients.md` |
| The iris drawing | DESIGNED | `DESIGN-quotients.md` 6.2 |
| Avatar figure, kundalini rise, `rise0`, levers, protocol, `meter.emptied` | DESIGNED | `DESIGN-avatar.md`; `proto/avatar/` |
| Achievements for clearing a saboteur or hyper complex, scaled by fetter (owner note AN4) | OPEN, undesigned | TASKS AN4 |
| Loop quarter mapping | OPEN | 3.3 |
| Vocabulary ban (badge, streak, score) | OPEN; gate never written | `DESIGN-progression.md` 2.1 against the `ladder.js` header |

---

## 12. Everything the owner has to rule on, in one list

Each item is quoted where it is asked, so it can be put to him with its source.

1. **Loop mapping.** Which of the four quarter-to-act mappings is canonical (3.3)?
2. **Embody in the turn.** Does a snapshot written by a story commit count, or
   must seeing what moved be a separate act (3.4)?
3. **"Turn".** Is it the word for one closed loop, and does EQ then need another
   word (TASKS LD10; 3.4)?
4. **Printed numbers.** Turn count, karma balance and rise percentage: printed or
   drawn (TASKS LD11; `DESIGN-gamification.md` Q6)?
5. **Currency word.** Patterns, points or karma, and is karma a second unit (7.3)?
6. **Mark rate.** 5 (prototype) or 25 or 10 (TASKS)? And are sixteen marks'
   worth "the second half of the gift"?
7. **Snapshot fields** for Held and Closed. This is a schema question (LD12).
8. **Release can lower coherence.** Intended or a defect (LD9)?
9. **Came back.** Once, or every time?
10. **Held awards** for a state the person has left (`DESIGN-gamification.md`
    Q8).
11. **Floor day** equal to a full day, or recorded as a floor (Q7)?
12. **Affirmation.** Shown before approval, or only offered as help to write one
    (Q3, a safety question)?
13. **`sq >= 4` release threshold.** 465 of 1000 reach a complete reading with
    nothing to release (Q5, the oldest open item).
14. **Streak counts saved plans.** Keep, or move to done or floor (5.9 h)?
15. **Marks.** Stored with a date and never lost, like awards (5.9 g)?
16. **Games.** Should a game played count toward the day or the loop? And the
    copy "cleared" (8.1, 8.2)?
17. **The five quotients' questions** Q1 to Q6 (section 9).
18. **Avatar.** Form, normaliser, `Root_08_Unnamed`, headline number,
    practitioner sight, opening surface (10.4).
19. **Achievements by fetter, saboteur, hyper complex** (owner note AN4). Is this
    Cleared, or a family of its own?
20. **The vocabulary.** Which of badge, streak and score may appear on screen?

---

## 13. What the design is worth, as modelled

These figures come from `tools/loopsim.js` at seed 20260920. It is a weighted
1000 person panel built from the repository's own target-user profiles, and it
runs 42 self-checks before printing anything. **It is a simulation on a panel
that is warm by construction. It is not an install cohort, and none of this is a
promise.**

| | D1 | D7 | D30 | D90 |
|---|---|---|---|---|
| Build at `0e63f4b` (baseline) | 742 | 308 | **89** | 10 |
| Final design in `DESIGN-gamification.md` | 818 | 402 | **199** | 74 |

- Across nine seeds, the delta averages +10.8 points, with a range of 9.6 to
  12.0.
- The single largest item is the content chain's sniffer work: 5.7 points if it
  is removed.
- The single largest new mechanic is "the first session shows what landed", at
  3.2 points.
- Where the gain lands: the two target users who cannot run a release (Marcus
  and Sofia) carry 6.1 of the 11.0 points between them.

**Benchmarks from elsewhere, not comparable on equal terms:** Finch publishes 54
percent at D1 and 37 percent at D7 on real installs. The category runs 25 to 26
percent at D1, 11 to 13 percent at D7, and 2.78 to 7 percent at D30. The honest
claim is that the design reaches past Finch's published shape *on a warmer
sample*. It does not beat Finch.

**How it could be wrong** (`DESIGN-gamification.md` section 11), in the order
that would change the answer:

1. The frame layer was written after reading the lines it was measured on, so
   its contribution is an upper bound.
2. Four coefficients are the designer's own. With all four at zero, the delta
   falls from +11.0 to +1.5.
3. The baseline is calibrated to hand-derived points, not measured on people.

The first hundred real people will settle in a week what this argued about for a
day. The first thing to instrument is the content chain's rate of producing a
span on text it was not written against. Pair that number with people you have
actually watched, because telemetry will not say why somebody left.
