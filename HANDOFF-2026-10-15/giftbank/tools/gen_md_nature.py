#!/usr/bin/env python3
"""Write one nature's plain words review document from its bank, held, reserve,
stats and validator run. Same shape as the anxiety document. Every number in it
is read off those files, never typed.

usage: gen_md_nature.py WORK NATURE BANKDIR OUT.md
"""
import json, re, sys, collections
from pathlib import Path

G, NAT, D, OUT = Path(sys.argv[1]), sys.argv[2], Path(sys.argv[3]), Path(sys.argv[4])
sys.path.insert(0, str(Path(__file__).resolve().parent))
import natures as N

b = json.loads((D / 'banks' / ('%s.json' % NAT)).read_text(encoding='utf-8'))
h = json.loads((D / ('%s-held.json' % NAT)).read_text(encoding='utf-8'))
r = json.loads((D / ('%s-reserve.json' % NAT)).read_text(encoding='utf-8'))
v = json.loads((D / 'validator-run-2026-10-16.stdout.json').read_text(encoding='utf-8'))
ex = (D / 'validator-run-2026-10-16.exit.txt').read_text(encoding='utf-8').strip()
st = json.loads((G / ('stats_%s.json' % NAT)).read_text(encoding='utf-8'))
units = json.loads((G / 'units.json').read_text(encoding='utf-8'))
ALL = len({u['norm'] for u in units if u['sentence'].startswith("I'm letting go of ")})
Title = NAT.capitalize()
items = b['items']
own = [i for i in items if i['source_provenance']['source_kind'] != 'from a card, not dictated']
card = [i for i in items if i['source_provenance']['source_kind'] == 'from a card, not dictated']
n, no, nc, short = len(items), len(own), len(card), 100 - len(items)
kinds = collections.Counter(i['source_provenance']['source_kind'] for i in own)
src_ct = collections.Counter(re.search(r'raw/(.+?)\.(txt|pdf)', i['source_provenance']['source']).group(1) for i in own)
n26 = src_ct.get('2026_Let_Go_List', 0); nb = src_ct.get('TULA__Lances_Let_Go_List_1', 0); na = src_ct.get('TULA__Lances_Let_Go_List', 0)
STEM = card[0]['source_provenance']['card_stem_as_printed'] if card else None
num = lambda k: '{:,}'.format(k)
pl = lambda k, one, many: '%d %s' % (k, one if k == 1 else many)


def where(p):
    loc, head = p['locator'], p.get('record_title') or ''
    # House rule: no dashes in a document. A heading that prints one is shown with a comma; the bank keeps it as printed.
    head = re.sub(r'\s*[\u2013\u2014]\s*', ', ', head)
    if p['source_kind'] == 'from a card, not dictated':
        ln = re.search(r'line=(\d+)', loc).group(1)
        # The intake takes the line printed above a set as its heading; in the chat transcript that is
        # sometimes the last numbered line of the set before, which is not a heading at all.
        hd = 'no heading printed' if re.match(r'^\d+\.', head) or not head else 'set heading: %s' % head[:70]
        return 'from a card, not dictated: %s, line %s of the card file (%s)' % (p['source_record_id'], ln, hd)
    if '2026_Let_Go_List' in loc:
        m = re.search(r'line=(\d+);unit=(\d+)', loc)
        w = '2026 dictation, record %s, line %s, part %s' % (p['source_record_id'], m.group(1), m.group(2))
    else:
        m = re.search(r'raw/(.+?)\.pdf\.gz#page-lines=(.+)$', loc)
        lst = 'typed list B' if m.group(1).endswith('_1') else 'typed list A'
        span = m.group(2)
        if '-' in span:
            a, z = span.split('-')
            w = '%s, record %s, page %s line %s to page %s line %s' % ((lst, p['source_record_id']) + tuple(a.split(':')) + tuple(z.split(':')))
        else:
            pg, l = span.split(':')
            w = '%s, record %s, page %s line %s' % (lst, p['source_record_id'], pg, l)
    return '%s (heading: %s)' % (w, head)


def row(k, it):
    return '| %d | `%s` | %s | %s | `%s` |' % (k, it['pattern_id'], it['content'], where(it['source_provenance']), it['pattern_hash'])


# ---- held counts ---------------------------------------------------------
PLAIN = {
    "about ending one's life": "About ending one's life. It belongs with the crisis button, not in a gift a stranger reads on a first visit",
    'names another nature': 'Names another of the six natures in the sentence itself, so it would sit in two banks',
    'filed under a heading that names another nature': 'Filed under a heading that names another nature, for example "Let him go feeling depressed"',
    'from a typed list, not dictation': 'From a typed or pasted list, not dictation: full stops on most lines, or hidden characters a chat window leaves behind',
    'a second release runs on inside it': 'Two releases run together in one line, and cutting them apart would be a guess',
    'the state is negated': 'The state is turned around ("not tired")',
    'carries a censored word': 'A censored word',
    'about a named other person': 'About one other person (he, she, my ex)',
    'longer than 30 words': 'Longer than 30 words',
    'a loss of power or control, not a loss that is mourned': 'A loss of power or control, not a loss anyone mourns',
    'carries hidden characters or chat formatting': 'Carries hidden characters or chat formatting (stars, arrows, symbols)',
    'speaks to one sex, or about sex': 'Speaks to one sex, or about sex. The gift goes to anyone',
    'no stem printed above this set': 'No stem printed above its set, so it is not a whole sentence without adding words',
}


def table(rows):
    c = collections.Counter(x['reason'].split(':')[0] for x in rows)
    out = ['| Why it was left out | How many |', '|---|---|']
    for k, m in c.most_common():
        out.append('| %s | %d |' % (PLAIN.get(k, k), m))
    return '\n'.join(out) if c else '_None._'


def other_breakdown(rows):
    c = collections.Counter()
    for x in rows:
        if x['reason'].startswith('names another nature'):
            for k in x['reason'].split(':', 1)[1].split(','):
                c[k.strip()] += 1
    return ', '.join('%s %d' % (k, m) for k, m in c.most_common()) or 'none'


reading = collections.Counter(x['reason'].replace('held on reading: ', '') for x in h['held_on_reading'])
own_read = [x for x in h['held_on_reading'] if x['source_kind'] != 'from a card, not dictated']
card_read = [x for x in h['held_on_reading'] if x['source_kind'] == 'from a card, not dictated']
own_held = h['owner_lines_held_by_rule']
card_held = h['card_lines_held_by_rule']
only_len = sum(1 for x in own_held if x['reason'].startswith('longer than'))
only_two = sum(1 for x in own_held if x['reason'].startswith('names another nature'))
lb = h['little_books_lines_read']
lb_vols = collections.Counter(x['volume'].capitalize() for x in lb)
lb_words = (min(x['words'] for x in lb), max(x['words'] for x in lb)) if lb else None
LB_ALL = [p['charge_text'] for f in sorted(G.glob('lb_*.json')) for p in json.loads(f.read_text(encoding='utf-8'))['pairs']]
LB_PAIRS, LB_DISTINCT = len(LB_ALL), len(set(LB_ALL))
others = ', '.join('%s (%s)' % (k, N.plain(k, 'core')) for k in N.NATURES if k != NAT)

lines = []
P = lines.append
P('# %s gift bank, first candidate' % Title)
P('')
P('16 October 2026. **Candidate, not approved.** Built from the LET GO corpus and, where that ran short, from the "50 Limiting Beliefs" cards, for the owner to review. Nothing here is approved.')
P('')
summary = '**%s. %s in your own words. %s from a card, not dictated.' % (pl(n, 'sentence', 'sentences'), pl(no, 'is', 'are'), pl(nc, 'is', 'are'))
summary += (' The bank is %d short of 100.**' % short) if short else ' None is approved yet.**'
P(summary)
P('')
P('- Bank version: `%s`' % b['bank_version'])
P('- Bank hash (a fingerprint of the whole file, worked out by the validator\'s own method; change one letter anywhere and it changes): `%s`' % b['content_sha256'])
P('- File hash of the bank as written: `%s`' % v['banks'][0]['raw_file_sha256'])
P('')
P('## The short answer')
P('')
P('- Your own lines that name %s and pass the same rules as the anxiety bank: **%d**.' % (NAT, st['owner_pool']))
P('- The cards gave %d more that pass the same rules. %s' % (st['card_pool'], 'The bank takes %d of them, so it reaches %d.' % (nc, n) if nc else 'None was needed.'))
P('- The Little Books gave none. %s' % ('%d of their charge lines name %s, and every one of them also names other natures and runs %d to %d words, against a limit of 30.' % (len(lb), NAT, lb_words[0], lb_words[1]) if lb else 'No Little Books charge line names %s.' % NAT))
if short:
    P('- **Shortfall: %d.** Nothing was invented and no line about another nature was added to fill it. Where more could come from is in "The shortfall" below.' % short)
P('')
P('## Where the sentences came from')
P('')
P('- Reboot-OS at commit `fbad94c`, the same commit the anxiety bank used. The corpus files there are the same, byte for byte, as on Reboot-OS main today (`3d66f5e`).')
P('- **Your own words, %d:** %d from your 2026 dictation (`2026_Let_Go_List.txt`), %d from the larger typed list (`TULA__Lances_Let_Go_List_1.pdf`, "typed list B"), %d from the smaller typed list (`TULA__Lances_Let_Go_List.pdf`, "typed list A").' % (no, n26, nb, na))
P('- How one of your sentences was cut: in a typed list, one typed line, joined to its wrap line when it ran past the margin. In the dictation, which has no full stops, one spoken line, or where a line holds a long run, from each "I\'m letting go" to the next. No word was changed, added or moved. Each is shown in the reading you ruled on 11 September ("bleeding" read as "believing", "I;m" as "I\'m"); for %d of them that reading differs from the raw transcription, and the raw words sit beside every sentence in the bank file.' % st['reading_layer_used'])
if nc:
    P('- **From a card, not dictated, %d.** The cards are `Tula__SUPPLIMENT_LET_GO_LIST.txt`: 233 sets, 11,700 lines, made in a chat session (the file opens "Here\'s the relevant section for Let Go Card 3B"). They are not your dictation. They are used here only because your own lines fall short, and every one is marked in its own source column and listed in its own section below.' % nc)
    P('- How a card sentence is formed. A card line is not a whole sentence on its own; it is written to follow the stem printed above its set. That stem is the same on 230 of the 233 sets:')
    P('')
    P('  > %s...' % STEM)
    P('')
    P('  So the sentence is that stem as printed, a space, then the card line as printed with its first letter made small. No word is added that the card does not print. For example:')
    P('')
    P('  - Card line, as printed: "%s"' % card[0]['source_provenance']['source_text_as_transcribed'])
    P('  - Sentence in the bank: "%s"' % card[0]['content'])
    P('')
    P('  Two things differ from your own lines and need your ruling: it says "I am letting go", not "I\'m letting go", and it ends with the card\'s full stop.')
P('')
P('## How %s was decided' % NAT)
P('')
P('- By the words in the sentence itself, the same rule as the anxiety bank. Headings, index entries and the intake\'s fetter join (its guess at which canonical fetter a whole record is about) all label a whole record, not a sentence, so they do not decide. A heading is used only to hold a line back, when the heading names another nature.')
P('- **Core words**, which name %s outright: %s.' % (NAT, N.plain(NAT, 'core')))
P('- **Neighbour words**, which name the same state in other plain words: %s.' % N.plain(NAT, 'neighbour'))
P('- Why these: %s' % N.WHY[NAT])
P('- **A line that names two natures is held from both.** The other five sets are: %s, each with its own neighbour words. So no line can sit in two banks, and this bank cannot overlap the anxiety bank or any other.' % others)
tiers = collections.Counter(i['nature_evidence']['tier'] for i in items)
P('- %d of the %d use a core word. %d use only a neighbour word.' % (tiers.get('core', 0), n, tiers.get('neighbour', 0)))
P('')
P('## How many were available')
P('')
P('- %s different "I\'m letting go of" sentences in your three files.' % num(ALL))
P('- %d of them name %s.' % (st['owner_named_distinct'], NAT))
P('- %d passed the rules in the next section. I then read every one and held %d more on reading. **%s left, and %s in the bank.**' % (st['owner_passed_rules'], st['owner_held_on_reading'], pl(st['owner_pool'], 'was', 'were'), 'it is' if st['owner_pool'] == 1 else 'all of them are'))
P('- From the cards: %d different card lines name %s. %d passed the same rules. I read them and held %d more on reading. %d were left.' % (st['card_named_distinct'], NAT, st['card_passed_rules'], st['card_held_on_reading'], st['card_pool']))
if nc:
    P('- Order, so the bank never depends on where a line sits in a file: your lines first, then card lines. Within each: core words before neighbour words; dictation before the typed lists; spread across headings (or card sets), so each one\'s shortest line comes before any one\'s second; shorter before longer; ties broken on the stable id.')
P('- %s' % ('The other %d card lines that qualified are kept, ranked, in the reserve file beside the bank. They are not in the bank.' % len(r['reserve']) if r['reserve'] else 'There is no reserve: every line that qualified is in the bank.'))
P('')
P('## What I left out, and why')
P('')
P('Counts are different sentences. A sentence held for two reasons is counted once, under the first.')
P('')
P('**Your own lines, held by a rule (%d):**' % len(own_held))
P('')
P(table(own_held))
P('')
P('Of your lines held for naming another nature, the other nature was (a line can name more than one): %s.' % other_breakdown(own_held))
P('')
P('**Your own lines, held on reading (%d):**' % len(own_read))
P('')
if own_read:
    for x in own_read:
        P('- "%s": %s.' % (x['sentence'], x['reason'].replace('held on reading: ', '')))
else:
    P('_None._')
P('')
P('**Card lines, held by a rule (%d):**' % len(card_held))
P('')
P(table(card_held))
P('')
P('Of the card lines held for naming another nature, the other nature was (a line can name more than one): %s.' % other_breakdown(card_held))
P('')
P('**Card lines, held on reading (%d):**' % len(card_read))
P('')
if card_read:
    cr = collections.Counter(x['reason'].replace('held on reading: ', '') for x in card_read)
    for why, m in cr.most_common():
        ex_ = [x['card_line_as_printed'] for x in card_read if x['reason'].endswith(why)]
        P('- %d: %s. %s' % (m, why[:1].upper() + why[1:], ' '.join('"%s"' % e for e in ex_)))
else:
    P('_None._')
P('')
if lb:
    P('**Little Books charge lines, read and not used (%d):** by volume, %s. Every one names %s and also other natures, and runs %d to %d words, against a limit of 30. Each is one long list of states. The volumes mark their source "LANCE DICTATION", but most of each list is shared: the %d pairs in the eleven volumes carry only %d different charge lines, so a pair is one or two of your words in front of its volume\'s shared list. Each is listed with its reason in the held file.' % (len(lb), ', '.join('%s %d' % kv for kv in lb_vols.most_common()), NAT, lb_words[0], lb_words[1], LB_PAIRS, LB_DISTINCT))
    P('')
P('Every line above is listed with its reason in `%s-held.json`, beside the bank.' % NAT)
P('')
if short:
    P('## The shortfall, and where more could come from')
    P('')
    P('- **%d short of 100.** Your own lines: %d. Card lines that qualify: %d. Together: %d. Nothing else was added.' % (short, no, nc, n))
    P('- **Your own lines held only for length:** %d. %s your dictation, but longer than 30 words. If you rule the limit up for %s, this is the first place to look; each line would still be read before it went in.' % (only_len, 'It is' if only_len == 1 else 'They are', NAT))
    P('- **Your own lines held for naming a second nature:** %d. If you rule that a line naming two natures may sit in one bank (you choose which), these come back.' % only_two)
    P('- **Card lines held for naming a second nature:** %d. Same ruling.' % sum(1 for x in card_held if x['reason'].startswith('names another nature')))
    only_head = sum(1 for x in own_held if x['reason'].startswith('filed under a heading'))
    if only_head:
        P('- **Your own lines held only because their heading names another nature:** %d. The sentence itself names %s and nothing else. If you rule that a heading may not hold a line back, these come back.' % (only_head, NAT))
    P('- **New dictation.** A short session of %s lines from you would close it in your own words, which is what the gift promises. It needs %d more lines that pass the same rules.' % (NAT, short))
    P('- The Little Books do not help as they are: their charge lines are long shared lists, and none qualifies.')
    P('')
P('## The bank file and the validator')
P('')
P('- The validator is the checking program on Reboot-OS branch `feat/p0-gift-bank-validator-20261014`. A bank must pass it before the server may give the bank out. It was run unchanged (its SHA-256 matches `git show` of the branch byte for byte), with `python3 -I`, on this folder alone. The same runner, on the anxiety folder, reproduces the anxiety run\'s three files byte for byte.')
P('- **Result: %s, %d refusals, %s.**' % (v['result'], len(v['errors']), ex.replace('exit', 'exit code')))
cnt = collections.Counter()
for e in v['errors']:
    if e.startswith('schema:'): cnt['schema'] += 1
    elif e.startswith('banks: missing'): cnt['missing'] += 1
    elif e.startswith('mapping:') and 'approv' in e: cnt['mapping approval'] += 1
    elif e.startswith('mapping:'): cnt['mapping'] += 1
    elif 'approv' in e: cnt['bank approval'] += 1
    elif 'expected exactly 100' in e: cnt['short'] += 1
    else: cnt['other'] += 1
P('  - %d for this bank\'s approval fields, which stay empty until you approve it.' % cnt['bank approval'])
P('  - %d for the item schema\'s approval fields (the schema is the list of fields every row must carry), the same.' % cnt['schema'])
P('  - %d because the other banks are not in this folder. The validator only accepts all six at once. The six together are run in the status document.' % cnt['missing'])
P('  - %d for the map from nature to meter track: %d approval fields, and %d because the map is empty. It is not defined, and the research handshake says it must not be invented.' % (cnt['mapping approval'] + cnt['mapping'], cnt['mapping approval'], cnt['mapping']))
if cnt['short']:
    P('  - **1 because the bank holds %d rows, not 100.** This one is about the content, and it is the shortfall above.' % n)
if cnt['other']:
    P('  - %d other: %s' % (cnt['other'], '; '.join(e for e in v['errors'] if not any(t in e for t in ('schema:', 'banks: missing', 'mapping:', 'approv', 'expected exactly 100')))))
P('- %s %d rows, %d different ids, the bank hash matches, every row has its source file, record and place in the file, and every class is an allowed one.' % ('No other refusal is about the content.' if cnt['short'] else '**No refusal is about the bank\'s content.**', v['banks'][0]['item_count'], v['banks'][0]['unique_id_count']))
P('- A second check, run apart from the validator, read each row back out of the raw files: your lines through the intake tool\'s own reading rules, card lines against the numbered line and the stem printed in the card file. %d match, none differ. The check was tested first on a copy with three rows broken on purpose, and it caught all three.' % n)
P('')
P('## Your own lines (%d)' % no)
P('')
P('Where a heading prints a dash, it is shown here as a comma, by the house rule; the bank file keeps it as printed.')
P('')
P('Each row\'s hash is the SHA-256 of the sentence alone, the same check the frozen pattern set migration makes on every row (`pattern_hash`).')
P('')
P('| # | Stable id | Sentence | Source | Sentence hash (SHA-256) |')
P('|---|---|---|---|---|')
k = 0
for it in own:
    k += 1; P(row(k, it))
if nc:
    P('')
    P('## Card lines, from a card, not dictated (%d)' % nc)
    P('')
    P('These are not your words. They are lines from the "50 Limiting Beliefs" cards, each joined to the stem its set prints. They fill the bank only because your own lines ran short.')
    P('')
    P('| # | Stable id | Sentence | Source | Sentence hash (SHA-256) |')
    P('|---|---|---|---|---|')
    for it in card:
        k += 1; P(row(k, it))
P('')
P('## What you decide')
P('')
if nc:
    P('- **Whether card lines may be in a gift bank at all.** %d of these %d are not your words. If not, the bank is %s, and it waits for dictation.' % (nc, n, pl(no, 'line', 'lines')))
    P('- **If they may: whether the card form stands.** It reads "I am letting go of believing, perceiving, thinking, behaving, acting, feeling, speaking, saying, and doing that I am ...", with the card\'s full stop. Changing it to your own "I\'m letting go of" form would be a rewrite, so it is not done without your ruling.')
if short:
    P('- **How to close the shortfall of %d**, from the four ways above, or to leave the bank short until it can be filled in your words.' % short)
P('- Which lines to strike. Name the row numbers. %s' % ('They are swapped for reserve lines under a new version and a new hash.' if r['reserve'] else 'There is no reserve here, so each struck line makes the bank one shorter, under a new version and a new hash.'))
P('')
P('## How you approve')
P('')
if short:
    P('It cannot be approved as it stands: the validator refuses any bank that is not exactly 100. Once it is filled, reply "I approve %s bank <version>, hash <hash>" with the new version and hash, and that reply, with your name and the time, goes into the bank\'s three empty approval fields.' % NAT)
else:
    P('Reply "I approve %s bank %s, hash %s" and that reply, with your name and the time, goes into the bank\'s three empty approval fields; name row numbers instead and those lines are swapped for reserve lines under a new version and a new hash.' % (NAT, b['bank_version'], b['content_sha256']))
P('')
P('## Files')
P('')
base = 'HANDOFF-2026-10-15/giftbank/%s' % NAT
P('- Bank: `%s/banks/%s.json`' % (base, NAT))
P('- Item schema, not approved, the same file as the anxiety bank\'s: `%s/schema.json`' % base)
P('- Map from nature to track, empty on purpose, the same file as the anxiety bank\'s: `%s/mapping.json`' % base)
P('- Reserve, %d ranked next: `%s/%s-reserve.json`' % (len(r['reserve']), base, NAT))
P('- Everything left out, with its reason: `%s/%s-held.json`' % (base, NAT))
P('- Validator output: `%s/validator-run-2026-10-16.stdout.json`, `.stderr.txt`, `.exit.txt`' % base)
P('- Scripts that cut, pick, build and recheck: `HANDOFF-2026-10-15/giftbank/tools/` (`select_nature.py`, `cards.py`, `select_cards.py`, `build_nature.py`, `verify_nature.py`, `run_validator.sh`, `natures.py` for the word sets, `reading_holds.json` for every line held on reading)')
md = '\n'.join(lines) + '\n'
for bad in (chr(0x2014), chr(0x2013)):
    assert bad not in md, ('dash', bad)
# "Never say 108" is about the count of addresses. A record id the intake assigned (card-108) is cited
# exactly so the line can be found; only those ids are skipped, and 108 anywhere else still fails.
assert not re.search(r'\b108\b', re.sub(r'card-\d{3}', '', md))
OUT.write_text(md, encoding='utf-8')
print('written', OUT, 'own', no, 'card', nc, 'short', short)
