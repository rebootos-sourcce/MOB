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
    node tests/engine.js       147 checks in 15 groups

The 15 groups: data integrity, determinism, the poled binary (jouissance begins
at 6), monotonicity, CQ bounds and ceiling, saboteur charge ranges are bands and
not floors, the six gates multiply resistance, the lean, schema round trip,
partial intake scoring, the sniffer, the expression deficit model, accuracy,
the chain compounding in order, and every persona computing.

`BUILD-engine.sh` also greps the concatenated engine for `document`, `window`,
`navigator`, `requestAnimationFrame` and `new Image`, and fails if it finds one.
The engine is not allowed to reach for a document.

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
