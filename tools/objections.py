#!/usr/bin/env python3
"""Render the copy objections log, and run the sweep that reads it.

    python3 tools/objections.py

Writes COPY-OBJECTIONS.md and COPY-OBJECTIONS.html from
.claude/skills/atuned-voice/objections.json, which is the source. Both are
build products and both carry the sweep as it read on this run, so the log
cannot disagree with the database and neither can disagree with the product.

His ruling, and it is the reason this file exists: "create a log of all the
times I said I do not like this copy type. Create a database, sweep for it, and
kill it. And add that to the style guide."

THERE IS ONE SWEEP AND IT IS NOT IN HERE. check.py owns it, this imports it,
and every rule is enforced at the severity the database gives it in every mode
of that gate. One word per concept applies to tools as much as to copy, so a
second scanner walking the same strings would be the defect this repository
already carries a rule against.

NO COUNT IS TYPED INTO THIS FILE OR INTO WHAT IT WRITES. Every figure in the
rendered log is read off the run, and a line number is found by searching the
file for the string rather than by remembering where it was, because four files
in this list moved while the log was being written.
"""

import hashlib
import html
import importlib.util
import json
import os
import re
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB = os.path.join(ROOT, '.claude', 'skills', 'atuned-voice', 'objections.json')
GATE = os.path.join(ROOT, '.claude', 'skills', 'atuned-voice', 'check.py')


def gate():
    spec = importlib.util.spec_from_file_location('voicecheck', GATE)
    m = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(m)
    return m


def stamp():
    """The commit, whether the tree is dirty, and the md5 of the database.

    The same stamp monitor.js writes, for the same reason: a report that does
    not say which tree it read cannot be diffed against the next one."""
    def sh(*a):
        try:
            return subprocess.check_output(a, cwd=ROOT,
                                           stderr=subprocess.DEVNULL).decode().strip()
        except Exception:
            return '?'
    commit = sh('git', 'rev-parse', '--short', 'HEAD')
    dirty = bool(sh('git', 'status', '--porcelain'))
    md5 = hashlib.md5(open(DB, 'rb').read()).hexdigest()[:12]
    return commit, dirty, md5


def sweep(m):
    """Every finding, both severities, grouped by rule id."""
    by = {}
    for c in m.CORPUS:
        for rid, path, line, text, note in m.scan_objections(
                os.path.join(ROOT, c), ('stop', 'flag')):
            by.setdefault(rid, []).append(
                (os.path.relpath(path, ROOT), line, re.sub(r'\s+', ' ', text).strip()))
    return by


def locate(path, needle):
    """The line the string is on right now, or None.

    ANYTHING NEEDING A LOCATION LOOKS IT UP BY IDENTITY, NEVER BY POSITION.
    The repository's own rule, and this list needed it: four of the nine files
    were edited by another seat while the log was being written, and every
    typed line number in the first draft was wrong within the hour."""
    try:
        for i, line in enumerate(open(os.path.join(ROOT, path), encoding='utf-8'), 1):
            if needle in line:
                return i
    except OSError:
        return None
    return None


# --------------------------------------------------------------- markdown

def md(db, found, st):
    commit, dirty, md5 = st
    rules = db['rules']
    mine = [r for r in rules if r.get('gate') == 'objections']
    stop = sum(len(found.get(r['id'], [])) for r in mine
               if r['severity'] == 'stop')
    total = sum(len(v) for v in found.values())
    o = []
    w = o.append
    w('# Copy objections\n')
    w('**This file is a build product. Never edit it.** The source is')
    w('`.claude/skills/atuned-voice/objections.json` and the renderer is')
    w('`tools/objections.py`. `COPY-OBJECTIONS.html` is the same content for')
    w('reading rather than for diffing.\n')
    w('His ruling, and it is why this exists:\n')
    w('> create a log of all the times I said I do not like this copy type.')
    w('> Create a database, sweep for it, and kill it. And add that to the')
    w('> style guide.\n')
    w('Run the sweep:\n')
    w('    python3 .claude/skills/atuned-voice/check.py --objections\n')
    w('It exits non zero on a finding at a severity that stops a build. Every')
    w('other mode of that gate enforces the same rules, so there is one set of')
    w('rules and one place they live.\n')
    w('    commit %s%s   database md5 %s' % (commit, ', tree dirty' if dirty else '', md5))
    w('    %d objections logged, %d of them with a quotation on record'
      % (len(db['log']), sum(1 for e in db['log'] if e['verbatim'])))
    w('    %d rules, %d with patterns in the database, %d held by a gate elsewhere'
      % (len(rules), len(mine), len(rules) - len(mine)))
    w('    %d more objections are guidance, because no check can express them'
      % len(db['guidance']))
    w('    %d findings on this run, %d at a severity that stops a build\n'
      % (total, stop))
    w('---\n')
    w('## The log\n')
    w('His wording, unsmoothed. Where a class is inferred rather than quoted,')
    w('the entry says so and says from what.\n')
    for e in db['log']:
        w('### %s. %s' % (e['id'], e['objects']))
        w('')
        w('> %s\n' % e['words'])
        w('    where    %s' % e['where'])
        w('    when     %s' % e['date'])
        w('    quoted   %s' % ('verbatim' if e['verbatim']
                               else 'NO. Inferred from the record, see the note'))
        w('    rules    %s' % (', '.join(e['rules']) if e['rules']
                               else 'none. Guidance, and not gateable'))
        if e.get('note'):
            w('')
            w(e['note'])
        w('')
    w('---\n')
    w('## The rules, and where each one is enforced\n')
    w('    rule                  class         severity  gate                        from')
    for r in rules:
        w('    %-21s %-13s %-9s %-27s %s'
          % (r['id'], r['class'], r['severity'], r['gate'], ', '.join(r['log'])))
    w('')
    for r in mine:
        hits = found.get(r['id'], [])
        w('### %s' % r['id'])
        w('')
        w(r['why'])
        w('')
        w('    fails   %s' % r['fail'])
        w('    fixed   %s' % r['fix'])
        w('    found   %d' % len(hits))
        for path, line, text in hits:
            w('    %s:%s' % (path, line))
            w('        %s' % text[:150])
        if r.get('note'):
            w('')
            w(r['note'])
        w('')
    w('---\n')
    w('## Not gateable, and named rather than dropped\n')
    w('A rule nobody can express as a check is guidance. It is written down')
    w('here so the next writer is held to it, and it is not turned into a bad')
    w('pattern, because a tool that lies is worse than no tool.\n')
    for g in db['guidance']:
        w('**%s.** %s' % (g['id'], ', '.join(g['log'])))
        w('')
        w(g['why'])
        w('')
        w('*Why no pattern.* %s\n' % g['not_gateable'])
    w('---\n')
    w('## The strings the build seat has to change\n')
    w('Old and new, with the reason. The line is found by searching the file')
    w('for the string, not by remembering where it was.\n')
    for h in db['handover']:
        line = locate(h['file'], h['old'].strip("'"))
        where = '%s:%s' % (h['file'], line) if line else '%s, not found' % h['file']
        w('### %s' % where)
        w('')
        w('    bucket  %s' % h['bucket'])
        w('    rule    %s, from %s' % (h['rule'], h['log']))
        w('    old     %s' % h['old'])
        w('    new     %s' % h['new'])
        w('')
        w(h['why'])
        if h.get('note'):
            w('')
            w(h['note'])
        w('')
    return '\n'.join(o) + '\n'


# ------------------------------------------------------------------- html

CSS = """
:root{--bg:#0E0E0F;--card:#16171A;--sunk:#1C1E22;--line:#26282E;--ink:#E6E7EA;
 --dim:#8A8C94;--his:#C9A96A;--accent:#7EB8D4;--red:#C4746A;--green:#7FA07A}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--ink);padding:0 0 90px;
 font:15.5px/1.64 Inter,system-ui,-apple-system,Segoe UI,Roboto,sans-serif;
 -webkit-font-smoothing:antialiased}
.wrap{max-width:880px;margin:0 auto;padding:0 16px}
header{padding:38px 0 8px}
h1{font-size:26px;margin:0 0 8px;font-weight:600;letter-spacing:-.01em}
.lede{color:var(--dim);font-size:14.5px;margin:0 0 4px;max-width:64ch}
.sec{background:var(--card);border:1px solid var(--line);border-radius:14px;
 padding:6px 20px 20px;margin:0 0 14px}
h2{font-size:18px;font-weight:600;margin:26px 0 10px}
h3{font-size:13.5px;font-weight:600;margin:22px 0 6px}
p{margin:9px 0;max-width:72ch}
.dim{color:var(--dim)}
.his{border-left:2px solid var(--his);padding:2px 0 2px 15px;margin:12px 0;
 color:var(--ink);font-size:16.5px;line-height:1.55;max-width:66ch}
code{background:var(--sunk);border-radius:5px;padding:1px 5px;color:var(--accent);
 font:12px/1.4 ui-monospace,SFMono-Regular,Menlo,monospace;overflow-wrap:anywhere}
b{font-weight:600}
table{width:100%;border-collapse:collapse;margin:12px 0;font-size:13.5px}
th{text-align:left;font-weight:600;font-size:11.5px;letter-spacing:.06em;
 color:var(--dim);padding:0 10px 7px 0;border-bottom:1px solid var(--line)}
td{padding:8px 10px 8px 0;border-top:1px solid var(--sunk);vertical-align:top;
 line-height:1.5}
td:first-child,th:first-child{padding-left:0}
table.rules td[data-k=rule] code{white-space:nowrap}
.num{font-variant-numeric:tabular-nums}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:14px 0 4px}
.tile{background:var(--sunk);border:1px solid var(--line);
 border-radius:11px;padding:13px 14px}
@media (max-width:620px){.grid{grid-template-columns:repeat(2,1fr)}}
.tile .t{font-size:11.5px;letter-spacing:.06em;color:var(--dim)}
.tile .v{font-size:27px;font-weight:600;line-height:1.15;margin-top:5px;
 font-variant-numeric:tabular-nums}
.meta{font:12px/1.9 ui-monospace,SFMono-Regular,Menlo,monospace;color:var(--dim)}
.meta i{color:var(--ink);font-style:normal}
.pill{display:inline-block;font-size:11px;letter-spacing:.05em;
 border:1px solid var(--line);border-radius:20px;padding:1px 9px;color:var(--dim);
 margin-right:6px;vertical-align:1px}
.pill.stop{border-color:var(--red);color:var(--red)}
.pill.flag{border-color:var(--his);color:var(--his)}
.pill.clean{border-color:var(--green);color:var(--green)}
.hit{background:var(--sunk);border:1px solid var(--line);border-radius:9px;
 padding:9px 12px;margin:8px 0;font-size:13px}
.hit .w{font:11.5px/1.6 ui-monospace,SFMono-Regular,Menlo,monospace;color:var(--accent)}
.hit .s{display:block;margin-top:3px;overflow-wrap:anywhere}
.ba{display:grid;grid-template-columns:52px 1fr;gap:4px 10px;margin:10px 0;
 font-size:13.5px}
.ba .k{color:var(--dim);font-size:11.5px;letter-spacing:.05em;padding-top:3px}
.ba .o{color:var(--red);overflow-wrap:anywhere}
.ba .n{color:var(--green);overflow-wrap:anywhere}
.ba .o,.ba .n{font:12.5px/1.6 ui-monospace,SFMono-Regular,Menlo,monospace}
@media (max-width:560px){.ba{grid-template-columns:1fr}.ba .k{padding-top:8px}}
/* THE FOUR COLUMN TABLE DOES NOT FIT A PHONE, and it ran 50 pixels off the
   right edge, which the shot run caught. Every cell keeps its name and the row
   stacks, so nothing is dropped to make it fit. */
@media (max-width:600px){
 table.rules th{display:none}
 table.rules tr{display:block;border-top:1px solid var(--line);padding:9px 0}
 table.rules td{display:block;border:0;padding:1px 0;overflow-wrap:anywhere}
 table.rules td::before{content:attr(data-k) " ";color:var(--dim);font-size:11px;
  letter-spacing:.05em}
 .meta{overflow-wrap:anywhere}
}
"""


def e(s):
    return html.escape(str(s))


def htm(db, found, st):
    commit, dirty, md5 = st
    rules = db['rules']
    mine = [r for r in rules if r.get('gate') == 'objections']
    stop = sum(len(found.get(r['id'], [])) for r in mine if r['severity'] == 'stop')
    total = sum(len(v) for v in found.values())
    o = []
    w = o.append
    w('<!doctype html><html lang="en"><head><meta charset="utf-8">')
    w('<meta name="viewport" content="width=device-width,initial-scale=1">')
    w('<title>Copy objections</title><style>%s</style></head><body><div class="wrap">' % CSS)
    w('<header><h1>Copy objections</h1>')
    w('<p class="lede">Every time you said you did not like a kind of copy, in your own '
      'words, with where it is written down. Each one is a rule a program can run, or it '
      'says why it cannot be one. Nothing here is remembered. It is read off the files.</p>')
    w('</header>')

    w('<div class="sec"><div class="his">%s</div>' % e(db['ruling']))
    w('<div class="grid">')
    for t, v in [('Objections logged', len(db['log'])),
                 ('Quoted verbatim', sum(1 for x in db['log'] if x['verbatim'])),
                 ('Rules', len(rules)),
                 ('Not gateable', len(db['guidance'])),
                 ('Findings now', total),
                 ('Stopping a build', stop)]:
        w('<div class="tile"><div class="t">%s</div><div class="v">%d</div></div>' % (e(t), v))
    w('</div>')
    w('<p class="meta">commit <i>%s</i>%s &nbsp; database md5 <i>%s</i><br>'
      'sweep <i>python3 .claude/skills/atuned-voice/check.py --objections</i></p>'
      % (e(commit), ', tree dirty' if dirty else '', e(md5)))
    w('</div>')

    w('<div class="sec"><h2>What the sweep found</h2>')
    w('<p>One line per rule. A rule reading zero is a rule holding a class closed, '
      'which is what a gate is for.</p>')
    w('<table class="rules"><tr><th>Rule</th><th>What it refuses</th>'
      '<th>Found</th><th>From</th></tr>')
    for r in rules:
        hits = found.get(r['id'], [])
        n = len(hits)
        cls = 'clean' if n == 0 else r['severity']
        w('<tr><td data-k="rule"><code>%s</code></td><td data-k="refuses">%s</td>'
          '<td data-k="found" class="num"><span class="pill %s">%s</span></td>'
          '<td data-k="from" class="dim">%s</td></tr>'
          % (e(r['id']), e(r['why'].split('.')[0] + '.'), cls,
             ('%d' % n) if r.get('gate') == 'objections' else 'gated in ' + e(r['gate']),
             e(', '.join(r['log']))))
    w('</table>')
    for r in mine:
        hits = found.get(r['id'], [])
        if not hits:
            continue
        w('<h3>%s, %d found</h3>' % (e(r['id']), len(hits)))
        for path, line, text in hits:
            w('<div class="hit"><span class="w">%s:%s</span><span class="s">%s</span></div>'
              % (e(path), line, e(text[:190])))
    w('</div>')

    w('<div class="sec"><h2>The log</h2>')
    w('<p>Your wording, unsmoothed. Where an entry is not a quotation it says so on '
      'the line that says quoted, and says what the class was taken from instead.</p>')
    for x in db['log']:
        w('<h3>%s. %s</h3>' % (e(x['id']), e(x['objects'])))
        w('<div class="his">%s</div>' % e(x['words']))
        w('<p class="meta">where <i>%s</i><br>when <i>%s</i><br>quoted <i>%s</i><br>'
          'rules <i>%s</i></p>'
          % (e(x['where']), e(x['date']),
             'verbatim' if x['verbatim'] else 'no, inferred from the record',
             e(', '.join(x['rules']) if x['rules'] else 'none, it is guidance')))
        if x.get('note'):
            w('<p class="dim">%s</p>' % e(x['note']))
    w('</div>')

    w('<div class="sec"><h2>The strings that have to change</h2>')
    w('<p>Old and new. The line is found by searching the file for the string, because '
      'four of these files were edited while this was being written.</p>')
    for h in db['handover']:
        line = locate(h['file'], h['old'].strip("'"))
        w('<h3>%s%s</h3>' % (e(h['file']),
                             ':%d' % line if line else ', not found, may be fixed already'))
        w('<p class="meta">bucket <i>%s</i> &nbsp; rule <i>%s</i>, from <i>%s</i></p>'
          % (e(h['bucket']), e(h['rule']), e(h['log'])))
        w('<div class="ba"><div class="k">old</div><div class="o">%s</div>'
          '<div class="k">new</div><div class="n">%s</div></div>'
          % (e(h['old']), e(h['new'])))
        w('<p>%s</p>' % e(h['why']))
        if h.get('note'):
            w('<p class="dim">%s</p>' % e(h['note']))
    w('</div>')

    w('<div class="sec"><h2>Not gateable, and named rather than dropped</h2>')
    w('<p>A rule nobody can express as a check is guidance. It is written down so the '
      'next writer is held to it, and it is not turned into a bad pattern, because a '
      'tool that lies is worse than no tool.</p>')
    for g in db['guidance']:
        w('<h3>%s</h3>' % e(g['id']))
        w('<p>%s</p>' % e(g['why']))
        w('<p class="dim">Why no pattern. %s</p>' % e(g['not_gateable']))
        w('<p class="meta">from <i>%s</i></p>' % e(', '.join(g['log'])))
    w('</div>')

    w('<div class="sec"><h2>What the sweep cannot check</h2>')
    w('<p>Four things, and they are the four that decide it. A green run means nothing '
      'above it is broken. It does not mean the line is good.</p>')
    w('<table><tr><th>Pass</th><th>What it asks</th></tr>')
    for a, b in [('Is it true', 'Whether the sentence overstates what the instrument '
                                'measured. No pattern reads a claim against a reading.'),
                 ('Is it one bucket', 'A string doing two jobs passes every pattern.'),
                 ('Does it land', 'Read it as Angela at level 5, Derek at 7, James at 3.'),
                 ('Rhythm', 'Where the sentence breaks. Read it out loud, standing up.')]:
        w('<tr><td><b>%s</b></td><td>%s</td></tr>' % (e(a), e(b)))
    w('</table></div>')
    w('</div></body></html>')
    return '\n'.join(o) + '\n'


def main():
    m = gate()
    os.chdir(ROOT)
    db = json.load(open(DB, encoding='utf-8'))
    found = sweep(m)
    st = stamp()
    open(os.path.join(ROOT, 'COPY-OBJECTIONS.md'), 'w',
         encoding='utf-8').write(md(db, found, st))
    open(os.path.join(ROOT, 'COPY-OBJECTIONS.html'), 'w',
         encoding='utf-8').write(htm(db, found, st))
    total = sum(len(v) for v in found.values())
    stop = sum(len(found.get(r['id'], [])) for r in db['rules']
               if r.get('gate') == 'objections' and r['severity'] == 'stop')
    print('COPY-OBJECTIONS.md and COPY-OBJECTIONS.html written.')
    print('%d objections, %d rules, %d guidance, %d findings, %d stopping a build.'
          % (len(db['log']), len(db['rules']), len(db['guidance']), total, stop))
    for h in db['handover']:
        if locate(h['file'], h['old'].strip("'")) is None:
            print('  handover string not found, may be fixed already: %s  %s'
                  % (h['file'], h['old'][:60]))
    return 0


if __name__ == '__main__':
    sys.exit(main())
