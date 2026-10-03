# Review. The Release, Seven Passes

Creative direction, with the whole team's seats. Written against the build at
commit 0617b78, `source.html` md5 `eee5a98e1fa7f67810e0b66986d50885`, built
fresh for this review.

The owner has named the release the flagship. This review does three things
before it proposes anything: it reports what the surface is today, it answers
the question his note raises and the product has never answered on screen, and
it says plainly which of his five items the engine can carry now and which it
cannot.

Nothing in this file is product code. Nothing else in the repository was
touched.

---

## 1. Method, And Why Every Number Here Names A Node

Six probes lied in earlier sessions. So every measurement below carries the DOM
node or the engine symbol it came from, and every arithmetic claim was
reproduced twice: once by reading the source, once by driving a real Chromium
through an actual release on a loaded profile.

Read, in full: `atuned_src/ui/release.js` (189 lines), `atuned_src/engine/plan.js`
(271), `atuned_src/engine/read.js` (57), `atuned_src/engine/undo.js` (98), the
meter block of `atuned_src/engine/schema.js` (lines 393 to 600),
`atuned_src/ui/storyui.js` lines 100 to 168, `atuned_src/ui/ritual.js`,
`atuned_src/engine/compute.js` lines 30 to 300, `atuned_src/engine/core.js`
lines 1 to 200, `atuned_src/engine/data/canon.js` lines 238 to 275,
`atuned_src/engine/data/people.js`, `CLAUDE.md`, `DECISIONS.md`, `TASKS.md`
block V, `reviews/SPEC-ritual-accountability.md`.

Driven, in Chromium 1194 at `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`,
boot 7200 ms, `file://` load of the real build, zero page errors on every run:

| Run | Viewport | What it did |
|---|---|---|
| 1 | 1600 x 1000 | James loaded, full release through `#strun`, five screenshots |
| 2 | 390 x 844 | The same journey, five screenshots |
| 3 | 1600 x 1000 | Persona leak test, mask geometry, division arithmetic at six widths |
| 4 | 390 x 844 | Phone scroll distance, blank state, channel roster |
| 5 | 1600 x 1000 | All six ICPs, one address against three against eight |
| 6 | 1600 x 1000 | Coherence to four decimal places, jouissance, ceiling |
| 7 | 1600 x 1000 | Release into an overshot axis |

Screenshots were opened and read, not just written. They are in the session
scratchpad and are referenced by name where a finding came off the image rather
than off the DOM.

A note on the build, because a review that cannot say which file it measured
is not a measurement. Everything below was driven against the build whose md5
is quoted above. While the probes were running, concurrent work in this same
tree edited `CLAUDE.md`, `atuned_src/shell/head.html`,
`atuned_src/shell/body.html`, `atuned_src/ui/panels.js` and `tests/design.js`
and rebuilt `source.html`, which now reads md5
`55e6ac11ae91431cb3b0dfb2cd33b28a`. Every citation in this review was
re-checked against the tree afterwards. `atuned_src/ui/release.js`, the whole
of `atuned_src/engine/`, `ui/storyui.js`, `ui/personas.js`, `ui/component.js`
and `ui/imprints.js` are byte identical to what was measured, so every
arithmetic and behavioural finding stands unchanged. Three line numbers in
`shell/head.html` and `ui/panels.js` moved and are quoted at their current
positions. Nothing in this file was measured from the newer build.

The ICP sample is the six in `atuned_src/engine/data/people.js`, indices 1
through 6 after `You` is unshifted at 0: Sofia, Diane, Marcus, Angela, Derek,
James. Every persona claim below is from run 5 or run 6.

---

## 2. What The Release Surface Is Today, Step By Step

### 2.1 There Is No Release Page

There is no tab. `TABDEF` holds eight entries, measured off the live object:
Energetics, Story, Field, Body, Compass, Knowledge, Games, Summary. The
flagship is not one of them.

What exists is one modal, host node `#rel` at `atuned_src/shell/body.html:347`,
reached from four different controls that each build the queue their own way:

| Entry | Node | How it picks | File |
|---|---|---|---|
| Rail button | `#bRel` | top 8 by `sq`, automatic, no choice | `ui/personas.js:380` |
| Story panel | `#strun` | 1, 3, 5 or 8 by `sq`, or this story's hits | `ui/storyui.js:165` |
| Imprints | `#imprun` | pills the person clicked | `ui/imprints.js:161` |
| Address drill | in `runNodeDrill` | exactly one | `ui/drills.js:134` |
| Summary link | `data-w="rel"` | exactly one | `ui/summary.js:580` |

`#bRel` is measured at `atuned_src/shell/body.html:419`, inside the right rail,
below the Laws section, in a bare `div` with an inline style. The flagship is
the last control in a sidebar.

### 2.2 The Journey, Measured

Driving `#strun` on James at 1600 x 1000, default settings, run 1:

**Step 1. The panel.** `#strel`, 390 by 373 pixels, 255 characters, 47 words.
Three rows of toggles: From (Heaviest, This story), Addresses (1, 3, 5, 8),
Pace (Slow, Steady, Quick). Ten buttons, every one of them 44 pixels tall. The
tap floor holds. Then three address rows and a cost line reading "3 addresses,
12 patterns, about 26 seconds".

**Step 2. The pick card.** `#rel .rel-card`, 560 by 451, 270 characters, 47
words, no overflow. Headline "3 addresses". Sub "12 of your allowance". Three
rows with seat coloured rings. A note reading "12 thought lines of new ground,
which is 12 patterns. Right then left, limit before truth. About 0.4 minutes.
That is everything still unopened in this queue." Two buttons, Cancel and
Begin, both 44 tall.

**Step 3. The opening.** Seven lines from `OPENING`, `ui/release.js:8`, at
`RUN.speed` 2.2 seconds each. Measured: 15.4 seconds of preamble. One button,
`#relskip`.

**Step 4. The run.** One thought line per tick. `.rel-ct` reads "1 of 12
patterns". `.rel-prog i` width 8 percent. Two buttons, Pause and Stop. 12
lines at 2.2 seconds is 26.4 seconds of work.

**Step 5. The done panel.** 449 characters, 77 words, no overflow at either
viewport. Headline "3 addresses". Sub "0 cleared entirely, 43 weight freed".
Three rows. Two notes. Two buttons, Done and Build a ritual.

### 2.3 What It Costs A Person

**Taps.** Four to commit by the shortest honest path: Story tab, `#strun`,
Begin, then wait. Seven if the person sets From, Addresses and Pace first.
Eight if they skip the opening and press Done.

**Time.** 41.8 seconds at the default three addresses, of which 15.4 seconds is
preamble. That is 37 percent of the sitting spent before any work begins. At
eight addresses it is 70.4 seconds with the same 15.4 of preamble.

**Reading.** 1,057 characters across the four surfaces of one sitting, about
185 words, plus seven spoken lines. For a person who has already decided to run
a release, that is a lot of reading to be given and almost none of it is about
them.

**Scroll, on the phone.** At 390 x 844 the panel `#strel` has its top at y 1699
against a 844 viewport. That is 2.01 screenfuls of scroll to see the control at
all, and `#strun` sits at y 2063, which is 2.44 screenfuls. Measured off
`getBoundingClientRect().top + scrollY` on both nodes.

### 2.4 What The Surface Is, Said Plainly

It is a price tag and a metronome. It tells the person how many patterns the
run will spend and how long it will take, then it counts. It does not tell them
what the run will do, it does not let them choose what goes into it except by a
number, and the only thing it says about them afterwards is one coherence
figure and a note about headroom.

The owner asked for a readout of what is going to change within his system. The
surface has never had one.

---

## 3. What Actually Changes In The System When A Pattern Is Released

This is the answer to his question, taken out of the engine rather than out of
the copy.

### 3.1 The Write Is Two Numbers

`relCoolDown` at `ui/release.js:47` is the whole commit. For each address `n` in
the queue:

    w0    = n.sq * 10                                  weight on a 0 to 100 scale
    d     = -round(w0 * 0.21 + 2)                      the drop
    share = |d| / 10 / (queue members sharing n.cf)    the axis move
    S.charge[n.cf]  -= share                           clamped 0 to 10
    S.replace[n.cf] += share * 0.62                    clamped 0 to 10

`n.cf` is the child fetter, one of nine: Fear, Anger, Shame, Disgust, Apathy,
Shock, Sad, Surprise, Anticipation.

That is the entire mutation. Two scalars out of eighteen.

### 3.2 There Is No Address Level State

This is the fact everything else in this review hangs off, and it is not visible
anywhere on the surface.

`n.sq` is derived, never stored. `compute()` at `engine/compute.js:51` rebuilds
it on every call:

    n.held = S.charge[n.cf] * n.susc * (1 - relief * 0.42)
    n.rep  = S.replace[n.cf] * (0.72 + 0.28 * relief)
    n.sq   = clamp(n.held - n.rep * 0.86, 0, 10)

So releasing one address does not release one address. It moves the fetter axis
that address sits on, and every one of the 108 somatic addresses carrying the
same fetter moves with it, each scaled by its own susceptibility and by the
integrity relief at its band.

Measured on James, run 1. Queue was Blame (Heart, Anger, sq 6.18), Envy
(Sacral, Anger, 5.76), Jealousy (Sacral, Anger, 5.76). All three on Anger.

| What moved | Before | After |
|---|---|---|
| `S.charge.Anger` | 8.000 | 6.567 |
| `S.replace.Anger` | 0.000 | 0.889 |
| Every other axis | unchanged | unchanged |
| Addresses at or above sq 4 | 18 | 15 |
| Saboteurs detected | 28 | 26 |
| Complexes | 13 | 11 |
| Hyper complexes | 3 | 2 |
| Supers | 1 | 1 |
| Mask ring, Preteen | 2.307 | 1.771 |
| Mask ring, Adult | 3.087 | 2.561 |
| CQ | 12.794 | 13.713 |
| DQ | 9.132 | 7.179 |

So the honest readout has a shape already. It is: one axis down by this much,
one pole up by this much, this many addresses drop out of the loaded set, these
named saboteurs stop being detected, the reading moves by this much, and the
ceiling is here.

Every one of those figures is computable before the run, because the arithmetic
is closed form and `compute()` is idempotent by construction (`engine/read.js`
lines 10 to 16). Nothing has to be guessed.

### 3.3 The Done Panel States A Number The Write Did Not Make

**The finding.** "43 weight freed" is three times the weight the run actually
freed.

**The cause.** `RUN.freed` at `ui/release.js:62` sums `|d|` across the queue.
`d` is the per address drop. But the write at line 64 does not apply `d`, it
applies `share`, which is `|d| / 10` divided by the number of queue members on
the same fetter. Sum the shares and you get the mean of the per address drops,
not their sum. The panel reports the sum.

Measured, James, three addresses all on Anger: the panel says 43. The axis
moved 1.4333 on a 0 to 10 scale, which is 14.33 on the 0 to 100 scale the panel
is using. The overstatement factor is exactly the number of queued addresses
sharing a fetter.

At twelve addresses the panel says 158 and the field moved 39.35.

**The move.** `RUN.freed` should be the sum of `share * 10`, not the sum of
`|d|`. `ui/release.js:62`, one line.

**The cost.** One line, one test. The risk is that the number gets a lot
smaller and the run looks less impressive, which is the correct outcome.

**The grade delta.** Truth pass, D to B. A control that overstates its own
effect by a factor equal to the width of the selection is the exact defect the
house rule about claiming success was written for.

### 3.4 Every Ring On The Done Panel Is A Double Unit Error

**The finding.** All three rings on the success screen render full and in the
alarm colour, regardless of weight. Confirmed on the image, `1600-05-done.png`
and `390-05-done.png`: three saturated red rings at the moment of relief.

**The cause.** `ui/release.js:137` calls `cr(x.band, (x.w0||0)*10, ...)`.
`cr(band, pct, o)` at `ui/component.js:23` takes a 0 to 100 percentage and goes
to `var(--alarm)` at `HOT_AT` 90. But `x.w0` is already `Math.round(n.sq*10)`,
so it is already on 0 to 100. Multiplying again gives 620 and 580, both clamped
to 100, both above the alarm line. `crNode` one file over does it correctly:
`cr(n.b, n.sq*10, ...)`.

**The move.** `cr(x.band, x.w0, ...)`. One character removed.

**The cost.** Nothing. `tests/design.js` should gain a check that no `cr` call
site passes a value it has already scaled.

**The grade delta.** Craft, F to A. The screen a person sees at the end of a
release is painted entirely in the colour the palette reserves for alarm, and
the palette comment at `data/canon.js:74` says full chroma is reserved for
ALARM. Art direction and the arithmetic are both violated by the same stray
multiply.

### 3.5 "Cleared Entirely" Is Effectively Unreachable

`ui/release.js:69` writes `cleared: (w1 <= 6)`. `w1` is on the 0 to 100 scale.
So an address clears only when `w0 * 0.79 - 2 <= 6`, that is `w0 <= 10.1`,
that is `sq <= 1.01`.

No selector in the product will ever put such an address in a queue: `#bRel`
filters at `sq >= 4` then falls back to `sq > 0` sorted descending, `#strel`
takes the top of `loaded`, and `loaded` is `sq >= 4`. Measured on James: 0 of 3
cleared, on the three heaviest addresses in the heaviest ICP in the roster.

The header comment at `ui/release.js:5` says "clears at 6 or below", which any
reader takes as 6 out of 10. The code means 0.6 out of 10. One of the two is
wrong and the owner has to say which.

---

## 4. Reversibility, And Why The Readout Is A Consent Screen Either Way

The brief asked me to say plainly whether this is irreversible. The honest
answer is more interesting than either yes or no.

**The field is reversible. The ledger is not.**

`undoPush` is called at `ui/release.js:56`, before the write, with the label
"the release at 3 addresses". `undoState` at `engine/undo.js:41` captures nine
charges, nine installed opposites, twenty one laws and the soul. The control is
wired: `#undobtn` in `ui/panels.js:722`, with the chord bindings.

Measured, run 1, after pressing `#undobtn`:

| | Before run | After run | After undo |
|---|---|---|---|
| CQ | 12.794 | 13.713 | 12.794 |
| `S.charge.Anger` | 8.000 | 6.567 | 8.000 |
| `S.replace.Anger` | 0.000 | 0.889 | 0.000 |
| `meter.unique` | 0 | 12 | **12** |
| `meter.firsts` | 0 | 5 | **5** |
| `history` entries | 0 | 1 | **1** |
| Allowance left | 100 of 100 | 88 of 100 | **88 of 100** |

So a person can take back the release and cannot take back what it cost. Twelve
patterns of the gift are gone, five dated firsts are on the record for ground
that is no longer open, and a history snapshot sits in the analytics plot for a
state that has been reversed.

**The finding.** Undo restores the reading and leaves the bill.

**The cause.** `undoState` captures the field and not the record.
`engine/undo.js:41` lists charge, replace, law, doms, arcs, roots, dom, a1, a2.
It does not list `p.meter`, and it cannot easily, because `undo.js` loads
before `schema.js` and the meter lives on the profile rather than in `S`.

**The move.** Two options, and this one is the owner's call, not mine.

1. Undo rolls back the meter too. Honest, and it makes the allowance a true
   record of ground opened. It also lets a person run, look, undo and run again
   at zero cost, which is a rerun loop the tier ladder assumes costs something.
2. Undo does not roll back the meter, and the pick card says so before Begin:
   the reading can be taken back, the patterns cannot. That is the consent
   sentence, and it is one line.

I recommend 2, with the sentence on the pick card. Option 1 turns the meter into
something a person can game by construction, and the whole tier ladder in
`engine/plan.js` rests on unique ground being a one way count.

**The cost.** Option 2 is one sentence and one test. Option 1 is a schema
question and belongs with Y1 in `TASKS.md`.

**The grade delta.** Consent, C to A. Either way the pick card gains the
sentence, and that is what turns his readout from a preview into a consent
screen. Which is what it has to be: the reading is reversible and the money is
not.

---

## 5. The Persona Leak. A Release Writes A Reference Case Over The Person

This one is not a design finding. It is a defect and it is in the flagship path.

**The finding.** Running a release while a reference case is loaded copies that
case's entire charge vector into the person's own record, and the interface then
labels it Custom.

**Measured**, run 3, at 1600 x 1000:

`PROF_BY['You'].axes` before, every field zero. Load James, run a release on
three addresses, and afterwards:

    PROF_BY['You'].axes = Fear 6, Anger 6.567 (opp 0.889), Shame 7 (opp 8.4),
                          Disgust 7, Apathy 5, Shock 7 (opp 9.3), Sad 4,
                          Surprise 4, Anticipation 5
    PROF_BY['James'].axes = unchanged, Anger still 8, meter.unique still 0
    #psel value "0", selected option text "Custom"
    S.who = 0, CURP.name = "You"

That is James's field, minus the release, written into the person's own record
and presented as theirs.

**The cause.** `toYou()` at `ui/release.js:81` runs after the field write at
lines 64 and 66. The comment above it, lines 74 to 80, states the problem
correctly and fixes only half of it: it moved the repoint ahead of the meter so
the patterns are charged to the right person, and left it behind the field
write so the charges land on the wrong one. `toYou()` in `ui/personas.js:264`
repoints `CURP` without reloading `S`, deliberately, because its usual caller is
mid drag. Then `pSave()` at line 101 writes `S` into whatever `CURP` now points
at.

**The move.** Two candidates, and the second is the one I would build.

1. Refuse. A release cannot be run on a persona that is not the person. The
   control reports through `status()` and offers to copy the case onto the
   person's own record first, explicitly.
2. Run it where it stands. Commit the field to the loaded profile, charge the
   meter to the loaded profile, and drop `toYou()` from `relCoolDown`
   altogether.

Option 1 is right for a shipping product. A reference case is a demonstration
and a person should not be able to spend their own allowance inside one without
saying so. Option 2 is right for the studio, where reference cases are how the
team works. The owner picks.

**The cost.** Option 1 is about fifteen lines in `ui/release.js` and one string.
Option 2 is deleting one line and re-testing the meter path. Both need a new
case in `tests/functional.js`.

**The grade delta.** Trust, F to A. This is the only finding in this review I
would hold a release for.

---

## 6. Pass 1. The Tool As It Is. Intent

**What changed in this pass.** It found the surface has no intent statement at
all, and it found the address illusion in section 3.2.

Four seconds, cold, in front of the pick card at `1600-02-pick.png`. What does
a stranger learn? "3 addresses." "12 of your allowance." Three names. A
paragraph about thought lines and minutes. Cancel, Begin.

Nothing on that card says what a release is, what it does, or what it will
change. The loudest thing on it is a count of addresses, which is the unit the
person cares least about.

The intent of this surface, in the owner's words, is release and integration so
the bias is released from the site of the nerve. The card does not contain the
words release, bias or nerve except in the title bar, and the title bar reads
"Run A Release", which is an instruction and not a statement of purpose.

**The finding.** The pick card sells the price and hides the product.

**The cause.** The card was built as a confirmation dialog for a run, and the
run was built before there was a readout to confirm. The price line is there
because the meter arrived and needed somewhere to report.

**The move.** Invert the card. The headline becomes what will move, not how many
addresses are in the queue. Everything in section 3.2 is computable before the
run. The concrete shape:

    eyebrow   Release
    headline  Anger, down 1.4 of 8.0
    sub       Equanimity installing at 0.9
    body      15 addresses stay loaded, 3 drop out.
              Aggressor and Manipulator stop being detected.
              Your reading moves from 12.8 to 13.7.
              Release has 7.2 left to give you after this.
    cost      12 patterns of your allowance, about half a minute.
    note      The reading can be taken back. The patterns cannot.
    actions   Cancel, Begin

That is the readout he asked for. It is one function, `relForecast(queue)`, in
`engine/` because it is pure arithmetic over the same `compute()` the run uses,
and it is host free by construction.

**The cost.** Medium. The forecast function is about forty lines. It must not
duplicate `relCoolDown`'s arithmetic or the two will drift, so the right build
is to factor the per address maths into one engine function that both the
forecast and the commit call. That is a `tools/equiv.py` run, and it is worth it.

**The grade delta.** Intent, D to A. This is the single largest gap between
what the owner described and what exists.

---

## 7. Pass 2. The Selection Of Stories

**What changed in this pass.** It found that the word story does not appear in
the release path at all, and that the four entries disagree about what a person
is selecting.

He said: "When I come to this page, I'm able to see my stories. I'm able to
select the stories I want."

What the product lets him select today, entry by entry:

| Entry | The unit selected | Can he see the story? |
|---|---|---|
| `#bRel` | nothing, top 8 automatic | no |
| `#strel` | a count, 1 3 5 or 8 | only the one just written |
| `#imprun` | addresses, as pills | the story's first 130 characters |
| drill | one address | no |

`#strel` has a From toggle with a "This story" option, `ui/storyui.js:130`,
which reads `ST_PARSED.imprints` and maps to addresses. It reaches exactly one
story: the one in the composer right now. A person's past stories live in
`p.story.entries` and the only surface that shows them is Imprints, which
renders `e.text.slice(0,130)` and then makes the person select addresses
underneath rather than selecting the story.

**The finding.** There is no way to select a past story and release it. The
product stores stories, reads charge out of them, and then makes the person
re-find the addresses by hand.

**The cause.** The story is an input to the field and was never modelled as a
selectable object. `applyStory` bakes charge into the axes and the entry becomes
a log line. `engine/read.js:23` says this outright: the entries are "a log of
stories already baked into p.axes", deliberately not replayed.

That is correct engine design and it is exactly why the release cannot select
one. Once a story is baked, the only trace of which addresses it touched is
`e.imprints`, a count, plus whatever `imprints.js` can recover by re-parsing.

**The move.** Store the address list on the entry. When `applyStory` commits,
write the imprint node ids onto `p.story.entries[i].nodes`. Then the release
page can list stories, and selecting a story is selecting its address set. That
is a schema addition, additive, and it belongs with Y1.

Then the release page's primary list is stories, not addresses, with the
addresses as the second level. Which is what he described.

**The cost.** Medium to large. Schema addition in `engine/schema.js` plus
`validateProfile`, a migration path for entries that already exist and have no
node list (they get re-parsed once on load, or they show as address sets only),
a new list renderer, and a gate.

**The grade delta.** Selection, F to B. It cannot reach A until the past stories
carry their addresses, and that is a schema bump the owner owns.

---

## 8. Pass 3. The Settings That Fold Away

**What changed in this pass.** It found the settings exist, do not persist, and
are on the wrong surface.

He said: "I can select my settings and then save those settings so that they're
not in my face all the time. So maybe they're just drop downs, or it's a menu
you can drop down and then slide back up. So for like the time and the number
of patterns and stuff like that."

What exists: three toggle rows in `#strel`, measured at 1600 and at 390,
identical text, 255 characters, ten buttons.

What persists: nothing. Measured, run 3. `ST_RELN`, `ST_RELSRC` and `ST_RELSPD`
are module level vars in `ui/storyui.js:103`. `localStorage` under the app key
read back as an empty key list. `blankProfile()` returns twenty keys and none
of them is a release setting.

So the person sets pace to Slow, runs, comes back tomorrow, and it is Steady
again.

**The finding.** Three settings, always on screen, that remember nothing.

**The cause.** They were built as controls on a panel rather than as a
preference. There is no `p.prefs` anywhere in the schema.

**The move.** Two parts, and they are separable.

1. Persist. A `prefs` block on the profile: `{release:{pace, width, source}}`,
   validated at the boundary with the same refuse by name rule as everything
   else in `validateProfile`. Small.
2. Fold. A disclosure that is closed by default once a setting has been saved,
   and open by default before. The pattern already exists in this product: the
   left rail sections are `lsec` with a `lsec-hd` button and a `lsec-bd` body,
   `shell/body.html:284`. Reuse it. Do not invent a dropdown.

One caution from the UX seat. His words are "drop downs" and "a menu you can
drop down and then slide back up", and those are two different controls. A
`select` element and a disclosure panel behave differently on a phone, where a
`select` opens the system picker. The `lsec` disclosure is the right reading of
his intent and it is already in the house vocabulary. If he meant a native
select, that is a ruling.

**The cost.** Small for the fold, small for the persistence, one schema field
each. The gate is `tests/engine.js` for the validator and `tests/functional.js`
for the fold state surviving a render.

**The grade delta.** Settings, C to A. The controls are good. They are homeless
and amnesiac.

---

## 9. Pass 4. The Arithmetic Of Dividing Patterns

**What changed in this pass.** It changed the shape of the whole recommendation.
This is the pass that found that his mental model of division and the engine's
behaviour are opposites.

He said: "I can select multiple patterns and it will automatically divide it up.
So if I have a, I'm going to do a hundred patterns in five minutes, but I
selected four things, right? It'll divide that by four. 100 by four."

### 9.1 What He Is Describing Is Not What The Engine Does

His model: a budget of patterns, divided across the selection. 100 across 4 is
25 each.

The engine's model: cost is derived from the selection, not divided into it.
`meterPlan` at `engine/schema.js:428` takes the addresses, crosses them with the
four channels, takes the next unopened line at each, and stops at `RUN_MAX` 25.
So four addresses is 16 patterns and eight addresses is 25, because the cap bit.
The person never states a total.

Both models are defensible. His is better for a practice, because it makes time
the thing you choose and depth the thing that follows. The engine's is better
for a ledger, because the cost is exactly what was opened.

They can be reconciled and the reconciliation is small. `meterPlan` already
takes a `cap`. Give the person the budget, divide it by the selection, and pass
the per address share as the cap. The cross product loop at lines 445 to 452
already walks address by address and channel by channel, so it needs a per
address limit rather than a global one. That is a real but contained change in
one engine function with a signature that stays compatible.

### 9.2 The Finding That Matters More

**The finding.** Widening the selection within one fetter costs more, takes
longer, and moves the reading by less.

**Measured**, run 3, James, replaying `relCoolDown`'s arithmetic exactly at six
widths:

| Addresses | Patterns | Seconds | Panel says freed | Actually freed | CQ move | CQ per pattern |
|---|---|---|---|---|---|---|
| 1 | 4 | 9 | 15 | 15.00 | +0.93 | 0.233 |
| 2 | 8 | 18 | 29 | 14.50 | +0.92 | 0.115 |
| 3 | 12 | 26 | 43 | 14.33 | +0.92 | 0.077 |
| 5 | 20 | 44 | 69 | 27.33 | +2.33 | 0.116 |
| 8 | 25 | 55 | 108 | 40.00 | +4.04 | 0.162 |
| 12 | 25 | 55 | 158 | 39.35 | +4.03 | 0.161 |

Read the first three rows. Three addresses costs three times the patterns and
three times the time of one address, and moves the reading by 0.01 less.

**The cause.** The divide by same fetter count at `ui/release.js:63`. The share
each address contributes is `|d| / 10 / K` where K is the number of queued
addresses on that fetter. Sum over the K addresses and you get the mean, not the
sum. The divisor was put there to stop double counting, which is correct in
principle, and the effect is that width within a fetter is free of benefit and
not free of cost.

The gain only arrives when the selection crosses into a new fetter. Rows four
and five: five addresses reached two fetters and moved 2.33, eight reached
three and moved 4.04.

And the cap makes width above eight worthless: twelve addresses costs exactly
what eight costs, 25 patterns, and moves 0.01 less.

**The move.** Three things, in this order.

1. The forecast from pass 1 makes this visible. A person who can see "this
   selection touches one fetter" will not pick three addresses on Anger by
   accident. That is the cheapest fix and it needs no arithmetic change.
2. The queue builders should spread across fetters rather than sort by `sq`
   alone. `#bRel` at `ui/personas.js:380` and `#strel` at `ui/storyui.js:108`
   both take the top N by weight, which on every ICP I sampled concentrates on
   one or two fetters. Measured top 8 fetter counts: Sofia 2, Diane 3, Marcus 2,
   Angela 2, Derek 3, James 3. A heaviest first spread that takes the heaviest
   unclaimed fetter each time would reach five or six.
3. Whether the divisor is right at all is arithmetic and is the owner's, not
   mine. It is a real modelling question: if three addresses on Anger each drop
   their own weight, does the axis drop three times? The current answer is no
   and there is a defensible reason. But it should be a ruling and not a side
   effect.

**The cost.** Item 1 rides on pass 1. Item 2 is about ten lines across two
files and needs `tests/engine.js`. Item 3 is a ruling, then possibly a
`tools/equiv.py` run.

**The grade delta.** Arithmetic, D to B with items 1 and 2. It cannot reach A
until item 3 is ruled.

### 9.3 Half The ICPs Pay And Nothing Moves

This is the finding I would put in front of the owner first, because it decides
what the readout has to say.

**Measured**, runs 5 and 6, eight addresses each, four decimal places:

| ICP | CQ before | CQ after | Move | Ceiling | Headroom | Patterns spent |
|---|---|---|---|---|---|---|
| Sofia | 57.1844 | 57.1844 | **0.0000** | 58.65 | 1.46 | 25 |
| Diane | 28.6495 | 33.6648 | +5.0153 | 34.52 | 5.87 | 25 |
| Marcus | 39.1663 | 39.1663 | **0.0000** | 39.43 | 0.27 | 25 |
| Angela | 40.8612 | 40.8612 | **0.0000** | 41.89 | 1.02 | 25 |
| Derek | 15.4955 | 22.7552 | +7.2598 | 24.13 | 8.64 | 25 |
| James | 12.7938 | 16.8363 | +4.0425 | 20.04 | 7.24 | 25 |

Three of six move by exactly zero and spend a quarter of the hundred pattern
gift doing it.

**The cause.** `DQraw` at `engine/compute.js:127` sums only over `loaded`, which
is `sq >= 4`. Sofia, Marcus and Angela have zero addresses at or above 4, so
their DQ is already 0 and release cannot reduce it. Their reading is held down
by the gate factor and by integrity, and release touches neither. `cqHeadroom`
at `engine/compute.js:271` knows this exactly and returns 1.46, 0.27 and 1.02.

The done panel already says a version of this, `ui/release.js:152`, after the
money is spent. The pick card says nothing.

**The move.** The forecast says it before Begin, in the same sentence shape the
done panel already uses. And when the forecast is zero or near zero, the primary
action stops being Begin. It becomes the lever that is not spent, and Begin
becomes the secondary. That is not a dark pattern in reverse, it is the
instrument telling the truth about itself, which is the whole product thesis.

**The cost.** Rides on pass 1. One extra branch.

**The grade delta.** Consent, F to A. Taking a quarter of somebody's gift for a
measured zero is the worst thing this product currently does.

### 9.4 Release Cannot Reach An Overshot Address At All

**Measured**, run 7. Sofia carries `S.replace.Anger` 8.6 and 24 addresses at
`jq >= 4`, which is the excess band where the installed pole has overshot past
the point where it serves. Filtering `W` for Anger addresses with `sq > 0`
returns an empty array, because `n.sq = clamp(n.held - n.rep * 0.86, 0, 10)` is
zero everywhere the pole is that high.

Every release selector in the product filters on `sq`. So not one of Sofia's 24
excess addresses can be put in a queue by any control that exists.

**The finding.** The largest thing holding Sofia's reading down is invisible to
the flagship.

**The cause.** Release is modelled as a one way operation on held charge. The
excess band is a different defect with a different fix and there is no tool for
it.

**The move.** Not now, and I am naming it as scope rather than proposing it. But
the forecast should say it: "Release has 1.5 to give you. 24 addresses are
carrying an overshot pole, which release does not operate on." That is honest,
it is one sentence, and it stops a person grinding the loop against a wall.

**The grade delta.** Truth, D to B. B rather than A because the sentence names a
problem the product cannot yet solve.

---

## 10. Pass 5. The Mask Route And Performance Blockers

He is right about this and the product is calling two different things by one
word, which is why it looks like he is wrong.

### 10.1 There Are Two Objects Called Mask

`compute()` returns both, in the same object literal at `engine/compute.js:225`:

- `maskRing`, built at line 112. Six developmental masks from
  `data/canon.js:250`. Each one is the mean `sq` over the addresses in one or
  two bands.
- `mask`, built at line 191. `sups[0] || hys[0] || cxs[0] || sabs[0]`. The top
  of the saboteur chain. On James, measured: `{kind:'sup', nm:'Predatory /
  Dysregulation', w:5.98}`.

The glossary in `data/kb.js` defines mask as "the accumulated distortion
functioning as an identity construct. What most people call their personality."
That is the second object. That is the saboteur chain.

When he says the masks let us look at our character and find the performance
blockers, he is describing the saboteur chain, and he is correct. The six
developmental masks are a different thing that happens to share the word.

**The finding.** One word, two concepts, and the strongest idea in his note is
aimed at the weaker of the two.

**The grade delta.** Naming, F to A, and it is a rename and a ruling, not a
build.

### 10.2 The Six Masks Cannot Carry It, And Here Is Why, Measured

| Mask | Bands | Addresses | Weight, James |
|---|---|---|---|
| Child | Root, Sacral | 32 | 3.186 |
| Preteen | Solar, Throat | 28 | 2.307 |
| Teen | Throat | 12 | 2.059 |
| Adult | Sacral, Solar | 32 | 3.087 |
| Professional | Solar, Throat | 28 | 2.307 |
| Ideological | 3rd Eye | 12 | 2.243 |

Three hard problems, all measured in run 3.

**Preteen and Professional are the same reading.** Both are `['Solar','Throat']`.
The band set signature map returns `{"Solar+Throat": ["Preteen","Professional"]}`.
Their weights were identical before the run, 2.307 and 2.307, and identical
after, 1.771 and 1.771. They are identical by construction, on every profile,
forever. Two of the six masks cannot be told apart.

**Heart and Crown are in no mask.** Bands used across all six: Root, Sacral,
Solar, Throat, 3rd Eye. Addresses covered: 72 of 108. Heart holds 15 addresses
and Crown holds 21, and 36 addresses, exactly one third of the body, are outside
the mask model. James's single heaviest address is Blame, at the Heart, sq 6.18.
A mask route could not reach it.

**The masks have no colour.** No `MASKCOL`, no `maskCol()`. They have an icon
family, and it is good: `MASK_FACE` plus one seam per era at `data/canon.js:249`,
one outline, six marks. But the house rule is that a named thing wears its own
mark, the mark has a family, and the family has a colour that means something.
Two of three. If the masks become a navigation route they need the third.

**The deeper problem.** A band mean cannot name a blocker. The mask ring's
spread across the six was measured at 0.21 on Angela, 0.32 on Sofia, 0.41 on
Marcus, 1.13 on James, 1.27 on Derek, 1.83 on Diane. On three of six ICPs the
six masks are within half a point of each other. There is no signal to route on.

### 10.3 The Saboteur Chain Can Carry It, And Mostly Already Does

The 33 saboteurs in `SAB33` at `data/canon.js:8` are matched on charge ranges,
and the description table at lines 40 to 53 is the performance blocker
vocabulary already written down:

    Procrastinator   Avoidance + Doubt + Fear of failure
    Perfectionist    Fear of failure + Excessive desire for wealth + Overindulgence
    Overthinker      Anxiety + Doubt + Procrastination
    Negotiator       Doubt + Procrastination + Lack of effort
    Imposter         (Collapse family, fires on shame and fear)
    Hyper-Vigilant   Paranoia + Panic + Fear
    Catastrophizer   (in the 33)

That is writing block, creative block and stage fright, described in the
mechanical register the house rules ask for, already in the engine.

**Measured live**, run 5, performance adjacent saboteurs detected per ICP:

| ICP | Detected |
|---|---|
| Sofia | none |
| Diane | Imposter 5.5 |
| Marcus | none |
| Angela | none |
| Derek | Imposter 5.5, Overthinker 5.5, Negotiator 5.5, Perfectionist 5.0, Procrastinator 4.5 |
| James | Imposter 6.5, Overthinker 6.5, Negotiator 6.5, Procrastinator 5.0 |

And on James the complex `Worrywart + Procrastinator` is live at 5.0, family
Dysregulation. That is a writing block, detected, named, with a family, with
addresses under it, today.

### 10.4 Is "Performance Blocker" A Real Reading Or A Name Put On Something

Both, and the honest split is this.

**Real today.** The saboteur, the complex and the hyper complex are real
readings with real arithmetic behind them and named addresses underneath. A
route that says "run the protocol on Procrastinator" resolves to
`SAB_LIB`/`UNNAMED` node ids and is a valid queue. `ui/drills.js` already
resolves a saboteur to its addresses.

**Not real today.** The phrase stage fright has no referent in the engine. I
scanned all 108 somatic addresses for performance vocabulary. Six hits:

| Id | Address | Band | Fetter | James sq |
|---|---|---|---|---|
| 37 | Judgment | Solar | Anger | 1.69 |
| 40 | Perfectionism | Solar | Fear | 2.15 |
| 46 | Self-Judgment (Solar) | Solar | Shame | 0 |
| 51 | Self-Judgment (Heart) | Heart | Shame | 0 |
| 71 | Stage Performing | Throat | Shock | 0 |
| 72 | Speaking To Be Right | Throat | Anger | 2.52 |

One address in 112 is named for the stage, and on the heaviest ICP in the
roster it reads zero. There is no creative block address, no writing block
address, and no index anywhere that groups addresses by what they block.

**So, plainly.** Performance blocker is a real reading the instrument can
produce through the saboteur chain, and it is a name being put on nothing if it
is routed through the six developmental masks or through address names. The
route must run on saboteurs.

### 10.5 What It Would Take

**The move**, in order, and this is the largest single piece of work in the
review.

1. **Rule the word.** One word per concept. Either the six developmental masks
   get a new word, or `r.mask` does. My recommendation: the six become Eras, and
   mask stays with the saboteur chain, because mask is the word the owner and
   the glossary both already use for that. `engine/compute.js`, `ui/map.js`,
   `ui/wheel.js`, `ui/summary.js`, `ui/analytics.js`, `data/canon.js`.
2. **Fix the six either way.** Preteen and Professional need different band
   sets or one of them goes. Heart and Crown need to be in the model or the
   model needs to say it covers five of seven seats. Both are data changes in
   `data/canon.js:250` and both are the owner's, because the roster was closed
   on 14 September.
3. **Build the blocker index.** A table mapping a named blocker to the saboteurs
   and complexes that constitute it. Not to addresses, because addresses are
   derived from saboteurs and a second mapping would drift. Roughly:

       stage fright    Imposter, Hyper-Vigilant, Catastrophizer
       writing block   Procrastinator, Overthinker, Negotiator
       creative block  Perfectionist, Judge, Stickler

   Each blocker gets a name, an icon, a family and a colour, per the house rule.
   New file, `engine/data/blockers.js`, before `compute.js` in `MANIFEST`.
4. **The route.** Select a blocker, the queue is the union of the addresses of
   its detected constituents, ordered heaviest fetter first per pass 9.2.
5. **Be honest when it is not there.** Marcus, Sofia and Angela detect no
   performance saboteurs at all. The route must say "nothing in this shape is
   firing for you" rather than building an empty queue or a weak one.

**The cost.** Large. Item 1 is a rename across six files and needs
`tools/equiv.py`. Item 2 is a data ruling. Item 3 is a new data module, a
`MANIFEST` entry, an icon family and a colour, plus `tests/design.js` for the
icon and colour rules. Item 4 is a renderer. Item 5 is one branch and one string.

**The grade delta.** The mask route, F to B. B and not A because a blocker table
is a claim about what constitutes stage fright, and that claim is the owner's
and the book's, not mine. I can build the mechanism. The mapping needs him.

**What I will not do is flatter it.** The idea is right and it is the best thing
in his note. The object he named cannot carry it. The object next to it can, and
it is already built. That is a naming problem wearing the costume of a feature
gap, which is the cheapest kind of problem to have.

---

## 11. Pass 6. The Phone

**What changed in this pass.** Less than I expected. The modal is good. The
route to it is not.

**What holds at 390 x 844**, measured in run 2:

- The `#rel` card is 363 by 474 in an 844 viewport. No overflow: `scrollHeight`
  560 equals `clientHeight` 560 on the done panel, which is the tallest phase.
- Every button in every phase is at least 44 tall. `#strun` measures 120 by 54.
  The tap floor holds everywhere I measured it.
- The done panel reads well on the image, `390-05-done.png`. The hierarchy
  survives the narrow column.
- Zero page errors across the full journey.

**What does not hold:**

**The finding.** The release control is two screenfuls below the fold on a
phone.

**Measured.** `#strel` top at y 1699 against a 844 viewport, which is 2.01
screenfuls. `#strun` at y 2063, which is 2.44. Both off
`getBoundingClientRect().top + scrollY`.

**The cause.** `#strel` is the right half of a two column Story layout
(`ui/storyui.js:63`, class `st-half st-rel`). At 1600 it sits beside the
composer. At 390 the columns stack and the release panel lands under the whole
composer, the parse readout and the imprint list.

**The move.** The release stops being a half column on Story. That is the same
conclusion pass 1 and pass 7 reach from different directions, and it is the
structural recommendation of this review: the release is a surface, not a panel.

**The cost.** Covered under the build order.

**The grade delta.** Phone, C to A once the surface exists. The modal itself is
already A and needs nothing.

**A pass that changed nothing, recorded as such.** I checked the phone for
colour, contrast and icon rendering and found nothing the desktop pass had not
already found. The red ring defect in 3.4 is identical at both widths. I am not
inventing a phone specific finding where there is none.

---

## 12. Pass 7. One Sitting, End To End

**What changed in this pass.** It found the house rule violations that only
appear when you read the four surfaces in sequence, and it found the shape of
the fix.

Reading the whole sitting as one document, 1,057 characters across four
surfaces:

### 12.1 The Vocabulary Splits Mid Sitting

The pick card says, in two consecutive sentences: "12 of your allowance" and
"12 thought lines of new ground, which is 12 patterns." Three words for one
unit, and the third sentence is the product explaining its own synonym to the
person.

`python3 tools/terms.py` on the build, 1,173 user visible strings, reports the
charge value is called four things across the product: charge 13, weight 8, load
4, depth 3. The release surface uses weight ("43 weight freed") where the rest
of the instrument uses charge.

**The move.** One word for the unit of work, used on all four surfaces. My
recommendation is pattern, because it is the word in `DECISIONS.md`, the word
the tier ladder prices, and the word the owner uses. Thought line becomes the
definition of pattern, stated once in Knowledge, never on the run surface.
Weight becomes charge.

**The cost.** Small. String changes in `ui/release.js` and `ui/storyui.js`, plus
`tools/terms.py` to confirm.

**The grade delta.** Voice, C to A.

### 12.2 The Opening Is In The Wrong Register

`OPENING` at `ui/release.js:8`, seven lines, 15.4 seconds:

    Welcome to release and reframe.
    We will be here for a few minutes.
    Find a quiet space. Sit back and relax,
    and turn your senses inward to feel what is released.
    As the words repeat, follow along in thought.
    Feel what the body is doing as the energy goes.
    Let us begin.

Lines four, five and six are correct: physical, mechanical, instructive. Line
three is not. "Sit back and relax" is the soft wellness register the house rules
forbid by name. "Welcome" is a greeter, not an instrument.

**The move.** Cut line one. Rewrite line three to the physical instruction it is
trying to give: where to sit, what to do with the eyes, what the body should be
doing. Four lines at 2.2 seconds is 8.8 seconds instead of 15.4, which also
fixes the 37 percent preamble problem measured in 2.3.

**The cost.** Small. Copy, and one number.

**The grade delta.** Voice, C to A.

### 12.3 A Count Against A Total, Twice

`.rel-ct` at `ui/release.js:126` prints "1 of 12 patterns" during the run. The
done panel at line 133 prints "0 cleared entirely" against an implicit three.

The house rule is that a count is never printed against a total, except an
allowance, which is an entitlement.

My ruling on the first one, and I am ruling rather than flagging: position in a
sequence the person authorised is not a score, and the progress bar directly
above it already carries the same information. So `.rel-ct` is redundant rather
than forbidden, and the right fix is to delete it and let `.rel-prog` do the
job. One line out, and the run phase gets quieter, which it needs.

The second one is a straightforward violation. "0 cleared entirely" is a score,
it is against a total, and per section 3.5 it is a score that is arithmetically
almost always zero. It goes.

**The cost.** Two lines. Trivial.

**The grade delta.** House rules, C to A.

### 12.4 Title Case Is Being Done By CSS And CSS Cannot Do It

`.pm-eye` takes `text-transform: capitalize` at `shell/head.html:916`.
Capitalize capitalises every word, including articles and conjunctions. Title
case does not.

Measured on the release surface, off `innerText`: "Run A Release" and "Release
And Reframe". Two of the four headers on the flagship are mis-cased.

The stylesheet comment block directly above it already identifies exactly this
failure mode for `kb-h` and `sh-h` and fixes it with a `.plain` escape hatch.
`.pm-eye` has the same escape hatch available and does not use it.

**The move.** Either the release headers take `.plain` and are written in title
case in the string, or the two offending strings are reworded so no article
appears. "Release and reframe" becomes "Reframe". "Run a release" becomes
"Release". Both read better short, and the pick card headline is being replaced
anyway by pass 1.

**The cost.** Trivial.

**The grade delta.** Craft, B to A.

### 12.5 The Sitting Has No Ending

`#relrit` hands `RUN.log` to `ritOpen`, `ui/ritual.js:19`, which is wired and
renders. So the release does hand off. But `reviews/SPEC-ritual-accountability.md`
is 1,496 lines against a module that has a modal and no persistence, and
section 4.7 of that spec, "A Release Produces The Ritual", is the joint this
hand off is supposed to make. It does not make it yet: `ritOpen` builds from
`compute()` and uses `RIT.from` only for one line of display.

I am recording this rather than proposing it, because ritual is its own module
with its own spec and its own passes, and the release review should not annex it.

---

## 13. House Rule Audit, Measured

| Rule | Finding | Where |
|---|---|---|
| No em dashes | Clean. `BUILD.sh` reports "no em dashes" on this build | build output |
| Never say 108 | Clean on the release surface. No count is printed | `ui/release.js` |
| Sentence case bodies | Clean | all four phases |
| Title Case headers | **Two failures**, "Run A Release", "Release And Reframe" | `shell/head.html:916` |
| No count against a total | **Two failures**, `.rel-ct` and "0 cleared entirely" | `ui/release.js:126,133` |
| Icons ring not fill | Clean. `cr()` draws two circles with `fill="none"` | `ui/component.js:37` |
| Named thing wears a mark | **Masks have mark and family, no colour** | `data/canon.js:250` |
| 44 by 44 tap floor | Clean. Every button measured at both viewports | runs 1 and 2 |
| No soft wellness language | **One failure**, "Sit back and relax" | `ui/release.js:10` |
| No urgency, no punishing streak | Clean. Nothing on this surface pressures | all phases |
| A control never claims success it does not have | **Two failures**, "43 weight freed" and the persona leak | `ui/release.js:62,81` |
| Engine stays host free | Clean. `BUILD-engine.sh` passes, no `document` in `engine/` | build output |
| Port, do not rebuild | Respected throughout this review. Every proposal keeps `compute()` and `meterPlan` signatures | n/a |

---

## 14. Build Order

Sized S, M, L. Files named. Gates named. Nothing here is a rebuild of the
arithmetic core.

### Small, And They Should Land First

| # | What | Files | Gate |
|---|---|---|---|
| S1 | Fix the ring unit error. `cr(x.band, x.w0, ...)` | `ui/release.js:137` | `tests/design.js`, `tools/shots.js` and look |
| S2 | Fix `RUN.freed` to sum the shares, not the drops | `ui/release.js:62` | `tests/engine.js` |
| S3 | Delete `.rel-ct` and "cleared entirely" | `ui/release.js:126,133` | `tests/design.js` |
| S4 | One word for the unit. Pattern everywhere, charge not weight | `ui/release.js`, `ui/storyui.js` | `tools/terms.py` |
| S5 | Cut the opening to four lines, fix the register | `ui/release.js:8` | `tools/terms.py` |
| S6 | Title case the two headers via `.plain` or rewording | `ui/release.js` | `tests/design.js` |
| S7 | Spread the default queue across fetters | `ui/personas.js:380`, `ui/storyui.js:108` | `tests/engine.js` |

S1 through S6 together are under fifty lines and remove every measured lie on
the surface.

### Medium

| # | What | Files | Gate |
|---|---|---|---|
| M1 | **Fix the persona leak.** Refuse or commit in place, owner's ruling | `ui/release.js:81` | `tests/functional.js`, new case |
| M2 | Factor the per address arithmetic into one engine function both the forecast and the commit call | new in `engine/`, `MANIFEST`, `ui/release.js` | `tools/equiv.py`, `tests/engine.js` |
| M3 | **The forecast.** `relForecast(queue)` returning axis move, pole move, addresses leaving the loaded set, saboteurs falling out, CQ before and after, headroom | `engine/`, `MANIFEST` | `tests/engine.js`, coverage on the new module specifically |
| M4 | Rebuild the pick card around the forecast. Headline is what moves | `ui/release.js:164` | `tests/functional.js`, `tools/shots.js` and look |
| M5 | The consent sentence. Reading reversible, patterns not | `ui/release.js` | `tests/design.js` |
| M6 | Persist the release settings as `p.prefs.release`, validated at the boundary | `engine/schema.js` | `tests/engine.js` |
| M7 | Fold the settings into an `lsec` disclosure | `ui/storyui.js` or the new surface | `tests/functional.js` |
| M8 | Budget division. Person states the total, `meterPlan` takes a per address cap | `engine/schema.js:428` | `tools/equiv.py`, `tests/engine.js` |

M1 is the one I would hold a build for. M3 and M4 together are the owner's
request, and M2 exists so they cannot drift from the commit.

### Large

| # | What | Files | Gate |
|---|---|---|---|
| L1 | **The release becomes a surface**, not a rail button and a modal. New tab integer 10, appended, never renumbering anything | `engine/core.js` TAB, `TABDEF`, `shell/body.html`, `ui/release.js`, `tools/shots.js`, `tools/monitor.js` | all gates, plus `monitor.js` for the new surface |
| L2 | Stories carry their addresses. `p.story.entries[i].nodes` written by `applyStory` | `engine/schema.js`, `engine/intake.js` or wherever `applyStory` commits, `validateProfile` | `tests/engine.js`, migration case |
| L3 | Select stories, not counts. The release surface's primary list | `ui/release.js` | `tests/functional.js`, `tests/collide.js` |
| L4 | **Rule the word mask.** Rename one of the two objects | `engine/compute.js`, `ui/map.js`, `ui/wheel.js`, `ui/summary.js`, `ui/analytics.js`, `data/canon.js` | `tools/equiv.py`, `tools/terms.py`, all gates |
| L5 | Fix the six masks. Preteen against Professional, Heart and Crown, and a colour | `data/canon.js:250` | `tests/design.js`, `tests/engine.js` |
| L6 | **The blocker index.** `engine/data/blockers.js`, mapping named blockers to saboteurs and complexes, each with mark, family and colour | new file, `MANIFEST` | `tests/engine.js`, `tests/design.js` for the icon and colour rules |
| L7 | The blocker route on the release surface | `ui/release.js` | `tests/functional.js` |
| L8 | Sort by field. Arts, business, sports, performance | after L6 | n/a until L6 lands |

L8 is his own "future" and should stay there. L6 is its prerequisite: a field is
a set of blockers, and there are no blockers yet.

### The Order I Would Actually Run

1. M1, alone, because it is a data integrity defect in the flagship path.
2. S1 through S6, one commit, because they are cheap and they stop the surface
   lying.
3. M2, M3, M4, M5. This is the owner's request and it is the whole point.
4. L1, then M6 and M7 onto the new surface.
5. S7, then M8.
6. L4 and L5, which are rulings first and code second.
7. L2, L3.
8. L6, L7.

---

## 15. What Needs The Owner's Ruling Before Anybody Builds

Nine, and they are ordered by how much is blocked behind each.

1. **The word mask.** Two objects, one word, and the best idea in his note is
   aimed at the wrong one. Everything in the mask route is blocked on this.
   My recommendation: the six developmental masks become Eras, mask stays with
   the saboteur chain, because that is what the glossary and his own note both
   mean by it.

2. **What constitutes a performance blocker.** Stage fright is which saboteurs?
   Writing block is which? This is a claim about the model and it is his and the
   book's. I can propose the table. I should not be the one who decides it.

3. **Preteen against Professional.** They are the same band set and therefore
   the same number on every profile forever. The roster was closed on 14
   September. Either the bands change or one mask goes.

4. **Heart and Crown in the mask model.** 36 of 108 addresses, one third of the
   body, are in no mask. Is that correct and should be stated, or is it a gap?

5. **Does undo roll back the meter.** Section 4. My recommendation is no, and
   the pick card says so before Begin.

6. **Does a release on a reference case refuse or commit in place.** Section 5.
   My recommendation is refuse, with an explicit offer to copy the case onto the
   person's own record first.

7. **Is the fetter divisor right.** Section 9.2 item 3. Three addresses on one
   fetter currently move the axis by the mean of their drops, not the sum, which
   makes width within a fetter cost three times and gain nothing. That is a
   modelling decision and it should be a ruling.

8. **Where the clear line is.** `cleared: (w1 <= 6)` on a 0 to 100 scale means
   sq 0.6, which no selector can reach. The header comment says 6, which reads
   as sq 6. One of the two is wrong.

9. **Drop down or disclosure.** His words allow either. The `lsec` disclosure is
   already in the house vocabulary and behaves better on a phone. A native
   `select` opens the system picker. Small, but it is his surface.

---

## 16. The One Sentence

The release is a metronome with a price tag where it needs to be a mirror with
a consent screen, and everything he asked for is one honest forecast function
away, except the mask route, which is one ruling away from being mostly built
already.
