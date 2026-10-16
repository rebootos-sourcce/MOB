#!/usr/bin/env python3
"""Measure overlap across the six banks and their reserves, apart from the validator.

The validator refuses an id that sits in two banks. This also compares the
sentences themselves, and their words with case and punctuation set aside, so
two ids for the same words would be caught too.

usage: overlap.py GIFTBANK_DIR
"""
import json, re, sys, itertools, collections
from pathlib import Path

D = Path(sys.argv[1])
NAT = ('anxiety', 'overwhelm', 'burnout', 'grief', 'sadness', 'depression')
norm = lambda s: ' '.join(re.findall(r'[a-z0-9]+', s.casefold()))
bank, res = {}, {}
for n in NAT:
    bank[n] = json.loads((D / n / 'banks' / ('%s.json' % n)).read_text(encoding='utf-8'))['items']
    res[n] = json.loads((D / n / ('%s-reserve.json' % n)).read_text(encoding='utf-8'))['reserve']
out = {'banks': {n: len(bank[n]) for n in NAT}, 'reserves': {n: len(res[n]) for n in NAT}, 'pairs': []}
for a, b in itertools.combinations(NAT, 2):
    A = [i['content'] for i in bank[a]] + [r['content'] for r in res[a]]
    B = [i['content'] for i in bank[b]] + [r['content'] for r in res[b]]
    ids = {i['pattern_id'] for i in bank[a]} & {i['pattern_id'] for i in bank[b]}
    same = set(A) & set(B)
    near = {norm(x) for x in A} & {norm(x) for x in B}
    out['pairs'].append({'pair': [a, b], 'same_id': len(ids), 'same_sentence': len(same), 'same_words': len(near)})
out['total_same_id'] = sum(p['same_id'] for p in out['pairs'])
out['total_same_sentence'] = sum(p['same_sentence'] for p in out['pairs'])
out['total_same_words'] = sum(p['same_words'] for p in out['pairs'])
print(json.dumps(out, indent=1))
sys.exit(1 if out['total_same_id'] or out['total_same_sentence'] or out['total_same_words'] else 0)
