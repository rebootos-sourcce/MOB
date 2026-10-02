# Verification gates

Four gates. One is headless and runs in under a tenth of a second. Three drive a
real Chromium, not a DOM stub. A stub resolves elements by id regardless of tree
position, so it reports green on a broken document, and it cannot see CSS at all.
Both of those have shipped regressions before.

## The engine gate

No browser, no DOM, no renderers. It requires `engine.js` and asserts the
contract rather than today's numbers, so a legitimate tuning change passes and a
broken invariant does not.

    ./atuned_src/BUILD-engine.sh
    node tests/engine.js       279 checks in 22 groups

The 17 groups: data integrity, determinism, the poled binary (jouissance begins
at 6), monotonicity, CQ bounds and ceiling, saboteur charge ranges are bands and
not floors, the six gates multiply resistance, the lean, schema round trip,
partial intake scoring, the sniffer, the expression deficit model, accuracy,
the chain compounding in order, every persona computing, the front door, the host
seam, and the path.

`BUILD-engine.sh` then runs `atuned_src/hostfree.py`, which strips comments and
string literals and fails on `document`, `window`, `navigator`, `localStorage`,
`sessionStorage`, `requestAnimationFrame`, `alert`, `fetch`, `XMLHttpRequest` or
`new Image`. The engine is not allowed to reach for its host. Stripping first
matters: a comment naming `localStorage` is not a call to it, and the lexicon
data legitimately contains the word window.

## The front door

The engine has one entrance and the three surfaces are separable, so each can be
tested on its own.

    read(profile, opts)     all three at once. what callers want.
      input(profile, opts)  one profile in. it is the only input.
      throughput(profile)   the chain, in the one order it runs in.
      output(profile)       the field written back as schema.

    opts.story              text to apply once before computing
    opts.write              also write the field back into the profile

`read()` is repeatable: twice on one profile gives identical numbers. The chain
underneath was not, because the gate mixes accumulate, and this module is the
only thing permitted to zero them.

The engine ships with a no-op profile store, so a headless run persists nothing
and never throws. A host binds its own with `bindStore(get, set)`. `ui/ui.js`
binds `localStorage`.

## The browser gates

    npm install playwright
    node tests/design.js       17 checks · shell, one surface per tab, CSS coverage,
                               11px type floor, no all-caps
    node tests/functional.js   262 checks · 10 personas x 5 tabs x 4 depths x 7 layers,
                               drills, figure fallback, zero JS errors
    node tests/collide.js      40 checks · zero overlapping wheel nameplates,
                               every persona x every depth
    node tests/unpack.js       round PO, unpack every symbol: on the Summary reading,
                               the blueprint card, the sign chips, the left rail and
                               every pole on the Compass, a seeded term with no
                               meaning beside it fails. The table it holds the page
                               to is engine/data/gloss.js. Shown against a known bad
                               block first, and against the build from before the
                               round, which it fails. Read the count off the run.
    node tests/sound.js        the fittings, ui/sound.js: every sound rendered
                               offline under its ceiling and its cap, silent
                               off, under Quiet, before a press and inside a
                               release, each proven against a broken engine.
                               Also called at the end of functional.js.
                               Read the count off the run.
    node tests/msglog.js       the bottom message dock: three seconds, Keep, the
                               last fifty in a log, a failure never swallowed.
    node tests/protocol.js     a release's cross, End on every phase, and End
                               charging only the lines that were said.
    node tests/device.js       device settings (Practitioner mode) on a worked
                               example. The last three are also called from
                               functional.js, and each fails on the build from
                               before its change.
    node tests/personas-tier.js every worked example opens on a live tier four
                               plan with nothing locked, read off the record with
                               the SIGHT_PLAN seam off, and the person's own
                               record keeps its own tier and is never written to
                               tier four. Fails on the build from before Round
                               PS (e0c46d6^) and on one example left unexempted.
    node tests/feedback.js     the feedback tracker: comment, question and
                               something broken in Help, the outbox losing
                               nothing on a late or refused send, no token on
                               the request, and the Discord door a stub until
                               its invite is a real Discord invite. The engine
                               half runs on a private copy and against broken
                               copies; the surface half against a stubbed
                               /v1/feedback, so nothing leaves the machine.
                               Also called from functional.js. Fails on the
                               build from before it. FB_NO_BROWSER=1 runs the
                               engine half alone.

All three resolve `source.html` from the working directory, so run them from the
repo root.

`design.js` reports one expected failure in a sandbox with no outbound network:
Google Fonts cannot be fetched and the two optional figure rasters are absent.
Both are environmental. The vector figure is inline and always renders.

## The path simulation

The engine gate asserts the path's contract. The simulation attacks it, by
generating stories out of the app's own vocabulary and checking invariants that
would catch the path being an artifact of scan order, of punctuation, or of
nothing at all.

    node tools/simulate-path.js [stories] [seed]     default 4000, seeded

Roughly 18 assertions per story: determinism, case and punctuation invariance,
unknown words at the ends not moving the route, reversal reversing the route and
flipping the direction while preserving the distance, a different order being a
different route, joined stories concatenating, the geometry not contradicting
itself, every step sitting on a measured seat, and the path moving no number in
the app. The seed is printed, so a failure is reproducible from its seed alone.

It found two defects in the sniffer underneath and three in its own invariants.
Both kinds are worth the run.

## Equivalence

`tools/equiv.py` extracts every top-level declaration from two bundles and
compares the multiset of name against hashed body. Use it after any move or
resplit of `atuned_src/` to prove nothing changed that was not meant to.

    python3 tools/equiv.py old.html new.html

It exits non-zero if any body differs, so an intended change shows up as a named
diff you have to acknowledge rather than a silent one.

## Structure check

Run whenever markup is touched. Must print 0. `BUILD.sh` runs the same check and
refuses to finish if either number is non-zero.

    python3 -c "
    import re;s=open('source.html',encoding='utf-8').read()
    d=0
    for m in re.finditer(r'<div\b|</div>',s): d+= 1 if m.group(0)=='<div' else -1
    print('div balance',d,'| em dashes',s.count(chr(8212)))"

## The copy walk

The voice gate in `.claude/skills/atuned-voice/check.py` reads the source, and
the owner reads the screen. A string built at run time, a figure held in a
table, or a title a stylesheet capitalises is not a literal in any file, so a
source sweep reported clean while the Field rail printed "Heaviest Root 0.0".

    NODE_PATH=/opt/node22/lib/node_modules node tools/copy-walk.js
    python3 tools/copy-verify.py COPY-VERIFY-strings.json

The walk loads the built page on a blank profile and on loaded ones, at 1600 and
at 390, opens every tab and presses every control once, hovers the carriers, and
collects every string a person can read: text, `title`, `aria-label`,
placeholders, `data-tip`, the one tooltip's panels, the status line, dialogs and
every table in the product. The verify step runs the gates in `check.py` and
`objections.json`, called and not copied, and four rules a source sweep cannot
carry because they depend on whether the profile is unread: a percent on an
unread profile or off zero, a bare number on an unread profile, a count against
a total at any scale, and a zero where a dash belongs. Nothing here is a typed
count. Run it after a change a person can see, and read `COPY-VERIFY.md`.
