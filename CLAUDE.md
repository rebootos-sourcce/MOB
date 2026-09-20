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
    node tests/engine.js               843, headless, 0.1s
    node tests/functional.js           740, real Chromium
    node tests/collide.js              100, no overlapping nameplates
    node tests/design.js               105, and it is green now
    node tools/monitor.js             every surface renders, and it logs

Those counts were 279, 262, 40 and 22 in this file for long enough that they
stopped being usable. A number typed into a document that the product then
grows past is the same defect as a number typed into a gate, and this
repository has now been bitten by it seven times: three gates that counted by
hand, a heading that said "the twelve" above a list of eleven, this paragraph
twice, and a backlog line that said eight definitions were reachable only by
hover where the measured number was 195. Read the count off the run.

`monitor.js` is the render watch. It reads TABDEF and TABEXTRA at run time and
walks every surface they name, at 1600 and at 390, on a blank profile and a
loaded one, asserts the noscript notice, and
appends one stamped block to `MONITOR.log` carrying the commit, the md5,
whether the tree was dirty and the markup size of every surface. It exits non
zero on an empty surface, so "the centre column is broken again" is answered
by diffing two blocks of the log rather than by starting from a screenshot.

Three lessons are built into the check and must not be optimised out. innerText
does not see SVG, so the Body page reports zero characters of text while
rendering forty seven elements correctly, and a surface therefore passes on
markup size with text recorded beside it. A canvas has no innerHTML at all, so
the Field is counted in lit pixels against its own floor: counting its markup
reported zero for a surface that was drawing correctly. And a CSS animation
runs without scripts, so the boot sheet fades on its own and uncovers a
complete looking shell with nothing in it, which is exactly what a preview pane
showed the owner and why the noscript assertion is in there.

And one lesson learned by this file failing. The watch took the first visible
child of `.stage` as the surface host. The Field's two key strips are visible
children of `.stage` on every tab, so from the moment they landed it measured
the same strip nine times and printed nine identical numbers under the heading
"all surfaces render". It looks the host up by its id now. The rule the project
already carries covers it: anything needing a tab's entry looks it up by
identity, never by where it happens to sit.

Browser gates need `NODE_PATH` pointing at a playwright install and are run
from the repo root. `design.js` used to fail one check in a sandbox with no
font egress. It does not any more: the typeface is carried in the file and the
product makes no outbound request at all, which gate 7 now watches. Every
failure is yours.

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
needing the entry for a tab looks it up by `.k`, never by position. Compass is
integer 8, appended for that reason. Analytics (4) is a folded surface: it kept
its integer and its renderer and lost its tab, so `TABREAL` maps it to the tab
that now carries it and every caller of `setTab` goes through it.

Games (7) was folded into Knowledge and has been unfolded again, on the ruling
recorded at `engine/core.js`: they are independent games, somewhere a person
goes for brain release, and a game folded into a reference page is neither. The
bar is eight. This paragraph said otherwise for longer than it was true, which
is how a file that describes the code stops being usable as one.

**A tab host that carries a folded surface cannot also be one.** `#sum` holds
`#sumbody` and `#ana`. `#know` held `#knowbody` and `#games` until Games was
unfolded, and the lesson is the reason it is still written down. The first cut
put the child straight inside the parent and the parent's renderer, which
writes the whole innerHTML of its host, deleted the child on the way past. The
functional gate caught it.

**The app opens on the Field, ruled 19 September, reversing Summary.**
`core.js` has `tab:TAB.FIELD` and `ui.js` calls `setTab(TAB.FIELD)`. This
paragraph said Summary for longer than it was true, which a first run audit
caught. The rest of it still holds and is the reason it is still written down. Anything
that renders there renders to somebody who has entered nothing. Both surfaces
that print a reading now silence themselves on `r.unread` and show the four
doors instead, and Summary empties itself on the way out so a hidden surface
never sits in the document asserting a stale reading.

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

## The loop, and the centre. Ruled 20 September.

**The process is discover, play, flow, body.** His words, and it is the spine
everything else serves. Nothing ships that does not move a person through those
four.

**The avatar is the centrepiece.** "What is Atuned? Your avatar." Not a page in
the product, the centre of it. A person watches their avatar improve and the
improvement is driven by releases and by going through the loop above. The
layers are sewn: the avatar to the ritual, the ritual to the psyche, the psyche
to the body locations, the body to the story. One complete system.

**The content chain, also his words.** What a person enters in the journal is
added to the imprints. Part of that becomes a story they have to release. Part
becomes a practice inside the ritual. Sometimes it becomes an affirmation, also
in the ritual. The gamification exists to keep that turning, which means the
content has to be driven enough to make it sticky.

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

**Google Fonts is gone.** Settled. Inter as a variable font, latin subset,
three hundred to seven hundred in one file, embedded as base64. Forty eight
kilobytes raw and sixty four as base64, which is about a tenth of the build
for the last network dependency it had. `tests/design.js` gate 7 watches the
network and fails on any request that is not one of the two local rasters.

Mine to build when asked:

- **Undo is built, and this paragraph said otherwise for longer than it was
  true,** which is the same failure mode the Games paragraph above records.
  `engine/undo.js` is unlimited, `UNDO_MAX=0`, carries a redo stack, and
  `ui/storyui.js:82` snapshots before the charge lands. What remains is not
  undo, it is that the arrows are the only route to it.
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

## Handing the build over

**Every build goes to the owner as a download, not a preview.** Ruled. An HTML
file sent without saying how to present it renders inline in the view pane,
which looks like the app and cannot be saved, so the one thing a build is for
is the one thing it will not do. Send `source.html` as an attachment, named
`atuned.html` so the download says what it is, and state the commit and the
md5 so it is clear which build it is. The file is one file with no
dependencies and no network, so it runs from wherever it lands.

**Attach the file, never render it.** The rule above was followed and the build
still would not come off the screen. An HTML file sent without saying how to
present it defaults to render, and in the view pane a rendered file has no
download in its dropdown and no right click save, so the owner sat looking at a
working app he could not keep. Send it with the card set to attach. State the
second route beside it: the branch is pushed, so every file also has a raw
address he can save from a browser. A build he cannot save has not shipped.

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
`BOOK-ERRATA.md` is every place the codex and the engine disagree, with the
line number and the quotation, and which of the two should move.
`DECISIONS.md` is what the owner has ruled, including the tier ladder, the
snippet privacy boundary and the practitioner model, with the open items named
as open. Read it before proposing anything it already settles.
`FEEDBACK-log.md` is one entry per piece of feedback that moved the product.
