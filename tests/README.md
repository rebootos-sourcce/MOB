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
    node tests/engine.js       198 checks in 18 groups

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
    node tests/functional.js   241 checks · 10 personas x 5 tabs x 4 depths x 7 layers,
                               drills, figure fallback, zero JS errors
    node tests/collide.js      40 checks · zero overlapping wheel nameplates,
                               every persona x every depth

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
