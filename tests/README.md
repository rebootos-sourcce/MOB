# Verification gates

Run against a real Chromium, not a DOM stub. A stub resolves elements by id
regardless of tree position, so it reports green on a broken document, and it
cannot see CSS at all. Both of those have shipped regressions before.

    npm install playwright
    node tests/design.js       17 checks · shell, one surface per tab, CSS coverage,
                               11px type floor, no all-caps
    node tests/functional.js   241 checks · 10 personas x 5 tabs x 4 depths x 7 layers,
                               drills, figure fallback, zero JS errors
    node tests/collide.js      40 checks · zero overlapping wheel nameplates,
                               every persona x every depth

`design.js` reports one expected failure in a sandbox with no outbound network:
Google Fonts cannot be fetched and the two optional figure rasters are absent.
Both are environmental. The vector figure is inline and always renders.

Structure check, run whenever markup is touched. Must print 0.

    python3 -c "
    import re;s=open('source.html',encoding='utf-8').read()
    d=0
    for m in re.finditer(r'<div\b|</div>',s): d+= 1 if m.group(0)=='<div' else -1
    print('div balance',d,'| em dashes',s.count(chr(8212)))"
