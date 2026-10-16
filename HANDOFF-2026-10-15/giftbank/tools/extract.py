#!/usr/bin/env python3
"""Cut the LET GO corpus into candidate release sentences, with provenance.

Read only. Inputs: the Reboot-OS checkout root, the decompressed raw 2026 text,
and the PDF line dump made by pdflines.py. Output: every candidate unit as JSON.

A unit is cut only at a boundary the source itself gives:
  PDFs   one typed line, joined with the wrap line(s) under it.
  2026   the dictation has no punctuation, so a unit starts at each
         "I'm letting go" in the owner's reading layer and runs to the next.
Nothing is reworded. The sentence is the reading layer (text_clean rules,
ruled by the owner on 11 September, intake rule 1189); the transcribed words
are kept beside it.
"""
import json, re, sys, hashlib
from pathlib import Path

ROOT = Path(sys.argv[1])
RAW2026 = Path(sys.argv[2])
PDFLINES = Path(sys.argv[3])
OUT = Path(sys.argv[4])

# The intake's own reading layer and heading rule, copied from
# atuned/test/tools/letgo_intake.py on alpha/p1-fixed-pattern-gift-contract-20261010.
CLEAN = [
 (r"(?i)\bI'm going to go bleeding\b", "I'm letting go of believing"),
 (r"(?i)\bI want to go bleeding\b", "I'm letting go of believing"),
 (r"(?i)\bI'm going to go believing\b", "I'm letting go of believing"),
 (r"(?i)\bI'm going to go believe in\b", "I'm letting go of believing"),
 (r"(?i)\bI'm going to go believe\b", "I'm letting go of believing"),
 (r"(?i)\bI'm going to go leaving\b", "I'm letting go of believing"),
 (r"(?i)\bI'm going to go be leaving\b", "I'm letting go of believing"),
 (r"(?i)\bI'm going to go being\b", "I'm letting go of being"),
 (r"(?i)\bI'm going to go feeling\b", "I'm letting go of feeling"),
 (r"(?i)\bletting go bleeding\b", "letting go of believing"),
 (r"(?i)\bletting Go believe in\b", "letting go of believing"),
 (r"(?i)\bletting go believing\b", "letting go of believing"),
 (r"(?i)\bspeaking saying poison\b", "speaking saying voicing"),
 (r"(?i)\bletting go be believing\b", "letting go of believing"),
 (r"(?i)\bletting go be leaving\b", "letting go of believing"),
 (r"(?i)\bletting of believing\b", "letting go of believing"),
 (r"(?i)\bof bleeding\b", "of believing"),
 (r"(?i)\bgo bleeding\b", "go of believing"),
 (r"(?i)\bbe leaving\b", "believing"),
 (r"(?i)\bbleeding\b", "believing"),
 (r"(?i)\bproceeding\b", "perceiving"),
 (r"\bI[;']{1,2}m\b", "I'm"), (r"\bI'n\b", "I'm"), (r"\bIm\b", "I'm"), (r"\bi;m\b", "I'm"),
 (r"(?i)\bletting Go\b", "letting go"),
]
CLEAN = [(re.compile(a), b) for a, b in CLEAN]


def clean(t):
    for rx, rep in CLEAN:
        t = rx.sub(rep, t)
    return t


def is_head(s):
    s = s.strip()
    return 1 <= len(s.split()) <= 6 and s[:1].isupper() and not s.endswith('.') \
        and 'letting' not in s.lower() and "i'm" not in s.lower() and len(s) < 48


def toks(s):
    return re.findall(r"[a-z0-9]+", s.casefold())


def sha(s):
    return hashlib.sha256(s.encode('utf-8')).hexdigest()


def load(name):
    return json.loads((ROOT / 'atuned/data/letgo' / name).read_text(encoding='utf-8'))


REC = {'2026': load('letgo_2026.json'), 'pdf_a': load('letgo_pdf_a.json'), 'pdf_b': load('letgo_pdf_b.json')}
INDEX = {}
for m in re.finditer(r'^\| (\d+) \| ([^|]+) \|', (ROOT / 'atuned/docs/LET_GO_CORPUS_CLEAN.md').read_text(encoding='utf-8'), re.M):
    INDEX[int(m.group(1))] = m.group(2).strip()

units = []
problems = []

# ---- 2026 dictation -------------------------------------------------------
text = RAW2026.read_text(encoding='utf-8-sig')
topics = []
cur = None
for n, raw in enumerate(text.split('\n'), start=1):
    l = raw.strip()
    if not l:
        continue
    if is_head(l):
        cur = {'title': l, 'head': n, 'lines': []}
        topics.append(cur)
        continue
    if cur is None:
        cur = {'title': '(untitled opening)', 'head': None, 'lines': []}
        topics.append(cur)
    cur['lines'].append((n, l))
topics = [t for t in topics if ' '.join(x for _, x in t['lines']).strip()]
assert len(topics) == len(REC['2026']), (len(topics), len(REC['2026']))
OPEN = re.compile(r"I'm letting go\b")
for i, (t, rec) in enumerate(zip(topics, REC['2026']), start=1):
    rid = '2026-%03d' % i
    assert rec['id'] == rid and rec['title'] == t['title'], rid
    assert rec['text'] == ' '.join(x for _, x in t['lines']), rid
    ordinal = 0
    for n, line in t['lines']:
        # raw split points: word starts whose cleaned continuation opens with "I'm letting go"
        starts = [0]
        for m in re.finditer(r"(?<=\s)\S", line):
            p = m.start()
            if OPEN.match(clean(line[p:p + 60])):
                starts.append(p)
        pieces = [line[a:b].strip() for a, b in zip(starts, starts[1:] + [len(line)])]
        cl_pieces = [x.strip() for x in re.split(r"(?=I'm letting go\b)", clean(line)) if x.strip()]
        joined_ok = ' '.join(clean(p) for p in pieces if p) == ' '.join(cl_pieces)
        for p in pieces:
            if not p:
                continue
            ordinal += 1
            units.append({
                'source': '2026',
                'source_archive': 'atuned/data/letgo/raw/2026_Let_Go_List.txt.gz',
                'source_record_file': 'atuned/data/letgo/letgo_2026.json',
                'source_record_id': rid,
                'record_title': rec['title'],
                'index_node_id': rec['index_id'],
                'locator': 'atuned/data/letgo/raw/2026_Let_Go_List.txt.gz#line=%d;unit=%d' % (n, ordinal),
                'raw': p,
                'sentence': clean(p).strip(),
                'split_check': joined_ok,
            })

# ---- PDFs -----------------------------------------------------------------
PDF = {'TULA__Lances_Let_Go_List.pdf': 'pdf_a', 'TULA__Lances_Let_Go_List_1.pdf': 'pdf_b'}
lines = json.loads(PDFLINES.read_text(encoding='utf-8'))
by_file = {}
for r in lines:
    by_file.setdefault(r['file'], []).append(r)
OPEN_ANY = re.compile(r"(?i)^(i[;']{0,2}\s?m|i am|im|i;n|i'n|letting|and letting|have letting)\b|^i'm going to go\b")
for fname, rows in by_file.items():
    src = PDF[fname]
    groups = []
    for r in rows:
        s = r['text'].strip()
        if is_head(s):
            groups.append({'head': True, 'rows': [r]})
            continue
        if groups and not groups[-1]['head'] and not OPEN_ANY.match(s) and not clean(s).startswith("I'm letting go"):
            groups[-1]['rows'].append(r)   # wrap line: the line above ran past the margin
        else:
            groups.append({'head': False, 'rows': [r]})
    recs = REC[src]
    rec_toks = [(rec, toks(rec['text'])) for rec in recs]
    order = {rec['id']: k for k, rec in enumerate(recs)}
    pointer = 0
    for g in groups:
        if g['head']:
            continue
        raw = ' '.join(x['text'].strip() for x in g['rows'])
        tk = toks(raw)
        hits = []
        for rec, rt in rec_toks:
            n = len(tk)
            if n and any(rt[k:k + n] == tk for k in range(len(rt) - n + 1)):
                hits.append(rec['id'])
        first, last = g['rows'][0], g['rows'][-1]
        span = '%d:%d' % (first['page'], first['line']) if len(g['rows']) == 1 else '%d:%d-%d:%d' % (first['page'], first['line'], last['page'], last['line'])
        chosen, how = None, 'unresolved'
        if len(hits) == 1:
            chosen, how = hits[0], 'unique'
        elif hits:
            # the same passage is printed twice in one PDF: take the copy the
            # page is reading through, the first match at or after the last one.
            ahead = [h for h in hits if pointer <= order[h] <= pointer + 3]
            if ahead:
                chosen, how = min(ahead, key=order.get), 'document_order'
        if chosen:
            pointer = order[chosen]
        rec = next((r for r in recs if r['id'] == chosen), None)
        units.append({
            'source': src,
            'source_archive': 'atuned/data/letgo/raw/%s.gz' % fname,
            'source_record_file': 'atuned/data/letgo/letgo_%s.json' % src,
            'source_record_id': chosen,
            'record_match': how,
            'source_record_candidates': hits,
            'record_title': rec['title'] if rec else None,
            'index_node_id': rec['index_id'] if rec else None,
            'locator': 'atuned/data/letgo/raw/%s.gz#page-lines=%s' % (fname, span),
            'raw': raw,
            'sentence': clean(raw).strip(),
            'split_check': True,
        })

for u in units:
    u['sentence_sha256'] = sha(u['sentence'])
    u['words'] = len(u['sentence'].split())
    u['norm'] = ' '.join(toks(u['sentence']))
    if u['index_node_id'] is not None:
        u['index_node_title'] = INDEX.get(u['index_node_id'])
OUT.write_text(json.dumps(units, ensure_ascii=False, indent=1), encoding='utf-8')
print('units', len(units), {s: sum(1 for u in units if u['source'] == s) for s in ('2026', 'pdf_a', 'pdf_b')})
print('2026 split check failures', sum(1 for u in units if not u['split_check']))
print('pdf units with no unique record', sum(1 for u in units if u['source'] != '2026' and not u['source_record_id']))
