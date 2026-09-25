# Screen structure and information architecture

Section owner: UI UX architecture. Layout, hierarchy, flow, and the reason for
each, surface by surface. Static tokens (colour, type, radii) and motion are
covered by other sections of this brief and are only mentioned here where they
decide structure.

## 0. How to read this section

**What this is built from.** Every claim was read from `atuned_src/` (the
source the single file build is concatenated from), the shell markup in
`atuned_src/shell/body.html`, the stylesheet in `atuned_src/shell/head.html`,
and the design rationale documents at the repository root (`DESIGN-*.md`).
Where a document and the code disagree, the code is described as built and the
document is described as proposed, with both cited.

**The build it describes.** Commit `1c021f4`, `source.html` md5
`26ff48bd4f111fa1dcd90822d6c62778`, read on 25 September 2026. Every count in
this section was taken off that build in Chromium 1194 at 1600 x 1000 and
390 x 844, with the counting rule in `proto/nav/count.js` (an element counts
when it is interactive, enabled, and has a box on screen; nothing inside a
closed accordion or closed menu counts; the header of a closed accordion counts
once). Two profiles: the blank first run profile, and Derek (a loaded reference
profile, loaded through `loadP`). **Read the counts off a run before quoting
them.** This repository has been bitten more than ten times by a number typed
into a document that the product then grew past. Treat every figure below as
dated.

**Status labels, used throughout.**

| Label | Meaning |
|---|---|
| BUILT | In `atuned_src/` at the stamped build. Reproduce it. |
| RULED | The owner has ruled it, it is recorded in `TASKS.md`, `CLAUDE.md` or a design doc, and it is not built yet. |
| PROPOSED | A design document specifies it. The owner has not ruled. Do not treat as settled. |
| OPEN | Explicitly the owner's call and unresolved. Do not guess. |

**Naming.** A surface is named by what the tab bar prints. Identity is the
`TAB` integer in `atuned_src/engine/core.js`, never the position. Code paths are
given so the port team can check intent against source they do not have access
to by asking this team.

---

## 1. The product in one structural model

### 1.1 What a person hires it for

A person does not hire this product "to see data". The job, in the words the
owner and the reference profiles keep returning to:

> Show me what is running me, where it sits in my body, what it costs, and give
> me a way to put it down. Then show me it moving.

Everything on screen serves one of five sub jobs, and the nine tabs map onto
them unevenly:

| Sub job | Where it is served | Tabs |
|---|---|---|
| Put something in | the journal, the questions, the four doors | Story, Energetics |
| See what the instrument read | the wheel, the body, the compass, the prose reading | Field, Body, Compass, Summary |
| Understand a word | the codex, the drill panel | Knowledge, every drill |
| Act on it | the release run, the ritual | Story (release panel), Ritual, the rail button |
| Practise at low stakes | two games | Games |

### 1.2 The content chain (RULED, 20 September, and the spine of the flow)

The owner's words, recorded in `CLAUDE.md`: what a person enters in the journal
is added to the imprints. Part of that becomes a story they have to release.
Part becomes a practice inside the ritual. Sometimes it becomes an affirmation,
also in the ritual.

Mapped onto surfaces as built:

```
Story (journal textarea)
  -> sniffer parses on every keystroke, marks words in seat colour     BUILT
  -> Commit applies charge to the nine axes, writes a story entry      BUILT
  -> imprints cloud on the right of Story (held / filled in / pending) BUILT
  -> release run over selected or heaviest addresses (#rel overlay)    BUILT
  -> "Build a ritual" at the end of a release opens the ritual builder BUILT
  -> ritual picks ONE practice from the track the heaviest seat maps to BUILT
  -> a practice or affirmation cut from the person's own sentence      PROPOSED (DESIGN-gamification.md s5, DESIGN-container.md "lift")
```

The last link is not built. Today the practice is chosen from a fixed table by
seat, and nothing lifts a line of the person's own writing into the ritual.
`DESIGN-container.md` specifies "Lift": one line, acknowledged by the person,
moved into the ritual, and the only words that ever leave the journal.

### 1.3 The loop: discover, play, flow, embody (RULED, a circle, never a list)

Ruled 20 September: the process is discover, play, flow, embody (corrected by
the owner from "body"), and anywhere the four appear together they close,
because "we're showing a core game loop mechanic" and a numbered column of four
says the fourth is the end.

**Where it is rendered today: nowhere in the build.** `grep` across
`atuned_src/` finds no loop drawing and no use of the four words together. The
loop is drawn only in prototypes:

| Where | What it draws | Station mapping |
|---|---|---|
| `proto/onboard/onboard.html` | a ring that is the onboarding progress indicator; each Next turns it a quarter; the fourth press closes it and sweeps back to discover | discover = Story, play = Field, flow = Ritual, embody = Body |
| `proto/ladder/index.html`, `proto/ladder/turn.js` | four arcs with gaps and no arrowhead, one closed circle is one "turn", a solar ring at the centre | discover (3rd Eye seat) write an entry; play (Sacral) take the ritual; flow (Root) mark it done; embody (Heart) the next reading |
| `DESIGN-gamification.md` s4 | a table, not a drawing | discover = journal; play = release and ritual; flow = keep the day, the record; body = the next reading, awards, avatar |

**The station to surface mapping is OPEN.** `DESIGN-onboard.md` s4 records the
collision: the gamification table puts the ritual and the record at two
stations, so a person finishing the tour can name three doors, not four. Both
documents are the owner's. The port should build the loop as a component that
takes its station to surface mapping as data, and should not hard code either.

**Structural rules the loop carries whichever mapping wins:** it is drawn as a
closed ring; position is angular, never ordinal, never "2 of 4"; it lights one
station at a time rather than showing four labels at once (a static four label
diagram was tried in `proto/onboard/` and rejected as four simultaneous items
against a working memory of about four); and the count it produces is a count
of turns completed, never printed against a total.

### 1.4 The avatar as centrepiece (RULED in principle, NOT BUILT, placement OPEN)

`CLAUDE.md`: "What is Atuned? Your avatar." Not a page in the product, the
centre of it. A person watches their avatar improve, driven by releases and by
going round the loop. The layers are sewn: avatar to ritual, ritual to psyche,
psyche to body locations, body to story.

**What exists in the build is a text drill, not a figure.** `runAvatarDrill`
in `ui/drills.js` writes into the right rail's Selection panel: a heading "Who
you are becoming", two paragraphs, a list of stated pairs (best self, and the
same attribute on a bad day), a button to the purpose map. It is reached from
the fourth of the four doors and nowhere else. There is no avatar drawing
anywhere in the product (`DESIGN-avatar.md` s1: "no canvas, no SVG, no arc").
Nothing in the UI can write an avatar pair; the field is only filled by an
imported record.

**What is ruled and not built** (`TASKS.md` 0o, AV1 to AV4, KU1 to KU3; AO2
and AO3):

- The app opens on the avatar, and the avatar is a dashboard that reads across
  every tool. This reverses the 19 September ruling (Field), which reversed
  Summary. **The build still opens on Field**, and `TASKS.md` carries a later
  "waiting on him" question asking whether the avatar replaces the Field or
  sits beside it. Treat the opening surface as OPEN between Field (built) and
  Avatar (ruled, unbuilt).
- The kundalini rise is the avatar's progress bar: a channel snaking root to
  crown through the seven seats, showing how far it has risen, where it is
  blocked, and the starting point. The arithmetic is specified and prototyped
  in `proto/avatar/rise.js` and `proto/avatar/dash.html` (per seat
  transmission from each address's conductivity `n.open`, multiplied root
  first so a shut root throttles everything above it; `DESIGN-avatar.md` s17).
- Summary and Ritual are "the sticky parts" of the dashboard, each a door to
  its own page; "what is improving" is on it, never "what is wrong".
- The starting point must be stored once, the first time `compute()` returns
  a reading (`avatar.rise0`, `DESIGN-avatar.md` s19), or rising cannot be
  shown.

**What is OPEN about it:** body, light or diagram (the three prototypes in
`proto/avatar/`; the design team recommends the armature, a body reduced to a
spine and seven seats, with no face, mass, sex or age); whether it ever shows
that things got worse (the recommended answer keeps the drawing append only
and puts the weather, which can fall, on a gauge beside it); whether a stated
pair reorders the release queue.

**The honesty rule the port must keep whatever is built:** the figure is drawn
from dated facts that can only accumulate (addresses a release has touched,
addresses emptied, seats reached, runs done). The reading, which can fall, is
never the same mark as the record. `DESIGN-avatar.md` s5 argues this from
Wii Fit and orthosomnia: an avatar that gets prettier as a person gets less
distressed tells them they are worth more on a good day.

---

## 2. The shell: persistent chrome present on every surface

### 2.1 The principle the layout rests on

**The rails are the app and the tabs are a stage.** (`DESIGN-ia.md` 1.1 and
6.3.) Both rails, the top bar, the status region and the one detail panel are
present on every tab except Settings. `setTab` only swaps what is in the centre
stage and toggles the sub bar. The consequence for the port: a new capability
belongs in a rail section or a drill first, and a new tab is the expensive
option.

The owner's zone ruling (`TASKS.md`, "Screen zones"): top, bottom, left and
right each need a logic, so the areas around the centre carry at a glance
information worth having. As built, the logic is:

| Zone | Logic | What lives there |
|---|---|---|
| Top | where you are, how to leave, what you can change globally | wordmark, the nine tab doors, status line, profile picker, undo pair, lighting, help, account |
| Sub bar (second row) | the controls for the current hero graphic only | Field depths, Body layers and pain regions |
| Left rail | what you are made of, as inputs | orientation, balance, blueprint, archetypes, the nine axes as sliders, birth derived states, the matrix |
| Centre stage | the one surface the tab is for | the hero graphic or the page |
| Right rail | what the instrument reads, and the answer to whatever you just pressed | coherence line, the reading, Selection (the drill host), flow, what is running, the 21 laws as sliders, Run a release |

The help sheet states the same model to the person in one sentence: "The wheel
is your field. The rail on the left is what you are made of, the panel on the
right is what the instrument reads. Everything on either side is a door into
the same detail." (`helpSheet`, `ui/panels.js`.)

### 2.2 Page frame, desktop

```
.app  fixed, inset 0, flex column, gap 10, padding 10
 +-------------------------------------------------------------------+
 | .glass.top  top bar, one line, does not wrap on desktop            |
 +-------------------------------------------------------------------+
 | .glass.subbar  only when body.hassub (Field and Body)              |
 +-------------------------------------------------------------------+
 | .mid  grid: 302px | 1fr | 336px, gap 10, fills the rest           |
 |  +---------+  +-------------------------------+  +-----------+     |
 |  | left    |  | .stage (centre)               |  | right     |     |
 |  | rail    |  |                               |  | rail      |     |
 |  | panel,  |  |                               |  | panel,    |     |
 |  | scrolls |  |                               |  | scrolls   |     |
 |  +---------+  +-------------------------------+  +-----------+     |
 +-------------------------------------------------------------------+
#bgaura  a fixed canvas behind everything (the shadow weight wash)
```

- Each rail is a single scrolling panel (`.panel.sc`, `overflow-y:auto`,
  `overflow-anchor:none`). The centre stage does not scroll as a whole on the
  instrument surfaces; the page surfaces (Energetics, Knowledge, Summary)
  scroll inside their own host.
- On Settings (`body.tab-settings`) the grid collapses to one column and both
  rails are removed (`display:none`). This is the one surface without rails,
  and it is deliberate (section 4.10).

### 2.3 Page frame, phone (below 1180 wide) as BUILT

- The grid goes to one column in the order **stage, left rail, right rail**
  (`.stage{order:-1}`). The page scrolls; the rails do not collapse, they
  stack below the stage at full length.
- The top bar wraps below 820. At 390 the chrome above the stage measured 320
  pixels on the Field (the top bar alone wraps to several rows).
- Absolutely positioned surfaces (`.iq`, `.emap`, `#cone.tabmode`,
  `#rit`) are released to static flow so they are not clipped.

**The consequence, measured on this build at 390 x 844, blank profile, Field:**
the stage begins at y 320, the wheel canvas at y 375 (374 x 335), and the
right rail's "Where to start" block, which carries the four doors, sits at
**y 3066**, three and a half screens below the fold, behind the entire left
rail. On a phone, the opening screen has no visible way in. See section 3.

The phone composition is not a separate design and must not become one.
`DESIGN-mobile.md` s3 rules one build, two compositions, one boolean
(`body.phone`, set from `(max-width:720px) and (pointer:coarse)`), no user
agent sniffing, no third layout mode. The phone composition itself (bottom
navigation, sheets, one object per screen) is PROPOSED, in two versions that
disagree (section 6.3).

### 2.4 The top bar, in document order (BUILT)

The bar is written into the document, not generated by script. Ruled after
three failures in which a script that stopped early took the navigation with
it. Start up only wires handlers onto buttons that already exist.

| Order | Element | Behaviour | Why it is there |
|---|---|---|---|
| 1 | Wordmark "Atuned" (umlaut drawn as two dots) over "Source OS" | a button; goes to Field | home is where the app opens |
| 2 | `#tabbar`, nine doors, each `data-tabk` = the TAB integer | `setTab(k)`; `aria-pressed` read off each button's own integer | the bar is `TABDEF` and a gate proves the markup and the table agree |
| 3 | `#status`, `role=status aria-live=polite` | the one status writer for the whole app; failures persist, confirmations clear after 2.4 s | every write that can fail reports here; a control never claims success first |
| 4 | spacer | | |
| 5 | "Profile" label and `#psel` select | switches between the person's record and reference cases | a demo control; every design doc says it leaves the bar when sign in lands |
| 6 | `#histpair`, back and forward arrows | hidden entirely when both stacks are empty; the action is named in the accessible name and tooltip, not printed | ruled "just the arrows" so neighbours do not shift as the label changes |
| 7 | Lighting menu button, names the current lighting | opens a menu of seven lightings; closes on choice, backdrop, Escape | a set once setting does not earn seven permanent slots |
| 8 | Help (question mark icon) | opens the help sheet | |
| 9 | Account (person icon) | opens the Settings surface | Settings has no door in the bar |

At 1600 the bar is 14 simultaneous choices. The tab strip scrolls horizontally
inside itself when it cannot fit, with a 26 pixel fade that is only drawn while
something is actually past the edge (`paintTabEdge`). `DESIGN-nav.md` measured
that at 1280, a normal laptop, three doors (Knowledge, Games, Summary) are past
the edge.

### 2.5 The sub bar (BUILT)

`#subbar` holds three rows and shows whichever the current surface owns; it is
hidden when neither Field nor Body is active (`body:not(.hassub) .subbar`).

| Row | Surface | Contents |
|---|---|---|
| `#vbar` | Field | four depth buttons with ring icons: Charge, Patterns, Chains, Blueprint |
| `#zoomnote` | Field | a quiet line saying what zoom has resolved: "zoom resolved chains · the core is showing the seven seats · the shell is showing every fetter named" |
| `#lbar` | Body | seven layer buttons, each with its count: Fetters, Saboteurs, Complexes, Hyper, Masks, Pain, Flow |
| `#rbar` | Body, Pain layer only | Region: All plus nine body regions |

Why a sub bar at all: the Body layer buttons used to float over the figure,
and when raised to the 44 pixel floor they wrapped to two rows and covered the
head and throat. "A control that hides the thing it controls is not a control."
The sub bar is the one place a hero graphic's controls live, so the graphic
gets its whole box.

PROPOSED (`DESIGN-nav.md`): the sub bar becomes the second row of a two level
navigation, left aligned with the first door rather than under the wordmark
(measured 111 pixels apart today). Not built; the gutter function is specified
there.

### 2.6 The left rail (BUILT)

Four folding sections. Any number may be open at once (ruled; it was one per
rail and that prevented comparing the blueprint with the axes being set).
Pressing a header scrolls that section to the top of the rail, in both
directions, so the movement is the same every time. The rail carries a tail of
empty space below its last section so that move can always complete.

```
Awareness                              open by default
  0 · Orientation   benign against malignant, a bar that grows from the centre
  1 · Balance       masculine left, feminine right, a bar from the centre,
                    a pill with the percent; a button that opens the reading
  2 · Root domains  four buttons: Architect, Engine, Weaver, Witness
  3 · Blueprint domains   19 icon buttons, caption line under
  4 · Primary       12 archetype icon buttons
      Secondary     12 archetype icon buttons, caption line under
Child emotions
  4 · Child emotions   (label numbering repeats "4"; as built)
  two bulk sliders: held, opposite (set all nine at once)
  nine held fields and nine "toward <opposite>" fields, each a track + number
States                the birth derived readings (sun, moon, rising, year
                      animal, life path, design profile and gates, gene key),
                      or one line saying what birth data would unlock
Matrix                19 domains across by 9 child emotions down, 171 cells,
                      brightness is charge held, each cell opens a drill
```

**Grids are fitted, not auto filled.** The icon grids take the most columns
that fit at the 44 pixel floor, then the fewest columns that still fit in that
many rows, with the row height pinned so cells become rectangles rather than
growing taller (`fitGrid`, `ui/panels.js`). Reason: auto fill left a ragged
last row twice in the Awareness section, and the naive fix grew the rail by 81
pixels to close a hole.

**The left rail is the largest single cost in the product.** It is 52
simultaneous choices on every surface except Settings, at both widths, with
only Awareness open. `DESIGN-nav.md` s4: "The next move on cognitive load is
the left rail, not the bar."

### 2.7 The right rail (BUILT)

One pinned line, then five folding sections, then one button.

```
#railtop (pinned, always true)
  coherence ring, the tier word as a button, one plain sentence defining it
Reading                                  open by default
  #start    "Where to start" and the four doors, ONLY while nothing is read,
            and never on Summary (Summary carries them in its centre)
  #person   You (or the reference case name), archetypes as three rows,
            domains, then Carrying / Filled in / Heaviest / Most shut
  #stack    five tabs with glyphs: Child emotions, Saboteurs, Complexes,
            Hyper, Character; the child emotions tab shows held and opposite
            for all nine, the others list what is running at that layer
  #rows     Instruments: integrity, intention, pole in, overshoot, distortion,
            each "of 10"
Selection
  #rdrill   THE detail panel. Every drill in the product renders here.
  #rdrill-none  "Nothing selected. Click an address, a law, a saboteur or the core."
Flow
  #eshelf   the Body page's shelf (only displayed on Body)
  #run      up to four cards of what is running, heaviest first
Running
  #fire     up to eight named patterns with weights, each a drill door
Moral integrity
  one bulk slider "all", then 21 law fields (track + number)
[Run a release]  the one primary button, bottom of the rail
```

Why the pinned line: the rail used to be nine unlabelled blocks in one scroll
and the reading alone was 860 pixels, so clicking a node put the answer 668
pixels down, below the fold, with nothing on screen saying anything had
happened. One line stays pinned and always true; everything with detail folds.

**Each surface opens the rail sections it is about, once per session**
(`WANT` in `setTab`): Field opens Awareness and Reading; Body opens Flow and
Running; Compass opens Reading. Once, not every visit, "because a person who
closes a section has closed it, and a tab that reopens it on every visit is
arguing with them."

### 2.8 The one detail surface: the drill (BUILT)

Every element in the product that carries data opens a drill, and every drill
renders into `#rdrill` in the right rail through one shell (`rdShell`,
`ui/drills.js`). There are more than thirty drill renderers (address, law,
saboteur and the rest of the chain, the core, a gate, each quotient, balance,
flow, a seat, a child emotion, a domain, a card, a mirror axis, a matrix cell,
a birth reading, a numerology number, the avatar, the purpose map, nine
sentences, year by year). One renderer, many entrances, which `DESIGN-ia.md`
calls the best piece of architecture in the product.

Structure of every drill, top to bottom:

1. A sticky back control at the top naming where it returns: "Back to the
   field", "Back to the knowledge". Ruled after "If I click, how do I get
   back?" The old close sat at the bottom of long drills.
2. An eyebrow (what kind of thing this is), a name, an optional sub line.
3. Labelled blocks, each an eyebrow over prose, rows or chips. Rows of
   addresses are themselves buttons that open the address drill.
4. A Close button at the bottom as well, for a person who read to the end.

Escape closes. Opening a drill unfolds Selection beside whatever was already
open. It scrolls the Selection section into view **only when the rail is
beside the stage**; when the rail is stacked under the stage (every phone) it
does not move the page, because that scrolled a person four thousand pixels
away from the thing they pressed (measured, and the reason the check reads the
rail's actual position at run time rather than a typed width).

Eyebrow casing is decided once for every drill on the way in (`rdCase`): a
string of four words or fewer with no internal punctuation is a label and
takes the title case transform; anything else is a statement and stays in
sentence case.

PROPOSED (`DESIGN-knowledge.md`, "the centre as the destination"): a drill
opened from Knowledge renders in the centre instead of the rail (the answer
goes from 298 to 884 pixels wide at 1600). Not built; `rdShell` still writes
only to `#rdrill`. If it is built it must write to `#knowbody` and never to
`#know` (section 4.7).

### 2.9 Overlays and sheets (BUILT)

These are not tabs and are not in `TABDEF`. `setTab` does not close them.

| Host | What | Opened from | Closes |
|---|---|---|---|
| `#rel` | the release run (four phases) | Run a release in the right rail; Story release panel; Story imprint selection; Summary "Run a release" card | Cancel, Done, Stop |
| `#rit` | the ritual builder as a modal | the end of a release ("Build a ritual"); Summary "Open it"; the ladder's control | Close. On the Ritual tab the same host is the surface (section 4.2) |
| `#deck` | one dealt card from the Letting Go Deck | Knowledge, "Deal a card" | Close |
| `#cone` (modal mode) | the compass as a sheet over the current surface | a drill door | its Close button. On the Compass tab the same host is the surface |
| `#sheet` | help, and the four compose forms (question, bug, rating, feedback) | Help button; Settings > Help | backdrop, Escape, Close |
| `#ob` | onboarding | Settings > Account > "Run the signal test again". Automatic open is OFF (`OB_AUTO=false`, ruled 20 September "turn off onboarding for now") | Escape, "Not now", "Go in" |
| `#boot` | the boot sequence, a spine and seven seats drawn in order, then the ring | page load | removes itself at about 5.3 s; any press or key skips it and the skipping press is swallowed so it does not also press the app |
| `#probe` / TIP | the one tooltip: anchored panel with a tether on a fine pointer, a sheet on a coarse pointer | hover with 380 ms intent, tap on touch, focus | Escape, tap elsewhere |

Two dismissal contracts coexist (the sheet closes on backdrop and Escape; the
release and deck overlays close only by their buttons). `DESIGN-ia.md` 1.3
flags this and it is not fixed.

### 2.10 What must survive the port, structurally

1. `TAB` integers are identity and never renumber: STORY 0, SUMMARY 1, FIELD 2,
   ENERGY 3, ANALYTICS 4, INTAKE 5, KNOW 6, GAMES 7, COMPASS 8, SETTINGS 9,
   RITUAL 10. They are persisted and compared. New surfaces are appended.
2. `TABDEF` is display order and may be reordered freely. Anything needing a
   tab's entry looks it up by `.k`, never by position (`TABOF`).
3. `TABEXTRA` holds surfaces with a host, a class and a renderer but no door
   (Settings). `TABOF` reads both tables; `setTab` clears body classes from
   both, because clearing from one left `tab-settings` on the body and hid the
   right rail on every tab until reload.
4. `TABREAL` maps a folded surface to the tab that carries it (Analytics 4 to
   Summary 1). Every caller of `setTab` goes through it, so a stored tab from an
   older session resolves to its carrier rather than to the first entry.
5. **A tab host that carries a folded surface cannot also be the render
   target.** `#sum` holds `#sumbody` and `#ana`; `sumRender` writes only
   `#sumbody` and `anaRender` only `#ana`. The first cut wrote the parent's
   innerHTML and deleted the child. `#know` holds `#knowbody` for the same
   reason, even though Games has since been unfolded.
6. The surface that prints a reading is emptied when you leave it, so a hidden
   surface never sits in the document asserting a stale reading about a
   profile that is no longer selected (`setTab` empties `#sumbody` and `#ana`
   on the way out of Summary).

---

## 3. The empty state: nothing read yet

### 3.1 Why it is a design and not an afterthought

Whatever renders on the opening surface renders to somebody who has entered
nothing. That is the lesson of the 19 September ruling, and `DESIGN-avatar.md`
s22 carries it forward to the avatar: "the empty state is the design".

The engine computes a full reading off defaults even for a blank profile
(coherence comes out at 36 off the default value of 6 on each of the 21 laws).
The product's ruling is that a reading is never invented and a percentage is
never printed off a default (`DESIGN.md` Law 5). So every surface that prints a
reading must check first.

### 3.2 The flag

`compute().unread` is true when nothing has been entered at all:

```
unread = (loaded.length === 0) && (measured === 0) && (under === 0)
  loaded    addresses carrying at or above the display line (SQ 4)
  measured  laws the person has actually answered in Energetics
  under     addresses carrying anything above zero but below the line
```

`under` is counted deliberately: with all nine axes at 3.9 the field has 107
addresses carrying below the line, and before `under` was counted Summary said
nothing had been entered while the release control offered to spend patterns
on those same addresses.

**Two edge cases the port must reproduce knowingly.**

- A person who has answered one law is "read" even with no charge at all.
- A person who wrote stories, never answered a law, and then released
  everything returns to `unread` true, which shows them the first run screen.
  `DESIGN-sheet.md` s12 records this: "the success condition of the whole
  product returns a person to the state of never having arrived." It is
  bounded in the shipping app (anyone who has answered a law stays read) and
  it is not fixed.

### 3.3 The four doors (BUILT)

When nothing is read, the product offers four ways in. They are defined once
(`STARTD`, `ui/component.js`) and drawn by one function so two copies cannot
drift. One delegated listener answers every copy.

| Door | Label | Line under it | Where it goes |
|---|---|---|---|
| story | Write what happened | The day, in your own words. The engine reads the charge out of it. | Story tab, focus in the textarea |
| nine | Read nine sentences | For anyone who cannot think of themselves as the problem. None of them is a diagnosis. | drill: nine first person sentences, one per circle of descent, each routing to a seat and its loaded addresses |
| ages | Go year by year | Three to eighteen. For anyone who cannot think of anything they identify with, which is most people. | drill: sixteen years, one question each, then a defend and care test |
| avatar | Say who you are becoming | The avatar. Release empties an address and replace fills it. This is what you are filling it toward. | drill: the avatar text surface |

Each door is a full width block button: bold name, a dim line under it. The
eyebrow over the set reads "Where to start" with a lead sentence ("Nothing has
been read yet. Four ways in, and none of them asks you to know anything
first.").

**Where the doors render, and the rule that decides it:** one set of doors per
screen. On Summary they are in the centre (`sumUnread`), and the right rail
copy is suppressed. On every other tab they are at the top of the right rail's
Reading section. They disappear the moment anything is read ("a call to action
that survives the action is furniture").

**Known structural weaknesses, measured on this build:**

1. On a phone the rail copy of the doors is three and a half screens below the
   fold (section 2.3), so the Field, which is the opening surface, shows a
   first time visitor no way in.
2. Three of the four doors write nothing. `PANEL-flow-1000.md` and
   `DESIGN-avatar.md` s1: the nine sentences and year by year keep only
   in memory state; the avatar door keeps nothing and cannot, because no UI
   writes a pair. Only "Write what happened" moves the reading.
3. The doors are text heavy (four headings plus four sentences plus a lead).
   The owner's onboarding rulings (no count of screens, far too much text,
   show do not tell) would push against this if applied here. Not ruled.

### 3.4 Per surface: what silences, what does not (measured on the blank profile)

| Surface | Silenced on unread (BUILT) | Still printed off defaults or empty data (as built, flag for the port) |
|---|---|---|
| Field | core number not drawn; CQ pill an en dash; vitality, awareness, will, flow pills an en dash; accuracy "not read yet" with an en dash; the compass marker number is an en dash and its range pill is not drawn; rail tier "not read yet" with its sentence; left rail orientation bar is an empty trough and the balance pill an en dash; gate rings always drawn with an en dash in their pill | DQ and SQ pills print "0.0"; the 21 law spokes on the wheel draw at the default value 6 (`DESIGN-integrity.md` rule three proposes an unread guard; not built) |
| Summary | the whole page becomes `sumUnread`: an empty coherence ring with an en dash, one sentence, the four doors, the spiritual layer (real or absent, because it comes from a birth date, not a default), numerology suppressed | the folded Analytics beneath still draws its bubble fields (masks at 0.0, domains and archetypes from the blueprint selection) under a sentence saying every figure is from the blueprint and not a reading |
| Energetics | coherence figure is an en dash, "no law measured yet"; "0 answered, 63 left" | nothing invented |
| Story | "You have not written anything yet. Whatever you write gets pulled apart and collected here."; release panel "Nothing is held above the line yet"; Run a release disabled | the From, Addresses and Pace controls still render (10 controls with nothing to act on) |
| Body | a layer with nothing in it is dimmed; the Pain layer opens blank by ruling and says "paint where it hurts"; "nothing carrying yet" | opens on the Masks layer because it is the first layer with a count (masks always count 6), so a blank person meets six rows at 0.0; the shelf prints Flow 100% ("nothing held") |
| Compass | ribbon and nodes not drawn; marker not drawn; the rail says "Nothing has been read yet. Write what happened, or answer the questions, and your position on this figure fills in." | the ladder prints "0 days, last run" |
| Knowledge | address rows print 0% and are styled as zero; the deck says "Nothing is held above the line yet, so the deck is empty" and Deal is disabled | **the Moral integrity deck prints 60% on every law off the default of 6**, which is Law 5's "never print a percentage off a default" broken on this build |
| Games | nothing claims a reading | the letting go run deals 24 cards off addresses carrying zero (it fills an under full deck from the heaviest addresses available, which for a blank profile is any 24) |
| Ritual | "Nothing on the record yet. Build one ritual and save it, and the first day is on." | **"The root is carrying the most, so the body track is what your state calls for"** is printed to somebody carrying nothing (the heaviest seat defaults to Root) |
| Settings | reads no reading at all (ruled out of Settings) | nothing |

The right hand column is not a list of rulings to copy. It is the list of
places the build has not caught up with its own rule. The port should apply
the rule, and treat each as a known defect rather than intended behaviour.

**The value empty glyph.** A value slot always keeps its shape; when there is
nothing to call it, it draws empty with an en dash rather than a sentence. The
full refusal ("not read yet, because neither side reaches 1") lives one door
away in the drill. Ruled after the balance slot printed "not enough held to
read" between the words masculine and feminine and the owner could not parse
the line.

---

## 4. The screens

Display order is `TABDEF` order: Energetics, Ritual, Story, Field, Body,
Compass, Knowledge, Games, Summary. Settings follows. The Field is the opening
surface as built, and it is the reference for the shell, so if you read one
screen first, read 4.4.

### Identity table

| Bar label | TAB key | Integer | Host id | Body class | Renderer | File |
|---|---|---|---|---|---|---|
| Energetics | INTAKE | 5 | `#iq` | `tab-intake` | `renderIntake` | `ui/intakeui.js` |
| Ritual | RITUAL | 10 | `#rit` | `tab-ritual` | `ritOpen` / `ritRender` | `ui/ritual.js` |
| Story | STORY | 0 | `#story` | `tab-story` | `stRender`, `impRender`, `stRelPanel` | `ui/storyui.js`, `ui/imprints.js` |
| Field | FIELD | 2 | `#cv` (canvas) | `tab-field` | `draw` / `drawWheel` each frame | `ui/wheel.js`, `ui/ui.js` |
| Body | ENERGY | 3 | `#emap` | `tab-energy` | `renderMap`, `renderShelf` | `ui/map.js`, `ui/mapshelf.js` |
| Compass | COMPASS | 8 | `#cone` | `tab-compass` | `coneOpen(true)` | `ui/cone.js` |
| Knowledge | KNOW | 6 | `#know` > `#knowbody` | `tab-know` | `kbRender` | `ui/knowledge.js` |
| Games | GAMES | 7 | `#games` | `tab-games` | `gmRender` | `ui/games.js` |
| Summary | SUMMARY | 1 | `#sum` > `#sumbody` | `tab-summary` | `sumRender` | `ui/summary.js` |
| (folded) Analytics | ANALYTICS | 4 | `#sum` > `#ana` | via Summary | `anaRender`, `recRender` | `ui/analytics.js`, `ui/record.js` |
| (no door) Settings | SETTINGS | 9 | `#settings` | `tab-settings` | `renderAccount` | `ui/account.js` |

### Simultaneous choices per surface (measured, this build)

Counting rule in section 0. "Seen" is the first viewport. Canvas targets are
not DOM elements and are **not** in these counts (section 4.4).

| Surface | 1600 total, blank | 1600 seen, blank | 1600 total, Derek | 1600 seen, Derek | 390 seen, Derek | centre only, Derek |
|---|---|---|---|---|---|---|
| Energetics | 119 | 80 | 115 | 82 | 15 | 34 |
| Ritual | 92 | 74 | 88 | 76 | 15 | 7 |
| Story | 103 | 85 | 132 | 105 | 20 | 51 |
| Field | 99 | 69 | 95 | 73 | 17 | 9 |
| Body | 105 | 64 | 105 | 68 | 18 | 0 in the stage, 7 in the sub bar |
| Compass | 106 | 78 | 102 | 80 | 22 | 11 |
| Knowledge | 221 | 123 | 218 | 125 | 24 | 127 |
| Games | 98 | 70 | 94 | 72 | 14 | 3 |
| Summary | 85 | 73 | 123 | 82 | 11 | 42 |
| Settings | 23 | 23 | 23 | 23 | 18 | 9 |

Fixed costs present on every surface but Settings: top bar 14, left rail 52,
right rail 15 to 32. That is 81 to 98 choices before the surface has put
anything in the centre. The standing target in the UX floors is under 12 on a
working screen against a working memory of about four. `CLAUDE.md` records the
standing problem as 57 to 71 (once 109); the counts above bracket and exceed
it. At 390 the first viewport is 11 to 24, low for a bad reason: on six of the
nine surfaces, 11 of the visible controls are the top bar and the product
below is off screen.

---

### 4.1 Energetics (TAB INTAKE, 5)

**1. The job.** "Measure how I actually act, and record the moment I was
born, so the reading is about me and not the defaults." Energetics is the only
place the 21 laws of moral integrity get measured, and the laws are most of
the coherence reading (coherence is intention times integrity over resistance,
and integrity is the 21 laws). Renamed from Intake on the owner's word: "a
person does not arrive to perform an intake, they arrive to have their
energetics read."

**2. Layout.** Centre host `#iq`, flex column, scrolls on its own
(`overflow-y:auto`). Rails present. Top to bottom:

```
[Who this is]                       either the full form or a one line sealed card
  why paragraph (the birth moment, triangulation, "If you do not know the time, say so.")
  field grid (auto-fit, min 168px): First | Middle | Last | Sex at birth
                                    Date of birth | Time of birth + "I do not know it" | Place of birth
  seed: Myers-Briggs select + a note spanning two columns (how much of the field is still the seed)
  [Save and close]  disabled until a name or a date exists; "This rolls up to one line. Edit reopens it."
[Top row]
  coherence figure (large) + "CQ from N measured" | progress bar (length = answered of 63)
  "N answered, M left · k laws measured, j still at the default · <tier>"
  profile select (profiles + "<name>, a worked example") | New | Save | Export
[Three panels, side by side; one column below 1180]
  Asked three ways | What a ten means | What accuracy looks like
  scale key: 0 never · 5 about half the time · 10 every time · about fifteen minutes, any order
  warning line: stories weight these answers later, so flattering answers get corrected
[Seven seat sections, Crown down to Root]
  section header: seat glyph, seat name, one line ("what you say", "what you stand on")
  law cards in a two column grid (one column below 1240), each tinted by its seat
    card header: law glyph, law name, score (when all three answered) or "N left" / "unanswered"
    closed and done: "spread X, <lean>"
    OPEN (one at a time): three framing cards side by side
       "Under cost" / "Unseen" / "Ordinary day", each question with an 11 button scale 0..10
```

**Why seven seat groups and not one list:** "Twenty one laws in one flat
accordion is a list, and a list is what the owner called boring. Grouped by
seat in body order it is a figure read top to bottom." The card frame takes
the seat colour so a person knows the band while answering, even when the
group header has scrolled away.

**Why the three framings are side by side:** the gap between the three answers
is the measurement. Stacked, one short question held a 900 pixel column and the
gap was never on screen at once.

**Why the sealed card:** a birth moment does not change. Once entered and saved
it rolls up to one line and names what is missing ("no time of birth") beside
an Edit control. A profile with nothing in it never rolls up, because a
collapsed empty card is a dead end on a first pass.

**Why "M left" and never "N of 63":** a count against a total reads as a score.
What is left is the useful half and carries no verdict. The bar is a length,
not a number, so it may carry the proportion.

**3. Empty and populated.** Blank: coherence figure is an en dash with "no law
measured yet", "0 answered, 63 left", form open, seed note says the four letter
type is optional and is the ego's account of itself. Populated: coherence from
the measured laws only, tier word appended to the progress line, sealed card,
finished law cards show their spread. Nothing here is printed off a default.

**4. Key interactions.** An answer button writes immediately, saves, re-renders
the surface and the whole reading (no submit). Identity fields write on change
and report through the status line. Seal and Edit. Seed select writes charge on
the nine axes (charge only; no law, gate or domain is written by it). The
profile switcher refuses to "switch" to a loaded reference case and marks it
"a worked example". Export copies the record to the clipboard.

**5. Loop and avatar.** Discover (input). Under the avatar design, the laws are
the "pegs": the only lever on a person's reach, because release cannot move
integrity (`DESIGN-avatar.md` s5 measures a quarter of releases moving one
profile 1.3 points of coherence against 3.3 for two points on three laws).
Doors in: Summary's "What moves the reading" card ("Answer the laws") when
release headroom is spent; Settings > Account > Identity ("Open Energetics").

**6. Cognitive load.** 119 total, 80 in the first viewport at 1600 on a blank
profile; 34 of those are in the centre. Mitigations built: one law card open
at a time (so at most 33 answer buttons, one law's three framings); the form
seals to one line. Not mitigated: 63 questions are the largest input task in
the product, and they sit inside the full shell with both rails.

**7. Where they stop.** The measured claim in the intake's own comments (from
the panel study): without a stated duration and a visible remainder, 63
questions loses about half its finishers; with both, plus one line naming the
three way design, completion runs 29 points higher. That line is built.
James (57, C-suite) says he will not answer 63 questions on a phone. Angela
(36, seeker) arrives from a shared link to take the quiz; every mobile pass
that hid Energetics behind a menu lost her (`DESIGN-mobile-icp.md` pass four).

**8. Proposed, not built.** `DESIGN-nav.md`: rename to Intake and move it off
the bar to a door at the top of the left rail (keeps integer 5 and host `#iq`;
costs a scroll on a phone). `DESIGN-mobile-icp.md` pass five: on a phone,
Energetics is its own full screen linear flow with no chrome, one question at a
time. Neither is ruled.

---

### 4.2 Ritual (TAB RITUAL, 10)

**1. The job.** "Turn what the release found into one small thing I will
actually do, at a time and a place, and keep a record that I did it." Ruled a
primary product: the ritual builder goes in the primary navigation with the
accountability tracker built inside it rather than beside it.

**2. Layout.** `#rit` is the release overlay class (`.rel`) reused as a
surface. In tab mode it stops being fixed to the viewport, drops its scrim,
fills the stage, and scrolls; its card is capped at 820 pixels wide and
centred. The action row (Close, Save ritual) is sticky at the bottom of the
surface. Rails present.

```
Build a ritual (eyebrow)
<Track name, large>          e.g. "Body"
one sentence: which seat is carrying most, so which track, which tier and below
[Today's ritual]             only if one was saved today: steps and minutes,
                             "When <when>, at <where>." or "No time and no place set,
                             so it is an intention rather than a plan."
                             [I did it]  or "Done. It is on the record."
[After releasing N: ...]     only when opened from a release
practice list: ONE card, the practice the state calls for, marked "called for"
                             track heading in track colour, name, one line, minutes
[Choose something else]      reveals every practice at this tier, grouped by track
The ritual, N minutes        numbered steps with the how to text
When and where               two text fields; below them a live sentence:
                             "When <when>, at <where>, you will <practice>."
[Close]  [Save ritual]       sticky
The record (ladder)          streak number and unit, today on or not on the record,
                             one control ("Build today's ritual" / "Run another"),
                             the ledger (Practised, Planned, Saved, Opened, Installed),
                             marks earned, the next mark named
```

**Why one practice on the card:** nineteen choices sat here against a working
memory of about four. The one the state calls for is the card; the rest are
behind a single control, which makes it a choice between two things.
Measured worth, 19 of 1000 retained at day thirty in the ritual panel study.

**Why the lightest practice and not the first:** 835 of 1000 simulated arrivals
were being asked for fifteen minutes or more as a first practice because of
table order. The track is the diagnosis; the entry is the shortest practice in
it.

**Why when and where:** implementation intentions (Gollwitzer and Sheeran 2006,
cited in `ui/ritual.js`), the largest single effect in the research file, 72 of
1000 at day thirty. Both fields are optional so a person who will not answer can
still save.

**Why the ledger is here:** it was only on the Compass, which measured 22
percent touched, so the accountability half of the product reached about one
person in five. One function (`ladderHtml`) is drawn on both surfaces, never a
second copy, because two places that report a streak are two places it can be
wrong.

**Why the record never prints a count against a total:** sixteen marks exist
and the surface never says sixteen. Earned ones are shown, the next is named,
and the rest are not listed, "because a list of a person's unfinished self is a
completion bar and this is not a game about becoming whole."

**3. Empty and populated.** Blank: the track and practice are still chosen
(defaulting to the Root, Body track, Box Breathing) and the sentence claims
the root is carrying the most, which is not true of an empty field (section
3.4, flagged). The ladder reads "0 days, last run" and "Nothing on the record
yet". Populated: today's saved ritual sits at the top with "I did it"; the
ledger fills; marks appear.

**4. Key interactions.** Toggle practices; Choose something else / Show only
what is called for; type when and where (the sentence updates as you type);
Save ritual (stays on the surface and resets the selection; it used to close
after 700 ms and threw the plan away); I did it (marks today done; saving
reports through status). **Close on the Ritual tab navigates to Summary**
(`ritClose`), because closing a tab would otherwise leave a named tab showing
an empty box.

**5. Loop and avatar.** Play and Flow in the ladder prototype's mapping
(`proto/ladder/turn.js`: play = take the ritual it deals, flow = mark it done).
In the avatar dashboard (ruled), Ritual is one of the two "sticky" blocks and a
door to this page. The content chain's last link (a practice or affirmation cut
from the person's own sentence) would land here and is not built.

**6. Cognitive load.** 92 total, 74 seen at 1600 blank; only 7 are the ritual
itself. This is the cleanest centre in the product: the load is the shell.

**7. Where they stop.** Derek (39, endurance) asks where the workout is; this is
it, and it is the surface with the fewest choices. Diane (46, founder) wants a
delta and the ledger is the only place a change over time is printed as
counts. The ritual panel study (`PANEL-ritual-1000.md`, cited in the ladder
comments) found 0 of 1000 reaching seven days before the record moved here.

**8. Open.** `ritual.kind`, a closed three value field, is PROPOSED
(`DESIGN-tags.md` s5) and not built. Whether the ritual carries the person's
own words is PROPOSED.

---

### 4.3 Story (TAB STORY, 0)

**1. The job.** "Let me say what happened, in my own words, and see what the
instrument heard in it before anything lands." The owner: "This is high
priority. The most important portion of the product has gotten the least
amount of attention." It is where the content chain starts and the only surface
where what a person says becomes what the instrument reads, in front of them,
while they write it.

**2. Layout.** `#story` is a two column grid: writing on the left (1fr),
reading on the right (396 pixels). One column below 1180. A maximise toggle on
the imprints panel (`body.impbig`) makes the grid one column so the cloud can
take full width.

```
LEFT: the journal (.st-write)
  head row: eyebrow "The day" | [Record] (dot: green recording, red typing) | privacy line
            "Recording sends the audio to your browser's speech service. Typing does not leave this device."
  the editor: a highlight layer BEHIND a transparent textarea, same text, same metrics.
              Every word the sniffer scored is marked in its seat colour, on exactly the
              characters the scanner read (not a second regular expression).
              placeholder: "What happened. Write it the way you would say it out loud."
  bar: "N words, M tagged" | [Clear] | [Commit N]  (disabled until something would land)

RIGHT: two halves that scroll on their own (.st-read)
  top half, imprints (#imp)
    header: Held N | Filled in N | Child N | Pending N  (each shown only when non zero)
            group toggles: Seat | Charge | Saboteur | Story | Expression | maximise
    "Child patterns across N seats"  rows, when found
    the cloud, grouped by the chosen key: per group a header in seat colour and pills
       pill states: held (charge, seat colour), filled in (installed opposite, tick),
                    pending (found in the text, not committed; a ghost), child (harder colour)
    bar: "N selected" or "click a pill to select" | [Detail] (exactly one) | [Release N]
  bottom half, release (#strel)
    "Release" eyebrow and one line
    From: Heaviest | This story N
    Addresses: 1 | 3 | 5 | 8
    Pace: Slow | Steady | Quick
    the list that will run (badge, name, seat)
    footer: "N addresses, M patterns, about S seconds" | [Run a release]
```

**Why the highlight is behind the text:** a textarea cannot carry colour, so the
layer behind holds the same text at the same metrics and the textarea's own
text is transparent with only its caret visible. The layer scrolls with the
textarea.

**Why pending pills exist:** nothing touches the field until Commit. The ghosts
show where the text is about to land, so the person sees the consequence
before paying it. `parseStory` reads and `applyStory` writes; they are two
calls, and the page draws the boundary between them.

**Why held and filled in are counted apart:** the panel used to count installed
opposites (what a release produces) as imprints, so reference profiles holding
nothing read "Imprints, 49". "A number that counts a person's progress as their
load is worse than no number."

**Why an inferred pill says the fetter and seat, never the address name:** when
the words name no child emotion the address is picked by fallback, and printing
its name told a bereaved person they were carrying Martyrdom. The chip says
what was actually read.

**Why the release panel sits under the imprints on the same page:** a person
can see what the sniffer found and run a release against it without leaving the
page they wrote on. "The two halves of one act were on two surfaces."

**Why the cost is printed before the run:** "a person is entitled to see what a
run costs before they begin it." The footer asks the meter for the real plan
(patterns spent, capped at the allowance), because the panel once quoted three
and spent up to twenty five.

**3. Empty and populated.** Blank: the editor is empty, "0 words", Commit 0
disabled, the imprints panel says "You have not written anything yet. Whatever
you write gets pulled apart and collected here.", the release panel says
nothing is held and Run is disabled, while the From, Addresses and Pace
controls still render. While typing: marks appear in the text, pending pills
appear in the cloud, the tagged count and Commit count rise. Populated: held
and filled in pills, group headers with counts, the release list populated.

**4. Key interactions.** Type or Record (speech recognition; every failure
path reports a specific reason through the status line, including "Recording
needs a secure page. Opened from a file, the browser will not turn the
microphone on. Typing works."). Commit (pushes an undo step first, applies
charge, saves an entry and a snapshot; refused with a named reason on a
reference case). Group by. Select pills; Detail opens the address drill;
Release N opens the run on the selection. Run a release from the panel.
Clear. The imprints header also serves the Games "See the N running you"
door, which preselects pills and jumps here.

**5. Loop and avatar.** Discover, in every mapping. The whole content chain
starts here. The avatar pair's right hand half ("who I am not, on a bad day")
is parsed by the same sniffer to find the seat it resolves to.

**6. Cognitive load.** 103 total, 85 seen at 1600 blank; 132 and 105 with a
loaded profile, 51 of them in the centre (every pill is a control). The pill
count grows with the person's writing. `DESIGN-story.md` measured 19 fixed
controls on the surface of which 10 are the release panel alone, and "Run a
release" at 1002 pixels in a 1000 pixel viewport, two pixels below the fold.

**7. Where they stop.** The owner graded this page a D ("really visually
unimpressive and uninteresting"). Derek wants the release and found it 4,336
pixels down on a phone (historical measurement, `DESIGN-mobile-icp.md`, 18
September; the page is shorter now but the release is still below the
imprints). Angela writes the way people write, a situation and a consequence
with no emotion word, and the sniffer reads 1 of 14 of the repository's own
persona sentences (`DESIGN-gamification.md` s5.1); the frame layer that would
read them is PROPOSED.

**8. Proposed, not built, and OPEN.**

- `DESIGN-story.md` (13th pass): the journal rises onto the panel ground at a
  72 character measure, 17 on 1.78; nothing above the box (no eyebrow, no
  control row); a circular 56 pixel record button inside the field, lower
  right; a red light upper left while listening; the release panel reduced to
  a pace number field, the list, and Run release, moved above the imprints so
  it is above the fold (208 pixels at 1600); the From and Addresses controls
  retired because selection is the selector; the cost line moved to the
  release runner's first frame; "Filled in" moved below the cloud and not
  selectable; the size channel on pills removed (the ring carries magnitude);
  a "How they run through you" block for two selected imprints computed from
  shared parents in the chain. Measured: 19 fixed controls to 7.
- `DESIGN-story4.md` (17th pass): four competing designs with four beliefs:
  the instrument (a seven column staff down the journal's left edge), the
  mirror (the instrument writes a line in the margin beside each word it
  read, joined by a leader; recommended), the body (the story's route drawn on
  the figure), the bench (clamp a part and the story goes quiet except the
  words feeding it). **Which belief is OPEN.**
- `DESIGN-container.md` (22nd pass): the journal as a container with a lid, a
  key (prompt ring: Plain, Descent, Sin, Year), an inside, two closes (Seal
  goes through a per line "Mine / Not mine" acknowledgement and then lands;
  Empty keeps nothing), a seam (the reading leaves, the words stay), and
  per container sight grants for a practitioner. **Whether the words rung of
  sight exists is OPEN.**

---

### 4.4 Field (TAB FIELD, 2). The opening surface as built.

**1. The job.** "Show me the whole of what I am carrying, in one picture I can
move into." The wheel is the product's hero graphic and the instrument's face.
The app opens here (ruled 19 September, reversing Summary; the ruling that the
app opens on the avatar is recorded and not built, section 1.4).

**2. Layout.** The stage is a CSS grid: `--lane` (128 px) | 1fr | `--lane`, and
three rows: auto, auto, 1fr. Background is the render ground (#101010 on the
three render surfaces: Field, Body, Compass).

```
row 1, full width   .key       three pills: CQ | DQ | SQ (letters in the ring, value in a pill)
                               right padding 300 px so nothing sits under the top right
row 2, full width   .cv-legend one ellipsised line about the tool, never the reading:
                               "The ring is the seven seats, from the root at the top round
                                to the crown. Press a band to open it, or any single mark on
                                it to open that address. Scroll in on the wheel for <next layer>."
row 3, column 2     canvas#cv  the wheel
row 3, column 3     .pol2      the compass meter: a vertical axis, gold above 50 and root red
                               below, ticks at 40, 50, 60, the marker oscillating inside the
                               person's own range pill, a halo glyph at the top end and a
                               pitchfork at the bottom end, each end a door to its roster
absolute, lower left  .keylo   vitality | awareness | will | flow (icons, no labels)
absolute, lower right .acc     "Accuracy / of 100" label LEFT of a large ring (a button)
floating              #probe / the one tooltip  (never placed over the wheel)
hidden                #tl, #howto  (kept in the document because renderers write to them)
```

Sub bar: the four depth buttons (Charge, Patterns, Chains, Blueprint) and the
zoom note.

**The wheel, from the centre out (canvas, drawn every frame):**

| Ring | What it is | Present at |
|---|---|---|
| core | a sphere sized and lit by coherence (below 50 it shrinks, above it grows and glows); the coherence number and "of 100" at its centre in the tier's colour, on a backing disc | every depth; number only when read |
| inside the core | feathers that open on zoom: the triad (vitality, awareness, will) at 1.45x, the seven seats at 2.30x, the 21 laws at 3.40x, each feather's length is the value over ten, with quarter rings as a scale | zoom only |
| six gates | three higher above the core, three lower below, each a ring on a stem, the ring closes by the share of the story that ran through that gate, a pill with the percent (an en dash when no story), glyph only, name on hover; "defaults to <gate>" and its cost printed under the core when one gate carries 34 percent or more | every depth |
| 21 law spokes | short spokes on a ring around the core, length is the law over ten, colour is the law's seat | every depth |
| chains | chords from addresses to saboteurs to complexes to hyper complexes to the character layer, width and brightness by weight, sag by susceptibility (taut where the person is susceptible) | Chains and Blueprint |
| archetypes | 12 arcs, the lead one bright and named large | Chains and Blueprint |
| masks | six faint arcs, named | Blueprint |
| the shell | one segment per somatic address, depth of the segment is its charge (SQ), colour mixes toward the seat colour as charge rises, glow at 6.5, a red edge at 9, gold edge when hovered or pinned; on zoom (1.55x) carrying addresses grow out of the ring and take their axis glyph, at 2.05x the heaviest are named and drawn as a pair (held outward, installed opposite inward); at 2.60x each address grows a line per story that put charge there | every depth |
| seat bands | seven seat names around the shell, each seat's arc is one press target | Patterns and deeper |
| domains | 19 arcs on the outer ring, selected ones bright and named large | Blueprint |
| beads | saboteurs on a ring (named at Patterns, heaviest six), complexes, hyper complexes, character layer as larger beads inward; nameplates route around each other and are dropped rather than overlap | Patterns and deeper |

Depth is a complexity ladder, not four skins. Each step adds exactly one named
layer and is strictly cumulative. **Zoom only adds**: the depth buttons set the
floor, zoom resolves further layers (at 2.2, 3.2, 4.2), and the sub bar marks
the button zoom has reached so the person knows the detail came from the
gesture and will leave when they zoom out.

**Why the key strip is in flow above the canvas, not over it:** "Nothing on the
stage covers the wheel." It was a 288 pixel card on top of the wheel.

**Why letters in the ring and words in the tooltip:** ruled, "CQ, DQ, SQ is
essentially an icon." The other four quantities got drawn icons because the
word beside them is gone (vitality a shoot, awareness an aperture, will a shaft
through a gap, flow three rising waves).

**Why two strips:** CQ, DQ and SQ are the instrument reading itself; vitality,
awareness, will and flow are what moves through the person. Eight chips on one
line wrapped unevenly and the owner called it a jumble. Splitting by kind is
what makes each row mean something.

**Why the number is back in the core:** "No text over the hero graphic, ever"
is a standing law, and the owner reversed it for this one mark: a figure at
the centre of the thing it describes is the drawing saying its own name. The
nine ring captions ("112 addresses · SQ · 97 loaded" and the rest) were removed
in the same ruling and the function that drew them was deleted.

**Why the wheel's size is measured, not assumed:** the free radius is the half
box cut back to the nearest corner of anything overlaid on the canvas, minus
room for the longest radial label (`reframe`). On a wide stage this changes
nothing; on a square one the wheel gives up the difference.

**3. Empty and populated.** Blank: the shell draws every segment at its
thinnest, dim; the core is a small sphere with no number; the gates draw with
an en dash; the key strip reads CQ (en dash), DQ 0.0, SQ 0.0; the lower strip
four en dashes; accuracy "not read yet"; the compass meter's number is an en
dash and its range pill is absent; the law spokes still draw at the default 6
(flagged in 3.4). The four doors are in the right rail. Populated: segments
deepen and glow by charge; the core grows and colours by coherence; beads and
chords appear at deeper depths; the range pill appears on the compass meter
once the person has two or more readings in the span.

On arrival (once per session, not per visit) the field assembles: seats arrive
root first to crown last, 62 ms apart, each address swinging the last few
degrees into place, the core blooming last out of a third of its size. Under
a second end to end, because an entrance that must be waited out is a loading
screen. Reduced motion gets the end state.

**4. Key interactions.**

| Gesture | Where | Result |
|---|---|---|
| hover | any target | the one tooltip, placed off the wheel on the side the mark is on |
| press | an address | opens the address drill |
| drag vertically | an address, fine pointer only | sets the charge on that address's axis; one undo step per drag |
| tap | an address, coarse pointer | reads only, never writes (a thumb scrolling the page was rewriting charge) |
| press | a seat band | seat drill |
| press | a law spoke | law drill |
| press | a gate | gate drill |
| press without moving | the core | core drill (coherence and the six gates) |
| press | a bead | pins that pattern (lights its chain, dims the rest to 0.08) and opens its drill |
| press / shift press | a domain arc, an archetype arc | sets or adds to the blueprint (writes) |
| press | an atom (a story line at deep zoom) | holds it, names the sentence it came from |
| scroll wheel | canvas | zoom about the pointer, 1x to 7x |
| drag | empty canvas or the core | pan |
| double click, or F | canvas | reframe |
| + / - | keyboard | zoom about the centre |
| press | any key strip pill | that quotient's drill |
| press | compass meter | compass drill; either end opens its roster |
| press | accuracy | accuracy drill (what limits identification, by cause) |

On a coarse pointer the canvas takes `touch-action:pan-y`, so a vertical swipe
scrolls the page. There is no pinch zoom or double tap on a phone; zoom, and
therefore atomising, does not exist on a phone (PROPOSED in both mobile
documents).

**5. Loop and avatar.** Play in the onboarding prototype's mapping (the field
is where you move what is there). The Field's core is claimed by the feathers
(`DESIGN-feathers.md`); the avatar design explicitly overturns the old bible
entry that put the avatar at the centre of the ring, because "two systems
cannot own one mark." If the avatar becomes the opening surface, the Field
becomes a tool a person navigates to.

**6. Cognitive load.** 99 total, 69 seen at 1600 blank. The DOM count
**undercounts this surface badly**: every canvas target is a choice and is
invisible to it. `ui/wheel.js` records 136 hit targets at zoom 1 on one profile
(every address, 21 law spokes, 6 gates, the core, seat bands, beads). A
stranger's first screen is therefore well past a hundred simultaneous choices.
Mitigations built: depth floor at Charge by default (the simplest layer); names
drawn only for the heaviest addresses; nameplates dropped rather than
collided; ring captions removed; the tier word and orientation bars removed
from the centre (they were printed twice). `DESIGN-ia.md` s5 item 1 calls the
missing first screen the largest gap: the Field "drops a new person onto the
densest instrument in the product with no statement of what they are looking
at."

**7. Where they stop.** Historical, 18 September, simulated panel at 390
(`DESIGN-mobile-icp.md` pass one), some causes since fixed: Diane never
scrolled past the chrome; Marcus left at the clipped key strip; Angela and Ana
left at the tier word "Incoherent" on the first scroll; Sofia and James at the
profile picker ("if I can be Sofia with one tap then the number on the screen
is not mine"). Still true on this build: the chrome is 320 pixels at 390, the
profile picker is in the bar, the four doors are 3,066 pixels down, and the
tier words at the low end are unchanged.

---

### 4.5 Body (TAB ENERGY, 3)

**1. The job.** "Show me where it sits in my body and how much gets through."
Renamed from Energy on the menu rule: the surface is a body with seven seats on
it, and Energy named the subject rather than the thing on screen.

**2. Layout.** `#emap` fills the stage on the render ground. One SVG in a
100 x 100 space, `preserveAspectRatio xMidYMid meet`. Sub bar carries the
layer row and, on the Pain layer, the region row. The right rail opens Flow and
Running on first arrival; the shelf (`#eshelf`) is displayed only on this tab.

```
SUB BAR   Fetters N | Saboteurs N | Complexes N | Hyper N | Masks N | Pain N | Flow
          (Pain only) Region: All | Head | Throat | Shoulders | Arms | Torso | Pelvis | Legs | Hands | Feet
STAGE     .pm-well
            aura: a soft radial wash in the heaviest seat's colour behind the figure
            the figure: filled silhouette (raster when present, vector otherwise)
            the channel: one continuous shape down the spine, its half width at each seat
                         is that seat's throughput, banks outlined; where it pinches,
                         one short leader and one label, "stops at the <seat>"
            the field: seven seat heat gradients plus a bloom per carrying address,
                         blurred together and clipped to the silhouette (no hard edges)
            seat cores: seven small discs on the midline, each a target
            addresses: carrying = heavy ring with a solid core; clear (opposite
                         installed) = thin ring round a pinpoint
            patterns (pattern layers): up to eight rings with a tier glyph inside,
                         pushed off the spine, arcs out to the addresses they stand on;
                         only the held one is named, outside the body
            pain layer: paintable regions clipped to the silhouette
RAIL      the shelf: Flow ring (percent that reaches the crown) | Heaviest seat
          the layer's list: name, weight, sub line, address count, each a door
          pain region detail (commonly presents as, the pattern under it, heaviest here)
          a legend for what a row means on this layer
          the picked item's detail
          Seats: seven rows with a pass gauge, held count, pass percent, plexus
```

**Why the names are not on the body:** the old gutter printed up to 24 names in
two columns with curves back to their seats. "The body shows WHERE and HOW
MUCH. The rail shows WHAT. One thing each." The arcs replace the gutter because
they show what the list never could: what is running what.

**Why one river, not seven tiles:** throughput is continuous. Drawn as one
channel it narrows where a seat closes, and the one place a word is spent is
where it closes.

**Why heat and not discs:** the Nummenmaa bodily maps were the owner's
reference. What they do is a filled silhouette, a continuous field with no
kernel edge, and a field that stops at the skin. Hue stays the seat, because
colour means seat everywhere else in the product.

**Why the Pain layer opens blank:** ruled. "A pain map exists to be told where
it hurts, and one that arrives already covered is telling the person where it
hurts instead." The whole charge field is hidden until a region is painted.

**Why every layer button carries a count and the first layer with content
opens:** Fetters read zero on a profile with 28 saboteurs one button away. "A
control that offers an empty room first is a broken control."

**3. Empty and populated.** Blank: every layer except Masks and Flow counts 0
and is dimmed; the page opens on Masks (six rows at 0.0), the shelf prints Flow
100% with "nothing held"; the channel is at full width everywhere; "nothing
carrying yet" under the figure. Populated: heat blooms at the loaded seats, the
channel pinches, "stops at the <seat>" is labelled, pattern rings and arcs
appear on pattern layers.

**4. Key interactions.** Layer buttons; region buttons and painting a region
directly on the figure (the same value, two controls: one for the pointer, one
for keyboard and screen reader; painting the selected region again clears it);
press a seat core or a seat row to pick the seat; press a pattern ring or its
rail row to pin it (lights its arcs, up to 24 links); press an address to pick
its seat.

**5. Loop and avatar.** Embody in the onboarding prototype's mapping ("seven
seats, the charge sits at one of them"). The Body figure and the avatar share
one coordinate space: the seat heights and radii in `PMBANDS` are the same
numbers the avatar armature and the kundalini rise are drawn on
(`DESIGN-avatar.md` s8, "the avatar and the pain map are the same figure seen
twice").

**6. Cognitive load.** 105 total, 64 seen at 1600 blank. The stage's SVG marks
are not counted by the DOM counter; the sub bar is 7, the right rail 32 (the
shelf lists). Mitigations built: names off the body; eight pattern rings at
rest maximum; one label on the whole figure.

**7. Where they stop.** Sofia (41, somatic practitioner) is the user this
surface is closest to and the one who will notice that a seat is shown as
"Third Eye" here and "3rd Eye" elsewhere (`DESIGN-ia.md` 2.10 records three
names for that seat). Derek asks what the holding costs his output; nothing
here prices it.

---

### 4.6 Compass (TAB COMPASS, 8)

**1. The job.** "Show me where I sit between coherent and decoherent, on each
of eight qualities, and which way I am moving." It was three clicks deep
inside a drill and the owner could not find it; it became a tab.

**2. Layout.** `#cone` in tab mode fills the stage on the render ground. One
column: the figure takes the card; everything that is reading goes to the right
rail through the drill shell ("the centre column is for hero art").

```
eyebrow "The compass"   (a Close button only in modal mode)
figure area (.cone-fig)
  left names column:  four mirror axes, each a row: quality / coherent pole (glyph) / inversion (glyph)
  canvas (height min(52vh, 430px)):
     rings at every ten points, gold above the waist and red below, the 50 ring stronger
     the waist band 40 to 60 drawn as a room (floor, ceiling, 24 uprights, far half dimmed)
     eighteen dots drifting in the band ("where most people oscillate")
     eight meridians in seat colours, far half dimmed
     the person: a node on each meridian and a ribbon joining them (only when read)
     the marker on the axis, oscillating across the person's own range (from history)
     ticks at 40 and 60 on the axis
     top: halo glyph and "Coherent"; bottom: "Decoherent" and pitchfork glyph
     optional: Regulation (three highest laws as up arrows, three lowest as down)
     optional: Layers (Paradiso names above, Inferno names below)
  right names column: the other four axes
  controls upper left: Flat | Regulation | Layers
  one line under the figure about the tool:
     "The narrow middle is where most people sit. Drag to turn the figure. Press any name to read that axis."
RIGHT RAIL (via the drill shell, "Back to the compass")
  the reading: "You read N, <above / inside / below> the oscillating band." integrity against a
               clean ten, and the hull paragraph with the loop direction (up or down)
  the record (the same ladder as Ritual)
  Coherence over time: span buttons Day | Week | Month | Quarter | Year | Five years,
               a line with a floor of ten points, first and last value and direction printed;
               the graph is a door to Summary
```

**Why it opens flat:** ruled, "it should start 2D flat, and then you can click
and move around it." The turned figure was the state a person then had to work
out how to leave. Flat is the same renderer with the tilt at zero, so the two
can never disagree.

**Why the sixteen names are off the canvas:** measured 89 colliding pairs at
1600 with no gate watching them. In the rails they can wrap, be read by a
screen reader, be gated by the collide test, and carry a control. The row
nearest the viewer lights as the figure turns; hovering a row turns the figure
to it with an eased spin that never snaps; pressing reads that axis.

**Why an arrow up and an arrow down, not a spindle:** ruled, "It is meant to be
an arrow up and an arrow down. It is a compass." The waist stays a neck, not a
point, because the median band is where most people stand and it needs width
to read as a band.

**Why the reading moved to the rail:** 1,100 characters of prose had taken the
right half of the card and the figure was down to 528 of 920 pixels. "Right of
the card is not the information pane. The information pane is the rail."

**3. Empty and populated.** Blank: rings, meridians, the room and the
drifting dots draw (they are the shape of the range, not data about the
person); no ribbon, no nodes, no marker; the rail says "Nothing has been read
yet..." and the record reads zero days. Populated: ribbon and nodes, the marker
and its oscillation range when two or more readings exist in the span, the
graph when two or more points exist ("A graph of one point is a flat line, and
a flat line is a claim").

**4. Key interactions.** Drag to spin and tilt (tilt clamped so up still reads
as up); press a node to read its axis (teacher drill); hover or focus a name
row to aim the figure; press a name row to read the axis; Flat, Regulation and
Layers toggles; span buttons; the graph opens Summary; the ladder's control
opens the ritual builder.

**5. Loop and avatar.** None directly. The Compass answers "over time", which
is why the record was first put here. The descent (nine circles) behind the
"Read nine sentences" door is the same material seen as a way in.

**6. Cognitive load.** 106 total, 78 seen at 1600 blank; 11 in the centre (the
sixteen names are eight buttons, plus three toggles). The canvas nodes are not
counted.

**7. Where they stop.** James reads one number once; here the number is in the
rail, not on the figure. The Devil corner of the shape and control table has
no reference case in the roster (`DESIGN-compass.md` 1b), so a practitioner
never sees the configuration they most need to recognise.

**8. Open.** The 21 laws of integrity, which also have a coherent pole and an
inverted mirror, "should probably share the renderer" (`DESIGN-compass.md`).
Not ruled.

---

### 4.7 Knowledge (TAB KNOW, 6)

**1. The job.** "Tell me what this word means, and how much of it is in me."
The codex: everything the instrument knows, searchable, every row a door to
the same drill the wheel opens. It reads the engine's tables directly, so the
knowledge base and the reading cannot disagree.

**2. Layout.** `#know` is the host and holds `#knowbody`, which `kbRender`
writes. (`#know` does not carry Games any more, but the host/body split stays
for the reason in 2.10.) The centre scrolls on its own.

```
header, one baseline (154 px at 1600, 226 at 390):
  eyebrow "The codex" | deck name (large) | "N of them. The percent is <what it is of>."
bar: search field "Search the codex" | "N matches" (only while searching) | In order | By weight
deck strip (one row, scrolls sideways, never wraps): Fetters N | Child emotions N | Saboteurs N |
  Moral integrity N | Masks N | Domains N | Archetypes N | Gates N | The cards N |
  The stack N | Universal laws N          (counts become per deck match counts while searching)
glossary answers (only while searching): up to four term + definition blocks, ABOVE the rows
rows: a three column grid (two below 1100, one below 720), each row a button:
  ( ring ) Name              42%
    mark   family
  44 px ring whose arc is the percent and whose colour is the seat; the mark inside is the
  thing's own glyph (for an address, the colour is the seat and the mark is its axis);
  family word under the name; percent right aligned in ink, en dash when there is no honest one
  Universal laws, in order and not searching: an axis heading before each run
    ("Laws of nature · Sat, how the field behaves")
the Letting Go Deck: eyebrow, one paragraph, "N cards in the deck", [Deal a card]
```

**Why the row is four things:** the owner's words: "the icon, the percent it is
impacting you, and the word, and what it is associated with, like rigidity or
collapse." The fourth thing is the row's family and its colour is the family's
seat, so the colour system never bends (Saboteurs show their architecture,
Domains their root, The stack its nerve plexus, Universal laws their axis).

**Why the header was cut:** measured at 390, the codex spent 648 of 844 pixels,
77 percent of the phone, before showing one entry. After: twelve rows above the
fold at 1600 became thirty nine, and one became six at 390.

**Why the subtext was deleted:** it was 78 percent of every character on the
page and highly repetitive ("Positive Intelligence, 3 addresses" down a column;
the laws restating their seat).

**Why the glossary is not a deck:** a name is glossed once, in one table, and
the search shows it (`DESIGN-information.md` rule 1).

**Why "In order" is the default:** the owner ruled that the universal laws go
in order because they are a flow, and a deck that reorders per person has no
stable answer to "where is Fear". By weight is one press away because the
squint test only passes when the heaviest thing is first.

**Why the words changed:** the owner, "A fetter is a node. The fetters are the
[somatic addresses]. Fear, anger, shame, these are the nine child emotions.
Very different." (Quote edited: the number he said is one the product never
prints; the count stated to users is 112, and the Fetters deck lists all 112,
four of them field anchors with an en dash for a percent.) Keys did not change
(`addr`, `fetter` are identity); the labels did. "Laws" became "Moral
integrity".

**3. Empty and populated.** Blank: address rows 0%; archetypes and domains
print percents because they come from the blueprint selection (a choice, not a
reading); **Moral integrity rows print 60% off the default** (flagged, 3.4);
the deck is empty and Deal is disabled. Populated: rows carry real percents,
By weight becomes meaningful, the deck deals.

**4. Key interactions.** Search (re-renders on each keystroke and keeps the
caret); deck tabs; sort; press a row to open its drill in the right rail
(routed by kind to one of about fourteen drills); Deal a card opens the card
overlay (rank from charge, suit from seat, two "Letting go of" lines, Deal
another, Open the address, Close). Named rows in the right rail (archetypes,
domains) jump here with that row already open (`wireKbJump`).

**5. Loop and avatar.** Supports every station; belongs to none. The Letting
Go Deck is the codex at practice speed.

**6. Cognitive load.** The highest in the product: 221 total, 123 seen at
1600 blank, 126 in the centre (every row is a control). `DESIGN-mobile-icp.md`
pass five proposes that on a phone Knowledge is a search field and nothing else
until a person types (196 controls to 1). Not built.

**7. Where they stop.** Sofia works from this surface in session and is the
highest value person in the roster (she brings clients); every phone design
that hid Knowledge behind a menu lost her recommendation. The information
system audit measured 78 to 120 coined names met per ICP in a first session on
a phone, with eight or nine of them in the glossary.

**8. Proposed.** The centre as the destination: a drill opened from a codex row
renders in the centre in place of the deck, with the existing back control, and
the rail stops receiving codex drills (`DESIGN-knowledge.md`). Must write to
`#knowbody`, never `#know`. Not built.

---

### 4.8 Games (TAB GAMES, 7)

**1. The job.** "Somewhere to go for brain release, and practise the letting go
at speed." Ruled independent: games were folded into Knowledge to get the bar
to seven, and unfolded again on the owner's word: "they are independent games,
somewhere a person goes for brain release, and a game folded into a reference
page is neither."

**2. Layout.** `#games` in the centre, its own header and tab row (under its
own `gm-` classes, not borrowed from the codex).

```
header: eyebrow "Games" | "The instrument at practice speed" | "Both deal from your own field. Neither invents a pattern."
tabs: The letting go run | The match

THE LETTING GO RUN
  before dealing: three short paragraphs, the nine gate verbs as chips, [Deal twenty four]
  after dealing:
    bar: Pole chips (masculine / feminine with their channel) | clock m:ss | "N of 24 cleared"
    the open card's panel: seat and plexus, the pattern's track line, the release line,
       the truth line, where the line came from, "Say both, feel where they land, then put the card down."
    grid of 24 cards (auto-fill, min 112 px): face down, face up (name and seat),
       half (one side cleared), done ("both" or "clear")
    when complete: "Twenty four addresses cleared in m:ss. Deal again, or open the release to commit it."
    "Both sides" note | card shut note | [Deal again]
THE MATCH
  before: one paragraph, [Deal the marks]
  after: "N of 8 matched" | grid of 16 cards (min 84 px) showing child emotion glyphs
     the matched pair's panel: seat, name, "toward <opposite>", where it sits, how many addresses
       it runs and how many are carrying in your field, held and installed values,
       [See the N running you]  (jumps to Story with those pills selected)
    when complete: the note about the ninth axis not in the deck | [Deal again]
"Phase two" block: "A narrated walkthrough ... Not built."
```

**Why every line names its source:** "a person can tell a catalogued sentence
from a constructed one." A printed protocol card first, then the axis card,
then the strict syntax at the address.

**Why both poles must clear:** the printed cards say different things on the
two sides, so a card is not done until it has been run through both.

**3. Empty and populated.** Blank: the letting go run still deals 24 cards off
zero charge addresses (flagged, 3.4); the match reports "None of them are
carrying in your field right now". Populated: the deck is dealt from the
person's carrying addresses, heaviest first.

**4. Key interactions.** Turn a card (second press puts it down and marks that
side clear); switch pole (turns all cards back); match pairs (a mismatch turns
back after 700 ms); See the N running you (a door to Story).

**5. Loop and avatar.** Play, in the everyday sense; not wired to the loop
station table. Nothing a game does writes to the reading. "Deal again, or open
the release to commit it" names a destination with no door on this surface
(`DESIGN-ia.md` s5 item 7).

**6. Cognitive load.** 98 total, 70 seen at 1600 blank; 3 in the centre before
dealing, then 24 or 16 cards.

**7. Where they stop.** Derek, mid session, wants hands off; the release run
(2.2 seconds a line) is closer to his need than a card grid. The count "N of 24
cleared" and "N of 8 matched" are counts against a total on a practice surface;
the standing ruling forbids that for readings, and whether a game's own progress
is exempt is not stated anywhere. Treat as OPEN.

---

### 4.9 Summary (TAB SUMMARY, 1), with Analytics folded (TAB ANALYTICS, 4)

**1. The job.** "Tell me, in words, what this all adds up to, and what to do
next." The conclusion. "A summary with no next action is a diagnosis with no
prescription."

**2. Layout.** `#sum` scrolls on its own and holds `#sumbody` then `#ana` (a
folded surface drawn in flow beneath, separated by a hairline). The right
rail's four doors are suppressed on this tab.

```
#sumbody, populated (sumFull)
  THE PLATE (full width): first name at display size | who line
                          coherence ring in the tier's colour | tier word in the tier's colour + state
                          "Where it goes" + the direction out of this band
  two columns, 1.35fr and minmax(300px, .85fr); one column below 1100
  CENTRE COLUMN, "text about you":
    What you told it: the last three committed entries, dated, each word the
        sniffer read bold in its seat colour
    Reading (a panel with its own ground): three paragraphs
        1. the blueprint born on, against what is running now
        2. where it reaches the body, the biggest thing compounding, where flow stops,
           shadow weight, the law furthest shut
        3. the lean (benign against malignant, adding to a hundred), expanding or
           contracting, and what stands between here and the stated avatar
        source line: "Written from the nine axes, the twenty one laws, the blueprint and
        the birth data. Nothing here is generated from anything the instrument has not measured."
    the output row, three cards:
        The protocol: what this state calls for [Open it]
        Release this first: the heaviest address, and how much release has left in it
            [Run a release]; OR, when release headroom is spent,
            What moves the reading: The twenty one laws [Answer the laws]
        Next marker: its name and distance
    In the body: up to three sentences on the nine, where each sits and is felt
  RIGHT COLUMN, "the information panel": everything measured or structural
    glance row: six rings, each with its scale on screen as a third line:
        coherence (of 100) | shadow weight (summed, no ceiling) | carried depth (of 10) |
        pole (of 10) | energy (of 1) | identification (of 100)
    Blueprint: the root, then the selected domains as icon + name (no ring: a choice, not a measurement)
    Primary and secondary: four archetype rows, ring and percent, the behaviour under the name
    Masks: six rows, weight
    Where it sits: up to four seats by load, "shut, so charge sits under it" / "open, so charge passes through"
    The chain: counts of saboteurs, complexes, hyper, character (never against a total)
    Four Lenses: Western, Eastern, Design, Gene keys, each says what it read, what it means,
        and what it was read off
    The spiritual layer: five systems as glyph chips (sun, moon, rising, year animal and element,
        life path, design profile, gene key), with how many comparisons agree
    Numerology, in full
  INTEGRITY OVER TIME (full width): span buttons Day to Five years; the line on a fixed
      0 to 10 axis with first value, direction and last value printed

#sumbody, blank (sumUnread)
  empty coherence ring with an en dash | "Coherence" | one sentence
  the four doors
  the spiritual layer (real or absent)
  (numerology suppressed)

#ana, the folded Analytics (anaRender), always beneath
  hero: coherence ring | the tier word in a sentence about the field |
        Identification figure with the causes widening it in words
  six bubble fields (packed circles, size by magnitude): Masks | Domains | Archetypes |
        What is running | The nine axes | The seven seats   (each bubble opens a drill)
  Moral integrity: 21 short bars; "Shut: <names>." or "None shut."
  N sessions: one bar per session, height is coherence, colour is the darkest seat
  unmeasured laws line: "... still at the default 6, which flatters the score. Answer them in Intake."
  The record: pick any two snapshots and read the distance between them
```

**Why the centre is text and everything energetic goes right:** ruled, "the
centre column becomes text about you, and everything energetic moves right."
The reading is a claim about the person and the story is the evidence for it,
so the person's own words go first.

**Why the plate:** the page was measured at 3,990 pixels and 115 controls with
the person's name first appearing 1.9 screens down inside a numerology
sentence. The page's first job is to say this is you.

**Why the output row:** `ritFor` (what the state calls for) had only been
reachable inside the ritual overlay after a release, so a person who had not
run one had never seen it. And the release card tells the truth about headroom:
on several reference profiles every release the product will ever offer moves
coherence by under two points, so the card names the lever that is not spent.

**Why every scale is on screen:** "You read 13, what does that mean." A title
attribute is not an answer on a phone.

**Why Analytics is folded here:** ruled, to reduce the bar. Analytics kept its
integer and its renderer and lost its tab; `TABREAL` maps it here.

**3. Empty and populated.** Described in the layout above. The empty page is
the four doors. The folded Analytics still draws blueprint derived bubbles
beneath the blank page (flagged, 3.4).

**4. Key interactions.** Open it (ritual builder overlay); Run a release (opens
the run on the named address); Answer the laws (Energetics); any glance ring
(core drill); a domain (matrix cell drill); a seat (seat drill); a spiritual
chip; a numerology row; integrity span buttons; Analytics bubbles (drill in
the rail); the record's snapshot pickers. Archetype and mask rows fall back to
the core drill because they have no drill of their own.

**5. Loop and avatar.** Embody in the gamification mapping (see what moved).
Under the ruled avatar dashboard, Summary is the first sticky block and the
avatar's summary block is a door to this page. The third paragraph is the only
place the avatar reaches the reading. `DESIGN-avatar.md` s1 records that this
paragraph can only ever print an all clear: it reads `pair.becoming` and
`pair.seat`, and a valid pair only carries `be` and `notbe`, so "blocked" is
always empty. That defect is still in `ui/summary.js` on this build. It has
never fired because no UI can write a pair, so the "No avatar has been stated"
branch is what everyone sees. The port must not copy the all clear branch as
written; it becomes dangerous the moment a pair writer exists.

**6. Cognitive load.** Blank 85 total, 4 in the centre (the doors). Derek 123
total, 42 in the centre. The plate and the reading panel are the two things on
the page with a single job each.

**7. Where they stop.** Diane asks in every pass for what moved since last
time; the integrity chart is the only change over time on this page, and the
session bars and the record are below the fold inside Analytics. Angela closes
on the tier word at the low end ("Incoherent", "Corrupt"); the plate prints it
at display colour beside the ring. `DESIGN-mobile-icp.md` director notes: the
two tier words at the low end should "go mechanical" (high resistance, high
load). Not ruled.

**8. Proposed.** `DESIGN-quotients.md` s6: replace the six ring glance row with
one "aperture" figure carrying five quotients (rim, opening, nine blades,
sweep, centre). Whether it replaces the row or sits beside it is OPEN (Q4).

---

### 4.10 Settings (TAB SETTINGS, 9; no door in the bar)

**1. The job.** "Change how it looks, see what is kept about me and where, and
get my record in or out." A standard account page, ruled: "our profile page is
non-standard ... let's get a very standard profile page for a technology such
as this. We don't need coherence and everything else."

**2. Layout.** Reached only from the person icon in the top bar. Both rails are
removed on this surface (`body.tab-settings`). Centre content capped at 980
pixels and centred.

```
eyebrow "Account" | the profile's own name (never title cased: "de Vries is not De Vries")
two columns: index (228 px, sticky) | pane
  index, six sections, each an icon in its own seat colour and a word:
    Account | Display | Security | Privacy | Billing | Help
  pane: section heading, then groups; each group has a heading, rows, a foot note
row types (exactly six, "and there is no seventh"):
    value row     a label and a fact (tabular figures for numbers)
    stub row      full opacity, real label, "not built yet" (or a reason) in the value slot,
                  aria-disabled, never pressable, never dimmed
    action row    a label and one button
    toggle row    a label (and note) and a switch
    edit row      a label and a text field
    group         heading, rows, foot note
Account:  This account (profile name edit, profiles on this device) | Identity (read only, edited
          only on Energetics, with a door there) | The Opening (run the signal test again) |
          Sign In (three stubs)
Display:  Lighting (seven) | Screen (density: Tight, Comfortable, Wide) | Motion (Quiet toggle)
Security: one plain paragraph (nothing is protected by a password today) | five rows, four stubs
Privacy:  "We never sell anybody's data. Ever." | What is held here (nine rows) | This device
          (snapshots, storage writing or blocked) | Who has sight (nobody) | Improve the models
          (off unless turned on) | Load a record (paste or file) | Export and delete
Billing:  the plan (on, state, new ground, "You can see: everything", what every tier includes)
          | Move to <next> | Manage billing | Invoices (stub)
Help:     Ask a question | Report something broken | Rate the product | Product feedback |
          How to read this | Outbox (held on this device) | This build (build and version)
```

**Why a surface and not a sheet:** it was a modal over whatever a person was
reading, which is the right shape for a confirmation and the wrong one for a
place you change something and then look at what changed.

**Why no rails:** two independent passes measured 98 simultaneous choices here,
52 of them the left rail and 12 of them settings, and 69 percent of the phone
scroll spent on the instrument the person had navigated away from. One rule
takes 98 to 27 (measured 23 on this build).

**Why no reading here:** coherence, tier, addresses carrying and markers print
on Summary and in the record. Printing them a third time made a stranger's
account page say "not read yet" four times.

**Why stubs are full opacity and not pressable:** "dim reads as you may not
rather than not yet", and a control that takes a press and then says no is
the dead upgrade button the page already shipped once.

**Why one editor per field:** identity is read here and edited only on
Energetics. "Two editors for one field is two answers to one question."

**3. Empty and populated.** Identical structure; values say "not entered" or
"nobody". Privacy never changes shape.

**4. Key interactions.** Section index; rename profile (refuses an empty name
by name); lighting and density (the same setters as the top bar menu); Quiet;
Improve the models toggle; Load a record (atomic: nothing is replaced until the
record validates, loads and saves; a refusal names the field); Export copies;
Delete (a browser confirm that lists what goes; reports exactly what it did,
"Deleted from this browser. Nothing was held anywhere else."); compose sheets
queue to a local outbox and say so.

**5. Loop and avatar.** None. The onboarding replay is here.

**6. Cognitive load.** 23 total at 1600: 14 top bar plus 9 in the pane on the
Account section. The only surface under the fixed shell cost.

**7. Where they stop.** Sofia's condition for recommending the product to a
client is who else can see a client's record (`DESIGN-mobile-icp.md` pass
five: "the only thing between you and my recommendation"). "Who has sight:
nobody" answers it for today; the grant design is PROPOSED (`DESIGN-profiles.md`
recommends a sealed envelope design) and blocked on four of the owner's
rulings.

---

## 5. Other structural surfaces

### 5.1 The release run (`#rel`, BUILT)

A modal card over any tab, four phases in one host:

1. **Pick.** Eyebrow "Run a release"; "N addresses"; "P patterns of the L you
   have left"; the list; a note stating thought lines, "Right then left, limit
   before truth", and minutes; Cancel and Begin. With nothing left in the
   allowance: "Nothing left to open", the reason, and Open settings instead of
   Begin (no disabled Begin: "the honest reading of a spent allowance is that
   this run does not exist yet").
2. **Opening.** Three lines, one at a time, with dots and "Skip the opening".
3. **Run.** Channel and line number ("Right limit, line 2"); the address name
   in its seat colour; seat and plexus; a side marker; a progress bar; "N of M
   patterns"; Pause, Stop.
4. **Done.** "Released"; "N addresses"; cleared count and weight freed; a log
   of each address with its before and change; what coherence did, and how much
   release has left in it, naming the laws as the lever when it is spent; one
   line on the rebound (day four and a half) and completion (day twenty seven);
   Done, Build a ritual.

Refuses on a reference case with a named reason, rather than writing into a
field the person does not own. Pushes one undo step before the write.

### 5.2 Onboarding (`#ob`, BUILT, automatic open OFF)

Four cards on one sheet: Welcome ("This is you, and it is okay." with the seven
seat figure at rest and two lines); What this is (four short rows); The signal
test (a flat word, then a charged word, then "Where did that one land?" with
seven seat buttons and Nothing); What just happened (what you felt, what it
means, nothing was written to your record). Four dots at the bottom.
`DESIGN-onboard.md` records six defects in the signal test and a stopped
redesign in which the loop ring is the only progress indicator and each Next
turns it a quarter. Onboarding is replayable from Settings and writes nothing
to the reading.

### 5.3 The help sheet (`#sheet`, BUILT)

Four blocks: the three things on screen (the wheel, the left rail, the right
rail); the wheel gestures (scroll, drag, double click or F, click, drag on a
mouse); Reading (CQ, DQ, SQ, Pole in one paragraph); What it does not claim.
`DESIGN-ia.md` s3 specifies a nine section help that is also a door to every
surface. PROPOSED.

---

## 6. Navigation, proposed and open

### 6.1 Two level navigation (PROPOSED, `DESIGN-nav.md`)

```
Ritual      surface 10
Story       surface 0         under it: Summary 1
Tools       container         under it: Field 2, Body 3, Compass 8
Insight     container         under it: Knowledge 6, Games 7
Intake      surface 5         a door at the top of the left rail
Settings    surface 9         no door
Analytics   surface 4         folded into Summary
```

A `NAVBAR` table beside `TABDEF`, keyed by integer; no host moves (grouping is
not folding). **OPEN questions (the owner's):** what a container door does when
pressed (open its first child; open its row only; or open the last child
visited; the recommendation is the first, except that it does not move you if
you are already under it); whether "Insight" is the word (Games is brain
release, not insight); whether the second row is reserved at a fixed 44 pixels
on every surface; whether the alignment rule holds at 390; whether Intake
below the fold on a phone is acceptable. Measured effect: 2 to 5 fewer
choices in the chrome, which the document says plainly is "a navigation fix and
not a cognitive load fix."

### 6.2 The opening surface (OPEN)

Summary (ruled once), Field (ruled 19 September, built), Avatar (ruled 20
September, not built, and then asked again as "replace or sit beside").

### 6.3 The phone composition (PROPOSED, two versions that disagree)

- `DESIGN-mobile.md`: a four slot bottom bar (Field, Story, Summary, More), a
  More sheet for the rest, the depth ladder as one button and a sheet, the
  wheel first and square, labels on the canvas reduced to what reads at small
  radius, bulk sliders and the matrix not rendered on a phone, the 39 number
  fields as read only rows with an editor.
- `DESIGN-mobile-icp.md` pass five: one object, one action, one way back. A
  fixed 52 pixel top bar with the object's name and a back control; one
  primary action at the bottom whose verb follows the state (Write, Read it,
  Run a release, Set a ritual) with a state line above it; navigation as one
  control opening a full screen list of every surface with a line each;
  Energetics as a chromeless linear flow; Knowledge as a search field. The
  panel rejected the four slot bar because Sofia (Knowledge), Angela
  (Energetics) and James (Analytics) each lose their primary surface to the
  More sheet. It also rejects "the centre image is the centre" on a phone:
  four of six put the verb above the picture.

Both agree on: one build, one boolean, no user agent sniffing, drag to charge
off on touch (built), `pan-y` on the canvas (built), and that undo had to exist
first (it now does).

---

## 7. Cognitive load: where it lives and what exists today

The product's standing structural problem is simultaneous choice. The measured
table in section 4 puts the fixed shell alone at 81 to 98 choices on every
surface but Settings, against a target of under twelve and a working memory of
about four. `CLAUDE.md` names it as architectural and needing a decision
first. It is not solved. What exists:

| Mitigation (BUILT) | Where | What it buys |
|---|---|---|
| folding rail sections with a pinned summary line | both rails | a closed section counts once |
| sections seeded open per surface, once | `setTab` | the rail opens what the surface is about |
| rails removed | Settings | 98 to 27 when it landed; 23 measured on this build |
| depth floor at the simplest layer, zoom only adds | Field | the first view is Charge only |
| one law card open at a time | Energetics | at most 33 answer buttons |
| one practice on the card, the rest behind one control | Ritual | 19 to 2 |
| deck strip scrolls instead of wrapping; header cut | Knowledge | rows above the fold 12 to 39 |
| key strip letters in rings, words to tooltips | Field | width, not count |
| undo pair hidden when empty | top bar | 2 fewer when there is no history |
| lighting menu instead of seven buttons | top bar | 7 to 1 |
| names off the hero graphics into rails | Field, Compass, Body | legibility, not count |

What would move it, in order of size, all PROPOSED or OPEN: the left rail
(52, on every surface; nothing is proposed for it on desktop beyond the phone
demotions); a first screen that is not the densest instrument (the avatar
dashboard, prototyped at 6 choices on its own surface); the story page designs
(19 to 7 fixed controls); the container (5 to 7 per state); the phone pass five
composition; Knowledge as search first.

---

## 8. What to instrument

So the next round can tell whether any of this worked. All local counters, no
network (the product makes no outbound request and gate 7 enforces it).

1. **Time from first paint to first input**, and which door or tab it came
   through. The Field's doors are in the rail; on a phone they are three and a
   half screens down.
2. **First session surfaces reached**, per surface, in the first five sessions.
   Anything behind a second press or a scroll is a candidate for "never
   reached".
3. **Story: share of opened journals that reach Commit**, words per commit, and
   stories abandoned with text in the box (`DESIGN-story.md` s10 names this as
   the measure of whether the box "carries the weight of what it is").
4. **Energetics: laws completed per session and drop off by seat group**, with
   the stated duration visible.
5. **Release: runs started from each entrance** (rail button, Story panel,
   Story selection, Summary card), and runs abandoned at Pick.
6. **Ritual: saved, marked done, and days on the record**, separately. Saved is
   a plan; done is a thing that happened.
7. **Drill opens by entrance and by kind**, and whether a drill was followed by
   a back press within four seconds (a definition that did not help).
8. **Knowledge: searches with zero rows**, and which deck was open when a row
   was pressed.
9. **Tooltip reads by name** (the Duolingo move in `DESIGN-information.md`:
   which names a person looks up is the most honest map of what the reading is
   failing to say). Whether to persist this is a privacy ruling and is OPEN.
10. **Unread returns**: how often a person who had a reading returns to the
    first run state (section 3.2).

---

## 9. Open, and whose call (structure only)

The owner's, and not to be guessed by the port:

1. The opening surface: Field (built) or the avatar dashboard (ruled, unbuilt,
   then asked again).
2. What the avatar is: a body (recommended), a light, or a diagram.
3. The loop's station to surface mapping (onboarding prototype against
   gamification table).
4. The story page belief: instrument, mirror (recommended), body, or bench.
5. The container: whether the words rung of practitioner sight exists; whether
   a refused line changes what the sniffer says next.
6. Two level navigation: what a container door does, whether "Insight" is the
   word, the reserved row, the 390 alignment, Intake below the fold.
7. The phone composition: four slot bar or one object, one action, one way
   back.
8. Whether the quotient figure replaces the Summary glance row.
9. Whether a game's own progress may print a count against a total.
10. Whether a drill from Knowledge renders in the centre.

Mine, as the UX seat, to raise before the port copies them: the empty state
leaks in section 3.4 (Knowledge 60%, Body opening on Masks with Flow 100%,
Ritual's root claim, Games dealing zero charge cards, the Field's law spokes
and DQ and SQ at default); the four doors off screen on a phone; the repeated
"4" in the left rail section numbering; "Third Eye" against "3rd Eye" on
Body; the folded Analytics still telling a person to "Answer them in Intake"
when the tab is called Energetics (a destination named with no door); the
ladder printing "0 days, last run" to somebody who has never run; and the
Summary avatar paragraph's guaranteed all clear (section 4.9).
