#!/usr/bin/env python3
"""NOT_COPY's own gate. Run from anywhere in the repository.

    python3 .claude/skills/atuned-voice/test_not_copy.py

A record set aside from the voice gates is a hole in the voice gates, so the
set aside is held here the way the repository holds a tool: the known good
case first, then every known bad case, each of which must lapse the rule.

    1  the real tree: every rule holds, the record strings are set aside, and
       the copy beside them in the same row is still read
    2  the gate is not weakened: the four paper titles still stop as copy, and
       the same words in a ui file still stop the sweep
    3  routes, against a small tree built for each case: a reader of the
       table, a caller of a route, a second handle, a route renamed away, an
       object that carries a route outside module.exports. Each one lapses.
       A comment naming a route and an unrelated .label read do not
    4  the name search the routes replace for a key like label lapses on an
       unrelated read, which is why a table needs routes at all

Exits non zero when anything fails, and prints every failure first.
"""

import os
import shutil
import sys
import tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import check  # noqa: E402

RT = check.root()
FAILS = []
NEW = ('RESEARCHANCHOR[].label', 'RESEARCHANCHOR[].note',
       'PATTERN96[].evidenceFitNote')


def ok(cond, what):
    if not cond:
        FAILS.append(what)
    return cond


def fresh(repo=None):
    """Point the guard at a tree and forget what it measured last."""
    check.REPO = repo or RT
    check._NC_LAPSED.clear()
    return check.not_copy_lapsed()


# ---------------------------------------------------------------- 1, real tree

lapsed = fresh()
for rule in check.NOT_COPY:
    rid = check.not_copy_id(rule)
    ok(not lapsed.get(rid), '1 real tree: %s should hold, lapsed at %r'
       % (rid, (lapsed.get(rid) or [None])[0]))

ra = os.path.join(RT, 'atuned_src/engine/data/researchanchors.js')
pt = os.path.join(RT, 'atuned_src/engine/data/patterns96.js')
ra_read = [t for _, t in check.literal_iter(open(ra, encoding='utf-8').read(), ra)]
pt_read = [t for _, t in check.literal_iter(open(pt, encoding='utf-8').read(), pt)]
ok(not any('Walsh (2016)' in t for t in ra_read),
   '1 real tree: a citation label is still read as copy')
ok(any(t.startswith('meta-analysis') or t == 'family' for t in ra_read),
   '1 real tree: the other fields of an anchor row are no longer read')
ok(not any(t.startswith('Boundary dissolution meta-analysis') for t in pt_read),
   '1 real tree: an evidenceFitNote is still read as copy')
ok(any(t.startswith('G−2 sensitivity') for t in pt_read),
   '1 real tree: generationalTransformation was set aside, and it is copy')
ok(any(t.startswith('P, E, B. Protects against') for t in pt_read),
   '1 real tree: functionalDefinition was set aside, and it is copy')

# ------------------------------------------------------- 2, not weakened

for title in ('Walsh (2016), Applying a family resilience framework',
              'Family dynamics and the grieving process',
              'Construction of self and family in intergenerational family stories',
              'via parenting-related emotion and cognition'):
    ok(any(s == 'stop' for _, s, _ in check.objection_hits(title)),
       '2 a paper title no longer stops when it is copy: %s' % title)

# ---------------------------------------------------------- 3, routes

DATA_P = ("/* PATTERN96 header, srcVoiceCanon carries the note */\n"
          "var PATTERN96=[\n"
          "{id:'AP-01',name:'Emotional distance',"
          "evidenceFitNote:'Fit: strong for the boundary construct.',"
          "generationalTransformation:'The trajectory stays open.'}\n];\n"
          "const PATTERN96_BY_LAYER={ancestral:PATTERN96.filter("
          "function(p){return true;})};\n")
DATA_R = ("/* RESEARCHANCHOR, what each entry in PATTERN96 cites. note is the\n"
          "   source's own stated limit. */\n"
          "var RESEARCHANCHOR=[\n"
          "{id:'R25',label:'Walsh (2016), Applying a family resilience "
          "framework',note:'Relational dynamics only.'}\n];\n")
VOICE = ("/* srcVoiceCanon and srcVoicePattern below */\n"
         "function srcVoiceCanon(q){\n"
         " return RESEARCHANCHOR.map(function(a){return {name:a.label};})\n"
         "  .concat(PATTERN96.map(function(p){return {name:p.name};}));\n}\n"
         "function srcVoicePattern(id){\n"
         " var rec=PATTERN96[0];\n"
         " return {record:rec,anchors:[RESEARCHANCHOR[0]],note:'a match'};\n}\n")
EXPORT = ("if(typeof module!=='undefined'&&module.exports){\n"
          " module.exports={PATTERN96:PATTERN96, PATTERN96_BY_LAYER:"
          "PATTERN96_BY_LAYER, RESEARCHANCHOR:RESEARCHANCHOR,\n"
          "  srcVoiceCanon:srcVoiceCanon, srcVoicePattern:srcVoicePattern};\n}\n")
UI_GOOD = ("function row(x){return '<label>'+x.label+'</label>'+x.note;}\n"
           "var tip={label:'Weight',note:'by hand'};\n")


def tree(ui, voice=VOICE, export=EXPORT):
    d = tempfile.mkdtemp(prefix='notcopy-')
    files = {'atuned_src/engine/data/patterns96.js': DATA_P,
             'atuned_src/engine/data/researchanchors.js': DATA_R,
             'atuned_src/engine/voice_intelligence.js': voice,
             'atuned_src/engine/export.js': export,
             'atuned_src/ui/x.js': ui}
    for p, s in files.items():
        os.makedirs(os.path.join(d, os.path.dirname(p)), exist_ok=True)
        with open(os.path.join(d, p), 'w', encoding='utf-8') as f:
            f.write(s)
    return d


def case(what, ui, want, tables=('PATTERN96', 'RESEARCHANCHOR'), **kw):
    """want True: every new rule on tables lapses. False: every one holds."""
    d = tree(ui, **kw)
    try:
        lap = fresh(d)
        for rid in NEW:
            if rid.split('[')[0] not in tables:
                continue
            got = bool(lap.get(rid))
            ok(got == want, '3 %s: %s should %s, %s' % (
                what, rid, 'lapse' if want else 'hold',
                ('lapsed at %r' % (lap[rid][0],)) if got else 'it held'))
    finally:
        shutil.rmtree(d, ignore_errors=True)


case('known good, an unrelated .label and .note in ui', UI_GOOD, False)
case('a comment in ui that names a route',
     UI_GOOD + '// srcVoicePattern is not called here\n', False)
case('a ui reader of the table', 'var n=PATTERN96[0].name;\n', True,
     tables=('PATTERN96',))
case('a ui reader of the anchors', 'var t=RESEARCHANCHOR[0].label;\n', True,
     tables=('RESEARCHANCHOR',))
case('a ui caller of a route', "var r=srcVoicePattern('AP-01');\n", True)
case('a ui reader of the second handle',
     'var a=PATTERN96_BY_LAYER.ancestral;\n', True, tables=('PATTERN96',))
case('a route carried outside module.exports',
     'var api={srcVoiceCanon:srcVoiceCanon};\n', True)
case('a route renamed away', UI_GOOD, True,
     voice=VOICE.replace('function srcVoicePattern(', 'function srcVoiceRow('))
case('an engine function that is not a route reads the table', UI_GOOD, True,
     tables=('PATTERN96',),
     voice=VOICE + 'function srcLeak(){return PATTERN96[0].evidenceFitNote;}\n')

# the sweep still stops copy in ui that carries the same words
d = tree("var s='Applying a family resilience framework';\n")
try:
    fresh(d)
    hits = check.scan_objections(os.path.join(d, 'atuned_src/ui/x.js'))
    ok(any(h[0] == 'abstract-word' for h in hits),
       '3 the sweep no longer stops abstract-word in ui copy')
    hits = check.scan_objections(os.path.join(d, 'atuned_src/engine/data'))
    ok(not any('Walsh' in h[3] or 'boundary construct' in h[3] for h in hits),
       '3 a held record string still reaches the sweep: %r' % hits)
    ok(any('trajectory' in h[3] for h in hits),
       '3 generationalTransformation was set aside by the sweep, and it is copy')
finally:
    shutil.rmtree(d, ignore_errors=True)

# ------------------------------------------------- 4, why routes exist

saved = dict(check.NOT_COPY_ROUTES)
check.NOT_COPY_ROUTES.clear()
d = tree(UI_GOOD)
try:
    lap = fresh(d)
    ok(bool(lap.get('RESEARCHANCHOR[].label')),
       '4 with no routes, the name search should lapse label on an unrelated '
       'read, and it held, so this test is not testing what it says')
finally:
    check.NOT_COPY_ROUTES.update(saved)
    shutil.rmtree(d, ignore_errors=True)
    fresh()

if FAILS:
    print('test_not_copy: %d failure%s' % (len(FAILS), '' if len(FAILS) == 1
                                             else 's'))
    for f in FAILS:
        print('  ' + f)
    sys.exit(1)
print('test_not_copy: every case answered as it should')
