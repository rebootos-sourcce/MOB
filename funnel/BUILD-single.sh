#!/usr/bin/env bash
# =============================================================
# ONE SENDABLE FILE, FOR EACH FUNNEL PAGE.
#
# The funnel is written as several files on purpose: tokens.css is generated
# from the app's own stylesheet so the palette cannot drift, and quiz.html
# loads ../engine.js rather than carrying a copy that goes stale. Both are
# right for the source.
#
# Neither is sendable. The standing ruling is that a build goes to the owner
# as a download he can open, and a page that needs two siblings beside it is
# a page he cannot open from wherever it lands. So this inlines them into
# dist/, which is a build product and is never edited.
#
#   ./funnel/BUILD-single.sh   ->  funnel/dist/atuned-funnel.html
#                                  funnel/dist/atuned-quiz.html
# =============================================================
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p dist

python3 - <<'PY'
import re, pathlib, hashlib
here = pathlib.Path('.')
css  = (here/'tokens.css').read_text(encoding='utf-8')
# Path('.').parent is Path('.'), not the directory above, which is how the
# first cut of this script looked for engine.js in the wrong place twice.
eng  = (here/'engine.js') if (here/'engine.js').exists() else pathlib.Path('../engine.js')
eng  = eng.read_text(encoding='utf-8')
qs   = (here/'questions.js').read_text(encoding='utf-8')

def inline(src, out, scripts):
    h = (here/src).read_text(encoding='utf-8')
    h = h.replace('<link rel="stylesheet" href="tokens.css">',
                  '<style>\n/* tokens.css, inlined by BUILD-single.sh */\n'+css+'</style>')
    for tag, body, name in scripts:
        assert tag in h, src+' is missing '+tag
        h = h.replace(tag, '<script>\n/* '+name+', inlined by BUILD-single.sh */\n'
                      + body + '\n</script>')
    p = here/'dist'/out
    p.write_text(h, encoding='utf-8')
    md5 = hashlib.md5(p.read_bytes()).hexdigest()
    print('  %-24s %9d bytes  md5 %s' % (out, len(h.encode('utf-8')), md5))
    return h

a = inline('index.html', 'atuned-funnel.html', [])
# THE DOOR HAS TO POINT AT THE FILE HE ACTUALLY HAS. The landing sends a person
# to quiz.html, which is the source name. In dist the quiz is called
# atuned-quiz.html, because a download that says what it is beats one that says
# quiz. A link to a page is not an asset the page needs to render, so the two
# travel together but either one opens alone.
p = here/'dist'/'atuned-funnel.html'
a = p.read_text(encoding='utf-8').replace('href="quiz.html"', 'href="atuned-quiz.html"')
p.write_text(a, encoding='utf-8')
b = inline('quiz.html',  'atuned-quiz.html',
           [('<script src="../engine.js"></script>', eng, 'engine.js'),
            ('<script src="questions.js"></script>', qs,  'questions.js')])

# a sendable file that still reaches for a sibling has not been made sendable
for nm, h in (('atuned-funnel.html', a), ('atuned-quiz.html', b)):
    left = [u for u in re.findall(r'(?:src|href)="(?!https?:|#|data:|mailto:)([^"]+)"', h)
            if u != 'atuned-quiz.html']
    assert not left, nm+' still reaches for '+repr(left)
print('  neither page needs a sibling to render')
PY
