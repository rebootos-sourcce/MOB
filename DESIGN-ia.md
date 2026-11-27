# Information architecture

The first drawing of the whole product. Every claim here cites a file and a
line. Where the code and the copy disagree, the code is quoted and the
disagreement is named rather than resolved, because several of these are the
owner's call.

Measured, not assumed, on the tree as it stands:

    8 tabs                   engine/core.js:50, TABDEF at core.js:56
    4 wheel depths           ui/wheel.js:131
    7 energy map layers      engine/data/practice.js:121
    11 knowledge sections    ui/knowledge.js:72
    5 stack layers           ui/ui.js:200
    5 imprint groupings      ui/imprints.js:9
    2 games                  ui/games.js:157
    3 modal overlays         shell/body.html:87, 91, 92
    1 sheet, 2 buttons       shell/body.html:30, 22, 25
    3 density steps          ui/panels.js:234
    3 themes                 ui/panels.js:123
    17 drill renderers       ui/drills.js, ui/knowledge.js
    76 laws in 7 axes        engine/data/kb.js:20, 21
    21 of them scored        engine/data/canon.js:179
    6 markers                engine/schema.js:258
    338 engine assertions    measured, tests/engine.js
    298 functional           measured, NODE_PATH set
    40 collide, 17 design    measured, 1 expected font failure

---

# 1. The map

## 1.1 The persistent chrome. Present on every tab.

**The top bar.** `shell/body.html:4` to `:29`. Left to right: the wordmark,
the eight tab buttons (built at `ui/panels.js:89`), the one status region
(`body.html:9`, written only by `status()` at `ui/component.js:90`), a spacer,
the "Whose field" persona selector (`body.html:11`), the three theme icons
(`ui/panels.js:123`), the legible toggle (`body.html:14`), the three density
steps (`ui/panels.js:246`), the profile button (`body.html:22`) and the help
button (`body.html:25`).

Ten controls in one bar, of which four are appearance, one is a demo control,
and two are the new sheet. The tab set and the appearance set are not
separated by anything but a spacer.

**The depth sub bar.** `shell/body.html:31`, populated at `ui/panels.js:100`,
shown only on Field (`ui/panels.js:74`). Four buttons, Charge, Cluster, Chain,
Blueprint, each strictly cumulative (`ui/wheel.js:143`).

**The left rail.** `shell/body.html:35` to `:76`. Four folding sections, one
open at a time per rail (`ui/ui.js:169`):

    Awareness         Balance bar, 4 root domains, 19 blueprint domains,
                      12 primary archetypes, 12 secondary archetypes
    Child fetters     2 bulk sliders, then 9 held plus 9 opposite fields
                      (18 number fields, ui/panels.js:45)
    Spiritual states  the cosmological read, ui/personas.js:36
    The matrix        19 domains by 9 axes, 171 cells, ui/personas.js:4

**The right rail.** `shell/body.html:110` to `:151`. One pinned line plus five
folding sections and one button:

    railtop           coherence ring and the tier word, ui/ui.js:235
    The reading       person block, the 5 tab stack, instruments
    Selection         the universal drill target, #rdrill
    Flow through      #eshelf and #run
    What is running   #fire, top 8
    21 laws           1 bulk slider plus 21 number fields
    Run a release     #bRel, ui/personas.js:231

Both rails are present on all eight tabs. Only the stage swaps
(`ui/panels.js:69` hides TABDEF ids, `:73` hides the canvas). This is the
single most important fact in the architecture: **the rails are the app and
the tabs are a stage.** Nothing in the interface says so.

## 1.2 The eight tabs

`TAB` integers are identity (`engine/core.js:50`). `TABDEF` is display order
(`core.js:56`). Display order, with identity in brackets:

**1. Intake (identity 5).** `ui/intakeui.js:36`. Who this is (six identity
fields plus an unknown time checkbox), the optional four letter seed
(`intakeui.js:11`), a progress header with CQ and "answered of 63", a profile
row (select, New, Save, Export), then 21 folding law blocks of three questions
each, each question an eleven button scale. Entered only from the tab bar.
Referenced in prose from two other surfaces with no link: `ui/analytics.js:157`
"Answer them in Intake" and `ui/drills.js:83` "Three questions would replace
the guess".

**2. Story (identity 0).** `ui/storyui.js:2`. Two columns. Left, the journal:
a textarea, a speech button (`storyui.js:49`), a word and tag count, Clear,
and Commit N. Right, the imprint cloud (`ui/imprints.js:55`), grouped five ways
(Seat, Charge, Saboteur, Story, Expression), with a maximise toggle, a
selection counter, Detail, and Release N. Entered from the tab bar, and from
Games by "See the N running you" (`ui/games.js:243`), which preselects pills
and jumps here. That second route is a **door** and a good one.

**3. Field (identity 2).** The wheel, `ui/wheel.js:141`. The only tab with the
canvas and the only tab with the depth sub bar. Also on the stage: the key
strip of five quotient buttons (`ui/ui.js:287`), the tier block, the balance
button (`body.html:96`), the accuracy block (`ui/personas.js:119`), the compass
(`ui/personas.js:78`), and the hover probe. Gestures: drag a segment to set a
charge on a fine pointer only (`ui/ui.js:80`), tap to open on a coarse pointer
(`ui/ui.js:84`), scroll to zoom, drag empty space to pan, double click or F to
reframe (`ui/ui.js:139`, `:123`).

**4. Energy (identity 3).** `ui/map.js`. The body figure, seven layers
(`practice.js:121`), a pain region picker on the pain layer, and the energy
shelf written into the right rail's Flow through section
(`ui/mapshelf.js:9`). The shelf carries a per layer legend
(`mapshelf.js:68`), which is the only legend in the product.

**5. Analytics (identity 4).** `ui/analytics.js:78`. A hero with coherence, one
sentence, and the identification interval. Six bubble fields. The 21 law bars.
A session strip. Then the record, injected as `#rec` at `analytics.js:162` and
rendered by `ui/record.js:47`. Bubbles open the drill (`analytics.js:165`).

**6. Summary (identity 1).** `ui/summary.js:41`. Hero, six cards, the five
lens composite, the spiritual overlay, and a Source AI note that is text only
(`summary.js:142`).

**7. Knowledge (identity 6).** `ui/knowledge.js:81`. A search box that counts
matches across every section, eleven section tabs, a row list where every row
is a door to a drill (`knowledge.js:135`), and the Letting Go Deck beneath it
(`knowledge.js:117`). The eleven sections: Addresses, Fetters, Saboteurs, Laws,
Domains, Archetypes, Gates, The cards, The catalog, The 76 laws, Glossary
(`knowledge.js:72`). The cards section is four data sets in one list: printed
protocol cards (`cards.js:135`), the nine axes cards (`cards.js:211`), the five
intensity bands (`cards.js:50`), the six pattern kinds (`cards.js:109`) and the
two poles (`cards.js:77`).

**8. Games (identity 7).** `ui/games.js:151`. Two, switched by a tab row.
The letting go run: 24 cards face down drawn from the held field
(`games.js:36`), a pole chip pair, a clock, a said line with its source named
(`games.js:82`), and a per card two sided clear rule (`games.js:67`). The
match: eight pairs of fetter marks, and a matched pair opens a block that
counts how many of the person's own addresses that axis is running
(`games.js:133`). Under both, a permanent "Phase two, not built" block
(`games.js:228`).

## 1.3 The overlays

Three, all `position:fixed` full screen at z-index 90 (`shell/head.html:1011`),
which is above the sheet at z-index 70 (`head.html:584`).

    #rel    the release run      ui/release.js:70
    #rit    the ritual builder   ui/ritual.js:25
    #deck   one dealt card       ui/knowledge.js:216

None of the three closes on Escape or on a backdrop click. The sheet does both
(`ui/panels.js:321`, `:322`). Three modal surfaces, two dismissal contracts.

`setTab` hides only TABDEF ids (`ui/panels.js:69`), and none of these three is
in TABDEF, so an open card or an open release survives a tab change and floats
over the next tab.

## 1.4 The drill is the one detail surface

Seventeen renderers, all ending in `rdShell` (`ui/drills.js:22`), all writing
into `#rdrill` in the right rail's Selection section:

    runDrill          a saboteur, complex, hyper or character   drills.js:29
    runLawDrill       one of the 21                             drills.js:65
    runNodeDrill      one of the 112 addresses                  drills.js:88
    runCoreDrill      CQ and the six gates                      drills.js:112
    runGatesDrill     one gate                                  drills.js:143
    runQDrill         CQ, DQ, SQ, Pole                          drills.js:158
    runXYZDrill       the three energy axes                     drills.js:187
    runBalDrill       balance                                   drills.js:208
    runSeatDrill      a seat from the catalog                   drills.js:234
    runFetterDrill    one of the nine axes                      drills.js:247
    runSabDrill       a saboteur not currently running          drills.js:262
    runDomDrill       a blueprint domain, clear and distorted   drills.js:278
    runKbDrill        glossary, harmonic, archetype, band, kind drills.js:298
    runCompassDrill   the tier ladder                           drills.js:304
    runCellDrill      one matrix cell                           drills.js:317
    runSpDrill        a cosmological row                        drills.js:338
    runCardDrill      a printed protocol card                   knowledge.js:164
    runAxCardDrill    one axes card                             knowledge.js:183
    anaDrill          an analytics bubble                       analytics.js:171

`rdOpen` (`drills.js:8`) unfolds the Selection section and scrolls it into
view, which is the fix for a click whose answer arrived below the fold. This is
the best piece of architecture in the product and it is why the rails must not
be treated as decoration.

## 1.5 Surfaces reachable by more than one route

A **door** is a second route that saves a person a journey. A **duplicate** is
a second copy of the same content that can drift.

| Surface | Routes | Verdict |
|---|---|---|
| The address drill | wheel tap (`ui.js:85`), any `.ad-r` row anywhere (`ui.js:403`), an imprint pill Detail (`imprints.js:139`), a knowledge row (`knowledge.js:138`), a dealt card's Open the address (`knowledge.js:241`) | Door. One renderer, five entrances. Exactly right. |
| The release run | Run a release in the right rail (`personas.js:231`), Release N from the imprint selection (`imprints.js:136`) | Door. The first takes the top 8 held, the second takes the selection. Two intents, one engine. |
| Density | top bar (`panels.js:246`), profile sheet (`panels.js:285`) | Door. One setter, `densSet`, shared. Correct by construction. |
| The nine axes | left rail 18 number fields (`panels.js:45`), the stack Fetters tab (`ui.js:205`), wheel drag (`ui.js:81`), the fetter drill, the match game block, Knowledge Fetters | Mostly door, one duplicate: the stack Fetters tab and the left rail fields render the same nine numbers in two formats on one screen. |
| The tier ladder | the compass drill (`drills.js:307`) and the railtop word (`ui.js:240`) | Duplicate of a sort: `drills.js:307` hardcodes the seven tier thresholds as a literal instead of reading the engine's ramp. A second copy of a table that can drift. |
| The four depth explanations | `ui/wheel.js:132` as `VIEWS[].how`, and `ui/ui.js:5` as a dead `HOWTO` array | **Duplicate, and one half is dead.** `HOWTO` is referenced nowhere (only in a comment at `panels.js:104`). Delete `ui/ui.js:5` to `:9`. |
| The coherent opposite of an axis | engine `CHILD[].opp` (`canon.js:93`) and card `cop` (`cards.js:212`) | **Duplicate that already disagrees.** Knowledge shows "Fear toward Trust" at `knowledge.js:24` and "toward Safety" at `knowledge.js:59`, on the same tab. Apathy toward Vitality against Joy, Sad toward Joy against Happy. Recorded as his in `DECISIONS.md`. |
| The gates block | `gatesBlock` inside the core drill (`drills.js:125`) and inside the gate drill (`drills.js:153`) | Door. One function, two hosts. |
| The empty state | eleven different sentences, see section 2 | Duplicate. |

## 1.6 Unreachable

Named by what it is, with the line where it is computed and the fact that no
route exists.

1. **The whole cosmological layer, for the actual person.** `renderSpirit`
   reads `spiritual(p.nm)` (`ui/personas.js:38`), `spiritual` reads the `BIRTH`
   table (`engine/birth.js:101`), and `BIRTH.You` is `null`
   (`ui/personas.js:137`). The Summary overlay does the same through
   `converge(nm2, r)` (`ui/summary.js:100`). A person who types their birth
   date, time and place into Intake writes to `CURP.who.born`
   (`ui/intakeui.js:130`), and nothing reads it. `spiritualOf(bt)`
   (`engine/birth.js:105`) exists precisely to close this and is called from
   nowhere in `ui/`. So `engine/astro.js` and `engine/birth.js`, the Meeus
   solar and lunar series, the ascendant, the gate wheel and the 88 degree
   design solve, are reachable only by the nine reference personas. This is the
   single largest unreachable surface in the product.
2. **The place gazetteer is nine cities.** `engine/astro.js:144`. Every one is
   a reference persona's birthplace. A real person's ascendant returns null
   without a known place (`birth.js:51`), correctly and permanently.
3. **The marker ladder.** Six markers at `engine/schema.js:258`. Only `next` is
   rendered, one row in the profile sheet (`ui/panels.js:271`). The other five
   distances, `giftLeft`, `inGift` and `cleared` (`schema.js:278`, `:283`) have
   no surface at all. The gift of 100 is a ruling in `DECISIONS.md` and is
   invisible in the app.
4. **Dated firsts.** `meterFirst` writes them (`schema.js:299`), release
   collects them into `RUN.firsts` (`ui/release.js:57` to `:64`), and
   `relRender`'s done phase never prints them (`release.js:93` onward).
   `meterRead().firsts` (`schema.js:293`) is read by nobody. The only
   achievement shape the product allows is written and never shown.
5. **Saved rituals.** `ritRender` pushes to `CURP.rituals` (`ui/ritual.js:70`).
   No surface reads the array. `DECISIONS.md` already names this: "the overlay
   logs a practice and nothing reads the log back."
6. **Import.** `pImport` and `importError` (`schema.js:310`, `:324`) have no
   control. Export exists (`intakeui.js:153`). A person can get their record
   out and not back in.
7. **Nine tables of the 3C generator.** `C3_LADDER`, `C3_CHAIN`, `C3_DIR`,
   `C3_PART`, `C3_HEAD`, `C3_THEME`, `C3_TRUTHRULE`, `C3_FAIL` and `c3Band()`
   (`engine/data/cards.js:66, 93, 96, 99, 104, 105, 117, 125, 282`) appear only
   in `engine/export.js`, which is the test seam. The Knowledge cards section
   surfaces `C3_BAND`, `C3_KIND` and `C3_POLE` and stops there.
8. **The pain value per address.** `painOf` (`ui/imprints.js:24`) and the
   `feeds` count (`:31`) are computed once and used once, inside a hover
   `title` (`:50`). On a touch screen these two numbers do not exist.
9. **`#howto`.** The element is in the markup (`body.html:95`), styled, given a
   mobile order, and emptied and hidden on every render (`ui/ui.js:263`). Dead
   markup carrying live CSS.
10. **The energy shelf, off the Energy tab.** `renderShelf` is called only from
    `ui/map.js:259`. The right rail's Flow through section therefore shows an
    empty or stale `#eshelf` above a live `#run` on the other seven tabs. Half
    a section that belongs to one tab.

**One control with two identities.** `#bRel`, "Run a release"
(`ui/personas.js:231`). With something held it opens the release queue. With
nothing held it starts `REL`, a 2.8 second animation that drives every charge
to zero and raises every law by 55 percent of its gap (`personas.js:239` to
`:245`), with no confirmation, no naming, and no undo. One button, two
behaviours, and the second rewrites the whole reading. Rule 5 of the UX skill
is the reason this matters.

---

# 2. The naming scheme

Audited with `python3 tools/terms.py`, which pulled 693 user visible strings
out of the UI layer and the shell. Its own output first, verbatim:

      the empty state    nothing held x7  no story yet x3  none x2  nothing is held x1
      a held address     held x23  running x5  carrying x4  loaded x1  firing x1
      clearing           release x5  shut x5  empty x1
      the charge value   charge x5  weight x5  load x4  depth x2
      the person         you x10  profile x5  your field x1  whose field x1
      measured vs not    measured x3  scored x2  unmeasured x1

The tool undercounts, because it groups by phrase and the drift is mostly in
whole sentences. The real empty state count is not four variants, it is
seventeen. The canonical word is given first, then the losers with the line to
change.

## 2.1 The empty state. Canonical: **nothing held**.

Seventeen sentences for one concept. Already the sharpest finding in the UX
skill, and it has grown since it was written.

    KEEP    nothing held        map.js:207, mapshelf.js:14, :21, :80,
                                imprints.js:80, personas.js:41, summary.js:60
    REPLACE Nothing held. Write in the box and it gathers here.   imprints.js:67
    REPLACE Nothing is running.                                   ui.js:350
    REPLACE Nothing running                                       ui.js:363
    REPLACE Nothing at this layer.                                ui.js:217
    REPLACE nothing here                                          analytics.js:51
    REPLACE Nothing is compounding.                               analytics.js:94
    REPLACE Nothing is compounding yet.                           imprints.js:93
    REPLACE Nothing here matches.                                 knowledge.js:105
    REPLACE Nothing selected.                                     body.html:126
    REPLACE No committed entries yet.                             imprints.js:102
    REPLACE Nothing installed yet.                                drills.js:180
    REPLACE nothing compounds from here                           drills.js:109
    REPLACE No named saboteur is firing.                          summary.js:67
    REPLACE nothing opened yet                                    record.js:83
    REPLACE No snapshots yet.                                     record.js:52
    REPLACE clear                                                 map.js:232

Consistency is not sameness, so three of these stay distinct because they are
distinct states, and they take a shaped form of the canonical phrase rather
than a new phrase: "nothing held at this layer", "nothing held matches",
"nothing selected". A search for nothing held is then a search for one string
family. "No story yet" (`ui.js:17`, `:281`, `drills.js:140`) is a fourth real
state, absence of evidence rather than absence of charge, and keeps its own
words.

## 2.2 A held address. Canonical: **held**.

    KEEP    held                        23 uses
    REPLACE carrying                    panels.js:269, analytics.js:108,
                                        record.js:94, ui.js:294, :296
    REPLACE loaded                      r.loaded in the engine, LOADED at map.js:19
    REPLACE above the line              mapshelf.js:39, :54
    REPLACE running (of an address)     ui.js:363, games.js:147
    REPLACE firing                      summary.js:67
    REPLACE hot, live                   code only: map.js:32, imprints.js:11

"Running" stays for a saboteur, complex, hyper or character, which is a
different state of a different object. The skill already rules this: "held,
installed and firing are three different states and stay three words." What
broke is that "carrying" and "above the line" were added later as two more
words for held.

## 2.3 The charge value. Canonical: **charge** for the input, **SQ** for the reading at one address, **DQ** for the sum.

    KEEP    charge, SQ, DQ
    REPLACE weight (of an address)      mapshelf.js:70 "SQ held there" is right,
                                        crPat title at component.js:62 is not
    REPLACE load                        mapshelf.js:76
    REPLACE depth                       ui.js:296 "Segment depth"
    REPLACE pain                        imprints.js:50, and see 1.6 item 8

"Weight" keeps one job and one only: the weight of a compounding object,
`o.w`. It must stop being a second word for the charge at an address.

## 2.4 Pattern. Canonical: **pattern** is the metered release line and nothing else.

The worst collision in the product, because the tier ladder in `DECISIONS.md`
sells patterns by the month.

    KEEP    pattern = one release line, one channel over one address
            DECISIONS.md:28, schema.js:224 meterKey, schema.js:244
    REPLACE Pattern as the fallback name for a compounding object
            drills.js:37 TN default, analytics.js:209
            -> use the layer's own word: saboteur, complex, hyper, character
    REPLACE pattern kind, of the generator          cards.js:109, knowledge.js:64
            -> "statement kind"
    REPLACE the pattern under it, of a pain region  practice.js:128
            -> "what it reads as"
    REPLACE card, used for a pattern                knowledge.js:118
            -> keep card for the printed artefact only

## 2.5 Tier. Canonical: **tier** is the coherence band and nothing else.

Four meanings today.

    KEEP    tier = the coherence band      ui.js:240, drills.js:307
    REPLACE practice tier                  practice.js:19 and ritual.js:11
            -> "depth", or "entry, working, deep"
    REPLACE saboteur tier                   mapshelf.js:71, analytics.js:81 TIER
            -> "layer", which the stack already calls it at ui.js:200
    RESERVE paid tier                       DECISIONS.md:17
            -> the accounts fork needs this word. It cannot have it while
               three other things hold it. This has to be settled before
               the paywall is built, not after.

## 2.6 Axis. Canonical: **axis** is one of the nine poled child fetters.

    KEEP    axis, of the nine               canon.js:93, ui.js:298
    REPLACE child fetter as a second name   body.html:56, :58, knowledge.js:23,
                                            drills.js:250, personas.js:20
            -> one word. The skill says so and the code says both.
    REPLACE Fetters as the name of the map layer showing HELD ADDRESSES
            practice.js:121, map.js:39
            -> the button says Fetters and the layer draws addresses.
               Call it Addresses.
    REPLACE the three axes, of energy       ui.js:302, drills.js:187
            -> "the three energy lines"
    REPLACE axis, of the 76 laws            kb.js:21 HARM_AX, knowledge.js:45
            -> "family". Seven families of 76 laws.

## 2.7 Release. Canonical: **release** for the act, **letting go** never as a synonym.

    KEEP    release                         release.js, imprints.js:122
    NOTE    letting go is the owner's name for two artefacts, the Letting Go
            Deck (knowledge.js:117) and the letting go run (games.js:158), and
            those are proper names. The line itself says "I am letting go of"
            (cards.js:32), which is the statement and not a UI label. So the
            phrase is allowed as a name and as a sentence, and never as a verb
            in chrome. It is not currently used that way, and this entry exists
            to keep it that way.

## 2.8 The person. Canonical: **profile** in chrome, **you** in prose.

    KEEP    profile                         intakeui.js:82, schema.js:14
    KEEP    you, in sentences addressed to the reader
    REPLACE Whose field                     body.html:11
            -> "Profile", because the control picks a profile
    REPLACE persona                          code only: PEOPLE, PROF_BY,
                                             personas.js. Never in copy, and
                                             the skill already forbids it.
    REPLACE your field                       body.html:96 aria-label
    NOTE    "Your record" (panels.js:276) and "The record" (record.js:50) are
            two names for one thing on two surfaces. Pick "your record".

## 2.9 Measured. Canonical: **measured**.

    KEEP    measured, unmeasured            analytics.js:154, personas.js:122
    REPLACE scored                          knowledge.js:43, :46
    REPLACE not yet measured                schema.js:42 comment, fine in code
    REPLACE answered                        intakeui.js:79, which is a
                                            different thing and is correct:
                                            63 answered, 21 measured. Keep
                                            both and never mix them.

## 2.10 The seat. Canonical: the seven names in `BANDS`.

`engine/data/canon.js:66` gives `3rd Eye`. `practice.js:106` gives
`Third Eye`. `practice.js:115` gives `Brow`. Three names for one seat, all
user visible.

    KEEP    3rd Eye                         canon.js:66
    REPLACE Third Eye                       practice.js:106 PMBANDS.nm
    REPLACE Brow                            practice.js:115 FLOWSEAT.n

Also: **seat** against **band**. `BANDS` is the engine's word, `seat` is the
UI's. That split is fine and is already consistent, and the entry is here so
nobody "fixes" it by renaming one into the other.

---

# 3. The help menu, specified

## 3.1 The constraint that decides the shape

Every explanation in this product lives in a hover `title` attribute. A touch
screen cannot reach a `title`. The full inventory, which is the migration list:

| Where | What it explains | Other route? |
|---|---|---|
| `panels.js:108` | the four depths, `VIEWS[].how` | **None.** `ui.js:262` records that the on screen block was removed and the tooltip is now the only home |
| `panels.js:251` | the three density steps, rendered as the letters T, C, W | **None** |
| `panels.js:143` | each of 19 domains: name, root, definition, shift click to add | Partly: the caption at `#capD` shows the hovered one, also on hover |
| `panels.js:162` | each of 4 roots: what it holds, the 1.3 affinity | Partly, same caption |
| `panels.js:183` | each of 24 archetype buttons: verb, shift click to add | Partly, `#capA` |
| `body.html:15` | the legible toggle, Atkinson Hyperlegible | **None** |
| `body.html:22`, `:25` | the two sheet buttons themselves | **None** |
| `ui.js:279` | the whole reading of the balance bar, cue count and source | Yes, `runBalDrill` |
| `ui.js:292` to `:302` | CQ, DQ, SQ, Pole, Energy definitions | Yes, `runQDrill` |
| `component.js:31` | every ring: seat, label, value | Sometimes |
| `component.js:56` | "Open X" on every address row | Yes, the click |
| `imprints.js:47` to `:50` | per pill: opposite, seat, SQ, **pain**, **feeds** | **None for pain and feeds** |
| `imprints.js:64` | the maximise toggle | **None** |
| `analytics.js:59`, `:138`, `:150` | bubble value, law value, session CQ | Partly |
| `record.js:70` | each snapshot pip: date and CQ | Partly |
| `map.js:220`, `:255` | node and bead names on the figure | Yes, the click |
| `personas.js:6` | each of 171 matrix cells | Yes, `runCellDrill` |

Three are also aria-label only, which is invisible to a sighted touch user:
the balance button (`body.html:96`), the compass (`body.html:98`) and the
canvas (`body.html:82`).

**Must migrate, because there is no other route:** the four depths, the three
density steps, the legible toggle, the shift click gesture, the maximise
toggle, and the pain and feeds values per address. Six items, of which the
depths are the most serious: they are the product's own explanation of its
main instrument and they are currently unreachable on a phone.

**Should stop being a tooltip, because a drill already says it better:** the
five key strip definitions and the balance bar reading. A tooltip that
duplicates a drill is a second copy that can drift, and `ui.js:290` already
argues this case for the gloss words.

## 3.2 What the help sheet contains

Replaces `helpSheet` at `ui/panels.js:292`, which is currently four prose
blocks and a wheel gesture table. Nine sections, in this order, because the
order is the order a person asks.

**A. What this is.** Two sentences. The rails are the instrument, the tabs are
what you point it at. This is the sentence the product has never said and it
is the one that makes the layout legible.

**B. Where things are.** Eight rows, one per tab, each a name, one line of
what it is for, and **a button that goes there**. Help has to be a door, not a
leaflet. It is the only place the eight surfaces are ever listed together, and
it is the fix for "Answer them in Intake" having no link (`analytics.js:157`).

**C. The reading.** CQ, DQ, SQ, Pole, Energy, one line each, migrated from
`ui.js:292` to `:302`, each with a button that opens the matching drill. Then
identification and its interval, quoting `analytics.js:104`, and the sentence
that a move smaller than the interval is not a reading.

**D. The wheel.** The gesture table that `helpSheet` already has
(`panels.js:298` to `:304`), plus the four depths with their full text from
`VIEWS[].how`, plus the note that dragging to charge is a fine pointer gesture
only and a tap reads instead (`ui.js:79` to `:85`). This section is the
migration target for the highest priority item in 3.1.

**E. The rails.** Left rail four sections, right rail five, one line each,
naming what each holds. Plus: one section open at a time per rail
(`ui.js:169`), and clicking anything on the wheel unfolds Selection
(`drills.js:11`).

**F. The controls.** A reference table of every chrome control: the persona
selector, the three themes, legible, the three density steps, profile, help.
One line each, and the density lines say what they do to the whole interface
rather than to the type.

**G. Practice.** Release (four passes, right then left, limit then truth,
`release.js:7`), the ritual builder and how it is reached, the deck, the two
games, and the printed cards. Each with its entrance named, because the ritual
builder has exactly one and most people will never find it.

**H. Your record.** Where it is held, what a snapshot is and when one is
written (`record.js:53`), what ground opened means and why it is the number
that cannot drift (`record.js:62`), and what happens if storage is blocked.

**I. What it does not claim.** Kept from `panels.js:309`, plus the three
honest gaps the engine already states in code: the Human Design type is not
computed (`birth.js:79`), the ascendant needs a place (`birth.js:46`), and
21 of the 76 laws are scored and 55 are read (`knowledge.js:41`).

## 3.3 How help reaches every control

A sheet cannot list 171 matrix cells or 112 addresses, and should not try.
Three mechanisms, in order of cost:

1. **The index in section B.** Eight tabs, both rails, three overlays. Every
   surface in the product is one tap from help.
2. **Deep links from help into the drill.** Section C's five buttons call
   `runQDrill` and close the sheet. The drill is already the universal detail
   surface, so help does not duplicate content, it routes to it.
3. **A "what is this" affordance on the surfaces that have none.** The six
   must migrate items in 3.1 get a visible line of text on their own surface,
   not only a help row. Density gets its three words back in the sheet
   (`panels.js:285` already prints them, the top bar prints one letter). The
   depths get a one line caption under the sub bar. Shift click gets one line
   under the domain grid. That is three lines of copy and it removes the three
   worst cases.

The sheet also needs, and does not have, `role="dialog"`, `aria-modal="true"`
and an accessible name (`body.html:30`), a focus trap, and focus restored to
the opening button on close. `sheetOpen` focuses the first control
(`panels.js:259`) and nothing returns it. Two ids do one job, `shclose`
(`panels.js:290`) and `shclose2` (`panels.js:314`), which should be one.

---

# 4. The user profile menu, specified

Replaces `profileSheet` at `ui/panels.js:262`, which today is four blocks:
this reading, density, your record, close.

## 4.1 Now, with no accounts

**Identity.** `CURP.name` (`panels.js:264`). Add, read only: the name from
Intake if given (`who.first`, `who.last`), and a link to Intake to change it,
because the sheet must not become a second editor for fields that already have
one.

**This reading.** Keep all five rows (`panels.js:266` to `:271`). Coherence of
100, tier, addresses carrying of 112, ground opened, next marker. One change:
"Addresses carrying" becomes "Addresses held" per section 2.2.

**Appearance.** Density (keep, `panels.js:273`), and **move theme and legible
here from the top bar**. Rationale: three theme icons plus a legible toggle
plus three density steps is seven appearance controls in a bar that also holds
eight tabs and a status region. The density control belongs in the bar because
the owner's finding is that it changes what fits; theme and legible are set
once. Moving two of them cuts the bar by four buttons.

While they move, they get persisted. Density persists through
`STORE.set('dens', k)` (`panels.js:241`). Theme (`panels.js:129`) and legible
(`panels.js:135`) do not, so a reload throws them away. Three appearance
controls, two persistence contracts, is the same class of defect as the empty
state.

**Your record.** Keep snapshots on file and the storage row
(`panels.js:278`, `:279`). Add:

    Ground opened          meterRead().unique, all time
    Lines spoken           meterRead().lines, with reruns free stated
    The gift               giftLeft of 100, schema.js:278, ruled in DECISIONS
    The ladder             all six markers, reached or the distance left
    Dated firsts           meterRead().firsts, newest first
    Rituals saved          CURP.rituals, which nothing reads today
    Export                 already exists at intakeui.js:153, belongs here too
    Import                 pImport exists and has no control anywhere

The ladder and the firsts are the two things the engine computes and nobody
can see. They belong here and not on a tab, because a marker is a distance and
not a score, and `schema.js:257` is explicit that nothing unlocks at one.

**The persona selector.** `body.html:11`. It is a demo control. It ships in the
top bar of a product about to grow accounts, and switching it repoints `CURP`
(`personas.js:155`). It should move into this sheet, under a heading that says
what it is, and be the first thing removed when sign in lands.

**Reset.** Does not exist. There is no way to clear a profile or start again.
With no undo (`ui.js:61`, the UX skill's rule 5), this is the only escape a
person has from a field they have wrecked, and the release demo path at
`personas.js:239` can wreck one in 2.8 seconds.

## 4.2 After the fork. Every row below is ruled in `DECISIONS.md`.

**Sign in.** The app gains network at exactly one seam, fetching a record at
sign in (`CLAUDE.md`). The sheet is where the seam surfaces: signed in as,
last synced, sign out. `validateProfile` (`schema.js:130`) is the boundary and
that fetch is its first real caller, so this row also needs a failure state
that says which field was refused, through `importError()`.

**The key.** `DECISIONS.md:112` and `:242`. A name is replaced by a key,
records are never looked up by name, and the key is what unlocks a record in
an emergency. The row: the key, masked, a reveal, a copy, and one sentence
that it is not held beside the name. This is the one row in the sheet that can
lose a person everything, so it says so once, plainly, and never again.

**Practitioner grants.** `DECISIONS.md:119` to `:133`. Consent is explicit,
listed and revocable, never a default. The shape:

    A list, one row per practitioner. Empty state: "Nobody has sight of your
    record." Each row: who, what they see, who started it (client submitted
    or practitioner submitted, DECISIONS:124), the date consent was given,
    and Revoke on the row.
    A grant flow that states, before consent, exactly what the grant covers:
    first name, last name, date of birth, what has been released, what has
    not, the structure, and the stories (DECISIONS:127).
    Revoke is one tap and takes effect immediately. It is not buried, and it
    is not a support request.

Open, and named as open so nobody builds past it: whether a practitioner sees
everything or only the tier scope (`DECISIONS.md:133`).

**Tier and allowance.** `DECISIONS.md:7` to `:33`. The row set:

    Tier and what it sees      fetters and saboteurs, complexes, hyper,
                               everything plus practitioner
    Patterns this month        unique ground opened against the allowance
    Reruns                     free, always, stated on the surface because
                               it is the thing that makes the meter fair
    The gift                   100 of new ground, then it reverts

The pain map and the tools are on all four tiers (`DECISIONS.md:24`), so the
sheet says what a tier does not restrict as well as what it does.

Open: tier one is 400 a month or 100 a week, both were said
(`DECISIONS.md:187`). And whether a pattern is a statement or a card
(`DECISIONS.md:52`), which moves the allowance by a factor of two hundred.
Neither can be rendered as a number until they are ruled.

**Notifications.** In scope per `CLAUDE.md`, for ritual accountability. Per
channel, opt in, never on by default, with quiet hours. Open, and it touches
the one file rule: whether push may add a second file
(`DECISIONS.md`, still open).

**Data.** `DECISIONS.md`, the data ruling. The strongest ruling in that file
is that the data is never sold, and a promise that strong belongs where the
person can read it, not only in a repository. Rows: the promise in one
sentence, that the record and the story are never held together, export,
and delete. Records off device mean a controller exists and access, deletion
and breach obligations attach (`CLAUDE.md`), so delete is a real control with
a real confirmation and not a mail to address.

## 4.3 What does not go in this sheet

The intake, because it has a tab. Anything editable that already has an
editor. The reading itself beyond the five summary rows, because that is
Summary's job. A settings sheet that grows a second copy of another surface is
the duplicate problem in section 2 wearing a different hat.

---

# 5. What is missing

Surfaces the architecture implies and the code does not have. Ordered by how
much of the built product is wasted without them.

**1. A home, or a first screen.** `setTab(TAB.FIELD)` at `ui/ui.js:432` drops
a new person onto the densest instrument in the product with 112 segments, two
rails, five quotients and no statement of what they are looking at. There is no
surface that says what this is. Help section B is half of the fix and a first
run screen is the other half. The UX skill measures 57 to 71 simultaneous
choices per screen against a working memory of about four, and the first screen
is where that bill comes due.

**2. The cosmological surface for the actual person.** Section 1.6 item 1. The
engine is built, tested and correct, and the only people who can see it are
nine fixtures. The fix is two calls: `spiritualOf(CURP.who.born)` in
`renderSpirit`, and the same in `converge`. What is genuinely missing is the
place gazetteer (`astro.js:144`, nine cities) and a place input that resolves
to a latitude, a longitude and a daylight saving rule. Without that the
ascendant is permanently null for everyone who is not a fixture.

**3. Undo.** Named in `CLAUDE.md` as the largest remaining gap and in the UX
skill as rule 5. Architecturally it is a surface, not only a function: it needs
a place that says what is about to be baked in, and a window afterwards that
says it can be taken back. Applying a story (`storyui.js:29`), running a
release (`release.js:31`) and the demo decay (`personas.js:239`) are three
irreversible writes with no shared surface between them.

**4. The ladder and the firsts.** Section 1.6 items 3 and 4. Computed,
persisted, and invisible. This is the product's whole account of progress and
it has no surface.

**5. The ritual log.** `CURP.rituals` is written and never read
(`ritual.js:70`). `DECISIONS.md` names the accountability tracker as a tool not
yet in the app, and the log is its data. One list, in the profile sheet or its
own section, closes the loop that the builder already opens.

**6. An import control.** The boundary is built and hardened
(`schema.js:130`), the atomic import is built (`schema.js:310`), the error
reporter is built (`schema.js:324`), and there is no button. Export without
import is a one way door.

**7. A place for the two prose pointers that have no link.** "Answer them in
Intake" (`analytics.js:157`), "Three questions would replace the guess"
(`drills.js:83`), and "Deal again, or open the release to commit it"
(`games.js:202`) where no release control exists on that surface. Three named
destinations with no door, which is rule 6 of the skill inverted.

**8. A dismissal contract for the three overlays.** Section 1.3. Escape and a
backdrop click, on `#rel`, `#rit` and `#deck`, and clearing them in `setTab`
so an open card cannot float over another tab.

**9. The accounts surface set.** None of it exists, and each needs designing
before building, per `CLAUDE.md`. From section 4.2: sign in and its failure
state, the key, the practitioner grant list and its grant flow, the tier and
allowance rows, notification preferences, delete. Plus one surface `DECISIONS`
implies and section 4 cannot hold: a practitioner's own panel, listing clients
down the right side (`DECISIONS.md:121`), which is a different application
wearing this one's chrome and should be named as such before anyone starts it.

**10. The developer analytics view.** `DECISIONS.md` puts it in scope and rules
that it must never ship to a person's build. Architecturally it is a MANIFEST
question, not a UI one, and it belongs on this map so it is not forgotten:
either a separate build from day one or a tab stripped at build time, and that
is open.

**11. A paywall surface.** In scope per `CLAUDE.md`. Nothing exists. It cannot
be designed until the pattern question is ruled (`DECISIONS.md:52`), because
the price is per pattern.

**12. Seven of the 3C tables and the pain value.** Section 1.6 items 7 and 8.
Smaller than the rest, and the cheapest to close: the Knowledge cards section
already has the shape, and three more rows finish it.

---

# 6. The brief update

Proposed replacement text for the sections of `/home/user/MOB/CLAUDE.md` that
are now out of date. Nothing has been edited. What follows is for the owner to
read and then land.

## 6.1 Replace the opening paragraph

It currently says "no network, no backend, no accounts", and the fork section
further down contradicts it. Proposed:

> A somatic diagnostic instrument. One HTML file, no dependencies. A person
> records a story, the engine reads charge out of it, and the app renders where
> that charge sits in the body and what it costs. The fork to accounts is
> called, so the app will gain network at exactly one seam. Until it does,
> everything is local and the file has no backend.
>
> `source.html` is a BUILD PRODUCT. Never edit it. Edit `atuned_src/` and run
> the build. The same goes for `engine.js`.

## 6.2 Replace the gate counts under "Before you commit"

The four numbers are stale. Measured today, from the repository root, with
`NODE_PATH` pointing at the playwright install:

>     ./atuned_src/BUILD.sh              parse checks, div balance, no em dashes
>     ./atuned_src/BUILD-engine.sh       and asserts the engine is host free
>     node tests/engine.js               338, headless, 0.1s
>     node tests/functional.js           298, real Chromium
>     node tests/collide.js              40, no overlapping nameplates
>     node tests/design.js               17, one expected environmental failure
>
> 693 user visible strings are under `python3 tools/terms.py`.

## 6.3 Add to "Rules learned the expensive way"

Two rules the tree now teaches and the brief does not carry.

> **The rails are the app. The tabs are a stage.** `setTab` swaps the centre
> and hides the canvas (`ui/panels.js:69`). Both rails, the status region and
> the 17 drill renderers are present on all eight tabs, and `#rdrill` is the
> one detail surface every one of them writes into (`ui/drills.js:22`). A new
> surface belongs in an existing rail section or as a drill, and a new tab is
> the expensive option. Nothing in the interface tells a person this, which is
> its own defect and is in `DESIGN-ia.md`.
>
> **A hover title is not an explanation.** Every definition in the product
> lives in a `title` attribute, which a touch screen cannot reach. Six of them
> have no other route at all, including the four depth texts, which are the
> product's account of its own main instrument. New copy goes on a surface, in
> a drill, or in the help sheet. A tooltip may repeat what one of those says
> and may never be the only place it is said.

## 6.4 Replace "Open, and whose call", first paragraph

The "Decided this round" list is now built and reads as though it were pending.

> **Built since that round.** The strong default on the intake rather than a
> hard gate. The Intake tab, with every question in the centre and out of the
> left rail. The third theme, Punch. The pattern catalog, ported whole into
> `engine/data/cards.js` with every sentence the owner's. The two games. The
> knowledge base, eleven sections over the engine's own tables. The record. The
> marker ladder and dated firsts in the engine. The shell: three density steps,
> a profile sheet and a help sheet on one `#sheet` surface
> (`ui/panels.js:220`).
>
> **Still open and still his.** The format ruling on the situational questions
> modelled on the Ultima virtue dilemmas. Whether a pattern is a statement or a
> card, which moves the price by a factor of two hundred. Six channels or nine.
> Which side runs first. All three are in `DECISIONS.md` and the meter follows
> whichever way they go.

## 6.5 Add to "Mine to build when asked"

> - **The word tier.** It means four things: the coherence band, the
>   compounding layer, the practice depth, and the paid plan. The accounts fork
>   needs it for the last of those and cannot have it while three other things
>   hold it. `DESIGN-ia.md` section 2.5 names the replacements. This has to be
>   settled before the paywall is built, not after.
> - **The cosmological layer is unreachable for a real person.** `renderSpirit`
>   and `converge` read the nine entry `BIRTH` fixture table, and `BIRTH.You` is
>   null, so a birth date typed into Intake is stored and never read.
>   `spiritualOf` exists to close this and is called from nowhere. The
>   gazetteer is also nine cities, so the ascendant is permanently null for
>   anyone who is not a fixture.
> - **The ladder and the firsts have no surface.** Six markers, the gift of
>   100, and every dated first are computed, persisted and invisible.

## 6.6 Replace the "Records" section

It lists nine documents and the tree holds fifteen.

> `MILESTONES.md` is the sequenced plan, scrubbed by five disciplines, and it
> records what each milestone unlocks and what must be decided before it
> starts. `TASKS.md` is the single backlog. It merges the technical items with
> the review feedback so there are not two competing lists. Read it first.
> `DECISIONS.md` is what the owner has ruled, including the tier ladder, the
> snippet privacy boundary, the practitioner model and the data promise, with
> the open items named as open. Read it before proposing anything it already
> settles.
>
> `DESIGN-ia.md` is the information architecture: every surface, what it
> contains, what it links to, where a person enters it, the naming scheme with
> one canonical word per concept, the help and profile sheets specified, and
> what is unreachable. Read it before adding a surface.
> `DESIGN-mobile.md` and `DESIGN-mobile-icp.md` are the phone work.
> `RESEARCH-icp.md`, `RESEARCH-ladder.md`, `RESEARCH-analytics.md` and
> `RESEARCH-sources.md` are the evidence behind the funnel, the ladder, the
> measurement plan and the citations.
>
> `STABILITY.md` is the measured snapshot behind the technical half of the
> backlog. `FEEDBACK-alexander.md` is a review session with numbers attached,
> and it separates what can be built in one file from what needs a backend this
> project does not have. `FEEDBACK-log.md` is one entry per piece of feedback
> that moved the product. `REVIEW-source.md` is the original review and the
> rebuild. `REVIEW-pass2.md` is the second engineering pass. `tests/README.md`
> explains the gates. `BOOK-ERRATA.md` is every place the codex and the engine
> disagree, with the line number and the quotation, and which of the two should
> move.

---

## Appendix. The route table

Every surface, and the shortest route to it from a cold start.

| Surface | Route |
|---|---|
| Field wheel | default on load, `ui/ui.js:432` |
| Any of the 112 addresses | Field, tap a segment; or Knowledge, Addresses, a row |
| The four depths | Field, the sub bar |
| Intake, 63 questions | tab bar |
| The seed | Intake, Who this is |
| Journal | tab bar, Story |
| Imprint cloud | Story, right column |
| Energy figure, 7 layers | tab bar, Energy |
| Pain regions | Energy, Pain layer |
| Analytics bubbles | tab bar, Analytics |
| The record, A against B | Analytics, scroll to the bottom |
| Identification interval | Analytics hero; also the Field rail accuracy block |
| Summary, 5 lenses | tab bar |
| Spiritual overlay | Summary, and only for a reference persona |
| Knowledge, 11 sections | tab bar |
| Printed protocol cards | Knowledge, The cards |
| The two unmatched axes cards | Knowledge, The cards, marked unmatched |
| The 76 laws | Knowledge, The 76 laws |
| Glossary | Knowledge, Glossary |
| Letting Go Deck | Knowledge, bottom, Deal a card |
| Games | tab bar |
| The letting go run | Games, first tab, Deal twenty four |
| The match | Games, second tab |
| Release run | right rail, Run a release; or Story, select pills, Release |
| Ritual builder | **only** after a release completes, Build a ritual |
| Profile sheet | top bar, the person icon |
| Help sheet | top bar, the question icon |
| Density | top bar, or the profile sheet |
| Theme, legible | top bar only, and neither persists |
| The matrix, 171 cells | left rail, The matrix |
| The 21 laws as inputs | right rail, 21 laws of integrity |
| The 9 axes as inputs | left rail, Child fetters |
| The selection drill | anything with data, anywhere |
| The marker ladder | nowhere |
| Dated firsts | nowhere |
| Saved rituals | nowhere |
| Import | nowhere |
| Your own birth chart | nowhere |
