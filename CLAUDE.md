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
    node tests/engine.js               221, headless, 0.1s
    node tests/functional.js           241, real Chromium
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

**Validate at the boundary, and never lie about a failure.** `loadProfile`
still trusts everything it is given. Every write that can fail reports through
`status()`; a control must never claim success before it has it.

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

## What this project is not

No backend, no accounts, no app store, no telemetry, and no network except the
Google Fonts link noted below, which is the one thing contradicting that
sentence. Storage is
the person's own browser and can vanish, which is why save failures must be
reported rather than swallowed. Do not propose microservices, serverless,
scaling tiers, ASO or analytics SDKs. They have no surface to attach to here,
and the privacy posture is deliberate.

## Open, and whose call

**Google Fonts contradicts the privacy posture.** `source.html` links
`fonts.googleapis.com` and `fonts.gstatic.com`, so every load sends the
person's IP to Google before they have typed anything. This app holds somatic
and psychological self report. Self hosting the three families as base64, or
falling back to a system stack, removes the only outbound request in the
product. His call, because it costs bytes in a single file build.

Mine to build when asked:

- **Undo.** Applying a story bakes charge into the axes irreversibly. Largest
  remaining gap in the product.
- **Schema validation.** `loadProfile` throws on a missing field and accepts a
  charge of 9999. Reachable from the import control.
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

`STABILITY.md` is the measured snapshot of what is solid and what must be
finished, ordered by cost of leaving it alone. Read it first.
`FEEDBACK-alexander.md` is a review session with numbers attached, and it
separates what can be built in one file from what needs a backend this project
does not have.
`REVIEW-source.md` is the original review and the rebuild. `REVIEW-pass2.md`
is the second engineering pass. `tests/README.md` explains the gates.
