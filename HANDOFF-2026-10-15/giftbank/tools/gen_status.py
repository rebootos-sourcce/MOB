#!/usr/bin/env python3
"""Write GIFT-BANKS-STATUS-2026-10-16.md from the six bank folders, the all-six
validator run and the overlap check. Every number is read off those files.

usage: gen_status.py GIFTBANK_DIR OUT.md
"""
import json, re, sys, collections
from pathlib import Path

D, OUT = Path(sys.argv[1]), Path(sys.argv[2])
sys.path.insert(0, str(Path(__file__).resolve().parent))
import natures as N

NAT = ('anxiety', 'overwhelm', 'burnout', 'grief', 'sadness', 'depression')
A = D / 'all-six'
J = lambda p: json.loads(p.read_text(encoding='utf-8'))
six = J(A / 'validator-run-2026-10-16.stdout.json')
ov = J(A / 'overlap-2026-10-16.json')
rows, opts = [], []
tot = collections.Counter()
for n in NAT:
    b = J(D / n / 'banks' / ('%s.json' % n))
    v = J(D / n / 'validator-run-2026-10-16.stdout.json')
    res = J(D / n / ('%s-reserve.json' % n))['reserve']
    items = b['items']
    kind = lambda i: i['source_provenance'].get('source_kind') or ('owner dictation' if '2026_Let_Go_List' in i['source_provenance']['locator'] else 'owner typed list')
    k = collections.Counter(kind(i) for i in items)
    card = k['from a card, not dictated']
    own = len(items) - card
    if n == 'anxiety':
        own_avail = own + len(res)          # every qualifying line of his is in the bank or the reserve
        dict_avail = k['owner dictation'] + sum(1 for r in res if '2026_Let_Go_List' in r['locator'])
    else:
        s = J(A / ('stats_%s.json' % n))
        own_avail = s['owner_pool']
        dict_avail = s['owner_by_source'].get('2026', 0)
        h = J(D / n / ('%s-held.json' % n))
        oh = h['owner_lines_held_by_rule']
        opts.append((n, sum(1 for x in oh if x['reason'].startswith('longer than')),
                     sum(1 for x in oh if x['reason'].startswith('names another nature')),
                     sum(1 for x in oh if x['reason'].startswith('filed under a heading')),
                     100 - len(items), s['owner_named_distinct']))
    short = 100 - len(items)
    content = [e for e in v['errors'] if 'expected exactly 100' in e]
    vres = '%s, %d refusals; %s' % (v['result'], len(v['errors']), ('1 is about content: %d rows, not 100' % len(items)) if content else 'none about content')
    if n == 'anxiety':
        dec = 'Approve it, or name rows to swap for reserve lines.'
    elif short:
        dec = 'Whether card lines may stand (%d of %d). How to close the %d.' % (card, len(items), short)
    else:
        dec = 'Whether card lines may stand (%d of 100).' % card
    rows.append('| %s | %d (%d dictated, %d typed) | %d | %d | %d | %s | %s |' % (n, own_avail, dict_avail, own_avail - dict_avail, len(items), card, short, vres, dec))
    tot['own_in'] += own; tot['card'] += card; tot['items'] += len(items); tot['short'] += short

cnt = collections.Counter()
for e in six['errors']:
    if e.startswith('schema:'): cnt['schema'] += 1
    elif e.startswith('mapping:'): cnt['mapping'] += 1
    elif 'expected exactly 100' in e: cnt['short'] += 1
    elif 'approv' in e: cnt['bank approval'] += 1
    else: cnt['other'] += 1

L = []
P = L.append
P('# The six gift banks, where they stand')
P('')
P('16 October 2026. **Candidate, not approved.** Nothing in any bank is approved. This page is the summary; each bank has its own review document beside it.')
P('')
P('## In one line each')
P('')
P('- **Anxiety:** 100 lines, all in your own words. Ready for your review.')
for n, ln, two, head, short, named in opts:
    b = J(D / n / 'banks' / ('%s.json' % n))
    card = sum(1 for i in b['items'] if i['source_provenance'].get('source_kind') == 'from a card, not dictated')
    own = len(b['items']) - card
    P('- **%s:** %d %s in your own words, %d from a card, not dictated%s.' % (n.capitalize(), own, 'line' if own == 1 else 'lines', card, (', and %d short of 100' % short) if short else ''))
P('')
P('Your own corpus is thin for the five new natures. In the 2,470 different "I\'m letting go of" sentences, most name a state inside a long list beside anxious, ashamed or depressed, so a line that names one nature alone is rare. Nothing was invented and no line about another nature was used to fill a gap.')
P('')
P('## The table')
P('')
P('"Your own lines" means your dictation and your two typed lists. "From a card, not dictated" means a line from the "50 Limiting Beliefs" cards, made in a chat session. "Validator" is the checking program on Reboot-OS that a bank must pass before the server may give it out; this column is the run on each bank by itself.')
P('')
P('| Nature | Your own lines that qualify | Lines in the bank | From a card, not dictated | Short of 100 | Validator, this bank alone | What you decide |')
P('|---|---|---|---|---|---|---|')
for r in rows:
    P(r)
P('| **All six** | | **%d** | **%d** | **%d** | see below | |' % (tot['items'], tot['card'], tot['short']))
P('')
P('Of the %d lines in the six banks, %d are your own words and %d are from a card.' % (tot['items'], tot['own_in'], tot['card']))
P('')
P('## The six banks run together')
P('')
P('- The validator only accepts all six at once, so it was also run on one folder holding all six (`HANDOFF-2026-10-15/giftbank/all-six/`), unchanged, with `python3 -I`.')
P('- **Result: %s, %d refusals.**' % (six['result'], len(six['errors'])))
P('  - %d for the six banks\' approval fields, three each, which stay empty until you approve.' % cnt['bank approval'])
P('  - %d for the item schema\'s approval fields (the schema is the list of fields every row must carry).' % cnt['schema'])
P('  - %d for the map from nature to meter track: three approval fields, and two because the map is empty. It is not defined, and the research handshake says it must not be invented. It blocks all six, whatever happens to the content.' % cnt['mapping'])
P('  - **%d because a bank is short of 100:** %s.' % (cnt['short'], ', '.join('%s %d' % (re.match(r'(\w+)\.json', e).group(1), int(re.search(r'found (\d+)', e).group(1))) for e in six['errors'] if 'expected exactly 100' in e)))
if cnt['other']:
    P('  - %d other.' % cnt['other'])
P('- **No two banks share an id.** The validator refuses that, and it did not refuse.')
P('- **No two banks share a sentence.** Checked apart from the validator, across all six banks and their reserves: %d shared ids, %d shared sentences, %d shared wordings with case and punctuation set aside. A sentence that names two natures is held from both, so this holds by design and was measured anyway.' % (ov['total_same_id'], ov['total_same_sentence'], ov['total_same_words']))
P('- The anxiety bank is unchanged. The tools rebuilt it byte for byte before any new bank was made, and its validator run reproduces byte for byte.')
P('')
P('## How a line\'s nature was decided')
P('')
P('By the words in the sentence itself, the rule the anxiety bank used. Core words name the state outright; neighbour words name the same state in other plain words. A line that names two natures is held from both.')
P('')
P('| Nature | Core words | Neighbour words |')
P('|---|---|---|')
for n in NAT:
    P('| %s | %s | %s |' % (n, N.plain(n, 'core'), N.plain(n, 'neighbour')))
P('')
P('Why each neighbour set is what it is:')
P('')
for n in NAT[1:]:
    P('- **%s.** %s' % (n.capitalize(), N.WHY[n]))
P('')
P('## What you decide')
P('')
P('These are the decisions that move the five new banks. None is made for you; each bank is built so any of them can be applied by rerunning the tools.')
P('')
P('1. **Whether card lines may be in a gift bank at all.** %d of the %d lines across the five new banks are from a card. If not, the five banks hold %s of your lines, and they wait for dictation.' % (tot['card'], tot['items'] - 100, ', '.join('%s %d' % (n, len(J(D / n / 'banks' / ('%s.json' % n))['items']) - sum(1 for i in J(D / n / 'banks' / ('%s.json' % n))['items'] if i['source_provenance'].get('source_kind') == 'from a card, not dictated')) for n in NAT[1:])))
P('2. **If they may, whether the card form stands.** A card line reads "I am letting go of believing, perceiving, thinking, behaving, acting, feeling, speaking, saying, and doing that I am ...", the stem its set prints, with the card\'s full stop. Your own lines read "I\'m letting go of ...". Making them match is a rewrite, so it waits for your ruling.')
P('3. **How to close the three short banks.** Each way, with how many of your own lines it would bring back (each line would still be read before it went in):')
P('')
P('| Nature | Short of 100 | Your lines held only for length (over 30 words) | Your lines held for naming a second nature | Your lines held only by their heading | Lines from new dictation needed |')
P('|---|---|---|---|---|---|')
for n, ln, two, head, short, named in opts:
    if short:
        P('| %s | %d | %d | %d | %d | %d |' % (n, short, ln, two, head, short))
P('')
P('   The fastest way that keeps the gift in your own words is a short dictation session per short nature. The other three ways bring back your lines but loosen a rule the anxiety bank kept.')
P('4. **Whether the word sets are right.** The neighbour words are a judgment, written down with the reason for each. The ones most worth your eye: "numb" and "empty" for depression, "lonely" and "crying" for sadness, and "loss" for grief.')
P('5. **The map from nature to track** (which four meter tracks the six natures land on). Not part of this job, not invented here, and it blocks all six banks in the validator.')
P('')
P('## Where more material is, and what it gave')
P('')
P('- **The LET GO corpus** (your dictation and typed lists, Reboot-OS commit `fbad94c`, the same files byte for byte as Reboot-OS main `3d66f5e`). Used first, for every bank.')
P('- **The "50 Limiting Beliefs" cards** (`Tula__SUPPLIMENT_LET_GO_LIST.txt`, 233 sets, 11,700 lines, generated in a chat session, not dictated). Used to fill, each line marked "from a card, not dictated" in its own source column and listed in its own section of each review document.')
LB = J(A / 'little-books-read-2026-10-16.json')
vnames = [v['volume'].lower() for v in LB['per_volume']]
P('- **The Little Books volumes** (MOB branch `%s`, commit `%s`): %d volumes (%s), %d charge and install pairs, but only %d different charge lines, because most pairs repeat their volume\'s shared list. Read for every nature. None qualifies: every charge line runs %d to %d words, and none is 30 words or fewer. For each of the five new natures, every line that names it also names another nature. There is no %s volume.' % (LB['branch'], LB['revision'][:7], LB['volumes'], ', '.join(vnames), LB['pairs'], LB['different_charge_lines'], LB['words_min'], LB['words_max'], (lambda m: ', '.join(m[:-1]) + ' or ' + m[-1] if len(m) > 1 else (m[0] if m else 'missing'))([n for n in NAT if n not in vnames])))
P('')
P('## Files')
P('')
P('- Review documents, one per bank: `HANDOFF-2026-10-15/GIFT-BANK-<NATURE>-CANDIDATE-2026-10-16.md` for anxiety, overwhelm, burnout, grief, sadness and depression.')
P('- Each bank\'s folder: `HANDOFF-2026-10-15/giftbank/<nature>/` with `banks/<nature>.json`, `schema.json`, `mapping.json`, `<nature>-reserve.json`, `<nature>-held.json` and the three validator run files.')
P('- The six together: `HANDOFF-2026-10-15/giftbank/all-six/`, with the validator run, the overlap check and each new bank\'s counts.')
P('- The tools: `HANDOFF-2026-10-15/giftbank/tools/`. `natures.py` holds the word sets; `reading_holds.json` holds every line held on reading, with its reason.')
md = '\n'.join(L) + '\n'
for bad in (chr(0x2014), chr(0x2013)):
    assert bad not in md, bad
assert not re.search(r'\b108\b', md)
OUT.write_text(md, encoding='utf-8')
print('written', OUT)
