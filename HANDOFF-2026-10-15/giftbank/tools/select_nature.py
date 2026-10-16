#!/usr/bin/env python3
"""Pick one nature's candidates out of units.json. Every rule is literal and logged.

The anxiety selector (select.py) generalised to any of the five other natures.
Same rules, same order, same typed-list test. Added, because the five new banks
must stay apart from anxiety and from each other: a sentence naming a second
nature (anxiety included) is held, and a line about ending one's life is held.

usage: select_nature.py units.json NATURE OUT.json [CAP]
"""
import json, re, sys, collections
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import natures as N

units = json.loads(Path(sys.argv[1]).read_text(encoding='utf-8'))
NAT = sys.argv[2]
OUT = Path(sys.argv[3])
CAP = int(sys.argv[4]) if len(sys.argv) > 4 else 30
assert NAT in N.NATURES and NAT != 'anxiety'
PRIORITY = {'2026': 0, 'pdf_b': 1, 'pdf_a': 2}


def typed_records(units):
    """Copied from select.py unchanged. A record where most lines end in a full
    stop, or any line carries a zero width space, was typed or pasted, not
    dictated. Dictation has no punctuation."""
    per = collections.defaultdict(lambda: [0, 0, 0])
    for u in units:
        if u['source'] == '2026':
            continue
        k = (u['source'], u['source_record_id'])
        per[k][0] += 1
        per[k][1] += u['raw'].rstrip('​ ').endswith('.')
        per[k][2] += '​' in u['raw']
    return {k for k, (n, dots, zw) in per.items() if zw or dots >= 0.4 * n}


TYPED = typed_records(units)
DICTATED = {u['norm'] for u in units if u['source'] == '2026'}
TYPED_NORMS = {u['norm'] for u in units if (u['source'], u['source_record_id']) in TYPED} - DICTATED

log = collections.Counter()
held = collections.defaultdict(list)
cands = {}
named = set()
for u in units:
    s = u['sentence']
    if not s.startswith("I'm letting go of "):
        continue
    f = N.found(s)
    if NAT not in f:
        continue
    log['names this nature (units)'] += 1
    named.add(u['norm'])
    other = sorted(k for k in f if k != NAT)
    head_other = sorted(k for k in N.found(u.get('record_title') or '') if k != NAT)
    reason = None
    if N.CRISIS.search(s):
        reason = 'about ending one\'s life'
    elif other:
        reason = 'names another nature: ' + ', '.join(other)
    elif head_other:
        reason = 'filed under a heading that names another nature: ' + ', '.join(head_other)
    elif (u['source'], u['source_record_id']) in TYPED or (u['source'] != '2026' and u['norm'] in TYPED_NORMS):
        reason = 'from a typed list, not dictation'
    elif N.SECOND.search(s[18:]):
        reason = 'a second release runs on inside it'
    elif N.negated(NAT, s):
        reason = 'the state is negated'
    elif '*' in s:
        reason = 'carries a censored word'
    elif N.THIRD.search(s):
        reason = 'about a named other person'
    elif u['words'] > CAP:
        reason = 'longer than %d words' % CAP
    elif NAT == 'grief' and N.NOT_MOURNED.search(s) and f[NAT]['words'] == ['loss']:
        reason = 'a loss of power or control, not a loss that is mourned'
    if reason:
        held[reason.split(':')[0]].append(dict(u, reason_detail=reason))
        continue
    u = dict(u, tier=f[NAT]['tier'], nature_words=f[NAT]['words'])
    prev = cands.get(u['norm'])
    if prev is None:
        u['also_in'] = []
        cands[u['norm']] = u
    else:
        a, b = (prev, u) if PRIORITY[prev['source']] <= PRIORITY[u['source']] else (u, prev)
        a = dict(a)
        a['also_in'] = sorted(set(prev.get('also_in', []) + u.get('also_in', []) + [b['locator']]))
        cands[u['norm']] = a

log['names this nature (different sentences)'] = len(named)
for k, v in held.items():
    log['held: ' + k] = len(v)
log['unique candidates'] = len(cands)
c = list(cands.values())
log['unique core'] = sum(1 for x in c if x['tier'] == 'core')
log['unique neighbour'] = sum(1 for x in c if x['tier'] == 'neighbour')
log['by source'] = dict(collections.Counter(x['source'] for x in c))
print(json.dumps(log, indent=1, default=str))
OUT.write_text(json.dumps({'nature': NAT, 'cap': CAP, 'named_distinct': len(named), 'candidates': c,
                           'held': {k: v for k, v in held.items()}}, ensure_ascii=False, indent=1), encoding='utf-8')
