# The teachers as imprints: design v2

Design and one mockup. Nothing in `atuned_src/` was changed and nothing was pushed.
Round OX, 1 October. Written by the systems seat, who owns the schema, the shape of
stored data and the boundary that guards it. This file rewrites v1 (round OT, commit
`1080af2`) and keeps what held: the terms, the alignment engine, the stored block's
posture, the slice plan's style.

The owner's words, round OX (`TASKS.md` line 30941):

> "I think with the teachers, we want to see almost like an imprint on the right-hand
> side. and we want to find their impressions, positive and negative. It's almost like
> using an affirmation with positive affirmation reinforcement. This should tie to the
> ritual builder as well. And these should be unlockable. by the scoring, by your
> achievements. So this should be a very powerful tool of becoming, kind of using like
> ultra high limiting uh, affirmations. That you won't find in any generic book."

And, same round, on the library and on his teachers:

> "library just means I can get information on my who I'm coaching. I hope that's what
> you mean. and any of my notes and then save the notes. But if you mean the ascended
> teachers, I don't know what you mean. I need context. I don't know, some of the
> teachers would be Akhenaton for light, Zoroastria for truth, Rumi for duty, Krishna
> for flow, Buddha for awareness, Jesus for love. Rumi for beauty, Confucius for nature.
> Ramakrishna for will. Yeah, I think a uh, cohort, they can see the teachers if that's
> shared with them. No, they shouldn't carry a match number."

Where the picture is: `mockups/teachers/imprint.html`, with `imprint-1600.png` and
`imprint-390.png` beside it. The v1 files in the same folder (`teachers.html` and its
three images) are v1's record. They still show Socrates and are superseded for the
panel; they are kept so v1's numbers can be traced.

**A note on the tree.** This work was cut from the local branch
`claude/laughing-feynman-xhfyj3` at `1ee2840`, because the pushed tip does not carry v1
or round OX. v1 and round OX were read from that commit.

## 0. What changed since v1, in six lines

- **T1 is done.** The teacher drill read the seat's load on the wrong scale and missed
  the third eye seat. Fixed in `48ba698` (`ui/drills.js`, with a functional test). It
  reads `coneMirPos` now, the same arithmetic the Compass panel uses. The one reader in
  the engine and the test across every persona, which v1 asked for, are still open and
  are in slice T3.
- **Socrates is out. Zoroaster and Confucius are in.** Two arrive where one left, so the
  count is thirteen teachers, not twelve. Section 2 shows the arithmetic and asks.
- **His nine qualities are reconciled with the shipped Compass** (section 1). They agree
  on five, split on one (the seat of awareness), conflict on two (Rumi named twice, and
  Light given to Akhenaten while the shipped Light axis belongs to Jesus), and Confucius
  is new with an overlap.
- **The panel is an imprint on the right-hand side** (section 3), not a dossier in the
  centre, built from the product's own imprint grammar.
- **New:** limit-breaking lines (section 4), their tie to the ritual builder (5),
  unlocks (6), the three shelves in plain words (7), and the cohort share switch (8).
- **No match number.** v1 kept the alignment score as an internal sort key and printed
  reasons. v2 keeps that, and adds a test that no number of that kind is rendered,
  stored, exported or shared.

## Terms used in this file, once, in plain words

- **Teacher.** The coherent end of one quality on the Compass. A behaviour a person can
  run, never a person to become. **Opposite.** The same quality at maximum inversion. The
  code says `up` and `dn`; the owner says teacher and opposite, and this file does too.
- **Pole.** One teacher at one place on the Compass, keyed by two letters such as `PO`.
  Jesus stands at two poles (`IL` and `RE`), so a count of poles is one higher than a
  count of teachers. **Seat.** One of the seven body bands, Root up to Crown. **Address.**
  One of the 112 exact places in the body where a pattern sits. **Carrying.** An address
  whose held charge reads 4 or more out of 10.
- **Imprint.** What this product calls an address that holds charge: a pill with the
  address name, the seat's colour and a number. Three states: **held** (charge at or above
  4), **installed** (the coherent opposite at or above 4, drawn with a tick, `ui/imprints.js`
  `impPill`), and **pending** (found in a story, not yet committed, drawn as a ghost).
- **Impression.** A plain first-person event, before any reading of it. The Impression
  Excavation document (`SOURCE-TDD-impression-excavation.md`) gives the examples: "My
  chest tightened." "I wanted to leave." "I stopped talking." An impression is distinct
  from an interpretation such as "fear of rejection". A teacher's impressions in this file
  are written the same way: events a person can recognise, not traits.
- **Line.** One limit-breaking sentence from a teacher's set, said at the seat. The owner
  says affirmation; section 4 explains why the surface says line and what that costs.
- **Reach.** A group of two lines that open together. Three reaches a teacher, named for
  what the person does: **Say it**, **Walk it**, **Hold it**. This file avoids the word
  tier for them, because tier already names the plan (free to four) and the practice's
  pacing step.
- **Pacing step.** `tier` on a practice, 1 to 3, set by how heavy the field is. It gates
  what a heavy field is handed and is the product's safety system for practice.
- **Protocol, ritual, practice.** A **protocol** is a release run over a set of addresses.
  A **ritual** is a saved daily plan of practices. A **practice** is one row of the
  practice library.
- **Level.** The reading level `DESIGN-gamification.md` section 6.6 uses to decide who
  an asserted affirmation may harm. Expression is the default and CQ (the coherence
  number, 21 laws summed over 210) is the open alternative (`TASKS.md` BB3 and BB5).

---

## 1. His nine qualities against the engine

### 1a. Reading the shipped Compass

The shipped tables are `MIRROR` (eight poles, `engine/data/compass.js` lines 32 to 96),
`MASTERS` (eleven names, lines 108 to 135), `PATHS` (five, lines 261 to 280) and the 21
laws (`engine/data/canon.js` `SI`, with their seats). Each of his nine words, read
against them:

| His words | Quality | Where the engine already holds it | Verdict |
|---|---|---|---|
| Akhenaten for light | light | `MASTERS`: Akhenaten, "Truth and light", Sat apex, no seat, no mirror pair. But the axis `IL` is labelled **Light** and its teacher is **Jesus** (round KE, his words: "Just change illumination to light"). No law is named light. | **Conflict.** The shipped Light belongs to Jesus. |
| Zoroaster for truth | truth | Law **Truth**, Throat, drawn as a plumb line. The Throat's axis `OR` is Moses (Order). The truth half of Akhenaten's `MASTERS` line. Round LC (`TASKS.md` line 23433), his words: "Is trust actually truth? I don't know whose path trust is. But truth, I understand. Would be Zoroastrianism." | **Agrees with what he said before.** New teacher. Takes Truth from Akhenaten's line and shares the Throat with Moses. |
| Rumi for duty | duty | Law **Duty**, Solar, a yoke on two posts. Domain Duty (Architect). `MASTERS`: **Rama**, "Duty as the spine that keeps all three upright under pressure". | **Conflict.** The engine gives Duty to Rama. Rumi already holds two qualities (below). |
| Krishna for flow | flow | `PATHS` `FL` and `MASTERS`: "Flow". No seat, no law. | **Agrees.** |
| Buddha for awareness | awareness | `PATHS` `AW` and `MIRROR` `PE` (Perception, 3rd Eye); `MASTERS`: "Wisdom and awareness". The law named **Awareness** sits at the **Crown**. | **Agrees on the teacher, splits on the seat.** The quality word is a Crown law; Buddha's axis is read at the 3rd Eye. |
| Jesus for love | love | `IL` (Heart): "Love generated from within. Freely given." `RE` (Crown), ruled: "that would be Jesus at the very top. That's love." `MASTERS`: "Love". No law is named love; the Heart's four laws (Compassion, Forgiveness, Generosity, Aesthetic Beauty) and the Crown's Unity are what it is read from. | **Agrees.** Both poles stay. |
| Rumi for beauty | beauty | `MASTERS`: Rumi, "Ananda as beauty". Law **Aesthetic Beauty**, Heart. Expression scale: Beauty, Heart. | **Agrees.** |
| Confucius for nature | nature | Law **Nature**, Crown, drawn as a branch. Domain **Nature** (Witness), "watching without stepping in". Lao Tzu's "Non resistance" in `MASTERS`. | **New teacher.** The word already names two things in the engine, and the second sits closer to Lao Tzu than to Confucius. |
| Ramakrishna for will | will | `MIRROR` `DE`: "Desire and will", Sacral, "Will surrendered to Source". Expression scale: Will, Solar. `MASTERS` Musashi: "Sustained application of will". | **Agrees.** The word means surrendered will at the Sacral and applied will at the Solar; his teacher is the surrendered one. |

**Where his list is silent.** Order (Moses), Power (Musashi), Trust (Rumi's axis), Charge
(Elijah), Revelation (Jesus at the Crown), Alignment (Rama, if Duty moves) and the
horizontal (Lao Tzu). A list that begins "some of the teachers would be" is not
exhaustive, and this design does not drop a shipped teacher because he did not name them.

### 1b. The three places his list and the shipped Compass disagree

These are his decisions. This file shows the ways each can go and what each costs, and
marks the recommendation. It does not decide any of them.

**A. Rumi named twice (duty and beauty).**

- *Evidence for beauty.* `MASTERS` already gives Rumi beauty, and the Heart law Aesthetic
  Beauty sits where Rumi stands. Rumi also already holds Trust (the `TR` axis), so a third
  quality would make three on one teacher.
- *Evidence for Rama on duty.* `MASTERS` gives Rama "Duty as the spine", the Ramakrishna
  and Rama names are one vowel apart in a transcript, and the same message turns Zoroaster
  into "Zoroastria" and Akhenaten into "Akhenaton". Dictation is changing names in this
  very passage.
- *Most likely reading:* **Rumi for beauty, Rama for duty.** If he does mean Rumi for
  duty, the ways are: (i) Rumi holds both, as Jesus holds two poles, and Rama rests, which
  also brings the count to twelve (below); (ii) Rumi takes duty and beauty goes to
  Akhenaten, whose Great Hymn to the Aten praises the beauty of the risen sun (to be checked by the
  research seat), which puts two close qualities on one teacher; (iii) Rumi takes duty and the Heart law Aesthetic
  Beauty has no teacher until he names one.

**B. Light, Love, Trust and the Heart.**

His list gives Light to Akhenaten (no seat), Love to Jesus and Beauty to Rumi. The Heart
today carries two axes: `IL` labelled Light (Jesus) and `TR` labelled Trust (Rumi). Read
together, his words relabel both: the Heart's pair becomes **Love** and **Beauty**, Light
moves to Akhenaten, and Truth moves to Zoroaster. That closes two older open items at
once: the Compass's open question that Light and Trust share one seat, and his round LC
doubt about whether Trust is Truth.

- *Way one, recommended:* relabel `IL` to Love and `TR` to Beauty. It is a change to the
  `q` field in two rows of `compass.js`, which every surface reads, so one edit. Cost: it
  reverses his round KE ruling on the word Light for that axis, and the codex line for
  Lucifer, "Pride as false light", reads better against Akhenaten's Light than against
  Love; Charon's line, about trust, reads wrong against Beauty. Both opposite lines would
  need his reread. A related fact: the codex puts Geryon's circle at "Heart inverted,
  warmth performed rather than generated", which is love performed, but Geryon is Buddha's
  opposite, so this file does not move him.
- *Way two:* keep Light and Trust on the axes and show his word beside each as a second
  word. Cost: one concept with two names on the surface, which this product has been bitten
  by repeatedly.
- *Way three:* keep the axes and give Akhenaten a different quality word. It contradicts
  his words.

Until he rules, this design writes his word first on the panel and the engine's label
beside it, and the data keeps both (`quality` and `engine`), so the ruling is one edit.

**C. Twelve or thirteen.** In round OT he asked for twelve. The documents name eleven
distinct teachers. Zoroaster and Confucius are two additions, and Socrates, who v1
proposed as the twelfth, is withdrawn: eleven plus two is **thirteen**. Ways:

- *Thirteen, recommended.* He asked for twelve before he named these two, and nothing in
  the shipped codex is dropped. Every count in this design is read off the roster table
  and no test types a number, so thirteen costs nothing extra.
- *Twelve by resting Lao Tzu.* His list does not name him, Confucius takes the Nature law
  he held in v1, and the Farmer of Song (Confucius's opposite) and Shu and Hu (Lao Tzu's)
  are close cousins: both mean well and force. Cost: Lao Tzu is one of the five paths in
  the glossary ("Krishna, flow. Buddha, awareness. Christ, the body. Rama, alignment. Lao
  Tzu, the horizontal. All five end at the same Source"), so resting him makes four paths.
- *Twelve by Rumi holding duty and beauty* (A, way i), which rests Rama instead.

---

## 2. The roster, and every changed row

Status words: **codex** means quoted from the codex as carried in `compass.js`.
**research** means a named figure from the teacher's own tradition, already in
`compass.js` and marked there "until he confirms or replaces them". **PROPOSED** means it
is in no document and is mine, for the owner to confirm or replace. Sources for the
proposed opposites are to be checked by the research seat before anything ships.

| # | Pole | Teacher | His word | Engine label, seat | Opposite | Source of the opposite | Against v1 |
|---|---|---|---|---|---|---|---|
| 1 | `IL` | Jesus | Love | Light, Heart | Lucifer | codex | unchanged row; his word added (B) |
| 2 | `RE` | Jesus | Love | Revelation, Crown | The Furies | codex | unchanged |
| 3 | `DE` | Ramakrishna | Will | Desire and will, Sacral | Asmodeus | codex | unchanged |
| 4 | `OR` | Moses | not named | Order, Throat | Set | codex | unchanged; shares the Throat with Zoroaster |
| 5 | `PO` | Musashi | not named | Power, Solar | Moloch | codex | unchanged |
| 6 | `PE` | Buddha | Awareness | Perception, 3rd Eye | Geryon | codex | unchanged; the law Awareness is a Crown law |
| 7 | `TR` | Rumi | Beauty | Trust, Heart | Charon | codex | **CHANGED:** his word Beauty added (A, B) |
| 8 | `CH` | Elijah | not named | Charge, Root | Phlegyas | codex | unchanged |
| 9 | `FL` | Krishna | Flow | no seat | Kaliya | research | unchanged |
| 10 | `AL` | Rama | Duty (said as "Rumi") | alignment, no seat | Ravana | research | **CHANGED:** quality word Duty (A) |
| 11 | `HO` | Lao Tzu | not named | the horizontal, no seat | Shu and Hu | research | **CHANGED:** laws are Patience and Detachment, because Nature moved; first to rest at twelve (C) |
| 12 | `SA` | Akhenaten | Light | Sat apex, no seat | Apep | PROPOSED | **CHANGED:** quality is Light (v1 had truth and light); law is Transparency; the five marked addresses changed |
| 13 | `TU` | Zoroaster | Truth | no seat; law at the Throat | The Lie (Druj) | PROPOSED | **NEW**, replaces Socrates |
| 14 | `NA` | Confucius | Nature | no seat; law at the Crown | The farmer of Song | PROPOSED | **NEW** |
| | `SO` | ~~Socrates~~ | | | ~~Thrasymachus~~ | | **REMOVED.** The key was never issued, so there is nothing to retire |

Thirteen teachers, fourteen poles, fourteen opposites, all counted off this table and not
typed anywhere in the build.

**The three proposed opposites, and why.**

- **Apep, for Akhenaten's Light.** The one image he left is the sun disc whose rays end in
  hands: light arriving. The Egyptian counter figure is Apep, the serpent that swallows
  the sun each night: light taken in and nothing handed on. To check: the nightly voyage
  texts (the Amduat and the Book of Gates).
- **The Lie (Druj), for Zoroaster's Truth.** Zoroaster's own teaching is a choice between
  truth (asha) and the lie (druj), and the triad good thought, good word, good deed, which
  is thought, speech and action. To check: Yasna 30 and 31. Set is the nearest codex figure
  ("Lies and disorder from within") and is already Moses's, so the Lie is drawn narrower:
  not betrayal of a structure others stand on, but the false word itself and the word kept
  back. The two share one marked address, Lying.
- **The farmer of Song, for Confucius's Nature.** A farmer who pulled each shoot up to
  help it grow, and by evening they were dead (Mencius 2A2, the Confucian tradition's
  emblem of forcing a season). Confucius's own line, "Does Heaven speak? The four seasons
  run their course and the hundred things are born" (Analects 17.19), is the nature
  teaching. The farmer is a near cousin of Shu and Hu, which is why the count question
  (C) names Lao Tzu.

**What each pole reads, so a reading is computed and not asked.** Seat and laws are the
product's own measurements. The marked addresses are mine (the codex gives each opposite a
sentence and never a list of addresses); every name resolves to a real address, checked
against the 112 on the built engine. Changed rows are marked.

| Pole | Seat | Laws read (the one the quality names first) | The opposite's five marked addresses |
|---|---|---|---|
| `IL` | Heart | Compassion, Forgiveness, Generosity | Manipulative Kindness, False Love, Stage Performing, Spiritual Pride, Seeking Validation |
| `RE` | Crown | Unity, Awareness, Nature | Speaking To Be Right, Dogma, Condemnation, Knowing Better Than God, Denial Of Truth |
| `DE` | Sacral | Temperance, Detachment | Addiction, Lust, Hypersexuality, Infatuation, Obsession |
| `OR` | Throat | Justice, Truth, Transparency | Manipulation Through Emotion, Betrayal, Deceit, Lying, Spiritual Language To Manipulate |
| `PO` | Solar | Courage, Responsibility, Accountability | Competition, Entitlement, Need To Win, Superiority, Force |
| `PE` | 3rd Eye | Presence, Humility, Equanimity, and Awareness (Crown) | False Love, Stage Performing, Delusion, Projection, Distortion |
| `TR` | Heart | **Aesthetic Beauty**, then the seat's other three | Closed Heart, Cynicism, Distrust, Overanalysis, Doubt |
| `CH` | Root | Non-Harm, Patience | Fear, Lethargy, Panic, Collapse, Anger |
| `FL` | none | none; read from what is held at the seats | Control, Possession, Resistance, Compulsion, Avoidance Of Grief |
| `AL` | none | Duty, Responsibility | Lust, Entitlement, Excuse, Hubris, Knowing Better Than God |
| `HO` | none | Patience, **Detachment** (v1: Patience, Nature) | Force, Need To Be Needed, Interrupting, Savior Complex |
| `SA` | none | **Transparency** (a pane the light crosses; v1: Truth, Transparency) | **Denial Of Light, Distortion, Nihilism, Self-Exclusion, Rejection Of Spirit** (v1: Deceit, Distortion, Denial Of Truth, Denial Of Light) |
| `TU` | none; home seat Throat | **Truth** | **Lying, Excuse, Denial Of Truth, Self-Silencing, Talking To Avoid Feeling** |
| `NA` | none; home seat Crown | **Nature**, Patience | **Force, Perfectionism, Rigidity, Hubris, Endless Seeking** |

Shared addresses, said once so nobody finds them by surprise: Lying (Set and the Lie),
Denial Of Truth (the Furies and the Lie), Force (Shu and Hu and the farmer), Hubris (Ravana
and the farmer), Distortion (Geryon and Apep), False Love and Stage Performing (Lucifer and
Geryon). A shared address is one imprint with two readings, and the panel for each teacher
shows it in that teacher's frame.

**A seatless teacher with a law gets a home seat.** Zoroaster's law sits at the Throat and
Confucius's at the Crown. A home seat is where their ritual is kept and what colours their
ring. It gives no position on an axis, because Moses already holds the Throat's axis and a
second teacher would print the same number. The drift this fixes is in section 11.

---

## 3. The imprint, on the right-hand side

### 3a. What the product already means by an imprint

- A reading is 112 addresses. An address that holds charge shows as a pill in the seat's
  colour, bigger when heavier. Held reads as the charge; installed reads as a tick and the
  coherent opposite's value; pending reads as a ghost with a plus (`ui/imprints.js`
  `impPill`, `impRender`). They are counted apart on purpose: counting installed as held
  was a defect ("a number that counts a person's progress as their load is worse than no
  number").
- The glossary already says what a positive imprint is. **Replacement state:** "The quality
  a pattern was blocking, installed at the same address once the charge there is
  released... It shows up in what you do, what you feel and what your body does." A teacher's
  positive imprint is that, written for one quality.
- An imprint is found by the sniffer out of a story (`engine/sniff.js`, `parseStory`
  returns `imprints` with a node, a fetter, an amount, and whether the words named it or
  it was inferred). The word **impression** is not in `sniff.js`. It lives in
  `engine/sourceai.js` (the question the Source AI asks: "I froze" and "I left" are an
  impression) and in `engine/trace.js` (a node type: a story produces an impression, an
  impression supports a pattern).

### 3b. What a teacher's imprint holds

Two blocks, in two states, and one reading.

- **Runs clean (the positive impressions).** What the quality leaves in a day.
- **Runs as the opposite (the negative impressions).** What the inversion leaves.
- **In your reading.** The opposite's five marked addresses, drawn as the product's own
  pills: held if at or above 4, installed with a tick if the pole is at or above 4, and
  quiet if under the line. This is where the static impressions meet the person's own
  imprints, through the product's own grammar and no second one.

Each block has four lines, one per channel, because the owner's words name four: **Do**
(behaviour), **Think** (thought), **Body** (where it sits or what the breath does) and
**Say** (speech). Each line is one sentence, a plain event, in the second person present
("You give something away and tell nobody"), because the panel is the product's reading
and the product's readings address the person. Rules for a line:

1. An event a person could recognise from their own day, and never a trait or a label.
2. Physical. No abstract noun as the subject (love, power, worth).
3. Specific to the teacher: swap it onto another teacher and it must be wrong.
4. No instruction to a nervous system ("relax", "gently"), no soft wellness words, no
   medical claim. A body line reports a sensation, never an outcome.
5. Sentence case, no em dash, and it passes `check.py --line`.

All 14 poles have all 8 lines in Appendix A. They are drafts for the owner to edit, in the
same posture as the rituals of becoming in round KQ ("plug that in, we'll edit it later").
The whole text, Appendix A and the panel, passes the voice gate with no hard failure.

**Find them.** "We want to find their impressions" is read two ways and the design serves
both. The teacher's impressions are shown. And each line carries a ring the person can
mark as theirs ("Mark as yours"). A mark is stored as an id from a closed set of eight
(`pos.do` to `neg.say`), never as text, so it adds no free-text field the practitioner
model would later have to hide. A marked negative line is also what picks the belief a line
goes past (section 4). Marks never leave the device unless the person shares them, and the
share in section 8 does not include them.

### 3c. The panel, top to bottom (336 pixels wide at desktop, the rail's own width)

1. **Who.** Ring, name, quality, one sentence of reading: for a seated teacher the position
   on the axis ("That puts you at 67 on this axis"); for a seatless one the law that
   quality names ("The truth law reads 4.6 of 10 for you"). One sentence: "A behaviour a
   person runs, not a person to become." For Jesus, a switch between his two poles.
2. **The imprint.** The two blocks of section 3b.
3. **In your reading.** The five pills and one sentence naming how many carry, in words
   ("One address is carrying") because `check.py` refuses "1 of 5", a count against a
   total, which turns a reading into a score. v1's mockup printed "2 of 5 are carrying"
   and the gate refuses it; v2 does not.
4. **Lines.** Section 4. Reaches, lock states, today's line.
5. **A ritual toward the quality.** Section 5.
6. **Share with your lead.** Section 8.
7. **Foot line.** On every opening: behaviours a reading can place, not people. A line
   supports the work and does not cause a change. Nothing here diagnoses or treats anything.

On a phone the 14 names become a wrapped grid of rings above the panel, never a hidden
scroller, and the panel is the page.

**Empty states, each with its own words.**

| State | What the person sees |
|---|---|
| Nothing read yet | Both blocks and the lines show, because they need no reading. "In your reading" says "Not read yet". The ritual is paced at step 1. |
| Nothing carrying at the opposite's addresses | "Nothing here is carrying. The five addresses read under 4." The release offer is absent and says why. |
| A teacher with no authored practice | The ritual shows the lines step alone, which every teacher has. |
| Not signed in, or a worked example | Marks, starts and the share switch refuse in words: "Marisol is a worked example, so nothing here is saved." (the existing `ritWhose` posture) |
| Held by the plan | The reading is open on every plan. Which saboteur or complex runs on those addresses is held by `SIGHT` and says so with `lockPanelHtml`; nothing is typed here. |

---

## 4. Lines: limit-breaking affirmations

### 4a. What the product already says about an affirmation, and why this design differs

Three things are already on the record, and they shape the form.

1. **The glossary** says "Limiting belief: A tag that squeezes something big you lived
   through into a small label. Every time you say I am this, you make one." and, under
   Letting go, "An affirmation does only the second and skips the first." So an "I am"
   sentence is the same object as the thing it claims to cure, and a line alone installs
   into an address that has not been cleared.
2. **The release cards** already ship installation lines ("I have power available without
   force... My will is calm and direct."), and `CARD_STEP` tells the person to state the
   installation "not as an affirmation, as a somatic claim. Hold it at the address until
   the body confirms it."
3. **`DESIGN-gamification.md` sections 5.4 and 6.6** refuse the asserted affirmation, on
   Wood, Perunovic and Lee 2009: a person with low self-regard who repeats a positive
   self statement feels worse; the arm that did no harm held it as both true and not true.
   The refusal is priced there at minus 0.1 points on expression and 0.0 on CQ, and which of
   the two readings decides the level is his open question.

So the owner's request meets a standing position. This design keeps his intent and keeps
the safeguard, in four ways:

- A line is a **behaviour sentence**, never "I am" and never a claim about worth. It states
  something a camera could film. That is also what makes it "not in any generic book".
- It is held as a **somatic claim**: said once, held at the seat, read for expansion or
  contraction, with contraction written down as data. The Somatic Truth Check already in
  the practice library (`truth`) is that step.
- Below the level (4b), the same line is shown in **hold form**: "Hold this against the
  body and read it. Do not say it as a fact." Both halves are shown, which is the arm that
  did no harm.
- Lines are the **install half of the two mechanics**, so when an address of the opposite
  is carrying, the panel says release first (the existing release, the existing card),
  and the line follows.

The surface says **line**, not affirmation, in the places a person reads, because
affirmation names the pattern the research warns about. The owner's word stays in this
file and in the ask. That is a naming call and goes to him in question 3.

### 4b. The method: what makes a line "not found in a generic book"

A generic line can be put on anyone. A limit-breaking line cannot be put on anyone,
because it is built from four things that differ per teacher:

1. **The quality's axis.** One behaviour of the quality, not its name. The line never uses
   the abstract noun (truth, love, power, worth).
2. **The seat it runs through.** The line is held at the seat's place in the body, and the
   seat's laws set what the line costs. Zoroaster's lines are held at the throat.
3. **The inversion's behaviours.** Each line is written against one specific limiting
   belief that the opposite runs on. The belief is named under the line as "Goes past".
   The line does not argue with the belief. It performs the thing the belief says cannot be
   done, and so it is a counter-example and not a denial. "I am not afraid" argues. "I say
   the true thing once and let the room go quiet" performs.
4. **The person's own imprints.** The product may find, cut and mark. It may not write,
   complete or correct (`DESIGN-gamification.md` 5.5). So personalisation is selection and
   quotation, never composition: the line shown first is the one whose belief matches a
   negative impression the person marked as theirs; and where the person's own committed
   words contain the belief verbatim, the panel prints their span beside the line ("You
   wrote: ...") and writes nothing in their voice.

**The form.** One sentence. Present tense. Behaviour first. First person, because it is
said. No "I am". Under 25 words (the house keeps 99.4 percent of sentences under that).
It names a cost or a condition where one exists ("on the day my word costs me").

**Five checks, with what each can and cannot catch.** The voice gate catches house voice
and not specificity: `check.py --line "I am enough."` returns no hard failure, so passing
the gate is not evidence a line is good. The five checks are:

| Check | Question | Mechanical proxy |
|---|---|---|
| Camera | Could a camera film it? | the verb after "I" is not am, feel, believe, know, trust, allow, choose, deserve, accept |
| Swap | Is it wrong on another teacher? | content-word overlap between two teachers' lines stays low |
| Past | Does it name the belief it goes past? | every line carries a belief of its own |
| Cost | Does it name a cost or a condition? | read by a person, not a regex |
| Body | Is it held at a seat? | the reach card names the seat |

The proxies were checked against a known bad case first (this repository's own rule for
any probe). Eight generic lines ("I am enough", "I am worthy of love", "I deserve
abundance", "I am powerful beyond measure", "I attract positive energy", "I trust the
universe", "I am at peace with who I am", "I choose joy today") fail all eight, and the 12
proposed lines below pass all 12. The largest content-word overlap between any Zoroaster
line and any Rumi line is 0.18. These are proxies: they catch the generic and cannot prove
a line is specific. The Cost and Body checks are a person's.

### 4c. Worked sets, PROPOSED

Six lines each, for two teachers chosen because they differ most: Zoroaster (Truth, no
seat, home seat Throat, his word and his earlier "Zoroastrianism" for truth) and Rumi
(Beauty and Trust, Heart seat, the contested teacher, and the one most likely to slide
into soft wellness language). Each line passed `check.py --line` with no hard failure, and
so did each belief.

**Zoroaster, truth, held at the throat. Opposite: the Lie.**

| Reach | Line | Goes past |
|---|---|---|
| Say it | I say the true thing once, in one sentence, and I let the room go quiet. | If I say it plainly I lose the room. |
| Say it | I end the true sentence where it ends and add no softener after it. | A softened truth is still the same truth. |
| Walk it | When the excuse starts in my mouth, I say what happened instead. | An excuse protects the people I care about. |
| Walk it | I tell the person the thing I have been telling everyone but them. | It is kinder to say it behind their back. |
| Hold it | I let them be angry at what I said and I keep my feet where they are. | If they are angry, I was wrong to say it. |
| Hold it | On the day my word costs me, I keep it and I say what it cost. | A promise only binds me on the day it is easy. |

**Rumi, beauty and trust, held at the heart. Opposite: Charon.**

| Reach | Line | Goes past |
|---|---|---|
| Say it | I stop for the one thing that moves me and stay with it for three breaths before I explain it. | I have to understand it before I let it move me. |
| Say it | I let what moves me land in my chest before I decide what it means. | If I feel it before it is proved, I am a fool. |
| Walk it | I take one step toward what moves me before I have proof that it is safe. | I will go when I have enough information. |
| Walk it | I tell one person what moved me and I attach no evidence. | If I cannot prove it, I should not say it. |
| Hold it | I keep my chest open while the beautiful thing and the loss are in it together. | If I let it in, I will not be able to bear it. |
| Hold it | I cross the threshold I have been measuring and I leave the measuring unfinished. | I am not ready until I have checked everything. |

How the six climb. Say it is the line stated and held for a breath. Walk it is the same
quality taken into one act with another person. Hold it is the same act under cost, with
the other person's reaction in the room. Each reach is harder to say and cheaper to
believe, because the person has by then done the thing the line describes.

The hold form of the first Zoroaster line, as the surface shows it below the level: "Hold this against the body and read it. Do not say it as a fact. I say the true
thing once, in one sentence, and I let the room go quiet."

### 4d. The loop: positive reinforcement that supports and never causes

Four moves, in this order, and each one is a thing that already exists or is named in
section 6.

1. **Affirm.** Say today's open line once at the seat and hold it for ten breaths. The
   line for the day is read, not stored: one of the open lines by day number, so two
   devices agree and nothing has to be kept.
2. **Do the aligned practice.** The teacher's own practice from the ritual (for Zoroaster,
   The Plain Word).
3. **Record the evidence.** Today that is marking the ritual done, which is a record that
   the practice happened and, in the practice engine's own words, "not evidence of change".
   Later it is one line the person writes about what they did that the old pattern would not
   have done (an `evidence_record` of type behavioural and dimension effect in
   `engine/practice.js`, whose writer is not built yet).
4. **The next line opens.** By the unlock rules of section 6.

What the reinforcement is: the person is shown what they did, and the next thing opens.
What it is not: no points lost, no streak reset to zero (the run halves, `streakRead`), no
countdown, no leaderboard, no "you missed". The line is not claimed to cause anything: the
foot line says it supports the work and does not cause a change, and nothing in the panel
makes a medical claim.

---

## 5. The ritual builder tie

### 5a. What exists, read from `ui/ritual.js` and `engine/data/practice.js`

A ritual is a plan: `{id, steps:[practice keys], when, where, days, from, stop, band,
track, rel, tc, tags, on, tm}`, kept beside the record under the store key
`atuned-ritual-active`, with a day log in `p.rituals` that the boundary validates.
`ritPlanOk` accepts a plan only if every step is a key in the practice library
(`RIT_STEP`, read off `PRACTICE`) and, if `tc` is set, only if `becomingOf(tc)` answers.
`ritStartPlan` is the one writer. `tc` marks a ritual of becoming. Round KQ added the
eight teacher practices (rows with `tc`, left out of `ritFor` so the practice a seat calls
for is unchanged), the table `BECOMING` (pole key to the practices done toward it), and
`becomingSteps(k, tier)`, which holds back any step above the person's pacing step and says
so. `ritTeachHtml(k)` prints the section "A ritual toward <quality>" with the steps and the
Start for a week and Start for two weeks buttons, and `ritTeachStart` calls `ritStartPlan`.

### 5b. What v2 adds, and nothing else

- **One practice row per pole for its lines**, `aff_<KEY>`, with `tc` set to the pole and a
  new flag `aff` naming the pole. Track Somatic, 2 minutes, pacing step 1 (the line is
  always open, because the lines are the gentlest thing in a ritual and the cautious side
  is the right default). Because the row has `tc`, `ritFor` never calls it and the builder
  never lists it; it is reached through its teacher only. Because it is in `PRACTICE`, the
  boundary accepts it with no schema change, which is the posture round KQ took.
- **Three new aligned practices**, for the three new poles (drafted in the section 12 list):
  The Plain Word (`TU`), Hand It On (`SA`), Tend, Do Not Pull (`NA`). All three pass the
  voice gate.
- **`BECOMING` gains rows for `SA`, `TU`, `NA`**, and every row gains its lines step. The
  order is the loop: ground, say the line, do the practice. For Zoroaster:
  `['box', 'aff_TU', 'plainword']`.
- **`becomingOf` reads the new poles.** Today it finds a teacher in `MIRROR` or `PATHS` and
  nothing else, and it marks anything not in `MIRROR` as a path, which makes
  `ritTeachHtml` print "The five paths sit at no one seat". New poles are not paths, so the
  row carries `home` and the sentence is chosen by whether the pole is a path or has a home
  seat.
- **A render hook for a lines step.** Wherever a step prints (the section in the panel,
  `ritRowsHtml`, the open card), a step with `aff` prints the person's open line for the
  day instead of static text.

### 5c. What a person sees

1. They open a teacher. The panel shows the ritual: three steps, their minutes, and, on the
   lines step, today's line ("Today's line, held at the throat: ...").
2. They press **Start for a week**. `ritStartPlan` writes the plan with `tc`, the ring
   appears on the Ritual page under Active, labelled "Toward Zoroaster" (the label already
   exists, `ritual.js` line 875), with one dash per step.
3. Each day the ring's card shows the three steps. The lines step shows that day's line.
4. They mark the ritual done. The ring closes, the day goes on the record (`p.rituals`,
   `done:true`), and, if a reach has just opened, one quiet line says so on the card and in
   the panel ("Walk it is open."). No pop-up, no sound beyond what the ladder already makes.
5. Pacing is unchanged: a heavy field is handed what `ritFor` would hand it, and the lines
   step, being step 1, is the one thing that is always there.

### 5d. What does not change

The plan shape, the writer, the record's `rituals` shape, `ritFor`, the builder's library,
the streak, and the boundary's `ritPlanOk`. A saved ritual a person already has keeps
loading. Ritual plans still do not travel with an export (named in `ritual.js` lines 38 to
44 as a cost), and this design does not make that worse.

---

## 6. Unlocks

### 6a. What unlocks, and what is always open

Always open on every plan, because first contact is never locked and a reading is not for
sale (`engine/plan.js` "SIGHT IS NOT FOR SALE"): who the teacher is, the opposite, both
imprint blocks, the pills, the ritual, and **Say it**, the first reach. Unlocked by what the
person does: **Walk it** and **Hold it**. Nothing here hides a reading, and no unlock can
be bought. A line is words; opening one spends nothing.

### 6b. The conditions, from a closed vocabulary, and where each is read today

| Condition, in plain words | Counter | Read from | Exists today? |
|---|---|---|---|
| The person chose this teacher | `chosen` | `teach.focus` (new, section 9) | needs T5 |
| The teacher's ritual done on N different days | `teachDays(p,k)` | `p.rituals[]` entries with `done:true` whose `steps` hold one of this teacher's own steps; distinct local days through `pracDay` | **derivable now.** Must not use `pracDays` or the streak: they count a day a ritual was set and never done (`PRIORITY.md` 21.J2, and `POINTS-AUDIT.md` probe X2). An entry saved before the `done` key existed is left out here, not read as done. |
| An address of the opposite released | `teachReleased(p,k)` | `p.meter.unique` keys, whose first segment is the address id (`schema.js` 960) | **derivable now** |
| Minutes practised | `ledgerRead(p).minutes` | the ledger | derivable now; not used by the first pass |
| A generic ladder mark (First run, Ten addresses, Sixty minutes) | `mark:<k>` | `ladderRead(p).earned` | derivable now, but a mark can vanish when the record changes. Used only through a stored grant, below. |
| Seven, Thirty or Ninety days in a row | `mark:week`, `month`, `season` | `streakRead.best` | **waits** on Points slice 0 (the 21.J2 fix) |
| A state mark (First clearing, Five clear) | `ledgerRead.clear` | a reading | **excluded by rule.** An unlock reads what a person did, never a reading of them. |
| A points total or a points family | `points:<family>:N` | nothing | **waits** on the Points engine (`POINTS-AUDIT.md` slices 3 and 4), and only if the owner rules points in |
| One line of the person's own evidence of effect | `evidence:<k>` | `p.practice.evidence` | **waits** on the Practice screens and the ritual writer cutover (`PLAN.md` C.17); the writer is not built |
| Never relocks: a stored grant | `teach.opened` | the profile | **today**, in the block below; moves into `p.progress.grants` when the Points ledger lands (slice 2) and the old path keeps reading |

### 6c. The first pass, one table, the owner's to move

`TEACH_UNLOCK` in `engine/data/teachers.js`. Values are a first pass, like `BECOMING`.

| Reach | Opens when | A route with no spend |
|---|---|---|
| Say it | the person chose the teacher | the same |
| Walk it | the teacher's ritual done on 5 different days | the same |
| Hold it | the ritual done on 14 different days and one address of the opposite released | the ritual done on 28 different days |

Every row has a route that spends nothing, so no unlock is behind a payment: ground opened
spends patterns, and a free week banks ten patterns toward a run, so a release must never be
the only way in. A test asserts that every reach has a zero spend route.

### 6d. The rules

- **Nothing goes down.** A reach once opened stays open. Stopping for a month, deleting a
  ritual day or a clock set wrong does not close it. That is why a grant is stored: marks are
  recomputed on every read and a mark can vanish (`POINTS-AUDIT.md` probes X9 and X10).
- **No count of a total.** The panel never prints "2 of 5" or a bar. It names the next
  reach, says what it takes in words, and says what has been done so far in words ("It has
  been done on none yet"). Reaches beyond the next are not enumerated ("A further set opens
  after that one."), the ladder's own rule: "Earned marks are shown. The next one is named
  with what it takes. The ones beyond it are not enumerated."
- **No urgency.** No timer, no expiry, no "unlocks in 3 days".
- **Points never go down.** If a points engine arrives, it is a projection and not a stored
  number, never negative, never spent, and no function maps points to an unlock that was
  open before.
- **A forged grant opens words and nothing else.** The boundary validates the shape of a
  grant, not the entitlement, because refusing a record over an unsupported grant would let
  a deleted ritual day brick a profile. The cost of forgery is zero because nothing is spent.

### 6e. What waits on the Points engine

Everything in 6b marked waits. The first pass needs none of it. When the engine arrives the
conditions are table rows and not code: a row gains a `points` operand, a mark operand moves
from derived to granted, and `teach.opened` migrates into `p.progress.grants` with the same
`{k, at}` shape. Slice T11 carries it.

---

## 7. The library, in plain words

He read "my library" as the Practitioner's information about who they coach, and their
notes. That is a real thing, and it is not what this file meant. Two different things have
been called a library, so here are both, with an example of each.

**The protocol shelves.** When a person presses Run on a teacher, a protocol can come from
three places.

1. **The practices that ship in the app.** The practice library: 25 rows at this commit
   (read off `PRACTICE.length`, so it will not stay 25), each a single exercise with
   minutes and a pacing step. *Example:* Box Breathing, 5 minutes. Always there, nothing to
   save.
2. **Rituals the person has saved.** A ritual is a daily plan of practices; saving one puts
   it under Active on the Ritual page. *Example:* "Box Breathing, then The Same Cut, a week,
   weekdays, toward Musashi." Empty until the person starts one.
3. **Release cards run over the addresses carrying.** A release card is a written release
   for one charge, run over the addresses that are carrying; running it opens new ground and
   spends patterns, and re-running ground already opened is free. *Example:* the Shame card
   over Self-Silencing, one address, because Self-Silencing answers to Shame and is carrying
   at 4.4 for Derek. Offered only when an address is carrying.

**The fourth thing is not a shelf.** The Practitioner's client information and saved notes:
who they coach, what each person has chosen to share, and notes about each, private by
default and shared only by an explicit press (`PRACTITIONER-STORY.md`, slices PR1 to PR4
built first against the worked examples, PR5 to PR9 waiting on accounts). A teacher's panel
shows nothing from it, and a note never feeds a protocol.

**The default, one.** When a person opens a teacher and wants a protocol: **their own saved
rituals first, then the shipped practices, with release cards offered when addresses are
carrying.** The order within a shelf is the alignment engine's (section 9b), which is an
internal sort and prints nothing.

The one plain question that remains is question 2.

---

## 8. Sharing a teacher with a cohort lead

**What he said:** a cohort lead can see the teachers if the person shares them. **What the
standing rules say:** a lead sees fetters, saboteurs, complexes, hyper complexes and
analytics, and not "the spiritual material" or the story (`engine/plan.js` `LEAD_SEES` and
`LEAD_HIDDEN`; `DECISIONS.md`). A person's chosen teacher is in the second list. His new
words carve an exception, and `CLAUDE.md` says what an exception to that list needs:
explicit consent, a visible list of who has sight, revocation, and never a silent default.

### 8a. The two keys

A lead sees a teacher only if **both** are true: (1) the person has linked that lead and the
grant includes a **teachers** scope, which is a new line on the grant screen, unticked by
default (`PRACTITIONER-STORY.md` PR5 lists the scopes read and notes); and (2) the person has
switched sharing on **for that teacher**. Turning the grant on never turns a teacher on.
Importing a record cannot create either key: an imported `share.on` is inert until a grant
exists, and a grant is made only by the person on the grant screen.

### 8b. The switch

On the panel, under "Share with your lead", a switch labelled "Share this teacher and the
lines I have opened". It is off. Pressing it opens a confirmation that says exactly what is
sent:

> Share Zoroaster with your lead?
> This sends that you chose Zoroaster and which set of lines is open.
> It does not send the lines you marked as yours, any word you wrote, or your story.
> Turning it off stops new views at once. It cannot take back what a lead has already seen.
> [Share] [Not now]

Each sentence passed `check.py --line` with no hard failure. The switch is a real switch
(`role="switch"`, `aria-checked`), 44 pixels tall at least, and a failed write answers
through `status()`: the switch does not claim "on" before the record has saved.

### 8c. The visible list, and the revoke

When on, the panel lists who sees it: the lead's username (usernames are 3 to 20
characters, ruled in round OX), the date linked, and what they see ("Sees Zoroaster and that
Say it is open"), with a **Revoke** button beside each. Revoke turns this teacher's share
off at once. The same list, for every scope and every lead, is the person's side of the
grant model (`PRACTITIONER-STORY.md` PR4, in Settings, "empty until accounts"), and this
panel's list is that list filtered to this teacher.

**Until accounts exist** nothing is sent and no lead can be linked. The switch still
records the person's consent so that it is already correct on the day accounts arrive, and
the list reads "Seen by nobody. No lead is linked." The panel says so; it does not show a
switch that appears to be doing something.

### 8d. What is stored, and what is never in it

Additive, on the profile, one field per focused teacher: `share: {on, at}`, where `at` is
the ISO date the switch last changed (a revoke keeps its date, so the person can see "off
since"). What leaves, when a lead is linked and the switch is on, is built by one function,
`teachShareOut(p)`, and returns for each shared teacher only a pole key and the reach opened.
It carries no name, no line text, no marks, no evidence, no story, no number about the
person, and no match number. A test asserts the function's output has exactly those keys.
The lead's own screen looks the teacher up by key, so the lead sees the product's public
content (name, opposite, impressions), not anything the person wrote.

### 8e. Where it is validated

At `validateProfile`, by name, never clamped (section 9). A share block that is not a
boolean and a date is refused, and so is any key that is not one of the two.

### 8f. What the design does not claim

Revoking stops new views. It cannot recall what a lead has already seen, and the panel says
so. Records off the device make a controller exist, with access, deletion and breach duties
(`CLAUDE.md`), and that is the accounts build's to settle, not this panel's. A lead
assigning a teacher or building a ritual from one is a practitioner write with provenance
(`PRACTITIONER-STORY.md` PR8) and is out of scope here.

---

## 9. The engine

### 9a. Pass one: what is stored, what is derived, and is anything both

| Fact | Stored or derived | Where |
|---|---|---|
| Teacher, opposite, quality, codex line, seat | stored, in tables | `compass.js` (unchanged) |
| The 14 poles' impressions, marked addresses, home seats, the three new poles, the lines | stored, in one new table | `engine/data/teachers.js` |
| Which practices a teacher calls for | stored | `BECOMING` and `PRACTICE`, extended |
| Where a person sits on an axis | **derived** | `mirrorAt` |
| How many of the opposite's addresses are carrying | **derived** | the field, `W[].sq` |
| The alignment of a protocol to a teacher | **derived**, never stored, **never printed** | `teachFit` |
| Which reach is open by the rules | **derived** | `teachReach` |
| Today's line | **derived** | by day number over the open lines |
| Which teachers a person focuses, the marks, the share switch | stored, new, small | `teach.focus` |
| Reaches opened, once, never removed | stored, new, small | `teach.opened` |
| Starts toward a teacher | stored, new, small, optional | `teach.runs` |

Is anything both? One thing needs saying. A reach is derived (it follows from the record)
and also stored (the grant). That is deliberate and is the one place this file stores a
derivable fact: a derived mark can vanish and an opened reach must not. The grant is the
event, "this opened on this day"; the derivation is only how the build decides to write it.
The alignment is not stored on a protocol or the profile, and there is no field for it.

**One identity, not three name joins.** Teachers live in three lists (`MIRROR`, `PATHS`,
`MASTERS`) joined by string equality on a name. Everything here is keyed by the **pole key**,
which is already `BECOMING`'s and the plan's `tc`. Pole keys are append-only: a key is never
reused or renamed, a retired teacher keeps its key and is marked `retired`, and display
order is a separate list (`TEACH_ORDER`) so it moves freely, the rule the tab integers
carry. Compass is tab 8 and Settings 9; no tab is added and no tab integer moves, so
`TABDEF`, `TABFOLD`, `TABEXTRA`, `TABREAL` and `TABOF` are untouched. The panel looks a
teacher up by `.k`, never by position.

### 9b. The alignment, kept from v1, with the shelf order added

Alignment answers one question: for this teacher, how well does a candidate from the
library line up, on fields that are stored and compared. It reads no words, no mood and no
practice text. A candidate is one of the three shelves of section 7, turned by `teachCand`
into one shape. Three components, each from a field that exists:

1. **Authored link, weight 0.5.** 1 if the candidate's `tc` is this teacher, else the share
   of its steps in `BECOMING[teacher]`. The owner's own table. Absent for a release.
2. **Seat, weight 0.2.** 1 if the teacher's working seat (the axis seat, the home seat, or
   for a path the seat carrying the most) is among the seats the candidate works at, through
   the one table `TRACK4BAND`.
3. **Cover, weight 0.3.** For anything with addresses, the share that are among the
   opposite's five marks and are carrying. This is his round LC sentence: "the sniffer
   should be looking for all the patterns that are on the opposite".

The score is the weighted mean over the components that apply, renormalised. A candidate
qualifies only through the authored link or through cover; seat can raise it, never admit it
(measured in v1: with seat allowed to qualify, a generic Somatic practice scored 0.29 for
Musashi by coincidence of a coarse table). **Pacing is a gate, not a score:** a step above
the person's pacing step is held, never listed as open, and says "opens as the charge drops".
Nothing is offered to a heavy field that `ritFor` would not offer.

**The shelf order is the sort, and the score is not shown.** The panel lists candidates by
shelf (saved rituals, then practices, then a release if an address carries) and by the score
only inside a shelf. Why this is not arbitrary: every input is a stored field read through a
table the owner rules on; `TEACH_W` sums to 1 by test; it is monotone (remove a carrying
address and cover falls); it is deterministic (ties break on minutes, then key); and it
explains itself with reasons ("Written for Zoroaster", "Both carrying"). **No match number
anywhere**, which he ruled in round OX, is the same line as his earlier ruling that "a
number that does not say what it is out of is meaningless": the score has no scale a person
could read, so it is not a number a person is shown. Section 9g lists the tests.

### 9c. The functions

Host free: no `document`, `window`, `fetch`, `navigator` or `localStorage`. In two new
engine files, `engine/data/teachers.js` (loaded after `data/practice.js` in `MANIFEST`) and
`engine/teach.js` (after `engine/practice.js`).

```
/* data */
TEACH_V = 1                       /* the stored block's own version */
TEACH_FOCUS_MAX = 3               /* working memory holds about four */
TEACH_RUNS_CAP = 2000             /* refused above, never truncated */
TEACH_CH = ['do','think','body','say']
TEACH_IMP_IDS = ['pos.do',...,'neg.say']          /* the closed set a mark may name */
TEACH_REACH = [{r:1,nm:'Say it'},{r:2,nm:'Walk it'},{r:3,nm:'Hold it'}]
TEACH_UNLOCK = [{r:1,needs:['chosen']}, {r:2,needs:[...]}, {r:3,any:[[...],[...]]}]
TEACH_W = {authored:0.5, seat:0.2, cover:0.3}
TEACH_ORDER = ['IL','RE','DE','OR','PO','PE','TR','CH','FL','AL','HO','SA','TU','NA']
TEACH_ROWS = [{k, who, quality, engine, seat|null, home|null, opp, from, retired,
               imp:{pos:{do,think,body,say}, neg:{...}}, marks:[addressName], laws:[lawName],
               lines:[{r, line, past}]}]

/* reading the roster, pure over the tables */
teachPole(k)      -> everything about one pole, composed from MIRROR, PATHS, MASTERS and TEACH_ROWS
teachRoster()     -> [{who, poles:[k]}]            /* Jesus once, with two poles */

/* the one impure line: reads W, bandIg and the reading once into a plain object */
teachCtx(r, sees) -> {unread, pacing, seats:{...}, sq:{id:n}, pole:{id:n}, laws:{name:n|null}, level}

/* everything below is pure over ctx and the profile */
teachSeat(ctx, seat)          -> the one reader of a seat; the four callers read it (v1's T1 follow-up)
teachAt(k, ctx)               -> {seat|null, pos|null, laws, thinnest, held:[...], installed:[...], carrying:n}
teachDays(p, k)               -> whole number, distinct local days a ritual was done with one of k's steps
teachReleased(p, k)           -> whole number, distinct addresses of k's opposite found in p.meter.unique
teachReach(p, k, now)         -> {open:0..3, next:{r, say:'plain words'}|null, via:{days, released}}
teachLineOf(k, open, day)     -> the one line for the day, round robin over the open lines
teachForm(level)              -> 'say' | 'hold'     /* reads the same level as DESIGN-gamification 6.6 */
teachCands(shelves, ctx)      -> [cand]
teachFit(k, cand, ctx)        -> {score, parts, why:[reasonKey], qualifies}      /* score is internal */
teachAligned(k, shelves, ctx) -> {saved:[...], practise:[...], release:[...], held:[...], empty}
teachRunPlan(k, cand, ctx, p) -> {via:'relPick'|'ritStartPlan'|'ritOpen', ..., cost, refuse}
teachShareOut(p)              -> [{k, r}]     /* the only thing that can leave; nothing else */

/* the boundary */
teachBlank()                  -> {v:1, focus:[], opened:[], runs:[]}
teachValidate(errs, o, path)  -> teach
```

### 9d. The stored shape, additive, versioned, validated

```
teach: { v: 1,
  focus:  [ { k:'TU', at:'2026-10-02T09:14:00.000Z',
              mine:['neg.think'],                 /* ids from the closed set, never text */
              share:{ on:false, at:null } } ],    /* consent, per teacher, off by default */
  opened: [ { k:'TU', r:1, at:'2026-10-02T09:14:00.000Z' } ],   /* a reach opened; never removed */
  runs:   [ { t:'2026-10-02T09:20:00.000Z', tc:'TU', kind:'ritual', n:3 } ] }
```

It holds no free text, no story, no address id, no name and no number about the person. `n`
in a run is a count of steps or addresses. v1's `runs` is kept unchanged and is optional.

- **Blank and load.** `blankProfile` gains `teach:teachBlank()`. `loadProfile` fills a
  missing or non-object `teach` from the blank, as it does for `practice` and `summaries`. A
  record with no `teach` loads, and every teacher reads as never worked toward.
- **The boundary names `teach` at the top level,** because a key the boundary does not name
  is deleted on the next load (`schema.js` lines 125 to 131 say so for `trace` and
  `summaries`).
- **No `SCHEMA_V` bump.** `teach.v` is the block's own version, as `PRACTICE_SCHEMA_V` is
  for `practice`. The profile stays version 2. Whether this touches the cross compatibility
  contract with SOURCE is the owner's call, as `CLAUDE.md` says of the schema. It is needed
  from slice T5 only.

What the boundary refuses, by name, and never clamps (a clamped 9999 would read as a count
the person never earned):

| The input | The refusal |
|---|---|
| `teach` is a list or a number | `teach is not an object` |
| `teach.v` is 2, 0 or `"1"` | `teach.v 2 is newer than this build reads (1)` |
| a key not in the closed set | `teach may not carry email` (and `customer_id`, `subscription_id`, `key`, `secret`, `token`, `session`, `password`, `card`, `payment`, `stripe`, `user_id`, read from `PR_NEVER` and not retyped) |
| a stored match number | `teach may not carry score` (and `match`, `fit`, `rank`, `percent`) |
| `focus` has four entries | `teach.focus holds 4, which is more than 3` |
| a repeated pole | `teach.focus repeats TU` |
| an unknown pole | `teach.focus[1].k names no teacher: ZZ` |
| a mark that is not in the closed set | `teach.focus[0].mine[1] names no impression: pos.fly` |
| a repeated mark | `teach.focus[0].mine repeats neg.think` |
| `share.on` is not true or false | `teach.focus[0].share.on is not true or false` |
| `share.on` true with no date | `teach.focus[0].share.on is true and has no date` |
| a key in `share` that is not `on` or `at` | `teach.focus[0].share may not carry note` |
| `opened[i].r` is 0, 4 or 2.5 | `teach.opened[2].r is out of range: 4` |
| a reach opened twice | `teach.opened repeats TU reach 2` |
| `runs` over the cap | `teach.runs holds 2001, which is more than 2000` |
| a bad kind, a bad date | `teach.runs[4].kind is not a kind of run: ritul`, `teach.runs[4].t is not a date` |

**Retired keys are accepted.** The key list is append-only; a record naming a retired
teacher still loads.

### 9e. Pass two: what can fail, and does it say so

| Write | Fails when | What the person is told |
|---|---|---|
| Start a ritual toward a teacher | the store is not bound or throws; a worked example | `ritWrite` answers through `status()`. Unchanged. |
| Run a release | nothing left to spend; a worked example | the release panel's own refusal, and the plan route at zero. Unchanged. |
| Mark an impression, focus a teacher | `pSave` fails | `status('Not saved. Your mark was not recorded.', 'bad')`. The control never claims success before the write has. |
| Write a reach grant | `pSave` fails | the reach still shows open this session and the status says "Not saved. This will open again when you do the next practice." Never silent. |
| Turn the share switch on or off | `pSave` fails | `status('Not saved. Sharing is still off.', 'bad')`, and the switch returns to what is stored. |
| Import a profile with a bad `teach` | validation | `pImport` stays atomic: nothing is pushed, `CURP` does not move, `importError()` says which field. |

### 9f. Pass three: a record written six months ago

- **No `teach` block.** Filled from the blank. Nothing is migrated and the old path is
  untouched.
- **A ritual plan with `tc: 'RE'`**, written in round KQ, still loads: `RE` is still a key.
  New teachers are new keys appended to `BECOMING`; none renumbers.
- **A record naming a teacher this build has never heard of** (written by a newer build) is
  refused by name. The cost is stated: backward compatibility is promised and forward is not.
  The alternative, dropping unknown keys, is the silent clamp this product refuses.
- **Round trip.** `validate(validate(x))` must equal `validate(x)`. This product was bitten
  once when a field's own empty value was refused on the second pass and a profile vanished
  at boot (`schema.js` lines 686 to 695, round OG). The blank `share` (`{on:false, at:null}`)
  and a revoked one (`{on:false, at:'...'}`) both validate twice.
- **Export and import compose.** `teach` travels with an export. Ritual plans still do not
  (existing, named). Consent travels as a stored fact and is inert without a grant (8a).

### 9g. The tests that would prove it

In `tests/engine.js` (headless, fast), asserting the contract and not today's numbers.
**Counts are read off the tables, never typed**, because this repository has been bitten by
typed counts a dozen times.

1. **Roster.** Teachers, poles and opposites counted off `TEACH_ROWS`; every key unique;
   `TEACH_ORDER` is a permutation of the keys; Jesus has exactly two poles.
2. **Copy.** Every pole has all 8 impression lines; every `marks` name resolves to an
   address; every `laws` name is in `SINAMES`; every string passes the voice gate and has no
   em dash; every line has a belief it goes past; every line is under 25 words and has no
   "I am".
3. **Tables unchanged.** `equiv.py` shows `MIRROR`, `PATHS` and `MASTERS` identical except
   the added rows; the two pins on `MASTERS` (`tests/engine.js` around lines 1748 and 1750)
   move on purpose and named.
4. **Alignment.** `TEACH_W` sums to 1; cover is monotone; two runs give one order; a
   candidate with no authored link and no cover never qualifies.
5. **Pacing.** Across the persona roster, never a step above `ritFor`'s step in the open
   list; unread gives step 1.
6. **Unlocks.** `teachDays` ignores a ritual set and not done (the 21.J2 case); ignores an
   entry with no `done`; counts distinct days; a reach once granted is never removed by a
   later read; every reach has a zero spend route; no unlock reads a reading.
7. **No match number.** No rendered string matches a score or a percent beside a word like
   match or fit; `teachShareOut` returns only `k` and `r`; the boundary refuses `score`.
8. **Share.** Off by default; a blank and a revoked block both validate twice; `teachShareOut`
   returns nothing for a teacher whose switch is off; importing a record with `share.on` true
   creates no grant.
9. **Seat reader.** Every seat read in the teacher panel equals the Compass panel's number
   for the same axis, across every persona and every axis. This is the test that would have
   caught the defect T1 fixed.
10. **Boundary.** Blank validates; a profile with no `teach` loads; each row of the table in
    9d is refused with exactly that message; 9999 is refused and not clamped; export then
    import then export is byte equal; a forbidden key is refused by name.
11. **Coverage** (`NODE_V8_COVERAGE`): the unexecuted list for `teach.js` is read, not only
    the aggregate.

In the browser: `tests/functional.js` presses every name and checks its panel; presses a
mark and checks the stored id; presses Start and checks the plan's `tc` and its steps;
turns the switch on and off and checks the record and the status line; `collide.js` for
nameplates; `design.js` for 44 pixel targets and contrast; `tools/monitor.js` for every
surface at 1600 and 390; `boot.js` and `funnel.js` unchanged; `terms.py` for one word per
concept; `check.py --objections` and `--brief` on the new strings.

---

## 10. How Run hands off, with no second runner

Nothing here is a runner. Each button calls the writer that already exists, from v1.

- **Release.** Close the sheet, then `relPick(ids)` with the carrying addresses of the
  heaviest charge, at most as many as the run cap allows. An in-memory marker records that
  it was toward a teacher so the start can be logged. Nothing about the addresses is
  persisted by this design.
- **Practise.** `ritTeachStart(k, days)` takes the steps from `BECOMING` as today.
  `ritStartPlan` stays the one writer.
- **A saved ritual.** `setTab(TAB.RITUAL)`, as the "Open the ritual" button does.

## 11. The drift found

- **Fixed since v1.** The teacher drill's seat read (v1 section 4a), `48ba698`.
- **v1's own mockup broke a rule it described.** It printed "2 of 5 are carrying", a count
  against a total, which `check.py` refuses ([CO-05]). v2's panel says it in words.
- **Four words, each already two things.** Nature is a law and a domain; Duty is a law, a
  domain and Rama's `MASTERS` line; Power is an axis and a domain; Will is the Sacral axis
  and the Solar expression. His words land on one of each, and the surface will say the law
  or the axis, not the bare word, until one word per concept is ruled.
- **`becomingOf` assumes a seatless teacher is a path.** It sets `path:!m`, so any pole not
  in `MIRROR` prints "The five paths sit at no one seat". The three new poles are not paths
  (the glossary's five are named), so the sentence needs a `home` field. Slice T6.
- **`TRACK4BAND` is declared in `ui/ritual.js` line 80** and the engine needs it. T2 moves
  it to `engine/data/practice.js`.
- **Documents that still say twelve or Eckhart** while the code says eleven: `DESIGN-compass.md`,
  `reviews/creative.md`, `reviews/AD-field-compass.md`. And `compass.js` line 4 still says
  "Twelve masters anchor it".
- **A release card numbering collision.** `CARDSET` numbers Anxiety 01, Grief 02, Anger 03;
  `AXCARD` numbers Fear 01, Anger 02, Shame 03. "No.03" is Anger in one and Shame in the
  other. The panel names a card by its charge and not by number.
- **Channels.** The shipped release runs six channels (believing, perceiving, thinking,
  behaving, acting, feeling); the owner ruled five for the first release in round OX (item 8,
  `PLAN.md` section H, question 10 still open). This design types no channel count; a cost is
  read off the release's own plan.
- **Ritual plans do not travel with an export** (existing, named in `ritual.js`).

## 12. The mockup, and the drafted practices

`mockups/teachers/imprint.html`. One file, no network, the app's own tokens (shell/head.html,
with the Inter face carried in the file, as the product carries it), Dark. The left list
and the centre figure are context: the list is the 14 poles with Derek's positions from the
built engine; the figure is schematic and labelled. **The right-hand panel is the design.**
It shows Zoroaster, read on Derek, from top to bottom: who; the imprint (positive and
negative, four lines each, two marks in use); in your reading (Self-Silencing carrying at
4.4, one address held, the rest under the line); the lines (Say it open with today's line
marked, Walk it locked with its condition in words, a further set named without a count);
the ritual (Box Breathing, Zoroaster's lines, The Plain Word, with Start for a week and Start
for two weeks, and "Your saved rituals that fit: none yet"); and the share switch on, with
one lead listed and a Revoke. `?share=off` draws the default.

- `imprint-1600.png`: the three columns; the right rail is shown unrolled, where in the app
  it scrolls.
- `imprint-390.png`: the same panel at phone width, the 14 names as a wrapped grid.

The readings are Derek's (CQ 48.5, DQ 26.2). The two marks, the share state and the lead
named `marisol_k` are illustrations and not records. Every sentence in the panel passed the
voice gate (the page text was run through `check.py`, no hard failure; it caught and I
fixed one count against a total).

**The three drafted practices** (new, `tc` set, passed the gate):

- **The Plain Word** (`TU`, Mind, 5 minutes, step 1): "Pick one true thing you have been
  softening. Say it once, out loud or in writing, in one sentence, and stop where the sentence
  ends. Then say nothing for ten breaths and notice what your throat does. If the sentence
  shrank on the way out, write down the word that shrank it."
- **Hand It On** (`SA`, Somatic, 5 minutes, step 1): "Take one thing you were given this
  week: an idea, a skill, a kindness. Pass it to somebody who can use it and say who gave it
  to you. Keep none of the credit. Afterward turn your palms up on your knees and notice your
  hands and your face."
- **Tend, Do Not Pull** (`NA`, Body, 10 minutes, step 1): "Pick one thing that grows slowly:
  a habit, a project, a child, a body. Do only the work it asks today, at the pace it asks.
  When the urge comes to pull it faster, breathe out and take your hands off it. Write one
  line on what you left alone."

And the shape of every lines step, `aff_<KEY>`: "Today's open line is shown with this step.
Say it once, out loud or under the breath. Hold it at the throat for ten breaths. Expansion
means the line holds. Contraction is data, so write down where it sat. Do not repeat the
line to push it in." (the seat named is the pole's seat or home seat).

---

## 13. The slice plan

Sizes: S is under half a day, M is one to two days, L is more. Each slice ends green on its
gate, and the browser gates need `NODE_PATH` at a playwright install. Order is the
dependency order.

| # | Slice | Size | Gate |
|---|---|---|---|
| T1 | **Fix the drift.** Done, `48ba698`. | done | `tests/functional.js` carries a check for both defects |
| T2 | **The data.** `engine/data/teachers.js`: 14 poles, Appendix A's lines, the three new poles in `BECOMING`, the three practices and the `aff_` rows appended to `PRACTICE` (with `tc`, so `ritFor` never calls them), `TRACK4BAND` moved to the engine, `MASTERS` gains Zoroaster and Confucius, `MIRROR` left alone unless he rules on Heart labels (B). | M | `tests/engine.js` groups 1 to 3; `BUILD-engine.sh` host free; `equiv.py` shows only additions; voice `--line` on every string; `MANIFEST` order |
| T3 | **The reading engine.** `engine/teach.js`: `teachCtx`, `teachSeat`, `teachAt`, `teachCands`, `teachFit`, `teachAligned`, `teachReleaseFor`, `teachRunPlan`, `teachDays`, `teachReleased`, `teachReach`, `teachLineOf`, `teachForm`. No UI, nothing stored. | M | `tests/engine.js` groups 4 to 7, 9 and 11; persona roster never offers above pacing; the 21.J2 fixture |
| T4 | **The panel, read only.** `ui/teachers.js`: the right-hand panel (who, the imprint, in your reading, the ritual shown), the Compass names looked up by `.k`, the empty states, no marks, no lines lock yet, no share. | M | `functional.js` presses every name at 1600 and 390; `collide.js`; `design.js`; `monitor.js`; `terms.py`; `check.py --brief` |
| T5 | **The stored block.** `teach` in `blankProfile`, `loadProfile`, the boundary and `teachValidate`; focus pin, marks, run log, reach grants, all reporting through `status()`. Needs his yes on the schema (question in 9d, not a numbered question). | M | `tests/engine.js` group 10; `pImport` atomic in `functional.js`; a worked example refuses |
| T6 | **The ritual tie.** The three new `becomingOf` poles with `home`, the `aff` render hook, `BECOMING` rows with the lines step, the pacing text for non-path poles. | M | `functional.js`: Start gives a plan with the right `tc` and steps; a ritual marked done writes the day; the lines step prints a line; `ritFor` unchanged on the roster |
| T7 | **Lines and unlocks.** The Lines section: Say it open, the next reach locked with its condition in words, nothing past it enumerated; the grant written once; hold form below the level; the "release first" sentence. | M | `functional.js`: a ritual done on 5 days opens Walk it; deleting a day does not close it; below the level the hold form shows; no total printed; `design.js` |
| T8 | **Share.** The switch, the confirmation, the visible list (empty until accounts), Revoke, `teachShareOut`; `LEAD_SEES` gains "the teachers, when shared" (his ruling); a test that the lead read has no `teach` except that output. The grant screen gains an unticked teachers scope when PR5 lands. | M | `tests/engine.js` group 8; `functional.js`: off by default, a failed write leaves it off |
| T9 | **Sign off the content.** The CQ seat reviews the 14 address lists and the three drafted opposites' sources; the owner edits the 112 lines and the 12 worked affirmations; the narrative seat writes the other 72 lines (84 lines are 6 per pole across 14 poles, 12 of which are done). Content only. | S | the T2 tests green after edits; no em dash; voice gate |
| T10 | **The needle.** Place the 14 poles and their opposites on the Compass figure, three new opposite icons, the hit test for the new names. | L | `collide.js`; `design.js`; `shots.js` at 1600 and 390 and a look at every image; `cone.js` is large and nameplates collide first |
| T11 | **The Points join.** When the Points ledger lands: migrate `teach.opened` into `p.progress.grants`, add a `points` operand, add the 7, 30 and 90 day marks after the 21.J2 fix, add the evidence route after the Practice writer cutover. | M | `tests/engine.js` equivalence: the same reaches open for every roster profile before and after |
| T12 | **Real seat fit** (v1's T9, optional). An explicit `seats` field on practices, replacing the four tracks as the seat signal. | S | `tests/engine.js`: every practice names a seat in `BANDS` |

T2 to T4 give the owner the panel he described, read only, without touching the profile.
T5 is the only slice that changes stored data, and T7 and T8 need it. T8 needs no accounts to
build and does nothing visible to a lead until they exist.

Twelve of the 84 worked lines are written here. The rest are T9.

---

## 14. What the owner has to decide

Four questions, each with the words it comes from and a recommendation. None is answered for
him.

**1. Is the roster in section 2 right?** Three rows are flagged.

> "Akhenaton for light, Zoroastria for truth, Rumi for duty, Krishna for flow, Buddha for
> awareness, Jesus for love. Rumi for beauty, Confucius for nature. Ramakrishna for will."

- (a) *Rumi twice.* The engine already gives Rumi beauty and Trust, and gives Rama "Duty as
  the spine". **Recommend: Rumi for beauty, Rama for duty.** If he meant Rumi for duty, the
  ways are in 1b, A.
- (b) *The Heart's labels.* His list reads as Love and Beauty at the Heart, Light to
  Akhenaten, Truth to Zoroaster. **Recommend relabelling `IL` to Love and `TR` to Beauty**
  (two label edits), and rereading Lucifer's and Charon's lines against them. It reverses
  his round KE word on Light for that axis.
- (c) *The count.* Eleven plus Zoroaster and Confucius is thirteen. **Recommend thirteen.**
  For twelve, Lao Tzu rests (1b, C).

**2. When you open a teacher and want a protocol, should your own saved rituals come first,
then the app's practices, with a release offered only when an address is carrying?**

> "library just means I can get information on my who I'm coaching... and any of my notes
> and then save the notes. But if you mean the ascended teachers, I don't know what you
> mean. I need context."

Yes or no is enough. **Recommend yes.** If no, the other orders are: the app's practices
first (a new person sees something at once, a person with saved rituals sees them second),
or release first (puts spending ahead of practice). His Practitioner notes are a separate
thing and are not changed by the answer.

**3. May a line below the safe level show in hold form, and may the surface say line and not
affirmation?**

> "It's almost like using an affirmation with positive affirmation reinforcement... kind of
> using like ultra high limiting uh, affirmations. That you won't find in any generic book."

and, from the design record (`DESIGN-gamification.md` 5.4): "The affirmation is a sentence
to test, not a sentence to believe." Research (Wood, Perunovic and Lee 2009) found that
people with low self-regard who repeat a positive statement feel worse. Hold form shows the
same sentence prefixed "Hold this against the body and read it. Do not say it as a fact." to
people at or below the level, and the plain stated form to everyone above it. **Recommend
yes to both.** If no, the line is stated for everyone, and the cost is that the product ships
the pattern its own panel refused, to the people it harms most. Which reading decides the
level (expression or CQ) is his open question BB3 and BB5 and is not answered here.

**4. When a person shares a teacher, may the lead see only which teacher and which reach is
open, and never the lines they marked as theirs or any word they wrote?**

> "Yeah, I think a uh, cohort, they can see the teachers if that's shared with them. No,
> they shouldn't carry a match number."

This carves an exception in a standing rule (a lead sees "not the spiritual material" and
not the story). **Recommend yes: teacher and reach only, per teacher, off by default,
needing a linked lead and a teachers scope on the grant.** The alternatives: share nothing
until accounts exist, or let a lead also see the marked impressions (the person's own
recognition of their negative patterns, which is the most private thing in this panel).

---

## Appendix A. The imprint lines, 14 poles, 8 lines each

Proposed, in the voice, each passing `check.py --line`. The owner edits.

**`IL` Jesus, love. Opposite: Lucifer.**

| | Runs clean | Runs as Lucifer |
|---|---|---|
| Do | You give something away and tell nobody. | You are warm in the room and flat when it empties. |
| Think | You ask what the person in front of you needs, and not who is watching. | You count who noticed the kindness. |
| Body | Your chest feels wide and your shoulders sit lower. | Your chest tightens when nobody is looking. |
| Say | You say the kind thing once and do not wait for thanks. | You tell the story of the favour afterwards. |

**`RE` Jesus, love. Opposite: The Furies.**

| | Runs clean | Runs as The Furies |
|---|---|---|
| Do | You change your mind in front of people and do not defend the old view. | You steer away from the place that would test the belief. |
| Think | You ask what it would change if the thing that cuts against you were true. | You decide what it means before it has finished happening. |
| Body | Your head and jaw stay loose while you hear it out. | Your jaw sets the moment someone disagrees. |
| Say | You say "that changes what I thought" and stop there. | You answer before the other person has finished. |

**`DE` Ramakrishna, will. Opposite: Asmodeus.**

| | Runs clean | Runs as Asmodeus |
|---|---|---|
| Do | You name one want and stop when you have enough. | You get it and reach for the next one within the hour. |
| Think | You ask who else the want would serve. | You decide having it will settle the wanting. |
| Body | The pull low in your belly rises, peaks and falls within ten breaths. | Your belly stays tight after you have it. |
| Say | You say "that is enough" and put the plate or the phone down. | You say "one more" and keep going. |

**`OR` Moses, order. Opposite: Set.**

| | Runs clean | Runs as Set |
|---|---|---|
| Do | You set one rule others can lean on and keep it on the day it costs. | You change the rule after others have built on it. |
| Think | You ask who is standing on this rule before you move it. | You decide the plan only has to hold while you are watching. |
| Body | Your throat is steady when you state the plan. | Your throat goes dry when you are asked to repeat the plan. |
| Say | You say the plan before it starts and write it down. | You agree in the meeting and say something else afterwards. |

**`PO` Musashi, power. Opposite: Moloch.**

| | Runs clean | Runs as Moloch |
|---|---|---|
| Do | You do the same hard thing at the same hour and pay for it yourself. | Your standard is met with other people’s time. |
| Think | You ask what the small version is when the big one is not on offer. | You decide a day does not count unless you won it. |
| Body | Your breath stays low in the belly while you work. | Your upper stomach clenches when someone else sets the pace. |
| Say | You write one line on a missed day and nothing about what it says about you. | You say "somebody will cover it" and move on. |

**`PE` Buddha, awareness. Opposite: Geryon.**

| | Runs clean | Runs as Geryon |
|---|---|---|
| Do | You notice what you feel and name it without acting on it. | You manage the gap between how you look and how you are. |
| Think | You describe the situation as you would to the person in it. | You read people as terrain to cross. |
| Body | The space between your eyebrows stays soft while you look. | Your face holds a shape that does not match your stomach. |
| Say | You say what you see before you say what you make of it. | You edit how you are before it leaves your mouth. |

**`TR` Rumi, beauty. Opposite: Charon.**

| | Runs clean | Runs as Charon |
|---|---|---|
| Do | You stop for the thing that moves you and stay with it before you explain it. | You wait at the edge of it until it can be proven. |
| Think | You let it reach your chest before you decide what it means. | You prepare for the feeling instead of having it. |
| Body | Your chest opens and your breath drops while it lands. | Your chest stays braced while the moment goes past. |
| Say | You tell one person what moved you, with no evidence attached. | You ask for more information about what you already feel. |

**`CH` Elijah, charge. Opposite: Phlegyas.**

| | Runs clean | Runs as Phlegyas |
|---|---|---|
| Do | You walk or lift until the heat has somewhere to go, and nobody pays. | It goes off at somebody, or you go flat for the afternoon. |
| Think | You ask where the anger is in the body before you ask who caused it. | You decide you are either fine or finished. |
| Body | Heat rises in your legs and belly and you stay on your feet. | Your belly locks, then your legs go heavy. |
| Say | You say "I need ten minutes" and take them. | You shout, or you stop talking. |

**`FL` Krishna, flow. Opposite: Kaliya.**

| | Runs clean | Runs as Kaliya |
|---|---|---|
| Do | You make the call you were holding and let the plan change. | You hold one routine or grievance in place until it sours. |
| Think | You ask what the day wants to do before you tell it what to do. | You decide that moving it would be losing it. |
| Body | Your jaw, shoulders and belly move when you ask them to. | Your jaw is locked and your hands are shut. |
| Say | You say "let us do it the other way" and mean it. | You tell the same complaint a fourth time. |

**`AL` Rama, duty. Opposite: Ravana.**

| | Runs clean | Runs as Ravana |
|---|---|---|
| Do | You do what you said, and you do it without a grudge. | You know the rule and cross it because you want the thing more. |
| Think | You ask what you owe before you ask what it costs. | You decide this one is an exception. |
| Body | Your spine feels long from the base of the back to the neck. | Your spine slumps when the rule is read out. |
| Say | You say "I will" only when you will. | You give a good reason for the thing you should not have done. |

**`HO` Lao Tzu, non-resistance. Opposite: Shu and Hu.**

| | Runs clean | Runs as Shu and Hu |
|---|---|---|
| Do | You find the one activity making the noise and stop it for the day. | You hurry to help and make it worse. |
| Think | You ask what finishes by itself if you leave it. | You decide that whatever is whole needs one more fix. |
| Body | Your hands rest open and your breath runs on its own. | Your hands reach before you have decided to. |
| Say | You say "I will wait" and wait. | You offer the fix nobody asked for. |

**`SA` Akhenaten, light. Opposite: Apep.**

| | Runs clean | Runs as Apep |
|---|---|---|
| Do | You hand on what you were given, and you keep none of the credit. | You take it in and pass nothing on. |
| Think | You ask what the light is landing on, not how it looks on you. | You decide that what you were given is yours to keep. |
| Body | Your face and the back of your hands feel open to the air. | Your chest folds in around what you are holding. |
| Say | You say it as it is, in one line, with the source named. | You tell it as if it started with you. |

**`TU` Zoroaster, truth. Opposite: The Lie.**

| | Runs clean | Runs as The Lie |
|---|---|---|
| Do | You say the true thing once, in one sentence, and let the room go quiet. | You say the smaller thing to keep the room warm. |
| Think | You ask what is so before you ask what it will cost. | You decide that saying it plainly means losing them. |
| Body | Your throat is open and your breath drops after you speak. | Your throat closes just before the sentence you meant. |
| Say | You end the sentence where it ends, with no softener after it. | You say "it is probably nothing" about the thing that is something. |

**`NA` Confucius, nature. Opposite: The farmer of Song.**

| | Runs clean | Runs as The farmer of Song |
|---|---|---|
| Do | You tend what is growing, keep the hours it asks and pull on nothing. | You pull the shoot up to help it grow. |
| Think | You ask what season this is before you ask what to do. | You decide the season is the problem. |
| Body | Your breath follows the pace of the work and not the clock. | Your hands grip while you wait. |
| Say | You say "it is not ready" and leave it alone. | You say "why is this taking so long" every day. |

## Appendix B. To reproduce

- The mockup: `mockups/teachers/imprint.html` is static; open it, or add `?share=off`.
- The numbers in it (Derek's positions and the five addresses) come from the built `engine.js`:
  load the persona the way `tests/engine.js` group 19a does, then read `W[i].sq` and
  `W[i].pole` for the address ids, and `mirrorAt(mean seat charge, bandIg(seat))` for the
  position.
- The proxies in 4b are a few lines of JavaScript over the sentence: no "I am", no word from a
  list of abstract nouns, a first verb a camera can film, at least nine words, and a small
  content-word overlap between two teachers' lines.
