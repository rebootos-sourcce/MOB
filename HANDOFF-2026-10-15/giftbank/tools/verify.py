import json, re, sys, hashlib
G = sys.argv[1]
sys.path.insert(0, G + '/tools')
b = json.load(open(G + '/repo/atuned/data/gift_banks/banks/anxiety.json', encoding='utf-8'))
raw26 = open(G + '/src/2026_Let_Go_List.txt', encoding='utf-8-sig').read().split('\n')
pdf = json.load(open(G + '/pdflines.json', encoding='utf-8'))
P = {(r['file'], r['page'], r['line']): r['text'] for r in pdf}
src = open(G + '/src/letgo_intake.py.txt', encoding='utf-8').read()
block = src[src.index('CLEAN=['):src.index('def topics')]
ns = {'re': re}
exec(block, ns)
clean = lambda t: ns['clean'](t)[0]
bad = 0
for it in b['items']:
    p = it['source_provenance']; raw = p['source_text_as_transcribed']; loc = p['locator']
    ok = clean(raw).strip() == it['content'] and hashlib.sha256(it['content'].encode()).hexdigest() == it['pattern_hash']
    ok = ok and it['content'].startswith("I'm letting go of ")
    if '2026_Let_Go_List' in loc:
        n = int(re.search(r'line=(\d+)', loc).group(1)); ok = ok and raw in raw26[n - 1]
    else:
        f = re.search(r'raw/(.+?)\.gz', loc).group(1)
        m = re.search(r'page-lines=(\d+):(\d+)(?:-(\d+):(\d+))?', loc)
        p1, l1 = int(m.group(1)), int(m.group(2)); p2, l2 = (int(m.group(3)), int(m.group(4))) if m.group(3) else (p1, l1)
        keys = sorted(k for k in P if k[0] == f and (p1, l1) <= (k[1], k[2]) <= (p2, l2))
        ok = ok and raw == ' '.join(P[k].strip() for k in keys)
    if not ok:
        bad += 1; print('FAIL', it['pattern_id'], it['content'])
print('items', len(b['items']), 'failed', bad)
