#!/usr/bin/env python3
"""Cut the "50 Limiting Beliefs" cards into lines, with the stem each set prints.

Read only. The cards are a chat session's output, not dictation (the file opens
"Here's the relevant section for Let Go Card 3B"). They are used only to fill a
shortfall, and every line taken is marked "from a card, not dictated".

The cut replays the intake's own card parser (letgo_intake.py, cards(), on
alpha/p1-fixed-pattern-gift-contract-20261010) line for line, so the sets and
items here are the ones in letgo_cards.json; that is asserted. What it adds is
the line number of every item and the stem printed above its set, for example
"I am letting go of believing, perceiving, thinking, behaving, acting, feeling,
speaking, saying, and doing that I am...". A card line is a whole sentence only
with its stem in front of it, so the sentence is the stem as printed, then the
line as printed with its first letter made small. Nothing else is changed.

usage: cards.py ROOT SUPPLEMENT.txt OUT.json
"""
import json, re, sys, hashlib
from pathlib import Path

ROOT, SUP, OUT = Path(sys.argv[1]), Path(sys.argv[2]), Path(sys.argv[3])
text = SUP.read_text(encoding='utf-8-sig')
ref = json.loads((ROOT / 'atuned/data/letgo/letgo_cards.json').read_text(encoding='utf-8'))
lines = [l.rstrip() for l in text.split('\n')]
STEM = re.compile(r"^[“\"]?\s*(I am letting go of .*?that I am)\s*(…|\.\.\.)?\s*[”\"]?$")
FULL = re.compile(r"^[“\"]?\s*(I(?:’|')m letting go of .*|I am letting go of .*)$")

sets = []
for i, l in enumerate(lines):
    if 'Limiting Beliefs' not in l:
        continue
    j = i - 1
    while j >= 0 and (not lines[j].strip() or set(lines[j].strip()) <= set('_')):
        j -= 1
    title = lines[j].strip() if j >= 0 else ''
    items, k, stem = [], i + 1, None
    while k < len(lines) and len(items) < 400:
        s = lines[k].strip(); k += 1
        m = re.match(r'^(\d+)\.\s+(.*)$', s)
        if m:
            items.append((k, m.group(2).strip()))   # k is the 1-based line number
            continue
        if not items and stem is None:
            ms = STEM.match(s)
            if ms:
                stem = ms.group(1)
        if s and items and not re.match(r'^[“"]', s) and 'letting go' not in s.lower():
            break
    sets.append({'heading_line': i + 1, 'title': title[:120], 'stem': stem, 'items': items})

assert len(sets) == len(ref), (len(sets), len(ref))
out = []
for n, (s, r) in enumerate(zip(sets, ref), start=1):
    assert r['id'] == 'card-%03d' % n and r['title'] == s['title'] and r['items'] == [t for _, t in s['items']], r['id']
    for pos, (ln, item) in enumerate(s['items'], start=1):
        bare = item.strip('“”"').strip()
        if FULL.match(bare):
            sentence, how = bare, 'the line is already a whole sentence'
        elif s['stem']:
            sentence, how = s['stem'] + ' ' + item[:1].lower() + item[1:], 'stem as printed, then the line'
        else:
            sentence, how = None, 'no stem printed above this set'
        out.append({
            'source': 'cards',
            'source_archive': 'atuned/data/letgo/raw/Tula__SUPPLIMENT_LET_GO_LIST.txt.gz',
            'source_record_file': 'atuned/data/letgo/letgo_cards.json',
            'source_record_id': r['id'],
            'record_title': r['title'],
            'card_item': pos,
            'locator': 'atuned/data/letgo/raw/Tula__SUPPLIMENT_LET_GO_LIST.txt.gz#line=%d' % ln,
            'raw': item,
            'stem': s['stem'],
            'stem_line': s['heading_line'],
            'sentence': sentence,
            'joined_how': how,
            'words': len(sentence.split()) if sentence else None,
            'norm': ' '.join(re.findall(r'[a-z0-9]+', item.casefold())),
            'sentence_sha256': hashlib.sha256(sentence.encode('utf-8')).hexdigest() if sentence else None,
        })
OUT.write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding='utf-8')
print('sets', len(sets), 'lines', len(out), 'with a stem', sum(1 for s in sets if s['stem']),
      'lines with no sentence', sum(1 for o in out if not o['sentence']),
      'already whole', sum(1 for o in out if o['joined_how'].startswith('the line is')))
import collections
print(collections.Counter(s['stem'] for s in sets).most_common(6))
