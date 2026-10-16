#!/usr/bin/env python3
"""Read every row of a bank back out of the raw files, apart from the validator.

verify.py generalised. Owner lines: the raw words must sit on the cited line of
the raw dictation, or be the cited typed-list lines joined, and the intake's own
reading rules (exec'd from letgo_intake.py, not copied) must turn them into the
sentence. Card lines: the raw line must be the numbered item on the cited line
of the card text, the stem must be the one printed above that set, and the
sentence must be the stem, a space, then the line with its first letter made
small. Every row: the hash is the SHA-256 of the sentence.

usage: verify_nature.py WORK BANK.json
"""
import json, re, sys, hashlib
from pathlib import Path

G, BANK = Path(sys.argv[1]), Path(sys.argv[2])
b = json.loads(BANK.read_text(encoding='utf-8'))
raw26 = (G / 'src/2026_Let_Go_List.txt').read_text(encoding='utf-8-sig').split('\n')
sup = (G / 'src/supplement.txt').read_text(encoding='utf-8-sig').split('\n')
pdf = json.loads((G / 'pdflines.json').read_text(encoding='utf-8'))
P = {(r['file'], r['page'], r['line']): r['text'] for r in pdf}
src = (G / 'src/letgo_intake.py.txt').read_text(encoding='utf-8')
ns = {'re': re}
exec(src[src.index('CLEAN=['):src.index('def topics')], ns)
clean = lambda t: ns['clean'](t)[0]
bad, kinds = 0, {}
for it in b['items']:
    p = it['source_provenance']; raw = p['source_text_as_transcribed']; loc = p['locator']
    ok = hashlib.sha256(it['content'].encode()).hexdigest() == it['pattern_hash']
    kind = p.get('source_kind') or ('owner dictation' if '2026_Let_Go_List' in loc else 'owner typed list')  # the anxiety bank predates the field
    kinds[kind] = kinds.get(kind, 0) + 1
    if kind == 'from a card, not dictated':
        n = int(re.search(r'line=(\d+)$', loc).group(1))
        m = re.match(r'^\s*\d+\.\s+(.*)$', sup[n - 1])
        ok = ok and m is not None and m.group(1).strip() == raw
        # the stem is printed inside quote marks on a line between the set's heading and the item
        stem_ok = any(p['card_stem_as_printed'] in l for l in sup[p['card_stem_heading_line']:n])
        ok = ok and stem_ok and it['content'] == p['card_stem_as_printed'] + ' ' + raw[:1].lower() + raw[1:]
    elif '2026_Let_Go_List' in loc:
        n = int(re.search(r'line=(\d+)', loc).group(1))
        ok = ok and raw in raw26[n - 1] and clean(raw).strip() == it['content'] and it['content'].startswith("I'm letting go of ")
    else:
        f = re.search(r'raw/(.+?)\.gz', loc).group(1)
        m = re.search(r'page-lines=(\d+):(\d+)(?:-(\d+):(\d+))?', loc)
        p1, l1 = int(m.group(1)), int(m.group(2)); p2, l2 = (int(m.group(3)), int(m.group(4))) if m.group(3) else (p1, l1)
        keys = sorted(k for k in P if k[0] == f and (p1, l1) <= (k[1], k[2]) <= (p2, l2))
        ok = ok and raw == ' '.join(P[k].strip() for k in keys) and clean(raw).strip() == it['content']
    if not ok:
        bad += 1; print('FAIL', it['pattern_id'], it['content'])
print(json.dumps({'bank': b['nature_id'], 'items': len(b['items']), 'matched': len(b['items']) - bad, 'failed': bad, 'by_kind': kinds}))
sys.exit(1 if bad else 0)
