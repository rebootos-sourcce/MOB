# Figures printed straight after words in the renderers. Run from the repo root.
# Read against commit 34012d7: 66 hits, of which 5 are CSS and not copy (map.js:390,
# map.js:934, onboard.js:86, rings.js:237, rings.js:274), leaving 61 copy sites.
# It only sees a figure that directly follows a string literal, so a figure passed
# through a helper such as row() or cr() is missed, and the count is a floor.
# The first version used a grep bracket expression that closed early and matched
# geometry; it was discarded after it failed on the three known lines.

import re,glob,sys,collections
# a figure printed straight after a string literal: '...word <b>'+expr.toFixed(n)  or '...word '+expr.toFixed(n)
pat=re.compile(r"'((?:[^'\\\n]|\\.)*)'\s*\+\s*\(?[\w.$\[\]'|()*+\-/ ]{1,60}?\.toFixed\(\d\)")
hits=[]
for f in sorted(glob.glob('atuned_src/ui/*.js')):
    for i,line in enumerate(open(f),1):
        s=line.strip()
        if s.startswith('/*') or s.startswith('*') or s.startswith('//'): continue
        for m in pat.finditer(line):
            lit=m.group(1)
            txt=re.sub(r'<[^>]*>','',lit).strip()
            if not re.search(r'[A-Za-z]{2,}',txt): continue      # coordinates, attributes
            if re.search(r'(=|\bM\b|\bL\b|px|rgba|translate|rotate|viewBox|d=|x=|y=|r=|width|height|stroke|fill)',lit): continue
            last=re.findall(r'[A-Za-z][A-Za-z\-]*',txt)[-1]
            hits.append((f.split('/')[-1],i,last,txt[-50:]))
by=collections.Counter(h[2].lower() for h in hits)
print('figures printed after a word:',len(hits))
print('files:',collections.Counter(h[0] for h in hits).most_common())
print('word before the figure:',by.most_common(25))
if '-v' in sys.argv:
    for h in hits: print(h)
