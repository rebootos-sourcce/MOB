import json, re, sys
G = sys.argv[1]
OUT = sys.argv[2]
b = json.load(open(G + '/repo/atuned/data/gift_banks/banks/anxiety.json', encoding='utf-8'))
v = json.load(open(G + '/repo/atuned/data/gift_banks/validator-run-2026-10-16.stdout.json', encoding='utf-8'))
H = b['content_sha256']
RAWF = v['banks'][0]['raw_file_sha256']
S = '/tmp/claude-0/-home-user-MOB/e909b21c-7092-5fcd-af76-1092a869307f/scratchpad/giftbank'


def src(p):
    loc = p['locator']
    head = p.get('record_title') or ''
    if '2026_Let_Go_List' in loc:
        m = re.search(r'line=(\d+);unit=(\d+)', loc)
        where = '2026 dictation, record %s, line %s, part %s' % (p['source_record_id'], m.group(1), m.group(2))
    else:
        m = re.search(r'page-lines=(.+)$', loc)
        span = m.group(1)
        if '-' in span:
            a, z = span.split('-')
            where = 'typed list B, record %s, page %s line %s to page %s line %s' % ((p['source_record_id'],) + tuple(a.split(':')) + tuple(z.split(':')))
        else:
            pg, ln = span.split(':')
            where = 'typed list B, record %s, page %s line %s' % (p['source_record_id'], pg, ln)
    return '%s (heading: %s)' % (where, head)


rows = []
for n, it in enumerate(b['items'], 1):
    rows.append('| %d | `%s` | %s | %s | `%s` |' % (n, it['pattern_id'], it['content'], src(it['source_provenance']), it['pattern_hash']))

md = f"""# Anxiety gift bank, first candidate

16 October 2026. Built from the LET GO corpus for the owner to review. Not approved. Nothing committed or pushed.

**100 sentences, all in your own words from the LET GO corpus. None is approved yet.**

- Bank version: `{b['bank_version']}`
- Bank hash, worked out by the validator's own method over the whole file: `{H}`
- File hash of the bank as written: `{RAWF}`

## Where the sentences came from

- Reboot-OS at commit `fbad94c` (branch `claude/null-origin`). The corpus files there are the same, byte for byte, as on main.
- 80 come from your 2026 dictation (`atuned/data/letgo/raw/2026_Let_Go_List.txt.gz`, records in `letgo_2026.json`).
- 20 come from the larger typed list (`TULA__Lances_Let_Go_List_1.pdf`, records in `letgo_pdf_b.json`). It is called "typed list B" in the table.
- None comes from the smaller typed list. Every line of it that qualified is also in one of the other two, and the copy kept is the dictation's.
- How a sentence was cut. In a typed list: one typed line, joined to its wrap line when the line ran past the margin. In the dictation, which has no full stops: one spoken line, and where a line holds a long run, from each "I'm letting go" to the next one. No word was changed, added or moved.
- How it is spelled. Each sentence is shown in the reading you ruled on 11 September, where "bleeding" is read as "believing" and "I;m" as "I'm". For 25 of the 100 that reading differs from the raw transcription. The raw words sit beside every sentence in the bank file, so both can be checked.

## How anxiety was decided

- By the words in the sentence itself. Nothing in the corpus sorts sentences by nature: headings, index nodes and the intake's fetter join (its guess at which canonical fetter a whole record is about) all label a whole record, not a sentence. Only 1 of these 100 comes from a record the intake joined to the Anxiety fetter.
- Two groups of words count. Core: anxious, anxiety, worry, worried, worrying, nervous, panic, panicking, dread. Fear: afraid, scared, fear, fearing, terrified, frightened, and their close forms.
- 39 of the 100 use a core word. 61 use only a fear word.

## How many were available

- 2,470 different "I'm letting go of" sentences in the three files.
- 403 of them name anxiety or fear.
- 205 passed the rules in the next section. I then read all 205 and held 23 more. 182 were left.
- The 100 here are the top of those 182, in this order: core words before fear words; dictation before the typed list; spread across headings, so each heading's shortest sentence comes before any heading's second; shorter before longer. Ties break on the stable id, so the order never depends on where a line sits in a file.
- The other 82 are kept, ranked, in a reserve file beside the bank. They are not in the bank.

## What I left out, and why

Counts are different sentences. A sentence held for two reasons is counted once, under the first.

| Why it was left out | How many |
|---|---|
| From a typed or pasted list, not dictation: full stops on most lines, or hidden characters a chat window leaves behind | 73 |
| Two releases run together in one line, and cutting them apart would be a guess | 43 |
| Filed under a heading that names another nature, for example "Let him go feeling depressed" | 28 |
| Names another of the six natures in the sentence itself: overwhelmed, exhausted, tired, depressed, grief, sad | 22 |
| Longer than 30 words | 22 |
| About one other person (he, she, my ex) | 5 |
| The state is turned around ("not afraid") | 3 |
| A censored word | 2 |
| Held on reading: the transcription changed the meaning, for example "and secure" for "insecure", "a mobile" for "immobile", "the line" for "a lie", or the line stops mid word | 20 |
| Held on reading: speaks to men only ("to be a man") | 3 |

Every one of the 221 is listed with its reason in `anxiety-held.json`, beside the bank.

Overlap with the other five banks is not measured yet, because they do not exist. Leaving out sentences that name another nature keeps this bank apart from them by design. The overlap gets measured when the next bank is built.

## The bank file and the validator

- The bank is written in the validator's format: the nine bank fields it requires, and per row a stable id, the sentence, a release or reframe class, and its source.
- The validator names no folder for banks. The file sits where the validator's own test puts one, relative to a repository root: `atuned/data/gift_banks/banks/anxiety.json`, with `schema.json` and `mapping.json` beside the `banks` folder.
- The validator run is the branch's file, unchanged (its SHA-256 matches `git show` of the branch byte for byte), run with `python3 -I`.
- **Result: rejected, 16 refusals, exit code 1.** None of the 16 can be fixed honestly by changing the bank:
  - 3 for this bank's approval fields, which stay empty until you approve it.
  - 3 for the item schema's approval fields, the same.
  - 5 because the other five banks do not exist yet. The validator only accepts all six at once.
  - 5 for the map from nature to meter track. It is not defined, and the research handshake says it must not be invented.
- **No refusal is about the bank's content.** 100 rows, 100 different ids, the bank hash matches, every row has its source file, record and place in the file, and every class is an allowed one.
- A second check, run apart from the validator, read each of the 100 back out of the raw files using the intake tool's own reading rules: 100 match, none differ.

## The supplementary material, a separate option, not used

The corpus held 182 sentences that qualify, so there is no gap to fill. If you want to swap lines in anyway:

- **The "50 Limiting Beliefs" cards.** 11,700 lines in 233 sets. 746 different lines use a core anxiety word, for example "Worried that I have permanently damaged my future." They were made in a chat session, not dictated, and they are not in the "I'm letting go of" form. Using one means adding words in front of it, which is a rewrite and needs your ruling first.
- **The Little Books anxiety volume** (MOB branch `claude/little-books-review-k7az9s`). Nine charge lines sourced from you, each one long list of states in a single sentence. The one on the volume's page also names "overwhelmed", so it crosses into the overwhelm bank. Nine at most.

## The 100

Each row's hash is the SHA-256 of the sentence alone. That is the same check the frozen pattern set migration makes on every row (`pattern_hash`). The validator hashes the whole bank, which is the bank hash at the top.

| # | Stable id | Sentence | Source | Sentence hash (SHA-256) |
|---|---|---|---|---|
""" + '\n'.join(rows) + f"""

## How you approve

Reply "I approve anxiety bank {b['bank_version']}, hash {H}" and that reply, with your name and the time, goes into the bank's three empty approval fields; name line numbers instead and those lines are swapped for reserve lines under a new version and a new hash.

## Files

- Bank: `{S}/repo/atuned/data/gift_banks/banks/anxiety.json`
- Item schema, not approved: `{S}/repo/atuned/data/gift_banks/schema.json`
- Map from nature to track, empty on purpose: `{S}/repo/atuned/data/gift_banks/mapping.json`
- Reserve, the 82 ranked next: `{S}/repo/atuned/data/gift_banks/anxiety-reserve.json`
- Everything left out, with its reason: `{S}/repo/atuned/data/gift_banks/anxiety-held.json`
- Validator output: `{S}/repo/atuned/data/gift_banks/validator-run-2026-10-16.stdout.json`, `.stderr.txt`, `.exit.txt`
- Scripts that cut, pick, build and recheck: `{S}/tools/`
"""
for bad in (chr(0x2014), chr(0x2013)):
    assert bad not in md, bad
assert not re.search(r'\b108\b', md)
open(OUT, 'w', encoding='utf-8').write(md)
print('written', len(rows))
