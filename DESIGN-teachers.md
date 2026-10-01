# The teachers, twelve of them, and the engine behind a click on a name

Design and one mockup. Nothing in `atuned_src/` was changed and nothing was pushed.
Round OT, 1 October. Written by the systems seat, who owns the schema, the shape of
stored data and the boundary that guards it.

The owner's words, from round OT (commit `444653a`, "Log round OT", `TASKS.md`):

> "We have eight ascended teachers here now. We have more in our documentation.
> Let's get this to 12 plus their opposites. And when I click on their names, it
> shows me who they are. It shows me their opposite, how the behaviors operate. And
> it allows me to run a protocol from my library that's in alignment with their
> behaviors. That's an engine that needs to be designed."

Where the picture is: `mockups/teachers/teachers.html`, with
`teachers-1600.png`, `teachers-390.png` and `teachers-1600-empty.png` beside it.

**A note on the tree.** Round OT is in commit `444653a` on the local branch
`claude/laughing-feynman-xhfyj3` and is not on the pushed tip `0abebb6` that this
work was cut from. It was read with `git show 444653a`. The earlier round that
first asked for this engine is round LC in `TASKS.md` (line 24440), and that is in
the tree.

## Terms used in this file, once, in plain words

- **Teacher.** The coherent end of one quality on the Compass. A behaviour a person
  can run, never a person to become. The owner's word, and this file uses it.
- **Opposite.** The same quality at maximum inversion. The code says `dn` and the
  surface says "the other end" and "inversion". This file uses the owner's word.
- **Pole.** One teacher at one place on the Compass. Jesus stands at two poles, so
  twelve teachers are thirteen poles. A pole has a two letter key such as `PO`.
- **Seat.** One of the seven body bands, Root up to Crown. An **axis** is a pole read
  at a seat. **Address** is one of the 112 exact places in the body where a pattern
  sits. **Carrying** means an address reads 4 or more out of 10.
- **Position.** `mirrorAt`, the 0 to 100 number for where a person sits on an axis.
- **Protocol.** What the product already means by it: a release run over a set of
  addresses (four channels at each), started by `relPick`. A **ritual** is a saved
  daily plan of practices. A **practice** is one row of the practice library.
- **Pacing step.** `tier` on a practice, 1 to 3, set by how heavy the field is. It is
  not the plan tier (free to tier four). The word "tier" already names three
  different things in this product; this file says pacing step for the practice one.

---

## 1. What was found

### 1a. The eight ascended teachers

There is no list called "ascended teachers" in the code. What the owner sees on the
Compass is the left and right panels, eight rows each showing a teacher and its
opposite (the Compass as built, with Marcus loaded). Those eight rows are `MIRROR` in `atuned_src/engine/data/compass.js`
(lines 32 to 96): eight axes, eight coherent poles, and **Jesus twice**, at Light
(Heart) and at Revelation (Crown). So the eight rows are **seven different people**.

| Pole | Quality | Seat | Teacher | Opposite | `compass.js` |
|---|---|---|---|---|---|
| `IL` | Light | Heart | Jesus | Lucifer | 39 to 42 |
| `DE` | Desire and will | Sacral | Ramakrishna | Asmodeus | 43 to 46 |
| `OR` | Order | Throat | Moses | Set | 47 to 50 |
| `PO` | Power | Solar | Musashi | Moloch | 51 to 54 |
| `PE` | Perception | 3rd Eye | Buddha | Geryon | 55 to 58 |
| `TR` | Trust | Heart | Rumi | Charon | 59 to 62 |
| `CH` | Charge | Root | Elijah | Phlegyas | 63 to 66 |
| `RE` | Revelation | Crown | Jesus | The Furies | 89 to 96 |

### 1b. The "more in our documentation"

Every `.md` in the repository, `docs/` and the code were searched for teacher,
ascended, master, and for forty-odd names from the traditions the codex draws on.
The candidates, with where each one is and what the document says:

| Candidate | Where | What it says |
|---|---|---|
| Akhenaten | `compass.js` 109, `MASTERS`; `BOOK-ERRATA.md` 308 to 318 | "Maximum Sat. Energy conducting without distortion. The output is literal light." On the master list at the Sat apex. **Not on the mirror pairs, so no opposite is named anywhere.** |
| Krishna | `compass.js` 114 (`MASTERS`), 268 (`PATHS`) | "The field wants to move, and most suffering is the result of blocking that motion." A path. Opposite Kaliya, **researched, not codex** (lines 246 to 249). |
| Rama | `compass.js` 115, 275 | "Sat, Chit and Ananda clear at once. Duty as the spine." A path. Opposite Ravana, **researched** (lines 250 to 252). |
| Lao Tzu | `compass.js` 116, 278 | "Perpendicular to the vertical axes. Stop the activity generating the interference." A path. Opposite Shu and Hu, **researched** (lines 253 to 258). |
| Meister Eckhart | `DESIGN-compass.md` mirror table (RE row); `BOOK-ERRATA.md` 420 to 445; `TASKS.md` 8562 (AQ6) | The book's twelfth. **Ruled out by the owner**: "Eckhart comes out. Classic figures only." The test at `tests/engine.js` 1748 to 1751 pins eleven masters and Eckhart out. |
| Jesus, Buddha | `compass.js` 268 to 274, `PATHS` | Already poles. On the five paths they are the same entries as `IL` and `PE`, aliased in `BECOMING_SAME` (`practice.js` 195). |
| "twelve masters" with a law each | `docs/briefs/gap-parity-matrix.md` 83 and 438; `docs/briefs/cq-unified.md` 245 | A sibling code base ("B") holds `canon_tables/PATHLAW.json` and `MASTERLAW.json`, "the masters with laws and protocols", and gives Moses the law "Ownership". **Those tables are not in this repository.** If the owner has them, they replace the proposed law column below. |

The honest count: the documents name **eleven distinct teachers** (the seven above,
plus Krishna, Rama, Lao Tzu and Akhenaten). `BOOK-ERRATA.md` already says so: "the
codex's twelve is eleven distinct people until the owner names another." No document
names a twelfth. Documents that are stale against the code: `DESIGN-compass.md`
(still lists Eckhart and calls the list twelve), `PRODUCT.md` 486 says eleven,
`reviews/creative.md` 457 and `reviews/AD-field-compass.md` 383 still print Eckhart.

---

## 2. The set of twelve, with their opposites

**Twelve teachers, thirteen pairs.** Jesus stands at two poles (the owner's ruling,
`compass.js` 67 to 91: "that would be Jesus at the very top. That's love."), so he has two
opposites. Counted as entries: twelve teachers, thirteen opposites, twenty five names
in all. The panel lists twelve names and shows Jesus once with two poles under him.

Status column: **codex** means quoted from the codex as carried in `compass.js`.
**research** means a named figure from the teacher's own tradition, already in
`compass.js` and marked there "until he confirms or replaces them". **PROPOSED**
means it is not in any document and is mine, for the owner to confirm or replace.

| # | Pole | Teacher | Reads at | Opposite | Teacher | Opposite |
|---|---|---|---|---|---|---|
| 1 | `IL` | Jesus (Light) | Heart | Lucifer | codex | codex |
| 2 | `RE` | Jesus (Revelation) | Crown | The Furies | codex, ruled | codex |
| 3 | `DE` | Ramakrishna | Sacral | Asmodeus | codex | codex |
| 4 | `OR` | Moses | Throat | Set | codex | codex |
| 5 | `PO` | Musashi | Solar | Moloch | codex | codex |
| 6 | `PE` | Buddha | 3rd Eye | Geryon | codex | codex |
| 7 | `TR` | Rumi | Heart | Charon | codex | codex |
| 8 | `CH` | Elijah | Root | Phlegyas | codex | codex |
| 9 | `FL` | Krishna | no one seat | Kaliya | codex | research |
| 10 | `AL` | Rama | no one seat | Ravana | codex | research |
| 11 | `HO` | Lao Tzu | no one seat | Shu and Hu | codex | research |
| 12 | `SA` | Akhenaten | no one seat | Apep | codex | **PROPOSED** |
| 13 | `SO` | **Socrates** | no one seat | Thrasymachus | **PROPOSED** | **PROPOSED** |

Rows 1 to 8 are read at a seat. Rows 9 to 13 stand at no seat, which is the rule
`PATHS` already carries ("a path sits at no seat", `ritual.js` 416).

### 2a. The two proposals, and why

**Apep, the opposite for Akhenaten.** The codex gives Akhenaten no opposite. The one
image he left is the sun disc whose rays end in hands, light arriving. The Egyptian
counter figure is Apep, the serpent that swallows the sun each night: light taken in
and nothing handed on. Source to be checked by the research seat: the nightly voyage
texts (the Amduat and the Book of Gates). Set is already used for Moses, so Apep is
not a repeat.

**Socrates and Thrasymachus, the twelfth.** This is a judgment call and not a
computation, and the file says so rather than dressing it as arithmetic. The reasons:
(1) the roster has no Greek teacher and the owner's rule is classic figures; (2) the
Humility law (a bowl, "it holds because it sits below what it holds", `canon.js`) is
named by no teacher's codex line; (3) the opposite is in his own source, Plato's
Republic, book one, where Thrasymachus breaks into the talk and answers before the
question is finished. Socrates in the Apology says he neither knows nor thinks he
knows what he does not know. **The overlap to watch:** The Furies (certainty guarded
from experience) and Thrasymachus (certainty used to win) are neighbours, and two of
Thrasymachus's five marked addresses (Speaking To Be Right, Knowing Better Than God)
are also the Furies'.
Alternatives, with what each costs: Mahavira (the Non-Harm law at the Root; opposite
the codex's own Minotaur, so no new figure, but Elijah already reads at the Root);
Zarathustra (truth against the lie, the opposite built into the tradition, but it
overlaps Akhenaten); Meister Eckhart (the book's own twelfth and the best fit to a
product built on release, but the owner ruled him out). Question 2 puts it to him.

### 2b. What each teaches, and how it shows in a day

Behaviours are written as physical events on a day, the way `funnel/questions.js`
writes them, because that is the one register in the product that passes the voice
gate on every item. All are **drafts for the owner to edit** (the same posture the
rituals of becoming took in round KQ: "plug that in, we'll edit it later"). The
codex sentence for each teacher and opposite is quoted in the mockup and in
`compass.js`; the day behaviours below are new. Checked with `check.py --line`:
no hard failure.

| Pole | The teacher's day | The opposite's day |
|---|---|---|
| `IL` Jesus, Light | Gives something away and tells nobody. Warm to someone who can do nothing for them. Finishes helping before checking who saw. | Warm in the room and flat when it empties. Checks who noticed before the kindness is done. Tells the story of the favour afterwards. |
| `RE` Jesus, Revelation | Holds what cuts against a belief before answering it. Changes their mind in front of people without defending the old one. Asks what it would change if it were true. | Decides what a thing means before it has finished happening. Stops listening once there is an answer. Steers around the place that would test the belief. |
| `DE` Ramakrishna | Names one want and asks who else it would serve. Lets a craving sit ten breaths without acting. Stops when there is enough. | Gets it and reaches for the next one within the hour. Buys, scrolls or eats past the point of wanting it. Having it does not end the wanting. |
| `OR` Moses | Sets one rule others can lean on and keeps it on the day it costs. Says the plan before it starts. Writes it down so nobody guesses. | Changes the rule after others built on it. Agrees to the plan and works against it quietly. One person in the room, another in the message afterwards. |
| `PO` Musashi | Does the same hard thing at the same hour and pays for it themselves. Writes one line on a missed day and nothing about what it says about them. Practises the small version. | Their standard is met with other people's time. Somebody always covers for the schedule. A day does not count unless it was won. |
| `PE` Buddha | Notices what they feel and names it without becoming it. Describes a situation to themselves as they would to the person in it. Sees the thing before the story about it. | What people meet is a version they run, and they manage the gap. Edits how they say they are before it leaves the mouth. Reads people as terrain. |
| `TR` Rumi | Feels it straight away and lets it show. Goes toward what moves them before there is proof. Lets someone in before checking everything. | Waits at the edge until it can be proven. Prepares for the feeling instead of having it. Asks for more information about what they already feel. |
| `CH` Elijah | Moves anger through the body, walking or lifting, and nobody pays. Feels the heat and stays on their feet. The intensity ends in an action, not a freeze. | It goes off at somebody, or they go flat for the afternoon. No middle setting. The same charge comes out as shouting or as shutdown. |
| `FL` Krishna | Moves when the day wants to move. Makes the call they were holding. Lets a plan change. | Holds one routine, plan or grievance in place until it sours. Keeps running what has stopped feeding anyone. |
| `AL` Rama | Says what they will do and does it. Holds the line named this morning. Keeps a promise nobody would check. | Knows the rule and crosses it because they want the thing more. Explains why this one is an exception. Very good at reasons. |
| `HO` Lao Tzu | Finds the one activity making the noise and stops it for the day. Lets the water go round the rock. Waits for a thing to finish instead of pushing. | Hurries to help and makes it worse. Fixes what nobody asked to be fixed. Opens up what was whole, meaning well, once more each day. |
| `SA` Akhenaten | What they say, what they mean and what they do are one line. Says the true thing once and plainly. Lets a thing be seen as it is. | Answers a plain fact with a story that makes it smaller. Puts their own shadow over what somebody else lit. Denies what everybody can see. |
| `SO` Socrates | Says "I do not know" where others would guess. Asks the question that shows they were wrong. Tests what they are sure of on somebody who disagrees. | Wins the argument before the question is finished. Answers "how do you know" with a louder answer. Being wrong feels like being removed. |

**How the behaviour operates** is one fixed shape for every teacher, so the page reads
the same twelve times: the quality (the codex line), what it needs in the body (the
seat's laws, or the teacher's own laws for a seatless one), what turns it over (the
opposite's codex line), and the tell (`ask` in `compass.js`, a question a practitioner
can put to a person). The five new `ask` lines for `FL`, `AL`, `HO`, `SA`, `SO` are
drafts: `PATHS` carries none.

### 2c. Where each pole reads in the engine, so the match is computed

Every column here is a field the engine already has or a table this design adds.

| Pole | Seat | Laws read for it | The opposite's marked addresses (resolved by name at load) |
|---|---|---|---|
| `IL` | Heart | the seat's four: Compassion, Forgiveness, Generosity, Aesthetic Beauty | Manipulative Kindness, False Love, Stage Performing, Spiritual Pride, Seeking Validation |
| `RE` | Crown | Unity, Awareness, Nature | Speaking To Be Right, Dogma, Condemnation, Knowing Better Than God, Denial Of Truth |
| `DE` | Sacral | Temperance, Detachment | Addiction, Lust, Hypersexuality, Infatuation, Obsession |
| `OR` | Throat | Truth, Transparency, Justice | Manipulation Through Emotion, Betrayal, Deceit, Lying, Spiritual Language To Manipulate |
| `PO` | Solar | Courage, Duty, Responsibility, Accountability | Competition, Entitlement, Force, Need To Win, Superiority |
| `PE` | 3rd Eye | Presence, Humility, Equanimity | False Love, Stage Performing, Delusion, Projection, Distortion |
| `TR` | Heart | the seat's four | Closed Heart, Cynicism, Distrust, Overanalysis, Doubt |
| `CH` | Root | Non-Harm, Patience | Fear, Lethargy, Panic, Collapse, Anger |
| `FL` | none | none (flow is read from what is held at the seats) | Control, Possession, Resistance, Compulsion, Avoidance Of Grief |
| `AL` | none | Duty, Responsibility (Duty is in the codex line) | Lust, Entitlement, Excuse, Hubris, Knowing Better Than God |
| `HO` | none | Patience, Nature (proposed) | Force, Need To Be Needed, Interrupting, Savior Complex |
| `SA` | none | Truth (in the codex line), Transparency (proposed) | Deceit, Distortion, Denial Of Truth, Denial Of Light |
| `SO` | none | Humility (proposed) | Arrogance, Superiority, Speaking To Be Right, Hubris, Knowing Better Than God |

**What is solid and what is not.** The seat and the seat's laws are the product's own
measurements and are solid. **The marked addresses are mine.** The codex gives each
opposite a sentence and a seat, never a list of addresses. Each choice is argued from
that sentence (Moloch, "power that extracts from others", marks Competition,
Entitlement, Force, Need To Win and Superiority), and every name resolves to a real
address at load or the test fails. They need the CQ seat's signature before they are
called anything but proposed. Two opposites share addresses (Lucifer and Geryon share
False Love and Stage Performing); that matches the codex, which puts Geryon's circle
at "heart inverted, warmth performed rather than generated".

**The sibling code base.** If the owner supplies `MASTERLAW.json`, the laws column
for the five seatless rows is replaced by it.

---

## 3. The engine

### 3a. Pass one: what is stored, what is derived, and is anything both

| Fact | Stored or derived | Where |
|---|---|---|
| Teacher, opposite, quality, codex line, seat | stored, in tables | `compass.js` (unchanged) |
| Day behaviours, marked addresses, laws for seatless poles, the two new poles | stored, in one new table | `engine/data/teachers.js` |
| Which practices call for a teacher | stored | `BECOMING` and the `tc` rows in `engine/data/practice.js`, extended |
| Where a person sits on an axis | **derived**, never stored | `mirrorAt` |
| How many of the opposite's addresses are carrying | **derived** | the field, `W[].sq` |
| The alignment of a protocol to a teacher | **derived**, never stored | `teachFit` |
| Which protocols are offered | **derived** | `teachAligned` |
| A ritual started toward a teacher | stored, already | the plan's `tc` in the ritual side store |
| Which teachers a person is working toward, and the starts so far | stored, **new, small** | `teach` on the profile (3e) |

Nothing is both. In particular the alignment is not stored on the protocol or on the
profile, because a stored derived value is how two truths appear: edit `BECOMING` and
a stored score would still say the old thing.

**One identity, not three name joins.** Today the teachers live in three lists
(`MIRROR` up names, `PATHS` up names, `MASTERS`) joined by string equality on the
name. `drills.js` 795 finds a path's mirror pole by comparing the name and the
description text. That is a concept with three homes and no key. The design
keys everything by the **pole key** (`IL`, `PO`, `FL` and so on), which is already the
key `BECOMING` and the ritual plan's `tc` use. Pole keys are **append-only**: a key is
never reused or renamed, a retired teacher keeps its key and is marked `retired`, and
display order is a separate list (`TEACH_ORDER`) so the order moves freely, the same
rule the tab integers carry.

### 3b. The alignment, and why it is not arbitrary

Alignment answers one question: **for this teacher, how well does this protocol from
the person's library line up, on fields that are stored and compared?** It does not
read the person's words, a mood, or the text of a practice.

A protocol, in the library, is one of three things, because the product has three
shelves and the owner's phrase "my library" could mean any of them (question 1):

| Shelf | What is in it | Where it is kept | How it runs |
|---|---|---|---|
| Practices | the 25 rows of the practice library, 8 of them written for teachers (`tc`) | `PRACTICE` | start a ritual of it, `ritStartPlan` |
| Rituals | the person's saved plans | side store `atuned-ritual-active` (`ritual.js` 171), and the day log `p.rituals` | open the Ritual tab |
| Release protocols | the charge cards (3 in `CARDSET`, 9 in `AXCARD`) run over addresses; ground the person has opened is `meter.unique` | `cards.js`, `meter` | `relPick(addresses)` |

Each candidate is turned into one shape (`teachCand`): kind, key, name, minutes,
pacing step, the seats it works at, its practice keys, its address ids, and any `tc`.

**Three components, each read from a field that already exists:**

1. **Authored link, weight 0.5.** 1 if the candidate's `tc` is this teacher. Otherwise
   the share of its steps that are in `BECOMING[teacher]`. This is the owner's own
   table, so it is the strongest signal and it is his to edit. Absent for a release.
2. **Seat, weight 0.2.** 1 if the teacher's working seat is among the seats the
   candidate works at. The working seat is the axis's seat, or for a seatless teacher
   the seat carrying the most today (the rule `ritTeach` already uses). A practice's
   seats come from its track through the one table `TRACK4BAND` (Root and Heart are
   Body, Sacral and Solar are Somatic, Throat and 3rd Eye are Mind, Crown is Energy).
   A release's seats are the bands of its addresses.
3. **Cover, weight 0.3.** For anything with addresses, the share of them that are among
   this teacher's opposite's marked addresses **and** are carrying (4 or more). This
   is the sentence the owner dictated in round LC: "the sniffer should be looking for
   all the patterns that are on the opposite", "patterns that need to be released".

The score is the weighted mean over the components **that apply** (a practice has no
addresses, a release has no steps), so the weights are renormalised, never padded.

**A candidate qualifies only through the authored link or through cover.** Seat can
raise a candidate but never admit one. I measured why: with seat allowed to qualify,
a generic practice like The Emotional Scan scored 0.29 for Musashi just because it is
a Somatic practice and Solar is a Somatic seat, which is a coincidence of a coarse
table. Four tracks cover seven seats, so seat is a weak signal and is weighted low. It
is weaker than it looks: three of the five teacher practices written for a seated axis
carry a track that disagrees with `TRACK4BAND` at their own seat (Given Freely is
Somatic against the Heart's Body; The Same Cut is Body against the Solar's Somatic;
Meet It Unopposed is Mind against the Crown's Energy). If the owner wants real seat
fit, practices need an explicit `seats` field (additive). That is slice T9.

**Pacing is a gate, not a score.** A step above the person's pacing step is **held**,
never listed as available, and the panel says "opens as the charge drops", which is
the sentence and the behaviour of `ritTeach` today. Nothing is offered to a heavy
field that `ritFor` would not offer. The pacing step is `DQ` at 70 or more gives 1, 40
to 69 gives 2, below that 3 (`ritFor`, `ritual.js` 99). **One deliberate
difference:** with nothing read yet (`unread`), `ritFor` gives step 3, which opens
everything; this engine gives step 1, because nothing was measured and the cautious
side is the right default for a screen that offers things to do.

**Why this is not arbitrary, in five checks:**

- Every input is a stored field read through a table the owner already rules on
  (`BECOMING`, `TRACK4BAND`, `MIRROR.seat`, `W[].sq`). No text is matched.
- The three weights live in one table, `TEACH_W`, a test pins them to sum to 1, and
  they are the owner's to move, like `BECOMING` ("a first pass").
- It is monotone, and the tests prove it: take an address out of the carrying set and
  cover falls; swap a candidate's step for one outside `BECOMING` and authored falls.
- It is deterministic: ties break on lighter minutes, then key, so two runs give one
  order.
- It explains itself. Each result carries the components and a reason per component
  ("Written for Musashi", "Both carrying", "Charge matches the card"), and the
  panel prints the reasons. The score itself is for sorting and is **not printed**
  (question 5).

**The honest limits, said once.** The marked addresses are proposed. The seat signal is
coarse. The weights are a first pass. A person who has no authored practice for a
teacher and nothing carrying at the opposite's addresses gets an empty lane and is
told so, not a weak match dressed up.

Worked example, computed on the built engine with Derek (CQ 48.5, DQ 26.2, so pacing
step 3). Musashi reads 67. The opposite's five addresses read Competition 5.4,
Entitlement 4.7, Need To Win 2.8, Superiority 2.8, Force 2.3, so **2 of 5 are
carrying**. Both carrying addresses are on the Anger charge, so the release lane
offers the Anger protocol over those two addresses, eight patterns (two addresses
times four channels). The practise lane offers the ritual Box Breathing then The Same
Cut: both authored, score 0.71 each because the seat component is 0 (their track is
Body, the Solar seat reads Somatic). Marcus, whose Solar seat carries nothing, gets
an empty release lane and the same practise lane. Both are the two pictures.

### 3c. The functions

Host free: no `document`, `window`, `fetch`, `navigator`, `localStorage`. Declared in
two new engine files, `engine/data/teachers.js` (data, loaded after
`data/practice.js` in `MANIFEST`, because it reads `BECOMING` and `PRACTICE`) and
`engine/teach.js` (functions, loaded after `engine/practice.js`). All names are
checked against the names already in `export.js` so none collides.

```
/* data */
TEACH_V = 1                         /* the version of the stored block */
TEACH_FOCUS_MAX = 3                 /* working memory holds about four */
TEACH_RUNS_CAP = 2000               /* refused above, never truncated (PR_CAP's posture) */
TEACH_KIND = ['practice','ritual','release']
TEACH_W = {authored:0.5, seat:0.2, cover:0.3}
TEACH_ORDER = ['IL','RE','DE','OR','PO','PE','TR','CH','FL','AL','HO','SA','SO']
TEACH_EXTRA = [{k, does:[3], opp:[3], how, ask, marks:['Competition',...], laws:[...],
                from:'codex'|'research'|'proposed', retired:false}, ...]

/* reading the roster, pure over the tables */
teachPole(k)        -> {k, who, q, d, seat|null, path:bool, opp:{nm,d,ic}, does, oppDoes,
                        how, ask, marks:[nodeId], laws:[lawName], from, ic, src}
                       composed from MIRROR, PATHS, MASTERS and TEACH_EXTRA; copies no text
teachRoster()       -> [{nm, poles:[k]}]   /* twelve names; Jesus once, two poles */

/* the one impure line: reads W, bandIg and the reading, once, into a plain object */
teachCtx(r, sees)   -> {unread, pacing, heaviest, seats:{Root:{mean,hot,tot,ig}...},
                        sq:{nodeId:n}, sees:{sab,cx,hy}, laws:{name:n|null}}

/* everything below is pure over ctx, so it tests without a browser */
teachSeat(ctx, seat)        -> {mean, hot, tot, ig, pos}   /* the ONE reader of a seat, see 4a */
teachAt(k, ctx)             -> {seat|null, workSeat, pos|null, laws:[{nm,v}],
                                thinnest:lawName|null, oppHeld:[{id,nm,sq}], oppN}
teachCands(shelves, ctx)    -> [cand]
teachFit(k, cand, ctx)      -> {score, parts:{authored,seat,cover}, why:[reasonKey], qualifies}
teachAligned(k, shelves, ctx) -> {release:[...], practise:[...], held:[...], empty:null|'unread'|
                                  'nothing-carrying'|'no-ritual'|'locked'}
teachReleaseFor(k, ctx)     -> {charge, addrs:[nodeId], rest:n}   /* heaviest carrying charge group,
                                                                   at most RUN_MAX/RUN_MIN addresses */
teachRunPlan(k, cand, ctx, p) -> {via:'relPick'|'ritStartPlan'|'ritOpen', ids|steps|tc,
                                  cost:{new, rerun}, refuse:null|'example'|'nothing-left'|'unread'}

/* the boundary */
teachBlank()                -> {v:1, focus:[], runs:[]}
teachValidate(errs,o,path)  -> teach        /* called from validateProfile, errors by name */
```

`teachCtx` takes `r` and `sees` from the host. `sees` is `{sab, cx, hy}` read off
`planSees(pl, kind)` in `engine/plan.js`, so the engine never learns what a plan is.
The unit tests build `ctx` by hand, which is how the tests stay headless.

### 3d. What is shown, where

On a click on a name, in the Compass's right-hand Selection panel (the same place
`runTeacherDrill` writes today, replacing it), top to bottom:

1. **Who.** Position ring, quality, seat, the codex line, the second line, the
   source. For Jesus a switch between his two poles.
2. **The opposite.** The figure, the codex line, the tell question.
3. **How the behaviour operates.** Two columns, runs clean and runs as the opposite,
   three day behaviours each; the "how" sentence; the laws read for it, with the
   thinnest marked, because the thinnest law is where the axis is weakest. For Musashi
   and Derek that is Accountability at 4.6, which is the law that answers "who pays".
4. **Where the opposite shows up.** The five marked addresses with their weights and the
   line at 4. How many are carrying.
5. **Protocols from your library.** Two lanes, release what the opposite is running
   and practise toward the teacher, each with the reason under it and a Run button.

The foot line is on every opening: behaviours not people, a reading shows where
charge sits and does not say why, a protocol supports the work and does not cause a
change, nothing here diagnoses or treats anything. That is the product rule
("supports, not causes; no medical claims") written on the surface.

### 3e. The stored shape: additive, versioned, validated

One new block on the profile. Nothing else changes shape.

```
teach: { v: 1,
         focus: ['PO','TR'],                      /* up to three pole keys the person pinned */
         runs:  [ {t:'2026-10-02T09:14:00.000Z',  /* ISO date */
                   tc:'PO',                        /* a pole key, ever issued */
                   kind:'release',                 /* practice | ritual | release */
                   n:2} ] }                        /* addresses or steps, a whole number 0 to 25 */
```

It holds no free text, no story, no address ids and no name. `n` is a count, so a
release start does not write which addresses were in it, which keeps the record from
learning more about the story than it needs.

- **Blank and load.** `blankProfile` gains `teach:teachBlank()`. `loadProfile` fills a
  missing or non-object `teach` from the blank, as it does for `practice` and
  `summaries`.
- **The boundary** names `teach` at the top level, because a key the boundary does not
  name is deleted on the next load (`schema.js` 125 to 131 says so for `trace` and
  `summaries`). `validateProfile` calls `teachValidate`, which refuses by name and
  never clamps:

| The input | The refusal, by name |
|---|---|
| `teach` is a list or a number | `teach is not an object` |
| `teach.v` is 2 or 0 or `"1"` | `teach.v 2 is newer than this build reads (1)` |
| a key not in the closed set | `teach may not carry email` (and `customer_id`, `subscription_id`, `key`, `secret`, `token`, `session`, `password`, `card`, `payment`, `stripe`, `user_id`: the same list as `PR_NEVER` in `practice.js`, read from it, not retyped) |
| `focus` has four entries | `teach.focus holds 4, which is more than 3` |
| a repeated pole in `focus` | `teach.focus repeats PO` |
| an unknown pole | `teach.focus[1] names no teacher: ZZ` |
| `runs` over the cap | `teach.runs holds 2001, which is more than 2000` |
| a bad kind | `teach.runs[4].kind is not a kind of run: ritul` |
| `n` is 9999 or 2.5 | `teach.runs[4].n is out of range: 9999` (refused, never clamped, so a 9999 never reads as a 25) |
| a date that is not a date | `teach.runs[4].t is not a date` |

- **Retired keys are accepted.** `TEACH_KEYS_ALL` is append-only. If the owner replaces
  the twelfth teacher, the old key stays valid, so a record that names it still loads.
- **No `SCHEMA_V` bump.** `teach.v` is the block's own version, the way
  `PRACTICE_SCHEMA_V` is for `practice`. The profile stays version 2. Whether this
  touches the contract with SOURCE is the owner's call (question 4), and it is only
  needed from slice T7.

### 3f. Pass two: what can fail, and does it say so

| Write | Fails when | What the person is told |
|---|---|---|
| Start a ritual toward a teacher | the store is not bound or throws; the profile is an example | `ritPlanPut` returns false and `ritStartPlan` reports through `status()`. Unchanged. |
| Run a release | nothing left to spend; example profile | the release panel's own refusal, "Nothing released on a worked example.", and the plan route when the allowance is 0. Unchanged. |
| Log a start in `teach.runs` (new) | `pPersist` fails | `status('Not saved. Your start toward Musashi was not recorded.', 'bad')`, and the ritual or release it came from still runs, because the log is a record of it and not a precondition. |
| Pin a focus teacher (new) | the same | the same `status()` line. A control never claims success before the write has. |
| Import a profile with a bad `teach` | validation | `pImport` stays atomic: nothing is pushed, `CURP` does not move, `importError()` says which field. |

### 3g. Pass three: a record written six months ago

- **No `teach` block.** Filled from the blank. Every teacher reads as never worked
  toward. Nothing is migrated and the old path is untouched.
- **A ritual plan with `tc: 'RE'`** (written in round KQ). `RE` is still a key, so
  `becomingOf('RE')` still answers and the plan still loads. New teachers are new keys
  appended to `BECOMING`; none renumbers.
- **A record that names a teacher this build has never heard of** (written by a newer
  build) is refused by name, which is the boundary's existing posture for every field.
  The cost is stated: forward compatibility is not promised, backward compatibility
  is. The alternative, dropping unknown keys, is the silent clamp this product refuses.
- **Round trip.** `validate(validate(x))` must equal `validate(x)`. This product was
  bitten once when a field's own empty value was refused on the second pass and a
  person's profile vanished at boot (`schema.js` 686 to 695, round OG). The test below
  asserts it for `teach` explicitly.
- **Export and import compose.** `teach` travels with an export. The ritual plan's `tc`
  still does not, because plans live in a side store (`ritual.js` 38 to 44 names that
  as a cost). That is an existing gap, not made worse here.

### 3h. Empty states, each with its own words

| State | What the person sees |
|---|---|
| **Nothing read yet** | Who, opposite and behaviours show, because they need no reading. Position and addresses read "not read yet". The release lane says "Nothing read yet, so there is nothing to release." The practise lane shows the authored steps, paced at step 1. |
| **Library empty of rituals** | The practise lane still offers the ritual, because the practice library is always there. "Your saved rituals: none yet. Starting this one saves it there." |
| **Nothing carrying at the opposite's addresses** | "Nothing to release here. No address at Moloch's 5 is carrying, so a run would be a ritual and not a protocol. It opens when one is." (picture: `teachers-1600-empty.png`) |
| **No ground opened** | "Ground you have opened: none yet. A rerun needs something open." A run opens new ground and says what it costs. |
| **Held steps** | "Observer Technique opens as the charge drops." |
| **Locked evidence** | "Which saboteurs are running on these addresses opens at tier one. The addresses above are open on every plan." Read from `lockPanelHtml`, never typed. |
| **Worked example profile** | Run buttons stay, and press answers "Nothing released on a worked example." |

### 3i. How Run hands off, with no second runner

Nothing here is a runner. Each button calls the writer that already exists.

- **Release.** Close the sheet (`rdClose()`), then `relPick(ids)` with the carrying
  addresses of the heaviest charge, at most six so a run of four channels each is not
  truncated at `RUN_MAX` 25. A new in-memory marker `RUN.toward = k` is set first, so
  that when the run completes the start can be logged. It is not persisted.
  `relPick` already drops an address with no child fetter; every marked address was
  checked and carries one.
- **Practise.** `ritTeachStart(k, days)` today takes a pole key and reads
  `BECOMING`. Slice T5 lets it take the candidate list from `teachAligned`, and
  `ritStartPlan` stays the one writer, writing the plan with `tc` as now.
- **A saved ritual.** `setTab(TAB.RITUAL)`, as the "Open the ritual" button does.

### 3j. Tier gating

`SIGHT` in `engine/plan.js` (line 81) is the only place that says which plan a thing
needs, and this design types no plan of its own. It reads `planSees`.

| What | Plan |
|---|---|
| Roster, who, opposite, behaviours, how | every plan (content) |
| Position, the laws, the five addresses and their weights | every plan: `PLAN_ALWAYS` lists "your 112 addresses" and "the laws" |
| Which saboteur, complex or hyper complex runs on those addresses | saboteurs tier one, complexes tier two, hyper complexes tier three, from `SIGHT` rows `sab`, `cx`, `hy`. Below it the evidence is dropped and the lock sentence from `planLockedSay` is printed. It is never silently shorter. |
| Run a release | new ground costs patterns from the allowance (`meterBudget`, `planAllowance`); a rerun of open ground is free; at zero left the button gives way to the plan route, as the release panel does |
| Practise and rituals | every plan ("every tool") |
| **A cohort lead's view** | **hidden.** `LEAD_HIDDEN` lists "the spiritual material"; a person's chosen teacher is that. Slice T7 names it ("the teachers") in `plan.js` and a test asserts the practitioner read has no `teach`. |

No new `SIGHT` row is added, because nothing here is a new rung of sight.

### 3k. The tests that would prove it

In `tests/engine.js` (headless, fast), as a new group, asserting the contract and not
the current numbers:

1. Roster. Twelve names, thirteen poles, every pole key unique, `TEACH_ORDER` is a
   permutation of the keys, Jesus has exactly two poles. **The counts are read off the
   tables, never typed**, because this repository has been bitten by typed counts
   nine times.
2. Every `marks` name resolves to an address; every `laws` name is in `SINAMES`; every
   opposite has three behaviours and every teacher three; every string passes the voice
   gate and contains no em dash.
3. The compass tables are unchanged: `equiv.py` shows `MIRROR`, `PATHS` and `MASTERS`
   identical but for the one added row. `MASTERS.length` moves from 11 to 12 and the two
   pins at `engine.js` 1748 and 1750 move with it, on purpose and named.
4. `TEACH_W` sums to 1. Cover is monotone: removing a carrying address never raises it.
   Authored is monotone in the steps. Two runs give one order.
5. A candidate with no authored link and no cover does not qualify, whatever its seat.
6. Pacing: across the whole persona roster, **never** a step above `ritFor`'s step in
   the available list; heavy personas (Gordon, Tomas) are offered only held steps
   beyond step 1. Unread gives step 1.
7. `sees`: with `sab` unseen, no saboteur evidence appears and the lock line does.
8. Every `seat` read in the teacher panel equals the Compass panel's number for the same
   axis, across every persona and all 8 axes. This is the test that would have caught
   drift 4a.
9. Boundary: blank validates; a profile with no `teach` loads; each row of the table in
   3e is refused with exactly that message; 9999 is refused and not clamped;
   `validate(validate(x))` equals `validate(x)`; export then import then export is
   byte equal; a retired key still validates; a forbidden key is refused by name.
10. Coverage run (`NODE_V8_COVERAGE`): the unexecuted list for `teach.js` is read, not
    only the aggregate, because a whole module once sat at zero under a 92 percent
    average.

In the browser: `tests/functional.js` presses every name and checks its panel; presses
Run and checks `RUN.queue` equals the carrying addresses and the allowance is not
overspent; starts a ritual and checks the plan's `tc`; `collide.js` for nameplates;
`design.js` for 44 pixel targets and contrast; `tools/monitor.js` for every surface at
1600 and 390; `boot.js` and `funnel.js` unchanged; `terms.py` for one word per concept;
`check.py --objections` and `--brief` on the new strings.

---

## 4. The drift found

### 4a. A defect in the shipped build, measured: the teacher drill disagrees with the Compass

`runTeacherDrill` (`ui/drills.js` 754 to 786, the drill that opens when a name is
pressed) passes `mirrorAt` the seat's **hot load**, a 0 to 1 fraction from `flSeats()`
(`ui/map.js` 198 to 205). `mirrorAt` (`compass.js` 324) takes a **0 to 10** seat load.
The other three callers (`runPoleDrill` 818, `runMirrorDrill` 1240 and `coneMirPos`
in `cone.js` 764) pass the mean address weight, 0 to 10. So the same axis prints two
numbers. Measured on the built `source.html`, every persona in the page (15) by 8 axes: **the
two numbers differ on 95 of 120 axis readings**, by up to **38 points**. Gordon at Order: the Compass panel says 26, the teacher drill
says 64. The probe was checked first against a known good case: its Compass panel
column reproduces the eight numbers on screen for Marcus (75, 79, 80, 80, 84, 75, 80,
76).

There is a second defect in the same function: it finds the seat by comparing `x.p.n`
to `m.seat`, and `FLOWSEAT` names the 3rd Eye "Brow", so the lookup misses and reads
load 0 for the Buddha axis for **15 of 15** personas. It is the same class as the
`seatHz` finding recorded at `practice.js` 242 to 254.

Fix, slice T1: one seat reader in the engine (`teachSeat`), the four callers read it,
and the Brow lookup goes through the key `PMBANDS` already shares. This is independent
of everything else here and worth shipping first. I have queued it as a separate task.

### 4b. Smaller drifts

- **Two meanings of "load" for a seat** in one file: hot-only fraction (`flSeats`) and
  mean weight (three callers). Fixed by the same slice.
- **`TRACK4BAND` is declared in `ui/ritual.js` 80** and the engine needs it. Slice T2
  moves it to `engine/data/practice.js`; `ritual.js` keeps reading the same name.
- **A release card numbering collision.** `CARDSET` numbers Anxiety 01, Grief 02, Anger
  03 and the Knowledge page prints "Release protocol No.03"; `AXCARD` numbers Fear 01,
  Anger 02, Shame 03. "No.03" is Anger in one table and Shame in the other. The teacher
  panel names the card by its charge ("Anger protocol") and not by number until the
  owner picks one numbering.
- **Documents that say twelve or Eckhart while the code says eleven and Jesus**:
  `DESIGN-compass.md`, `reviews/creative.md`, `reviews/AD-field-compass.md`.
  `TASKS.md` already records the Jesus-at-two-poles conflict in round OL ("found, not
  mine to decide").
- **The word.** The owner says teacher and opposite. The code says `up` and `dn`; the
  surface says "the other end", "inversion", "the coherent pole". One word per concept
  says teacher and opposite everywhere a person reads.
- **The five paths.** The glossary says five paths, "all end at the same Source".
  Akhenaten and Socrates are not paths. The panel groups them under "read across the
  field" with the three paths and does not call them paths.
- **Ritual plans do not travel with an export**, existing, named in `ritual.js`.

---

## 5. The mockup

`mockups/teachers/teachers.html`. One HTML file, no network, drawn in the app's own
tokens (dark ground, seat colours, ring icons with a number pill, dotted rings for
opposites). It shows the Compass with the teacher list on the left (twelve names,
each with its opposite, Jesus once with two poles, new rows marked "proposed") and
the opened teacher on the right: who, the opposite, how the behaviour operates, where
the opposite shows up, and the two library lanes with Run.

- `teachers-1600.png`: Musashi, with Derek's reading. 2 of 5 carrying, Anger protocol,
  eight patterns, and the ritual toward power.
- `teachers-390.png`: the same at phone width. The list becomes a wrapped grid of
  twelve rings, not a hidden scroller.
- `teachers-1600-empty.png`: the same teacher with Marcus's reading. Nothing carrying,
  no ground opened, no saved rituals: three honest empties and the practise lane still
  offered.

The numbers are Derek's and Marcus's readings, computed on the built engine with the
proposed alignment, drawn on a real-record layout. They are not claims about a real
person. Open the file with `#empty` for Marcus and `#k=RE` (or any pole key) to open
another teacher. Behaviours, marked addresses, the two proposed rows and the drafted
opposite icons (Apep, Thrasymachus) are drafts.

---

## 6. The slice plan

Sizes: S is under half a day, M is one to two days, L is more. Each slice ends
green on its gate, and the browser gates need `NODE_PATH` at a playwright install.
The order is the dependency order.

| # | Slice | Size | Gate |
|---|---|---|---|
| T1 | **Fix the drift (4a).** One seat reader in the engine; the teacher drill, the pole drill, the mirror drill and the cone read it; the Brow lookup goes through the shared key. Independent of the rest. | S | `tests/engine.js` new group 8 above (four callers agree on every persona by 8 readings); `equiv.py old.html source.html` names the changed functions and nothing else; `tests/functional.js`; `tools/monitor.js` |
| T2 | **The data.** `engine/data/teachers.js`, the thirteen rows, the two new poles in `BECOMING`, the two drafted practices appended to `PRACTICE` (marked `tc`, so `ritFor` never calls them), `TRACK4BAND` moved to the engine, the twelfth in `MASTERS` and `MIRROR` left alone. | M | `tests/engine.js` groups 1 to 3; `BUILD-engine.sh` host free; `equiv.py` shows only additions; voice `--line` on every string; `MANIFEST` order |
| T3 | **The reading engine.** `teach.js`: `teachCtx`, `teachSeat`, `teachAt`, `teachCands`, `teachFit`, `teachAligned`, `teachReleaseFor`, `teachRunPlan`. No UI. | M | `tests/engine.js` groups 4 to 8 and 10; coverage list for `teach.js` read; persona roster simulation never offers above pacing |
| T4 | **The panel, read only.** `ui/teachers.js`; the Compass panels read the roster; the opened teacher replaces `runTeacherDrill`; every name looked up by `.k`; the four empty states; no Run yet. | M | `functional.js` presses all twelve names at 1600 and 390; `collide.js`; `design.js` (44 pixel targets, contrast, no all caps); `monitor.js`; `terms.py`; `check.py --brief` |
| T5 | **Run.** Release lane to `relPick` with `RUN.toward`; practise lane to a generalised `ritTeachStart`; the cost line from `meterPlan` and `relLeft`; `lockSees` for the evidence; example and allowance refusals through the existing writers. | M | `functional.js`: Run opens the release queue with exactly the carrying addresses, a rerun costs 0, the allowance is never overspent, a ritual started has the right `tc`; `boot.js`; `funnel.js` |
| T6 | **Sign off the marks.** The CQ seat reviews the thirteen address lists and the five new `ask` lines; the owner edits behaviours. Content only. | S | the T2 tests still green after the edits; no em dash; voice gate |
| T7 | **The stored block.** `teach` in `blankProfile`, `loadProfile`, the boundary and `teachValidate`; the focus pin and the run log, both reporting through `status()`; `LEAD_HIDDEN` gains "the teachers". Only if the owner says yes to question 4. | M | `tests/engine.js` group 9 (refusals by name, no clamp, idempotent, export then import byte equal, retired keys, forbidden keys); `pImport` atomic in `functional.js`; a practitioner read has no `teach` |
| T8 | **The needle.** Place the thirteen poles and their opposites on the Compass figure, three new icons (Apep, Thrasymachus, Socrates reuses the Humility bowl), the figure's hit test for the new names. | L | `collide.js` (no overlapping nameplates), `design.js`, `shots.js` at 1600 and 390 and a look at every image; `cone.js` is large and the nameplates collide first |
| T9 | **Real seat fit.** An explicit `seats` field on practices, replacing the four tracks as the seat signal, if the owner wants seat to count for more. | S | `tests/engine.js`: every practice names at least one seat in `BANDS`; the three disagreements in 3b are gone |

T1 can ship today. T2 to T5 give the owner the panel he described without touching
the profile. T7 is the only slice that changes stored data, and it is optional.

---

## 7. What the owner has to decide

Five questions, each with the words it comes from. None is answered for him.

1. **What is "my library"?** In round OT: "it allows me to run a protocol from my
   library that's in alignment with their behaviors." And in round LC: "The teachers
   and their opposites are protocols. So we want to create release protocols based
   off of their paths." The product has three shelves: the practice library (25 rows,
   always there), the rituals he has saved, and the release protocols (the charge
   cards, run over the addresses carrying). This design offers all three, split in two
   lanes (release, and practise). If he means only one: the release cards alone means
   the practise lane goes and nothing is offered when nothing is carrying; the
   practices alone means no release lane, which loses "patterns that need to be
   released"; his saved rituals alone means a new person sees nothing at first.
2. **Who is the twelfth?** The book's own twelfth was ruled out: "Eckhart comes out.
   Classic figures only." (`TASKS.md` 8562). The test comment says "When he names the
   twelfth it goes back to twelve". No document names another. I propose Socrates,
   with Thrasymachus as the opposite, for the Humility law and the missing Greek
   tradition. The other ways it can go: Mahavira (Non-Harm; his opposite, the
   Minotaur, is already in the codex); Zarathustra (truth against the lie, but it
   overlaps Akhenaten); Eckhart restored (the best fit to release, but it reverses a
   ruling); or he names someone I have not thought of. Each costs one `BECOMING` row,
   one drafted practice and one test count.
3. **Are the opposites I proposed acceptable?** The codex gives Akhenaten none and
   `compass.js` 240 to 244 records: "go do research on their polar opposites and which
   entities ... represent that. The codex names no inversion for Krishna, Rama or Lao
   Tzu... They stand until he confirms or replaces them." That leaves four researched
   or proposed figures: Kaliya, Ravana, Shu and Hu (researched) and Apep and
   Thrasymachus (mine). For each he can confirm, replace, or have it left unnamed for
   now, in which case the opposite shows the behaviour only, with no figure.
4. **Does a person's chosen teacher get stored, and may a lead see it?** `ritual.js`
   says of the ritual plans: "It survives a reload and does not travel with an export,
   and that is named as a cost." The panel needs no stored data. A pinned teacher and
   a run log ("Rumi, four starts, last three days ago") need a small block on the
   profile that travels with an export, and `CLAUDE.md` says of the schema: "The gates
   bump is additive and v1 still loads, but it is the cross compatibility contract
   with SOURCE." This block is additive and does not bump the version. Options: store
   nothing (a person's starts live only in their ritual plans, no tally, nothing to
   export); store the block, hidden from leads (my recommendation); or store it and let
   a cohort lead see it, which `DECISIONS.md` rules against for "the spiritual
   material" unless he says otherwise.
5. **Does a person see a match number?** He ruled, round AQ11 (`TASKS.md` 8584): "Every
   number carries its scale. He named it and then named the reason: a number that does
   not say what it is out of is meaningless." The alignment is a 0 to 1 sort key. This
   design prints reasons ("Written for Musashi", "Both carrying") and no number. The
   other ways: a ring with a percent and its scale ("a 71 out of 100 match"), which
   invites a person to chase a score; or three words (strong, partial, loose), which
   hides the reasoning. The ruling on a score is yours, because it is the line between
   a reading and a grade.
