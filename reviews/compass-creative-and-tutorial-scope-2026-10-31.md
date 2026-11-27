# The Compass creative, and a card for every screen: scope, 31 October 2026

Seat: Dani Sorensen, UI and UX. Research and scope only. Nothing in
`atuned_src/`, `engine.js` or `source.html` was edited.

Measured on MOB `30d179e3` (main, 31 October 16:33 UTC). The committed
`source.html` was last built at `ed072228`; the commit after it changes
records only. Reboot-os read at `origin/main` `d1d64b46` (30 October). Both
repositories were fetched fresh tonight and every branch was swept again
rather than taken from the earlier audit.

Every number below was read off a run on this date. None of them is a gate,
and none should be copied into one.

---

## Part 1. "The Compass needs updating. There's creative out on GitHub."

### The short answer

Found. The creative is in **reboot-os**, not in MOB, on the branch
`claude/app-migration-decision-yx56cj`, in the look development folder
(`lookdev/handoff/`). It is written direction, not pictures: no Compass
mockup was ever built from it, where the Journal and Ritual directions in the
same folder each were.

There is a second, separate body of "Compass" work in MOB: ChatGPT's research
branches. That is new content (archetypes, Paradiso, Purgatorio, teachers,
a game board), not design. It is listed below because his phrase on 30
October, "especially Compass, since we've got updates", may mean that content
is the update and the look development is how it should look. Both are named
rather than guessing.

### Every candidate, ranked

| # | Where | What it is | Newest work | Distance from main | Creative? |
|---|---|---|---|---|---|
| 1 | reboot-os `claude/app-migration-decision-yx56cj`, `lookdev/handoff/COMPASS_MOCKUP_DIRECTIONS.md` | New names for the four dark figures, and three creative directions for the Compass screen (A, B, C) | 23 Oct 07:37 (`862f72e8`) | branch is 324 commits ahead of reboot-os main and 647 behind; split from it 27 Sep. Open PR #2 there, "Alpha updates" | **Yes, the main one** |
| 1b | same branch, `lookdev/handoff/FIELD_BODY_COMPASS_BRIEF_2026-10-30.md` | His dictated ask, "new concepts, updated concepts for Field and Body. And Compass. Especially Compass, since we've got updates." Resolves one new Compass mark, the reach line | 30 Oct 17:37 (`52499796`) | same branch | **Yes, newest** |
| 1c | same branch, `lookdev/handoff/builds/compass_fix.patch` and `compass_CHANGES.txt` | A copy fix to `compass.js`: eleven abstract words (construct, framework, leverage) rewritten plainly, three all caps, one em dash | 23 Oct 02:08 (`1c912508`) | not on MOB main: `compass.js` still carries "construct" and "framework" at lines 504, 524, 526 and 563 | Copy, not design |
| 2 | MOB `atuned/compass-foundation-closure-20261026` and its siblings (`atuned/quiz-v2-validation-20261028`, `atunED/paradiso-compass-map-v0-2026-10-25`, `atunED/teachers-poles-ascent-alpha-2026-10-25`, `fix/machiavellianism-*-2026-10-29`) | ChatGPT's research programme it calls "Compass": twelve archetype records, Paradiso, Purgatorio, Inferno registries, teacher opposites, a game board of scenes, graph editor pages. Nearly all under `docs/data/compass/` | 29 Oct 23:53 (`598236f1`) | foundation branch is 235 ahead and 95 behind main, split 24 Oct; 323 files, about 115,000 lines added, almost all research data | No. Content, and its own records say "no canon promotions" |
| 2b | MOB `atuned/hero-journey-board-main-sync-2026-10-29`, open **PR #156** | The Hero's Journey board, the one piece of 2 with a real screen. It draws on the **Avatar**, not the Compass (`avatarui.js` gains `hjPanel`) | 29 Oct 23:58 | 119 ahead, 46 behind | A real UI, on another tab |
| 3 | MOB `lance/lookdev-handoff-2026-10-25` | Look development handoff. Touches `compass.js` in one word: "malignant" to "negative" | 28 Oct 07:09 | 46 ahead, 68 behind | No, one word |

Ruled out, so nobody chases them again:

- `claude/compass-thirteen-rb`: zero commits not already on main. A dead name.
- `mockups/compass-overlays/`: on main since 1 October (round OJ), already built.
- `reviews/compass-passes.html` and `DESIGN-compass.md`: on main since
  September, already built.
- Reboot-os `copy-system-mirror-sweep-2026-10-14`, `36_the-teachers-on-the-compass.js`:
  the other application, which does not serve atuned.world.

### What candidate 1 actually says

Four things, each checked against main tonight. The line numbers it cites in
`ui/cone.js` and `engine/data/compass.js` still hold within a line or two.

1. **Rename the four dark figures.** Malak, Baal, Set, Lucifer, the bottom
   of the cone. Recommended: Tyrant, Predator, Sabotage, Vanity. Alternates
   are given for each, with collisions found by search (for example
   "Betrayal" is already address 52 and "Corruption" is already a coherence
   band). Nothing renamed on main: `compass.js` lines 142 to 145 still read
   Malak, Baal, Set, Lucifer.
2. **Three directions for the screen, none picked.**
   - **A, the quiet instrument.** The face stays as it is. One new plain
     readout, Resistance. Resistance also makes the figure drift and settle
     less cleanly. The dark material stays behind the Field's marker.
   - **B, the Compass is the depth.** The dark figures and the masters get a
     small ring at the cone's tips, opened on a press, reusing drill content
     that already exists. The figure turns on its own to face whichever
     quality carries the most load.
   - **C, the signature.** Nothing visible changes. Pull and Resistance drive
     the motion, and one rare state stops the figure ever fully settling.
3. **The reach line (30 October, resolved, buildable).** Under the needle,
   one line of words in the stack's order: fetter, saboteur, complex,
   hypercomplex, super-complex at full ink, then mask, archetype, domain
   dimmed. It shows no numbers, because the engine cannot yet compute the
   dimmed three. It is meant to read `TRACE_CHAIN` in `engine/trace.js` at
   build time so it updates itself. Nothing of it is on main.
4. **The copy fix** (1c above). Never applied. It was cut against an older
   `compass.js` and has to be redone by hand, not applied as a patch.

### The ruling that makes this urgent, and is bigger than candidate 1

`DECISIONS.md`, "Away from the mythological names, toward the behavioural
ones. Ruled 30 October." His words: "instead of referring to a person as
Lucifer or Moloch, we want to describe the behavior in a single word. Or two."

The Compass screen breaks this ruling in every column. Read off the 1600
screenshot tonight: Jesus, Lucifer, Moses, Set, Musashi, Moloch, Buddha,
Geryon, Charon, Phlegyas, The Furies, Kaliya, Ravana, Apep and more, printed
as labels on the face. He has already ruled two of them in `TASKS.md` round
SM: Geryon is Fraud (SM15), Druj is Deception opposite Honesty (SM14).
Geryon is on the Compass face today as the shadow of Perception.

Candidate 1's renaming covers only the bottom four. The ruling covers the
whole face: every shadow name in `MIRROR` (eight on the engine tonight,
Lucifer, Asmodeus, Set, Moloch, Geryon, Charon, Phlegyas, The Furies), the
inverse names on the path rows, the four at the bottom, and
`engine/data/teachers_recipes.js`. Read the list off the data at build time.
Do not type it.

### What "updating the Compass" from it involves

Smallest safe order. Each step names who decides.

1. **His: finish the names.** He is already working through the list, one
   pair at a time (round SM). The behavioural word leads; the old name is a
   footnote at most. Candidate 1's table is the starting list for the bottom
   four. The rest need the same table, built by the narrative seat from
   `compass.js` and `teachers_recipes.js`, with a collision search for each
   word. A builder cannot do this step.
2. **Build: the rename itself.** Text and keys only. The trap candidate 1
   found still holds. An icon is looked up by its name string
   (`IC_NEW`, `icOf()`), and Set and Lucifer each live in two arrays
   (`BLUEPRINT` and `MIRROR`'s `dn`). Rename one copy and the icon
   disappears without a sound. Gates: `tests/engine.js` (group 21, the
   compass), `python3 tools/equiv.py` for the named diff,
   `check.py --objections`, `tools/terms.py`, then shots at both widths.
3. **Build: the reach line.** Resolved and small. It needs no new number. It
   must read `TRACE_CHAIN` and not hold a typed list of words.
4. **Build: redo the copy fix by hand** against today's `compass.js`.
5. **His, after he sees pictures: A, B or C.** The house pattern is
   directions first, then pictures, then a choice. Candidate 1 stopped
   halfway. The next round should mock up A and B, at both widths, on the
   same profile, side by side. C changes nothing in a still image, so it
   needs a short screen recording, not a mockup.
6. **Not this work:** the needle reading CQ against EX. He closed that
   question (look development brief, section 75). And the research in
   candidate 2 goes into the Compass only after his rulings on its own owner
   queue. Its records refuse to promote themselves into the canon.

Rough size: steps 2 to 4 are one build round once step 1 lands. Step 5 is
one mockup round, then one build round.

Neighbour, not part of this: the 30 October "positive and negative"
ruling. `compass.js` line 666 still prints "The shape is malignant", and
`atuned_src` still carries benign or malignant in fifteen files tonight.
Some of those are names in the code and not words on screen. `DECISIONS.md`
records that he asked on 31 October whether that rename had landed.

---

## Part 2. A card for every major screen

### What it is not

Not the Day One tutorial. That was deleted on 23 October and stays deleted
(`DECISIONS.md`, "The Day One tutorial is deleted, not hidden"). It was a
second first run on the onboarding's stage, five full screen cards. What is
scoped here is one short card per screen, which opens only when a person
asks for it.

`tests/onboarding2.js` section 2 already guards the deletion, and it will
fail this work if the work borrows the old names. Off limits: any global
name starting `tut` or `tutorial` followed by a capital, `TUT` or `TUT_`,
the CSS classes `tutx` and `tut-on`, an element with id `tutorial`, any
`data-tut` attribute, and the words "Day One" on the Account page. The word
"tutorial" should not appear on screen either. Use the working name
**screen card** in code (for example `scrCard`, `SCRCARD`). The word a
person reads on screen is the voice seat's call.

### How many screens, read off the live array

`TABDEF` in `engine/core.js`, evaluated on the committed engine tonight,
holds **twelve** entries, in this order:

| Order | Name on the bar | Station | `TAB` | Host id | Card? |
|---|---|---|---|---|---|
| 0 | Discover | discover | `STORY` 0 | `story` | yes. This is the page he calls the Journal |
| 1 | Field | play | `FIELD` 2 | `cv` | yes |
| 2 | Body | play | `ENERGY` 3 | `emap` | yes |
| 3 | Compass | play | `COMPASS` 8 | `cone` | yes, after the renaming |
| 4 | Character | play | `MASKS` 11 | `masksview` | yes |
| 5 | Avatar | play | `INTAKE` 5 | `iq` | yes |
| 6 | Summary | play | `SUMMARY` 1 | `sum` | yes |
| 7 | Intake | play | `QUESTIONS` 13 | `iqp` | yes |
| 8 | Analytics | play | `ANALYTICS` 4 | `ana` | yes |
| 9 | Ritual | flow | `RITUAL` 10 | `rit` | yes |
| 10 | Knowledge | embody | `KNOW` 6 | `know` | yes |
| 11 | Clients | practitioner | `PRACTITIONER` 12 | `prac` | later. Shown only in practitioner mode, and the code calls it "a sketch until sign in exists" |

So the job is **eleven cards now and a twelfth later**. Tonight's brief named
nine and left out Ritual and Knowledge. Both are full screens with their own
station, so they get cards. Settings and Games have no door (`TABEXTRA`):
Settings will hold the index of cards, and Games is hidden.

There is a trap in that table. `TAB.INTAKE` is the **Avatar**, and the
screen named Intake is `TAB.QUESTIONS`. A card title written from the
constant's name would put "Intake" over the Avatar. Every card title must
come from `TABDEF`'s `nm`, and every card is keyed by `.k`, never by
position (house rule).

### What already exists to build on

- **The sheet.** `#sheet` and `#sheet-card` in `shell/body.html`, opened by
  `sheetOpen(html)` and closed by `sheetShut()` in `ui/panels.js`. A click
  on the backdrop and Escape already close it, and focus moves to the
  card's first button. This is the host: no new overlay is needed.
- **The help sheet that is there today, and it is broken.** `helpSheet()`
  in `ui/panels.js` is a "How to read this" card that only covers the Field.
  Its one door is Account, Help, "How to read this", Open. That button is
  wired as `sheetOpen(helpSheet())` in `ui/account.js` line 765.
  `helpSheet()` opens the sheet itself and returns nothing, so the outer
  call writes the word "undefined" over it. Reproduced tonight in Chromium
  by pressing the real button: the sheet shows the single word "undefined".
  The function called alone renders correctly, which was checked first as
  the known good case. So today the product's only help route shows a person
  one broken word.
- **First visit memory.** `source.landed` and `source.tab` in the browser
  store (`TAB_LANDED_KEY`, `tabLandFirst` in `ui/panels.js`) are the
  pattern for a flag kept per device and never on the record.
- **The precedent against always on hints.** `bmHint` in `ui/map.js`
  records that the Body's corner hint, "Press a region to open it...", was
  cut in the HS sweep because it "sat in the corner of the Body on every
  load, explaining the figure to a person already looking at it." Only the
  hint for Paint mode stayed, because a second press that clears a cell
  cannot be found by looking.
- **The precedent against a help circle in the top bar.** A help circle sat
  in the top right. At round JZ he asked for help to move under the
  profile, and at round KC its place went to search (`TASKS.md` round KC).
  A new circle in that cluster would reverse him.

### The interaction model

On request, never forced, the same place on every screen, one card.

1. **The door.** One control per screen, always in the same place, labelled
   with the screen's own name, for example "About Compass". It needs a word
   and not just a symbol, so it is never a control hidden with no
   affordance, and a symbol alone would need a meaning beside it under the
   UNPACK EVERY SYMBOL rule.
   - **Desktop:** in the top bar, right after the divider that ends the
     sections (to the right of Embody, or of the last section when
     practitioner mode is on). That space is empty on every screen in
     tonight's 1600 shots. It is not the right hand cluster where help used
     to be. It cannot go on the second row of tabs: Discover, Ritual and
     Knowledge have no second row, so the door would vanish on three screens.
   - **Phone:** a 44 by 44 ring at the right end of the `#navtog` row (the
     row that reads "Play Compass"). `#navtog` gets narrower to make room.
     Its accessible name is "About Compass", read from `TABDEF`.
2. **The card.** It opens in the existing sheet. A screen never opens it by
   itself: not on arrival, not on a first visit, not from a profile state.
   The card holds at most two controls, Close and "Every screen".
3. **One quiet first visit cue, which can be dropped.** The first time a
   device opens a screen, the door's ring draws in the accent colour instead
   of dim. The cue is static: a ring, not a fill, and no motion. It goes
   back to dim when the card is opened or when the person leaves that
   screen. It is kept per device in the browser store (for example
   `source.about.seen`, a list of `TAB` integers) and never on the record.
   If the store is blocked, the cue does not show and nothing else changes.
   Nothing on the screen is covered.
4. **The index.** Account's broken "How to read this" row becomes "About
   each screen". It opens a sheet listing every screen with a door, in
   `TABDEF` order, and each entry opens that screen's card. This keeps the
   route he asked for under the profile at round JZ. The old help sheet's
   useful lines move into the Field card: the wheel gestures (scroll, drag,
   double click or F, click an address, drag to set a charge on a mouse).
   Its CQ, DQ and SQ lines move to the Summary card. Then `helpSheet` can
   retire.

### Why this adds as little load as possible

I measured visible controls on the first screen of every `TABDEF` surface
tonight. Each host was looked up by its id. Both widths were measured, with
a loaded profile (`loadP(3)`, the index the Compass control counter of 1
October also used). The method: buttons, links, inputs, and elements with a
role or a tab stop, visible inside the window. Canvas hit regions are not
page elements, so Field, Body, Compass and Character read low.

| Screen | 1600 | 390 |
|---|---|---|
| Discover | 10 | 5 |
| Field | 56 | 22 |
| Body | 44 | 16 |
| Compass | 57 | 14 |
| Character | 31 | 17 |
| Avatar | 39 | 17 |
| Summary | 39 | 6 |
| Intake | 39 | 18 |
| Analytics | 68 | 12 |
| Ritual | 46 | 14 |
| Knowledge | 51 | 24 |
| Clients | 19 | 10 |

At desktop, ten of the eleven card screens sit above the target of twelve
choices a working screen should stay under. The card is not the fix for
that. That is the cognitive load problem still open in `CLAUDE.md`, and it
is a structural ruling for another day. What the card can do is this:

- **It costs one control per screen**, in the same place everywhere, so after
  the first screen it costs no search at all. On the Field that is one
  control added to 56.
- **It costs nothing until asked for.** Nothing opens and nothing covers the
  screen. The only cue is a ring that changes colour, which is the gap
  between this and the Day One tutorial.
- **It cuts the load for the person who opens it.** Every card has a "Start
  here" line that names one first action. A stranger facing the Compass's 57
  controls who opens the card now has one. That is the real gain.
- **It holds the card to working memory.** A card has a few fixed slots, no
  more than two controls, and a word ceiling (below), so it fits a 390
  screen without scrolling.

### The shape of each card

Fixed slots, always in this order. A slot keeps its label, and the value
carries what changes.

| Slot | What goes in it | Ceiling |
|---|---|---|
| Station | Which of discover, play, flow, embody this screen belongs to, drawn as the closed loop with this station lit. Never a list: the ruling is that the four close | read from `TABDEF.sec` |
| Name | The screen's name | read from `TABDEF.nm`, never typed |
| What it is | One sentence | 20 words |
| What you do here | Up to three lines. Each starts with a verb and names a real control by its label on screen | 12 words a line |
| Start here | The one first action for a stranger | 10 words |
| What it does not claim | Only on reading screens (Field, Body, Compass, Character, Avatar, Summary, Analytics). One honest line | 15 words |

The whole card stays under about 70 words. The copy rules, all of them the
house's own:

- Every term on a card carries its meaning in the same place (UNPACK EVERY
  SYMBOL). Address, charge, seat, CQ, DQ, mask: each is said in plain words
  beside itself. `GLOSS` in `engine/data/gloss.js` is the source to adapt
  from, not to paste.
- No numeral is typed into a card. A count comes from the data when the card
  is drawn, or it is not written. A card that mentions the addresses gives
  the structure, 108 at a named plexus or nerve plus four field anchors, and
  never a bare 112.
- No em dashes, sentence case, mechanical and plain, no wellness words, and
  no religious names (30 October).

### Who writes it

Not the build agent. Copy is the voice seat's: the narrative director
working under `.claude/skills/atuned-voice/SKILL.md`, alongside
`atuned-ux`. Every card goes through `check.py --objections` and
`tools/terms.py`. Emmy reviews it for taste and does not write it. All
eleven go to him together on one page, as a file plus pictures at both
widths (DELIVER, DO NOT POINT), before they ship.

Seeds, taken from his own words and the code's own notes, as raw material and
not as copy:

| Screen | Seed | Source |
|---|---|---|
| Discover | "the journal, the imprints and the release, which are this page's three columns"; "That really is the journal to the release." Start here: Chat | `TABDEF` note; `TABHOME` note in `core.js` |
| Field | The wheel is your energy; left rail what you are made of, right panel what the instrument reads; the gestures | `helpSheet()` |
| Body | The same addresses placed on a body; regions answer a press, lines answer a pointer | `bmHint` note, `ui/map.js` |
| Compass | Which way a behaviour points, toward coherence or away from it, quality by quality | `DESIGN-compass.md` section 1. **Write it after the renaming**, or the card explains names that are about to go |
| Character | "all of those form the character"; the grids are the masks, the page they make is the character | `TABDEF` note, round LP |
| Avatar | "What is Atuned? Your avatar." It changes as you release and go round the loop | `CLAUDE.md`, the loop and the centre |
| Summary | Your reading on one page; first arrival lands here | `tabLandFirst` note |
| Intake | "The actual intake should be all of the questions." | `TABDEF` note, round OG |
| Analytics | "Size is magnitude... The biggest circle is the biggest thing." | `ui/analytics.js` header |
| Ritual | "Left menu will be for inputting new. Right side... accountability tracker. Center piece is for the ritual." | `TABDEF` note, round QF |
| Knowledge | "Embody is knowledge." The reference behind every word the instrument uses | `TABDEF` note |

### Walked with three people from different levels of the buyer grid

Their placement on the grid is mine, from their descriptions in
`engine/data/people.js` and `DESIGN-mobile-icp.md`, and is not recorded
anywhere else.

- **Angela, 36, seeker, level 5 (Searching), on the Compass.** The record
  already has her closing the product because she "does not know what any of
  the words mean". She reads Jesus, Lucifer and Moloch and is afraid she is
  being judged. She finds a labelled door because it is a word and not a
  glyph. The card's first line has to say it reads behaviour, never people.
  **Where she still stops:** the names on the face. A card cannot fix those;
  the renaming can. So the Compass card waits for the renaming.
- **James, 57, C suite, level 6 (Receptive), on Summary.** He presses
  nothing he cannot name, so the door's label is what gets him to press. The
  "does not claim" line is what earns his trust. **Where he stops:** a card
  over about 70 words, or anything that opens without being asked. Both are
  ruled out above.
- **Sofia, 41, somatic practitioner, level 8 (Aligned), on the Field.** She
  knows the field and never opens a card. If cards opened themselves she
  would read them as condescending, and on eleven screens that is the Day One
  mistake again. The only cost to her is the first visit ring. **Where she
  could stop:** if that cue moved or pulsed. It does neither.

The model holds at levels 5, 6 and 8. The open risk is level 4: someone who
does not open anything they were not told to. For them the cue is the only
thing that helps, which is the reason to keep it.

### What the build agent gets

One build round. The copy is the slow part, and the mechanism can be built
alongside it using the seeds as placeholder text that does not ship.

1. `ui/scrcard.js` (working name), loaded in `MANIFEST` after `ui/panels.js`
   and before `ui/account.js`, so `TAB` and `sheetOpen` already exist.
   - A copy table keyed by `TAB` integer, so lookups go by `.k`.
   - A renderer that reads the name and station from `TABDEF`.
   - The door's markup, and its refresh on `setTab`.
   - The first visit cue, using the browser store.
   - The index sheet.
   It goes in `ui/` and not `engine/data/`, because data files load before
   `engine/core.js` and cannot see `TAB`.
2. `shell/body.html`: the desktop door after the sections' divider, and the
   phone door beside `#navtog`. `shell/head.html`: the door's styles, at
   least 44 by 44, a ring and not a fill, dim by default, the accent colour
   for the cue, no animation, the same in all four themes.
3. `ui/account.js`: the "How to read this" row becomes "About each screen"
   and opens the index. That also fixes the "undefined" bug on the way past.
   Then `helpSheet()` in `ui/panels.js` retires once its lines have moved
   into the Field and Summary cards.
4. A new gate, `tests/scrcard.js`, that reads `TABDEF` when it runs and
   never holds a typed count. For every entry with a door, at 1600 and 390,
   blank and loaded:
   - the door exists, is at least 44 by 44, and sits in the same place;
   - its name contains `TABDEF.nm`;
   - pressing it opens the sheet with that name as the heading;
   - Escape closes it;
   - the card has at most two controls and stays under the word ceiling;
   - the card holds no typed numeral and no undefined term;
   - **no card is open after any arrival**: first visit, funnel link,
     onboarding end, or a stored tab.
   Check the gate against a known bad case first, by making one card open
   itself, and watch it fail.
5. Then the house's full list before committing: build, engine, functional,
   collide (the new door must not overlap a nameplate), design, monitor,
   funnel, boot, `onboarding2.js` (it must stay green), and `check.py
   --objections`. Then shots at both widths, and look at them.

### What to instrument

There is no network for this, and none should be added without a ruling,
because a record of what someone opened is personal data. Keep it per
device:

- Opens per screen, and whether the open came on the first visit. A card
  opened twice on the same screen means the screen is unclear, so fix the
  screen, not the card.
- For the five person test, one each at levels 4, 5, 6, 8 and 9, on the
  Compass and the Field: ask "what is this screen for?" after four seconds
  with no card, then after the card. Also time the first meaningful action
  after the card against the "Start here" line.

### Grade delta

- Nielsen's heuristic 10, help and documentation. Today it fails: one route,
  covering one screen, which shows "undefined". After the build it passes
  on every screen with a door.
- The four second test on the Compass. Today it fails for levels 4 to 6.
  After the card it is expected to pass once the names are behavioural, and
  to stay partial until they are. The five person test above is what settles
  it.
- Load: one control added per screen. For anyone who opens the card, the
  first action goes from dozens of choices to one.

---

## Side findings, outside both questions

- **The help sheet bug** above is live on main and needs fixing whether or
  not the cards are built. The fix is one line: `hw.onclick=helpSheet`.
- `.claude/skills/atuned-ux/SKILL.md` line 88 still says "Never say 108, the
  count is 112". `CLAUDE.md` overrode that on 28 October. Every seat loads
  this skill before any change a person can see, so it is teaching the old
  rule.
- In `engine/data/gloss.js`, the meaning of DQ reads "All the weight held at
  all 112 addresses", a bare 112. A meaning shown as a tooltip opens on its
  own, with no screen around it to have already given the structure.
- The 30 October brief spells the layers "hypercomplex" and "super-complex",
  while `GLOSS` has "Hyper-complex". One word per concept: the voice seat
  picks one spelling before the reach line ships.
