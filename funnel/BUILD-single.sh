#!/usr/bin/env bash
# =============================================================
# ONE SENDABLE FILE, FOR EACH FUNNEL PAGE.
#
# The funnel is written as several files on purpose: tokens.css is generated
# from the app's own stylesheet so the palette cannot drift, ring.js carries
# the seven band ring once so the funnel and the tab cannot end up with two
# drawings of it, and quiz.html loads ../engine.js rather than carrying a copy
# that goes stale. All three are right for the source.
#
# None of them is sendable. The standing ruling is that a build goes to the
# owner as a download he can open, and a page that needs three siblings beside
# it is a page he cannot open from wherever it lands. So this inlines them
# into dist/, which is a build product and is never edited.
#
#   ./funnel/BUILD-single.sh   ->  funnel/dist/atuned-funnel.html
#                                  funnel/dist/atuned-quiz.html
#                                  funnel/dist/atuned-about.html
#                                  funnel/dist/atuned-buy.html
#
# IT BUILT TWO OF THE FOUR AND dist HELD FOUR. about and buy were in dist from
# an older run of this script, so the two pages nobody rebuilt were the two
# that looked fine and were months behind. A build product that outlives the
# rule that made it is worse than no build product, so dist is emptied of html
# first and every page in the directory is built. The list is read off the
# directory: a page added to the funnel ships without this file being edited.
# =============================================================
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p dist
rm -f dist/*.html

python3 - <<'PY'
import re, pathlib, hashlib
here = pathlib.Path('.')
css  = (here/'tokens.css').read_text(encoding='utf-8')
# Path('.').parent is Path('.'), not the directory above, which is how the
# first cut of this script looked for engine.js in the wrong place twice.
eng  = (here/'engine.js') if (here/'engine.js').exists() else pathlib.Path('../engine.js')
eng  = eng.read_text(encoding='utf-8')
qs   = (here/'questions.js').read_text(encoding='utf-8')
ring = (here/'ring.js').read_text(encoding='utf-8')

# THE DOOR HAS TO POINT AT THE FILE HE ACTUALLY HAS. Every page links to its
# siblings by source name. In dist they are called atuned-something, because a
# download that says what it is beats one that says quiz. A link to a page is
# not an asset the page needs to render, so the four travel together and any
# one of them opens alone.
OUT = {'index.html':'atuned-funnel.html', 'quiz.html':'atuned-quiz.html',
       'about.html':'atuned-about.html',  'buy.html':'atuned-buy.html'}
SRC = sorted(p.name for p in here.glob('*.html'))
missing = [s for s in SRC if s not in OUT]
assert not missing, 'no dist name for '+repr(missing)+': add it to OUT'

SCRIPTS = {'quiz.html': [('<script src="../engine.js"></script>', eng,  'engine.js'),
                         ('<script src="questions.js"></script>', qs,   'questions.js'),
                         ('<script src="ring.js"></script>',      ring, 'ring.js')]}

built = {}
for src in SRC:
    h = (here/src).read_text(encoding='utf-8')
    assert '<link rel="stylesheet" href="tokens.css">' in h, src+' does not link tokens.css'
    h = h.replace('<link rel="stylesheet" href="tokens.css">',
                  '<style>\n/* tokens.css, inlined by BUILD-single.sh */\n'+css+'</style>')
    for tag, body, name in SCRIPTS.get(src, []):
        assert tag in h, src+' is missing '+tag
        h = h.replace(tag, '<script>\n/* '+name+', inlined by BUILD-single.sh */\n'
                      + body + '\n</script>')
    for a, b in OUT.items():
        h = h.replace('href="'+a+'"', 'href="'+b+'"')
    p = here/'dist'/OUT[src]
    p.write_text(h, encoding='utf-8')
    built[OUT[src]] = h
    print('  %-24s %9d bytes  md5 %s'
          % (OUT[src], len(h.encode('utf-8')), hashlib.md5(p.read_bytes()).hexdigest()))

# a sendable file that still reaches for a sibling has not been made sendable.
# The four dist names are routes and not assets, so they are the only strings
# allowed to remain.
for nm, h in built.items():
    left = [u for u in re.findall(r'(?:src|href)="(?!https?:|#|data:|mailto:)([^"]+)"', h)
            if u not in OUT.values()]
    assert not left, nm+' still reaches for '+repr(left)
print('  %d pages, and none of them needs a sibling to render' % len(built))
PY
