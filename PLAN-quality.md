# Plan, quality

A response to the five lens review, written by the teams the grades were given
to. Scope C+, discovery D, creative direction B minus, product development C+,
user experience C.

Five lens responses, each in its own voice. Ten refinement passes over the
combined plan, each one attacking its own proposal. One decided plan, sequenced.
The plan tested against the ICP roster and the segment model in `PANEL-10k.md`.
Then the owner's ruling on labels, designed rather than mentioned, with the
seven coherence tiers drafted in full.

**Every claim about the code carries a file and a line and was read this
session.** Nothing was built, nothing else was edited, nothing was committed.

---

## What was verified before anything was proposed

The project's own rule is to reproduce before fixing and to re-measure after. So
the review's findings were checked against the tree first. Three classes came
back.

**Fixed, confirmed fixed, not restated below.** The invented opening charge is
gone: `atuned_src/engine/core.js:86` seeds every axis at 0 and every opposite at
0, the comment above it says why, and `compute()` now returns an `unread` flag
(`atuned_src/engine/compute.js:148`) which `ui/ui.js:264` and
`ui/panels.js:283` both check before naming a tier. The Energy tab renders on a
phone: `atuned_src/shell/head.html:1158` makes `.emap` static inside the 720
band. The wheel no longer eats the scroll gesture: `head.html:259` sets
`touch-action:pan-y` on a coarse pointer. The primary button no longer destroys
a field: `atuned_src/ui/personas.js:250` refuses through `status()` when nothing
is held. Dated firsts survive the boundary: `atuned_src/engine/schema.js:211` to
`:221` filters them and reports what it dropped. The screen scaling control is
out of the bar and in the profile sheet: `#density` is absent from
`atuned_src/shell/body.html` and `atuned_src/ui/panels.js:278` renders
`#densheet` with three named rows.

**Still live, confirmed by reading it today.** Punch loses its selected state:
`head.html:82` sets `background:var(--panel-2)` on `body.punch .vt`, which is
two classes and an element, and the only selected rule is
`head.html:162`, `.vt[aria-pressed=true]`, which is one class and one attribute
and loses. `head.html:87` restores the state for `.ib` icon buttons and stops
there. The fourth root cluster still overflows: `body.html:45` gives `#roots`
`display:flex` with no wrap and `panels.js:159` gives four buttons
`flex:1 1 auto` with `padding:8px 6px`. The release log still caps with a hidden
scrollbar at `head.html:1051`. The density copy still claims more than it does at
`panels.js:277`. The snapshot is still taken after the mutation:
`atuned_src/ui/storyui.js:29` applies the story and `:33` calls `pSnap()`. No
overlay clears on a tab change: `setTab` at `panels.js:66` touches `#rel`,
`#rit` and `#deck` nowhere, and the only Escape handler in the product is
`panels.js:325`, which closes the profile sheet. The clinical subtitles still
reach a person: `HCX_LIB` at `atuned_src/engine/data/nodes.js:8` carries
`bipolar · ADHD` and five like it, `compute.js:100` puts that string on the
hyper complex as `sub`, and `atuned_src/ui/map.js:200`,
`atuned_src/ui/mapshelf.js:33`, `atuned_src/ui/ui.js:40` and `ui/ui.js:374` all
print it. The pain map rasters still do not exist:
`atuned_src/engine/data/figure.js:10` names two files and neither is in the
tree. Rituals are still write only: `atuned_src/ui/ritual.js:70` pushes to
`CURP.rituals` and the only other reference in the tree is the validator at
`schema.js:222`. Dated firsts are still invisible: `meterRead().firsts`
(`schema.js:313`) has no reader in `ui/`, and the release done phase
(`atuned_src/ui/release.js:94` to `:100`) prints the cleared count and the
weight freed and not the firsts. `giftLeft` and `inGift` (`schema.js:298`) have
no reader at all. The design gate still covers five surfaces:
`tests/design.js:9` opens one viewport at 1600 by 1000 and `tests/design.js:40`
loops `i<5`. `tools/terms.py` still exits zero and still reports the empty state
four ways and a held address five ways, measured again today over 713 strings.
The type and motion debt is measurably worse than the review found it: 29
distinct `font-size` declarations across 208 uses in `head.html`, and ten
distinct transition durations, against a `:root` block at `head.html:34` that
tokenises colour, family, radius, touch target, spacing and shadow, and
tokenises neither type nor motion.

**One finding in the review that does not reproduce, and we are saying so.**
The creative direction lens deducted a point because "the chrome inverts cleanly
and the canvas does not". The canvas does invert. `seatCol` switches to
`PAL_LIGHT` on the snow theme (`atuned_src/ui/component.js:19`), `bc()` does the
same for the canvas (`component.js:80`), `INK()` flips the ink
(`component.js:78`), and `wheel.js:89` sets a light ground of `[248,247,243]`
under `LIGHT()`. What is true is narrower: the only theme rule that reaches the
canvas element itself is `head.html:279`,
`body.punch canvas#cv{filter:saturate(1.2)}`, and that is a nudge rather than a
palette. The deduction is corrected and the narrow finding is kept. A tool that
lies is worse than no tool, and that includes a review.

---

# Lens 1. Scope

*Grade C+. Eight tabs, one chrome, three of them not using it.*

## What takes this up

The grade is not a count of tabs. It is that nobody has written down what this
product is, so the chrome cannot tell what belongs in it. Four things take it up.

**1. Name the loop and let the chrome obey it.** The product has one loop and
the engine already runs it: `parseStory` to `compute` to `relPick` to `ritFor`.
Four steps. The chrome presents eight destinations and no route, and the fourth
step of the loop, `ritFor`, writes to an array nothing reads
(`ritual.js:70`). A scope that is a loop can say which surfaces serve it.
Intake, Story, Field, Energy, Analytics and Summary serve it. Knowledge and
Games do not.

**2. Six tabs, not eight, and in this order.** Games is two practice modes, one
of which prints "Not built." to a person (`atuned_src/ui/games.js:230`). The
letting go run is genuinely good and belongs where the intent already is, inside
the release. Knowledge is a searchable dump of the engine's own tables behind
eleven filter pills, and it is the only place in the product where a person can
read `Root_08_Unnamed` subtitled "Cauda Equina, axis unrouted"
(`atuned_src/engine/data/nodes.js:6`, the entry at index 8). A search field
belongs in the help sheet, which `DESIGN-ia.md` section 3 already specifies.
`DECISIONS.md` names knowledge base search as a tool still to be integrated, so
turning the tab into a search is the ruling, not a cut.

**3. The rails are instrument furniture, not chrome.** The left rail is present
at full weight on tabs that never read it. Declare rail consumption per tab in
`TABDEF` and render accordingly. `TABDEF` is display order and may be reordered
and extended freely, and everything looks a tab up by `.k`, so this costs one
field and no identity.

**4. One verb for going deeper.** Field atomises by scroll zoom, Analytics by
clicking a bubble, Energy by a region pill row that draws on top of the row that
launched it. Three interaction languages for one verb. One sheet over the
object, opened by a tap on the object, with the object still lit behind it, is
the grammar `DESIGN-mobile-icp.md` pass five already converged on, and it works
at every width.

## The single highest value move

**Declare the loop, then cut Games and Knowledge as tabs, in that order.** It
removes two top level slots, removes the "Not built." string, removes the
product's only route to an internal placeholder name, and puts the letting go
run where a person already intends to release. Everything else in this lens is
downstream of knowing what the product is.

---

# Lens 2. Discovery

*Grade D. The lowest grade, and the seed of 3 that earned it is fixed. The
grade does not move on that alone, because the reason it was a D was the absence
of instruments, not the presence of one bad value.*

## What takes this up

**1. A story corpus with human judged expected reads.** `tests/engine.js` holds
279 assertions and not one of them is a human story with a human judgement
attached. The entire product rests on `parseStory` mapping prose onto addresses.
Forty stories, each with the imprints a human says should come out, checked in,
and a report of where the engine disagrees. Not a pass or fail gate at first,
because nobody knows the right answer yet. A disagreement count that has to go
down.

**2. A local session ledger, person visible and exportable, never transmitted.**
The machinery is already there. `CURP.history` is written on every commit and
every release and now has four readers (`ui/analytics.js`, `ui/record.js`,
`ui/summary.js`, `ui/panels.js`). Add counted, local, visible answers to three
questions nobody can answer today: did anybody reach the release, did anybody
finish the intake, how many stories were committed before the first release. The
privacy posture is not touched, because nothing leaves.

**3. Five people, once.** The UX skill's own measured floor says five people
surface about 85 percent of problems. The product has had zero. Every finding in
five documents in this tree is a measurement or a simulation, and simulations
have now been run three times. The cheapest remaining instrument is five humans
and an hour each.

**4. Force the five owner questions onto one sheet with a shipping default.**
The product name, what carries selection in Punch, which side the release runs,
what the density control is meant to scale, and whether the tier names change.
Each is one sentence from him and each blocks work. A question with no default
attached is a question that sits for a month, so every one gets a default that
ships if he does not rule.

## The single highest value move

**Build the story corpus.** It is the missing test for the assumption the whole
product rests on, it is cheap, it is headless, and it is the only one of these
four that turns an argument into a number. The review's own probe wrote a story
about a man waiting for a dead father's approval and got Pride, Arrogance,
Competition and Anger back. Nobody can say whether that is right, and until
somebody can, every downstream decision about the Story tab is a guess.

---

# Lens 3. Creative direction

*Grade B minus. Hero is an A. The grade is pulled to the spread, which is
correct, and the spread has one cause.*

## What takes this up

**1. Type and motion into the token block. This is the whole grade.** The
`:root` block at `head.html:34` argues its colour choices from autonomic
response, collapses five spacing values into three steps with the reasoning
written above them, and puts the touch floor in one place so it cannot drift
back into forty padding declarations. That discipline was never applied to type
or to motion, and the result is measurable: 29 sizes across 208 uses, ten
transition durations, three of them within 40 milliseconds of each other doing
the same job. Seven type steps and three duration steps with two curves, argued
in the comment the way the spacing was argued, and every new surface stops
adding to the pile.

**2. `head.html:82`. One rule, one line, a shipped theme with no navigation
state.** Add a punch selected rule that carries state through the seat colour
the icon buttons already use at `head.html:87`. Punch is described as nothing
outlined and everything solid, so the selected state must be a solid fill in a
colour, not a ring. That is a clarifying clause the ruling needs and the fix can
land the moment it exists.

**3. One magnitude grammar and one direction.** Field encodes magnitude as
radial length, Energy as a tick beside a label, Analytics as circle area. Worse
than three encodings, they disagree about direction: on the wheel longer is
worse, and in the rails a high installed pole is good and sits in the same pill
shape as a high held charge. `Shock 7.0` next to `Groundedness 9.3` in red, and
the red one is the good number. Pick one encoding, pick one direction, and let
colour carry polarity instead of shape.

**4. The verdict once.** On Field the same reading appears four times at once:
the pill row, the top right word, the right rail, and the number in the centre
disc. The largest type on the screen is spent on a word the person has already
read twice. One instance, at the centre, where the eye already lands.

**5. Half the bubble marks have no name, and it is now deliberate.**
`atuned_src/ui/analytics.js:70` reads `var t=(p.it.nm.length<=room)?p.it.nm:'';`
with a comment arguing that a truncated name names nothing and costs the ink.
The argument is right and the conclusion is wrong, because the recovery channel
it names is a `<title>` tooltip, and a phone has no hover. A chart where half
the marks are anonymous is not a chart. Leader lines outside the pack, which
`ui/wheel.js` already does well enough to pass `tests/collide.js`, or a
different form.

## The single highest value move

**Put type and motion in `:root` and then fix `head.html:82`.** The first is the
system debt that makes every other visual finding recur, and it is the hard
dependency under M4, which is the hard dependency under M5. The second is a one
line correctness fix on a theme the owner personally ruled in.

---

# Lens 4. Product development

*Grade C+. The gate tests five of seventy two surface combinations and the
product is about to add surfaces faster than the gate grows.*

## What takes this up

**1. Widen `tests/design.js` before anything else is built.** Eight tabs, three
themes, three widths. Seventy two combinations, of which the gate visits five,
and the five are the oldest. That one fact explains the Punch selection failure,
the phone Energy collapse before it was fixed, and the unlabelled bubbles. It is
cheaper than any single fix it would have caught. It is also the precondition
for every other item in this plan, because five of the five lenses propose
changes to surfaces the gate does not look at.

**2. Assert measured numbers, not pixels.** The gate should carry, per
combination: the count of distinct font sizes, the contrast of the selected
navigation label, the top of the primary action, the stage height, the count of
marks without names, and the count of interactive elements under the 44 pixel
floor. Those are the numbers this review and the three before it were written
out of. A pixel diff on a float heavy canvas will flap, and this project's own
rule says a tool that lies is worse than no tool.

**3. Move one line and undo gets cheaper.** `storyui.js:29` applies the story
and `:33` calls `pSnap()`, so the history holds only post apply states. Moving
`pSnap()` above `applyStory` gives the exact pre mutation state undo needs,
using machinery that already persists. That does not make undo free, because the
surface work is real, but it moves the arithmetic half from medium to trivial
and the backlog should say so.

**4. M4 is a hard dependency of M5 and should be recorded as one.** The web quiz
is sized as mostly reuse. It cannot ship a page: there is no brand mark, no
favicon, no ruled product name, and the type system is one blocked request away
from system-ui, because `head.html:7` links Google Fonts with no `@font-face`
fallback anywhere in the file. Two independent arguments, the privacy posture
and the single point of failure, both land on the same fix.

**5. Cost the label content model as a content milestone, not a copy pass.** It
is roughly 4,900 words of owner voice prose, it is a seven times increase in the
product's visible text, and `tools/terms.py` already reports the empty state
four ways in 713 strings. Writing 4,900 more words with an advisory terminology
tool is how one word per concept dies. `terms.py` becomes a gate before the
first tranche lands, not after.

## The single highest value move

**Widen the gate, with measured assertions, before adding a surface.** Four of
the defects in the five lens review were reachable by that loop, and the product
is one milestone away from auth, a paywall and a practitioner view.

---

# Lens 5. User experience

*Grade C. It diagnoses before it listens, asks for what it cannot use, and hides
the one thing it is for.*

## What takes this up

**1. One object, one action, one line, at every width.** The zero state is fixed
and the first screen is now honest, and honest is not the same as usable. There
is still no route. `ui/ui.js:459` boots to Field, the densest surface in the
product, and nothing points at Intake. The fix is a state line and one primary
control whose verb changes with the state, fixed at the bottom of the instrument
column at every width:

    Nothing held                  Write what happened            Write
    A story written, not applied  3 seats loaded from what you wrote   Read it
    Seats held, nothing released  Heaviest seat: fear, lumbar plexus, 6.2   Run a release
    Release finished              4 patterns cleared, field down 1.8   Set a ritual

Nothing new is computed. `compute()` already returns everything the line needs.
This one control closes four separate findings: no route, no completion, the
release at the bottom of the rail (`body.html:149`), and the empty cost line
that four segments and three panels have asked for.

**2. Explanation has to survive a finger.** Every control that explains itself
does so through a `title` attribute: the depth buttons, the blueprint domains,
the root clusters at `panels.js:161`, the archetypes. The tier label's own
definition is a hover title at `ui/ui.js:260`. A touch device has no hover, so
on a phone this product explains none of its own controls, including the one
that names the person. Every explanation gets a tap path, which is the same
sheet the deeper verb uses.

**3. Fix the ask to use ratio or stop asking.** Intake collects first, middle
and last name, sex at birth, date, time and place of birth, framed as the
foundation of the reading. `CURP.who.born` is written at
`ui/intakeui.js:130`. The ascendant resolves against nine hard coded keys in
`PLACE` (`atuned_src/engine/astro.js:144`), all nine of which are a reference
persona's birthplace, so a real person's ascendant is permanently null. The
middle name is read by nothing anywhere. Either widen the gazetteer or cut the
fields. Collecting the most identifying data the product will ever hold and not
using it is the wrong side of the product's own strongest promise.

**4. Undo, and the dismissal contract.** Three irreversible writes and no shared
surface. And a confirmation dialog for a destructive action can be carried to
another tab, because `setTab` at `panels.js:66` clears no overlay and the only
Escape handler is the profile sheet at `panels.js:325`.

**5. Labels stop standing alone.** This is the owner's ruling and it is designed
in full at the end of this document. It is in this lens because it is a user
experience item before it is a content item: the product hands a person a word
and the person has nowhere to go with it.

## The single highest value move

**The state line and the one primary action, at both compositions.** It is the
route, the completion, the release's promotion and the cost line's home, and the
engine already computes every value it prints.

---

# Ten refinement passes

Compressed. Each pass proposes, attacks its own proposal, and carries forward
only what survives. What each pass killed is named.

### Pass 1

**Proposal.** Ship the five highest value moves as one release: cut two tabs,
build the story corpus, tokenise type and motion, widen the gate, ship the state
line.

**Attack on it.** Four of those five change surfaces, and the gate covers five
of seventy two surface combinations. Four of the five would ship unverified, in
a review whose central product development finding is that exactly this has
already happened three times.

**Survives.** The gate goes first, alone.
**Killed.** The simultaneous release. Sequence is now load bearing.

### Pass 2

**Proposal.** Gate, then tokens, then the state line, then labels, then
discovery.

**Attack on it.** Tokenising 208 type declarations against a widened gate with
no baseline produces seventy two screenshots nobody has looked at and assertions
that pass because they were written after the change. The gate has to hold a
recorded starting state or it cannot tell a fix from a regression.

**Survives.** The gate's first job is a checked in baseline of measured values
per combination, produced before any token work.
**Killed.** Tokens before a baseline.

### Pass 3

**Proposal.** Make the baseline a screenshot set with pixel diffs.

**Attack on it.** The wheel is a float heavy canvas with a radiance term, a zoom
transform and a seat colour mix. Pixel diffs will flap, and a flapping gate gets
switched off inside two weeks. This project has already had two probes report
defects that were the probe's own bug.

**Survives.** The baseline is numbers: distinct font sizes, selected navigation
contrast, primary action top, stage height, unnamed mark count, sub floor
control count. Screenshots stay as the thing a human looks at, which is what
`tools/shots.js` is already for.
**Killed.** Pixel diffing, permanently, with the reason recorded.

### Pass 4

**Proposal.** The state line and the primary action ship on the phone
composition only, where the review's weakest screen is.

**Attack on it.** The grade is pulled to the spread, not the average. A control
that exists on one composition and not the other makes two products and widens
the hero propagation gap, which is the exact thing the creative direction lens
graded down. And `DESIGN-mobile-icp.md` already found that two of six ICPs and
one of three edge cases have one device, so a phone only control is not a
degraded mode for them, it is the product.

**Survives.** One control, both compositions, same state machine, same words.
**Killed.** Phone only anything, as a category.

### Pass 5

**Proposal.** Build the label content model as one new data file carrying full
entries for every label the product prints.

**Attack on it.** That is 290 labels across fifteen classes. At the rate already
measured in the tree, `TIERDEF` runs 362 words for seven entries, it is roughly
13,000 words of owner voice copy before any of it is ruled on, and it lands as
bytes in a single file build. It also blocks every other phase behind a writing
job that has no deadline.

**Survives.** Four tranches. The ruling's own six classes first, 73 labels, of
which 40 are already carried by `TIERDEF` (`canon.js:213`) and `SABDEF`
(`atuned_src/engine/data/kb.js:16`), so the first tranche is 33 labels. The rest
derive or wait, and the plan says which.
**Killed.** Writing all of them, and any schedule that depends on writing all of
them.

### Pass 6

**Proposal.** Derive the missing entries mechanically from data the engine
already holds: `NODES` carries a governance word and a distortion word per
address, `CHILD` carries the coherent opposite, `DOMDEF` carries clear and
distorted per domain.

**Attack on it.** That is the seeded 3 again in a different coat. A generated
definition is a fabricated one, presented in a product whose whole claim is
mechanical defensibility, and the review's single strongest finding was that a
fabricated opening verdict is the fastest way to lose the buyer this product
targets.

**Survives.** Derivation is allowed only where the output is a restatement of a
fact the engine computed, and it must say so on the surface. An address entry
composed from its axis entry plus its own two data words qualifies and is
labelled as composed. A tier, a hyper complex, a mask, an axis or an archetype
does not.
**Killed.** Generated copy for every class a person is named by.

### Pass 7

**Proposal.** Delete the clinical subtitles from `HCX_LIB`.

**Attack on it.** They are the owner's data, they carry real information for a
practitioner, and deleting data to fix a surface is a fix at the wrong layer.
The panel's own note routes it to the surface, not to the table: the strings
belong in a practitioner or developer view.

**Survives.** `sub` stays in the data and is scoped out of every person facing
surface. `map.js:200`, `mapshelf.js:33`, `ui.js:40` and `ui.js:374` read the
label's three part entry instead, which is the thing that should have been there
anyway. One flag on the render path, not a deletion.
**Killed.** Deleting `HCX_LIB.sub`, and the habit of fixing data to fix a view.

### Pass 8

**Proposal.** Cut Games and Knowledge as tabs now, in the first phase, since
both are pure removal.

**Attack on it.** Neither is pure removal. The letting go run deals 24 cards
from the person's own field and it is good, and it has nowhere to live until the
release overlay can host it. Knowledge is the surface behind a `DECISIONS.md`
tool that has not been built, so cutting it before the search exists removes a
promise rather than a tab.

**Survives.** Order. Fold the run into the release overlay and prove it there,
then drop the Games tab. Build search in the help sheet, then drop the Knowledge
tab. The "Not built." string at `games.js:230` goes in the first phase on its
own, because a product should not print that to a person for one more day.
**Killed.** Cutting as a first move. Two removals became two migrations.

### Pass 9

**Proposal.** Ship mechanical tier names, high load and high drag and high
resistance, together with the tier entries.

**Attack on it.** The tier names are the owner's call, and `PANEL-10k.md` prices
them as the single largest commercial item in the file, 1,645 of the 1,948 who
reach a score in its scenario B. Shipping a rename inside an engineering pass
steals a decision that is his. And the rename would drift the moment it landed,
because `compute.js:137` still carries a second copy of the tier table and the
comment at `canon.js:244` claims the copy was removed.

**Survives.** Fix the duplication first, so the name is one field in one table.
Then the rename is a data edit he can make in a minute, and the panel's cost
goes to him with it on a one page name sheet.
**Killed.** Renaming without a ruling, and the assumption that the tier table
has one home already.

### Pass 10

**Proposal.** The sequence: gate and baseline, one line correctness fixes,
tokens, the route, labels tranche one, then the loop's missing end.

**Attack on it.** Discovery is still last in everything but name. The label work
leans on the parse being right and the state line leans on the reading being
believed, and neither assumption gets tested until after both are built. A D
grade lens does not get fixed by scheduling it fifth.

**Survives.** The story corpus moves up beside the gate, because both are
instruments, both are headless, both are cheap, and everything after them is
judged by them. Five people move up to sit beside the route, because the route
is the thing five people would break in an hour.
**Killed.** Discovery as a phase. It becomes two instruments in phase zero and
one test beside phase three.

---

# The decided plan

Sequenced. Each phase is a state worth stopping at, named by what becomes true.
Nothing here needs a ruling to start except where it says so.

## Phase 0. The instruments. Nothing is judged by an eye alone.

1. **`tests/design.js` widened to eight tabs, three themes, three widths.**
   Seventy two combinations against the five at `tests/design.js:40`.
2. **A measured baseline, checked in.** Per combination: distinct font sizes,
   selected navigation contrast, primary action top, stage height, marks without
   names, controls under 44 pixels. Numbers, not pixels.
3. **`tools/terms.py` exits non zero.** It measures the rule this codebase
   breaks most and it is the only advisory tool in the set.
4. **`tests/stories.js`.** Forty stories with human judged expected imprints,
   and a disagreement count that has to go down.
5. **CI.** 522 assertions across four gates and nothing runs them.

**Not built here.** Pixel diffs. Killed in pass 3 with the reason recorded.

## Phase 1. Nothing a person can reach is wrong or unsayable.

Every item is a small correctness fix and every one is already located.

1. `head.html:82`, the Punch selected state. Blocked on one clarifying clause
   from the owner: what carries selection when nothing is outlined. Default that
   ships if he does not rule: a solid seat colour fill, as `head.html:87`
   already does for icon buttons.
2. `body.html:45` wraps, and `panels.js:159` stops overflowing a card. The
   fourth root cluster reads as a whole word.
3. `head.html:1051`, the release log gets an affordance or wraps. A header that
   counts eight above seven visible rows is on the confirmation screen of the
   product's irreversible action.
4. `panels.js:277`, the density copy says what the control does. A control must
   never claim more than it has.
5. `storyui.js:33`, `pSnap()` moves above `applyStory` at `:29`.
6. `panels.js:66`, `setTab` clears `#rel`, `#rit` and `#deck`. Escape and a
   backdrop click dismiss all three.
7. `games.js:230`, the "Not built." string goes. The mode goes with it or the
   mode ships, and it is not shipping in this phase.
8. `figure.js:10`, the two dangling raster references go and the vector body
   becomes the pain map in fact as well as in practice. It is what has always
   rendered. Whether he wants the rasters inlined as base64 later is his call
   and the bytes are the argument.
9. **The clinical subtitles are scoped out of every person facing surface.**
   `map.js:200`, `mapshelf.js:33`, `ui.js:40`, `ui.js:374`. The data stays.
10. **A route out, on the reading, when the reading is low enough.** Two lines
    and a destination, above anything else on the surface, at Severe and
    Collapsed. `PANEL-10k.md` puts 180 people of 10,000 in a state where a
    number, a band name and an offer can do harm, and says the route must exist
    before a paid tier. There is no paid tier yet, which makes this the cheap
    moment. **The destination is the owner's to supply and the product must not
    invent one.**
11. **One honest line when nothing is held.** For the person the instrument is
    not for. One sentence buys more than a pitch.

## Phase 2. The product looks like one thing.

1. **A type scale in `:root`.** Seven steps, argued in the comment the way the
   spacing scale is argued at `head.html:51`. 29 sizes across 208 uses collapse
   into it.
2. **A motion scale in `:root`.** Three durations, two curves. Ten durations
   collapse into it. `prefers-reduced-motion` already holds.
3. **One magnitude encoding and one direction**, across the wheel, the axis rows
   and the bubbles. Colour carries polarity, shape carries magnitude, and
   bigger always means more held.
4. **The verdict once on Field**, at the centre.
5. **Bubble marks get their names back**, by leader line or by a different form.
   Dropping the name and recovering it through a hover title is not a recovery
   on a phone.

## Phase 3. A person arrives, knows what to do, and finishes something.

1. **The state line and one primary action**, both compositions, verb changing
   with the state. The release stops being the last 65 pixels of the page.
2. **The cost line under the reading.** Asked for by four segments across three
   panels, and the slot has been empty in all three. `CURP.history` has four
   readers and `p.updated` is stamped on every save, so a delta between this
   session and the last is buildable with no new architecture. If it cannot be
   computed honestly, the product says so in the slot rather than leaving it
   blank.
3. **Every explanation gets a tap path.** The sheet is the one deeper verb, and
   the hover title stops being the only channel.
4. **Five people, once**, against this phase. Not after it.

## Phase 4. A label never stands alone.

Specified in full at the end of this document.

1. The duplicate tier table at `compute.js:137` is deleted and `tierOf()` at
   `canon.js:246` becomes the only one.
2. Tranche one: 33 entries. Nine axes, six masks, six hyper complexes, twelve
   archetypes.
3. `SABDEF`'s four fields are mapped onto the three slots, so a saboteur and a
   tier read the same shape.
4. Every surface that prints a name reads the entry. `terms.py` is a gate before
   this lands, because this phase is where one word per concept dies if it is
   going to.

## Phase 5. The loop has an end, and a mistake is not permanent.

1. **Undo**, as a surface and not only a function, over all three irreversible
   writes.
2. **The ritual log read back**, with a when and a where in the person's own
   words. `RESEARCH-ladder.md` puts the effect size on the if then plan higher
   than anything else in that document and the code is three quarters there at
   `ritual.js:69`.
3. **Firsts rendered.** Written at `schema.js:326`, returned at `schema.js:313`,
   read by nobody. A dated list of facts, no empty slots, no progress bar.
4. **The gift and the allowance** shown as what is available. `giftLeft` and
   `inGift` exist at `schema.js:298` and have no surface.

## Phase 6. Six tabs.

1. The letting go run moves inside the release overlay and is proved there.
2. Knowledge becomes a search in the help sheet.
3. The two tabs come out. `TABDEF` reorders freely and the TAB integers do not
   move.
4. The rails declare per tab consumption.

## Deliberately not built, with the reason

- **Pinch zoom and the touch gesture set on the wheel.** It is the largest single
  piece of work in `DESIGN-mobile-icp.md` and it makes an irreversible write
  easier to trigger than a mouse does. It waits for Phase 5's undo and for a
  gate that covers touch. Named cost: Angela and Ana cannot atomise until then,
  and atomising is how a person separates addresses.
- **The practitioner panel, consent list and revocation.** The highest value
  segment in the panel is waiting on it and it is a different application wearing
  this one's chrome. It needs designing before building and three of its inputs
  are `DECISIONS.md` items, not engineering.
- **The paywall.** It cannot be designed until the pattern question is ruled,
  because the price is per pattern.
- **Streaks, points, levels and push.** `RESEARCH-ladder.md` settled it.
- **A comparison.** `S5` is the only segment that converts on one and it corrupts
  the instrument. The ruling is right and the plan does not revisit it.
- **The tier rename.** His, with the panel's cost attached.
- **The cosmological layer beyond a wider gazetteer.** Either the place lookup
  gets a few hundred normalised cities or the birth fields come out. Both are
  one decision and the plan does not pick it.
- **The developer analytics view.** A MANIFEST question. It never ships to a
  person's build.

---

# The plan, tested against the roster

A plan nobody attacked is not a plan. This is the plan walked against the six
ICPs, the three edge cases and the seventeen segments. Every figure quoted from
`PANEL-10k.md` is simulated model output and is not evidence about anybody.

## Where it holds

| Who | Segment | What the plan gives them |
|---|---|---|
| Diane, 46, founder | S1, 520 | Phase 3. A 40 second status check is exactly one object, one line, one verb. The cost line is the thing she buys |
| Marcus, 44, creative director | S3, 430 | Phase 2. He judges on first contact and the spread is what he is judging. Tokens are his grade |
| Derek, 39, endurance | S2, 470 | Phase 3 and Phase 5. A protocol, a count, and a release he can reach |
| Trey, 26, tourist | S13, 2,070 | Nothing built and nothing taken away, which is the ruling |
| Rosa, 61, settled | S15, 300 | Phase 1 item 11. One honest line |
| Dr Gwen, 36, clinician | S11, 290 | Phase 1 item 9. The clinical subtitles stop reaching a person, which is the fastest refusal in the panel and it takes 340 practitioners with it |

## Where it fails, named

**1. Sofia and the practitioner economy. The largest failure in the plan.**
S4 and S12 are 600 people, 6.0 percent of the panel and 33.5 percent of
simulated revenue in scenario B, and this plan builds nothing they need. Her
buying gate is the retrieval question: who can pull a client's record out, and
can she revoke it. The plan defers the practitioner panel, the consent list and
revocation with a reason, and the reason does not pay her. **Stated plainly: six
phases of instrument work leave the highest value segment exactly where it was.**
The one thing the plan does give her is Phase 4, because a label with a
definition, a behaviour and a direction is the surface she puts in front of a
client. That is real and it is not the gate.

**2. Angela and Ana cannot atomise.** Both are one device people and for them
the phone is the product, not a mode of it. Phase 3 gives them a route and Phase
2 gives them a legible one, and pinch zoom is deliberately not built, so the
`DECISIONS.md` mechanism for separating addresses is unreachable on their only
device. Accepted, with the cost written down.

**3. Ana at two in the morning still reads a word about herself.** Phase 1 puts
a route out in front of the lowest readings and Phase 4 gives the word a
definition, a behaviour and a direction. Neither removes the word. Her engine
anchor is CQ 7.6 and her mask can read Predatory. The tier rename is the owner's
and the plan does not take it, so **the product's worst sentence to its most
exposed person survives this plan.** The plan's honest position is that Phase 1
item 10 and Phase 4 make it survivable and only a ruling makes it right.

**4. James, correctly unserved, and the plan does not say so out loud enough.**
S5 is 210 people and 0.1 percent of simulated revenue in scenario B, and the
only thing that converts him is a comparison the product will not build. The
plan spends nothing on him, which is right, and no document in this tree has
told him he can leave. One line, same as Rosa's.

**5. Derek gets a slot and not a number.** Phase 3 ships a cost line. The
arithmetic behind output recovered does not exist and S2 and S10 are 790 people
who will run the division in public. If the delta cannot be computed from
`CURP.history` honestly, the slot says so, and saying so loses him. That is a
real risk the plan accepts because the alternative is inventing a number, which
is the finding that opened the whole review.

**6. The plan raises grades and does not raise revenue.** `PANEL-10k.md`'s
scenario B reaches 148 payers through four fixes, and three of them are the
funnel: state the duration and show the remainder, pay the score on the web,
price from the anchors. None of the three is in this plan, because none of them
is a quality item. The plan's fourth fix, mechanical tier words and a cost line
under the score, is the largest single marginal gain in that model at plus 35 of
148, and this plan builds half of it and hands the other half to the owner.
**The owner should read this plan as the quality plan it is and not mistake it
for the commercial one.**

**7. The product still has four names.** Phase 2 is the identity phase and it
cannot produce a mark, a favicon or a wordmark without a name. The plan puts the
name on the decision sheet in Phase 0 with a default, and if the default is not
overruled the plan ships it. That is the least comfortable item in this document
and it is better than a fourth month of four names.

**8. Gordon, and the plan does not try.** 690 people. No copy reaches them and
every attempt to soften the opening costs S2 and S8, who are 1,230 people. The
plan writes nothing for him and this sentence is the record that the decision
was made.

## The one change the test forced

The route out of the low readings moved from unbuilt to Phase 1. It was going to
sit behind the paywall design, on the grounds that the panel argues it as a
precondition for a paid tier. Reading it against Ana, the argument runs the other
way: there is no paid tier yet, which means there is no pressure on it, which
makes now the cheap moment and later the expensive one. It is two lines and a
destination and it belongs beside the other correctness fixes.

---

# The label content model

**The ruling.** When this product hands a person a label, the label carries
three things or it does not go on screen. A definition, so the word means
something specific. The energy and behaviour, so a person can recognise it in
their own week rather than take it on trust. And what we are trying to get them
to, so a label is a position and never a verdict.

**What already exists, verified today.** The ruling has a beginning in the tree.
`canon.js:213` holds `TIERDEF`, seven entries with `def`, `energy` and `toward`,
marked in the comment above it as a draft for the owner to rule on.
`canon.js:245` holds `TIER_BY` and `canon.js:246` holds `tierOf`. Two surfaces
read them: `ui/ui.js:259` as a hover title, and the compass drill at
`ui/drills.js:310` which prints all three parts under three eyebrows. And
`kb.js:16` holds `SABDEF`, which carries `d`, `t`, `q` and `i` for all 33 named
saboteurs, which is the same model under different field names. So the structure
is proved and the coverage is not.

## The record

One shape, for every class. It lives in `engine/`, never as a string in a
renderer, and it is reached by one lookup, as `TIER_BY` already is.

    nm        the word the product prints
    at        where it applies. A threshold, a range, or a membership.
              Already in the engine for every class
    def       what the word means here. One or two sentences. Mechanical.
              No adjective about the person
    energy    how it shows up in a week. Behaviour a person can check against
              their own days. Present tense, second person
    toward    the next state, named, and the first move toward it. A state the
              engine can compute, so the direction is checkable

Three fields already in use stay, on the classes that have them:

    q         what it says, in the first person. Saboteurs
    t         when it fires. Saboteurs
    i         the interrupt. The only part a person can act on in the moment
    auth      the authored composition. `SABAUTH`, canon.js:12
    sub       the clinical composition. Practitioner and developer surfaces only

One field is new and appears on two entries in the whole product:

    out       the handoff. Present only where the reading is low enough that
              the instrument should not be the thing a person is using tonight.
              The destination is the owner's to supply

## The rules

1. **No label renders without `def`, `energy` and `toward` reachable from where
   it renders.** A label with no entry does not go on screen. This is the same
   rule as "a control must never claim success before it has it", applied to a
   word instead of a save.
2. **Reachable means a tap.** A `title` attribute is not a channel. `ui.js:260`
   currently puts the tier definition in one, and a phone has no hover.
3. **`toward` names a computed state.** Not encouragement. The engine can check
   whether the direction was taken, which is what keeps it from being a wish.
4. **No moral adjective inside `def` or `energy`.** The name may still be one
   until the owner rules. The entry is what stops it standing alone.
5. **One word per concept holds inside the entries.** 4,900 new words is the
   largest terminology risk this project has taken. `terms.py` gates the tranche.
6. **A poled duplicate derives `def` and `energy` from its base and writes its
   own `toward`.** Coming off an overshoot is not the same move as clearing a
   collapse, so the direction cannot be inherited.
7. **Composition is allowed only where it restates a computed fact, and it says
   so.** An address entry may be composed from its axis entry plus its own two
   data words. A class a person is named by may not be composed at all.
8. **`sub` never reaches a person.** Data stays, surface is scoped.

## Every class it applies to, counted

Fifteen classes, 290 labels. The six the ruling names are first.

| # | Class | Count | Where it lives | Carries now | To write |
|---|---|---|---|---|---|
| 1 | Coherence tiers | 7 | `canon.js:213` | def, energy, toward. Draft | 0, pending a ruling |
| 2 | Saboteurs, named | 33 | `canon.js:8`, `kb.js:16` | d, t, q, i for all 33 | 0, map the fields |
| 3 | Nine axes | 9 | `canon.js:93` | opposite, plexus, location | 27 |
| 4 | Masks | 6 | `canon.js:189` | name and seats only | 18 |
| 5 | Hyper complexes | 6 | `nodes.js:8` | clinical subtitle only | 18 |
| 6 | Archetypes | 12 | `canon.js:163` | one verb phrase each | 36 |
| 7 | Saboteurs, overshot | 33 | generated, `compute.js:84` | nothing | 33 `toward` |
| 8 | Family poles, overshot | 6 | `core.js:15` | "overshoot of X" | 6 `toward` |
| 9 | Saboteurs, inferred | 9 | `canon.js:124` | an agent noun each | 9 `toward` |
| 10 | Seats | 7 | `canon.js:66` | a glyph each | 21 |
| 11 | Laws of integrity | 21 | `canon.js:179` | a seat each | 63 |
| 12 | Blueprint domains | 19 | `canon.js:138`, `kb.js:17` | clear and distorted | 19 `toward` |
| 13 | Root clusters | 4 | `canon.js:133` | a hover title | 12 |
| 14 | Gates | 6 | `verp.js:8` | one line each | 12 |
| 15 | Addresses | 112 | `nodes.js:6` | governance and distortion word | 0, composed |

**The ruling's own six classes are 73 labels, and 40 of them are already
carried.** Tranche one is 33 labels and 99 strings. That is the number that
matters, and it is small.

## What it costs to write them all

Measured, not estimated. `TIERDEF` is 2,113 bytes and 362 words for seven
entries, so one entry runs about 52 words and about 300 bytes of source.
`SABDEF` is 12,474 bytes for 33 entries across four fields.

| Tranche | Classes | Labels | Strings | Words | Bytes | Effort |
|---|---|---|---|---|---|---|
| One | axes, masks, hyper complexes, archetypes | 33 | 99 | ~1,700 | ~10 KB | Two days of writing, one ruling pass |
| Two | overshot saboteurs, family poles, inferred | 48 | 48 | ~700 | ~4 KB | One day |
| Three | laws, seats, domains, roots, gates | 57 | 127 | ~2,500 | ~15 KB | Three days |
| Four | addresses | 112 | 0 | 0 | ~1 KB | Half a day of code |
| | | **250** | **274** | **~4,900** | **~30 KB** | |

**Three things the owner should weigh.**

**Bytes.** `source.html` is 546 KB today. The whole label model adds about 30 KB
of source, roughly 5 percent, and that is before the Google Fonts decision,
which would add far more if the three families are self hosted as base64. These
two byte arguments are now on the same page and they are the same budget.

**Voice.** 4,900 words is roughly seven times the product's current visible
prose, measured against the 713 strings `terms.py` pulls today. Every one has to
be mechanical, physically located, free of wellness language, and consistent in
its terms. This is the real cost and it is not the bytes.

**Ruling.** Tranche one cannot be written into shipping copy until the owner
rules on the tier names, because the tier entries are the template every other
class copies and `toward` on every class points at a tier name.

---

# The seven tiers, drafted in full

**This is a draft for the owner to rule on.** The structure is settled. The
wording is not, and the seven names themselves are his: `PANEL-10k.md` prices
the low band vocabulary as the single largest commercial item in the product,
at 1,645 of the 1,948 who reach a score in its simulated scenario B.

Where this draft differs from the one already in the tree at `canon.js:213`, the
difference is named under the entry. The thresholds are the engine's own, from
`compute.js:137` and `canon.js:213`, and they do not move here.

---

### Mastery. CQ 90 and above.

**What it means.** Almost nothing is held and nearly every law reads at the top
of its range. This band describes that condition and nothing about the person in
it. It is reachable only with essentially no load, which is why almost nobody
reads here, and the instrument says so rather than presenting it as a
destination.

**How it shows up.** Intention and action arrive together. There is no gap left
between deciding and moving, so there is nothing in the gap to manage.

**Where it goes.** Nowhere. The work here is holding it, and what you can carry
for somebody else.

*Differs from the tree: the reachability is stated. `PANEL-10k.md` records that
Mastery is arithmetically out of reach for anybody carrying load, and a top band
presented as a destination that cannot be reached is decoration. Either it says
what it is or it comes off the ladder.*

---

### Embodied. CQ 70 to 89.

**What it means.** The field builds more than it costs, with real load still in
it.

**How it shows up.** A charge lands and clears instead of staying. You recover
inside a day, and you can usually name what it was.

**Where it goes.** Mastery. Close the laws still shut, and check what is still
held a week after you released it. The week is the test, not the session.

---

### Practicing. CQ 50 to 69.

**What it means.** What the field builds and what it spends are close to level.

**How it shows up.** Good days and hard days, and the difference is mostly which
address was running that day rather than anything that happened.

**Where it goes.** Embodied. Consistency rather than intensity. The same address
twice beats eight addresses once.

---

### Incoherent. CQ 31 to 49.

**What it means.** The field costs more than it builds. Charge is held at more
addresses than are clearing. The word is a reading of the field and not a
judgement of the mind.

**How it shows up.** Effort goes in and less comes out. You are working, and a
share of the work is going into the holding.

**Where it goes.** Practicing. Take the heaviest seat first. One address cleared
where the load actually sits moves this further than ten cleared anywhere else.

*Note for the ruling: this is the word Dr Gwen reads at CQ 48.8 with nothing
loaded and high law compliance, because the arithmetic divides a mid range
intention by a mid range integrity. The entry is what keeps that from being an
insult. A renamed band is what keeps her from writing about it.*

---

### Corrupt. CQ 21 to 30.

**What it means.** The held charge is shaping decisions now, not only mood. The
word measures how far the signal is bent on the way out. It is not a statement
about your character.

**How it shows up.** The pattern chooses before you do. You can see it
afterwards and not while it runs.

**Where it goes.** Incoherent, then Practicing. The move is interruption: name
the address while it is running, ahead of the behaviour, not after it.

*Note for the ruling: this is the word a 26 year old with nothing loaded and no
crisis is handed, and the screenshot that travels furthest is the one that says
Corrupt. The sentence "it is not a statement about your character" is doing work
that a different word would not need to do.*

---

### Severe. CQ 1 to 20.

**What it means.** Most of the field is carrying and very little is clear. The
word measures how much is held and nothing else.

**How it shows up.** Ordinary demands read as threats. Capacity is spent before
the day starts, and the things that used to cost nothing now cost something.

**Where it goes.** Off the floor, and nothing more ambitious than that. One
seat, one address, one line. Not a programme.

**If you need something other than this.** *[The handoff line and its
destination are the owner's to supply. The product must not invent one. Two
lines, above everything else on the surface, and no offer anywhere near it.]*

---

### Collapsed. CQ 0.

**What it means.** The field is fully loaded. Nothing is clearing.

**How it shows up.** Flat. Not calm, out of charge.

**Where it goes.** Weight off, and not on your own. A reading this low is not a
thing to carry by yourself and the instrument will not pretend otherwise.

**If you need something other than this.** *[Same handoff. Same rule.]*

---

## What has to be true before these ship

1. **The duplicate tier table goes.** `compute.js:137` carries a second copy of
   the thresholds and the names. The comment at `canon.js:244` says the table
   stopped being copied into renderers, and it is still copied into the engine.
   Rename anything today and the two drift silently.
2. **The entry is reachable by a tap.** `ui.js:260` puts it in a hover title.
   That is not a channel on the device most of this audience arrives on.
3. **`out` has a destination.** Not a placeholder, not a search link, not a
   number the product guessed. Owner supplied, and Phase 1 does not close
   without it.
4. **The names are ruled.** Everything else in the label model copies this
   template, and `toward` on every one of the other fourteen classes points at
   one of these seven words.

---

## The one page the owner has to sign

Five sentences, each blocking work, each with a default that ships if he does
not rule.

| Question | Default if unruled |
|---|---|
| What is the product called | Atüned, with SOURCE as the engine's name, and the browser tab matches the wordmark |
| What carries selection in Punch | A solid seat colour fill, as `head.html:87` already does for icon buttons |
| Do the seven tier names change | They stand, and the entries carry them |
| Where does a person go from the two lowest readings | Phase 1 does not close. No default is possible and none will be invented |
| What is the density control meant to scale | The copy at `panels.js:277` is narrowed to what the control does |

Every other open item in this plan is already recorded as his in
`DECISIONS.md`, `TASKS.md` section C or `CLAUDE.md`, and this plan does not
reopen any of them.
