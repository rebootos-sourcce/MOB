#!/usr/bin/env python3
"""The brief engine's own gate. Run from anywhere in the repository.

    python3 .claude/skills/atuned-voice/test_brief.py

A TOOL THAT LIES IS WORSE THAN NO TOOL, so the order below is the order the
repository's rule asks for. The known good case first: the brief's own
approved lines must pass the brief's rules, in the layer the brief puts them
in, before anything else is believed. Then every rule against its failing
line, its fixed line and its edge cases. Then the classifier against real
strings in the product. Then a bite test: real product files with a defect
put in on purpose, which must come back as new findings and nothing else.
Then the existing modes of check.py, which must behave as they did.

Exits non zero on the first section that fails, and prints every failure in
it first.
"""

import os
import re
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import brief  # noqa: E402
import check  # noqa: E402

RT = check.root()
os.chdir(RT)
FAILS = []


def ok(cond, what):
    if not cond:
        FAILS.append(what)
    return cond


def unit(text, layer, shape='text', file='<test>', mode='none'):
    return brief.Unit(file=file, line=0, func='', key='', shape=shape, text=text,
                      info={}, layer=layer, mode=mode, why='test')


def hits(text, layer, rule=None, shape=None, house=False):
    if shape is None:
        shape = {'button': 'button', 'status': 'status-fail'}.get(layer, 'text')
    fs = brief.run_rules(unit(text, layer, shape), with_house=house)
    return [f for f in fs if rule is None or f['rule'] == rule]


def worst(fs):
    order = {'stop': 0, 'flag': 1, 'review': 2}
    return min((order[f['severity']] for f in fs), default=9)


def section(name):
    if FAILS:
        print('\nFAILED in the section before "%s":' % name)
        for f in FAILS:
            print('  ' + f)
        sys.exit(1)
    print('\n== %s' % name)

# --------------------------------------------------- 1. the known good case
#
# Every quoted line in the brief, in the layer its own heading gives it. The
# lines the brief marks Avoid are collected apart: they must fail.

section('1. the brief\'s own lines pass the brief\'s rules')

LAYER_OF_HEADING = [
    (r'^\*\*Tooltip\*\*', 'tooltip'), (r'^\*\*Information\*\*', 'information'),
    (r'^\*\*Summary\*\*', 'mirror'), (r'^### Release$', 'flow'),
    (r'^### Integration$', 'flow'), (r'^### Embodiment$', 'embody'),
    (r'^### DISCOVER', 'discovery'), (r'^### PLAY', 'play'), (r'^### FLOW', 'flow'),
    (r'^### EMBODY', 'embody'), (r'^### Notifications', 'notification'),
    (r'^### Buttons', 'button'), (r'^### Error', 'status'),
    (r'^## 12\.', 'metric'), (r'^### (?:Daily|Weekly) Summary', 'mirror'),
    (r'^### Empty States', 'information'), (r'^### Discovery Screen', 'discovery'),
    (r'^### Pattern Card', 'mirror'), (r'^## 10\.', 'mirror'),
    (r'^### Mirror Language', 'mirror'), (r'^## 13\.', 'mirror'),
    (r'^## 6\.', 'mirror'), (r'^### Technical', 'information'),
    (r'^## 1\.', 'information'), (r'^## 16\.', 'information'),
    (r'^## 17\.', 'information'), (r'^## 15\.', 'information'),
    (r'^## 2\.', 'information'),
]
DPFE = ['discovery', 'play', 'flow', 'embody']


def brief_lines():
    """[(layer, line, kind)] where kind is good, avoid or skip."""
    out = []
    layer = 'information'
    dpfe = None
    for raw in open(os.path.join(RT, brief.BRIEF), encoding='utf-8'):
        line = raw.rstrip('\n')
        for rx, ly in LAYER_OF_HEADING:
            if re.match(rx, line):
                layer, dpfe = ly, None
        if line.startswith('**Discover / Play / Flow / Embody**'):
            dpfe = 0
            continue
        if not line.startswith('>'):
            continue
        t = line.lstrip('> ').strip()
        if not t:
            continue
        ly = layer
        if dpfe is not None:
            ly = DPFE[min(dpfe, 3)]
            dpfe += 1
        if t.startswith('Avoid:'):
            out.append((ly, t[len('Avoid:'):].strip(), 'avoid'))
        elif t.startswith(('User', 'Prefer:', 'Better', 'Button:')) or '→' in t:
            # the person's own words, a label for the line after it, or an
            # arrow diagram, none of which is a line the product says
            out.append((ly, t, 'skip'))
        elif ly == 'button' and '·' in t:
            for b in t.split('·'):
                out.append(('button', b.strip(), 'good'))
        else:
            out.append((ly, re.sub(r'^Atuned:\s*', '', t), 'good'))
    return out


BL = brief_lines()
good = [x for x in BL if x[2] == 'good']
ok(len(good) > 100, 'the brief walk found only %d lines; the walker is broken' % len(good))
house_collisions = []
for ly, t, _ in good:
    fs = hits(t, ly)
    bad = [f for f in fs if f['severity'] in ('stop', 'flag')]
    ok(not bad, 'the brief\'s own %s line fails %s: %s' % (
        ly, ', '.join('%s %s "%s"' % (f['rule'], f['severity'], f['hit']) for f in bad), t))
    hb = [f for f in hits(t, ly, house=True) if f['rule'].startswith('house:')]
    if hb:
        house_collisions.append((t, sorted({f['rule'] for f in hb})))
print('  %d approved lines read out of %s, by layer, and none fails a brief rule.'
      % (len(good), brief.BRIEF))
# THE HOUSE AND THE BRIEF DISAGREE IN PLACES, and the collision is printed
# here rather than hidden. Every one must be an em dash or a run of capitals:
# anything else means the house gate is firing on the brief for a reason
# nobody has looked at.
for t, rs in house_collisions:
    ok(set(rs) <= {'house:emdash', 'house:caps'},
       'the house gate fires on a brief line for a new reason %s: %s' % (rs, t))
print('  %d of them fail the house rules, every one on an em dash or capitals:'
      % len(house_collisions))
for t, rs in house_collisions:
    print('    %-14s %s' % (','.join(r.split(':')[1] for r in rs), t[:70]))

avoid = [x for x in BL if x[2] == 'avoid']
ok(avoid, 'no Avoid line found in the brief')
for ly, t, _ in avoid:
    ok(worst(hits(t, ly)) <= 1, 'the brief\'s own Avoid line passes: %s' % t)
for t in ('Unlock Your Full Potential', 'Begin Your Transformational Journey'):
    ok(worst(hits(t, 'button', 'button-verb')) == 0,
       'the brief\'s inflated call to action is not stopped: %s' % t)
ok(worst(hits('Let go of the charge.', 'flow', 'release-language')) == 0,
   'the brief\'s named wrong phrase is not stopped')
print('  the brief\'s Avoid lines and its two inflated calls to action all fail.')

# ------------------------------------------------- 2. every rule, both ways

section('2. every rule: its failing line fails and its fixed line passes')

for r in brief.RULES:
    layer = sorted(r['layers'] - {brief.UNCLASSIFIED})[0]
    prefer = {'mirror-identity': 'mirror', 'evidence': 'mirror', 'certainty': 'mirror',
              'diagnosis': 'mirror', 'shame': 'mirror', 'avoid-list': 'information',
              'readability': 'information', 'next-step': 'status',
              'notification-plain': 'notification', 'familiarity': 'mirror',
              'release-language': 'flow', 'error-plain': 'status',
              'somatic-metric': 'metric', 'tooltip-one-idea': 'tooltip',
              'button-verb': 'button'}
    layer = prefer.get(r['id'], layer)
    f = hits(r['fail'], layer, r['id'])
    ok(f, '%s: its own failing line passes: %s' % (r['id'], r['fail']))
    x = hits(r['fix'], layer, r['id'])
    ok(not x, '%s: its own fixed line fails: %s %s' % (r['id'], r['fix'],
                                                       [(y['severity'], y['hit']) for y in x]))
    for name in ('fail', 'fix', 'why', 'sec', 'title'):
        ok(r.get(name), '%s has no %s' % (r['id'], name))
    print('  %-20s brief %-36s fails %-6s fixed passes' % (
        r['id'], r['sec'][:36], f[0]['severity'] if f else '-'))

section('2b. edge cases, the ones a cheap version gets wrong')

# (rule, layer, line, expected) where expected is a severity or None
EDGES = [
    # release
    ('release-language', 'flow', 'I let go of fear.', 'flag'),
    ('release-language', 'flow', 'The release protocol does not tell you to let it go.', None),
    ('release-language', 'flow', 'Release the charge.', None),
    ('release-language', 'flow', 'You do not have to erase what happened to stop reliving it.', None),
    ('release-language', 'flow', 'This will erase the memory.', 'flag'),
    ('release-language', 'flow', 'Clear the charge at the throat.', 'flag'),
    ('release-language', 'flow', 'The memory stays. The charge changes.', None),
    # buttons
    ('button-verb', 'button', 'Release', None),
    ('button-verb', 'button', 'Run a release', None),
    ('button-verb', 'button', 'Click here', 'flag'),
    ('button-verb', 'button', 'Unlock premium insights', 'stop'),
    ('button-verb', 'button', 'Open Energetics', None),
    ('button-verb', 'button', 'None of these. Try by age', 'flag'),
    ('button-verb', 'button', 'Accuracy', 'review'),
    # mirror
    ('mirror-identity', 'mirror', 'You are looking at Sofia, a worked example.', None),
    ('mirror-identity', 'mirror', 'You are not broken.', None),
    ('mirror-identity', 'mirror', 'Once you are grounded, the charge is easier to release.', None),
    ('mirror-identity', 'mirror', 'You are a people pleaser.', 'flag'),
    ('mirror-identity', 'mirror', 'This is who you are.', 'flag'),
    ('mirror-identity', 'mirror', 'You may be avoiding the call.', None),
    ('mirror-identity', 'discovery', 'You are early, ready, and furious at everybody slower.', None),
    ('mirror-identity', 'mirror', 'A tight jaw before you are properly awake.', None),
    # diagnosis
    ('diagnosis', 'mirror', 'This is not a diagnosis.', None),
    ('diagnosis', 'mirror', 'You show symptoms of an anxiety disorder.', 'flag'),
    ('diagnosis', 'information', 'Rigidity, correction of others, fear of disorder.', None),
    ('diagnosis', 'information', 'Clinically proven to lower stress.', 'stop'),
    # certainty
    ('certainty', 'mirror', 'This will definitely change.', 'flag'),
    ('certainty', 'mirror', 'What did you always make?', None),
    ('certainty', 'mirror', 'You always say yes first.', 'review'),
    # evidence
    ('evidence', 'mirror', 'You said you felt pressure in your chest.', None),
    ('evidence', 'mirror', 'This may indicate a recurring pattern around moving forward.', None),
    ('evidence', 'mirror', 'Your answers prove you avoid conflict.', 'flag'),
    ('evidence', 'mirror', 'You hold back because you expect to be punished.', 'review'),
    # avoid list
    ('avoid-list', 'information', 'Optimism is naive.', None),
    ('avoid-list', 'information', 'Habits you keep going by repeating them.', None),
    ('avoid-list', 'information', 'Keep going.', 'stop'),
    ('avoid-list', 'information', 'Your destiny is written in the stars.', 'flag'),
    ('avoid-list', 'information', 'Your ascendant needs a birth time.', None),
    ('avoid-list', 'information', 'Validate your feelings and do the work.', 'flag'),
    # readability
    ('readability', 'information', 'Notice the charge. Release the charge. Stay with what changes.', None),
    # tooltip
    ('tooltip-one-idea', 'tooltip', 'Coherence. How closely what you do matches what you mean.', None),
    ('tooltip-one-idea', 'tooltip', 'A response that repeats. It shows up across situations.', 'review'),
    # next step
    ('next-step', 'status', 'Something didn\'t load. Try again.', None),
    ('next-step', 'status', 'Nothing released on a worked example.', 'review'),
    # error
    ('error-plain', 'status', 'This browser would not save. The tutorial will open again.', None),
    ('error-plain', 'status', 'Sorry, that did not work.', 'flag'),
    # notification
    ('notification-plain', 'notification', 'You noticed this pattern again.', None),
    ('notification-plain', 'notification', 'We miss you. Come back today.', 'stop'),
    # familiarity
    ('familiarity', 'mirror', 'Earlier, you said you did not want to seem selfish.', None),
    ('familiarity', 'mirror', 'People like you often feel this way.', 'flag'),
    # somatic
    ('somatic-metric', 'metric', 'Patterns explored, 14', None),
    ('somatic-metric', 'metric', 'Coherence, your chest opening more each day', 'review'),
]
order = {'stop': 0, 'flag': 1, 'review': 2, None: 9}
for rid, ly, t, want in EDGES:
    got = worst(hits(t, ly, rid))
    ok(got == order[want], '%s on %s line "%s": wanted %s, got %s' % (
        rid, ly, t, want, {v: k for k, v in order.items()}.get(got)))
print('  %d edge cases, each at the severity it should carry.' % len(EDGES))

section('2c. the readability estimate is checked against a hand count')

HAND = {'the': 1, 'charge': 1, 'release': 2, 'address': 2, 'friction': 2,
        'pattern': 2, 'intention': 3, 'coherence': 3, 'resistance': 3,
        'embody': 3, 'notice': 2, 'body': 2, 'experience': 4, 'integrate': 3,
        'architecture': 4, 'physiological': 6, 'simple': 2, 'story': 2}
miss = [(w, n, brief.syllables(w)) for w, n in HAND.items()
        if abs(brief.syllables(w) - n) > 1]
ok(not miss, 'syllables off by more than one against the hand count: %s' % miss)
exact = sum(1 for w, n in HAND.items() if brief.syllables(w) == n)
print('  %d of %d words counted exactly, none off by more than one.' % (exact, len(HAND)))
g1 = brief.readability('Notice the charge. Release the charge.')['grade']
g2 = brief.readability('The physiological architecture of accumulated dysregulation '
                       'operates through interoceptive correspondence.')['grade']
ok(g1 < 6 < 12 < g2, 'the grade does not separate a plain line from a dense one: %s %s'
   % (g1, g2))
r = brief.readability('The physiological architecture of accumulated dysregulation '
                      'operates through interoceptive correspondence.')
ok('physiological' in r['hard'], 'the hard word list did not name the hard word')
print('  plain %.1f, dense %.1f, and the dense one names its hard words.' % (g1, g2))

# --------------------------------------------- 3. the classifier, on the product

section('3. the classifier, on real strings, and the tab bar read off core.js')

tabs = brief.tabdef(RT)
ok(tabs.get('rit', (0, 0))[1] == 'flow', 'Ritual is not read as Flow off TABDEF')
ok(tabs.get('know', (0, 0))[1] == 'embody', 'Knowledge is not read as Embody off TABDEF')
ok(tabs.get('story', (0, 0))[1] == 'discover', 'Story is not read as Discover off TABDEF')
ok(tabs.get('cv', (0, 0))[1] == 'play', 'Field is not read as Play off TABDEF')
ok(brief.mode_of(RT, 'prac') == 'none', 'the practitioner section is read as a station')
ok(brief.mode_of(RT, 'settings') == 'none', 'Settings, which has no section, has a mode')
for f, spec in sorted(brief.FILES.items()):
    ok(os.path.exists(os.path.join(RT, f)), 'FILES names a file that is gone: %s' % f)
    if spec[0]:
        ok(spec[0] in tabs, 'FILES gives %s the host %s, which is not in TABDEF '
           'or TABEXTRA' % (f, spec[0]))
print('  %d tabs read, %d files mapped, every host real.' % (len(tabs), len(brief.FILES)))

ALL_PATHS = ['atuned_src/ui', 'atuned_src/engine', 'atuned_src/shell',
             'funnel/index.html', 'funnel/about.html', 'funnel/buy.html',
             'funnel/quiz.html', 'funnel/questions.js']
units, findings, skipped = brief.sweep(RT, ALL_PATHS)


def find_unit(file, rx, layer=None):
    """The string, and where one string ships twice (a tab's title and its
    label say the same word), the copy in the layer asked about."""
    got = [u for u in units if u['file'] == file and re.search(rx, u['text'])]
    for u in got:
        if layer and u['layer'] == layer:
            return u
    return got[0] if got else None


REAL = [
    ('atuned_src/ui/release.js', r'^I let go of$', 'flow', 'DISCOVER'),
    ('atuned_src/ui/storyui.js', r'^Nothing committed on a worked example', 'status', 'DISCOVER'),
    ('atuned_src/ui/storyui.js', r'^What happened\. Write it', 'discovery', 'DISCOVER'),
    ('atuned_src/ui/fieldbar.js', r'^Your 112 addresses\. Each mark', 'tooltip', 'PLAY'),
    ('atuned_src/ui/summary.js', r'^There is no birth data on file', 'mirror', 'DISCOVER'),
    ('atuned_src/shell/body.html', r'^Story$', 'button', 'none'),
    ('funnel/questions.js', r'^You say yes while your chest tightens', 'discovery', 'none'),
    ('atuned_src/ui/knowledge.js', r'^The Letting Go Deck$', 'label', 'EMBODY'),
    ('atuned_src/engine/data/kb.js', r'^One exact place in your body where a pattern sits',
     'information', 'none'),
    ('atuned_src/engine/ladder.js', r'addresses have been opened at least once', 'notification', 'none'),
    ('atuned_src/ui/drills.js', r'^Try by age$', 'button', 'none'),
    ('atuned_src/ui/avatarui.js', r'^Think of the last night you lay awake over money',
     'discovery', 'DISCOVER'),
    ('atuned_src/ui/tutorial.js', r'^The release protocol does not tell you', 'flow', 'none'),
    ('atuned_src/ui/ritual.js', r'^Could not save that\. Nothing changed', 'status', 'FLOW'),
    ('atuned_src/engine/data/people.js', r'^I hold the room for everyone', 'quoted', 'none'),
]
for f, rx, layer, mode in REAL:
    u = find_unit(f, rx, layer)
    if not ok(u, 'the extractor did not find /%s/ in %s' % (rx, f)):
        continue
    ok(u['layer'] == layer, '%s /%s/: layer %s, wanted %s (%s)' % (
        f, rx, u['layer'], layer, u['why']))
    ok(u['mode'] == mode, '%s /%s/: mode %s, wanted %s' % (f, rx, u['mode'], mode))
print('  %d real strings land in the layer and mode they should.' % len(REAL))

# NEVER GUESSED. A prompt in a shared renderer is UNCLASSIFIED.
u = brief.classify(RT, brief.Unit(file='atuned_src/ui/drills.js', line=0, func='x',
                                  key='', shape='text', text='Write what happened next.',
                                  info={}))
ok(u['layer'] == brief.UNCLASSIFIED, 'a prompt in a shared file was guessed: %s' % u['layer'])
u = brief.classify(RT, brief.Unit(file='atuned_src/ui/nowhere.js', line=0, func='',
                                  key='', shape='text', text='A sentence nobody placed.',
                                  info={}))
ok(u['layer'] == brief.UNCLASSIFIED, 'a file with no entry was guessed: %s' % u['layer'])
# THE COUNTEREXAMPLE IS NOT READ AS COPY. cards.js keys the owner's own bad
# truth under bad:, and the house gate already knows the shape.
ok(not find_unit('atuned_src/engine/data/cards.js', r'cosmic abundance'),
   'the counterexample under bad: was read as copy')
# A SLOT IS NOT CAPITALS. intake.js swaps STEM for a verb.
ok(not any(f['rule'] == 'house:caps' and 'STEM' in f['hit'] for f in findings),
   'the caps gate is reading the STEM slot in intake.js')
# THE BUILD PRODUCTS ARE NEVER READ.
ok(not any(u['file'].startswith(('funnel/dist', 'source.html')) for u in units),
   'a build product was read')
uncl = sum(1 for u in units if u['layer'] == brief.UNCLASSIFIED)
print('  a prompt in a shared file and a file with no entry stay UNCLASSIFIED.')
print('  %d strings read, %d UNCLASSIFIED, %d findings.' % (len(units), uncl, len(findings)))

# --------------------------------------------- 4. it bites, and the baseline holds

section('4. deliberately broken input comes back as new findings, and only those')

BROKEN = {
    'atuned_src/ui/release.js': (
        "\nfunction relBroken(){status('Oops, take a breath, it is okay.','fail');\n"
        " return '<p>You are broken, and this will definitely help.</p>'\n"
        "  +'<button class=\"btn\">Unlock Your Full Potential</button>'\n"
        "  +'<p>Let go of the charge.</p>';}\n",
        {('error-plain', 'flag'), ('house:filler', 'stop'), ('mirror-identity', 'flag'),
         ('shame', 'flag'), ('certainty', 'flag'), ('button-verb', 'stop'),
         ('release-language', 'stop'), ('avoid-list', 'stop')}),
    'atuned_src/ui/summary.js': (
        "\nfunction sumBroken(){return 'This reveals a fear of being seen. You have the "
        "symptoms of a disorder. We know how you feel.';}\n",
        {('evidence', 'flag'), ('diagnosis', 'flag'), ('familiarity', 'flag')}),
}
for rel, (extra, want) in BROKEN.items():
    src = open(os.path.join(RT, rel), encoding='utf-8').read()
    before = []
    for u in brief.units_js(rel, src, 0, rel):
        brief.classify(RT, u)
        for f in brief.run_rules(u):
            f.update(file=rel, text=u['text'], line=u['line'])
            before.append(f)
    after = []
    for u in brief.units_js(rel, src + extra, 0, rel):
        brief.classify(RT, u)
        for f in brief.run_rules(u):
            f.update(file=rel, text=u['text'], line=u['line'])
            after.append(f)
    base = brief.baseline_counts(before)
    ok(not brief.new_findings(before, base), '%s: the baseline does not hold its own run' % rel)
    new = brief.new_findings(after, base)
    got = {(f['rule'], f['severity']) for f in new}
    ok(want <= got, '%s: the broken lines did not bite: missing %s' % (rel, sorted(want - got)))
    stray = [f for f in new if f['line'] <= src.count('\n')]
    ok(not stray, '%s: the baseline let an old finding through as new: %s'
       % (rel, [(f['rule'], f['line']) for f in stray]))
    print('  %-28s %d new findings, every one on the broken lines: %s' % (
        rel, len(new), ', '.join(sorted({r for r, _ in got}))))

# a moved string is not a new finding: the key is the rule, file and text
f1 = {'rule': 'r', 'file': 'f', 'text': 'Same words.', 'severity': 'flag', 'line': 10}
f2 = dict(f1, line=400)
ok(not brief.new_findings([f2], brief.baseline_counts([f1])),
   'a finding that only moved lines came back as new')
ok(brief.new_findings([f1, f2], brief.baseline_counts([f1])),
   'a second copy of a known finding was not reported as new')
ok(not brief.new_findings([dict(f1, severity='review')], {}),
   'a review counted against the gate')
print('  a line move is not new, a second copy is, and a review never counts.')

# -------------------------------------------- 5. the old modes, as they were

section('5. check.py\'s existing modes behave as they did')

PY = sys.executable
CK = os.path.join(HERE, 'check.py')


def run(*a):
    p = subprocess.run((PY, CK) + a, cwd=RT, capture_output=True, text=True, timeout=300)
    return p.returncode, p.stdout


rc, out = run('--objections')
ok(rc == 0, '--objections no longer exits 0')
ok('HIS OBJECTIONS, SWEPT' in out, '--objections no longer prints its sweep')
rc, out = run('--line', 'Sit back and relax.')
ok(rc == 1 and '[soft]' in out, '--line no longer fails "Sit back and relax."')
rc, out = run('--line', 'Sit down. Put both feet on the floor.')
ok(rc == 0, '--line fails the skill\'s own fixed line')
rc, out = run('--brief', '--line', 'You are afraid of confrontation.', '--layer', 'mirror')
ok(rc == 1 and 'mirror-identity' in out, '--brief --line does not fail the brief\'s Avoid line')
rc, out = run('--brief', '--line',
              'You may be avoiding confrontation because something about the outcome '
              'feels unsafe.', '--layer', 'mirror')
ok(rc == 0, '--brief --line fails the brief\'s Prefer line: %s' % out[:300])
print('  --objections, --line and --brief --line answer as they should.')

section('done')
print('  every section passed.')
