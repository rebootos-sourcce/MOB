# Atüned / SOURCE

A somatic diagnostic instrument. One HTML file, no dependencies, no network,
no backend, no accounts. A person records a story, the engine reads charge out
of it, and the app renders where that charge sits in the body and what it
costs.

`source.html` is a BUILD PRODUCT. Never edit it. Edit `atuned_src/` and run
the build. The same goes for `engine.js`.

## The shape of the thing

    atuned_src/MANIFEST        the load order, and it is load bearing
    atuned_src/BUILD.sh        -> source.html
    atuned_src/BUILD-engine.sh -> engine.js, the DOM free half
    atuned_src/engine/         data, math, schema. no browser, ever.
    atuned_src/ui/             renderers. the only half allowed a document.
    atuned_src/shell/          head, body, foot

Data before engine, engine before renderers, renderers before ui. A var used
before its declaration throws at parse. MANIFEST decides the order and nothing
else may.

## Before you commit. Every time.

    ./atuned_src/BUILD.sh              parse checks, div balance, no em dashes
    ./atuned_src/BUILD-engine.sh       and asserts the engine is host free
    node tests/engine.js               257, headless, 0.1s
    node tests/functional.js           246, real Chromium
    node tests/collide.js              40, no overlapping nameplates
    node tests/design.js               17, one expected environmental failure

Browser gates need `NODE_PATH` pointing at a playwright install and are run
from the repo root. `design.js` fails one check in a sandbox with no font
egress. That one is expected. Any other failure is yours.

Changed a data table, split a file, or moved code between modules:

    python3 tools/equiv.py old.html source.html

Coverage, when you have added or changed engine logic. 96.1 percent of engine
functions execute under `tests/engine.js` alone. An aggregate hides a hole:
the whole birth module sat at zero while the average read 92 percent, so check
the unexecuted list and not only the number.

    rm -rf /tmp/cov && NODE_V8_COVERAGE=/tmp/cov node tests/engine.js

It compares every top level declaration by name and hashed body and exits non
zero on any difference, so an intended change is a named diff you acknowledge
rather than a silent one. It has already caught a boundary that landed inside
an object literal, which concatenation would have hidden forever.

Changed anything a person can see:

    node tools/shots.js OUT 1600 1000 && node tools/shots.js OUT 390 844
    python3 tools/terms.py

Then LOOK at the images. Reading CSS is not reviewing a screen.

## Rules learned the expensive way

**Never renumber the TAB integers.** They are identity, persisted and
compared. `TABDEF` is display order and may be reordered freely. Anything
needing the entry for a tab looks it up by `.k`, never by position.

**The engine may not touch the host.** No `document`, `window`, `navigator`,
`localStorage`, `fetch`, `new Image`. `hostfree.py` enforces it after
stripping comments and strings. A host binds storage with `bindStore(get,set)`.

**Validate at the boundary, and never lie about a failure.** `validateProfile`
is the boundary. A missing field is an older profile and is filled from the
blank; a field of the wrong type or out of range is refused by name and never
silently clamped, because a clamped 9999 reads as a 10 the person never
entered. `pImport` is atomic: nothing is pushed and `CURP` does not move until
the profile has validated, loaded and saved, and a failure restores what was
there and says why through `importError()`. `loadProfile` itself still trusts
its input, which is correct only because everything a person can paste now
goes through the boundary first. There is no import control in the UI yet, so
the boundary's first real caller will be the record fetch at sign in.

Every write that can fail reports through `status()`; a control must never
claim success before it has it.

**Reproduce a failure before fixing it, and re-measure after.** Twice this
session a probe reported a defect that was the probe's own bug: one read the
background wash canvas instead of the wheel and declared the depth ladder
broken, another counted object keys at every nesting depth and declared three
literals duplicated. Both were wrong. A tool that lies is worse than no tool,
so check the tool against a known good case first.

**One word per concept.** See `.claude/skills/atuned-ux/SKILL.md`, which loads
before any user facing change and carries the measured UX floors.

## Voice. These are rulings, not preferences.

No em dashes, anywhere, including commit messages and docs. Never say 108; the
count stated to users is 112. Sentence case, no all caps UI copy. Mechanical
and precise, no soft wellness language, short sentences, physical metaphors
only. Muted palette argued from autonomic response. Icons are ring, not fill.

**Port, do not rebuild.** The arithmetic core keeps its bodies and signatures.

## What this project is becoming

**The fork is called. This becomes an accounts product.** Ruled by the owner.
A web quiz as its own product flow, a record store, sign in, a practitioner
who can be granted sight of a person's data, paid tiers, and push
notifications for ritual accountability.

That does not license building it all at once, and it does not retire the
engineering posture. What holds:

- `source.html` stays one file with no dependencies. The app gains network at
  exactly one seam, fetching a record at sign in.
- The engine stays host free. No `fetch` in `engine/`.
- Storage is still the person's own browser for everything except the quiz
  record, so save failures still must be reported rather than swallowed.
- A practitioner seeing somatic and psychological self report is a
  consequential grant. It needs explicit consent, a visible list of who has
  sight, and revocation. Never a silent default.
- Records off device mean a controller exists. Access, deletion and breach
  obligations attach.

What is now in scope that was not: auth, paywall and tiers, push
notifications, a points and badge ladder, and a practitioner view. Each still
needs designing before building.

## Open, and whose call

**Decided this round.** Strong default rather than a hard gate on the intake.
A new tab exposes every question in the centre, taken out of the left rail. A
third theme called Punch, where nothing is outlined and everything is solid.
The fork goes to accounts. Situational questions modelled on the Ultima virtue
dilemmas, pending the format ruling.

**Google Fonts contradicts the privacy posture.** `source.html` links
`fonts.googleapis.com` and `fonts.gstatic.com`, so every load sends the
person's IP to Google before they have typed anything. This app holds somatic
and psychological self report. Self hosting the three families as base64, or
falling back to a system stack, removes the only outbound request in the
product. His call, because it costs bytes in a single file build.

Mine to build when asked:

- **Undo.** Applying a story bakes charge into the axes irreversibly. Largest
  remaining gap in the product.
- **A seed decay policy.** A stated four letter type writes charge onto the
  nine axes and `seedShare` reports how much of the field is still that seed.
  Whether it should fade on its own, or only move when the person moves it,
  is open.
- **Cognitive load.** 57 to 71 simultaneous choices per screen against a
  working memory of about four. Architectural, needs a decision first.
- **The impure core.** `compute()` and friends read shared state. A front door
  contains it. Purifying is a signature rewrite and is deliberately deferred.

His, not mine:

- **Schema v2.** The gates bump is additive and v1 still loads, but it is the
  cross compatibility contract with SOURCE.
- `Root_08_Unnamed`, the compressed CQ mid range, domain weighting, the depth
  button names, the Matrix wiring.
- Whether the kink sits at the highest charge or the lowest. The code assumed
  highest by a sort order. `parseStory().path` now reports both ends.

## Records

`MILESTONES.md` is the sequenced plan, scrubbed by five disciplines, and it
records what each milestone unlocks and what must be decided before it starts.
`TASKS.md` is the single backlog. It merges the technical items with the
review feedback so there are not two competing lists. Read it first.
`STABILITY.md` is the measured snapshot behind the technical half of it.
`FEEDBACK-alexander.md` is a review session with numbers attached, and it
separates what can be built in one file from what needs a backend this project
does not have.
`REVIEW-source.md` is the original review and the rebuild. `REVIEW-pass2.md`
is the second engineering pass. `tests/README.md` explains the gates.
`DECISIONS.md` is what the owner has ruled, including the tier ladder, the
snippet privacy boundary and the practitioner model, with the open items named
as open. Read it before proposing anything it already settles.
`FEEDBACK-log.md` is one entry per piece of feedback that moved the product.
