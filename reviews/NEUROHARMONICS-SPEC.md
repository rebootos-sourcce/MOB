# Neuroharmonics: what holds, what does not, and the tool it can become

Tomas Egilsson, AI, machine learning and algorithms. 2 October 2026.
Round QE in `TASKS.md`. Checked against HEAD `0ebd898` on
`claude/laughing-feynman-xhfyj3`, with `engine.js` built at `e7e6f8d`, which
is later than the last change to every engine file read here. Every count below
was read off that tree on this day and is dated for that reason.

Spec only. No `atuned_src/` code was written.

Citations: `index.html` is the book, *The Mechanics of Being*, and its line
numbers are file lines in this repository. Anything that is my own reasoning is
marked **[inference]**. Anything the owner still has to rule is marked
**[open]**.

---

## 0. In plain words

- **Your core idea is in your own book. The hertz numbers are not.** The book
  already says a word lands at a nerve, that naming an experience is what makes
  it stick there, and that a tone can drive tissue the way one tuning fork
  drives another. It never gives a hertz number for anything.
- **The hertz numbers in the app are borrowed.** They are the "solfeggio" set,
  seven numbers a naturopath took from Bible verse numbers in the 1970s. Nobody
  has measured them in a body. Our own sound research found that, on 25
  September.
- **A lot of this is already built.** Every word the app reads already lands
  on one of the seven seats. Every seat already has a tone. The release already
  plays that tone, and the Compass already draws the seven seats as rings that
  sink in toward the centre as load builds.
- **What is new and worth building:** a page in Play that shows where words
  land on the body, lets a person say an "I am" word and tap where they felt it
  before the app shows its own answer, and plays the seat's tone if they want
  it.
- **The biggest gap:** the good words. "I am confident", "I am courageous",
  "I am calm" land nowhere in the app today. The app only knows where the bad
  words go.
- **How we word it:** "ATUNED places this word at the heart." Never "this word
  vibrates your heart at 639 Hz."

---

## 1. The question, in one sentence

Can ATUNED show a person where a word lands in the body and give that place a
tone, using only what the book and the engine actually hold, and say so without
claiming a measurement nobody has made?

---

## 2. The drafted confirmation, checked claim by claim

The draft is summarised at `TASKS.md` round QE (line 32138). Each of its claims
was looked for in the book, the engine and the build docs.

| # | The draft's claim | Verdict | Where it is, or is not |
|---|---|---|---|
| 1 | The nerve is the address | **Holds** | `index.html:5638`, "The same adjective activates the same nerve plexus every time. Confidence: Solar Plexus. Courage: Root. Fear: Lumbar." `index.html:6477`, "Every word is a signal with an anatomical address." The book's own evidence tier 23 rates nerve plexus addressing "High confidence, observed through direct somatic mapping" (`index.html:8115`). In the engine every address carries its nerve as `n` (`engine/data/nodes.js`). |
| 2 | 108 patterns in the body, 4 in the field | **Holds as addresses, not as words** | `engine/data/nodes.js` header: "108 somatic, seated at a named plexus or nerve, plus 4 field anchors." Counted today: `W` holds 108, `NODES` 112. But 108 is the count of addresses. The lexicon is a different table (section 5). The voice rule in `CLAUDE.md` says the count stated to users is 112, and `BOOK-ERRATA.md` item 6 already records 108 being used for two different things in the book. |
| 3 | Chakra and plexus are two readings of one address | **Holds** | `index.html:2411`, "The chakra is the field generated at the plexus junction." `index.html:9135`, "The plexus is the hardware; the chakra is the field it generates." Also `index.html:1387` and `1536`. The engine pairs them in `FLOWSEAT` (`engine/data/practice.js:234`): `sk` Muladhara beside `nv` Lumbar plexus. |
| 4 | A section called "Words as Spells" | **Does not exist** | Not found anywhere in the repository, book included. The substance lives under other titles: "Word to Nerve · Direct Mapping" (`index.html:5637`), "Somatic Command Words · Hierarchy and Mechanics" (`index.html:6373`), and "the spell breaks" once, about identification (`index.html:5255`). The draft cited a title that is not in the book. |
| 5 | "Six Processing Layers" | **Exists, and does not support the claim** | `index.html:5034`. It is the order a signal is processed before an emotion arrives: senses, processor, compositor, trigger, orientation, choice. Layer 1 says "raw frequencies arriving from the external field". Nothing in it assigns a frequency to an address or a word. |
| 6 | Collapse is identification | **Holds, strongly** | `index.html:1527`: "The moment of crystallization is identification... The composite wave collapses to a point. The node forms... Without identification, the experience passes. With identification, it stores." Gate 6b, "Identification (creates Gate 7)" (`index.html:5052`): "Without identification the charge dissipates." |
| 7 | Metabolize is release | **Partly. The idea holds; the word is his, not the book's** | The book's words for the untagged path are "passes", "discharge" and "dissipates" (`index.html:1527`, `5052`). "Metabolize" appears 12 times and is used for the soul between bodies (`index.html:7295` to `7297`, `7443`), for allostatic load (`index.html:2791`) and for compression (`index.html:2327`), not for one address releasing. |
| 8 | Vritti is the standing distortion | **Holds, with a nuance** | `index.html:1526`: the vritti is the composite of sensory and emotional waves. `index.html:1529`: "the field distortion wrapped around a collapsed nerve". A tagged vritti is "crystallized" (`index.html:5027`). So it is a distortion once tagged, and a passing wave before. The book's own tier 26 rates it "Inferred from sensation, moderate confidence... not yet formally measured" (`index.html:8121`). |
| 9 | A tone drives a nerve the way a command binds to an address through repetition | **Partly, and the key link is missing** | The book has three tone passages. "One tuning fork drives another" (`index.html:1094`, `2917`). "Sending Harmonic": "The awareness is the tuning fork" (`index.html:7064`), which is attention and not an audible tone. "Vocal Harmonic Release": voice vibration contacts node clusters "along the route from the vocal source to the exit point" (`index.html:7070`), which is location by nearness to the throat, not by pitch. Commands bind through repetition: "let it go becomes a conditioned somatic trigger" (`index.html:6383`). No passage links a pitch to a particular nerve. |
| 10 | Not a fifth system, the same architecture | **Right** | The harmonic layer was already ruled on 25 September (`DECISIONS.md:1256` to `1293`; `BIBLE.md:594` to `612`), and seven tones already ship. One correction: words were already pointed at their seats. `LEX` has done that since the sniffer was written. What is missing is showing it, the coherent half, and the grammar. |

---

## 3. Every literal term, found and not found

Searched across the repository with the build products and binary assets left
out, then read in context in the book (`index.html`). Counts are matching lines
in the book.

| Term | In the book | Elsewhere | What it means where it appears |
|---|---|---|---|
| Words as Spells | **0** | **0** | Not a section, a phrase or a heading anywhere. |
| Twelve Words | **0** | only as a word count in copy rules | Not a concept in this product. |
| Six Processing Layers | 1, `index.html:5034` | no engine use | The signal order before emotion. See claim 5. |
| Vritti | 48 lines | `ui/mapshelf.js:147`, `ui/analytics.js:401` | The composite wave, and the field distortion around a loaded nerve (`index.html:1526`, `1529`). **In the app the word is printed in front of a vertebral level** ("vritti C1 to C4", "Vritti T4 to T5, the aortic arch"). That is a mislabel; see section 9. |
| collapse | 112 lines | `ui/cone.js` (Compass registers) | Identification collapsing the composite wave to a node (`index.html:1527`); the soul as a "collapsed waveform", which the book itself calls "Structural analogy. Not a literal quantum mechanical claim." (`index.html:7331`). Also a node name, Collapse, at the Root (`nodes.js`, id 16). |
| metabolize | 12 lines | none in engine | See claim 7. |
| register | 33 lines | `ui/cone.js` "THE REGISTERS"; `DECISIONS.md` round OI | **Four meanings already.** The nine gates of the Letting Go Statement, "nine registers at once, believing, perceiving..." (`index.html:5027`). Where a spoken word lands, "A physical register" (`index.html:6475`). The Compass's seven seat shells (`ui/cone.js:1996`). His round OI words, "the bell curve is the harmonic register of that address" (`DECISIONS.md:2535`). |
| harmonic | 19 lines | `shell/head.html:6221`, `ui/drills.js:421`, `ui/cone.js` | Mostly the Harmonic Table of 64 elements (`index.html:2525`), which is a table of qualities and not of frequencies. "Harmonic sensing, Clairaudience... Vagus / cardiac rhythm" (`index.html:6586`). "Sending Harmonic" and "Vocal Harmonic Release" (`index.html:7064`, `7070`). |
| Hz, hertz | **0 in prose** | `engine/data/practice.js:234` to `241` and its callers | The only Hz matches in the book are inside base64 image data. `ui/sound.js:101` already records this: "The book names the bands and prints no hertz." |
| frequency | 124 lines | `compass.js`, `practice.js` copy | Used as a quality word: "frequency ladder" (`index.html:5608`), "persona masks... frequency layers" (`index.html:5621`), "Root locked in survival frequency". No number is attached in any of them. The book's tier 27 rates "emotion reduces to nine frequencies" as "the inferred mechanism, moderate confidence" (`index.html:8123`). |
| resonance | 26 lines | none in engine | Like Fields Attract, "resonant frequencies converge" (`index.html:2734`); crystals as a carrier (`index.html:7435`). Again no numbers. |
| tuning fork | 3 lines | none | `index.html:1094`, `2917`, `7064`. See claim 9. |
| sound bowl, singing bowl | **0** | `DECISIONS.md:1186`, `1258`; `docs/briefs/harmonic-research.md` | The bowl idea is his, from the CQ ruling of 25 September, and not in the book. |
| solfeggio | **0** | `ui/sound.js:13`, `ui/release.js:1007`, the research brief | The tuning in `FLOWSEAT`. |

---

## 4. What the engine already does with frequency

Searched `atuned_src/` for `Hz`, `hertz`, `solfeggio`, `FLOWSEAT`, `frequen`,
`harmonic`, `resonan` and `tuning`.

**Built and shipping:**

- **One tone per seat, seven in all.** `FLOWSEAT` in
  `engine/data/practice.js:234` to `241`: Root 396, Sacral 417, Solar 528,
  Heart 639, Throat 741, Brow 852, Crown 963. These are the solfeggio numbers.
  `seatHz(b)` (`practice.js:255`) turns a seat name into its number and
  returns null for the four outside addresses, never a guess.
- **The release plays it.** `relTone` (`ui/release.js:1033`) sounds the seat
  of the address on the card, through the binaural bed in `ui/sound.js`
  (`bedOn`, `bedTo`, `bedOff`), with theta under release lines and alpha under
  reframe lines. Off by default; the switch is `CURP.ui.tone`.
- **The Compass draws the seats as registers that collapse.** "THE
  REGISTERS", round KS (`ui/cone.js:1996` onward): seven shells, each one's
  radius set by its seat's tone, and each address a patch that falls inward
  and darkens by its own held charge. Seven seat buttons print the Hz
  (`ui/cone.js:2369`). This is already his "collapse at a register" drawn.
- **Two surfaces print the Hz beside anatomy with no label.**
  `ui/mapshelf.js:146` ("Muladhara · 396 Hz · source 502") and
  `ui/analytics.js:400` ("Sahasrara · Cranial plexus · 963 Hz"). This is
  `TASKS.md` AX8, open since 25 September, and still unfixed at `0ebd898`.
- **The interface sounds** (`ui/sound.js`, the marks) sit in their own range
  and are not seat tones. The tension line `spark` built tonight
  (`ui/sound.js:483`) is seeded noise with no pitch at all.

**Not anywhere in the engine:**

- No frequency on any word. `LEX` entries are `[seat, intensity, fetter?]`
  and nothing else (`engine/lexicon.js`).
- No frequency on any single address. The address inherits its seat's tone
  and nothing more. `TASKS.md` CF3, a tone per address by position, is open
  and unbuilt.
- No frequency in any reading. `BIBLE.md:598` records the ruling: the
  harmonic layer "never enters CQ, SQ, DQ, intention or expression."

---

## 5. Measured: where words land today

Read off `engine.js` on 2 October, `node -e` against the built engine.

**Three word lists could be called "the lexicon"**, and `ui/avatarui.js:778`
already says so: the glossary `GLOSS`, the sniffer's `LEX`, and the fetter
names in `NODES` with the nine child fetters in `CHILD`.

- **`LEX` holds 281 entries.** 266 have a seat and 15 are "coherent", which
  carry a negative amount and no seat. By seat: Solar 107, Heart 50, Throat
  38, Root 29, Sacral 25, Eye 9, Crown 8. So four in ten seated words land at
  the Solar plexus, and a word map coloured by tone would be mostly one colour
  and one pitch.
- **The 108 address names are 106 distinct words.** Resentment and
  Self-Judgment each appear at two seats.
- **Only 8 of those 108 names are also `LEX` words** (fear, shame, insecurity,
  panic, anger, betrayal, lying, interrupting), **and 3 of the 8 disagree on
  the seat.** Shame is an address at the Root and a `LEX` word at the Sacral.
  Insecurity is an address at the Root and a `LEX` word at the Solar. Betrayal
  is an address at the Heart and a `LEX` word at the Throat.
- **The book and the engine disagree about Courage.** The book says
  "Courage: Root" (`index.html:5638`). The engine seats the law Courage at the
  Solar (`SI`, `engine/data/canon.js`). The book's other two examples:
  Fear at the Lumbar plexus agrees with the engine (address 1, Fear, Root,
  Lumbar Plexus). Confidence is not a word anywhere in the engine.
- **One nerve, two seats.** 108 addresses carry 103 distinct nerve labels, and
  four labels sit under two different seats: Inferior Hypogastric Plexus,
  Pelvic Nerve and Obturator Nerve under both Root and Sacral, and Vagus Nerve
  under both Heart and Throat. A tone derived from the seat gives one nerve
  label two pitches. So any per address tone must key on the address id `i`,
  never on the nerve's name.
- **The owner's own example produces nothing.** `parseStory("I am confident.
  I am courageous. I am calm.")` returns one hit, "calm", as coherent with no
  seat, and zero imprints. The "I am" declaration the book teaches,
  "Form: I am [coherent state]" (`index.html:6390`), cannot land anywhere in
  the app today.
- **There is no corpus to measure on.** The 44 worked example profiles carry
  one line each (`PEOPLE[].says`). Read through the sniffer they produce 6 hits
  in all. No base rate for anything in this document can be taken from them.

---

## 6. Verdict

**Partly real.** Split into its three claims, it reads like this.

**Solid, and in the book with its own evidence tier:**

1. **A word lands at an address.** `index.html:5638`, `6477`, tier 23 at
   `index.html:8115`. The engine has carried this since the sniffer: `LEX`
   puts a word on a seat and `parseStory` puts the seat's charge on addresses.
2. **Identification is what makes a pattern stay; without it the pattern
   passes.** `index.html:1527`, Gate 6b at `index.html:5052`. The engine
   already reads a coarse form of it at story level: `VERPCUE` in
   `engine/verp.js:17` counts "let it pass" and "stayed out of" as Detachment
   and "took it personally" and "it had me" as Attachment, and moves CQ by
   them.
3. **The coherent opposite installs at the same address.** Tier 24,
   `index.html:8117`, "High confidence, observed across sessions." This is the
   rule that gives the "I am" words a place (section 7.3).

**Real as the product's own vocabulary, not as a finding:**

4. **Each seat has a tone.** Ruled by him on 25 September as "information,
   not a reading" (`DECISIONS.md:1256`, `BIBLE.md:598`), and built. The
   numbers are a chosen tuning, the same way the seat colours are a chosen
   palette. The book gives no numbers, and its own tier 27 rates the frequency
   model as an inferred mechanism (`index.html:8123`).

**Not grounded. Poetic extension presented as confirmation:**

5. **That a given Hz affects a given seat, as sound bowls show.** Nothing in
   the book says it. The research found no study testing one bowl frequency
   against another for a seat specific effect
   (`docs/briefs/harmonic-research.md` section 2). The traditions disagree by
   more than an octave at the Root alone (396, 256 or 194.18 Hz, same file,
   section 1). What sound is measured to move is breathing and heart rate, by
   tempo, not by pitch.
6. **That Hz can "interpret the full dynamic range of the nervous system."**
   The product has no sensor, and nothing in the book or the code measures a
   frequency in a person. Conduction velocity is a speed, not a pitch
   (research, section 3).
7. **The draft's specific citations.** "Words as Spells" does not exist. "Six
   Processing Layers" exists and is about something else. "108 words"
   conflates the address count with the lexicon.

So: claims 1 to 3 extend what is already in the codex and in the engine. Claim
4 is a design language, already ruled, and must be labelled as one. Claims 5
to 7 are where the draft went past its evidence, and the spec below builds
nothing on them.

---

## 7. The spec: Words, a tool in Play

Built only on claims 1 to 4. Nothing below needs a measurement the product
cannot make.

### 7.1 What it is, and where it goes

**One sentence:** a body with words on it, showing where ATUNED places each
word, sounding that place's tone if the person wants it, and letting a person
check the placement against their own body.

**Place.** Play is Field, Body, Compass and Character today (`TABDEF`,
`engine/core.js:202` to `231`). Play is "all the tools" in his words (round
KC, quoted at `engine/core.js:126`). This is a tool, so it goes in Play,
appended after Character.

**Identity.** A new TAB integer, the next free one (15 at `0ebd898`, after
`ACCOUNT:14`), appended and never renumbered, on the rule every integer since
Compass has followed. Its own host, a sibling on the stage and never a child
of the Body's host (the `#know` and `#games` lesson in `CLAUDE.md`).

**Name.** Proposed: **Words**. The menu rule (`engine/core.js:111`) names
what is on screen, the way Body is "a body with seven seats on it". The
alternative is Tones. His call if he wants another.

**Why its own door and not a mode of Body.** Body reads the person's charge.
This reads the language. Folding a reference map into a reading surface is
the Games lesson again (`engine/core.js` note on Games): each makes the other
worse. **[inference]**

### 7.2 What a person does with it: three modes on one page

**Map. Look.** The body figure with words placed on it. The 106 address
names sit at their own addresses. `LEX` words and the coherent words (7.3)
sit at their seat, drawn at the seat and not at a nerve, because the engine
only knows the seat for them. Tap a word and the right rail says:

- where ATUNED places it, by seat and, if it has one, by address and nerve;
- which source places it there: the book, the address table, the lexicon, or
  the opposite rule (7.3);
- when two sources disagree, both places, side by side, and nothing resolved
  silently (Shame at the Root and at the Sacral, for example);
- the seat's tone, labelled (section 8).

A filter switches between the hard words, the coherent words and both. No
person data is read. A blank profile sees the same map as a loaded one.

**Say. Check it on yourself.** This is the book's System Check
(`index.html:6475` to `6477`) made into a step.

1. The person picks or types an "I am" word: "I am safe", "I am worthy".
2. They say it aloud, or read it, and tap where on the body they felt it.
   Nothing is shown first: no placement, no colour, no tone (see 7.6, why).
3. Only then ATUNED shows where it places the word, and the tone plays if the
   switch is on.
4. The tap is kept on the person's own device as their report. Over time the
   page can say, in plain words, "Of the 7 words you have checked, 4 landed
   where ATUNED places them." It never says the person was wrong.

**Read. See a story in places.** Open one journal entry here and see its
words on the body, each in its seat's colour with the tone label, plus one new
thing the Story page does not show: whether the word was written as **who I
am** or as **what I felt** (7.4). Everything else in this mode is the Story's
existing marks (`marksOf`, `engine/sniff.js:686`) drawn on the body instead of
on the text. It is the last mode built because most of it already exists.

**What it is not.** Not a reading of the person's nerves. Not a treatment.
Not a new score. It writes nothing to CQ, SQ, DQ, charge or any imprint.
`applyStory` stays the only function that mutates.

### 7.3 New data, and where it lives

| Data | New? | Where | Who fills it |
|---|---|---|---|
| Seat tones | No | `FLOWSEAT` via `seatHz`, unchanged | Exists |
| Where each hard word lands | No | `LEX` and `NODES`, read only | Exists |
| Where each coherent "I am" word lands | **Yes** | A new table in `engine/data/`, beside `LEX` and never inside it | Derived by rule, then his review |
| Which sources disagree | **Yes, generated** | Computed at load from the tables above; never typed by hand | Code |
| "Who I am" against "what I felt" cues | **Yes** | A short cue list in `engine/`, same shape as `VERPCUE` | Authored by me, his review |
| A tone per address | **Not built** | Would extend `FLOWSEAT`, keyed on address id | **[open]** His call, section 10 |

**The coherent words, derived and not invented.** Book tier 24 says the
coherent opposite installs at the same address as the charge it replaces
(`index.html:8117`). The engine already pairs each child fetter with its
opposite (`CHILD`: Fear and Trust at the Root, Shame and Worth at the Sacral,
Sad and Joy at the Heart, and so on). So the first coherent table is:

- the nine opposites in `CHILD`, each at its fetter's seat;
- each opposite's plain "I am" forms ("I am safe" with Trust, "I am worthy"
  with Worth), authored and kept short;
- the three words the book names (`index.html:5638`), at the place the book
  gives, with the Courage disagreement shown and not settled by me.

Under that rule Courage lands at the Root, opposite Fear, which is where the
book puts it. The law table puts Courage at the Solar. Both are shown. This
is the one place in the spec where the book and the engine disagree and the
tool has to show it rather than pick.

**Why a separate table and not new `LEX` rows.** A new `LEX` row changes what
every story reads, moves `LEX_VERSION` (`engine/sniff.js:996`), and turns a
reference page into a change to every reading in the product. Port, do not
rebuild. A coherent word in the new table is shown on the map and never
scored. Whether any of them should later enter `LEX` is a separate decision
with its own `tools/equiv.py` diff.

### 7.4 "Who I am" against "what I felt"

This is the one new piece of text processing, and the one place the book's
collapse idea becomes something the code can check.

**What it reads.** Each word the scanner already found is marked by the
grammar in front of it, in the same clause:

- **who I am:** "I am", "I'm", "I am so", "I am always", "I am such a",
  "I will never", "that is just who I am";
- **what I felt:** "I feel", "I felt", "I noticed", "it came up", "I was
  feeling";
- neither: no mark.

**Where it comes from.** `index.html:7155`: "You can use I to describe things.
You cannot use it to define things, because that creates separation." "I am
ashamed" defines; "I felt ashamed" describes.

**The honest limit.** By `index.html:1527` every named experience has already
crystallized, so by the book every word the scanner finds is already
identified. This grammar mark is therefore a weaker, visible proxy grounded
in `7155`, not a reading of whether a pattern stored. **[inference]**

**Precision over recall.** A false "who I am" on a bereavement, "I am
heartbroken" the week a father died, would tell a grieving person they are
identified with their grief. So:

- the mark says only what was written: "You wrote I am". Never "you are
  identified with";
- it never moves charge, CQ or anything else in this version;
- negation goes through the scanner's existing clause floor, so "I am not
  afraid" is never marked "who I am, afraid";
- a missed mark costs nothing, and a wrong one costs trust, so the cue list
  starts short.

**It overlaps `VERPCUE`, and says how.** `VERPCUE` reads a story's stance and
moves CQ through `verpFactor`. This reads one word's grammar and moves
nothing. They must never both count the same phrase toward a number.

### 7.5 Engine and sound, at the level of signatures

Engine, host free, no `document`, no `AudioContext`:

- `wordPlace(word)` returns `{seat, band, node|null, hz|null, src:[...],
  agree:bool}`. `src` names every table that places the word; `agree` is false
  when two of them disagree. `hz` comes only from `seatHz`.
- `wordsOnBody()` returns every placed word for the map, with the disagreement
  list computed and not typed.
- `storyPlaces(text)` returns the scanner's hits, each with its seat, its
  tone and its "who I am" or "what I felt" mark. It calls `scanStory` and
  never `applyStory`.

Sound, in `ui/sound.js`, the only file allowed to:

- The tone is the release bed's carrier with no beat, so the same measured
  code plays it. No new synthesis.
- The switch is the existing seat tone preference, `CURP.ui.tone`, with the
  existing `accTog` row, so one control has one look across the product.
- Off by default, on the research's recommendation and his "I don't want to
  bombard people with options" (`DECISIONS.md:1261`).

### 7.6 What is reused and what is new

| Existing piece | What it covers | What Words does with it |
|---|---|---|
| Field (`ui/wheel.js`) | The 108 addresses as a wheel, lit by the person's charge | Nothing. Words reads language, not charge |
| Body (`ui/map.js`, `ui/mapshelf.js`) | The body figure, seven seats, addresses by charge | Reuses the figure renderer. Draws words where Body draws charge |
| Compass registers (`ui/cone.js:1996`) | Seats as shells, collapse by held charge, seat Hz on buttons | Not redrawn. The rail links to it: "see this seat's register on the Compass" |
| Character (`ui/character.js`) | The masks and the composite | Nothing |
| Archetype intake, chakra style (round QB, `0c7ab06`) | Seat colour, ring and track on intake marks | Same seat colour tokens, nothing more |
| Tension line `spark` (`9e88303`, `44fc4db`) | Static crackle on saboteur lines | Nothing. Noise, no pitch, a different job |
| Release seat tone (`ui/release.js:1033`) | The seat tone under a release | Same bed, same switch, same label |
| Story marks (`marksOf`) | Words lit in the text by seat | Read mode draws the same marks on the body |
| `VERPCUE` | Story level stance, moves CQ | Shares the idea only; never the count (7.4) |
| `avLex` (`ui/avatarui.js:802`) | A seat's word menu for tags | Same word sources, read the same way |

**New:** the coherent word table, the disagreement list, the grammar mark,
the blind check in Say, and the page itself.

### 7.7 How we would know the map is any good

There is no labelled set of where words land, and there will not be one.
The only data the product can honestly collect is a person's own report, so
Say is also the evaluation.

- **Blind first, or the number is worthless.** If the placement, the seat
  colour or the tone is shown before the tap, the person reports what the app
  told them. The tone is the worst offender: the seats are ordered low at the
  Root to high at the Crown, so a high pitch says "head" before the person
  has felt anything. That is leakage, the commonest reason a number looks good
  and is not. The tap comes first; everything else comes after.
- **Seat level only.** A tap is scored against the seat, seven classes, not
  against an address. A finger on a phone body cannot tell 16 Root addresses
  apart. **[inference]**
- **Chance is not one in seven.** Taps cluster at the chest and the belly
  whatever the word, so agreement is read against that person's own spread of
  taps, not against a flat 14 percent. **[inference]**
- **No figure before ten checks.** Fewer than ten, the page says the checks,
  "4 of 7", and no rate.
- **Per person, on the device.** Pooling across people is a different thing,
  and section 7.8 says why it is not allowed yet.

### 7.8 Privacy, checked first

- **Map** reads no person data. Nothing to rule on.
- **Read** reads a journal entry on the device and writes nothing.
- **Say** creates a new record: a word and where in the body a person says it
  landed. That is somatic self report, consumer health data in the sense of
  `CONSUMER-HEALTH-DATA.md`. It stays in the profile on the device, exports
  with the record, and is covered by the existing export and delete.
- **No learning from it.** The owner's ruling on Source AI is that the story,
  without the record, is what may refine the models, and that the name never
  leaves the device. A body tap is not a story. Using these reports to tune
  the map across people needs its own ruling before any of it leaves a
  device.

### 7.9 Build order and size

| Step | What | Size |
|---|---|---|
| 0 | **Precondition.** Fix AX8: every printed Hz gets its label (section 8). Fix the vritti mislabel (section 9). Nothing in Words ships while the app already prints an unlabelled Hz beside a nerve | Small |
| 1 | Engine: coherent table, `wordPlace`, `wordsOnBody`, the disagreement list. Gate in `tests/engine.js`: every placed word resolves to a seat or says why not; every disagreement is listed; no word is placed by a nerve name | Small to medium |
| 2 | Map mode on the new door, the integer appended, `TABDEF` entry in Play, the host. Gates: `functional.js`, `monitor.js` picks it up from `TABDEF` by itself, `collide.js` for word labels, `design.js` | Medium |
| 3 | Say mode with the blind order enforced by a gate: nothing seat specific in the document before the tap | Medium |
| 4 | The grammar mark and Read mode. Gate cases: "I am not afraid", "I am heartbroken" after a death, "I felt ashamed", "I'm so tired" | Small to medium |
| 5 | **[open]** A tone per address, only on his ruling (section 10) | Depends on the ruling |

---

## 8. Claims and wording: how the product says this

Standing rules this answers to: `CLAUDE.md` voice ("mechanical and precise, no
soft wellness language"); the Congruency TDD, "Avoid clinical claims... Prefer
ATUNED noticed... over This is what is happening", and its note that the 112
are "ATUNED's modeled addresses" (`reviews/ATUNED-System-Congruency-MVP-TDD.md:844`
to `883`); the unpack rule of round PO; and `reviews/LEGAL-floor.md`, where the
FTC asks for "competent and reliable scientific evidence behind a health
benefit claim", in general randomized controlled human testing.

**The book's own standard is the one to hold.** It already tiers itself: the
address is high confidence, observed in practice (tier 23), the vritti is
"inferred from sensation" (tier 26), the frequency model is "the inferred
mechanism" (tier 27), at `index.html:8115` to `8123`. And `BOOK-ERRATA.md`
item 2 already says the "address is measurable" line should read
"practitioner-observed, unreplicated". The product should never claim more
than the book's own tier.

**Every Hz carries its label, in the same place.** The label, unpacked as round
PO requires: "ATUNED's tone for this seat. Tuning: solfeggio, a modern
numerological set. Not a measurement of your body." Printed in the seat's own
colour, as ruled.

**Lines that may ship:**

- "ATUNED places *safe* at the Root."
- "The Root's tone in ATUNED is 396 Hz, the solfeggio tuning."
- "Where did you feel it? Tap the body."
- "You placed it at the heart. ATUNED places it at the Root."
- "You wrote *I am* before this word. The book calls that defining, not
  describing."

**Lines that may not:**

| Refused | Why |
|---|---|
| "This word vibrates at 639 Hz." | No word has a frequency. The tone belongs to the seat, by choice |
| "Your heart resonates at 639 Hz." | A claim about the person's body that nothing measured |
| "Use this tone to unblock your heart." | His words on 25 September (`DECISIONS.md:1260`), and a health benefit claim the FTC standard does not allow without trials. The intent can ship as "Play the heart's tone while you work at this seat." |
| "Science shows sound bowls affect the chakras." | The research found no such study |
| "The frequency of your nervous system." | The product measures no frequency in a person |
| "You are identified with grief." | A verdict from grammar. The mark says only what was written |
| "108 words" | Voice rule: the count stated to users is 112, and 108 is addresses, not words |
| "Register", printed alone | It already means four things (section 3). On this page it means a seat and is printed as "seat" |

---

## 9. Defects found on the way

1. **"Vritti" printed in front of a vertebral level.** `FLOWSEAT.vt` holds
   spinal levels and landmarks ("C1 to C4", "T4 to T5, the aortic arch").
   `ui/mapshelf.js:147` prints it as "vritti C1 to C4" and `ui/analytics.js:401`
   as "Vritti T4 to T5, the aortic arch". The book defines the vritti as the
   energetic wave around a nerve (`index.html:1526`, `1529`), not a vertebra.
   A person learns the word wrong from the app. Not tracked anywhere in
   `TASKS.md` before today.
2. **AX8 is still open.** Unlabelled Hz beside plexus names on two surfaces,
   section 4.
3. **The word map disagrees with itself in four places.** Shame, Insecurity
   and Betrayal between the address table and `LEX`; Courage between the book
   and the law table. Section 5. None is a crash; each is a word shown in two
   places with no reason given.

---

## 10. Open, and whose call

**Decided here, on the rule that seats decide and ask only when blocked:**

- A tool in Play, its own door, appended. Proposed name: Words.
- Seat resolution for tones and for every word not in the address table.
- Coherent words placed by the opposite rule, book tier 24.
- The grammar mark shows and never scores.
- The blind order in Say.
- Nothing built on claims 5 to 7.

**The one question for him, because it decides how big this is:**

> **Seven places or a hundred and twelve?** The app knows a seat for every
> word, and has a tone for every seat. Seven tones, all ready. Your ruling of
> 25 September was "all hundred and twelve should have a tone... based off
> the tones the sound bowls are measured to." No measured source exists for
> the other 105, and spreading the seven across them by position gives
> neighbours about 1.3 Hz apart between Root and Sacral, too close to hear
> as different notes. So the choices are:
>
> 1. **Seven.** Build now. Each address carries its seat's tone. Costs
>    nothing more.
> 2. **Your bowls.** Record each bowl you own with a phone; the recordings
>    give their real notes (the research's own suggestion,
>    `harmonic-research.md` question 6). The first measured number in this
>    layer, about the bowls and not about anyone's body. Costs a session
>    with you and the bowls.
> 3. **Spread by position.** Refused by me: it is arithmetic presented as
>    data, and the steps cannot be heard.
>
> My default, if you do not answer: seven.

**Still open from earlier rounds and not reopened here:** what "the bell curve
is the harmonic register of that address" means as a rule (`DECISIONS.md`
round OI), and which tuning set he holds, if any (`harmonic-research.md`
question 2). The spec works on the shipped solfeggio set and labels it.
