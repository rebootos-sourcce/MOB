# SOURCE · five review passes

## Pass 1. Structure, dead code, duplication

1. `renderStory()` is a one-line wrapper around `stRender()` and is never called. Dead.
2. `var PHRASES=[...]` is immediately followed by `var PHRASES=PHRASES;`, a no-op self-assignment.
3. `var SAB31=SAB33;`. Alias declared, never referenced.
4. `ARCH18`, an 18-row table mapping archetype → primary saboteur → band. Never read.
5. `SABAUTH`, ~2KB of authored clinical composition per saboteur ("Aggression + Cruelty +
   Self-importance") plus emotion thresholds. Never read. The richest dead data in the file.
6. `SAB_LIB` rows carry a `bands` array. Only `nids` and `hcx` are ever read.
7. `MONO()` returns `S.mono`, which is set `false` at init and never toggled by any control.
   Every `MONO()?…:…` branch in the canvas renderer is unreachable.
8. `S.treat` and `S.profile` are initialised and never read.
9. CSS duplicated wholesale: `.tabtop[aria-pressed=true]`, `.pm-top`, `.pm-lb`, `.pm-well`,
   `.pm-aura`, `.pm-svg`, `.pm-seat`, `.emap`, `.pm-lbl`, `.pm-more`, `.nf .tr`, `.st-row`
   each appear twice. Second wins; the first is inert.
10. Two independent release mechanisms coexist: `#bRel` runs `REL`/`stepRel` (a smooth
    eased decay) while `relPick`/`relRender` runs the four-channel `RUN` protocol. Neither
    knows about the other.
11. `ST_PICK` (story tab) and `IMP_PICK` (imprint panel) are two selection stores bound to the
    same `[data-imp]` elements. `impWire` runs last so `ST_PICK` never fires.

## Pass 2. Correctness

1. **`#eshelf` does not exist.** `renderMap()` builds the entire Energy Map shelf, flow
   percentage, dominant seat, the layer list, the legend, the seat table, the detail panel,
   then does `var es=document.getElementById('eshelf'); if(es)es.innerHTML=sh;`. There is no
   such element in the markup. The guard makes it silent. The whole right-hand read of the
   Energy tab is computed and discarded on every frame.
2. **The polarity compass leaks across tabs.** `.pol2` and `body:not(.tab-field) .pol2` declare
   an identical property set. The second rule was plainly meant to hide it (`.acc` next to it
   does exactly that). As written the compass floats over the Energy Map, Summary and Analytics.
3. **`LEX` has silently overriding duplicate keys.** The burnout block at the top of the
   lexicon is partly cancelled by the older block below it: `dread` is `['root',24]` then
   `['root',22]`; `tense` is `['throat',16]` then `['root',12]`. Last wins, so the newer,
   more specific entries lose to the older generic ones. The opposite of the intent stated
   in the comment directly above them.
4. **Switching persona destroys the user's diagnostic.** `loadP()` does
   `CURP.intake.answers = Object.assign({}, p.intakeAnswers)`. `CURP` is whichever profile is
   selected in the intake panel, normally "You". Answer the 63-question diagnostic, click
   Sofia, and your answers are overwritten and then persisted by the next `pSave()`.
5. **`lawsFor()` makes `saveYou()`'s law persistence unreachable.** `lawsFor` returns
   `LAWSET[p.nm] || p.law`. `LAWSET.You` exists, so the `p.law` fallback can never be taken
   for any persona. Editing the 21 law sliders as "You", switching away and back, silently
   reverts every one of them to the flat 6.5 default.
6. `LAWSET` assigns `Humility` to James and Gordon. There is no Humility law among the 21.
   `SINAMES.forEach` never reads it, so the intended character note never reaches the engine.
7. `sunSign()` contains three sequential loops over `ZSIGN`. The first two are entirely
   overwritten by the third. Only the third is load-bearing.
8. `BHIT` is referenced twice inside `if(false && BHIT.length)`. The variable is never
   declared. Short-circuit evaluation is the only thing preventing a ReferenceError.
9. `r.affPairs` is computed and returned by `compute()` and never consumed.
10. `sabLevels()` synthesises `grief`, `guilt`, `pride`, `craving`, `separation`. No row in
    `SAB33` uses any of them.
11. **`impRender()` is O(pills × engine).** `impPill` builds a `title` attribute by calling
    `limitOf(n)`, and `limitOf` calls `compute()`, a full 112-address, four-tier chain
    rebuild, once per pill. `painOf` walks the whole set again per pill. At ~50 held addresses
    that is fifty complete engine passes per keystroke in the story box.
12. `g.roundRect` (used by `pill()`) has no fallback on older Safari.

## Pass 3. Data integrity

1. `NODES` is 112 rows: 108 somatic, 4 field. `W` is correctly 108.
2. The header comment says "14 named Blueprint Domains … locked at 18 (5/5/4/4) so 4 are
   still unnamed." `DOMAINS` actually holds **19** fully named rows (5 Architect, 5 Engine,
   5 Weaver, 4 Witness). `HOWTO[3]` says "eighteen domains"; the left-rail label says
   "nineteen"; `DARC` is `360/19`. The data is right and two pieces of copy are wrong.
3. `MASKS` holds 6. The comment above `maskRing` says "Ring 5. the seven masks". The wheel
   draws `i/6*TAU` and the pill reads "6 MASKS". Copy is wrong, code is right.
4. `SI` is 21 rows and the CQ ceiling depends on that. Correct.
5. `PRACTICE` is 17 rows across four tracks and three tiers. `ritFor()` correctly detects
   that Mind and Energy have nothing at tier 1 and reports the substitution rather than
   silently naming a track it then contradicts. This is the most careful function in the file.
6. `sab33Detect()` scores band membership rather than a floor, awards 0.5 for adjacency, and
   reports `exact`. The range semantics in the comment ("below it the saboteur has not
   formed, above it the charge has escalated past this one") are genuinely honoured.

## Pass 4. Art direction

1. Body face is Comfortaa. The direction calls for Lexend 300/400/500/600 and IBM Plex Mono
   for digits.
2. **Size is the real gap.** Mono eyebrows are set at 7px, 7.5px and 8px. Body rows are 9px
   to 10.5px. The direction sets reading text at 15 to 16px and small text at 14px. Every text
   size in the app is roughly half the floor the direction establishes. Nothing else in the
   critique matters as much as this.
3. Lexend is hit hardest when set tight (94.7 → 84.8). The app tracks headline numerals at
   `-.04em` and card names at `-.01em`. Under the new face those have to go to zero or
   positive.
4. `.ip` imprint pills are solid fills with the number inside. The direction replaces them
   with one combined object: ring container, glyph naming the seat, arc carrying the value,
   number in the tail. The app has no glyph vocabulary at all. Seats are named in words only.
5. The app has no alarm state. Severity is carried by opacity alone, which is the weakest
   possible channel. The direction supplies `--alarm` and `--alarm-soft` for the top band.
6. Palette: the app runs desaturated (`--root:#9E5151`), the direction runs brighter
   (`--root:#CB5F59`, `--heart:#68CBA4`). Ground goes from `#07070B` near-black with
   backdrop-blur glass to `#12131A` with flat `#191B23` panels. The direction is calmer and
   drops the blur entirely.
7. The direction's `.verdict` block, gold left rule, tinted ground, generous line height,
   is exactly the component the app lacks for its findings prose.

## Pass 5. Accessibility and robustness

1. **Below 1180px both side rails are `display:none`.** Every control and the entire
   right-hand read vanish on a tablet or phone, leaving a wheel that cannot be driven.
   Combined with `overflow:hidden` on `body` there is no scroll escape.
2. `prefers-reduced-motion` kills CSS transitions but the rAF loop keeps animating: the core
   pulses, the aura drifts, and the polarity marker oscillates. The JS never checks.
3. The canvas has no `role`, no `aria-label` and no text alternative. Wheel interaction is
   pointer-only. Mitigated, not solved, by the fact that domains, archetypes and the
   saboteur list all have real button equivalents in the rails.
4. `aria-pressed` and `aria-label` are used correctly on the icon grids, and
   `button:focus-visible` is defined. The parts that are keyboard-reachable are done properly.
5. Contrast is nominally fine (`--dim` resolves to roughly 5:1) but irrelevant at 7px.
6. `localStorage` and `SpeechRecognition` are both correctly feature-guarded in try/catch.

---

# The attached package · five passes

Files: `ATUNED_HANDSHAKE.md`, `ATUNED_DESIGN_BRIEF.md`, `SOURCE_SCHEMA_v1.md`,
`SOURCE_IA_AND_BLOCKS.md`, `ATUNED_COLOUR_LANGUAGE.html`, `source_figure.svg`,
`ATUNED_B16.html`.

## Pass 1. What contradicts the build I had in flight

1. **The node count.** The handshake rules it: never say 108, the count is 112.
   I had "108 ADDRESSES" on the wheel pill, "of 108" in the right rail, and 108
   in eleven other places. `W` is legitimately the 108 somatic addresses, but
   every total shown to a person has to read 112.
2. **Em dashes.** Zero tolerance, and I had two.
3. **All caps.** The brief is explicit that caps costs legibility and that weight
   should carry the hierarchy instead. I had caps on every eyebrow, every wheel
   pill and every section header.
4. **The palette I was given first is not the palette the research lands on.**
   The type-and-ring document supplies a brighter set (`--root:#CB5F59`). The
   brief supplies a muted set (`#C4635E`) and the reason: red, orange and yellow
   are the three most arousing hues, and they are bolted to the three seats that
   carry the heaviest load in most fields. The muted set wins because it is
   argued from autonomic response rather than from taste.
5. **Icon selection.** I had `aria-pressed` filling the tile gold. The UNC study
   (n=1,260) says recognition speed matters most *before* selection, so a fill
   spends legibility where it is not needed. Ring or border instead. The brief
   flags this as a reversal of its own earlier advice.
6. **Ring scope.** B19 restricts the ring to one-value-given-room: accuracy, CQ
   on summary, convergence, flow-through. Explicitly not law bars, seat rows or
   deltas. I was about to put rings on everything.

## Pass 2. What the package confirms

1. `source_figure.svg` is the `BODYPATH` and transform, byte-identical to my
   transcription, at the same `translate(22.3567,0.5262) scale(0.096960)`.
   The figure is a vector asset, so the two base64 PNGs were never the only
   way to draw the body.
2. `SOURCE_SCHEMA_v1.md` matches the schema I built field for field: `v`, `soul`,
   `axes`, `laws`, `intake`, `story`, `history`, and the 15-field snapshot.
3. The intake contract matches: 63 questions, spread is the signal, never require
   all 63, score whatever is answered.
4. The IA tab order matches: Story, Summary, Field, Energy, Analytics.

## Pass 3. The research, and where it is honest about itself

1. The brief opens by disowning four earlier simulations: "the truth model and
   the classifier were both written by the same hand." That is the right call and
   it is the reason to trust the rest of the document.
2. The hue-quantity finding is the strongest single result for this app: under
   high hue quantity, high contrast stops helping and may *delay* attentional
   orienting. Nineteen filled colour tiles is a high-hue-quantity display. That
   is a measured reason the domain grid fails, not an aesthetic one.
3. The grouping remedy follows from it: contiguous blocks of one colour searched
   fastest. The nineteen domains must be ordered by root cluster.
4. The blue-light result (1.1 minutes to relax against 3.5) carries a caveat the
   brief states: the advantage disappears after a 3.5 to 5 minute convergence
   window. So cool ground helps arrival, not the whole session. It argues for a
   calm *entry*, which is what a muted base palette gives.
5. "Extraneous cognitive load is the only one of the three types design can
   remove." That is the sharpest line in the document and it condemns a specific
   thing I had built: an explanatory micro-line under most panels.

## Pass 4. Internal tensions in the package

1. **The two palettes disagree.** The type-and-ring document and the design brief
   ship different values for the same seven seats. The brief argues from
   physiology and is dated later in the reasoning chain, so it wins, but the
   conflict should be stated rather than silently resolved.
2. **The ring document shows rings in lists; B19 says headline values only.**
   Reconcilable: the ring at `lg` and `md` for single headline values, at `sm`
   inline in prose where the ring is carrying a sentence rather than a column.
   Law bars, seat rows and deltas stay bare numbers, as ruled.
3. **"Say less" against five composite lenses and a spiritual overlay.** The
   Summary is the densest surface in the app and the brief's instruction to be
   brief is in tension with it. The resolution is that lenses are *content* and
   micro-annotation is *scaffolding*; cut the scaffolding, keep the content.
4. **`Root_08_Unnamed`** is listed as his longest-standing open ruling. Not mine
   to close. It stays exactly as it is, with no fetter, and the engine already
   handles a null fetter without complaint.

## Pass 5. What I will not do

1. **Not reordering the tabs.** The handshake names a stale tab index as the
   single most common bug in this codebase, four occurrences. I am making them
   named constants, which is the debt the handshake says is worth paying first,
   but the order stays 0 Story, 1 Summary, 2 Field, 3 Energy, 4 Analytics.
2. **Not resolving the open rulings.** Compressed CQ mid-range, domain weighting,
   depth button names, the defaulted CQ in the diagnostic header. All his.
   The one exception is the Matrix: the ruling is "either they drill or it comes
   out", and wiring the drill is strictly the smaller change, so I wire it.
3. **Not building B20 to B23.** Nerve flow states, intake extension, pixel mask
   and Source AI conversation are downstream of this pass by the handshake's own
   ordering. B17 is the block in front of me.

---

# What was built

`source.html`, one file, no dependencies. Every engine value verified against the
personas before a renderer was written.

## Fixed from the original

| | |
|---|---|
| `#eshelf` did not exist | the Energy shelf was computed every frame and dropped. The element exists, the shelf renders. |
| the compass leaked across tabs | `body:not(.tab-field) .pol2` declared the same properties instead of hiding it. |
| `LEX` duplicate keys | the newer specific entries were cancelled by older generic ones. Merged, one entry per key, verified by parsing the source. |
| persona switch destroyed the diagnostic | `loadP` wrote each persona's seeded answers onto the live profile. Each persona now owns a profile. |
| `lawsFor` made `saveYou` unreachable | law edits as "You" reverted silently. `p.law` is now checked first. |
| `LAWSET` phantom laws | `Humility` and `Justice` are not among the 21, so James's, Gordon's and Angela's values were dropped. Carried by laws that exist. |
| band routing | one Shame address at the heart was enough to route the whole heart band, so despair idioms filed as shame. A named fetter must now hold a quarter of the seat. |
| `impRender` was O(pills x engine) | `limitOf` called `compute()` once per pill. One pass, one index. |
| rails vanished below 1180px | `display:none` on both columns left an undriveable wheel. They stack. |
| reduced motion ignored in JS | the core, aura and compass kept animating. The loop checks. |
| bubble packer NaN | a field where every value is zero divided by that maximum. |
| wheel nameplates collided | radial text extends outward by its full length; separating by a font-size is not enough. |

## Wired, not deleted

`SABAUTH` (41 clinical compositions), `ARCH18` and the Matrix cells were all dead
data or dead controls. They are read now rather than removed.

## The brief, applied

Muted palette at the ruled values, full chroma reserved for alarm. 16px reading
text, 13px data rows, 11px labels, nothing below the floor. Sentence case
throughout, verified in the browser. Nineteen domains on five columns so each
root cluster is one contiguous row of one colour. Selection is a ring, not a
fill. Off-white ground in light, never pure white. Explanatory micro-lines cut.

## Held to

No em dashes, checked. 112 addresses, never 108. Tab indices are named constants.
`Root_08_Unnamed` left exactly as it is: his ruling, not mine.

## The engine, extracted

The app was one file. It still ships as one file, because that was the ruling and
the brief says port, do not rebuild. But a single file is not a place you can test
an engine, so the file now has a source tree behind it and the build regenerates
it byte for byte.

`atuned_src/` holds 34 modules. `atuned_src/MANIFEST` is their order and the order
is load bearing: data before engine, engine before renderers, renderers before ui.
Nothing else is allowed to decide that order. `BUILD.sh` parse-checks every module
with `node --check` before it joins any of them, concatenates per MANIFEST, then
asserts div balance 0 and zero em dashes on the result. A module that does not
parse fails the build instead of failing in a browser.

`BUILD-engine.sh` concatenates only the engine half and produces `engine.js`,
which node can require and a browser can load as a plain script. It then greps
the output for `document`, `window`, `navigator`, `requestAnimationFrame` and
`new Image`, and fails on any hit. The engine computes; it does not draw.

That grep is what forced the one structural change. The raster probe for the two
optional figure PNGs lived with the figure data. It constructs an `Image`, so it
is a renderer concern, and it moved to `ui/map.js`. Its `var ART_OK={}` stayed in
the engine, because the engine reads it. While moving it I fixed the magic number
inside it: it compared `S.tab` against a bare `3`, and a stale tab integer is the
most repeated bug in this codebase, so it now reads `TAB.ENERGY`.

`tests/engine.js` is the gate that extraction bought. 147 assertions, 15 groups,
no browser, 0.09 seconds. It asserts the contract and not today's numbers, so
tuning a coefficient passes and breaking an invariant does not: jouissance begins
at 6 and not 5, the saboteur charges are bands and not floors, the six VERP gates
multiply resistance rather than adding to it, the expression fill and leak always
sum to 10, the schema round trips, and the chain compounds in the stated order.

Writing it found a real defect in `accuracy()`. It read the current profile as a
free variable, so the fit could only ever be measured against whichever profile
happened to be live. It now takes the profile as an argument and defaults to the
live one, which changes no call site and makes the function honest about what it
depends on. Hidden mutable state was how the persona switch destroyed a live
profile's diagnostic answers in the original; this was the same shape of bug one
layer down.

Two checks keep the split honest. `tools/equiv.py` compares every top-level
declaration in two bundles by name and hashed body, and it caught my own mistake
while I was doing this: one boundary landed inside the `LEANCUE` object literal,
so `lexicon.js` began mid-array. Concatenation would have hidden it forever. And
the three browser gates run against the rebuilt file, not the hand-written one:
241 functional, 40 collision, 16 of 17 design, the one failure environmental.

## The front door, and the two inputs nobody wrote down

The engine had no entrance. It exported 84 names and `compute()` took no
arguments, so the only way to get a reading was to reach in, mutate `S`,
`DOMAIN`, `VERPMIX` and `LEANMIX` in the right order, and then call it. The
order was real and undocumented. Nothing outside the engine could hand it a
profile and get a number back.

There is one entrance now, in `engine/read.js`, and it is the three surfaces:

    read(profile, opts)     all three at once
      input(profile, opts)  one profile in. it is the only input.
      throughput(profile)   the chain, in the one order it runs in.
      output(profile)       the field written back as schema.

The chain underneath keeps its bodies and its signatures, because the ruling was
port and not rebuild, and `tools/equiv.py` can still prove the arithmetic did not
move. What changed is that this module is now the only thing permitted to touch
the shared field state, it does so in one fixed order, and it zeroes what
accumulates.

That last part was a defect, not a tidy-up. The gate mixes accumulate with `+=`.
Calling the chain twice counted the same story cues twice, so a reading was not
repeatable. `read()` is: two reads of one profile return identical numbers, and a
story applied twice reads once. Both are asserted.

Building the door found the more serious one. The VERP mix is a cost multiplier
of 0.60 to 1.35 on every held pattern, which is to say it moves every CQ in the
app, and the schema never stored it. Neither was the lean. A reload silently
changed every number a person had been looking at. Schema v2 adds
`gates:{verp,lean}`, `loadProfile` and `saveProfile` read and write it, and a v1
profile still loads: gates absent reads as zero evidence, which is exactly what
no story means. Saving upgrades it in place.

**This touches the cross-compatibility contract with SOURCE, so the version bump
is his call.** The change is additive and a v1 profile is still readable, so
nothing breaks either way. If he would rather hold v1, the fix reverts to a
one-line version pin and the gates ride along as an ignored field.

Two smaller things fell out of the same work. `accuracy()` read the live profile
as a free variable, so the fit could only ever be measured against whichever
profile happened to be current; it takes the profile as an argument now. And the
engine was reaching for `localStorage` in `pStore` and `pPersist`, which my own
DOM gate missed because the gate was a bare grep for five other names. The store
is injectable now, `bindStore(get,set)`, and the gate is `atuned_src/hostfree.py`,
which strips comments and string literals before checking so it can screen ten
host names without tripping over prose that mentions them.

What is still owed, stated plainly rather than left to be discovered. The core is
still impure: `compute()`, `buildSoul()`, `exprRead()`, `sabLevels()`,
`sab33Detect()`, `bandIg()` and `snapshot()` all read shared state and several
write it. The door hides that from callers, it does not remove it. Making them
take the field as an argument is the honest fix and it kills the bug class rather
than containing it, but it rewrites the signatures of the core, which the
handshake rules against, and every one of them would have to be re-proved by the
gate alone. It belongs in its own change, once the interface has settled.

## The path, and the third of the lexicon that was never landing

`scanStory` records `at`, the character offset of every hit, and sorts by it.
`parseStory` then collapsed everything into per band totals. The route a sentence
takes through the body was computed once per parse and discarded. It is kept now.

Every step sits at a measured position. `SEATXY` is the centroid of each seat's
own traced branches in `NERVEBR`, derived and not declared. They come out in
anatomical order without being told to, crown at y 7.9 down to root at 72.5,
which is the check that the tracing is coherent. No invented anatomy, and no
frequency: the quantity is distance along the figure, which the file can support.

A step is a word occurrence, not a lexicon match. One word can hit a phrase, a
`LEX` entry and an adjective at once, and those are one event in the body rather
than three. The first version made them three steps, which reported a 30 unit
journey for the single word "anxious" and let the ordering depend on which of the
three scan loops ran first. Match precedence is written down now, so the route is
a property of the text instead of a property of the loops.

The path reports both a `kink` and a `floor`. He named that open question and
said he did not know which end the block sits at. The app had already answered
it: `parseStory` sorts by susceptibility and takes the top, which assumes the
highest charge. Nobody ruled that, it fell out of a sort order. Both ends are
reported now so it can be ruled from data.

The path is a record and not an input. `applyStory` does not read it and no
number moves because of it. That is deliberate. The claim it encodes is not
measured yet, and an unmeasured claim must not reach the arithmetic.

### What the simulation found

`tools/simulate-path.js` generates stories from the app's own vocabulary and
checks about eighteen invariants per story. Roughly 580,000 assertions across six
seeds now pass. Three of the first failures were bad invariants of mine, and they
are worth recording because each looked like a code bug: padding a sentence with
unknown words splits the 124 multi word phrases, reversing a sentence breaks them
too, and several steps sitting at one seat is a legitimate span of zero, not a
contradiction. The corpus generator was also cycling on a 32 bit LCG, so the run
was testing far fewer distinct stories than it claimed.

One failure was real, and it was not in the new code.

The suppression that makes an idiom outrank its own words tested
`at < h.at + h.t.length + 2`. A match of `' w '` occupies `at` to `at+len+2`, but
its trailing space **is** the next word's leading space, so the next word starts
at `at+len+1` and fell inside the window. Keys are scanned longest first, so any
word directly following a longer one was silently dropped. On text built from
lexicon words back to back, **32.7 percent of legitimate matches never landed**.
On realistic mixed text the fix recovers 11.3 percent more hits and 13 percent
more imprints, and 58 percent of stories now read differently than they did.

That is a behaviour change and not a one to one rebuild, which is the right
outcome: the previous reading was wrong. The idiom still outranks the words
inside it, asserted both in the gate and in the simulation.

The declaration diff against the previous build is six new names and two changed
bodies, `scanStory` and `parseStory`. Nothing else in the engine moved.
