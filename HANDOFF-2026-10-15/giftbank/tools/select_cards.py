#!/usr/bin/env python3
"""Pick one nature's card lines out of card_lines.json, to fill a shortfall only.

The same word sets and the same holds as the corpus (select_nature.py), on the
whole sentence as it would be read (stem plus line). The typed-list hold does
not apply, because every card line is typed and is marked "from a card, not
dictated" instead. Added for cards: a line carrying hidden characters or chat
formatting is held, and so is a set with no stem printed.

usage: select_cards.py card_lines.json NATURE OUT.json [CAP]
"""
import json, re, sys, collections
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import natures as N

lines = json.loads(Path(sys.argv[1]).read_text(encoding='utf-8'))
NAT, OUT = sys.argv[2], Path(sys.argv[3])
CAP = int(sys.argv[4]) if len(sys.argv) > 4 else 30
ARTEFACT = re.compile('[​-‏⁠﻿­\t*#\\[\\]→⚡\U0001F300-\U0001FAFF]')
PREFIX = len('I am letting go of ')

log = collections.Counter()
held = collections.defaultdict(list)
cands = {}
named = set()
for u in lines:
    s = u['sentence'] or u['raw']
    f = N.found(u['raw'])          # the line's own words decide; the stem names no state
    if NAT not in f:
        continue
    log['names this nature (lines)'] += 1
    named.add(u['norm'])
    other = sorted(k for k in f if k != NAT)
    reason = None
    if not u['sentence']:
        reason = 'no stem printed above this set'
    elif N.CRISIS.search(s):
        reason = "about ending one's life"
    elif other:
        reason = 'names another nature: ' + ', '.join(other)
    elif ARTEFACT.search(u['raw']):
        reason = 'carries hidden characters or chat formatting'
    elif N.ONE_SEX.search(s):
        reason = 'speaks to one sex, or about sex'
    elif N.SECOND.search(s[PREFIX:]):
        reason = 'a second release runs on inside it'
    elif N.negated(NAT, s):
        reason = 'the state is negated'
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
        prev['also_in'] = sorted(set(prev['also_in'] + [u['locator']]))

log['names this nature (different lines)'] = len(named)
for k, v in held.items():
    log['held: ' + k] = len(v)
c = list(cands.values())
log['unique candidates'] = len(c)
log['unique core'] = sum(1 for x in c if x['tier'] == 'core')
log['unique neighbour'] = sum(1 for x in c if x['tier'] == 'neighbour')
print(json.dumps(log, indent=1))
OUT.write_text(json.dumps({'nature': NAT, 'cap': CAP, 'named_distinct': len(named), 'candidates': c,
                           'held': dict(held)}, ensure_ascii=False, indent=1), encoding='utf-8')
