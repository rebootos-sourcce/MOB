#!/usr/bin/env python3
"""Measure the Little Books volumes straight out of git: volumes, pairs, how many
different charge lines, their length, and which natures each names.

usage: lb_summary.py MOB_REPO OUT.json
"""
import json, subprocess, sys, collections
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent))
import natures as N
REPO, OUT = sys.argv[1], Path(sys.argv[2])
REF = 'origin/claude/little-books-review-k7az9s'
rev = subprocess.check_output(['git', '-C', REPO, 'rev-parse', REF], text=True).strip()
names = [p for p in subprocess.check_output(['git', '-C', REPO, 'ls-tree', '--name-only', rev, 'generator/volumes/'], text=True).split() if p.endswith('.json')]
vols, texts = [], []
for p in names:
    d = json.loads(subprocess.check_output(['git', '-C', REPO, 'show', '%s:%s' % (rev, p)], text=True))
    ts = [x['charge_text'] for x in d['pairs']]
    texts += ts
    vols.append({'file': p, 'volume': d['volume'], 'pairs': len(ts), 'different_charge_lines': len(set(ts)),
                 'words_min': min(len(t.split()) for t in ts), 'words_max': max(len(t.split()) for t in ts),
                 'natures_named': dict(collections.Counter(k for t in ts for k in N.found(t)))})
out = {'branch': REF.split('/', 1)[1], 'revision': rev, 'volumes': len(vols), 'pairs': len(texts), 'different_charge_lines': len(set(texts)),
       'words_min': min(len(t.split()) for t in texts), 'words_max': max(len(t.split()) for t in texts),
       'lines_naming_one_nature_only': sum(1 for t in set(texts) if len(N.found(t)) == 1),
       'lines_30_words_or_fewer': sum(1 for t in set(texts) if len(t.split()) <= 30),
       'per_volume': vols}
OUT.write_text(json.dumps(out, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(json.dumps({k: v for k, v in out.items() if k != 'per_volume'}))
print([v['volume'] for v in vols])
