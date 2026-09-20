#!/usr/bin/env python3
"""voice check. The mechanical half of the voice test.

Run from the repo root.

    python3 .claude/skills/atuned-voice/check.py --baseline
    python3 .claude/skills/atuned-voice/check.py atuned_src/ui/release.js
    python3 .claude/skills/atuned-voice/check.py --line "Sit back and relax."
    python3 .claude/skills/atuned-voice/check.py --all

NO HOUSE NUMBER IS TYPED INTO THIS FILE. The distribution a candidate is
measured against is computed off the shipping copy at run time, every run.
This repository has been bitten nine times by a number typed into a document
that the product then grew past, and a voice gate carrying a hardcoded median
would be the tenth. --baseline prints what the product currently reads.

What this can check is listed under GATES. What it cannot check is printed at
the end of every run, because a score with the unmeasurable part left out is a
lie about how much has been checked.
"""

import os
import re
import sys
import statistics

# ---------------------------------------------------------------- the corpus

CORPUS = ['atuned_src/ui', 'funnel/index.html', 'funnel/quiz.html',
          'funnel/questions.js', 'atuned_src/engine/plan.js']

GLUE = re.compile(r"'\s*\+\s*'")
TAGS = re.compile(r'</?(?:b|em|i|br|span|p|div|strong)[^>]*>')


def root():
    d = os.path.abspath('.')
    while d != '/':
        if os.path.exists(os.path.join(d, 'CLAUDE.md')):
            return d
        d = os.path.dirname(d)
    return os.path.abspath('.')


def strings_js(path):
    """Prose string literals, with concatenation glued back into sentences.

    The copy in this product is built by ordered concatenation, so a sentence
    lives across four literals. Measuring the literals instead of the sentences
    reported a median of 5 words where the real figure is 6, which is the
    probe lying about the thing it was built to watch.
    """
    try:
        s = open(path, encoding='utf-8').read()
    except OSError:
        return []
    s = re.sub(r'/\*.*?\*/', ' ', s, flags=re.S)
    s = re.sub(r'(?m)^\s*//.*$', ' ', s)
    s = GLUE.sub('', s)
    out = []
    for m in re.finditer(r"'((?:[^'\\\n]|\\.)*)'", s):
        t = m.group(1)
        if len(t) < 14 or not re.search(r'[a-z] [a-z]', t):
            continue
        if re.search(r'[{}#;=]|px\b|\.js\b', t):
            continue
        out.append((path, s[:m.start()].count('\n') + 1, t))
    return out


def text_html(path):
    try:
        s = open(path, encoding='utf-8').read()
    except OSError:
        return []
    for pat in [r'<style.*?</style>', r'<script.*?</script>',
                r'<!--.*?-->', r'<head.*?</head>', r'<svg.*?</svg>']:
        s = re.sub(pat, ' ', s, flags=re.S)
    s = re.sub(r'</(?:p|div|li|h1|h2|h3|h4|dd|dt|section)>', '\n', s)
    s = re.sub(r'<[^>]+>', ' ', s)
    out = []
    for i, line in enumerate(s.split('\n'), 1):
        line = ' '.join(line.split())
        if len(line) > 14 and re.search(r'[a-z] [a-z]', line):
            out.append((path, i, line))
    return out


def harvest(target):
    """(path, line, string) for one file or directory."""
    out = []
    if os.path.isdir(target):
        for f in sorted(os.listdir(target)):
            out += harvest(os.path.join(target, f))
    elif target.endswith('.js'):
        out += strings_js(target)
    elif target.endswith('.html'):
        out += text_html(target)
    return out


def sentences(strings):
    out = []
    for path, line, t in strings:
        t = TAGS.sub('', t).replace('\\n', ' ')
        for s in re.split(r'(?<=[.!?])\s+', t):
            s = s.strip()
            if len(re.findall(r'[A-Za-z]+', s)) >= 2:
                out.append((path, line, s))
    return out


def words(s):
    return len(re.findall(r"[A-Za-z][A-Za-z'’-]*", s))


# ----------------------------------------------------------------- the gates
#
# Each gate is (key, label, matcher). A matcher returns a list of the offending
# spans in one sentence. A gate that cannot fail is not a gate, so every one of
# these fires on a line that is currently in the product or was until it was
# fixed, and the SKILL.md names which.

PREAMBLE = re.compile(
    r'\b(?:welcome to|let us begin|let’s begin|in this section|'
    r'before we begin|first,? let|we will be here|this guide will|'
    r'in the following)\b', re.I)

SOFT = re.compile(
    r'\b(?:sit back|relax|unwind|nurtur\w*|gently|softly|self ?care|'
    r'self ?love|mindful\w*|holistic|wellness|well ?being|journey|'
    r'embrace|honour your|honor your|hold space|inner child|'
    r'authentic self|best self|your truth|abundance|manifest\w*|'
    r'high vibration|raise your vibration|sacred space|safe space|'
    r'lean into|show up for yourself|tune in to yourself)\b', re.I)

FILLER = re.compile(
    r'\b(?:simply|just click|please note|kindly|feel free to|'
    r'in order to|it is important to note|as you can see|'
    r'remember,|don’t worry|do not worry|no worries|oops|'
    r'unfortunately|we’re sorry|we are sorry)\b', re.I)

ANTI = re.compile(
    r'(?:,\s*not\s+[a-z])'
    r'|(?:\bnot\s+[a-z][^.,;]{1,40},\s*(?:it|they|but)\b)'
    r'|(?:\brather than\b)'
    r'|(?:\bnot\s+[a-z]+\.\s+[A-Z])')

GLOSS = re.compile(r',\s*which\s+(?:is|means|was|says|makes|gives)\b')

COPULA = re.compile(r'^(?:It|That|This|These|Those|There)\s+(?:is|are|was|were)\b')

# A reassurance is a sentence that denies a fear in the abstract. It is not
# banned, it is held: it must answer a fear the person has already met on this
# surface or one screen earlier. The gate flags, a person rules.
REASSURE = re.compile(
    r'\b(?:no judg\w*|nothing here grades|you are not alone|'
    r'not carrying it alone|there is no right answer|it is okay|'
    r'it’s okay|is not unusual|nothing to be ashamed|'
    r'you have not failed|that is normal|perfectly normal|'
    r'nothing is wrong with you)\b', re.I)

# A number with no unit and no denominator. "25 of your allowance" and
# "92 of the gift left" both ship. Both are real.
NAKED_NUM = re.compile(
    r'(?<![\w.])\d+(?:\.\d+)?\s+of\s+(?:your|the|these|those|his|her|their)\s+'
    r'(?!\d)(?:\w+)')

UNITS = re.compile(
    r'\b(?:pattern|patterns|address|addresses|line|lines|law|laws|'
    r'question|questions|card|cards|minute|minutes|second|seconds|'
    r'seat|seats|point|points|axis|axes|per cent|percent|day|days|'
    r'week|weeks|month|months|year|years|hundred|character|characters)\b', re.I)

# The same defect in template form, which is how it actually ships. The
# literal is " of your allowance" and the digit arrives at run time, so the
# sentence gate above cannot see it. This one reads the literal.
TEMPLATE_NUM = re.compile(
    r'^\s*of\s+(?:your|the|these|those|his|her|their)\s+(.{0,48})')

CAPS = re.compile(r'\b[A-Z]{3,}\b')
CAPS_OK = {'CQ', 'SQ', 'DQ', 'IQ', 'MBTI', 'INFJ', 'ENTP', 'JSON', 'HTML',
           'CSS', 'URL', 'API', 'OK', 'AM', 'PM', 'UTC'}

# built from its codepoint so this file does not itself contain one. The
# ruling is no em dashes anywhere, and a gate that breaks the rule it enforces
# is the tool lying about the thing it watches.
EMDASH = chr(0x2014)

BUCKETS = ('menu', 'label', 'value', 'definition', 'instruction',
           'reading', 'refusal')


def scan(sents):
    """Every hard failure, in one pass. Returns a list of (gate, path, line, text, note)."""
    bad = []
    for path, line, s in sents:
        if EMDASH in s:
            bad.append(('emdash', path, line, s, 'em dash. Ruled out everywhere.'))
        if re.search(r'(?<!\d)108(?!\d)', s):
            bad.append(('108', path, line, s, 'the count stated to users is 112.'))
        m = PREAMBLE.search(s)
        if m:
            bad.append(('preamble', path, line, s,
                        '"%s" announces that a thing is starting. Start it.' % m.group(0)))
        m = SOFT.search(s)
        if m:
            bad.append(('soft', path, line, s,
                        '"%s" is category language. Name the physical fact.' % m.group(0)))
        m = FILLER.search(s)
        if m:
            bad.append(('filler', path, line, s, '"%s" carries nothing.' % m.group(0)))
        if '!' in s and not re.search(r'\w!\w', s):
            bad.append(('bang', path, line, s, 'no exclamation marks.'))
        for m in CAPS.finditer(s):
            if m.group(0) not in CAPS_OK:
                bad.append(('caps', path, line, s,
                            '"%s" in copy. Sentence case in body, title case in headers.'
                            % m.group(0)))
        for m in NAKED_NUM.finditer(s):
            if not UNITS.search(m.group(0)):
                bad.append(('naked number', path, line, s,
                            '"%s" has no unit. A reader cannot say it out loud.'
                            % m.group(0).strip()))
    return bad


def literals_raw(target):
    """Literals WITHOUT the concatenation glue, so the line number is the real
    one and a glue artifact cannot be mistaken for a shipped string."""
    out = []
    if os.path.isdir(target):
        for f in sorted(os.listdir(target)):
            out += literals_raw(os.path.join(target, f))
        return out
    if not target.endswith('.js'):
        return out
    try:
        s = open(target, encoding='utf-8').read()
    except OSError:
        return out
    # comments blanked but their newlines kept, so a reported line number is
    # the real one. Collapsing them to spaces put every finding 50 lines early.
    s = re.sub(r'/\*.*?\*/',
               lambda m: '\n' * m.group(0).count('\n'), s, flags=re.S)
    for m in re.finditer(r"'((?:[^'\\\n]|\\.)*)'", s):
        before = s[:m.start()].rstrip()
        # interp is True only when a run time VALUE lands immediately in front
        # of this literal. Preceded by ':' it is a table entry, and preceded by
        # another literal it is the middle of a sentence. The first cut of this
        # checked neither and reported five false findings out of seven: the
        # KBOF denominator table in knowledge.js, which is the correct pattern,
        # and a glued sentence in panels.js. Checked against those known good
        # cases before it was trusted.
        interp = before.endswith('+') and not before[:-1].rstrip().endswith("'")
        out.append((target, s[:m.start()].count('\n') + 1, m.group(1), interp))
    return out


def scan_literals(target):
    """Gates that have to read the unrendered literal, not the sentence.

    A template is where the naked number actually lives. The literal is
    " of your allowance" and the digit is interpolated at run time, so the
    sentence gate cannot see it and only this one can.
    """
    bad = []
    for path, line, t, interp in literals_raw(target):
        if not interp:
            continue
        m = TEMPLATE_NUM.match(t)
        if m and not UNITS.search(m.group(1)):
            bad.append(('naked number', path, line, t,
                        'a run time number lands in front of this. '
                        '"N of %s" has no unit, so it cannot be read out loud.'
                        % re.sub(r'<[^>]*>', '', m.group(1)).strip()))
    return bad


def rates(sents):
    """The soft gates, as a rate per hundred sentences."""
    n = max(1, len(sents))
    L = sorted(words(s) for _, _, s in sents)
    return {
        'n': len(sents),
        'median': statistics.median(L) if L else 0,
        'p90': L[min(len(L) - 1, int(len(L) * .90))] if L else 0,
        'p95': L[min(len(L) - 1, int(len(L) * .95))] if L else 0,
        'over25': 100.0 * sum(1 for x in L if x > 25) / n,
        'anti': 100.0 * sum(1 for _, _, s in sents if ANTI.search(s)) / n,
        'gloss': 100.0 * sum(1 for _, _, s in sents if GLOSS.search(s)) / n,
        'copula': 100.0 * sum(1 for _, _, s in sents if COPULA.match(s)) / n,
        'reassure': 100.0 * sum(1 for _, _, s in sents if REASSURE.search(s)) / n,
    }


def baseline(rt):
    allstr = []
    for c in CORPUS:
        allstr += harvest(os.path.join(rt, c))
    return rates(sentences(allstr)), allstr


UNMEASURABLE = """
WHAT THIS DID NOT CHECK. Four things, and they are the four that decide it.

  1  Is it true. Whether the sentence overstates what the instrument measured.
     No regex reads a claim against a reading. Check the value it names exists.
  2  Is it one bucket. %s.
     A string that is two buckets passes every gate above.
  3  Does it land for Angela, Derek and James. Level 5 who wants magic, level 7
     who wants the diagnostic, level 3 who is defended. Read it as each.
  4  Rhythm. Where the sentence breaks. Read it out loud, standing up.

A green run here means nothing above this line is broken. It does not mean the
line is good.
""" % ', '.join(BUCKETS)


def report(label, r, base, bad, verbose=True):
    print('\n%s' % label)
    print('  sentences %d   median %g   p90 %g   p95 %g   over 25 words %.1f%%'
          % (r['n'], r['median'], r['p90'], r['p95'], r['over25']))
    print('  house      median %g   p90 %g   p95 %g   over 25 words %.1f%%'
          % (base['median'], base['p90'], base['p95'], base['over25']))
    print()
    print('  %-10s %8s %8s' % ('rate', 'here', 'house'))
    for k, name in [('anti', 'antithesis'), ('gloss', 'gloss'),
                    ('copula', 'it-is open'), ('reassure', 'reassurance')]:
        flag = ''
        if r['n'] >= 12 and r[k] > max(6.0, base[k] * 2.0):
            flag = '   <-- over house'
        print('  %-10s %7.1f%% %7.1f%%%s' % (name, r[k], base[k], flag))
    if bad:
        print('\n  %d hard failure%s' % (len(bad), '' if len(bad) == 1 else 's'))
        for gate, path, line, s, note in bad:
            where = '%s:%s' % (os.path.basename(path), line)
            print('   [%s] %s' % (gate, where))
            print('        %s' % s[:150])
            print('        %s' % note)
    else:
        print('\n  no hard failures')
    return len(bad)


def main():
    rt = root()
    os.chdir(rt)
    args = sys.argv[1:]
    base, allstr = baseline(rt)

    if not args or args[0] == '--baseline':
        print('HOUSE DISTRIBUTION, measured off the shipping copy just now.')
        print('Corpus: %s' % ', '.join(CORPUS))
        bad = scan(sentences(allstr))
        for c in CORPUS:
            bad += scan_literals(os.path.join(rt, c))
        report('the product as it stands', base, base, bad)
        print(UNMEASURABLE)
        return 1 if bad else 0

    if args[0] == '--line':
        text = ' '.join(args[1:])
        sents = sentences([('<stdin>', 0, text)])
        bad = scan(sents)
        return report('the line', rates(sents), base, bad) and 1 or 0

    if args[0] == '--all':
        worst = 0
        for c in CORPUS:
            ss = harvest(os.path.join(rt, c))
            by = {}
            for path, line, t in ss:
                by.setdefault(path, []).append((path, line, t))
            for path, group in sorted(by.items()):
                sents = sentences(group)
                if len(sents) < 12:
                    continue
                bad = scan(sents) + scan_literals(path)
                worst += report(os.path.relpath(path, rt), rates(sents), base, bad, False)
        print(UNMEASURABLE)
        return 1 if worst else 0

    fails = 0
    for a in args:
        ss = harvest(a)
        if not ss:
            print('%s: no prose strings found' % a)
            continue
        sents = sentences(ss)
        fails += report(a, rates(sents), base, scan(sents) + scan_literals(a))
    print(UNMEASURABLE)
    return 1 if fails else 0


if __name__ == '__main__':
    sys.exit(main())
