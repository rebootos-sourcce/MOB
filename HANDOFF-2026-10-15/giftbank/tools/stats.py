import json, re, sys, collections
G = sys.argv[1]
u = json.load(open(G + '/units.json', encoding='utf-8'))
d = json.load(open(G + '/cands.json', encoding='utf-8'))
b = json.load(open(G + '/repo/atuned/data/gift_banks/banks/anxiety.json', encoding='utf-8'))
r = json.load(open(G + '/repo/atuned/data/gift_banks/anxiety-reserve.json', encoding='utf-8'))
cand = {x['norm'] for x in d['candidates']}
PRI = {'2026': 0, 'pdf_b': 1, 'pdf_a': 2}
first = {}
for reason, xs in d['held'].items():
    for x in xs:
        if x['norm'] in cand:
            continue
        k = (PRI[x['source']], x['locator'])
        if x['norm'] not in first or k < first[x['norm']][0]:
            first[x['norm']] = (k, reason)
print('held distinct', len(first), collections.Counter(v[1] for v in first.values()))
print('reading holds', collections.Counter('men only' if 'men only' in h['reason'] else 'transcription' for h in r['held_by_reading']))
words = collections.Counter(w for i in b['items'] for w in i['nature_evidence']['words'])
print(words)
print(collections.Counter(i['nature_evidence']['tier'] for i in b['items']))
rep = {}
for reason, xs in d['held'].items():
    for x in xs:
        if x['norm'] in first and first[x['norm']][1] == reason and x['norm'] not in rep and (PRI[x['source']], x['locator']) == first[x['norm']][0]:
            rep[x['norm']] = {'sentence': x['sentence'], 'reason': reason, 'source_record_id': x['source_record_id'], 'locator': x['locator']}
held = sorted(rep.values(), key=lambda h: (h['reason'], h['locator']))
held += [dict(h, reason='held on reading: ' + h['reason']) for h in r['held_by_reading']]
json.dump({'note': 'Every sentence that named anxiety or fear and is not in the bank or the reserve, one reason each.', 'count': len(held), 'held': held},
          open(G + '/repo/atuned/data/gift_banks/anxiety-held.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
print('held file', len(held))
