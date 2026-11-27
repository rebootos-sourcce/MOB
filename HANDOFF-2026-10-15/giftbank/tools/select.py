#!/usr/bin/env python3
"""Pick the anxiety candidates out of units.json. Every rule is literal and logged."""
import json, re, sys, collections
from pathlib import Path

units = json.loads(Path(sys.argv[1]).read_text(encoding='utf-8'))
OUT = Path(sys.argv[2])
CAP = int(sys.argv[3]) if len(sys.argv) > 3 else 30

# The sentence itself must name the state. Two tiers, core first.
CORE = r"anxious|anxiety|anxieties|worry|worries|worried|worrying|nervous|nervousness|panic|panicking|panicked|dread|dreading"
FEAR = r"afraid|scared|fear|fears|fearing|fearful|terrified|frightened|apprehensive|uneasy"
CORE_RX = re.compile(r"(?i)\b(%s)\b" % CORE)
FEAR_RX = re.compile(r"(?i)\b(%s)\b" % FEAR)
# Words that belong to the other five natures. A sentence naming one is held
# back so the six banks start apart; the owner can move it.
OTHER = {
    'overwhelm': r"overwhelm\w*",
    'burnout': r"burn(?:ed|t)? ?out|burnout|exhaust\w*|tired|drained|depleted",
    'depression': r"depress\w*|hopeless\w*",
    'grief': r"grie\w+",
    'sadness': r"sad|sadness|saddened",
}
OTHER_RX = {k: re.compile(r"(?i)\b(%s)\b" % v) for k, v in OTHER.items()}
THIRD = re.compile(r"(?i)\b(she|her|hers|he|him|his|my ex|ex's)\b")
PRIORITY = {'2026': 0, 'pdf_b': 1, 'pdf_a': 2}
# A second opener inside one unit means two releases ran together on one typed
# line or in one breath. Cutting them apart would be a guess, so the unit waits.
SECOND = re.compile(r"(?i)\b(letting go|let it go|let go|want to go|going to go|wouldn't go)\b")
NEGATED = re.compile(r"(?i)\bnot (being )?(afraid|scared|nervous|anxious|worried)\b")


def typed_records(units):
    """A record where most lines end in a full stop, or any line carries a
    zero width space, was typed or pasted, not dictated. Dictation has no
    punctuation. Measured: six records across the two PDFs."""
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
# The same line printed in a typed record is typed wherever else it appears in
# the PDFs, unless the 2026 dictation also has it word for word.
DICTATED = {u['norm'] for u in units if u['source'] == '2026'}
TYPED_NORMS = {u['norm'] for u in units if (u['source'], u['source_record_id']) in TYPED} - DICTATED

log = collections.Counter()
held = collections.defaultdict(list)
cands = {}
for u in units:
    s = u['sentence']
    if not s.startswith("I'm letting go of "):
        continue
    core = sorted({m.group(1).lower() for m in CORE_RX.finditer(s)})
    fear = sorted({m.group(1).lower() for m in FEAR_RX.finditer(s)})
    if not core and not fear:
        continue
    log['names anxiety or fear'] += 1
    reason = None
    other = [k for k, rx in OTHER_RX.items() if rx.search(s)]
    head_other = [k for k, rx in OTHER_RX.items() if rx.search(u.get('record_title') or '')]
    if other:
        reason = 'names another nature: ' + ', '.join(other)
    elif head_other:
        reason = 'filed under a heading that names another nature: ' + ', '.join(head_other)
    elif (u['source'], u['source_record_id']) in TYPED or (u['source'] != '2026' and u['norm'] in TYPED_NORMS):
        reason = 'from a typed list, not dictation'
    elif SECOND.search(s[18:]):
        reason = 'a second release runs on inside it'
    elif NEGATED.search(s):
        reason = 'the state is negated'
    elif '*' in s:
        reason = 'carries a censored word'
    elif THIRD.search(s):
        reason = 'about a named other person'
    elif u['words'] > CAP:
        reason = 'longer than %d words' % CAP
    if reason:
        held[reason.split(':')[0]].append(u)
        continue
    u = dict(u, tier='core' if core else 'fear', nature_words=core + fear)
    prev = cands.get(u['norm'])
    if prev is None:
        u['also_in'] = []
        cands[u['norm']] = u
    else:
        a, b = (prev, u) if PRIORITY[prev['source']] <= PRIORITY[u['source']] else (u, prev)
        a = dict(a)
        a['also_in'] = sorted(set(prev.get('also_in', []) + u.get('also_in', []) + [b['locator']]))
        cands[u['norm']] = a

for k, v in held.items():
    log['held: ' + k] = len(v)
log['unique candidates'] = len(cands)
c = list(cands.values())
log['unique core'] = sum(1 for x in c if x['tier'] == 'core')
log['unique fear'] = sum(1 for x in c if x['tier'] == 'fear')
log['by source'] = dict(collections.Counter(x['source'] for x in c))
print(json.dumps(log, indent=1, default=str))
OUT.write_text(json.dumps({'candidates': c, 'held': {k: v for k, v in held.items()}}, ensure_ascii=False, indent=1), encoding='utf-8')
