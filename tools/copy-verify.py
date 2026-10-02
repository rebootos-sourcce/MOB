#!/usr/bin/env python3
"""copy verify. The voice rules, run over every string the page shows.

    node tools/copy-walk.js                     # writes COPY-VERIFY-strings.json
    python3 tools/copy-verify.py COPY-VERIFY-strings.json
    python3 tools/copy-verify.py A.json --against B.json     # before and after

WHY THIS EXISTS. check.py reads the source. The owner reads the screen, and the
two disagree wherever a string is built at run time, held in a table, or put on
the screen by a stylesheet. So the rules in check.py and objections.json are
imported here and run over what was harvested from the live page, and three
more are added that a source sweep cannot carry because they depend on WHO IS
LOOKING: whether the profile is unread.

THE RULES ARE NOT RETYPED. Every gate in check.py's scan() and every rule in
objections.json is called, not copied. The three below are new, and they are
named for what the owner said:

    percent       "I keep seeing this percent shit, the hardest carrying zero
                  percent. I don't want that."
                  A percent sign, or "per cent", on a surface whose profile is
                  unread, is stop. A percent printed off zero is stop anywhere.
                  Any other percent is flagged: it needs the denominator named.
    bare-number   a number standing alone on a surface that is unread
    total         a count against a total. "6.0 of 10", "out of ten", "against a
                  clean ten", "of the hundred points". The existing rule in
                  objections.json lets 1, 10 and 100 through on purpose, and
                  that is the hole these came through. The two rulings that
                  stay: progress through a finite list the person is working
                  through, which is flagged and not failed.
    zero          a zero shown as a number. A dash is the honest glyph for not
                  read yet, and it is not zero (COPY.md, Value).

and two that are about the stylesheet and the casing of what is authored:

    title-case    a string AUTHORED in title case. Sentence case is ruled.
    css-case      a string authored in sentence case that the stylesheet shows
                  in title case or capitals. Reported and not failed here: the
                  rule that does it is a named gate edit for the skin build.
"""
import json
import os
import re
import sys
import collections

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
os.chdir(ROOT)
sys.path.insert(0, os.path.join(ROOT, '.claude', 'skills', 'atuned-voice'))
import check  # noqa: E402

# ---------------------------------------------------------------- the new rules

PCT = re.compile(r'%|\bper ?cent\b|\bpercent(?:age)?\b', re.I)
PCT_ZERO = re.compile(r'(?<![\d.])0(?:\.0+)?\s*(?:%|per ?cent\b|percent\b)|\bzero (?:per ?cent|percent)\b', re.I)
BARE = re.compile(r'^\s*[+\u2212-]?\d+(?:[.,]\d+)?\s*(?:\u00d7|x|\u00b0|min|s)?\s*$')

NUMW = (r'(?:\d+(?:\.\d+)?|zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|'
        r'twelve|twenty one|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety)')
TOTW = (r'(?:\d+|ten|twelve|twenty one|twenty|thirty|forty|fifty|sixty|seventy|'
        r'hundred|one hundred|a hundred|thousand|a thousand|nine|seven|eight|six|five|four|three)')
# "one of twelve" is a way of saying a kind of thing, and "every one of the
# nine" is a quantifier. Neither is a count against a total, so the numerator
# one is left out. "two of the nine" is a count and stays in.
TOTAL = [
    re.compile(r'(?<![\w.])(?!one\b)' + NUMW + r'\s+(?:of|out of)\s+(?:the\s+|a\s+clean\s+|a\s+)?' + TOTW + r'\b', re.I),
    re.compile(r'(?<![\w.])\d+(?:\.\d+)?\s*/\s*(?:10|100|112)\b'),
    re.compile(r'\bagainst\s+(?:a\s+|the\s+)?(?:clean\s+|full\s+)?(?:ten|hundred|100|10)\b', re.I),
    re.compile(r'\bout of\s+(?:a\s+|the\s+)?(?:ten|hundred|100|10|twelve|112)\b', re.I),
    re.compile(r'\b(?:score|rated|graded|marked)\b[^.]{0,20}\bof\s+(?:ten|10|100)\b', re.I),
]
# progress through a finite list a person is working through. Ruled allowed
# (COPY-OBJECTIONS CO-05 note), so it is flagged and not failed.
PROGRESS = re.compile(r'\b(?:question|step|line|card|page|pass|round|address|cleared|matched|of the queue)\b', re.I)

ZERO_VALUE = re.compile(r'(?<![\d.:\-/])0(?:\.0+)?(?![\d.:])(?!\s*(?:\u00d7|x)\b)')
ZERO_UNIT = re.compile(r'(?<![\d.:\-/])0\s+(?:days?|minutes?|hours?|rituals?|addresses|patterns|releases|stories|'
                       r'imprints|entries|seats|points|laws|cards|lines|saboteurs|complexes|streak)\b', re.I)

# A SENSATION IS A REPORT, NEVER A CAUSE (REVIEW-arch/pass1/narrative-director.md,
# the sensation rule). Four shipped lines stated a cause about the body or the
# person, and no gate held them. The first pattern fails; the second is read.
CAUSE_STOP = re.compile(r'\bwhich means\b|\bmeans something\b|\bblocked by\b|\binstalled on top\b|'
                        r'\bcaused by\b|\bis storing\b|\bproves\b', re.I)
CAUSE_READ = re.compile(r'\b(?:means|shows|indicates|because|due to|trapped in|stuck in|stored in)\b', re.I)
BODYW = re.compile(r'\b(?:chest|throat|gut|belly|stomach|heart|jaw|neck|shoulders?|hips?|tight|tension|'
                   r'pressure|ache|numb|nerve|organs?|blood)\b', re.I)

SMALL = {'a', 'an', 'the', 'of', 'to', 'in', 'on', 'at', 'by', 'or', 'and', 'for', 'it', 'is', 'as',
         'its', 'if', 'vs', 'no', 'not', 'but', 'with', 'from', 'into', 'than', 'then', 'up', 'out',
         'off', 'so', 'be', 'are', 'you', 'your', 'i', 'my', 'we', 'me'}
PROPER = {'you', 'energetics', 'ai', 'wood', 'fire', 'earth', 'metal', 'water', 'rat', 'ox', 'tiger', 'rabbit', 'dragon',
          'snake', 'horse', 'goat', 'monkey', 'rooster', 'dog', 'pig', 'year', 'atuned', 'source', 'os', 'myers', 'briggs', 'jung', 'jungian', 'mbti', 'enneagram', 'vedic',
          'sanskrit', 'dante', 'inferno', 'stripe', 'google', 'anthropic', 'claude', 'chrome', 'safari',
          'ultima', 'tula', 'unified', 'llc', 'reiki', 'kundalini', 'ayurveda', 'chakra', 'sat', 'chit',
          'ananda', 'rebel', 'warrior', 'ruler', 'sage', 'magician', 'caregiver', 'innocent', 'everyman',
          'lover', 'jester', 'explorer', 'creator', 'hero', 'outlaw', 'sofia', 'diane', 'marcus', 'angela',
          'derek', 'james', 'rosa', 'ana', 'tomas', 'nkem', 'wren', 'abraham', 'gordon', 'lance', 'one',
          'two', 'three', 'four', 'dark', 'light', 'punch', 'glass', 'free', 'pro', 'plus', 'tier', 'x',
          'ii', 'iii', 'iv', 'vi', 'vii', 'viii', 'ix', 'xi', 'xii', 'pm', 'am', 'utc', 'id', 'ok'}
WORD = re.compile(r"[A-Za-z][A-Za-z'\u2019-]*")


def title_case(s):
    """True when a string is authored as a title: two or more words, every word
    that is not a small word or a proper name opening on a capital, and at least
    one such word after the first. A sentence ends in a stop or runs on a comma."""
    t = re.sub(r'<[^>]*>', '', s).strip()
    if re.search(r'[.!?,;:]', t) or len(t) > 60 or re.search(r'\d', t):
        return False
    ws = WORD.findall(t)
    if len(ws) < 2 or not ws[0][0].isupper():
        return False
    body = [w for w in ws[1:] if w.lower() not in SMALL and w.lower() not in PROPER]
    small_cap = [w for w in ws[1:] if w.lower() in SMALL and w[0].isupper() and w != 'I']
    if not body:
        return bool(small_cap)          # "Sign In"
    if not all(w[0].isupper() for w in body):
        return False
    return not all(w.isupper() for w in ws)


def locate_index():
    files = []
    for d in ('atuned_src/ui', 'atuned_src/engine', 'atuned_src/shell'):
        for dp, _, fn in os.walk(os.path.join(ROOT, d)):
            for f in sorted(fn):
                if f.endswith(('.js', '.html')):
                    p = os.path.join(dp, f)
                    files.append((os.path.relpath(p, ROOT), open(p, encoding='utf-8').read().split('\n')))
    return files


_LOC = None


def locate(s):
    """file:line of the longest literal stretch of a rendered string."""
    global _LOC
    if _LOC is None:
        _LOC = locate_index()
    t = re.sub(r'\s+', ' ', s)
    chunks = [c.strip() for c in re.split(r'[\d]+(?:\.\d+)?|[%\u00d7]', t)]
    chunks = [c for c in chunks if len(c) >= 6]
    chunks.sort(key=len, reverse=True)
    for c in chunks[:3] or [t]:
        for needle in (c, c.replace("'", "\\'")):
            for path, lines in _LOC:
                for i, ln in enumerate(lines, 1):
                    if needle in ln:
                        return '%s:%d' % (path, i)
    return ''


# ---------------------------------------------------------------- the data skip

# a table of phrases the instrument LISTENS FOR is detection, not copy. It is
# listed here by what it is so it is not counted as copy a person reads. The
# list is the only typed thing in this file and every entry says why.
DETECTORS = re.compile(r'^data:(?:LEANLEX|LEANCUE|LEANFRAME|LAWCUE|PHRASES|HARM|SOM|W|BY|BM|BMG|STOPW|'
                       r'DISTRESS\w*|CUE\w*|LEX\w*)$')


# THINGS THE PRODUCT NAMES. A deck and an assistant carry a proper name, and the
# name keeps its capitals the way a person's does. Two entries and no more: a
# list that grows is a list of exceptions to the rule it was written for.
NAMED_THINGS = {'The Letting Go Deck', 'Source AI'}

# DATA TABLES THAT HOLD LABELS A PERSON READS AS LABELS, authored in the UI.
AUTHORED_TABLES = {'OB_SURVEY', 'FB_LAYERS', 'KB_SECS', 'TABDEF', 'SECTIONS', 'TIPS'}

# THE CODEX'S OWN TABLES. A string in one of these is a name the owner gave a
# thing, and many of them are identity: a saved profile and a saved ritual find
# a pattern or a practice by its name. Renaming one is a migration and not a
# copy edit, so it is reported, with its count, and never failed. This is a
# judgement and the only typed list here besides DETECTORS.
CODEX_TABLES = {'NODES', 'SABAUTH', 'SAB33', 'SAB_LIB', 'HCX_LIB', 'CASCADE', 'SI', 'MIRROR', 'MASTERS',
                'PATHS', 'GOVERN', 'PRACTICE', 'PMBANDS', 'FULLNAME', 'HDTYPE', 'APC', 'HARM', 'HARM_AX',
                'DANTECUE', 'UNNAMED', 'MARKERS', 'SPEC_POLE', 'LBL', 'BM', 'ARCH', 'DOMAINS', 'LAWS'}


# TABLES THAT ARE NOT COPY A PERSON READS. A phrase the instrument listens for,
# a template word that is replaced before it is shown, a counterexample written
# to fail, and the clinical correspondences ui.js keeps off the screen by name
# (nodes.js says so beside them). Each is counted as a detector and left out of
# the totals, and the list is typed because the page cannot tell them apart.
INTERNAL_TABLES = {'LEXMETA', 'CHGMETA', 'Q3', 'SRC_DIM_CUE', 'C3_TRUTHRULE', 'LEXCOMP', 'DANTECUE'}


def internal(path):
    return table_of(path) in INTERNAL_TABLES or bool(re.match(r'HCX_LIB\[\d+\]\.sub$', path or ''))


def table_of(path):
    return re.split(r'[\[.]', path or '', 1)[0]


def run(path):
    d = json.load(open(path, encoding='utf-8'))
    surfaces = d['surfaces']
    # THE NAMES THE CODEX GIVES THINGS. Every string in a data table, so a
    # string on the screen that is built out of those names ("Open Need To
    # Win", "Imposter + Deflector") is told from a label somebody authored in
    # title case. A name in the codex is the owner's, and renaming it is a
    # change to identity keys, so it is reported and never failed.
    for tname in d['meta'].get('tabs', []):
        PROPER.add(tname.lower())
    names = set(x['s'] for x in d['strings']
                if x['k'] == 'data' and table_of(x.get('x', '')) in CODEX_TABLES)
    segs = set(seg.strip() for n in names for seg in re.split(r'\s[+/]\s', n))
    # EVERY CAPITALISED WORD THE DATA TABLES CARRY AS A NAME. A string built
    # out of them ("Knowledge by Fear", "Embodied Coherent", "toward Worth") is
    # a composite of names the codex gave, and is reported as one. The tables
    # that are labels somebody authored are left out, so a label is never
    # excused by sharing a word with one.
    known = set()
    for x in d['strings']:
        if x['k'] != 'data' or table_of(x.get('x', '')) in AUTHORED_TABLES:
            continue
        t = x['s']
        if len(t.split()) <= 3 and not re.search(r'[.!?;]', t):
            for w in WORD.findall(t):
                if w[0].isupper():
                    known.add(w)
    out = []   # one dict per (string, rule)
    for e in d['strings']:
        s, k, tf = e['s'], e['k'], e.get('tf', 'none')
        # the walker joins inline runs with a space, so punctuation can arrive
        # as "Architect , which". The page does not print that space.
        s = re.sub(r'\s+([,.;:!?)])', r'\1', s)
        s = re.sub(r'([(])\s+', r'\1', s)
        ws = [surfaces[i] for i in e['w']]
        keys = [w['key'] for w in ws]
        unread_surfaces = [w for w in ws if w.get('unread')]
        is_data = k == 'data'
        # a stylesheet or a row of numbers held in a variable is not copy
        if is_data and (re.search(r'[{}][^{}]*:[^{}]*;', s) or s.count('|') >= 4):
            continue
        tabs = sorted(set(w['tab'] for w in ws))
        hits = []   # (rule, severity, hit, note)
        text = re.sub(r'<[^>]*>', ' ', s)
        text = re.sub(r'\{\d\}', '{n}', text)       # a template slot is not a zero

        # --- the gates that already exist, called and not copied
        sents = check.sentences([('<page>', 0, text)])
        for gate, _, _, _, note in check.scan(sents):
            # a name the codex gave a thing keeps its own letters: the Human
            # Design type is called Manifesting Generator and the cascade has
            # an NPC. The soft and caps gates read them as copy.
            if gate in ('soft', 'caps') and (s in names or s in NAMED_THINGS):
                continue
            hits.append(('check:' + gate, 'stop', note.split('"')[1] if '"' in note else '', note))
        for r, sev, hit in check.objection_hits(text):
            if r['id'] == 'count-against-total' and PROGRESS.search(text) and len(WORD.findall(text)) <= 8:
                sev = 'flag'      # a place in a finite list, ruled allowed in CO-05
            hits.append(('obj:' + r['id'], sev, hit, r['why'].split('.')[0]))

        # --- the new rules
        if PCT_ZERO.search(text):
            hits.append(('percent-zero', 'stop', PCT_ZERO.search(text).group(0), 'a percent printed off zero'))
        if PCT.search(text):
            if unread_surfaces:
                # a value or a label carrying a value fails. A long sentence
                # that merely names a percent is a definition, flagged.
                sev = 'stop' if len(WORD.findall(text)) <= 10 else 'flag'
                hits.append(('percent-unread', sev, PCT.search(text).group(0),
                             'a percent on a surface whose profile is unread'))
            else:
                hits.append(('percent', 'flag', PCT.search(text).group(0),
                             'a percent needs its denominator named, once'))
        # THE ANSWER BUTTONS ARE A SCALE, NOT A READING. The intake's 0 to 10
        # buttons and the Field dial's ruler are controls whose face is the
        # number. They are exempt by the class the sheet gives them.
        input_face = bool(re.search(r'\b(?:iq-n|pol2-t)\b', e.get('cls', '')))
        if unread_surfaces and not input_face and BARE.match(s) and not re.search(r'\u00d7|x$', s):
            # a decimal, a zero or a percent is a measured value standing alone.
            # A plain whole number is a count or a picker, and is flagged for a
            # reader to rule on rather than failed.
            sev = 'stop' if re.search(r'[.,]|^0+$|%', s.strip()) else 'flag'
            hits.append(('bare-number', sev, s, 'a number standing alone on an unread surface'))
        for rx in TOTAL:
            m = rx.search(text)
            if m:
                # progress through a finite list the person is working through,
                # said short ("Pass 1 of 100 . address 1 of 3", "0 of 24 cleared")
                prog = PROGRESS.search(text) and len(WORD.findall(text)) <= 8
                sev = 'flag' if prog else 'stop'
                hits.append(('total', sev, m.group(0), 'a count against a total'))
                break
        # a scale described, or an answer scale's anchor, is not a reading
        ztext = re.sub(r'\b0 (?:to|at|never)\b|\bfrom 0\b', ' ', text)
        zv = ZERO_UNIT.search(ztext) or (ZERO_VALUE.search(ztext) if re.search(r'\d', ztext) else None)
        if zv and not input_face and not re.search(r'\b(?:version|v)\s*\d|\b20\d\d\b|\d:\d\d', text):
            whole = bool(BARE.match(s))
            sev = 'stop' if (whole or unread_surfaces) else 'flag'
            hits.append(('zero', sev, zv.group(0), 'a zero shown as a number, where a dash belongs'))
        m = CAUSE_STOP.search(text)
        if m:
            hits.append(('cause', 'stop', m.group(0), 'states a cause. A sensation is a report, never a cause'))
        elif CAUSE_READ.search(text) and BODYW.search(text) and len(WORD.findall(text)) <= 40:
            hits.append(('cause-read', 'flag', CAUSE_READ.search(text).group(0),
                         'a body word joined to a cause word. Check it reports and does not explain'))
        for nm_, rx_ in (('anti', check.ANTI), ('gloss', check.GLOSS), ('reassure', check.REASSURE)):
            if k in ('title', 'tip', 'tip-t', 'tipn', 'tip-a', 'data-tip', 'aria-label') and rx_.search(text):
                hits.append(('tooltip-' + nm_, 'flag', rx_.search(text).group(0).strip(),
                             'a hover or screen reader string with the %s shape' % nm_))
        if title_case(s) and (is_data or k in ('text', 'title', 'aria-label', 'tip-t', 'svgtitle', 'option', 'value', 'hover', 'dialog', 'status', 'tip', 'tipn')):
            core = re.sub(r'^(?:Open|Take|Release|Close|Show|Hide|Move|Delete|Go to|Run)\s+', '', s)
            core = re.sub(r'\s+(?:out|in|here|now|up|down)$', '', core)
            parts = [x.strip() for x in re.split(r'\s[+/]\s', core)]
            caps_words = [w for w in WORD.findall(core) if w[0].isupper()]
            if not is_data and (core in names or s in names or all(x in segs for x in parts)
                                or s in NAMED_THINGS
                                or (caps_words and all(w in known or w.lower() in PROPER for w in caps_words))):
                hits.append(('title-case-name', 'flag', s, 'a name from the codex, shown in its own capitals'))
            elif is_data and table_of(e.get('x', '')) in CODEX_TABLES:
                hits.append(('title-case-name', 'flag', s, 'a name in a codex table'))
            else:
                hits.append(('title-case', 'stop', s, 'authored in title case. Sentence case is ruled'))
        if tf == 'capitalize' and len(WORD.findall(s)) >= 2 and not title_case(s):
            hits.append(('css-case', 'flag', s, 'authored in sentence case, shown in title case by the stylesheet'))
        if tf == 'uppercase' and re.search(r'[a-z]', s) and len(s) > 3:
            hits.append(('css-caps', 'flag', s, 'authored in lower case, shown in capitals by the stylesheet'))

        for rule, sev, hit, note in hits:
            out.append({'rule': rule, 'sev': sev, 'hit': hit, 'note': note, 's': s, 'k': k,
                        'tabs': tabs, 'surfaces': len(keys), 'unread': bool(unread_surfaces),
                        'data': is_data, 'detector': bool(is_data and (internal(e.get('x', '')) or any(DETECTORS.match(x) for x in keys))),
                        'x': e.get('x', ''), 'keys': keys[:4]})
    return d, out


def tmpl(s):
    """the string with its numbers taken out, so "Fear, 62 per cent" and "Fear,
    41 per cent" are one template. The count of templates is the count of places
    in the source a person would have to edit."""
    return re.sub(r'\d+(?:[.,]\d+)?', 'N', s)


def tally(out):
    by_rule = collections.defaultdict(lambda: {'stop': set(), 'flag': set()})
    by_tab = collections.defaultdict(lambda: collections.defaultdict(set))
    for f in out:
        if f['detector']:
            continue
        by_rule[f['rule']][f['sev']].add(f['s'])
        tabs = f['tabs'] if len(f['tabs']) < 5 else ['(shell, on every tab)']
        for t in tabs:
            if f['sev'] == 'stop':
                by_tab[t][f['rule']].add(f['s'])
    return by_rule, by_tab


def md_report(before_path, after_path, examples=4):
    """Markdown for COPY-VERIFY.md: counts per rule and per surface before and
    after, with the strings themselves as evidence."""
    db, ob = run(before_path)
    da, oa = run(after_path)
    rb, tb = tally(ob)
    ra, ta = tally(oa)
    out = []
    out.append('| rule | stop before | stop after | flagged before | flagged after |')
    out.append('|---|---:|---:|---:|---:|')
    for r in sorted(set(rb) | set(ra), key=lambda r: -len(rb[r]['stop']) if r in rb else 0):
        out.append('| %s | %d | %d | %d | %d |' % (
            r, len(rb[r]['stop']) if r in rb else 0, len(ra[r]['stop']) if r in ra else 0,
            len(rb[r]['flag']) if r in rb else 0, len(ra[r]['flag']) if r in ra else 0))
    tot = lambda t: len(set().union(*[v for x in t.values() for v in x.values()])) if t else 0
    out.append('')
    out.append('| surface | failing strings before | failing strings after | worst rules before |')
    out.append('|---|---:|---:|---|')
    for t in sorted(set(tb) | set(ta), key=lambda t: -len(set().union(*tb[t].values())) if t in tb else 0):
        nb = len(set().union(*tb[t].values())) if t in tb else 0
        na = len(set().union(*ta[t].values())) if t in ta else 0
        worst = ', '.join('%s %d' % (r, len(v)) for r, v in sorted(tb[t].items(), key=lambda x: -len(x[1]))[:3]) if t in tb else ''
        out.append('| %s | %d | %d | %s |' % (t, nb, na, worst))
    out.append('')
    return '\n'.join(out), ob, oa


def main():
    a = sys.argv[1:]
    if a and a[0] == '--md':
        txt, ob, oa = md_report(a[1], a[2])
        print(txt)
        return 0
    if not a:
        print(__doc__)
        return 2
    path = a[0]
    d, out = run(path)
    by_rule, by_tab = tally(out)
    stop = len(set((f['s'], f['rule']) for f in out if f['sev'] == 'stop' and not f['detector']))
    flag = len(set((f['s'], f['rule']) for f in out if f['sev'] == 'flag' and not f['detector']))
    meta = d['meta']
    print('# harvest %s  commit %s  md5 %s  %d surfaces  %d distinct strings'
          % (meta['file'], meta['commit'], meta['md5'], meta['surfaces'], meta['strings']))
    print('# unread profiles: %s' % ', '.join(k for k, v in meta['profiles'].items() if v))
    print('# failing (stop): %d   flagged: %d   detectors skipped: %d'
          % (stop, flag, len(set(f['s'] for f in out if f['detector']))))
    print('\nPER RULE            distinct strings (stop flag)    distinct templates, numbers removed (stop flag)')
    for r in sorted(by_rule, key=lambda r: -len(by_rule[r]['stop'])):
        ts = len(set(tmpl(x) for x in by_rule[r]['stop']))
        tf_ = len(set(tmpl(x) for x in by_rule[r]['flag']))
        print('  %-24s %5d %5d                   %5d %5d' % (r, len(by_rule[r]['stop']), len(by_rule[r]['flag']), ts, tf_))
    print('\nPER SURFACE (distinct failing strings, stop only)')
    for t in sorted(by_tab, key=lambda t: -sum(len(v) for v in by_tab[t].values())):
        n = len(set().union(*by_tab[t].values()))
        print('  %-22s %5d   %s' % (t, n, ', '.join('%s %d' % (r, len(v)) for r, v in
                                                      sorted(by_tab[t].items(), key=lambda x: -len(x[1]))[:5])))
    if '--json' in a:
        jp = a[a.index('--json') + 1]
        json.dump({'meta': meta, 'findings': out}, open(jp, 'w'))
    if '--show' in a:
        want = a[a.index('--show') + 1]
        seen = set()
        for f in out:
            if f['rule'] == want and not f['detector'] and f['s'] not in seen:
                seen.add(f['s'])
                print('  [%s] %s  | %s | %s' % (f['sev'], ','.join(f['tabs'][:3]), f['s'][:120], locate(f['s'])))
    return 1 if stop else 0


if __name__ == '__main__':
    sys.exit(main())
