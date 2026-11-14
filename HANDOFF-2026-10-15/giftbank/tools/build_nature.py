#!/usr/bin/env python3
"""Rank one nature's candidates, take up to 100, and write its bank in the validator's format.

build_bank.py generalised. The owner's own lines come first (dictation, then the
typed lists). Only if they fall short of 100 are card lines taken, and each is
marked "from a card, not dictated". If the two together fall short, the bank is
written short: no line is invented and no off-nature line is added.

Writes, under OUTDIR (HANDOFF-2026-10-15/giftbank/<nature>):
  banks/<nature>.json      the bank
  schema.json, mapping.json copied byte for byte from the anxiety bank's
  <nature>-reserve.json    ranked candidates after the 100
  <nature>-held.json       every line that named the nature and is not used, with its reason

usage: build_nature.py WORK NATURE OUTDIR RO_DATA ANXIETY_DIR
"""
import json, sys, hashlib, collections, re, shutil
from pathlib import Path

G, NAT, OUTDIR, RO, AX = Path(sys.argv[1]), sys.argv[2], Path(sys.argv[3]), Path(sys.argv[4]), Path(sys.argv[5])
HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(G)); sys.path.insert(0, str(HERE))
from validate_gift_banks import canonical_hash  # the validator's own hash, imported, not copied
import natures as N

corp = json.loads((G / ('cands_%s.json' % NAT)).read_text(encoding='utf-8'))
card = json.loads((G / ('cards_%s.json' % NAT)).read_text(encoding='utf-8'))
HOLD = json.loads((HERE / 'reading_holds.json').read_text(encoding='utf-8'))[NAT]
PRIORITY = {'2026': 0, 'pdf_b': 1, 'pdf_a': 2, 'cards': 3}
REV = 'fbad94c62212515f7046cd1b7a8e2252fff3336e'
LB_REV = 'e98a057859fb97dbe35fd58a20d944dd29db587d'
BLOBS = {
    'atuned/data/letgo/letgo_2026.json': 'aa4d3081ea1972988276135a9e79f321cd06649f',
    'atuned/data/letgo/letgo_pdf_a.json': '44112d9cfb49a22d85a6dd2abb3ddcd037083dd5',
    'atuned/data/letgo/letgo_pdf_b.json': '8be3bd5b27c2b1e183c46ac1afab3a8299930b03',
    'atuned/data/letgo/letgo_cards.json': '85f3fe9f06f88ca6e7c095b25d8b17f40aecc412',
}
KIND = {'2026': 'owner dictation', 'pdf_b': 'owner typed list', 'pdf_a': 'owner typed list', 'cards': 'from a card, not dictated'}


def sha(s):
    return hashlib.sha256(s.encode('utf-8')).hexdigest()


# ---- held by reading ---------------------------------------------------------
pool, reading_held = [], []
for c in corp['candidates']:
    why = HOLD['owner'].get(c['sentence'])
    if why is None and N.ONE_SEX.search(c['sentence']):
        why = 'speaks to one sex, or about sex; the gift goes to anyone'
    if why:
        reading_held.append({'sentence': c['sentence'], 'source_kind': KIND[c['source']], 'source_record_id': c['source_record_id'],
                             'locator': c['locator'], 'reason': 'held on reading: ' + why})
    else:
        pool.append(c)
cardpool = []
for c in card['candidates']:
    why = HOLD['cards'].get(c['raw'])
    if why:
        reading_held.append({'sentence': c['sentence'], 'card_line_as_printed': c['raw'], 'source_kind': KIND['cards'],
                             'source_record_id': c['source_record_id'], 'locator': c['locator'], 'reason': 'held on reading: ' + why})
    else:
        cardpool.append(c)
stale = (set(HOLD['owner']) - {c['sentence'] for c in corp['candidates']}) | (set(HOLD['cards']) - {c['raw'] for c in card['candidates']})
assert not stale, ('a reading hold names a line that is not a candidate', stale)

# A card line that says the same words as one of the owner's lines is his line, not the card's.
own_norms = {c['norm'] for c in pool}
cardpool = [c for c in cardpool if c['norm'] not in own_norms]

for c in pool + cardpool:
    c['pattern_id'] = NAT + '-' + sha(c['sentence'])[:16]

# ---- rank --------------------------------------------------------------------
# Owner lines before card lines. Then core words before neighbour words, the
# dictation before the typed lists, spread across headings (or card sets) so each
# one's shortest line comes before any one's second, shorter first, then the
# stable id so the order never depends on where a line sits in a file.
by_rec = collections.defaultdict(list)
for c in pool + cardpool:
    by_rec[(c['source'], c['source_record_id'])].append(c)
for group in by_rec.values():
    for k, c in enumerate(sorted(group, key=lambda x: (x['words'], x['pattern_id']))):
        c['spread'] = k
order = lambda c: (c['source'] == 'cards', c['tier'] != 'core', PRIORITY[c['source']], c['spread'], c['words'], c['pattern_id'])
pool.sort(key=order); cardpool.sort(key=order)
ranked = pool + cardpool
chosen, reserve = ranked[:100], ranked[100:]
ids = [c['pattern_id'] for c in chosen]
assert len(set(ids)) == len(ids)

FET = {f['id']: f for f in json.loads((RO / 'pattern_data.json').read_text(encoding='utf-8'))['fetters']}
JOIN = {j['id']: j for j in json.loads((RO / 'letgo/letgo_join.json').read_text(encoding='utf-8'))}


def item(c):
    prov = {
        'source': c['source_archive'],
        'source_kind': KIND[c['source']],
        'source_revision': REV,
        'source_record_file': c['source_record_file'],
        'source_record_file_blob': BLOBS[c['source_record_file']],
        'source_record_id': c['source_record_id'],
        'locator': c['locator'],
        'record_title': c['record_title'],
        'source_text_as_transcribed': c['raw'],
    }
    if c['source'] == 'cards':
        prov['card_stem_as_printed'] = c['stem']
        prov['card_stem_heading_line'] = c['stem_line']
        prov['reading_layer'] = 'card join: the stem printed above the set, a space, then the card line with its first letter made small'
        prov['note'] = 'Generated in a chat session, not dictated by the owner. Used only because his own lines fall short of 100.'
    else:
        prov['reading_layer'] = 'none' if c['raw'] == c['sentence'] else 'text_clean (intake rule 1189, ruled by the owner 2026-09-11)'
        if c.get('record_match') and c['record_match'] != 'unique':
            prov['record_match'] = c['record_match']
        if c.get('index_node_id') is not None:
            prov['index_node_id'] = c['index_node_id']
        j = JOIN.get(c['source_record_id']) if c['source'] == '2026' else None
        if j and j.get('fetter') in FET:
            f = FET[j['fetter']]
            prov['record_fetter_join'] = {
                'file': 'atuned/data/letgo/letgo_join.json',
                'note': 'whole record joined to a canonical fetter by the intake; a separate id namespace, evidence only',
                'fetter_id': f['id'], 'fetter_name': f['nm'], 'emo_family': f.get('emoFamily'), 'score': j.get('score'),
            }
    if c.get('also_in'):
        prov['also_in'] = c['also_in']
    return {
        'pattern_id': c['pattern_id'],
        'content': c['sentence'],
        'pattern_hash': sha(c['sentence']),
        'classification': 'release',
        'source_provenance': prov,
        'nature_evidence': {'rule': 'the sentence itself names the state', 'tier': c['tier'], 'words': c['nature_words']},
        'unresolved': ['channel', 'side', 'phase', 'owner_approval'],
    }


items = [item(c) for c in chosen]
n_own = sum(1 for c in chosen if c['source'] != 'cards')
n_card = len(chosen) - n_own
bank = {
    'nature_id': NAT,
    'bank_version': '%s-candidate-2026-10-16-v1' % NAT,
    'source_path_or_uri': 'rebootos-sourcce/Reboot-OS:atuned/data/letgo/ (2026_Let_Go_List.txt, TULA__Lances_Let_Go_List_1.pdf, TULA__Lances_Let_Go_List.pdf'
                          + (', and for the card lines only, Tula__SUPPLIMENT_LET_GO_LIST.txt' if n_card else '') + ')',
    'source_revision': REV,
    'approval_reference': '',
    'approved_by': '',
    'approved_at': '',
    'status': 'candidate, not approved',
    'counts': {'items': len(items), 'owner_lines': n_own, 'card_lines_not_dictated': n_card, 'shortfall_to_100': 100 - len(items)},
    'items': items,
}
bank['content_sha256'] = canonical_hash(bank)

# ---- Little Books: read, measured, none qualifies by the same rules ----------
lb = []
for f in sorted(G.glob('lb_*.json')):
    d = json.loads(f.read_text(encoding='utf-8'))
    for k, p in enumerate(d['pairs'], 1):
        s = p['charge_text']
        fd = N.found(s)
        if NAT not in fd:
            continue
        other = sorted(x for x in fd if x != NAT)
        reasons = []
        if other:
            reasons.append('names another nature: ' + ', '.join(other))
        if len(s.split()) > corp['cap']:
            reasons.append('longer than %d words (%d)' % (corp['cap'], len(s.split())))
        lb.append({'volume': d['volume'], 'pair': k, 'charge': p['charge'], 'sentence': s, 'words': len(s.split()),
                   'file': 'MOB %s:generator/volumes/%s' % (LB_REV[:7], f.name[3:]), 'source_note': p.get('_source'),
                   'reason': '; '.join(reasons) or 'qualifies'})
lb_ok = [x for x in lb if x['reason'] == 'qualifies']

# ---- held: one row per different sentence, first reason by source priority ---
cand_norms = {c['norm'] for c in corp['candidates']}


def first_held(held, can):
    first = {}
    for reason, xs in held.items():
        for x in xs:
            if x['norm'] in can:
                continue
            k = (PRIORITY[x['source']], x['locator'])
            if x['norm'] not in first or k < first[x['norm']][0]:
                first[x['norm']] = (k, x)
    rows = []
    for _, x in first.values():
        r = {'sentence': x['sentence'] or x['raw'], 'source_kind': KIND[x['source']], 'reason': x['reason_detail'],
             'source_record_id': x['source_record_id'], 'locator': x['locator']}
        if x['source'] == 'cards':
            r['card_line_as_printed'] = x['raw']
        rows.append(r)
    return sorted(rows, key=lambda h: (h['reason'], h['locator']))


own_held = first_held(corp['held'], cand_norms)
card_held = first_held(card['held'], {c['norm'] for c in card['candidates']})
dup_card = [c for c in card['candidates'] if c['norm'] in own_norms]

OUTDIR.mkdir(parents=True, exist_ok=True)
(OUTDIR / 'banks').mkdir(exist_ok=True)


def dump(p, obj):
    p.write_text(json.dumps(obj, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')


dump(OUTDIR / 'banks' / ('%s.json' % NAT), bank)
shutil.copyfile(AX / 'schema.json', OUTDIR / 'schema.json')
shutil.copyfile(AX / 'mapping.json', OUTDIR / 'mapping.json')
dump(OUTDIR / ('%s-reserve.json' % NAT), {
    'note': 'Ranked candidates after the 100, same rules, not in the bank. Card lines are marked.',
    'status': 'candidate, not approved',
    'reserve': [{'pattern_id': c['pattern_id'], 'content': c['sentence'], 'pattern_hash': sha(c['sentence']), 'tier': c['tier'],
                 'source_kind': KIND[c['source']], 'source_record_id': c['source_record_id'], 'locator': c['locator']} for c in reserve],
})
dump(OUTDIR / ('%s-held.json' % NAT), {
    'note': 'Every line that named %s and is not in the bank or the reserve, one reason each.' % NAT,
    'counts': {'owner_lines_held_by_rule': len(own_held), 'card_lines_held_by_rule': len(card_held),
               'held_on_reading': len(reading_held), 'little_books_lines_read': len(lb), 'little_books_lines_that_qualify': len(lb_ok)},
    'owner_lines_held_by_rule': own_held,
    'card_lines_held_by_rule': card_held,
    'held_on_reading': reading_held,
    'little_books_lines_read': lb,
})
stats = {
    'nature': NAT, 'cap': corp['cap'],
    'owner_named_distinct': corp['named_distinct'], 'owner_passed_rules': len(corp['candidates']),
    'owner_held_on_reading': sum(1 for h in reading_held if h['source_kind'] != KIND['cards']),
    'owner_pool': len(pool),
    'owner_by_source': dict(collections.Counter(c['source'] for c in pool)),
    'card_named_distinct': card['named_distinct'], 'card_passed_rules': len(card['candidates']),
    'card_held_on_reading': sum(1 for h in reading_held if h['source_kind'] == KIND['cards']),
    'card_same_as_owner_line': len(dup_card), 'card_pool': len(cardpool),
    'chosen': len(chosen), 'chosen_owner': n_own, 'chosen_card': n_card, 'reserve': len(reserve), 'shortfall': 100 - len(chosen),
    'chosen_tiers': dict(collections.Counter(c['tier'] for c in chosen)),
    'chosen_owner_tiers': dict(collections.Counter(c['tier'] for c in chosen if c['source'] != 'cards')),
    'own_held_reasons': dict(collections.Counter(h['reason'].split(':')[0] for h in own_held)),
    'card_held_reasons': dict(collections.Counter(h['reason'].split(':')[0] for h in card_held)),
    'little_books_read': len(lb), 'little_books_qualify': len(lb_ok),
    'reading_layer_used': sum(1 for i in items if i['source_provenance']['reading_layer'].startswith('text_clean')),
    'distinct_headings': len({(c['source'], c['source_record_id']) for c in chosen}),
    'bank_content_sha256': bank['content_sha256'],
}
dump(G / ('stats_%s.json' % NAT), stats)
print(json.dumps(stats, indent=1))
for n, c in enumerate(chosen, 1):
    print(n, KIND[c['source']][:5], c['tier'][0], c['source_record_id'], '|', c['sentence'])
