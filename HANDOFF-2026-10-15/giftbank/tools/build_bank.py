#!/usr/bin/env python3
"""Rank the anxiety candidates, take 100, and write the bank in the validator's format.

Writes, under OUTROOT (a stand in for a repository root):
  atuned/data/gift_banks/banks/anxiety.json   the bank, 100 items
  atuned/data/gift_banks/schema.json          the item schema the bank follows (unapproved)
  atuned/data/gift_banks/mapping.json         the nature to track map, left empty on purpose
  atuned/data/gift_banks/anxiety-reserve.json the ranked candidates that did not make the 100
The validator names no location; this mirrors the layout its own test fixture builds.
"""
import json, sys, hashlib, collections
from pathlib import Path

G = Path(sys.argv[1])
OUTROOT = Path(sys.argv[2])
sys.path.insert(0, str(G))
from validate_gift_banks import canonical_hash  # the validator's own hash, imported, not copied

data = json.loads((G / 'cands.json').read_text(encoding='utf-8'))
cands = data['candidates']

# Held by reading, one reason each. A sentence here is the owner's words, but
# the words broke in transcription or say something other than what they mean.
MANUAL = {
    "I'm letting go of believing perceiving thinking being acting and feeling that I intense stress terrified worried concern afraid out of control of the future (direct hit center chest)": 'carries a side note about the body, not part of the release',
    "I'm letting go of being terrified worried nervous and secure shy to face reality as a man": '"and secure" is the transcription of "insecure"; the line says the opposite of what was said',
    "I'm letting go of being nervous shy and secure to try": '"and secure" is the transcription of "insecure"; the line says the opposite of what was said',
    "I'm letting go of believing and afraid of women": 'the words broke in transcription',
    "I'm letting go of being afraid of to face reality as a man but": 'the line stops mid word',
    "I'm letting go of believing perceiving behaving acting feeling that I'm scared to try but": 'the line stops mid word',
    "I'm letting go of being scared to wi": 'the line stops mid word',
    "I'm letting go of being scared to do the hard day first": '"hard day" is the transcription of "hard thing"',
    "I'm letting go of being terrified to get caught in the line": '"the line" is the transcription of "a lie"',
    "I'm letting go of being scared to come in the first place": '"first place" here is a transcription break',
    "I'm letting go of being terrified and paralyzed to come in the first place": '"first place" here is a transcription break',
    "I'm letting go of being scared to face life correctly": 'the next line in the same record corrects it to "directly"',
    "I'm letting go of believing I'm scared to look down": '"look down" is the transcription of "look dumb" (heading: Looking dumb)',
    "I'm letting go of believing you I'm afraid to open myself up": 'a stray "you" breaks the line',
    "I'm letting go of being afraid to die for I believe in": 'the words broke in transcription ("for what I believe in")',
    "I'm letting go of leaving I'm worried and nervous bothered stress tense afraid guilty ashamed to speak up": '"leaving" is the transcription of "believing" and the reading layer did not catch it',
    "I'm letting go of being really nervous of being tied up in a mobile": '"a mobile" is the transcription of "immobile"',
    "I'm letting go of believing perceiving behaving acting and feeling thinking speaking saying voicing that I'm easily started or scared or that I can be sort of scared easily": '"started" is the transcription of "startled"',
    "I'm letting go of believing perceiving thinking behaving acting feel like that I'm scared to fail that I'm terrified so I avoid failing": '"feel like" is the transcription of "feeling"',
    "I'm letting go of believing I am too much in my head too afraid of others judgments to scared of hearing what they will say": '"to scared" is the transcription of "too scared"',
    "I'm letting go of being scared of being judged by people will perceive me when I lead": 'a word dropped in transcription ("by how people will perceive me")',
}
import re
GENDER = re.compile(r"(?i)\b(a man|manhood|as a man|being a man)\b")
MANUAL = {k: v for k, v in MANUAL.items() if v}

PRIORITY = {'2026': 0, 'pdf_b': 1, 'pdf_a': 2}


def sha(s):
    return hashlib.sha256(s.encode('utf-8')).hexdigest()


pool, manual_held = [], []
for c in cands:
    if c['sentence'] in MANUAL:
        manual_held.append({'sentence': c['sentence'], 'locator': c['locator'], 'reason': MANUAL[c['sentence']]})
    elif GENDER.search(c['sentence']):
        manual_held.append({'sentence': c['sentence'], 'locator': c['locator'], 'reason': 'speaks to men only; the gift goes to anyone'})
    else:
        pool.append(c)
missing = set(MANUAL) - {c['sentence'] for c in cands}
for m in sorted(missing):
    print('manual hold already held by a rule:', m)
manual_held = [h for h in manual_held if h['sentence'] not in missing]

for c in pool:
    c['pattern_id'] = 'anxiety-' + sha(c['sentence'])[:16]

# Rank: core words before fear words, dictation before the PDFs, then spread
# across headings (each record's first pick before any record's second), then
# shorter first, then the stable id so the order never depends on file order.
by_rec = collections.defaultdict(list)
for c in pool:
    by_rec[(c['source'], c['source_record_id'])].append(c)
for group in by_rec.values():
    for k, c in enumerate(sorted(group, key=lambda x: (x['words'], x['pattern_id']))):
        c['spread'] = k
pool.sort(key=lambda c: (c['tier'] != 'core', PRIORITY[c['source']], c['spread'], c['words'], c['pattern_id']))
chosen, reserve = pool[:100], pool[100:]
assert len(chosen) == 100

REV = 'fbad94c62212515f7046cd1b7a8e2252fff3336e'
BLOBS = {
    'atuned/data/letgo/letgo_2026.json': 'aa4d3081ea1972988276135a9e79f321cd06649f',
    'atuned/data/letgo/letgo_pdf_a.json': '44112d9cfb49a22d85a6dd2abb3ddcd037083dd5',
    'atuned/data/letgo/letgo_pdf_b.json': '8be3bd5b27c2b1e183c46ac1afab3a8299930b03',
}


RO = Path('/home/user/ro-origin/atuned/data')
FET = {f['id']: f for f in json.loads((RO / 'pattern_data.json').read_text(encoding='utf-8'))['fetters']}
JOIN = {j['id']: j for j in json.loads((RO / 'letgo/letgo_join.json').read_text(encoding='utf-8'))}


def item(c):
    prov = {
        'source': c['source_archive'],
        'source_revision': REV,
        'source_record_file': c['source_record_file'],
        'source_record_file_blob': BLOBS[c['source_record_file']],
        'source_record_id': c['source_record_id'],
        'locator': c['locator'],
        'record_title': c['record_title'],
        'source_text_as_transcribed': c['raw'],
        'reading_layer': 'none' if c['raw'] == c['sentence'] else 'text_clean (intake rule 1189, ruled by the owner 2026-09-11)',
    }
    if c.get('record_match') and c['record_match'] != 'unique':
        prov['record_match'] = c['record_match']
    if c.get('index_node_id') is not None:
        prov['index_node_id'] = c['index_node_id']
    if c.get('also_in'):
        prov['also_in'] = c['also_in']
    j = JOIN.get(c['source_record_id']) if c['source'] == '2026' else None
    if j and j.get('fetter') in FET:
        f = FET[j['fetter']]
        prov['record_fetter_join'] = {
            'file': 'atuned/data/letgo/letgo_join.json',
            'note': 'whole record joined to a canonical fetter by the intake; a separate id namespace, evidence only',
            'fetter_id': f['id'], 'fetter_name': f['nm'], 'emo_family': f.get('emoFamily'), 'score': j.get('score'),
        }
    it = {
        'pattern_id': c['pattern_id'],
        'content': c['sentence'],
        'pattern_hash': sha(c['sentence']),
        'classification': 'release',
        'source_provenance': prov,
        'nature_evidence': {
            'rule': 'the sentence itself names the state',
            'tier': c['tier'],
            'words': c['nature_words'],
        },
        'unresolved': ['channel', 'side', 'phase', 'owner_approval'],
    }
    return it


items = [item(c) for c in chosen]
bank = {
    'nature_id': 'anxiety',
    'bank_version': 'anxiety-candidate-2026-10-16-v1',
    'source_path_or_uri': 'rebootos-sourcce/Reboot-OS:atuned/data/letgo/ (2026_Let_Go_List.txt, TULA__Lances_Let_Go_List_1.pdf, TULA__Lances_Let_Go_List.pdf)',
    'source_revision': REV,
    'approval_reference': '',
    'approved_by': '',
    'approved_at': '',
    'status': 'candidate, not approved',
    'items': items,
}
bank['content_sha256'] = canonical_hash(bank)

schema = {
    'schema_version': 'gift-bank-item-candidate-2026-10-16-v1',
    'source_revision': REV,
    'approval_reference': '',
    'approved_by': '',
    'approved_at': '',
    'required_item_fields': ['pattern_id', 'content', 'pattern_hash', 'classification', 'source_provenance'],
    'id_field': 'pattern_id',
    'provenance_field': 'source_provenance',
    'provenance_required_fields': ['source', 'source_revision', 'source_record_file', 'source_record_id', 'locator', 'source_text_as_transcribed'],
    'classification_field': 'classification',
    'classification_values': ['release', 'reframe'],
    'content_field': 'content',
}
mapping = {
    'mapping_version': 'not-defined',
    'source_revision': REV,
    'approval_reference': '',
    'approved_by': '',
    'approved_at': '',
    'nature_to_track': {},
    'note': 'Left empty on purpose. The six to four map is not defined and must not be invented (handshake section 5).',
}
mapping['content_sha256'] = canonical_hash(mapping)

d = OUTROOT / 'atuned/data/gift_banks'
(d / 'banks').mkdir(parents=True, exist_ok=True)


def dump(p, obj):
    p.write_text(json.dumps(obj, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')


dump(d / 'banks/anxiety.json', bank)
dump(d / 'schema.json', schema)
dump(d / 'mapping.json', mapping)
dump(d / 'anxiety-reserve.json', {
    'note': 'Ranked candidates after the 100, same rules, not in the bank.',
    'reserve': [{'pattern_id': c['pattern_id'], 'content': c['sentence'], 'pattern_hash': sha(c['sentence']),
                 'tier': c['tier'], 'source_record_id': c['source_record_id'], 'locator': c['locator']} for c in reserve],
    'held_by_reading': manual_held,
})
print('pool after reading', len(pool), 'chosen', len(chosen), 'reserve', len(reserve), 'held by reading', len(manual_held))
print('bank content_sha256', bank['content_sha256'])
print('tiers', collections.Counter(c['tier'] for c in chosen), 'sources', collections.Counter(c['source'] for c in chosen))
print('reading layer used', sum(1 for i in items if i['source_provenance']['reading_layer'] != 'none'))
print('distinct headings', len({(c['source'], c['source_record_id']) for c in chosen}))
ids = [i['pattern_id'] for i in items]
assert len(set(ids)) == 100
for n, c in enumerate(chosen, 1):
    print(n, c['tier'][0], c['source_record_id'], c['pattern_id'], '|', c['sentence'])
