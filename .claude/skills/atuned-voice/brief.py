#!/usr/bin/env python3
"""The brief, made checkable. Run through check.py, never on its own.

    python3 .claude/skills/atuned-voice/check.py --brief atuned_src/ui \\
        atuned_src/engine atuned_src/shell funnel/*.html funnel/questions.js
    python3 .claude/skills/atuned-voice/check.py --brief ... --baseline
    python3 .claude/skills/atuned-voice/check.py --brief ... --write-baseline
    python3 .claude/skills/atuned-voice/check.py --brief --line "..." --layer tooltip

CREATIVE-BRIEF-voice.md is architecture a writer had to remember: which layer
a sentence sits in, which station of the loop, and what that layer owes the
person. check.py read a line in isolation and knew none of it. This file
closes that gap and does not start a third system. It reads every user facing
string out of the product, says which layer and which mode it is in and why,
runs check.py's own house gates and his objections over it, and then runs the
brief's rules, each tied to a section number of the brief.

THREE SEVERITIES, and only two of them are mechanical.

    stop     a certain defect. A phrase the brief or the house rules out.
    flag     a probable defect. Mechanical, and it counts against the gate.
    review   a question for a person. Never fails anything, ever.

A rule that needs judgment is a review with its question written out. A tool
that lies is worse than no tool, so where this cannot tell, it says so: a
string whose layer cannot be told from where it lives is UNCLASSIFIED, never
guessed into one.

NO HOUSE NUMBER IS TYPED HERE EITHER. The tab bar and its sections are read
out of engine/core.js at run time. The label classes are read off the
stylesheet by check.py. The two numbers this file does type are the brief's
own: ninth grade, and its button verbs. Both are cited to the section that
says them.
"""

import bisect
import hashlib
import json
import os
import re
import subprocess
import sys
import statistics

HERE = os.path.dirname(os.path.abspath(__file__))
if HERE not in sys.path:
    sys.path.insert(0, HERE)
import check  # noqa: E402  one set of house rules, one home

BRIEF = 'CREATIVE-BRIEF-voice.md'
BASELINE_FILE = os.path.join(HERE, 'brief-baseline.json')

LAYERS = ('tooltip', 'label', 'information', 'mirror', 'discovery', 'play',
          'flow', 'embody', 'button', 'notification', 'status', 'metric')
# 'mirror' is the brief's Summary / Mirror layer. 'status' is its Error and
# System States. 'label' and 'metric' are the brief's own too, section 14's
# first row and section 12. 'quoted' is not a layer: it is a person's own
# words carried by the product, a worked example's story, and no rule about
# the product's voice applies to somebody else's sentence.
QUOTED = 'quoted'
UNCLASSIFIED = 'UNCLASSIFIED'
MODES = ('DISCOVER', 'PLAY', 'FLOW', 'EMBODY', 'none')
SEVERITIES = ('stop', 'flag', 'review')

# ------------------------------------------------------------ the tab bar
#
# READ OUT OF core.js, NEVER TYPED. Every rename on that bar has been undone
# at least once (Intake, Energetics, Body, Intake again), and a mode table
# typed here would have been wrong on the day the next one landed. A tab's
# mode is its section, and its section is .sec on its TABDEF entry.

_TABS = {}


def tabdef(rt):
    """{host id: (name, section or None)} for TABDEF and TABEXTRA."""
    if rt in _TABS:
        return _TABS[rt]
    out = {}
    try:
        src = open(os.path.join(rt, 'atuned_src/engine/core.js'),
                   encoding='utf-8').read()
    except OSError:
        _TABS[rt] = out
        return out
    for m in re.finditer(r"\{k:TAB\.\w+\s*,\s*id:'([\w-]+)'\s*,\s*nm:'([^']+)'"
                         r"([^}]*)\}", src):
        sec = re.search(r"sec:'(\w+)'", m.group(3))
        out[m.group(1)] = (m.group(2), sec.group(1) if sec else None)
    _TABS[rt] = out
    return out


def mode_of(rt, host):
    """The loop station a tab sits in, or none. Practitioner is a section
    and not a station: core.js says so with .mode, and the loop is four."""
    if not host:
        return 'none'
    t = tabdef(rt).get(host)
    if not t or not t[1]:
        return 'none'
    m = t[1].upper()
    return m if m in MODES else 'none'


# ------------------------------------------------------------- where it lives
#
# THE HEURISTICS, WRITTEN DOWN. A string's layer is decided by the first of
# these that answers, in this order, and the answer carries its reason so a
# reader can argue with it.
#
#   1  what the string is. A status() argument is status. A title or data-tip
#      is a tooltip. Text inside a <button> is a button. A heading, an
#      eyebrow, an option, an aria-label or an SVG text is a label.
#   2  the function it is written in, where a file mixes jobs.
#   3  the data table it sits in, under engine/data.
#   4  the file's own job, from the table below, which says one of:
#        all L     every remaining string in the file is layer L
#        stage S   a prompt (a question, or a sentence opening on an
#                  imperative) is layer S, a sentence about the person or
#                  carrying a run time value is mirror, the rest information
#        split     the same, except a prompt is UNCLASSIFIED: a shared
#                  renderer is opened from every tab, so which station an
#                  instruction serves cannot be told from where it lives
#   5  UNCLASSIFIED, reported by file, never guessed.
#
# The surface is the TABDEF host id the file renders into. Checked against
# the markup by test_brief.py: every host named here must exist in TABDEF or
# TABEXTRA, and the file must reach that host or a TAB constant naming it.

FILES = {
    # Discover
    'atuned_src/ui/storyui.js': ('story', ('stage', 'discovery'),
        'renders #story. A person writes what happened here.'),
    'atuned_src/ui/imprints.js': ('story', ('all', 'mirror'),
        'the imprints are what the sniffer read out of the story: a reading.'),
    'atuned_src/ui/release.js': ('story', ('all', 'flow'),
        'the release run. Brief section 4 FLOW: release and integration. The '
        'column sits on the Story page, so its mode is DISCOVER while its '
        'layer is flow, and that mismatch is an owner question.'),
    'atuned_src/ui/avatarui.js': ('iq', ('split',),
        'renders #iq, the Avatar. Mixes building the avatar, its readings and '
        'the ritual hand off, so prompts are not assigned a station.'),
    'atuned_src/ui/intakeui.js': ('iq', ('stage', 'discovery'),
        'the 63 questions, rendered into #iqbody under the Avatar host.'),
    'atuned_src/ui/summary.js': ('sum', ('all', 'mirror'),
        'the reading. COPY.md puts the reading bucket at summary.js sumStory.'),
    'atuned_src/ui/rootsum.js': ('emap', ('all', 'mirror'),
        'the energetic summary at the head of the Intake rail: a reading.'),
    'atuned_src/ui/map.js': ('emap', ('split',),
        'renders #emap, the Intake door, and #masksview figures.'),
    'atuned_src/ui/mapshelf.js': ('emap', ('all', 'metric'),
        'the energy shelf: figures down the rail. Brief section 12.'),
    'atuned_src/ui/analytics.js': ('ana', ('all', 'metric'),
        'renders #ana. Bubbles sized by magnitude. Brief section 12.'),
    'atuned_src/ui/record.js': ('ana', ('all', 'metric'),
        'the record: counts of what happened. Brief section 12.'),
    # Play
    'atuned_src/ui/wheel.js': ('cv', ('split',), 'the Field canvas, #cv.'),
    'atuned_src/ui/rings.js': ('cv', ('split',),
        'the Field drawn as rings and a dial, inside #cv.'),
    'atuned_src/ui/fieldbar.js': ('cv', ('split',),
        'the glass bar over the Field stage.'),
    'atuned_src/ui/ui.js': ('cv', ('split',),
        'the Field pointer, orbs and rails. The app opens on the Field.'),
    'atuned_src/ui/cone.js': ('cone', ('split',), 'renders #cone, the Compass.'),
    'atuned_src/ui/character.js': ('masksview', ('split',),
        'renders #masksview, the Character door.'),
    # Flow
    'atuned_src/ui/ritual.js': ('rit', ('stage', 'embody'),
        'renders #rit. Its prompts are practice, and brief section 4 puts '
        '"Practice the new response" in EMBODY. TABDEF puts Ritual in Flow, '
        'so mode FLOW and layer embody, and that is an owner question.'),
    # Embody
    'atuned_src/ui/knowledge.js': ('know', ('split',),
        'renders #knowbody: the reference, and the deck dealt from the '
        'person\'s own held addresses.'),
    # off the bar
    'atuned_src/ui/games.js': ('games', ('all', 'play'),
        'the games. Brief section 4 PLAY: curiosity and experiment.'),
    'atuned_src/ui/account.js': ('settings', ('all', 'information'),
        'the account area, reached from the profile button. No tab.'),
    'atuned_src/ui/plans.js': ('settings', ('all', 'information'),
        'the tier ladder under Billing in the account area.'),
    'atuned_src/ui/auth.js': ('settings', ('all', 'status'),
        'sign in against the server: what came back, and what failed.'),
    'atuned_src/ui/practitioner.js': ('prac', ('all', 'information'),
        'the Clients sketch. Practitioner is a section and not a station.'),
    # shared, opened from every tab
    'atuned_src/ui/drills.js': (None, ('split',),
        'the drill panel, opened from every element that carries data. '
        'COPY.md lists drills under both definition and reading.'),
    'atuned_src/ui/component.js': (None, ('split',),
        'shared widgets: the pill and ring, status(), startHTML.'),
    'atuned_src/ui/panels.js': (None, ('split',),
        'the controls, the sheet and the left rail.'),
    'atuned_src/ui/personas.js': (None, ('split',),
        'the matrix and the profile picker.'),
    'atuned_src/ui/tip.js': (None, ('all', 'tooltip'), 'the one tooltip.'),
    'atuned_src/ui/sound.js': (None, ('all', 'status'),
        'the seat tone and the voice: what the speech engine could not do.'),
    # before the instrument
    'atuned_src/ui/onboard.js': (None, ('all', 'information'),
        'the first card. It says what the instrument is and what it does.'),
    'atuned_src/ui/tutorial.js': (None, ('split',),
        'the day one tutorial walks every station, so a prompt in it is not '
        'assigned one.'),
    'atuned_src/ui/login.js': (None, ('all', 'information'),
        'the return door, after the funnel.'),
    'atuned_src/shell/body.html': (None, ('split',),
        'the static shell: bar, sheet, noscript.'),
    'atuned_src/shell/guard.html': (None, ('all', 'status'),
        'the boot guard. It speaks only when a build did not start.'),
    # the engine. Only the files that hand a person a sentence.
    'atuned_src/engine/schema.js': (None, ('all', 'status'),
        'validateProfile refusals, read out by importError().'),
    'atuned_src/engine/profiles.js': (None, ('all', 'status'),
        'profile refusals.'),
    'atuned_src/engine/outbox.js': (None, ('all', 'status'),
        'the four states of a queued message.'),
    'atuned_src/engine/undo.js': (None, ('all', 'status'),
        'what the undo arrow says it will take back.'),
    'atuned_src/engine/plan.js': ('settings', ('all', 'information'),
        'the tiers and the allowance, read by Billing and the release.'),
    'atuned_src/engine/ladder.js': (None, ('all', 'notification'),
        'marks earned on the way through. Brief section 5 Notifications and '
        'Microcopy: a line that arrives when something happened.'),
    'atuned_src/engine/intake.js': ('iq', ('all', 'discovery'),
        'the 63 questions, as data.'),
    'atuned_src/engine/verp.js': (None, ('all', 'discovery'),
        'the six gates, written as what a person reports: "I was present '
        'with the sensation." A self report option is a discovery prompt.'),
    'atuned_src/engine/sniff.js': (None, ('all', 'mirror'),
        'why the sniffer seated a word where it did: evidence for a reading.'),
    'atuned_src/engine/numerology.js': (None, ('all', 'information'),
        'what each of the six numbers means.'),
    'atuned_src/engine/birth.js': (None, ('split',),
        'the birth derived states, and the refusals where one is not built.'),
    'atuned_src/engine/avatar.js': (None, ('split',), 'the purpose map.'),
    'atuned_src/engine/compute.js': (None, ('split',), 'the arithmetic core.'),
    # the funnel
    'funnel/index.html': (None, ('all', 'information'),
        'the landing page. Brief section 5: landing, high somatic resonance.'),
    'funnel/about.html': (None, ('all', 'information'),
        'what the instrument is and how it works.'),
    'funnel/buy.html': (None, ('all', 'information'), 'the tiers, for money.'),
    'funnel/faq.html': (None, ('all', 'information'),
        'the questions page: ten asked before a person starts, answered with what the build does.'),
    'funnel/quiz.html': (None, ('stage', 'discovery'),
        'the web quiz: the door, the questions and the ring\'s reading.'),
    'funnel/questions.js': (None, ('all', 'discovery'),
        'a hundred items, each a physical event a person recognises.'),
}

# NOT READ BY A PERSON, AND NAMED RATHER THAN SKIPPED. A lexicon a story is
# matched against is the product's input and not its voice: "would not
# listen" in lexicon.js is a phrase the sniffer looks for in what a person
# wrote, and failing it for reading like a sentence is the gate lying.
EXCLUDED = {
    'atuned_src/engine/lexicon.js': 'the sniffer\'s match phrases. Input, not copy.',
    'atuned_src/engine/core.js': 'state and the tab tables. No copy.',
    'atuned_src/shell/head.html': 'the stylesheet.',
    'atuned_src/shell/foot.html': 'script tags.',
    'funnel/make-figure.js': 'a build tool for the funnel figure.',
    'funnel/make-ring.js': 'a build tool for the funnel ring.',
    'funnel/ring.js': 'draws the quiz ring. No copy.',
    'funnel/words.js': 'the quiz\'s word list for the sniffer. Input, not copy.',
}

# BUILD PRODUCTS ARE NEVER READ. They are made from the sources this reads.
BUILD_PRODUCTS = ('source.html', 'engine.js', 'atuned-slim.html',
                  'atuned-packed.html', os.path.join('funnel', 'dist'))

# Under a mixed file, the function decides. (file, function pattern, layer).
FUNCS = [
    ('atuned_src/ui/drills.js', r'^(?:rdAge|AGE)', 'quoted',
     'the age ladder drill prints the owner\'s own worked story.'),
    ('atuned_src/ui/tutorial.js', r'(?i)release', 'flow',
     'the tutorial\'s release step.'),
    ('atuned_src/ui/knowledge.js', r'(?i)(?:card|deck)', 'flow',
     'the Letting Go Deck: cards a person reads aloud to release a charge.'),
    ('atuned_src/ui/avatarui.js', r'^AV_ASK$', 'discovery',
     'the avatar\'s questions: "Where did the pressure sit in your body?" '
     'Brief section 4 DISCOVER, word for word in places.'),
    ('atuned_src/ui/avatarui.js', r'(?i)(?:ritual|practice)', 'embody',
     'the avatar\'s hand off to practice.'),
    ('atuned_src/ui/component.js', r'^STARTD$', 'discovery',
     'the four doors where a person starts. COPY.md puts the instruction '
     'bucket here; brief section 9 makes the start screen a discovery screen.'),
    ('atuned_src/ui/panels.js', r'^helpSheet$', 'information',
     'the Help sheet: how the controls move, opened on purpose.'),
]

# Under a file that branches on a step, the step decides. The tutorial walks
# the storyboard in DESIGN-onboarding-narrative.md one card at a time, and
# each card is a station, read off the card's own title in tutRender.
BRANCHES = {
    'atuned_src/ui/tutorial.js': ('tutRender', r'\bs===(\d)\b', {
        '0': ('discovery', 'tutorial card 0, "something from your journal"'),
        '1': ('mirror', 'tutorial card 1, "What this found"'),
        '2': ('information', 'tutorial card 2, "How it runs through you"'),
        '3': ('flow', 'tutorial card 3, "Release"'),
        '4': ('flow', 'tutorial card 4, "Flow"'),
    }),
}
_BRANCH_CACHE = {}


def branch_at(rt, rel, func, pos):
    spec = BRANCHES.get(rel)
    if not spec or pos is None or func != spec[0]:
        return None
    if rel not in _BRANCH_CACHE:
        try:
            src = open(os.path.join(rt, rel), encoding='utf-8').read()
        except OSError:
            src = ''
        _BRANCH_CACHE[rel] = [(m.start(), m.group(1)) for m in re.finditer(spec[1], src)]
    marks = _BRANCH_CACHE[rel]
    i = bisect.bisect_right([p for p, _ in marks], pos) - 1
    if i < 0:
        return None
    return spec[2].get(marks[i][1])

# Under engine/data, the table decides. (file, table) -> (layer, why).
DATA_DEFAULT = ('information',
                'a reference table: what a thing is and how it works.')
TABLES = {
    # NOT A TOOLTIP, AND THE FIRST CUT SAID IT WAS. The brief's tooltip is
    # TERM to SIMPLE MEANING and GLOSS looks like that table, so it was put
    # in the tooltip layer and fifty of its rows failed one idea per tooltip.
    # Read before trusting: knowledge.js renders GLOSS as a row on Knowledge
    # and nowhere else, so it is explained and not hovered.
    ('atuned_src/engine/data/kb.js', 'GLOSS'): ('information',
        'the glossary, read as a row on Knowledge, never hovered. Brief section '
        '14 would also put a one sentence version in a tooltip.'),
    ('atuned_src/engine/data/cards.js', None): ('flow',
        'the letting go cards: the release protocol, read aloud.'),
    ('atuned_src/engine/data/practice.js', 'PRACTICE'): ('embody',
        'practices. Brief section 4 EMBODY: practice the new response.'),
    ('atuned_src/engine/data/practice.js', 'BECOMING'): ('embody',
        'who a person is becoming. Brief section 4 EMBODY.'),
    ('atuned_src/engine/data/practice.js', 'TEACHER_PRACTICE'): ('embody',
        'practices. Brief section 4 EMBODY.'),
    ('atuned_src/engine/data/people.js', 'PEOPLE'): (QUOTED,
        'the six reference people\'s own words.'),
    ('atuned_src/engine/data/ages.js', 'AGE_WORKED'): (QUOTED,
        'the owner\'s own worked story.'),
    ('atuned_src/engine/data/catalog.js', None): ('information',
        'what each seat stores, as anatomy.'),
}

# A sentence opening on one of these is a prompt. The brief's own verbs from
# section 4 and section 5 Buttons first, then the ones the product already
# uses for an instruction (COPY.md bucket 5, "the verb is the first word").
IMPERATIVE = set('''
explore notice continue release integrate reflect practice embody say do take
stay let try write press open run pick choose add read drag turn keep go start
stop put sit look find name record type speak tap hold set move follow use
enter save switch come see tell ask answer check mark breathe imagine picture
give count list bring feel listen repeat return close compare draw deal flip
leave skip upload download export import copy print begin build fill clear
'''.split())

READING = re.compile(r"\b(?:you|your|yours|you're|you’re|you've|you’ve)\b|\{x\}", re.I)


def is_prompt(t):
    s = t.strip()
    if s.endswith('?'):
        return True
    w = re.findall(r"[A-Za-z']+", s)
    return bool(w) and w[0].lower() in IMPERATIVE


def is_reading(t):
    return bool(READING.search(t))


# ------------------------------------------------------------- the extractor
#
# A REAL LEXER, because the cheap walk lied twice already in this directory:
# an apostrophe in a double quoted definition opened a span that ran to the
# next one, and a comment collapsed to a space put every finding fifty lines
# early. This one knows comments, all three quotes, template holes and regex
# literals, and every position it hands back is the real one.

REGEX_BEFORE = set('(,=:[!&|?{};+-*%<>~^')
REGEX_WORDS = {'return', 'typeof', 'case', 'do', 'else', 'in', 'of', 'new',
               'delete', 'void', 'throw', 'yield', 'await'}


def lex_js(src):
    """[(start, end, quote, body)] for every string literal in src."""
    out = []
    i, n = 0, len(src)
    prev = ''        # last significant character outside strings and comments
    prevword = ''
    while i < n:
        c = src[i]
        if c == '/' and src.startswith('//', i):
            j = src.find('\n', i)
            i = n if j < 0 else j
            continue
        if c == '/' and src.startswith('/*', i):
            j = src.find('*/', i + 2)
            i = n if j < 0 else j + 2
            continue
        if c in '\'"`':
            j = i + 1
            parts = []
            k = j
            while j < n and src[j] != c:
                if src[j] == '\\':
                    j += 2
                    continue
                if c == '`' and src.startswith('${', j):
                    parts.append(src[k:j] + '{x}')
                    depth = 1
                    j += 2
                    while j < n and depth:
                        if src[j] == '{':
                            depth += 1
                        elif src[j] == '}':
                            depth -= 1
                        j += 1
                    k = j
                    continue
                if src[j] == '\n' and c != '`':
                    break
                j += 1
            parts.append(src[k:j])
            out.append((i, min(j + 1, n), c, ''.join(parts)))
            i = j + 1
            prev, prevword = c, ''
            continue
        if c == '/':
            if prev == '' or prev in REGEX_BEFORE or prevword in REGEX_WORDS:
                j = i + 1
                incls = False
                while j < n:
                    ch = src[j]
                    if ch == '\\':
                        j += 2
                        continue
                    if ch == '[':
                        incls = True
                    elif ch == ']':
                        incls = False
                    elif ch == '/' and not incls:
                        break
                    elif ch == '\n':
                        break
                    j += 1
                j += 1
                while j < n and src[j].isalpha():
                    j += 1
                i = j
                prev, prevword = 'r', ''
                continue
        if not c.isspace():
            if c.isalnum() or c in '_$':
                m = re.match(r'[\w$]+', src[i:i + 64])
                prevword = m.group(0)
                prev = prevword[-1]
                i += len(prevword)
                continue
            prev, prevword = c, ''
        i += 1
    return out


COMMENT = re.compile(r'/\*.*?\*/|//[^\n]*', re.S)


def unescape(s):
    def u(m):
        x = m.group(1)
        if x.startswith('u'):
            try:
                return chr(int(x[1:], 16))
            except ValueError:
                return x
        if x.startswith('x'):
            try:
                return chr(int(x[1:], 16))
            except ValueError:
                return x
        return {'n': ' ', 't': ' ', 'r': ''}.get(x, x)
    return re.sub(r'\\(u[0-9a-fA-F]{4}|x[0-9a-fA-F]{2}|.)', u, s)


GLUE_EXPR = re.compile(r'^\s*\+\s*(?:[^;,\n{}]|\([^;{}]*\)){1,120}?\s*\+\s*$', re.S)


def chains(src):
    """Literals joined back into the strings a person reads.

    'a '+x+' b' is one string, "a {x} b", because the copy in this product is
    built by concatenation and a rule that reads the pieces reads nothing a
    person sees. A ternary breaks the chain, and each arm stands alone."""
    toks = lex_js(src)
    out = []
    cur = None
    for k, (s, e, q, body) in enumerate(toks):
        after = src[e:e + 40]
        if re.match(r'\s*:', after) and q != '`':
            # a key, not a value
            if cur:
                out.append(cur)
                cur = None
            continue
        if cur is not None:
            between = COMMENT.sub('', src[cur['end']:s])
            if re.fullmatch(r'\s*\+\s*', between):
                cur['text'] += body
                cur['end'] = e
                continue
            if GLUE_EXPR.match(between):
                cur['text'] += '{x}' + body
                cur['end'] = e
                continue
            out.append(cur)
        pre = COMMENT.sub('', src[max(0, s - 160):s])
        lead = '{x}' if re.search(r'[\w)\]]\s*\+\s*$', pre) else ''
        cur = {'start': s, 'end': e, 'text': lead + body, 'pre': pre}
    if cur:
        out.append(cur)
    for c in out:
        tail = COMMENT.sub('', src[c['end']:c['end'] + 40])
        if re.match(r'\s*\+\s*[\w(]', tail):
            c['text'] += '{x}'
        c['post'] = tail
        c['text'] = unescape(c['text'])
    return out


# ---- the markup inside a string

INLINE = {'b', 'i', 'em', 'strong', 'u', 'small', 'sup', 'sub', 'code', 'br',
          'wbr', 'abbr', 'mark', 's', 'q', 'cite', 'kbd', 'time'}
VOID = {'br', 'img', 'input', 'hr', 'meta', 'link', 'wbr', 'source', 'path',
        'circle', 'rect', 'line', 'use', 'stop', 'polyline', 'polygon',
        'ellipse', 'area', 'col', 'base', 'embed', 'param', 'track'}
LABEL_TAGS = {'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'legend', 'summary', 'th',
              'dt', 'label', 'option', 'text', 'tspan', 'caption', 'figcaption'}
LABEL_CLS = re.compile(r'(?:^|[\s_-])(?:eye|eyebrow|hd|lbl|label|lab|kicker|'
                       r'ttl|title|cap|nm|name|head|h)(?:$|[\s_-])')
MENU_CLS = re.compile(r'(?:^|[\s_-])(?:tab|tabs|tabtop|sec|secb|lsec|nav|seg|chip|opt|'
                      r'tog|toggle|pill|filter|grp|group|theme|vt)(?:$|[\s_-])')
BTN_CLS = re.compile(r'(?:^|[\s_-])(?:btn|button|cta|go)(?:$|[\s_-])')
TAG = re.compile(r'<\s*(/?)\s*([a-zA-Z][\w-]*)((?:[^<>"\']|"[^"]*"|\'[^\']*\')*)>')
ATTR_COPY = re.compile(r'(?:^|\s)(title|data-tip|data-tip-t|data-tip-a|aria-label|'
                       r'placeholder|alt)\s*=\s*(?:"([^"]*)"|\'([^\']*)\')')


def attrs_of(a):
    d = {}
    for m in re.finditer(r'([\w-]+)\s*=\s*(?:"([^"]*)"|\'([^\']*)\')', a):
        d[m.group(1).lower()] = m.group(2) if m.group(2) is not None else m.group(3)
    for m in re.finditer(r'(?:^|\s)(aria-selected|role|disabled)(?=\s|$)', a):
        d.setdefault(m.group(1), '')
    return d


def tidy(t):
    t = re.sub(r'&nbsp;|&#160;', ' ', t)
    t = re.sub(r'&amp;', '&', t)
    t = re.sub(r'&[lg]t;', ' ', t)
    t = re.sub(r'&rsquo;|&#8217;', '’', t)
    t = re.sub(r'&[a-z]+;|&#\d+;', ' ', t)
    return ' '.join(t.split())


def walk_markup(text):
    """[(offset, shape, text, info)] for the copy inside a run of markup.

    shape is button, menu, label, tooltip, placeholder or text. Inline tags
    do not break a sentence; anything else does, which is how a reader sees
    it: a <b> inside a paragraph is one line and a <div> is a new one."""
    out = []
    # a fragment that opens mid attribute, after an expression the chain
    # could not glue, starts at its first close of a tag
    lt, gt = text.find('<'), text.find('>')
    if gt >= 0 and (lt < 0 or gt < lt) and re.search(r'["=]', text[:gt]):
        text = ' ' * (gt + 1) + text[gt + 1:]
    stack = []
    run, run_at = [], None

    def shape_of():
        for tag, a in reversed(stack):
            cls = a.get('class', '')
            if tag == 'button' or a.get('role') == 'button' or \
                    (tag == 'a' and BTN_CLS.search(cls)):
                # COPY.md bucket 1: "A place you can go. Tabs, rail sections,
                # tab strips." A press that stays pressed is a place too.
                if a.get('role') == 'tab' or 'aria-selected' in a or \
                        'aria-pressed' in a or MENU_CLS.search(cls) or \
                        any(k.startswith(('data-tab', 'data-sec')) for k in a):
                    return 'menu', tag, cls
                return 'button', tag, cls
        for tag, a in reversed(stack):
            if tag in INLINE or (tag == 'span' and not a.get('class')):
                continue
            cls = a.get('class', '')
            if tag in LABEL_TAGS:
                return 'label', tag, cls
            if cls and (set(cls.split()) & LABEL_SET or LABEL_CLS.search(cls)):
                return 'label', tag, cls
            if tag == 'textarea':
                return 'placeholder', tag, cls
            return 'text', tag, cls
        return 'text', '', ''

    def flush():
        nonlocal run, run_at
        t = tidy(''.join(run))
        if t:
            sh, tag, cls = shape_of()
            out.append((run_at, sh, t, {'tag': tag, 'cls': cls}))
        run, run_at = [], None

    pos = 0
    for m in TAG.finditer(text):
        chunk = text[pos:m.start()]
        if chunk.strip():
            if run_at is None:
                run_at = pos
            # an inline tag between two pieces of text is a space unless it
            # sits inside a word: "<b>Holding</b><span>A promise" read as
            # "HoldingA promise" and "it,<br>what" as "it,what" until this.
            if run and run[-1][-1:].isalnum() and chunk[:1].isalnum():
                run.append(' ')
            elif run and run[-1][-1:] in ',.;:?!' and chunk[:1].isalpha():
                run.append(' ')
            run.append(chunk)
        elif chunk:
            run.append(' ')
        pos = m.end()
        close, tag, a = m.group(1), m.group(2).lower(), m.group(3)
        for am in ATTR_COPY.finditer(a):
            v = am.group(2) if am.group(2) is not None else am.group(3)
            v = tidy(v)
            if v:
                kind = am.group(1)
                sh = ('tooltip' if kind.startswith(('title', 'data-tip')) else
                      'placeholder' if kind == 'placeholder' else 'label')
                out.append((m.start(), sh, v, {'tag': tag, 'attr': kind}))
        # a link inside a sentence is part of it; a link in a bar is a control
        # of its own, and the landing page's nav read as one string,
        # "What it reads Tiers The test", until a classed or barred link
        # stopped counting as inline
        inline = tag in INLINE or (tag == 'span' and 'class=' not in a) or \
            (tag == 'a' and 'class=' not in a and
             not any(t in ('nav', 'header', 'footer') for t, _ in stack))
        if not inline:
            flush()
        if tag in VOID or a.rstrip().endswith('/'):
            continue
        if close:
            for k in range(len(stack) - 1, -1, -1):
                if stack[k][0] == tag:
                    del stack[k:]
                    break
        else:
            stack.append((tag, attrs_of(a)))
    tail = text[pos:]
    if tail.strip():
        if run_at is None:
            run_at = pos
        run.append(tail)
    flush()
    return out


LABEL_SET = set()


# ---- what counts as a string a person reads

CODEISH = re.compile(r'^[\w.#:/-]+$|^[#.]?[a-z][\w-]*(?:\s+[#.]?[a-z][\w-]*)*$')


def is_copy(t, shaped, stem=False):
    """True when t reads as words, not code. A shaped string (a button, a
    label, a tooltip, a status line) may be short; a bare literal must look
    like a sentence, which is check.py's own test for prose."""
    bare = t.replace('{x}', ' ').strip()
    if not re.search(r'[A-Za-z]{2}', bare):
        return False
    if re.search(r'[{};=]|\bpx\b|\.js\b|\bvar\(|\bfunction\b|=>|&&|\|\|', bare):
        return False
    if shaped:
        if re.search(r'[A-Z]', bare) or ' ' in bare:
            return True
        # a lower case single token in a shaped slot is usually a class or a
        # key; a lower case word in a button is still a word
        return False
    # A SENTENCE STEM IS COPY. REL_ENTRY is "I let go of " and the address is
    # added at run time, so the literal is twelve characters and check.py's
    # prose test, fourteen and up, never saw the one string the brief names
    # as wrong. A literal of two words or more that ends on a space is the
    # front half of a sentence.
    if stem and len(bare) >= 6 and re.search(r'[A-Za-z]+ [a-z]+', bare):
        return True
    if len(bare) < 14 or not re.search(r'[a-z] [a-z]', bare):
        return False
    if CODEISH.match(bare) and not re.search(r'[.?!,]', bare):
        return False
    return True


SINKS = [
    ('status', re.compile(r'\bstatus\(\s*$')),
    ('error', re.compile(r'\bnew\s+(?:Type|Range)?Error\(\s*$|\bimportError\(\s*$')),
    ('tooltip', re.compile(r'(?:\.title\s*=|setAttribute\(\s*[\'"](?:title|data-tip'
                           r'(?:-t|-a)?)[\'"]\s*,)\s*$')),
    ('label', re.compile(r'setAttribute\(\s*[\'"]aria-label[\'"]\s*,\s*$')),
    ('placeholder', re.compile(r'(?:\.placeholder\s*=|setAttribute\(\s*[\'"]'
                               r'placeholder[\'"]\s*,)\s*$')),
    ('text', re.compile(r'\.(?:textContent|innerText)\s*=\s*$')),
]
KEY = re.compile(r'([A-Za-z_$][\w$]*|"[^"\n]+"|\'[^\'\n]+\')\s*:\s*$')
TOPDEF = re.compile(r'^(?:async\s+)?function\s+([\w$]+)|^(?:var|const|let)\s+([\w$]+)'
                    r'|^\s{0,3}([\w$]+)\s*[:=]\s*function\b', re.M)


NOT_COPY_KEYS = {'src', 'from', 'rule', 'cite', 'id', 'cls', 'k', 'key', 'ic', 'css',
                 'kind', 'side', 'icon', 'col', 'color'}


class Unit(dict):
    pass


def owners(src):
    pts = []
    for m in TOPDEF.finditer(src):
        pts.append((m.start(), m.group(1) or m.group(2) or m.group(3)))
    return pts


def owner_at(pts, pos):
    i = bisect.bisect_right([p for p, _ in pts], pos) - 1
    return pts[i][1] if i >= 0 else ''


def line_index(src):
    return [i for i, c in enumerate(src) if c == '\n']


def line_at(nl, pos):
    return bisect.bisect_right(nl, pos - 1) + 1 if pos else 1


def units_js(path, src, line0=0, rel=None):
    rel = rel or path
    nl = line_index(src)
    pts = owners(src)
    out = []
    for c in chains(src):
        pre = c['pre']
        sink = None
        for name, rx in SINKS:
            if rx.search(pre):
                sink = name
                break
        if sink == 'status' and re.match(r"\s*,\s*['\"]fail['\"]", c['post']):
            sink = 'status-fail'
        km = KEY.search(pre)
        key = km.group(1).strip('\'"') if km else ''
        # A COUNTEREXAMPLE IS COPY ABOUT COPY, written to fail, and check.py
        # already knows its shape. Provenance is a record of where a word came
        # from, kept for the engine and never printed.
        if check.COUNTEREXAMPLE.search(pre) or key in NOT_COPY_KEYS:
            continue
        func = owner_at(pts, c['start'])
        line = line0 + line_at(nl, c['start'])
        text = c['text']

        def at(t):
            """The line the words themselves are on, not the line the
            concatenation starts on. A drill is one chain fifty lines long,
            and a finding that names its first line sends a writer to the
            wrong string, which this directory has recorded twice."""
            ws = re.findall(r"[A-Za-z][A-Za-z']*", t.replace('{x}', ' '))[:3]
            if not ws:
                return line, c['start']
            m = re.search(r'\b' + r'\W+'.join(re.escape(w) for w in ws),
                          src[c['start']:c['end']])
            if not m:
                return line, c['start']
            p = c['start'] + m.start()
            return line0 + line_at(nl, p), p

        if '<' in text and re.search(r'<\s*/?\s*[a-zA-Z]', text):
            for off, shape, t, info in walk_markup(text):
                if sink in ('status', 'status-fail', 'error'):
                    shape = sink
                if PLACEHOLDER:
                    t = PLACEHOLDER.sub('{x}', t)
                if is_copy(t, shape != 'text'):
                    ln, p = at(t)
                    out.append(Unit(file=rel, line=ln, func=func, key=key,
                                    shape=shape, text=t, info=info,
                                    pos=None if line0 else p))
            continue
        t = tidy(text)
        t = PLACEHOLDER.sub('{x}', t) if PLACEHOLDER else t
        shape = sink or 'text'
        if shape == 'text' and key in ('tip', 'title', 'tt'):
            shape = 'tooltip'
        if is_copy(t, shape != 'text', stem=text.endswith(' ')):
            ln, p = at(t)
            out.append(Unit(file=rel, line=ln, func=func, key=key,
                            shape=shape, text=t, info={},
                            pos=None if line0 else p))
    return out


def blank(s, pat):
    return re.sub(pat, lambda m: re.sub(r'[^\n]', ' ', m.group(0)), s,
                  flags=re.S | re.I)


def units_html(path, src, rel):
    out = []
    # scripts are JS with a line offset; styles, comments and the head are not
    # copy. Everything is blanked to spaces with its newlines kept, so every
    # offset below is the real one.
    for m in re.finditer(r'<script\b([^>]*)>(.*?)</script>', src, re.S | re.I):
        if 'src=' in m.group(1):
            continue
        line0 = src[:m.start(2)].count('\n')
        out += units_js(path, m.group(2), line0, rel)
    body = src
    for pat in (r'<script\b.*?</script>', r'<style\b.*?</style>', r'<!--.*?-->',
                r'<head\b.*?</head>', r'<svg\b.*?</svg>', r'<![^>]*>'):
        body = blank(body, pat)
    nl = line_index(body)
    for off, shape, t, info in walk_markup(body):
        if is_copy(t, shape != 'text'):
            out.append(Unit(file=rel, line=line_at(nl, off), func='', key='',
                            shape=shape, text=t, info=info))
    return out


def relpath(rt, p):
    return os.path.relpath(os.path.abspath(p), rt).replace(os.sep, '/')


def is_build_product(rel):
    return any(rel == b or rel.startswith(b.replace(os.sep, '/') + '/')
               for b in BUILD_PRODUCTS)


def placeholders(rt):
    """Tokens the code swaps for a value before a person sees the string.

    intake.js writes "how often do you STEM?" and replaces STEM with a verb,
    so the caps gate reading STEM is reading a slot. The tokens are read off
    every .replace() in the source at run time, never typed here."""
    toks = set()
    for d in ('atuned_src', 'funnel'):
        for dp, dirs, fs in os.walk(os.path.join(rt, d)):
            dirs[:] = [x for x in dirs if x != 'dist']
            for f in fs:
                if not f.endswith(('.js', '.html')):
                    continue
                try:
                    s = open(os.path.join(dp, f), encoding='utf-8').read()
                except OSError:
                    continue
                for m in re.finditer(r"\.replace\(\s*(?:'([A-Z][A-Z_]{2,})'"
                                     r"|/([A-Z][A-Z_]{2,})/g?)", s):
                    toks |= set(x for x in m.groups() if x)
    return toks


PLACEHOLDER = None


def harvest(rt, targets):
    """Every user facing string under the targets, with where it lives."""
    global PLACEHOLDER
    lab, _ = check.sheet_classes(rt)
    LABEL_SET.clear()
    LABEL_SET.update(lab)
    toks = placeholders(rt)
    PLACEHOLDER = re.compile(r'\b(?:%s)\b' % '|'.join(sorted(toks))) if toks else None
    files = []
    for t in targets:
        if os.path.isdir(t):
            for d, dirs, fs in os.walk(t):
                dirs[:] = sorted(x for x in dirs if not is_build_product(
                    relpath(rt, os.path.join(d, x))))
                for f in sorted(fs):
                    files.append(os.path.join(d, f))
        else:
            files.append(t)
    out, skipped = [], {}
    for f in files:
        rel = relpath(rt, f)
        if is_build_product(rel):
            skipped[rel] = 'a build product'
            continue
        if rel in EXCLUDED:
            skipped[rel] = EXCLUDED[rel]
            continue
        if not f.endswith(('.js', '.html')):
            continue
        try:
            src = open(f, encoding='utf-8').read()
        except OSError:
            continue
        if f.endswith('.html'):
            out += units_html(f, src, rel)
        else:
            out += units_js(f, src, 0, rel)
    return out, skipped


# ---------------------------------------------------------- the classifier

# A status line written without status(), which the quiz and the account area
# both do: what just happened to a write, said in its first word.
STATUS_TEXT = re.compile(r'^(?:Saved|Copied|Not saved|Not copied|Could not|Couldn.t|'
                         r'Nothing (?:saved|copied|committed|released|deleted|was)|'
                         r'Failed|Loaded|Deleted|Removed|Sent|Queued|Committed|'
                         r'Recording)\b')


def classify(rt, u):
    """Sets u['layer'], u['mode'] and u['why']. Never guesses."""
    rel = u['file']
    spec = FILES.get(rel)
    host = spec[0] if spec else None
    u['mode'] = mode_of(rt, host)
    sh = u['shape']
    if sh in ('status', 'status-fail', 'error'):
        u['layer'] = 'status'
        u['why'] = {'status': 'an argument to status()',
                    'status-fail': 'a status() failure',
                    'error': 'a thrown or imported error'}[sh]
        return u
    if sh == 'tooltip':
        u['layer'], u['why'] = 'tooltip', 'a title or data-tip on an element'
        return u
    if sh == 'button':
        u['layer'], u['why'] = 'button', 'text inside a button'
        return u
    if sh == 'menu':
        u['layer'], u['why'] = 'button', 'a tab or a segment: a menu button'
        return u
    if sh == 'label':
        if check.words(u['text']) < 8:
            u['layer'], u['why'] = 'label', 'a heading, eyebrow or label element'
            return u
    if STATUS_TEXT.match(u['text']) and check.words(u['text']) <= 20:
        u['layer'], u['why'] = 'status', 'it reports what just happened to a write'
        return u
    if re.search(r'(?i)notif|remind', u['func']):
        u['layer'], u['why'] = 'notification', 'written in %s' % u['func']
        return u
    br = branch_at(rt, rel, u['func'], u.get('pos'))
    if br:
        u['layer'], u['why'] = br
        return u
    for f, rx, layer, why in FUNCS:
        if f == rel and re.search(rx, u['func'] or ''):
            u['layer'], u['why'] = layer, why
            return u
    if '/engine/data/' in '/' + rel:
        tab = u['func']
        hit = TABLES.get((rel, tab)) or TABLES.get((rel, None))
        layer, why = hit if hit else DATA_DEFAULT
        u['layer'], u['why'] = layer, '%s in %s' % (tab or 'a table', why)
        return u
    if not spec:
        u['layer'], u['why'] = UNCLASSIFIED, 'no entry for this file in FILES'
        return u
    rule = spec[1]
    if rule[0] == 'all':
        u['layer'], u['why'] = rule[1], spec[2]
    elif is_prompt(u['text']) or sh == 'placeholder':
        if rule[0] == 'stage':
            u['layer'], u['why'] = rule[1], 'a prompt, in a file whose prompts are %s' % rule[1]
        else:
            u['layer'], u['why'] = UNCLASSIFIED, ('a prompt in a shared file: '
                                                 'which station it serves cannot '
                                                 'be told from where it lives')
    elif is_reading(u['text']):
        u['layer'], u['why'] = 'mirror', 'it speaks to the person or carries a run time value'
    else:
        u['layer'], u['why'] = 'information', 'it neither prompts nor addresses the person'
    return u


# ---------------------------------------------------------------- helpers

def sents(t):
    t = t.replace('{x}', 'X')
    return [s.strip() for s in re.split(r'(?<=[.!?])\s+', t) if re.search(r'[A-Za-z]', s)]


# check.py's negator guard reads "do not" and "won't" and not the other
# contractions, and the brief's own integration line, "You don't have to
# erase what happened to stop reliving it", was flagged by the first cut of
# the release rule for exactly that. Added here and not there, so the house
# gate's behaviour does not move.
CONTRACTED = re.compile(r"\b(?:don.t|doesn.t|didn.t|isn.t|aren.t|can.t|never have to|"
                        r"no need to|not have to)\b[^.?!]{0,40}$", re.I)


def negated(t, start):
    w = t[max(0, start - 40):start]
    return bool(check.NEGATORS.search(w) or CONTRACTED.search(w))


def find(rx, t, guard=True):
    """[(start, match)] not refused by a negator in front of it."""
    out = []
    for m in rx.finditer(t):
        if guard and negated(t, m.start()):
            continue
        out.append(m)
    return out


QUALIFIER = re.compile(r'\b(?:may|might|could|can|appears?|seems?|likely|possibly|'
                       r'perhaps|suggests?|reads? as|if|whether|probably|often|'
                       r'sometimes|tends? to|exploring|testing|hypothes\w*)\b', re.I)
REPORTED = re.compile(r'\b(?:you|your)\s+(?:said|wrote|reported|entered|named|picked|'
                      r'chose|described|answered|marked|typed|recorded|told|own words|'
                      r'story|stories)\b|\bwhat you (?:wrote|said|entered)\b', re.I)

# ---- syllables, transparent on purpose

def syllables(w):
    """An estimate, and it says so. Vowel groups, less a silent final e.

    Checked by test_brief.py against a hand counted list before it was
    trusted. It will miscount some words; a grade off it is a pointer."""
    w = re.sub(r"[^a-z]", '', w.lower())
    if not w:
        return 0
    if len(w) <= 3:
        return 1
    # the silent e inside a compound: some-thing, any-one, home-work. The
    # brief's own fifteenth-section question read grade 13.5 with "something"
    # counted as three syllables four times over, and 9.8 once it was two.
    w = re.sub(r'^(some|where|there|here|home|life|time|care|whole|base|fire|love|'
               r'one|more|like|safe|wise|side|state)(?=[a-z]{3,})',
               lambda m: m.group(1)[:-1], w)
    w = re.sub(r'(?:[^laeiouy]es|[^laeiouy]ed|[^laeiouy]e)$', '', w)
    w = re.sub(r'^y', '', w)
    return max(1, len(re.findall(r'[aeiouy]{1,2}', w)))


def readability(t):
    """Flesch Kincaid grade, with its two halves shown.

    grade = 0.39 x words per sentence + 11.8 x syllables per word - 15.59.
    The first term is the sentence, the second is the words. Reporting the
    two apart is the point: "grade 13" tells a writer nothing, "the words
    add 9, the sentence adds 4, and the long words are these" tells them what
    to cut."""
    ss = sents(t) or [t]
    ws = [w for s in ss for w in re.findall(r"[A-Za-z][A-Za-z'’-]*", s)]
    if not ws:
        return None
    sy = [syllables(w) for w in ws]
    wps = len(ws) / float(len(ss))
    spw = sum(sy) / float(len(ws))
    sent_part = 0.39 * wps
    word_part = 11.8 * spw - 15.59
    hard = sorted({w.lower() for w, n in zip(ws, sy) if n >= 3},
                  key=lambda x: (-syllables(x), x))
    return {'grade': round(sent_part + word_part, 1), 'words': len(ws),
            'sentences': len(ss), 'wps': round(wps, 1), 'spw': round(spw, 2),
            'sentence_part': round(sent_part, 1), 'word_part': round(word_part, 1),
            'hard': hard}


# ------------------------------------------------------------------ rules
#
# Each rule: an id, the brief section it comes from, the layers it reads, a
# line that fails it and the line that fixes it, and a check. A check returns
# [(severity, matched, note)]. Where a fail line is the brief's own "Avoid"
# example, it is quoted from the brief; where it is the product's, it carries
# its file.

RULES = []


def rule(**kw):
    def deco(fn):
        kw['check'] = fn
        RULES.append(kw)
        return fn
    return deco


PROSE = {'tooltip', 'information', 'mirror', 'discovery', 'play', 'flow',
         'embody', 'notification', 'status', 'metric'}
ALL = PROSE | {'label', 'button', UNCLASSIFIED}

# -- 1. release language

LETGO_CHARGE = re.compile(r'\blet(?:ting|s)?\s+(?:go\s+of\s+(?:the|this|that|your|its|a)\s+charge'
                          r'|(?:the|this|that|your)\s+charge\s+go)\b', re.I)
LETGO = re.compile(r'\b(?:let(?:ting|s)?\s+(?:it\s+|them\s+|that\s+|this\s+)?go(?:\s+of)?)\b', re.I)
OTHER_RELEASE = re.compile(r'\b(?:dissolv\w*|clear\w*|discharg\w*|drop\w*|shed\w*|purg\w*|'
                           r'heal\w*|process\w*|flush\w*)\s+(?:the|this|that|your)\s+charges?\b',
                           re.I)
ERASE = re.compile(r'\b(?:eras\w*|delet\w*|wip\w*|forget\w*)\s+(?:the|your|that|this|what)\s+'
                   r'(?:memory|memories|past|happened)\b', re.I)


@rule(id='release-language', sec='4 FLOW, 1, 11', layers=ALL,
      title='Release the charge. Never let go of it.',
      fail='Let go of the charge.', fix='Release the charge.',
      why='"Canonical language: use release the charge, not let go of the charge." '
          'And section 11: "The memory stays. The charge changes."')
def _release(u):
    t = u['text']
    out = []
    for m in find(LETGO_CHARGE, t):
        out.append(('stop', m.group(0), 'the brief names this exact phrase as the one not to use.'))
    if not out:
        for m in find(LETGO, t):
            out.append(('flag', m.group(0),
                        'brief section 4: release, not let go. This collides with ruled '
                        'protocol wording ("I am letting go of believing", DECISIONS.md), '
                        'so it is an owner question before it is an edit.'))
            break
    for m in find(OTHER_RELEASE, t):
        out.append(('flag', m.group(0), 'one verb for the mechanic: release the charge.'))
        break
    for m in find(ERASE, t):
        out.append(('flag', m.group(0), 'the memory stays. The charge changes.'))
        break
    return out

# -- 2. buttons

BUTTON_VERBS = set('''
explore notice continue release integrate reflect practice embody
save delete remove close open back next previous cancel done start begin stop
pause play resume restart commit record speak write add edit copy export
import download upload print undo redo sign log create search find clear
reset show hide view see read load switch choose pick select try retry keep
skip upgrade buy pay send share grant revoke turn run rerun deal draw flip
mark name set change move go enter join leave return finish complete test
check listen hear say drop pin unpin expand collapse zoom rotate sort filter
compare replay hold accept decline agree allow deny confirm apply build fill
empty get take tell ask answer type use give paste attach invite remember
forget order follow plan practise fold unfold spin
'''.split())
INFLATED = re.compile(r'\b(?:unlock\w*|(?:full|true|hidden)\s+potential|transform\w*|'
                      r'journey|begin\s+your|start\s+your|discover\s+your\s+(?:true|real|best)|'
                      r'level\s+up|supercharg\w*|empower\w*|unleash\w*|awaken\w*|'
                      r'claim\s+your|ignite\w*|elevate\s+your|limitless|life[- ]chang\w*)\b', re.I)
GENERIC = re.compile(r'^(?:click here|learn more|submit|ok|okay|go|yes|no|here)$', re.I)


def label_words(t):
    t = re.sub(r'\{x\}', ' ', t)
    t = re.sub(r'[^\w\s\'’-]', ' ', t)
    return t.split()


@rule(id='button-verb', sec='5 Buttons', layers={'button'},
      title='A button is a short verb.',
      fail='Begin Your Transformational Journey', fix='Begin',
      why='"Prefer short verbs: Explore, Notice, Continue, Release, Integrate, '
          'Reflect, Practice, Embody. Avoid inflated calls to action."')
def _button(u):
    t = u['text']
    out = []
    m = INFLATED.search(t)
    if m:
        out.append(('stop', m.group(0), 'an inflated call to action, the brief\'s own example.'))
    ws = label_words(t)
    if not ws:
        return out
    if len(ws) > 4:
        out.append(('flag', t, 'a button is a short verb. This is %d words.' % len(ws)))
    if re.search(r'[.!]\s*$', t.replace('{x}', '')):
        out.append(('flag', t, 'a sentence on a button. Name the action and stop.'))
    if len(ws) > 2 and sum(1 for w in ws[1:] if w[:1].isupper() and w.lower() not in
                           ('i',) and not w.isupper()) >= max(1, len(ws) - 1) and \
            ws[0][:1].isupper():
        out.append(('flag', t, 'title case on a button. Sentence case.'))
    if GENERIC.match(' '.join(ws)):
        out.append(('flag', t, 'says nothing about what happens. COPY.md: never "click here".'))
    if u['shape'] == 'button' and ws[0].lower() not in BUTTON_VERBS and not out:
        out.append(('review', ws[0],
                    'Does this control do one thing? If so, which verb names it, from '
                    'the brief\'s list or one the product already uses?'))
    return out

# -- 3. mirror language

ID_SKIP = set('''
about above after at all also among around as at away back before behind
being below beside between beyond by close done down each else even ever far
for free from given going here in inside into just left like logged looking
near new next not now of off on one only onto out outside over past ready
reading right set shown signed so still such than that the there these they
this those through to too under up using using viewing welcome what when
where which who with within without yet asked able sent offered invited
seated placed holding carrying taking writing running welcome likely unlikely
currently already always born made somewhere someone something with
'''.split())
IDENTITY = re.compile(r"\b(you\s+are|you're|you’re|you\s+were\s+born)\s+"
                      r"((?:(?:a|an|so|very|too|really|basically|naturally|deeply|"
                      r"fundamentally|inherently|clearly|simply|truly|just)\s+)*)([a-z][a-z-]+)", re.I)
WHO = re.compile(r"\b(?:this is who you are|who you really are|who you truly are|"
                 r"your true (?:self|nature)|the kind of person (?:who|that) you are|"
                 r"you are the kind of person|you(?:'re| are) the type)\b", re.I)


# NOT IN DISCOVERY. A discovery item is offered for the person to accept or
# refuse, "You are early, ready, and furious at everybody slower", which is
# the agency the brief asks for. The same sentence spoken as a reading is a
# verdict. Checked against funnel/questions.js, which SKILL.md holds up as the
# model, before it was trusted: it fired on five of its items until this line.
@rule(id='mirror-identity', sec='5 Summary / Mirror, Mirror Language',
      layers=PROSE - {'discovery'},
      title='Describe what is happening. Never tell a person who they are.',
      fail='You are afraid of confrontation.',
      fix='You may be avoiding confrontation because something about the outcome feels unsafe.',
      why='"Never make deterministic claims about identity. Never tell the user who they '
          'are." The fail and the fix are the brief\'s own Avoid and Prefer.')
def _identity(u):
    out = []
    t = u['text']
    for m in find(WHO, t):
        out.append(('flag', m.group(0), 'tells the person who they are.'))
    for m in IDENTITY.finditer(t):
        w = m.group(3).lower()
        if w in ID_SKIP or w.endswith(('ing', 'ly')):
            continue
        if re.search(r'\b(?:may|might|could|if|when|once|until|while|after|before|unless)\b',
                     t[max(0, m.start() - 30):m.start()], re.I):
            continue
        if negated(t, m.start()):
            continue
        out.append(('flag', m.group(0).strip(),
                    '"%s" is a claim about who the person is. Describe what they do, '
                    'and qualify it: "You may be..."' % m.group(0).strip()))
        break
    return out

# -- 4. diagnosis and medical authority

DIAGNOSIS = re.compile(r'\b(?:diagnos\w*|(?:a|an|anxiety|personality|mood|eating|stress)\s+'
                       r'disorders?|syndromes?|patholog\w*|symptoms?|patients?|'
                       r'prescri\w*|diseases?|illness\w*|ptsd|adhd|bipolar|depressive|'
                       r'dysfunction\w*|dysregulat\w*)\b', re.I)
MEDICAL = re.compile(r'\b(?:clinical\w*|therap(?:y|ies|eutic\w*)|treatments?|cures?|cured|'
                     r'medical\w*|medicine)\b', re.I)
AUTHORITY = re.compile(r'\b(?:clinically|scientifically|evidence[- ]based|proven|'
                       r'studies show|research shows|doctors? (?:say|agree)|'
                       r'neuroscience (?:shows|proves)|rewires? your brain|'
                       r'reprogram\w* your)\b', re.I)


@rule(id='diagnosis', sec='5 Summary / Mirror, 8, 3', layers=PROSE | {'label'},
      title='Never diagnose. No medical authority.',
      fail='Your symptoms point to a trauma disorder.',
      fix='You reported pressure in your chest three times this week.',
      why='"Never diagnose." "Avoid medical authority." Section 8: "Do not present the '
          'model\'s chakra interpretation as an established medical fact."')
def _diagnosis(u):
    out = []
    t = u['text']
    for m in find(AUTHORITY, t):
        out.append(('stop', m.group(0), 'claims a medical or scientific authority.'))
        break
    for m in find(DIAGNOSIS, t):
        out.append(('flag', m.group(0),
                    'the language of a diagnosis. Say what was reported and where.'))
        break
    for m in find(MEDICAL, t):
        out.append(('flag', m.group(0),
                    'a medical frame: a claim measured against care the instrument '
                    'does not give.'))
        break
    return out

# -- 5. shame

SHAME = re.compile(r"\b(?:you(?:'re|’re| are)\s+(?:weak|broken|damaged|lazy|pathetic|"
                   r"selfish|worthless|stupid|a failure|the problem|toxic|wrong)|"
                   r"your fault|what is wrong with you|what's wrong with you|"
                   r"you should have|you failed|you keep failing|shame on|"
                   r"you(?:'re| are) not good enough|you ruin\w*|you sabotage\w*)\b", re.I)


@rule(id='shame', sec='5 Summary / Mirror', layers=PROSE,
      title='Never shame.',
      fail='You failed again because you are weak.',
      fix='The same response showed up again when the outcome felt uncertain.',
      why='"Never shame." "Never make the user feel diagnosed or judged."')
def _shame(u):
    return [('flag', m.group(0), 'a judgement on the person, not a description '
             'of what happened.') for m in find(SHAME, u['text'])[:1]]

# -- 6. certainty

CERTAIN = re.compile(r'\b(?:guarantee\w*|definitely|certainly|undoubtedly|without (?:a )?doubt|'
                     r'no doubt|for sure|will always|will never|the truth is|the fact is|'
                     r'there is no question|it is certain|always will|100 per ?cent sure)\b', re.I)
YOU_ALWAYS = re.compile(r'\byou\s+(?:always|never)\s+[a-z]+', re.I)
PROMISE = re.compile(r'\bwill\s+(?:make|change|transform|fix|heal|free|cure|set)\s+you\b', re.I)


@rule(id='certainty', sec='15.7, 5 Summary / Mirror', layers=PROSE,
      title='No unsupported certainty.',
      fail='This will always hold you back.',
      fix='This response appears more than once when you feel pressured to move forward.',
      why='Rule 7 of the generation sequence: "Avoid unsupported certainty." And "Never '
          'make deterministic claims about identity."')
def _certainty(u):
    t = u['text']
    out = []
    for m in find(CERTAIN, t):
        out.append(('flag', m.group(0), 'certainty the instrument has not measured.'))
        break
    for m in find(PROMISE, t):
        out.append(('flag', m.group(0), 'a promise about the person\'s future.'))
        break
    if not out:
        asked = [s for s in sents(t) if not s.endswith('?')]
        for m in find(YOU_ALWAYS, ' '.join(asked)):
            out.append(('review', m.group(0),
                        'Is "always" or "never" what the record shows, or a claim about '
                        'the person? If it is what they reported, say so.'))
            break
    return out

# -- 7. evidence

ASSERT = re.compile(r'\b(?:reveals?|proves?|is caused by|caused by|is rooted in|stems? from|'
                    r'the root cause|the real reason|this means you|which means you|'
                    r'means you are|is why you|that is why you)\b', re.I)
INFER = re.compile(r'\b(?:because|means|indicates?|shows? that|is why|comes? from|'
                   r'is driven by|drives you|makes you)\b', re.I)


@rule(id='evidence', sec='6, 5 Technical / System Language', layers={'mirror', 'information'},
      title='Say which it is: reported, observed, interpreted or tested.',
      fail='This reveals a fear of disappointing people.',
      fix='The situations seem to share a concern about disappointing other people.',
      why='"Atuned writing must distinguish what the user reported, what the system '
          'observed, what it interprets, and what it is testing as a hypothesis. Never '
          'collapse all four into an unsupported causal statement."')
def _evidence(u):
    out = []
    for s in sents(u['text']):
        if QUALIFIER.search(s) or REPORTED.search(s):
            continue
        m = ASSERT.search(s)
        if m and check.words(s) >= 5 and not negated(s, m.start()):
            out.append(('flag', m.group(0),
                        'an interpretation stated as a finding. Qualify it ("appears", '
                        '"may") or name what was reported.'))
            return out
    if u['layer'] != 'mirror':
        return out
    for s in sents(u['text']):
        if QUALIFIER.search(s) or REPORTED.search(s) or not is_reading(s):
            continue
        m = INFER.search(s)
        if m and not negated(s, m.start()):
            out.append(('review', m.group(0),
                        'Is this observed or inferred? If observed, which field or '
                        'which words of theirs does it come from? If inferred, qualify it '
                        'once. (W3: admit the limit once, never hedge throughout.)'))
            return out
    return out

# -- 8. the avoid list
#
# Seven registers the brief names in section 3. Each list was measured across
# the corpus before it was trusted, the way V21's lexicon was, and a word the
# owner's own canon uses on purpose is left off: soul, spiritual, source,
# energy, seat, charge, balance and coherence are all canon. A term the house
# gate already holds (check.SOFT: wellness, journey, holistic, mindful,
# manifest, abundance, inner child, hold space and the rest) is not listed
# again here, because one rule has one home.

AVOID = {
    'guru': (r'\b(?:enlighten\w*|higher self|the universe (?:wants|is telling|has)|'
             r'vibrational|(?:your|high|low|raise\w*)\s+vibration|divine\w*|ascend(?:ed|ing|s)?\b|ascension|spirit guides?|'
             r'awaken\w*|third eye opening|consciousness shift|surrender to)\b',
             'guru language', 'flag'),
    'therapy': (r'\b(?:trauma response|triggered|validate your feelings|your feelings are valid|'
                r'process your (?:emotions|feelings|trauma)|unpack\w*|work through your|'
                r'trauma[- ]informed|attachment style|regulate your nervous system|'
                r'co-?regulat\w*|codependen\w*|gaslight\w*|narcissis\w*|toxic|'
                r'healing journey|do the work|sit with (?:your|the) (?:feelings|emotions))\b',
                'therapy-speak', 'flag'),
    'corporate': (r'\b(?:optimi[sz](?:e|es|ed|ing|ation)|productivity|best version of yourself|thrive|thriving|'
                  r'work-life|synergy|solutions?|game[- ]changer|seamless\w*|'
                  r'peak performance|high[- ]performance|actionable insights?|leverage)\b',
                  'corporate wellness language', 'flag'),
    'mystical': (r'\b(?:destin(?:y|ed)|fated?|fortune|meant to be|the stars (?:say|show|reveal)|'
                 r'prophec\w*|your future holds|cosmic\w*|written in the stars|'
                 r'past lives?|karmic debt)\b',
                 'mystical fortune-telling', 'flag'),
    'motivational': (r"\b(?:you(?:'ve| have)? got this|believe in yourself|never give up|"
                     r"dream big|sky'?s the limit|go for it|crush it|comfort zone|"
                     r"be the change|you deserve (?:it|this|the best)|you are enough|"
                     r"no excuses|rise up|keep going[.!]|^keep going\b|"
                     r"you can do (?:it|anything)|"
                     r"stay positive|good vibes)\b",
                     'a motivational cliche', 'stop'),
    'selfhelp': (r'\b(?:transform your life|transformational|unlock your|full potential|'
                 r'life[- ]chang\w*|limitless|unleash\w*|highest self|'
                 r'become the person you were meant|radical(?:ly)? (?:change|transform)|'
                 r'superpowers?|the secret to|master your (?:life|mind|emotions)|'
                 r'most powerful version of yourself|best self)\b',
                 'inflated self-help language', 'stop'),
}
AVOID_RX = {k: (re.compile(v[0], re.I), v[1], v[2]) for k, v in AVOID.items()}


@rule(id='avoid-list', sec='3', layers=PROSE | {'button', 'label'},
      title='No guru, therapy, medical, corporate, mystical, motivational or self-help register.',
      fail='Unlock your full potential and step out of your comfort zone.',
      fix='Notice what happens in your body before you say yes.',
      why='"Avoid guru language, therapy-speak, medical authority, corporate wellness '
          'language, mystical fortune-telling, motivational cliches, and inflated '
          'self-help language." Medical authority is the diagnosis rule.')
def _avoid(u):
    out = []
    t = u['text']
    for k, (rx, name, sev) in AVOID_RX.items():
        for m in find(rx, t):
            if check.SOFT.search(m.group(0)):
                continue
            note = '%s (%s).' % (name, k)
            if RULED.search(t):
                # HIS LINE, AND THE TOOL DOES NOT OVERRULE HIM. The brief's
                # avoid list and his brand sentence meet here. It is flagged
                # so it is seen, and never stopped, on the precedent V12 set
                # for his welcome.
                sev = 'flag'
                note += (' His own line, BRAND.md section 1, so this is a question '
                         'for him and never an edit.')
            out.append((sev, m.group(0), note))
            break
    return out


RULED = re.compile(r'\b(?:already the most powerful version of yourself|'
                   r'we help you become the best version of yourself)\b', re.I)

# -- 9. readability

GRADE_TARGET = 9.0      # brief section 3, "approximately ninth-grade readability"
GRADE_FLAG = 12.0       # three grades past it: past the end of high school
GRADE_REVIEW = 10.5     # past "approximately"
GRADE_MIN_WORDS = 12    # the formula is noise on a fragment, so a fragment is not graded


@rule(id='readability', sec='3', layers=PROSE,
      title='About ninth grade. Report the grade and its cause.',
      fail=('The specific location in the body\'s energetic architecture where a '
            'pattern is resident, accumulated through physiological dysregulation.'),
      fix='One exact place in your body where a pattern sits. It builds up over time.',
      why='"Use approximately ninth-grade readability." The estimate is Flesch Kincaid, '
          'shown as its two halves so the cause is visible.')
def _readability(u):
    r = readability(u['text'])
    u['grade'] = r
    if not r or r['words'] < GRADE_MIN_WORDS:
        return []
    g = r['grade']
    if g < GRADE_REVIEW:
        return []
    cause = []
    if r['sentence_part'] >= 8:
        cause.append('the sentence: %.0f words a sentence adds %.1f grades'
                     % (r['wps'], r['sentence_part']))
    if r['word_part'] >= 4 or not cause:
        cause.append('the words: %.2f syllables a word adds %.1f grades%s'
                     % (r['spw'], r['word_part'],
                        (', long words ' + ', '.join(r['hard'][:6])) if r['hard'] else ''))
    note = 'grade %.1f against a target of about %d. Cause: %s.' % (
        g, GRADE_TARGET, '; '.join(cause))
    return [('flag' if g >= GRADE_FLAG else 'review', 'grade %.1f' % g, note)]

# -- 10. one idea per tooltip


@rule(id='tooltip-one-idea', sec='5 Tooltips, 14', layers={'tooltip'},
      title='A tooltip is one idea. Prefer one sentence.',
      fail=('Resistance. The friction you feel against your intention. It shows up as '
            'procrastination. It is measured across nine axes and stored at an address.'),
      fix='The friction you feel when something inside you pushes against your intention.',
      why='"Keep it extremely short. One idea at a time. Do not teach the entire '
          'concept. Prefer one sentence when one sentence is enough."')
def _tooltip(u):
    ss = sents(u['text'])
    # TERM, then SIMPLE MEANING. The brief's own tooltip shape is a name and a
    # definition, and the product writes it "Coherence. The ..." with a full
    # stop where the brief has a dash. The name is not a second idea, and the
    # first cut counted it as one and asked a question of every tooltip on
    # the section bar.
    if len(ss) > 1 and check.words(ss[0]) <= 3:
        ss = ss[1:]
    n = check.words(u['text'])
    if len(ss) >= 3 or n > 30:
        return [('flag', '%d sentences, %d words' % (len(ss), n),
                 'a tooltip is one idea. This teaches the concept. Move the rest '
                 'one door away, into the drill.')]
    if len(ss) == 2:
        return [('review', '2 sentences',
                 'Is the second sentence a second idea? If so, it goes one door away.')]
    return []

# -- 11. a next step where the layer calls for one

ROUTE = re.compile(r'\b(?:try|press|open|switch|reload|write|add|enter|choose|pick|sign in|'
                   r'use|run|load|save|check|turn|type|go|start|come back|continue|'
                   r'refresh|allow|copy|paste)\b', re.I)


@rule(id='next-step', sec='15.10, 5 Error and System States, 5 Summary / Mirror',
      layers={'status', 'mirror'},
      title='End with a useful next step where the layer calls for one.',
      fail='The import failed.',
      fix='Something didn\'t load. Try again.',
      why='Rule 10: "End with a useful next step when one is appropriate." The error '
          'example: "Something didn\'t load. Try again." The summary layer: "Surface '
          'the next useful area of exploration."')
def _next(u):
    t = u['text']
    ss = sents(t)
    if u['layer'] == 'status':
        if u['shape'] != 'status-fail' and u['shape'] != 'error':
            return []
        if any(is_prompt(s) for s in ss) or ROUTE.search(t):
            return []
        return [('review', 'no route',
                 'Does the control beside this carry the route (V15, ruled BA9)? If '
                 'not, add one imperative step.')]
    if len(ss) < 3:
        return []
    if any(is_prompt(s) for s in ss):
        return []
    return [('review', 'no next step',
             'A full reading with no next step. Is the route one door away, or does '
             'this reading need one line naming it?')]

# -- 12. errors stay clear


@rule(id='error-plain', sec='5 Error and System States', layers={'status'},
      title='Clear first. Human second. No therapy in a failure.',
      fail='Oops, something went wrong. Take a breath, it is okay.',
      fix='Something didn\'t load. Try again.',
      why='"Do not turn technical failures into therapeutic language."')
def _error(u):
    m = re.search(r"\b(?:breathe|take a (?:deep )?breath|it'?s okay|it is okay|be kind to yourself|"
                  r"be gentle|gentle|feel|feelings|journey|heal\w*|safe|sorry|apologi[sz]e)\b",
                  u['text'], re.I)
    if m and not negated(u['text'], m.start()):
        return [('flag', m.group(0), 'therapy language in a technical failure.')]
    return []

# -- 13. notifications are not marketing


@rule(id='notification-plain', sec='5 Notifications and Microcopy', layers=ALL,
      title='No marketing automation, anywhere.',
      fail='Don\'t miss out. Your streak is about to end.',
      fix='You left this pattern open. Continue when you\'re ready.',
      why='"Notifications should never sound like marketing automation." Urgency is '
          'also ruled out in this category, SKILL.md section 4.')
def _notif(u):
    m = re.search(r"\b(?:don'?t miss|do not miss|hurry|limited time|act now|last chance|"
                  r"we miss you|streak is about to|only today|exclusive offer|spots? left|"
                  r"before it'?s too late|ends tonight)\b", u['text'], re.I)
    if m and not negated(u['text'], m.start()):
        return [('stop', m.group(0), 'marketing automation and urgency.')]
    return []

# -- 14. personalization is earned


@rule(id='familiarity', sec='13', layers=PROSE,
      title='Personalization comes from the person\'s words. Never manufacture familiarity.',
      fail='We know exactly how you feel, friend.',
      fix='Earlier, you said, "I don\'t want them to think I\'m selfish."',
      why='"Use the user\'s own language when it increases recognition. Do not '
          'manufacture familiarity."')
def _familiar(u):
    m = re.search(r"\b(?:we know (?:exactly )?(?:how|what|you)|we understand|we get it|"
                  r"i know how you feel|people like you|trust us|join thousands|"
                  r"our community|hey there|hi friend|dear friend|my friend|, friend\b)",
                  u['text'], re.I)
    if m and not negated(u['text'], m.start()):
        return [('flag', m.group(0), 'familiarity the product has not earned from '
                 'the person\'s own words.')]
    return []

# -- 15. somatic language by surface

BODY = re.compile(r'\b(?:chest|jaw|throat|breath|breathing|belly|gut|stomach|shoulders?|'
                  r'spine|ribs|hips?|pelvis|tension|tight\w*|heat|pressure|tingl\w*|'
                  r'sensation\w*|felt|body)\b')


@rule(id='somatic-metric', sec='5 Somatic Language, 12', layers={'metric'},
      title='Metrics carry minimal somatic language.',
      fail='Coherence, your chest opening a little more each day',
      fix='Your reported resistance decreased across the last three check-ins.',
      why='"Metrics: minimal somatic language." "Metrics should be factual and '
          'restrained. They should describe change, not praise or judge the user."')
def _somatic(u):
    m = BODY.search(u['text'])
    if m and check.words(u['text']) >= 4:
        return [('review', m.group(0),
                 'A body word in a metric. Is it the figure\'s own unit, or decoration?')]
    return []


RULE_BY_ID = {r['id']: r for r in RULES}

# ------------------------------------------------------- the house, carried
#
# check.py's own hard gates and his objections run over every classified
# string too, so a finding from the old system lands in the same report under
# a layer. Nothing is re-implemented: these call scan() and objection_hits().


def house(u):
    out = []
    for g, _, _, s, note in check.scan([(u['file'], u['line'], s)
                                        for s in sents(u['text'])]):
        out.append(('house:' + g, 'stop', s, note))
    for r, sev, hit in check.objection_hits(u['text']):
        out.append(('objection:' + r['id'], 'stop' if sev == 'stop' else 'flag', hit,
                    r['why'].split('.')[0] + '.'))
    return out


def run_rules(u, with_house=True):
    found = []
    if u['layer'] == QUOTED:
        return found
    for r in RULES:
        if u['layer'] not in r['layers']:
            continue
        for sev, hit, note in r['check'](u):
            found.append({'rule': r['id'], 'section': r['sec'], 'severity': sev,
                          'hit': hit, 'note': note})
    if 'grade' not in u:
        u['grade'] = readability(u['text'])
    if with_house:
        for rid, sev, hit, note in house(u):
            found.append({'rule': rid, 'section': 'SKILL.md' if rid.startswith('house')
                          else 'objections.json', 'severity': sev, 'hit': hit,
                          'note': note})
    return found


# --------------------------------------------------------------- reach
#
# HOW MANY PEOPLE SEE IT, as a rank. The funnel is read by everyone who ever
# arrives, the first card and the tutorial by everyone who signs up, the
# Story and the release by everyone who uses the product once, and a
# reference table by the few who open it. A lower rank is read by more
# people. Buttons are read on every visit to their surface and ride one rank
# above it, which is the order the sweep was asked for.

REACH = [
    (1, r'^funnel/', 'the funnel: everyone who arrives'),
    (2, r'^atuned_src/ui/(?:onboard|tutorial|login)\.js$|^atuned_src/shell/', 'day one: everyone who signs up'),
    (3, r'^atuned_src/ui/(?:storyui|imprints|release)\.js$|^atuned_src/engine/data/cards\.js$',
     'Story and Release: everyone who uses it once'),
    (4, r'^atuned_src/ui/(?:wheel|rings|fieldbar|ui|component|panels)\.js$', 'the Field, where it opens, and the shared controls'),
    (5, r'^atuned_src/ui/(?:summary|avatarui|intakeui|map|rootsum|mapshelf)\.js$|^atuned_src/engine/intake\.js$',
     'the rest of Discover'),
    (6, r'^atuned_src/ui/', 'the other surfaces'),
    (7, r'^atuned_src/engine/', 'reference tables and engine refusals, read one door away'),
]


def reach(f):
    for n, rx, _ in REACH:
        if re.search(rx, f['file']):
            n2 = n
            if f.get('layer') in ('button', 'status') and n > 1:
                n2 = n - 1
            return n2
    return 8


SEV_RANK = {'stop': 0, 'flag': 1, 'review': 2}

# --------------------------------------------------------------- the run


def stamp(rt):
    def git(*a):
        try:
            return subprocess.run(('git',) + a, cwd=rt, capture_output=True,
                                  text=True, timeout=20).stdout.strip()
        except Exception:
            return ''
    return {'commit': git('rev-parse', '--short', 'HEAD'),
            'dirty': bool(git('status', '--porcelain', '--', 'atuned_src', 'funnel')),
            'date': git('log', '-1', '--format=%cs')}


def sweep(rt, targets, with_house=True):
    units, skipped = harvest(rt, targets)
    findings = []
    for u in units:
        classify(rt, u)
        for f in run_rules(u, with_house):
            f.update(file=u['file'], line=u['line'], func=u['func'], layer=u['layer'],
                     mode=u['mode'], shape=u['shape'], text=u['text'])
            if f['severity'] == 'review':
                f['question'] = f['note']
            f['reach'] = reach(f)
            findings.append(f)
    findings.sort(key=lambda f: (SEV_RANK[f['severity']], f['reach'], f['file'], f['line']))
    return units, findings, skipped


def key_of(f):
    h = hashlib.sha1(re.sub(r'\s+', ' ', f['text']).encode('utf-8')).hexdigest()[:12]
    return '%s|%s|%s' % (f['rule'], f['file'], h)


def tally(items, *keys):
    out = {}
    for it in items:
        k = ' / '.join(str(it[x]) for x in keys)
        out[k] = out.get(k, 0) + 1
    return dict(sorted(out.items(), key=lambda kv: (-kv[1], kv[0])))


def summarise(units, findings):
    by_layer = tally(units, 'layer')
    grades = {}
    for u in units:
        g = u.get('grade')
        if g and g['words'] >= GRADE_MIN_WORDS and u['layer'] != QUOTED:
            grades.setdefault(u['layer'], []).append(g['grade'])
    somatic = {}
    for u in units:
        if u['layer'] in PROSE:
            d = somatic.setdefault(u['layer'], [0, 0])
            d[0] += 1
            d[1] += 1 if BODY.search(u['text']) else 0
    return {
        'units': len(units),
        'by_layer': by_layer,
        'by_mode': tally(units, 'mode'),
        'by_layer_mode': tally(units, 'layer', 'mode'),
        'unclassified_by_file': tally([u for u in units if u['layer'] == UNCLASSIFIED], 'file'),
        'findings': len(findings),
        'by_severity': tally(findings, 'severity'),
        'by_rule_severity': tally(findings, 'rule', 'severity'),
        'by_layer_severity': tally(findings, 'layer', 'severity'),
        'by_file_severity': tally(findings, 'file', 'severity'),
        'grade_by_layer': {k: {'n': len(v), 'median': statistics.median(v),
                               'p90': sorted(v)[int(len(v) * .9)] if v else 0}
                           for k, v in sorted(grades.items())},
        'somatic_share_by_layer': {k: round(100.0 * v[1] / v[0], 1)
                                   for k, v in sorted(somatic.items())},
    }


CANNOT = """
WHAT THE BRIEF ENGINE DID NOT JUDGE. These need a person, and a green run
says nothing about them.

  1  Is it true. Whether a reading overstates what the engine measured.
  2  Whether a layer guess on a mixed file is right. Read the reason it gives.
     A string it could not place is UNCLASSIFIED, never guessed.
  3  Observation against interpretation, beyond the words that mark them. A
     sentence can carry no "because" and still state a cause.
  4  Whether a person's own words were used when they would land, section 13.
  5  Whether somatic language serves the task or decorates it, section 5.
     The share of body words per layer is printed; whether it is right is not.
  6  Whether an empty state manufactures insight, section 9.
  7  Whether the copy helps the person see, understand, experience or choose,
     section 15. If none, it probably does not need to be there.
  8  The grade is an estimate off syllable counts. Short plain words can still
     say nothing; long canon names (Coherence) are not hard words to him.
"""


def print_report(rt, st, summ, findings, skipped, out=sys.stdout, limit=None):
    w = out.write
    w('THE BRIEF, CHECKED. %s, commit %s%s, %s.\n' % (
        BRIEF, st['commit'], ' with the tree dirty' if st['dirty'] else '', st['date']))
    w('%d strings read, %d findings.\n\n' % (summ['units'], summ['findings']))
    w('LAYER (strings)\n')
    for k, v in summ['by_layer'].items():
        w('  %-14s %5d\n' % (k, v))
    w('\nMODE (strings), read off TABDEF in engine/core.js\n')
    for k, v in summ['by_mode'].items():
        w('  %-14s %5d\n' % (k, v))
    if summ['unclassified_by_file']:
        w('\nUNCLASSIFIED, by file. Not guessed.\n')
        for k, v in summ['unclassified_by_file'].items():
            w('  %-44s %5d\n' % (k, v))
    w('\nFINDINGS BY RULE AND SEVERITY\n')
    for k, v in summ['by_rule_severity'].items():
        w('  %-44s %5d\n' % (k, v))
    w('\nFINDINGS BY LAYER AND SEVERITY\n')
    for k, v in summ['by_layer_severity'].items():
        w('  %-44s %5d\n' % (k, v))
    w('\nREADING GRADE BY LAYER, strings of %d words or more. Target about %d.\n'
      % (GRADE_MIN_WORDS, GRADE_TARGET))
    for k, v in summ['grade_by_layer'].items():
        w('  %-14s n %4d   median %5.1f   p90 %5.1f\n' % (k, v['n'], v['median'], v['p90']))
    w('\nBODY WORDS BY LAYER, per cent of strings. Brief section 5: landing and\n'
      'release high, discovery and summary moderate, information low to\n'
      'moderate, metrics minimal.\n')
    for k, v in summ['somatic_share_by_layer'].items():
        w('  %-14s %5.1f%%\n' % (k, v))
    if skipped:
        w('\nNOT READ, AND NAMED\n')
        for k, v in sorted(skipped.items()):
            w('  %-44s %s\n' % (k, v))
    w('\nFINDINGS, by severity then by how many people see them\n')
    shown = findings if limit is None else findings[:limit]
    for f in shown:
        w('\n  [%s] %s  %s:%s  %s / %s\n' % (f['severity'], f['rule'], f['file'], f['line'],
                                             f['layer'], f['mode']))
        w('      %s\n' % f['text'][:160])
        w('      %s\n' % f['note'])
    if limit is not None and len(findings) > limit:
        w('\n  ... %d more in the JSON\n' % (len(findings) - limit))
    w(CANNOT)


def baseline_counts(findings):
    out = {}
    for f in findings:
        if f['severity'] == 'review':
            continue
        k = key_of(f)
        out[k] = out.get(k, 0) + 1
    return out


def new_findings(findings, base):
    seen = {}
    out = []
    for f in findings:
        if f['severity'] == 'review':
            continue
        k = key_of(f)
        seen[k] = seen.get(k, 0) + 1
        if seen[k] > base.get(k, 0):
            out.append(f)
    return out


def check_line(rt, text, layer, out=sys.stdout):
    u = Unit(file='<line>', line=0, func='', key='', shape='text', text=text, info={},
             layer=layer or UNCLASSIFIED, mode='none', why='given on the command line')
    if layer == 'button':
        u['shape'] = 'button'
    if layer == 'status':
        u['shape'] = 'status-fail'
    if not layer:
        u['layer'] = 'mirror' if is_reading(text) else 'information'
        u['why'] = 'no --layer given, so read as %s' % u['layer']
    fs = run_rules(u)
    g = u.get('grade')
    out.write('the line, as %s (%s)\n' % (u['layer'], u['why']))
    if g:
        out.write('  grade %.1f: sentence adds %.1f, words add %.1f, %d words\n'
                  % (g['grade'], g['sentence_part'], g['word_part'], g['words']))
    if not fs:
        out.write('  no findings\n')
    for f in fs:
        out.write('  [%s] %s  "%s"\n      %s\n' % (f['severity'], f['rule'], f['hit'], f['note']))
    out.write(CANNOT)
    return 1 if any(f['severity'] in ('stop', 'flag') for f in fs) else 0


MD_BEGIN = '<!-- brief run: generated by check.py --brief --md. Edits inside are overwritten. -->'
MD_END = '<!-- brief run: end -->'


def md_block(st, args, summ, findings, skipped):
    """The mechanical half of a sweep list, as markdown. Every count in it is
    read off this run, and the stamp says which tree the run read."""
    L = []
    w = L.append
    w(MD_BEGIN)
    w('')
    w('Measured at commit `%s`%s, %s, by:' % (
        st['commit'], ' with atuned_src or funnel dirty' if st['dirty'] else '', st['date']))
    w('')
    w('    python3 .claude/skills/atuned-voice/check.py --brief %s' % ' '.join(args))
    w('')
    w('%d strings read. %d findings: %s.' % (
        summ['units'], summ['findings'],
        ', '.join('%d %s' % (v, k) for k, v in summ['by_severity'].items())))
    w('')
    w('### Strings by layer and mode')
    w('')
    modes = [m for m in MODES if m in summ['by_mode']]
    w('| layer | ' + ' | '.join(modes) + ' | all |')
    w('|---|' + '---|' * (len(modes) + 1))
    for layer, n in summ['by_layer'].items():
        row = [str(summ['by_layer_mode'].get('%s / %s' % (layer, m), 0) or '') for m in modes]
        w('| %s | %s | %d |' % (layer, ' | '.join(row), n))
    w('')
    if summ['unclassified_by_file']:
        w('UNCLASSIFIED, by file, never guessed: %s.' % ', '.join(
            '`%s` %d' % (k.split('/')[-1], v) for k, v in summ['unclassified_by_file'].items()))
        w('')
    w('### Findings by rule and severity')
    w('')
    w('| rule | stop | flag | review |')
    w('|---|---|---|---|')
    rules = []
    for k in summ['by_rule_severity']:
        r = k.split(' / ')[0]
        if r not in rules:
            rules.append(r)
    for r in rules:
        w('| %s | %s |' % (r, ' | '.join(
            str(summ['by_rule_severity'].get('%s / %s' % (r, s), '') or '') for s in SEVERITIES)))
    w('')
    w('### Findings by layer and severity')
    w('')
    w('| layer | stop | flag | review |')
    w('|---|---|---|---|')
    layers = []
    for k in summ['by_layer_severity']:
        ly = k.split(' / ')[0]
        if ly not in layers:
            layers.append(ly)
    for ly in layers:
        w('| %s | %s |' % (ly, ' | '.join(
            str(summ['by_layer_severity'].get('%s / %s' % (ly, s), '') or '') for s in SEVERITIES)))
    w('')
    w('### Reading grade and body words, by layer')
    w('')
    w('| layer | graded strings | median grade | p90 grade | body words |')
    w('|---|---|---|---|---|')
    for ly in sorted(set(summ['grade_by_layer']) | set(summ['somatic_share_by_layer'])):
        g = summ['grade_by_layer'].get(ly)
        s = summ['somatic_share_by_layer'].get(ly)
        w('| %s | %s | %s | %s | %s |' % (
            ly, g['n'] if g else '', '%.1f' % g['median'] if g else '',
            '%.1f' % g['p90'] if g else '', '%.1f%%' % s if s is not None else ''))
    w('')
    w('### By file, in the order a sweep should take them')
    w('')
    w('Files are ordered by how many people read them, then by stop and flag '
      'findings. One file is one change, so two seats can take two files '
      'without touching the same lines. Reviews are questions, listed last in '
      'each file.')
    by = {}
    for f in findings:
        by.setdefault(f['file'], []).append(f)
    order = sorted(by, key=lambda p: (min(reach(f) for f in by[p]),
                                      -sum(1 for f in by[p] if f['severity'] != 'review'), p))
    for p in order:
        fs = sorted(by[p], key=lambda f: (SEV_RANK[f['severity']], f['line']))
        n = {s: sum(1 for f in fs if f['severity'] == s) for s in SEVERITIES}
        w('')
        w('#### `%s`, reach %d. %s' % (p, min(reach(f) for f in fs), ', '.join(
            '%d %s' % (n[s], s) for s in SEVERITIES if n[s])))
        w('')
        for f in fs:
            t = re.sub(r'\s+', ' ', f['text'])
            t = (t[:140] + '...') if len(t) > 140 else t
            w('- `%s` **%s** %s, %s / %s: "%s"  ' % (
                f['line'], f['severity'], f['rule'], f['layer'], f['mode'], t.replace('|', '/')))
            w('  %s' % f['note'])
    w('')
    if skipped:
        w('Not read, and named: %s.' % '; '.join('`%s` %s' % (k, v.rstrip('.'))
                                                for k, v in sorted(skipped.items())))
        w('')
    w(MD_END)
    return '\n'.join(L) + '\n'


def write_md(path, st, args, summ, findings, skipped):
    block = md_block(st, args, summ, findings, skipped)
    try:
        cur = open(path, encoding='utf-8').read()
    except OSError:
        cur = ''
    if MD_BEGIN in cur and MD_END in cur:
        a = cur.index(MD_BEGIN)
        b = cur.index(MD_END) + len(MD_END) + 1
        out = cur[:a] + block + cur[b:]
    else:
        out = cur + ('\n' if cur else '') + block
    with open(path, 'w', encoding='utf-8') as fh:
        fh.write(out)


USAGE = """usage:
  check.py --brief PATH ...                    report, grouped by layer, rule, severity
  check.py --brief PATH ... --json FILE        and write the machine readable report
  check.py --brief PATH ... --md FILE          and write the sweep list into FILE,
                                               between its markers, leaving the rest
  check.py --brief PATH ... --baseline         fail only on findings not in the baseline
  check.py --brief PATH ... --write-baseline   record today's findings as the baseline
  check.py --brief --line "..." [--layer L]    one candidate line, in one layer
  check.py --brief --rules                     every rule, its section, a failing and a fixed line
layers: %s
""" % ', '.join(LAYERS)


def main(argv):
    rt = check.root()
    os.chdir(rt)
    args = list(argv)
    opt = {}
    for flag in ('--json', '--layer', '--limit', '--md'):
        if flag in args:
            i = args.index(flag)
            opt[flag] = args[i + 1] if i + 1 < len(args) else ''
            del args[i:i + 2]
    for flag in ('--baseline', '--write-baseline', '--rules', '--line', '--quiet'):
        if flag in args:
            opt[flag] = True
            args.remove(flag)
    if opt.get('--rules'):
        for r in RULES:
            sys.stdout.write('%-20s brief %s\n  %s\n  fails  %s\n  fixed  %s\n  layers %s\n\n' % (
                r['id'], r['sec'], r['title'], r['fail'], r['fix'],
                ', '.join(sorted(r['layers']))))
        return 0
    if opt.get('--line'):
        layer = opt.get('--layer')
        if layer and layer not in LAYERS:
            sys.stderr.write(USAGE)
            return 2
        return check_line(rt, ' '.join(args), layer)
    if not args:
        sys.stderr.write(USAGE)
        return 2
    st = stamp(rt)
    units, findings, skipped = sweep(rt, args)
    summ = summarise(units, findings)
    if opt.get('--json'):
        with open(opt['--json'], 'w', encoding='utf-8') as fh:
            json.dump({'stamp': st, 'paths': args, 'summary': summ,
                       'rules': [{k: v for k, v in r.items() if k != 'check'} for r in RULES],
                       'findings': findings}, fh, indent=1, ensure_ascii=False,
                      default=lambda o: sorted(o) if isinstance(o, set) else str(o))
    if opt.get('--md'):
        write_md(opt['--md'], st, args, summ, findings, skipped)
    if opt.get('--write-baseline'):
        with open(BASELINE_FILE, 'w', encoding='utf-8') as fh:
            json.dump({'stamp': st, 'paths': args,
                       'note': 'stop and flag findings present when this was written. '
                               'Keyed by rule, file and the string, never by line.',
                       'counts': baseline_counts(findings)}, fh, indent=1, sort_keys=True)
        sys.stdout.write('baseline written: %d keys, from %d stop and flag findings.\n'
                         % (len(baseline_counts(findings)),
                            sum(1 for f in findings if f['severity'] != 'review')))
        return 0
    if opt.get('--baseline'):
        try:
            base = json.load(open(BASELINE_FILE, encoding='utf-8'))['counts']
        except (OSError, ValueError, KeyError):
            sys.stderr.write('no baseline at %s. Write one with --write-baseline.\n'
                             % os.path.relpath(BASELINE_FILE, rt))
            return 2
        new = new_findings(findings, base)
        gone = sum(base.values()) - (sum(1 for f in findings if f['severity'] != 'review')
                                      - len(new))
        sys.stdout.write('BRIEF GATE against %s. %d stop and flag findings today, %d of '
                         'them new, %d in the baseline no longer found.\n'
                         % (os.path.relpath(BASELINE_FILE, rt),
                            sum(1 for f in findings if f['severity'] != 'review'),
                            len(new), max(0, gone)))
        for f in new:
            sys.stdout.write('\n  NEW [%s] %s  %s:%s  %s / %s\n      %s\n      %s\n' % (
                f['severity'], f['rule'], f['file'], f['line'], f['layer'], f['mode'],
                f['text'][:160], f['note']))
        if not new:
            sys.stdout.write('  nothing new.\n')
        return 1 if new else 0
    lim = opt.get('--limit')
    print_report(rt, st, summ, findings, skipped,
                 limit=int(lim) if lim else (60 if opt.get('--quiet') else None))
    return 1 if any(f['severity'] == 'stop' for f in findings) else 0
