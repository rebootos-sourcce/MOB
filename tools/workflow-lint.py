#!/usr/bin/env python3
"""Workflow lint: .github/workflows/deploy.yml held to the shape it was ruled.

GitHub Actions rejects a bad expression only when the workflow runs, and a
workflow that runs but gates the wrong thing is never rejected at all. On 8
October deploy.yml ran on a push to main only, ran the engine gate only, and
published atuned.world whatever else was red. This file holds it to block 1 of
the cleanup, as patched on 9 October after two reviews found what the first
cut of this lint could not see:

  R1  Triggers. pull_request with no paths filter, so a docs only pull request
      still gets the checks and a required check never sits pending. push to
      main with no paths filter either, so every commit on main gets its own
      run and "its own run will deploy" is true. workflow_dispatch with an
      optional string input rollback_ref, whose description says an empty one
      is a normal run. Never pull_request_target, in any workflow here: it
      would publish a public preview of onboarding, the 2 October exposure,
      which only the owner can delete.
  R2  Jobs. gates-fast. gates-browser, the required browser gates, one matrix
      leg each. gates-report, the browser gates that report and hold nothing
      back yet. gates-pass, the one check branch protection will require.
      gates-report-summary, which shows each report only leg's result and
      warns on every one that is not green. deploy, which needs gates-pass and
      never waits for gates-report.
  R3  The FAQ page is staged for the live site (M48). FUNNEL_PAGES, in the
      workflow env, is the one list of built pages, and gates-fast and deploy
      both check it.
  R4  The deploy job. A missing Cloudflare secret fails it. A push publishes
      only while its commit is still the tip of main. A rollback takes only a
      full commit sha, on main, that Cloudflare Pages lists, a page at a time,
      as a production deployment whose last stage is deploy: success, and it
      says on the run page that the next push to main undoes it. The deploy
      command names --branch=main, so a rollback reaches production and not a
      preview. After the upload the job reads Cloudflare back and fails unless
      the newest production deployment is the commit it just published.
  R5  Every gate tees its log under $RUNNER_TEMP/gates, under pipefail, and
      tools/floors.js holds each count to its floor in tests/floors.json.
  R6  Every ${{ }} expression parses, uses only functions and contexts GitHub
      allows where it sits, and names only needs, inputs, matrix keys and env
      variables that exist.
  R7  Every job has a timeout. No run script has github.event, github.head_ref,
      github.base_ref, github.ref_name or inputs interpolated into it. No action
      from outside actions/ and github/.

Nothing that decides what runs or what is published is matched as text. A
small evaluator of GitHub's expression language, below, runs the job
conditions against every event this workflow can see. The run scripts are run
in bash, as the runner runs them: gates-pass against every combination of job
results; the deploy job's secrets check, its order check and its rollback
guard against stand-ins for gh and curl and a real git repository built for
the purpose; gates-report-summary against a stand-in list of this run's jobs.
Then the deploy job's steps are walked in order on every path into it.
Checking what a script does, not what it looks like.

    python3 tools/workflow-lint.py [path]      one FAIL line per broken check, exit 1
    python3 tools/workflow-lint.py --self-test break the file one way at a time,
                                               in memory, and prove each break fails
"""
import atexit
import copy
import glob
import json
import math
import os
import re
import shutil
import subprocess
import sys
import tempfile
import urllib.parse

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
WORKFLOW = os.path.join(ROOT, '.github', 'workflows', 'deploy.yml')

MAIN = 'refs/heads/main'
PR_REF = 'refs/pull/1/merge'
BRANCH = 'refs/heads/claude/some-branch'
ROLLBACK = '8f565af'

# gate: (command, least timeout in minutes). Each runs exactly once, in
# gates-browser, where a red run fails gates-pass and holds back the deploy, or
# in gates-report, which reports and holds nothing back. boot, collide and
# funnel, functional, design and monitor must sit in gates-browser. The rest may move
# there by a one line change, which this lint allows without an edit here.
BROWSER = {
    'boot':       ('node tests/boot.js',       20),
    'collide':    ('node tests/collide.js',    20),
    'funnel':     ('node tests/funnel.js',     20),
    'functional': ('node tests/functional.js', 45),
    'design':     ('node tests/design.js',     20),
    'monitor':    ('node tools/monitor.js',    20),
# the tests that guard the alpha work, report only until three green runs
    'copy':          ('node tests/copy.js', 20),
    'reset':         ('node tests/reset.js', 20),
    'storage':       ('node tests/storage.js', 20),
    'firstrelease':  ('node tests/firstrelease.js', 20),
    'landing':       ('node tests/landing.js', 20),
    'quit':          ('node tests/quit.js', 20),
    'voice':         ('node tests/voice.js', 20),
    'journey2':      ('node tests/journey2.js', 20),
    'onboarding2':   ('node tests/onboarding2.js', 20),
    'sniffpage':     ('node tests/sniffpage.js', 20),
    'srcchat':       ('node tests/srcchat.js', 20),
    'practitioner':  ('node tests/practitioner.js', 20),
    'release-screen': ('node tests/release-screen.js', 20),
    'release-percent': ('node tests/release-percent.js', 20),
    'unpack':        ('node tests/unpack.js', 20),
    'recordlink':    ('node tests/recordlink.js', 20),
    'golden':        ('node tests/golden.js', 20),
    'alpha-journey': ('ATUNED_ALPHA_QUIZ_ONLY=1 node tests/golden.js', 20),
    'valuefelt':     ('node tests/valuefelt.js', 20),
    'claims':        ('node tests/claims.js', 20),
    'discordfeedback': ('node tests/discordfeedback.js', 20),
}
# P0 Alpha acceptance: move to the blocking browser matrix, and mutation-test each
# one so a future refactor cannot silently return it to report-only.
ALWAYS_REQUIRED = ('boot', 'collide', 'funnel', 'functional', 'design', 'monitor', 'voice',
                   'storage', 'firstrelease', 'journey2', 'onboarding2', 'release-screen',
                   'alpha-journey')
GATE_JOBS = ['gates-fast', 'gates-browser']             # what gates-pass needs
MATRIX_JOBS = ['gates-browser', 'gates-report']
JOBS = ['gates-fast', 'gates-browser', 'gates-report', 'gates-pass',
        'gates-report-summary', 'deploy']
UNWAITED = ['gates-report', 'gates-report-summary']     # never in deploy's needs
BUILDS = [r'\./atuned_src/BUILD-engine\.sh\b', r'\./atuned_src/BUILD\.sh\b',
          r'\./funnel/BUILD-single\.sh\b']
FUNNEL_PAGES = ['atuned-funnel', 'atuned-quiz', 'atuned-about', 'atuned-buy',
                'atuned-faq']

INSTALL_CMD = 'npm install --no-audit --no-fund wrangler@4'
# --branch=main: without it wrangler names the upload's branch from
# `git rev-parse --abbrev-ref HEAD`, which reads HEAD after a checkout of a
# commit id, and Cloudflare makes an upload production only when that branch
# is the project's production branch. Read in wrangler 4.143.0's own source.
DEPLOY_CMD = 'npx wrangler pages deploy deploy --project-name=atuned --branch=main --commit-dirty=true'
# Cloudflare's list of the project's deployments. The stand-in curl below
# answers at most 25 to a page whatever per_page asks for, because no larger
# page size is known to be honoured, and the guard reads at most 6 pages.
CF_PATH = '/client/v4/accounts/%s/pages/projects/atuned/deployments'
CF_PAGE, CF_PAGES = 25, 6
# A rollback is a stopgap, said where the person dispatching it reads.
STOPGAP = ("The next push to main publishes main's tip over this rollback. "
           "Revert the bad commit on main to make it stay.")
FULL_SHA = 'Give a full commit sha that was published; branch names are not accepted.'
UNTRUSTED = (['github', 'event'], ['github', 'head_ref'], ['github', 'base_ref'], ['github', 'ref_name'])
STAGE_LINES = [
    'rm -rf deploy && mkdir deploy',
    'cp funnel/dist/atuned-funnel.html deploy/',
    'cp funnel/dist/atuned-quiz.html deploy/',
    'cp funnel/dist/atuned-about.html deploy/',
    'cp funnel/dist/atuned-buy.html deploy/',
    'cp source.html deploy/atuned.html',
    'cp funnel/dist/atuned-funnel.html deploy/index.html',
]
FAQ_LINE = 'cp funnel/dist/atuned-faq.html deploy/'
WARN = '::warning title=Gate not required yet::'
NEWER = 'a newer commit is on main, its own run will deploy'
ACTION_OWNERS = ('actions/', 'github/')

# ---------------------------------------------------------------------------
# GitHub's expression language: enough of it to parse every expression in a
# workflow and evaluate the ones that decide what runs.
# ---------------------------------------------------------------------------

class ExprError(Exception):
    pass


TOKEN = re.compile(r"""\s*(?:
     (?P<num>0x[0-9a-fA-F]+|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)
    |(?P<str>'(?:[^']|'')*')
    |(?P<op>==|!=|<=|>=|&&|\|\||[()\[\],.!<>*])
    |(?P<id>[A-Za-z_][A-Za-z0-9_-]*)
    )""", re.X)

STATUS = {'success', 'failure', 'always', 'cancelled'}
FUNCS = {'contains': (2, 2), 'startswith': (2, 2), 'endswith': (2, 2),
         'format': (1, 99), 'join': (1, 2), 'tojson': (1, 1),
         'fromjson': (1, 1), 'hashfiles': (1, 99), 'success': (0, 0),
         'failure': (0, 0), 'always': (0, 0), 'cancelled': (0, 0)}
CONTEXTS = {'github', 'env', 'vars', 'job', 'jobs', 'steps', 'runner',
            'secrets', 'strategy', 'matrix', 'needs', 'inputs'}


def tokenize(src):
    out, i = [], 0
    while src[i:].strip():
        m = TOKEN.match(src, i)
        if not m or m.end() == i:
            raise ExprError('cannot read %r' % src[i:].strip()[:24])
        i = m.end()
        out.append((m.lastgroup, m.group(m.lastgroup)))
    return out


class Parser:
    def __init__(self, src):
        self.t, self.i = tokenize(src), 0

    def isop(self, v):
        return self.i < len(self.t) and self.t[self.i] == ('op', v)

    def take(self, v=None):
        if self.i >= len(self.t):
            raise ExprError('the expression ends early')
        k, val = self.t[self.i]
        if v is not None and (k, val) != ('op', v):
            raise ExprError('expected %s, found %r' % (v, val))
        self.i += 1
        return k, val

    def parse(self):
        n = self.orx()
        if self.i != len(self.t):
            raise ExprError('unexpected %r' % self.t[self.i][1])
        return n

    def orx(self):
        n = self.andx()
        while self.isop('||'):
            self.i += 1
            n = ('or', n, self.andx())
        return n

    def andx(self):
        n = self.cmp()
        while self.isop('&&'):
            self.i += 1
            n = ('and', n, self.cmp())
        return n

    def cmp(self):
        n = self.unary()
        for op in ('==', '!=', '<=', '>=', '<', '>'):
            if self.isop(op):
                self.i += 1
                return ('cmp', op, n, self.unary())
        return n

    def unary(self):
        if self.isop('!'):
            self.i += 1
            return ('not', self.unary())
        return self.postfix()

    def postfix(self):
        n = self.primary()
        while True:
            if self.isop('.'):
                self.i += 1
                if self.isop('*'):
                    self.i += 1
                    n = ('star', n)
                    continue
                k, v = self.take()
                if k != 'id':
                    raise ExprError('expected a property name after a dot, found %r' % v)
                n = ('prop', n, v)
            elif self.isop('['):
                self.i += 1
                idx = self.orx()
                self.take(']')
                n = ('index', n, idx)
            else:
                return n

    def primary(self):
        k, v = self.take()
        if k == 'num':
            return ('lit', float(int(v, 16)) if v.lower().startswith('0x') else float(v))
        if k == 'str':
            return ('lit', v[1:-1].replace("''", "'"))
        if (k, v) == ('op', '('):
            n = self.orx()
            self.take(')')
            return n
        if k == 'id':
            low = v.lower()
            if low in ('true', 'false'):
                return ('lit', low == 'true')
            if low == 'null':
                return ('lit', None)
            if self.isop('('):
                self.i += 1
                args = []
                if not self.isop(')'):
                    args.append(self.orx())
                    while self.isop(','):
                        self.i += 1
                        args.append(self.orx())
                self.take(')')
                return ('call', low, args)
            return ('ctx', low)
        raise ExprError('unexpected %r' % v)


def nodes(n):
    yield n
    for c in n[1:]:
        if isinstance(c, tuple):
            yield from nodes(c)
        elif isinstance(c, list):
            for a in c:
                yield from nodes(a)


def calls(tree):
    return {n[1] for n in nodes(tree) if n[0] == 'call'}


def chain(n):
    if n[0] == 'ctx':
        return [n[1]]
    if n[0] == 'prop':
        c = chain(n[1])
        return None if c is None else c + [n[2].lower()]
    if n[0] == 'index' and n[2][0] == 'lit' and isinstance(n[2][1], str):
        c = chain(n[1])
        return None if c is None else c + [n[2][1].lower()]
    return None


def kind(v):
    if v is None:
        return 'null'
    if isinstance(v, bool):
        return 'bool'
    if isinstance(v, (int, float)):
        return 'num'
    if isinstance(v, str):
        return 'str'
    return 'obj'


def num(v):
    k = kind(v)
    if k == 'null':
        return 0.0
    if k == 'bool':
        return 1.0 if v else 0.0
    if k == 'num':
        return float(v)
    if k == 'str':
        s = v.strip()
        if not s:
            return 0.0
        try:
            return float(int(s, 16)) if s.lower().startswith('0x') else float(s)
        except ValueError:
            return math.nan
    return math.nan


def truthy(v):
    k = kind(v)
    if k in ('null', 'bool'):
        return bool(v)
    if k == 'num':
        return v != 0 and not math.isnan(v)
    if k == 'str':
        return v != ''
    return True


def eq(a, b):
    ka, kb = kind(a), kind(b)
    if ka == kb:
        if ka == 'str':
            return a.lower() == b.lower()
        if ka == 'obj':
            return a is b
        if ka == 'num':
            return float(a) == float(b)
        return a == b
    return num(a) == num(b)   # GitHub's loose equality: null and '' are both 0


def tostr(v):
    k = kind(v)
    if k == 'null':
        return ''
    if k == 'bool':
        return 'true' if v else 'false'
    if k == 'num':
        return str(int(v)) if float(v).is_integer() else repr(float(v))
    if k == 'str':
        return v
    return json.dumps(v, indent=2)


def lookup(obj, key):
    if isinstance(obj, dict):
        for k, v in obj.items():
            if str(k).lower() == str(key).lower():
                return v
        return None
    if isinstance(obj, list) and kind(key) == 'num':
        i = int(key)
        return obj[i] if 0 <= i < len(obj) else None
    return None


class Env:
    """What an expression can see: contexts, run status, and which files exist."""
    def __init__(self, ctx, status=None, files=None):
        self.ctx = {k.lower(): v for k, v in ctx.items()}
        self.status = status or {'cancelled': False, 'needs_ok': True, 'needs_failed': False}
        self.files = files


def call(name, args, env):
    if name not in FUNCS:
        raise ExprError('unknown function %s()' % name)
    lo, hi = FUNCS[name]
    if not lo <= len(args) <= hi:
        raise ExprError('%s() takes %d to %d arguments, given %d' % (name, lo, hi, len(args)))
    st = env.status
    if name == 'always':
        return True
    if name == 'cancelled':
        return st['cancelled']
    if name == 'success':
        return not st['cancelled'] and st['needs_ok']
    if name == 'failure':
        return st['needs_failed']
    if name == 'hashfiles':
        hit = False
        for a in args:
            p = tostr(a)
            if env.files is not None:
                hit = hit or p in env.files
            else:
                hit = hit or any(os.path.isfile(f) for f in glob.glob(os.path.join(ROOT, p)))
        return 'a3c1' if hit else ''
    if name == 'contains':
        if isinstance(args[0], list):
            return any(eq(x, args[1]) for x in args[0])
        return tostr(args[1]).lower() in tostr(args[0]).lower()
    if name == 'startswith':
        return tostr(args[0]).lower().startswith(tostr(args[1]).lower())
    if name == 'endswith':
        return tostr(args[0]).lower().endswith(tostr(args[1]).lower())
    if name == 'format':
        s = tostr(args[0]).replace('{{', '\0').replace('}}', '\1')
        for i, a in enumerate(args[1:]):
            s = s.replace('{%d}' % i, tostr(a))
        return s.replace('\0', '{').replace('\1', '}')
    if name == 'join':
        sep = tostr(args[1]) if len(args) > 1 else ','
        return sep.join(tostr(x) for x in args[0]) if isinstance(args[0], list) else tostr(args[0])
    if name == 'tojson':
        return json.dumps(args[0], indent=2)
    if name == 'fromjson':
        try:
            return json.loads(tostr(args[0]))
        except ValueError as e:
            raise ExprError('fromJSON of something that is not JSON: %s' % e)
    raise ExprError('unknown function %s()' % name)


def ev(n, env):
    t = n[0]
    if t == 'lit':
        return n[1]
    if t == 'ctx':
        return env.ctx.get(n[1])
    if t == 'prop':
        return lookup(ev(n[1], env), n[2])
    if t == 'index':
        return lookup(ev(n[1], env), ev(n[2], env))
    if t == 'star':
        o = ev(n[1], env)
        return list(o.values()) if isinstance(o, dict) else (o if isinstance(o, list) else [])
    if t == 'not':
        return not truthy(ev(n[1], env))
    if t == 'and':
        a = ev(n[1], env)
        return ev(n[2], env) if truthy(a) else a
    if t == 'or':
        a = ev(n[1], env)
        return a if truthy(a) else ev(n[2], env)
    if t == 'cmp':
        a, b = ev(n[2], env), ev(n[3], env)
        op = n[1]
        if op == '==':
            return eq(a, b)
        if op == '!=':
            return not eq(a, b)
        if kind(a) == kind(b) == 'str':
            a, b = a.lower(), b.lower()
        else:
            a, b = num(a), num(b)
        return {'<': a < b, '<=': a <= b, '>': a > b, '>=': a >= b}[op]
    if t == 'call':
        return call(n[1], [ev(a, env) for a in n[2]], env)
    raise ExprError('cannot evaluate %r' % (t,))


WRAPPED = re.compile(r'\s*\$\{\{(.*)\}\}\s*', re.S)
INLINE = re.compile(r'\$\{\{(.*?)\}\}', re.S)


def cond_source(src):
    """The expression an if: holds. GitHub reads the whole value as one
    expression, with or without ${{ }}. A value that mixes ${{ }} with bare
    text is a non empty string after substitution, which is always true."""
    if src is None:
        return 'success()'
    if isinstance(src, bool):
        return 'true' if src else 'false'
    s = str(src).strip()
    m = WRAPPED.fullmatch(s)
    if m and '}}' not in m.group(1):
        return m.group(1)
    if '${{' in s:
        raise ExprError('it mixes ${{ }} with bare text, which GitHub reads as a non empty string, so it is always true')
    return s


def condition(src, env):
    tree = Parser(cond_source(src)).parse()
    if not calls(tree) & STATUS:
        tree = ('and', ('call', 'success', []), tree)   # GitHub's implicit success() &&
    return truthy(ev(tree, env))


def render(value, env):
    if not isinstance(value, str):
        return value
    m = WRAPPED.fullmatch(value)
    if m and '}}' not in m.group(1):
        return ev(Parser(m.group(1)).parse(), env)
    return INLINE.sub(lambda mm: tostr(ev(Parser(mm.group(1)).parse(), env)), value)


# ---------------------------------------------------------------------------
# Reading the workflow
# ---------------------------------------------------------------------------

def on_key(doc):
    # PyYAML follows YAML 1.1, which reads a bare `on` as the boolean true.
    if 'on' in doc:
        return 'on'
    return True if True in doc else None


def triggers(doc):
    k = on_key(doc)
    on = doc.get(k) if k is not None else None
    if isinstance(on, str):
        return {on: None}
    if isinstance(on, list):
        return {x: None for x in on}
    return on if isinstance(on, dict) else {}


def as_list(v):
    if v is None:
        return []
    return v if isinstance(v, list) else [v]


def steps_of(job):
    return [s for s in (job.get('steps') or []) if isinstance(s, dict)]


def needs_of(job):
    return [str(n) for n in as_list(job.get('needs'))]


def legs(job):
    """The matrix combinations, by GitHub's include and exclude rules."""
    m = (job.get('strategy') or {}).get('matrix')
    if not isinstance(m, dict):
        return None
    dims = {k: as_list(v) for k, v in m.items() if k not in ('include', 'exclude')}
    combos = []
    if dims:
        combos = [{}]
        for k, vals in dims.items():
            combos = [dict(c, **{k: v}) for c in combos for v in vals]
        for ex in as_list(m.get('exclude')):
            combos = [c for c in combos if not all(c.get(k) == v for k, v in ex.items())]
    origs = [dict(c) for c in combos]
    for inc in as_list(m.get('include')):
        placed = False
        for c, o in zip(combos, origs):
            if o is not None and all(k not in o or o[k] == v for k, v in inc.items()):
                c.update(inc)
                placed = True
        if not placed:
            combos.append(dict(inc))
            origs.append(None)
    return combos


def static_env(leg=None, ref=MAIN, files=None):
    return Env({'github': {'event_name': 'push', 'ref': ref, 'repository': 'o/r'},
                'inputs': {}, 'matrix': leg or {}, 'env': {}, 'secrets': {},
                'vars': {}, 'runner': {'temp': '/tmp'}, 'needs': {},
                'steps': {}, 'job': {}, 'strategy': {}}, files=files)


def run_texts(job, leg=None):
    """(step index, step, run text with matrix values filled in), in order."""
    out, env = [], static_env(leg)
    for i, s in enumerate(steps_of(job)):
        r = s.get('run')
        if isinstance(r, str):
            try:
                txt = tostr(render(r, env))
            except ExprError:
                txt = r
            out.append((i, s, txt))
    return out


def find(texts, pattern, after=None):
    rx = re.compile(pattern)
    for i, s, t in texts:
        for m in rx.finditer(t):
            p = (i, m.start())
            if after is None or p > after:
                return p, m, s
    return None, None, None


def plain(rx):
    """a pattern as a person reads it, for a FAIL line"""
    return re.sub(r'\\b', '', rx).replace('\\', '')


def strings(v):
    if isinstance(v, str):
        yield v
    elif isinstance(v, dict):
        for x in v.values():
            yield from strings(x)
    elif isinstance(v, list):
        for x in v:
            yield from strings(x)


# ---------------------------------------------------------------------------
# Running a step's script here as the runner runs it. gh and curl are
# stand-ins that answer only the endpoints deploy.yml calls, from files this
# lint writes; anything else is the error the real service would give. jq is
# the real one, so every --jq filter in the file is run as written.
# ---------------------------------------------------------------------------

GH_STUB = r'''#!/usr/bin/env python3
import json, os, subprocess, sys
d = os.environ['FAKE_DIR']
args = sys.argv[1:]
with open(os.path.join(d, 'gh.calls'), 'a') as f:
    f.write(json.dumps(args) + '\n')
if not os.environ.get('GH_TOKEN'):
    sys.stderr.write('gh: To use GitHub CLI in a GitHub Actions workflow, set the GH_TOKEN environment variable.\n')
    sys.exit(4)
if not args or args[0] != 'api':
    sys.stderr.write('stand-in gh: only gh api is answered here\n')
    sys.exit(1)
jq, ep, i = None, None, 1
while i < len(args):
    a = args[i]
    if a in ('--jq', '-q'):
        jq = args[i + 1] if i + 1 < len(args) else ''
        i += 2
    elif a.startswith('--jq='):
        jq = a[5:]
        i += 1
    elif a in ('--paginate', '--silent', '--include', '-i'):
        i += 1
    elif a in ('-H', '--header', '-X', '--method', '-f', '-F', '--field', '--raw-field'):
        i += 2
    elif a.startswith('-'):
        sys.stderr.write('stand-in gh: unknown flag %s\n' % a)
        sys.exit(1)
    else:
        ep = a if ep is None else ep
        i += 1
if os.environ.get('FAKE_GH_FAIL'):
    sys.stderr.write('gh: Server Error (HTTP 502)\n')
    sys.exit(1)
repo = os.environ.get('GITHUB_REPOSITORY', '')
ep = (ep or '').lstrip('/').split('?')[0]
def git(*a):
    return subprocess.run(['git', '-C', os.environ.get('FAKE_REPO', '.')] + list(a), capture_output=True, text=True)
body = None
cmp = 'repos/%s/compare/main...' % repo
if ep == 'repos/%s/git/ref/heads/main' % repo:
    body = {'ref': 'refs/heads/main', 'object': {'type': 'commit', 'sha': os.environ.get('FAKE_TIP') or None}}
elif ep == 'repos/%s/actions/runs/%s/jobs' % (repo, os.environ.get('GITHUB_RUN_ID', '')):
    with open(os.path.join(d, 'jobs.json')) as f:
        body = json.load(f)
elif ep.startswith(cmp):
    h = git('rev-parse', '--verify', '--quiet', ep[len(cmp):] + '^{commit}')
    m = git('rev-parse', '--verify', '--quiet', 'refs/heads/main^{commit}')
    if h.returncode == 0 and m.returncode == 0:
        h, m = h.stdout.strip(), m.stdout.strip()
        if h == m:
            st = 'identical'
        elif git('merge-base', '--is-ancestor', h, m).returncode == 0:
            st = 'behind'
        elif git('merge-base', '--is-ancestor', m, h).returncode == 0:
            st = 'ahead'
        else:
            st = 'diverged'
        body = {'status': st, 'merge_base_commit': {'sha': git('merge-base', m, h).stdout.strip()}}
if body is None:
    sys.stderr.write('gh: Not Found (HTTP 404)\n')
    sys.exit(1)
text = json.dumps(body)
if jq is None:
    sys.stdout.write(text + '\n')
    sys.exit(0)
p = subprocess.run(['jq', '-r', jq], input=text, capture_output=True, text=True)
sys.stdout.write(p.stdout)
sys.stderr.write(p.stderr)
sys.exit(p.returncode)
'''

CURL_STUB = r'''#!/usr/bin/env python3
# Answers only Cloudflare's list of the atuned project's deployments: newest
# first, a page at a time and never more than 25 to a page whatever per_page
# asks for, since no larger page is known to be honoured. It returns every
# environment whatever env asks for, since that is not known to be honoured
# either: a script that trusts env=production alone takes a preview.
# cf.json holds one answer, or a list with one answer per call, the last one
# repeating. Like curl, it exits 22 on an HTTP error only when asked to fail,
# and otherwise prints the error body and exits 0.
import json, os, sys, urllib.parse
d = os.environ['FAKE_DIR']
args = sys.argv[1:]
hdrs, urls, fail, i = [], [], False, 0
while i < len(args):
    a = args[i]
    if a in ('-H', '--header'):
        hdrs.append(args[i + 1] if i + 1 < len(args) else '')
        i += 2
        continue
    if a in ('-o', '--output', '-w', '--write-out', '-X', '--request', '-d', '--data', '-A', '--user-agent'):
        i += 2
        continue
    if a in ('--fail', '--fail-with-body') or (a.startswith('-') and not a.startswith('--') and 'f' in a[1:]):
        fail = True
    elif not a.startswith('-'):
        urls.append(a)
    i += 1
log = os.path.join(d, 'curl.calls')
try:
    with open(log) as f:
        n = sum(1 for _ in f)
except OSError:
    n = 0
with open(log, 'a') as f:
    f.write(json.dumps({'headers': hdrs, 'urls': urls}) + '\n')
def answer(code, text):
    sys.stdout.write(text)
    sys.exit(22 if fail and code >= 400 else 0)
def err(msg):
    return json.dumps({'success': False, 'errors': [{'code': 10000, 'message': msg}], 'messages': [], 'result': None})
tok = os.environ.get('FAKE_CF_TOKEN', '')
acct = os.environ.get('FAKE_CF_ACCOUNT', '')
if len(urls) != 1:
    answer(400, err('one URL expected, given %r' % (urls,)))
u = urllib.parse.urlsplit(urls[0])
q = urllib.parse.parse_qs(u.query)
if not acct or (u.scheme, u.netloc, u.path) != ('https', 'api.cloudflare.com', '/client/v4/accounts/%s/pages/projects/atuned/deployments' % acct):
    answer(404, err('No route for %s' % urls[0]))
if not tok or ('Authorization: Bearer ' + tok) not in hdrs:
    answer(403, err('Authentication error'))
with open(os.path.join(d, 'cf.json')) as f:
    spec = json.load(f)
item = spec[min(n, len(spec) - 1)] if isinstance(spec, list) else spec
mode = item if isinstance(item, str) else os.environ.get('FAKE_CF', 'ok')
if mode == 'down':
    answer(500, err('Internal server error'))
if mode == 'garbage':
    answer(502, '<html><body>502 Bad Gateway</body></html>\n')
body = item if isinstance(item, dict) else {}
try:
    page = int(q.get('page', ['1'])[0])
    per = max(1, min(int(q.get('per_page', ['25'])[0]), 25))
except ValueError:
    answer(400, err('page and per_page must be numbers'))
rows = list(body.get('result') or [])
rows.sort(key=lambda r: r.get('created_on', ''), reverse=True)
chunk = rows[(page - 1) * per:page * per] if page >= 1 else []
out = dict(body, result=chunk, result_info={'page': page, 'per_page': per, 'count': len(chunk), 'total_count': len(rows)})
if mode == 'refused':
    out.update(success=False, errors=[{'code': 8000000, 'message': 'refused'}])
answer(200, json.dumps(out))
'''

# A stand-in for sleep that waits for nothing and writes down how long it was
# asked to wait, so a retry's bound is measured and the lint stays fast.
SLEEP_STUB = '''#!/bin/sh
echo "$1" >> "$FAKE_DIR/sleep.calls"
'''

_TMP = []
_RUNS = {}
_FIXTURE = []


def tmproot():
    if not _TMP:
        root = tempfile.mkdtemp(prefix='workflow-lint-')
        atexit.register(shutil.rmtree, root, True)
        make_root(root)
    return _TMP[0]


def make_root(root):
    """the stand-ins, in a fresh directory that the scratch repository and
    every run's files go under"""
    _TMP[:] = [root]
    _FIXTURE.clear()
    b = os.path.join(root, 'bin')
    os.makedirs(b)
    # The python stand-ins run under this interpreter, isolated and without
    # site packages, so nothing on the machine's own path changes what they do.
    for name, src in (('gh', GH_STUB), ('curl', CURL_STUB), ('sleep', SLEEP_STUB)):
        p = os.path.join(b, name)
        if src.startswith('#!/usr/bin/env python3\n'):
            src = '#!%s -IS\n' % sys.executable + src.split('\n', 1)[1]
        with open(p, 'w') as f:
            f.write(src)
        os.chmod(p, 0o755)
    return root


def base_env():
    root = tmproot()
    return {'PATH': os.path.join(root, 'bin') + os.pathsep + os.environ.get('PATH', '/usr/bin:/bin'),
            'HOME': root, 'LANG': 'C.UTF-8', 'GIT_CONFIG_NOSYSTEM': '1',
            'GITHUB_REPOSITORY': 'o/r', 'GITHUB_RUN_ID': '4242', 'GITHUB_RUN_ATTEMPT': '1',
            'GITHUB_EVENT_NAME': 'push', 'GITHUB_REF': MAIN, 'GITHUB_SHA': 'a' * 40}


class Ran:
    def __init__(self, code, out, outputs, summary, calls):
        self.code, self.out, self.outputs, self.summary, self.calls = code, out, outputs, summary, calls

    def lines(self):
        return [l.strip() for l in self.out.split('\n')]


def run_script(key, script, env, cwd=None, files=None, before=None, after=None):
    """script under GitHub's own bash, --noprofile --norc -eo pipefail, with a
    fresh $GITHUB_OUTPUT and $GITHUB_STEP_SUMMARY. Remembered by key."""
    k = (key, script, tuple(sorted((a, b) for a, b in env.items() if a not in ('FAKE_REPO',))), json.dumps(files, sort_keys=True))
    if k in _RUNS:
        return _RUNS[k]
    d = tempfile.mkdtemp(dir=tmproot())
    for name, data in (files or {}).items():
        with open(os.path.join(d, name), 'w') as f:
            f.write(data if isinstance(data, str) else json.dumps(data))
    full = dict(base_env(), **env)
    full.update(FAKE_DIR=d, GITHUB_OUTPUT=os.path.join(d, 'output'), GITHUB_STEP_SUMMARY=os.path.join(d, 'summary'))
    if before:
        before()
    try:
        p = subprocess.run(['bash', '--noprofile', '--norc', '-eo', 'pipefail', '-c', script],
                           env=full, cwd=cwd, capture_output=True, text=True, timeout=60)
        code, out = p.returncode, p.stdout + p.stderr
    except (OSError, subprocess.TimeoutExpired) as e:
        code, out = -1, str(e)
    extra = after() if after else None

    def read(name):
        try:
            with open(os.path.join(d, name)) as f:
                return f.read()
        except OSError:
            return ''
    outputs = {}
    for line in read('output').split('\n'):
        if '=' in line:
            a, b = line.split('=', 1)
            outputs[a.strip()] = b.strip()
    def waited(text):
        try:
            return float(text)
        except ValueError:
            return float('inf')   # sleep with no number, or a unit: not a bounded wait this lint can add up
    calls = {'gh': [json.loads(l) for l in read('gh.calls').split('\n') if l],
             'curl': [json.loads(l) for l in read('curl.calls').split('\n') if l],
             'sleep': [waited(l.strip()) for l in read('sleep.calls').split('\n') if l.strip()],
             'after': extra}
    r = Ran(code, out, outputs, read('summary'), calls)
    _RUNS[k] = r
    return r


def last(out):
    ls = [l for l in out.strip().split('\n') if l.strip()]
    return ls[-1].strip()[:160] if ls else 'nothing'


GIT_ENV = {'GIT_AUTHOR_NAME': 'lint', 'GIT_AUTHOR_EMAIL': 'lint@example.invalid',
           'GIT_COMMITTER_NAME': 'lint', 'GIT_COMMITTER_EMAIL': 'lint@example.invalid',
           'GIT_AUTHOR_DATE': '2026-10-09T12:00:00Z', 'GIT_COMMITTER_DATE': '2026-10-09T12:00:00Z'}


def fixture():
    """A repository like the one a rollback checks out: main is A B C D E, E its
    tip, and the branch side carries S, made off B and never merged. Each
    commit writes its own letter to f.txt, so the tree says which is out."""
    if not _FIXTURE:
        r = os.path.join(tmproot(), 'repo')
        os.makedirs(r)
        env = dict(base_env(), **GIT_ENV)

        def g(*a):
            return subprocess.run(['git', '-C', r] + list(a), env=env, capture_output=True,
                                  text=True, check=True).stdout.strip()
        g('init', '-q', '-b', 'main')
        sh = {}
        for n in 'ABCDES':
            if n == 'S':
                g('checkout', '-q', '-b', 'side', sh['B'])
            with open(os.path.join(r, 'f.txt'), 'w') as f:
                f.write(n)
            g('add', 'f.txt')
            g('commit', '-q', '-m', n)
            sh[n] = g('rev-parse', 'HEAD')
        g('checkout', '-q', 'main')
        _FIXTURE.append((r, sh, g))
    return _FIXTURE[0]


def cf_body(entries):
    """Cloudflare's list of deployments, newest first: (commit, environment, last
    stage status) or (commit, environment, last stage status, last stage name).
    Each is ten minutes older than the one before it."""
    rows = []
    for i, e in enumerate(entries):
        sha, env, status = e[:3]
        stage = e[3] if len(e) > 3 else 'deploy'
        t = 9 * 24 * 60 - 10 * i   # minutes into October, so entry 0 is the newest
        rows.append({'id': 'dep-%d' % i, 'url': 'https://%x.atuned.pages.dev' % (0x1000 + i),
                     'environment': env,
                     'created_on': '2026-10-%02dT%02d:%02d:00.%06dZ' % (t // 1440 + 1, t // 60 % 24, t % 60, 123456),
                     'deployment_trigger': {'type': 'ad_hoc', 'metadata': {
                         'branch': 'main' if env == 'production' else 'HEAD',
                         'commit_hash': sha, 'commit_message': 'x', 'commit_dirty': True}},
                     'latest_stage': {'name': stage, 'status': status}, 'stages': []})
    return {'success': True, 'errors': [], 'messages': [], 'result': rows,
            'result_info': {'page': 1, 'per_page': 25, 'count': len(rows), 'total_count': len(rows)}}


def filler(n, start=0):
    """n production deployments of commits that are not in the fixture"""
    return [('%040x' % (0xc0ffee00 + start + i), 'production', 'success') for i in range(n)]


def ctx_for(event, ref, rollback=None, tok='t', acct='a', sha='a' * 40):
    return {'github': {'event_name': event, 'ref': ref, 'repository': 'o/r', 'sha': sha, 'token': 'ghs_lint'},
            'inputs': {'rollback_ref': rollback} if event == 'workflow_dispatch' else {},
            'secrets': {'CLOUDFLARE_API_TOKEN': tok, 'CLOUDFLARE_ACCOUNT_ID': acct},
            'vars': {}, 'matrix': {}, 'needs': {}, 'steps': {}, 'env': {}, 'job': {},
            'runner': {'temp': '/tmp'}, 'strategy': {}}


# ---------------------------------------------------------------------------
# The checks
# ---------------------------------------------------------------------------

class Lint:
    def __init__(self, doc, root=ROOT, text=None):
        self.doc, self.root, self.text = doc, root, text
        self.passed, self.fails = 0, []

    def ok(self, cond, msg):
        if cond:
            self.passed += 1
        elif msg not in self.fails:
            self.fails.append(msg)
        return cond

    def jobs(self):
        j = self.doc.get('jobs')
        return j if isinstance(j, dict) else {}

    def job(self, jid):
        j = self.jobs().get(jid)
        return j if isinstance(j, dict) else None

    def step_env(self, job, step, ctx):
        """the env a step's script sees, as GitHub merges it: workflow, job, step"""
        env, out = Env(ctx), {}
        for d in (self.doc.get('env'), job.get('env'), step.get('env')):
            if isinstance(d, dict):
                for k, v in d.items():
                    out[str(k)] = tostr(render(v, env))
        return out

    def script(self, job, step, ctx, key, extra=None, **kw):
        """run one step's script with the env it would see under ctx"""
        try:
            text = tostr(render(step.get('run'), Env(ctx)))
            env = self.step_env(job, step, ctx)
        except ExprError as e:
            return Ran(1, 'expression error: %s' % e, {}, '', {'gh': [], 'curl': [], 'after': None})
        env.update({'GITHUB_REF': ctx['github']['ref'], 'GITHUB_EVENT_NAME': ctx['github']['event_name'],
                    'GITHUB_SHA': ctx['github'].get('sha', 'a' * 40)})
        env.update(extra or {})
        return run_script(key, text, env, **kw)

    def closure(self, jid):
        seen, todo = set(), [jid]
        while todo:
            for n in needs_of(self.job(todo.pop()) or {}):
                if n not in seen:
                    seen.add(n)
                    todo.append(n)
        return seen

    # R1 -------------------------------------------------------------------
    def r1_triggers(self, other_workflows):
        on = triggers(self.doc)
        self.ok('pull_request_target' not in on,
                'R1 pull_request_target is a trigger. It runs with secrets on code from a pull request and would publish a public preview of onboarding.')
        for path, other in other_workflows:
            self.ok('pull_request_target' not in triggers(other),
                    'R1 %s uses pull_request_target, which would publish a public preview of onboarding.' % path)
        if self.ok('pull_request' in on, 'R1 no pull_request trigger, so nothing runs on a pull request.'):
            pr = on['pull_request'] or {}
            self.ok(isinstance(pr, dict) and 'paths' not in pr and 'paths-ignore' not in pr,
                    'R1 pull_request has a paths filter, so a docs only pull request gets no checks and a required check sits pending for ever.')
        if self.ok('push' in on, 'R1 no push trigger, so a merge to main never deploys.'):
            push = on['push'] or {}
            self.ok(as_list(push.get('branches')) == ['main'] and 'branches-ignore' not in push and 'tags' not in push,
                    'R1 push must trigger on main and nothing else; found branches %r.' % (push.get('branches'),))
            self.ok(isinstance(push, dict) and 'paths' not in push and 'paths-ignore' not in push,
                    'R1 push has a paths filter. A push to main that touches only docs or a built file then gets no run, so an older commit whose order check said "its own run will deploy" never goes live.')
        wd = on.get('workflow_dispatch') if 'workflow_dispatch' in on else False
        if self.ok(wd is not False, 'R1 no workflow_dispatch trigger, so there is no rollback route.'):
            inp = ((wd or {}).get('inputs') or {}).get('rollback_ref')
            if self.ok(isinstance(inp, dict) and inp.get('type') == 'string' and not inp.get('required')
                       and inp.get('default', '') == '',
                       'R1 workflow_dispatch has no optional string input rollback_ref with an empty default.'):
                desc = ' '.join(str(inp.get('description', '')).split()).lower()
                self.ok('full commit sha' in desc and 'empty' in desc and 'every gate runs' in desc and "main's tip publishes" in desc,
                        "R1 the rollback_ref description must say it takes a full commit sha, and that left empty it is a normal run: every gate runs and main's tip publishes. A person who meant to roll back and left it empty republishes main.")
        if self.text is not None:
            said = ' '.join(' '.join(l.strip()[1:].split()) for l in self.text.split('\n') if l.strip().startswith('#'))
            self.ok(' '.join(STOPGAP.split()) in said,
                    'R1 no comment in the file says: %s' % STOPGAP)

    # R2, the job conditions, simulated -------------------------------------
    def simulate(self, event, ref, rollback, results, cancelled):
        jobs, out, pending = self.jobs(), {}, list(self.jobs())
        inputs = {'rollback_ref': rollback} if event == 'workflow_dispatch' else {}
        github = {'event_name': event, 'ref': ref, 'repository': 'o/r', 'sha': 'a' * 40, 'token': 'ghs_lint'}
        guard = 0
        while pending and guard < 100:
            guard += 1
            for jid in list(pending):
                job = jobs[jid] if isinstance(jobs[jid], dict) else {}
                nd = needs_of(job)
                if any(n not in out for n in nd if n in jobs):
                    continue
                pending.remove(jid)
                nres = {n: out.get(n, 'skipped') for n in nd}
                status = {'cancelled': cancelled,
                          'needs_ok': all(r == 'success' for r in nres.values()),
                          'needs_failed': any(r == 'failure' for r in nres.values())}
                ctx = {'github': github, 'inputs': inputs, 'vars': {},
                       'needs': {n: {'result': r, 'outputs': {}} for n, r in nres.items()}}
                try:
                    runs = condition(job.get('if'), Env(ctx, status))
                except ExprError:
                    runs = False
                if not runs:
                    out[jid] = 'skipped'
                elif jid == 'gates-pass':
                    out[jid] = self.run_pass(job, ctx, nres)
                else:
                    out[jid] = 'cancelled' if cancelled else results.get(jid, 'success')
        return out

    def pass_run(self, job, ctx):
        st = steps_of(job)
        if len(st) != 1 or not isinstance(st[0].get('run'), str):
            return None
        c = dict(ctx_for(ctx['github']['event_name'], ctx['github']['ref']), **ctx)
        return self.script(job, st[0], c, 'gates-pass')

    def run_pass(self, job, ctx, nres):
        r = self.pass_run(job, ctx)
        if r is None:   # malformed, failed below; judged as an honest one would be
            return 'success' if all(v == 'success' for v in nres.values()) else 'failure'
        return 'success' if r.code == 0 else 'failure'

    def r2_conditions(self):
        jobs = self.jobs()
        missing = [j for j in JOBS if j not in jobs]
        if not self.ok(not missing, 'R2 missing job%s %s, so the run conditions cannot be checked.' % ('s' if len(missing) > 1 else '', ', '.join(missing))):
            return
        def res(fast='success', browser='success', report='success'):
            return {'gates-fast': fast, 'gates-browser': browser, 'gates-report': report}
        OKR, RAN, SK = res(), 'ran', 'skipped'
        ALL = {'gates-fast': RAN, 'gates-browser': RAN, 'gates-report': RAN, 'gates-report-summary': RAN}
        NONE = {'gates-fast': SK, 'gates-browser': SK, 'gates-report': SK, 'gates-pass': SK, 'gates-report-summary': SK}
        scenarios = [
            ('a pull request', 'pull_request', PR_REF, None, OKR, False,
             dict(ALL, **{'gates-pass': 'success', 'deploy': SK})),
            ('a pull request with a red fast gate', 'pull_request', PR_REF, None, res(fast='failure'), False,
             {'gates-pass': 'failure', 'gates-report-summary': RAN, 'deploy': SK}),
            ('a pull request with a red browser gate', 'pull_request', PR_REF, None, res(browser='failure'), False,
             {'gates-pass': 'failure', 'deploy': SK}),
            ('a pull request with a red report gate', 'pull_request', PR_REF, None, res(report='failure'), False,
             {'gates-pass': 'success', 'gates-report-summary': RAN, 'deploy': SK}),
            ('a pull request, cancelled', 'pull_request', PR_REF, None, OKR, True,
             {'gates-pass': 'failure', 'deploy': SK}),
            ('a push to main', 'push', MAIN, None, OKR, False,
             dict(ALL, **{'gates-pass': 'success', 'deploy': RAN})),
            ('a push to main with a red fast gate', 'push', MAIN, None, res(fast='failure'), False,
             {'gates-pass': 'failure', 'deploy': SK}),
            ('a push to main with a red browser gate', 'push', MAIN, None, res(browser='failure'), False,
             {'gates-pass': 'failure', 'deploy': SK}),
            ('a push to main with a cancelled browser gate', 'push', MAIN, None, res(browser='cancelled'), False,
             {'gates-pass': 'failure', 'deploy': SK}),
            ('a push to main with a red report gate', 'push', MAIN, None, res(report='failure'), False,
             {'gates-pass': 'success', 'gates-report-summary': RAN, 'deploy': RAN}),
            ('a push to main with a cancelled report gate', 'push', MAIN, None, res(report='cancelled'), False,
             {'gates-pass': 'success', 'gates-report-summary': RAN, 'deploy': RAN}),
            ('a push to main, cancelled', 'push', MAIN, None, OKR, True,
             {'deploy': SK}),
            ('a push to a branch', 'push', BRANCH, None, OKR, False,
             {'deploy': SK}),
            ('a dispatch on main with no rollback_ref', 'workflow_dispatch', MAIN, '', OKR, False,
             dict(ALL, **{'gates-pass': 'success', 'deploy': RAN})),
            ('a dispatch on main with no rollback_ref and a red gate', 'workflow_dispatch', MAIN, '', res(browser='failure'), False,
             {'gates-pass': 'failure', 'deploy': SK}),
            ('a dispatch on a branch with no rollback_ref', 'workflow_dispatch', BRANCH, '', OKR, False,
             {'gates-fast': RAN, 'gates-pass': 'success', 'deploy': SK}),
            ('a rollback dispatch', 'workflow_dispatch', MAIN, ROLLBACK, OKR, False,
             dict(NONE, deploy=RAN)),
            ('a rollback dispatch on a branch', 'workflow_dispatch', BRANCH, ROLLBACK, OKR, False,
             dict(NONE, deploy=RAN)),
            ('a rollback dispatch, cancelled', 'workflow_dispatch', MAIN, ROLLBACK, OKR, True,
             {'deploy': SK}),
        ]
        for name, event, ref, rb, results, cancelled, expect in scenarios:
            got = self.simulate(event, ref, rb, results, cancelled)
            for jid, want in expect.items():
                g = got.get(jid, SK)
                hit = (g != SK) if want == RAN else (g == want)
                self.ok(hit, 'R2 on %s, %s is %s; it must be %s.' % (
                    name, jid, 'run' if g != SK and want in (RAN, SK) else g,
                    'run' if want == RAN else want))
        up = self.closure('deploy')
        self.ok('gates-pass' in up and not (set(UNWAITED) & up),
                'R2 deploy waits for %s. It must need gates-pass and never gates-report or gates-report-summary, which hold nothing back, so a deploy never waits for them.' % (', '.join(sorted(up)) or 'nothing'))

    # R2, gates-pass's own step against every combination of results --------
    def r2_pass_step(self):
        job = self.job('gates-pass')
        if not job:
            return
        nd = needs_of(job)
        self.ok(all(g in nd for g in GATE_JOBS), 'R2 gates-pass does not need %s.' % ', '.join(g for g in GATE_JOBS if g not in nd))
        rep = [n for n in nd if n.startswith('gates-report')]
        self.ok(not rep, 'R2 gates-pass needs %s, a report only job, so a red report gate would hold back the deploy and every deploy waits for it.' % ', '.join(rep))
        self.ok(job.get('name') in (None, 'gates-pass'),
                'R2 gates-pass is renamed %r; branch protection will require the check by the name gates-pass.' % job.get('name'))
        st = steps_of(job)
        if not self.ok(len(st) == 1 and isinstance(st[0].get('run'), str) and 'uses' not in st[0],
                       'R2 gates-pass must be a single run step.'):
            return
        results = ['success', 'failure', 'cancelled', 'skipped']
        for a in results:
            for b in results:
                nres = {n: 'success' for n in nd}
                nres.update({'gates-fast': a, 'gates-browser': b})
                ctx = {'github': {'event_name': 'pull_request', 'ref': PR_REF}, 'inputs': {}, 'vars': {},
                       'needs': {n: {'result': r, 'outputs': {}} for n, r in nres.items()}}
                r = self.pass_run(job, ctx)
                want = 'success' if a == b == 'success' else 'failure'
                got = 'success' if r.code == 0 else 'failure'
                self.ok(got == want, 'R2 the gates-pass step reads %s when gates-fast is %s and gates-browser is %s; a skipped or cancelled required job is a failure.' % (got, a, b))
                for n in nd:
                    v = nres.get(n)
                    self.ok(any(l.startswith(n) and re.search(r'\b%s\b' % v, l) for l in r.lines()),
                            'R2 gates-pass does not print a line naming %s and its result (%s).' % (n, v))
                    self.ok(re.search(r'^\|\s*%s\s*\|\s*%s\s*\|\s*$' % (re.escape(n), v), r.summary, re.M) is not None,
                            'R2 gates-pass does not write the row | %s | %s | to $GITHUB_STEP_SUMMARY, so the run page does not show it.' % (n, v))

    # R2 and R5, what each gate job runs, in what order ----------------------
    def common(self, where, job, texts, leg=None):
        st = steps_of(job)
        self.ok(any(str(s.get('uses', '')).startswith('actions/checkout@') for s in st),
                'R2 %s does not check out the code.' % where)
        self.ok(any(str(s.get('uses', '')).startswith('actions/setup-node@')
                    and tostr((s.get('with') or {}).get('node-version')) == '22' for s in st),
                'R2 %s does not set up node 22.' % where)
        p_ts, _, _ = find(texts, r'npm install\b[^\n]*\btypescript\b')
        self.ok(p_ts is not None, "R2 %s does not install typescript, which BUILD.sh's comment stripper (tools/slim.py) needs." % where)
        pos = [find(texts, b)[0] for b in BUILDS]
        if self.ok(None not in pos, 'R2 %s does not run all three builds (BUILD-engine.sh, BUILD.sh, funnel/BUILD-single.sh).' % where):
            self.ok(pos[0] < pos[1] < pos[2],
                    'R2 %s builds out of order. It must be BUILD-engine.sh, then BUILD.sh, then funnel/BUILD-single.sh: tests/claims.js and the quiz read engine.js.' % where)
            self.ok(p_ts is None or p_ts < pos[1], 'R2 %s installs typescript after BUILD.sh needs it.' % where)
        return pos[2] if None not in pos else None

    def teed(self, where, texts, cmd_rx, log, after=None):
        """the gate runs, after `after`, with its output teed to its log"""
        p, m, step = find(texts, cmd_rx, after)
        if not self.ok(p is not None, 'R2 %s does not run %s%s.' % (where, plain(cmd_rx), ' after the builds' if after else '')):
            return None
        line = m.string[m.start():].split('\n', 1)[0]
        self.ok(re.search(r'\|\s*tee\b[^\n]*\$\{?RUNNER_TEMP\}?/gates/' + re.escape(log) + r'\b', line) is not None,
                'R5 %s does not tee %s to $RUNNER_TEMP/gates/%s, so tools/floors.js has nothing to read.' % (where, plain(cmd_rx), log))
        mk, _, _ = find(texts, r'mkdir -p\s+"?\$\{?RUNNER_TEMP\}?/gates\b')
        self.ok(mk is not None and mk <= p,
                'R5 %s writes to $RUNNER_TEMP/gates before making it, and tee fails on a missing directory.' % where)
        return p

    def floors_args(self, texts):
        out = []
        for i, s, t in texts:
            for m in re.finditer(r'node tools/floors\.js\b([^\n;&|]*)', t):
                args = m.group(1).split()
                if '--self-test' not in args:
                    out.append(((i, m.start()), [a for a in args if not a.startswith('-')]))
        return out

    def floors_known(self, where, names):
        path = os.path.join(self.root, 'tests', 'floors.json')
        try:
            with open(path) as f:
                fl = json.load(f)
        except (OSError, ValueError) as e:
            self.ok(False, 'R5 tests/floors.json cannot be read (%s), so no gate has a floor.' % e.__class__.__name__)
            return
        known = set((fl.get('floors') or {})) | set((fl.get('no_count') or {}))
        for n in names:
            self.ok(n in known, 'R5 %s checks the floor of %s, which tests/floors.json does not name.' % (where, n))

    def r2_fast(self):
        job = self.job('gates-fast')
        if not job:
            return
        texts = run_texts(job)
        built = self.common('gates-fast', job, texts)
        p, m, s = find(texts, r'npm ci\b')
        q, _, s2 = find(texts, r'npm test\b')
        if self.ok(p is not None and q is not None and p < q, 'R2 gates-fast does not run the funnel package with npm ci, then npm test.'):
            wd = str(s2.get('working-directory', ''))
            self.ok(wd == 'atuned_funnel_system' or re.search(r'cd\s+atuned_funnel_system\b', s2.get('run', '')) is not None,
                    'R2 gates-fast runs npm test outside atuned_funnel_system.')
            self.teed('gates-fast', texts, r'npm test\b', 'funnel-package.log')
        pe = self.teed('gates-fast', texts, r'node tests/engine\.js\b', 'engine.log', built)
        self.ok(find(texts, r'python3 \.claude/skills/atuned-voice/check\.py --objections\b')[0] is not None,
                'R2 gates-fast does not run the voice check, python3 .claude/skills/atuned-voice/check.py --objections.')
        self.ok(find(texts, r'python3 tools/workflow-lint\.py\b')[0] is not None,
                'R2 gates-fast does not run this lint, python3 tools/workflow-lint.py.')
        p, _, s = find(texts, r'node tests/chrome-path\.js\b')
        if self.ok(p is not None, 'R2 gates-fast does not run node tests/chrome-path.js.'):
            self.ok('if' not in s,
                    'R2 the chrome-path step has if: %s. It takes no if of any kind: one that skips it when its file is gone, or on a pull request, reads green.' % (s.get('if'),))
        fa = self.floors_args(texts)
        want = ['engine', 'funnel-package']
        hit = [a for a in fa if all(w in a[1] for w in want)]
        if self.ok(hit, 'R5 gates-fast does not run node tools/floors.js engine funnel-package.'):
            self.ok(pe is not None and hit[0][0] > pe, 'R5 gates-fast checks the floors before the gates have run.')
            self.floors_known('gates-fast', hit[0][1])
        self.ok(os.path.isfile(os.path.join(self.root, 'tools', 'floors.js')), 'R5 tools/floors.js does not exist.')

    def r2_matrix(self):
        seen = {}
        for jid in MATRIX_JOBS:
            job = self.job(jid)
            if not job:
                continue
            strat = job.get('strategy') or {}
            self.ok(strat.get('fail-fast') is False,
                    'R2 %s does not set fail-fast: false, so one red gate cancels the others and hides what else is red.' % jid)
            ls = legs(job)
            if not self.ok(ls, 'R2 %s has no matrix.' % jid):
                continue
            for leg in ls:
                g = str(leg.get('gate'))
                seen.setdefault(g, []).append(jid)
                where = '%s (%s)' % (jid, g)
                env = static_env(leg)
                try:
                    name = tostr(render(job.get('name'), env)) if job.get('name') is not None else None
                    t = render(job.get('timeout-minutes'), env)
                    coe = render(job.get('continue-on-error', False), env)
                except ExprError:
                    name, t, coe = None, None, None
                self.ok(name == where,
                        'R2 %s is named %r. It must be named %s, from name: %s (${{ matrix.gate }}): gates-report-summary finds each leg by that name.' % (where, name, where, jid))
                if g not in BROWSER:
                    continue
                cmd, minutes = BROWSER[g]
                self.ok(t is not None and minutes <= num(t) <= 360,
                        'R2 %s has timeout-minutes %s; it must be at least %d, and GitHub stops a job at 360.' % (where, tostr(t) or 'unset', minutes))
                if jid == 'gates-browser':
                    self.ok(coe is not None and not truthy(coe),
                            'R2 %s has continue-on-error %s. gates-browser holds the required gates, so a red one must fail gates-pass; a gate that only reports goes in gates-report.' % (where, tostr(coe)))
                else:
                    self.ok(coe is not None and truthy(coe),
                            'R2 %s has continue-on-error %s; it must be true. gates-report only reports, and nothing that publishes waits for it.' % (where, tostr(coe)))
                texts = run_texts(job, leg)
                built = self.common(where, job, texts, leg)
                pg = self.teed(where, texts, re.escape(cmd) + r'\b', g + '.log', built)
                before = lambda p: p is not None and (pg is None or p < pg)
                self.ok(before(find(texts, r'npm install -g\b[^\n]*\bplaywright@1\.56\.1\b')[0]),
                        'R2 %s does not install playwright@1.56.1 globally before the gate.' % where)
                self.ok(before(find(texts, r'npx playwright install --with-deps chromium\b')[0]),
                        'R2 %s does not run npx playwright install --with-deps chromium before the gate.' % where)
                self.ok(any('NODE_PATH' in t and 'npm root -g' in t and 'GITHUB_ENV' in t and (pg is None or i < pg[0]) for i, _, t in texts),
                        'R2 %s does not set NODE_PATH to $(npm root -g) through $GITHUB_ENV before the gate.' % where)
                self.ok(any(re.search(r'\bCHROME\b', t) and 'chromium.executablePath()' in t and 'GITHUB_ENV' in t and (pg is None or i < pg[0]) for i, _, t in texts),
                        "R2 %s does not set CHROME to playwright's chromium.executablePath() through $GITHUB_ENV before the gate." % where)
                fa = [a for a in self.floors_args(texts) if g in a[1]]
                if self.ok(fa, 'R5 %s does not run node tools/floors.js %s.' % (where, g)):
                    self.ok(pg is not None and fa[0][0] > pg, 'R5 %s checks its floor before the gate has run.' % where)
                    self.floors_known(where, [g])
        self.ok(sorted(seen) == sorted(BROWSER) and all(len(v) == 1 for v in seen.values()),
                'R2 the browser gates run are %s; each of %s must run exactly once, in gates-browser or in gates-report.' % (
                    ', '.join('%s in %s' % (g, ' and '.join(v)) for g, v in sorted(seen.items())) or 'none', ', '.join(BROWSER)))
        for g in ALWAYS_REQUIRED:
            self.ok(seen.get(g) == ['gates-browser'],
                    'R2 %s runs in %s; it must run in gates-browser, where a red run holds back the deploy.' % (g, ' and '.join(seen.get(g, [])) or 'neither'))

    # R2, the report only legs, shown and warned on -------------------------
    def r2_report_summary(self):
        job, rep = self.job('gates-report-summary'), self.job('gates-report')
        if not job or not rep:
            return
        self.ok('gates-report' in needs_of(job),
                'R2 gates-report-summary does not need gates-report, so it can run before the legs it reports have finished.')
        perms = job.get('permissions')
        self.ok(isinstance(perms, dict) and str(perms.get('actions')) == 'read',
                'R2 gates-report-summary does not have permissions: actions: read, which the list of this run\'s jobs needs.')
        st = [s for s in steps_of(job) if isinstance(s.get('run'), str) and re.search(r'\bgh api\b', s['run'])]
        if not self.ok(st, "R2 gates-report-summary does not read this run's jobs with gh api."):
            return
        step, legs_ = st[0], []
        for leg in legs(rep) or []:
            try:
                n = tostr(render(rep['name'], static_env(leg))) if rep.get('name') is not None else \
                    'gates-report (%s)' % ', '.join(tostr(v) for v in leg.values())
            except ExprError:
                n = 'gates-report'
            legs_.append((str(leg.get('gate')), n))
        if not legs_:
            return
        verdicts = ['failure', 'success', 'cancelled', 'timed_out', 'skipped']
        mixed = {g: verdicts[i % len(verdicts)] for i, (g, _) in enumerate(legs_)}
        green = {g: 'success' for g, _ in legs_}

        def jobs_json(results, with_legs=True):
            js = [{'name': 'gates-fast', 'status': 'completed', 'conclusion': 'success'},
                  {'name': 'gates-browser (boot)', 'status': 'completed', 'conclusion': 'failure'},
                  {'name': 'gates-pass', 'status': 'completed', 'conclusion': 'failure'},
                  {'name': 'gates-report-summary', 'status': 'in_progress', 'conclusion': None}]
            if with_legs:
                js += [{'name': n, 'status': 'completed', 'conclusion': results[g]} for g, n in legs_]
            return {'total_count': len(js), 'jobs': js}
        ctx = ctx_for('push', MAIN)
        for name, results in (('mixed results', mixed), ('every leg green', green)):
            r = self.script(job, step, ctx, 'summary ' + name, files={'jobs.json': jobs_json(results)})
            if not self.ok(r.code == 0, 'R2 gates-report-summary, given %s, exits %d (%s); it only reports, and must exit 0.' % (name, r.code, last(r.out))):
                continue
            warned = [l for l in r.lines() if l.startswith('::warning')]
            want = [WARN + '%s %s' % (g, v) for g, v in sorted(results.items()) if v != 'success']
            self.ok(sorted(warned) == sorted(want),
                    'R2 gates-report-summary, given %s, warns %s; it must warn exactly %s.' % (name, warned or 'nothing', want or 'nothing'))
            for g, v in results.items():
                self.ok(re.search(r'^\|\s*%s\s*\|\s*%s\s*\|\s*$' % (re.escape(g), v), r.summary, re.M) is not None,
                        'R2 gates-report-summary does not write the row | %s | %s | to $GITHUB_STEP_SUMMARY.' % (g, v))
                self.ok(any(g in l and re.search(r'\b%s\b' % v, l) and not l.startswith('::') for l in r.lines()),
                        'R2 gates-report-summary does not print a line naming %s and its result (%s).' % (g, v))
            self.ok(any('repos/o/r/actions/runs/4242/jobs' in c for c in r.calls['gh']),
                    "R2 gates-report-summary does not read repos/$GITHUB_REPOSITORY/actions/runs/$GITHUB_RUN_ID/jobs.")
        for name, extra, files in (('GitHub down', {'FAKE_GH_FAIL': '1'}, {'jobs.json': jobs_json(green)}),
                                   ('a list with no gates-report leg', {}, {'jobs.json': jobs_json(green, False)})):
            r = self.script(job, step, ctx, 'summary ' + name, extra=extra, files=files)
            self.ok(r.code != 0, 'R2 gates-report-summary, given %s, exits 0; a report it could not make must fail loud.' % name)

    # R3, one list of built pages, checked in both places -------------------
    def r3_pages(self):
        wenv = self.doc.get('env') if isinstance(self.doc.get('env'), dict) else {}
        pages = str(wenv.get('FUNNEL_PAGES', '')).split()
        self.ok(all(p in pages for p in FUNNEL_PAGES) and len(set(pages)) == len(pages),
                'R3 the workflow env FUNNEL_PAGES must name %s, once each. gates-fast and deploy both check that one list, so a page is added in one place.' % ', '.join(FUNNEL_PAGES))
        pages = pages or FUNNEL_PAGES
        for jid in ('gates-fast', 'deploy'):
            job = self.job(jid)
            if not job:
                continue
            texts = run_texts(job)
            built = find(texts, BUILDS[2])[0]
            p, m, s = find(texts, r'test -s\b')
            if not self.ok(p is not None, 'R3 %s does not check that the funnel built its pages.' % jid):
                continue
            self.ok(built is not None and p > built, 'R3 %s checks the funnel built before building it.' % jid)
            cases = [('every page built', {}, pages, 0)]
            cases += [('%s missing' % q, {q: None}, pages, 1) for q in pages]
            cases += [('%s empty' % pages[0], {pages[0]: ''}, pages, 1),
                      ('FUNNEL_PAGES empty', {}, [], 1),
                      ('a page added to FUNNEL_PAGES and not built', {}, pages + ['atuned-new'], 1)]
            for name, odd, listed, want in cases:
                built_here = {q: odd.get(q, '<!doctype html>') for q in pages if odd.get(q, 'x') is not None}
                key = 'pages %s %s' % (jid, json.dumps(built_here, sort_keys=True))
                d = os.path.join(tmproot(), 'pages', str(abs(hash(key))))
                if not os.path.isdir(d):
                    os.makedirs(os.path.join(d, 'funnel', 'dist'))
                    for q, text in built_here.items():
                        with open(os.path.join(d, 'funnel', 'dist', q + '.html'), 'w') as f:
                            f.write(text)
                ctx = ctx_for('push', MAIN)
                try:
                    env = self.step_env(job, s, ctx)
                except ExprError:
                    env = {}
                env['FUNNEL_PAGES'] = ' '.join(listed)
                r = run_script(key, tostr(render(s.get('run'), Env(ctx))), env, cwd=d)
                self.ok((r.code == 0) == (want == 0),
                        'R3 the %s check that the funnel built exits %d with %s; it must %s.' % (
                            jid, r.code, name, 'pass' if want == 0 else 'fail'))
        job = self.job('deploy')
        stage = [t for _, s, t in run_texts(job)] if job else []
        stage = [t for t in stage if 'mkdir deploy' in t]
        lines = [l.strip() for l in (stage[0] if stage else '').split('\n')]
        if self.ok(stage, 'R3 deploy has no staging step.'):
            self.ok(all(l in lines for l in STAGE_LINES),
                    'R3 the staging step lost %s.' % ', '.join(l for l in STAGE_LINES if l not in lines))
            self.ok(FAQ_LINE in lines,
                    'R3 the staging step does not run %s, and the FAQ is linked seven times from three live pages (M48).' % FAQ_LINE)
            lost = [q for q in pages if 'cp funnel/dist/%s.html deploy/' % q not in lines]
            self.ok(not lost, 'R3 FUNNEL_PAGES names %s, which the staging step does not copy, so it is checked and never published.' % ', '.join(lost))

    # R4, the deploy job ----------------------------------------------------
    def r4_deploy(self):
        job = self.job('deploy')
        if not self.ok(job is not None, 'R2 there is no deploy job.'):
            return
        self.ok('gates-pass' in needs_of(job), 'R2 deploy does not need gates-pass, so it can publish over a red gate.')
        self.ok(job.get('concurrency') == {'group': 'pages-prod', 'cancel-in-progress': False},
                'R2 deploy does not set concurrency { group: pages-prod, cancel-in-progress: false }, so two deploys can overlap and whichever finishes last stays live.')
        texts = run_texts(job)
        built = self.common('deploy', job, texts)
        self.ok(find(texts, r'node tests/engine\.js\b', built)[0] is not None,
                'R2 deploy does not run node tests/engine.js after its builds, which on a rollback is the only gate the commit gets.')
        env = job.get('env') or {}
        self.ok(env.get('CF_TOKEN') == '${{ secrets.CLOUDFLARE_API_TOKEN }}' and env.get('CF_ACCOUNT') == '${{ secrets.CLOUDFLARE_ACCOUNT_ID }}',
                'R4 the deploy job no longer maps CF_TOKEN and CF_ACCOUNT from the two Cloudflare secrets.')
        st = steps_of(job)
        push, rb = ctx_for('push', MAIN), ctx_for('workflow_dispatch', MAIN, ROLLBACK)

        def runs_on(s, ctx):
            try:
                return condition(s.get('if'), Env(dict(ctx, env=self.step_env(job, {}, ctx))))
            except ExprError:
                return None
        co = [i for i, s in enumerate(st) if str(s.get('uses', '')).startswith('actions/checkout@')]
        if not self.ok(len(co) == 1, 'R2 deploy must check out exactly once.'):
            return
        ci = co[0]
        idx = {'checkout': ci}
        secrets = [i for i, s in enumerate(st[:ci]) if isinstance(s.get('run'), str)
                   and runs_on(s, push) and runs_on(s, rb)]
        if self.ok(secrets, 'R4 deploy has no step, before its checkout and on every path, that fails the job when CLOUDFLARE_API_TOKEN or CLOUDFLARE_ACCOUNT_ID is not set.'):
            idx['secrets'] = secrets[0]
            self.r4_secrets(job, st[secrets[0]])
        order = [i for i, s in enumerate(st) if 'git/ref/heads/main' in str(s.get('run', ''))]
        if self.ok(len(order) == 1 and order[0] < ci and runs_on(st[order[0]], push) and not runs_on(st[order[0]], rb)
                   and st[order[0]].get('id'),
                   'R4 deploy has no order check: one step with an id, before the checkout, on a push and never on a rollback, that reads the tip of main through gh api repos/$GITHUB_REPOSITORY/git/ref/heads/main.'):
            idx['order'] = order[0]
            self.r4_order(job, st[order[0]])
        inst = [i for i, s in enumerate(st) if INSTALL_CMD in str(s.get('run', ''))]
        if self.ok(len(inst) == 1, 'R4 deploy must run %s in exactly one step.' % INSTALL_CMD):
            idx['install'] = inst[0]
        dep = [i for i, s in enumerate(st) if 'wrangler pages deploy' in str(s.get('run', ''))]
        if self.ok(len(dep) == 1, 'R4 deploy must run wrangler pages deploy in exactly one step.'):
            d = st[dep[0]]
            idx['deploy'] = dep[0]
            self.ok(str(d.get('run', '')).strip() == DEPLOY_CMD,
                    'R4 the deploy command is not exactly: %s. Without --branch=main, a rollback publishes a preview and atuned.world stays as it was.' % DEPLOY_CMD)
            de = d.get('env') or {}
            self.ok(de.get('CLOUDFLARE_API_TOKEN') == '${{ secrets.CLOUDFLARE_API_TOKEN }}' and de.get('CLOUDFLARE_ACCOUNT_ID') == '${{ secrets.CLOUDFLARE_ACCOUNT_ID }}',
                    'R4 the deploy step no longer passes the two Cloudflare secrets to wrangler.')
        reads = [i for i, s in enumerate(st) if 'pages/projects/atuned/deployments' in str(s.get('run', ''))]
        up = idx.get('deploy')
        guard = [i for i in reads if up is None or i < up]
        if self.ok(len(guard) == 1 and guard[0] > ci and runs_on(st[guard[0]], rb) and not runs_on(st[guard[0]], push)
                   and st[guard[0]].get('id'),
                   "R4 deploy has no rollback guard: one step with an id, after the checkout, on a rollback and never on a push, that reads Cloudflare's production deployments."):
            idx['guard'] = guard[0]
            self.r4_guard(job, st[guard[0]])
        confirm = [i for i in reads if up is not None and i > up]
        if self.ok(len(confirm) == 1,
                   "R4 deploy has no production check: one step after wrangler pages deploy that reads Cloudflare's production deployments back and fails unless the newest is the commit just published. wrangler exits 0 when it cannot tell."):
            idx['confirm'] = confirm[0]
            self.r4_confirm(job, st[confirm[0]])
        moves = [i for i, s in enumerate(st) if i not in (ci, idx.get('guard'))
                 and (str(s.get('uses', '')).startswith('actions/checkout@') or
                      re.search(r'\bgit\s+(?:checkout|switch|reset|restore|stash|pull|merge|rebase)\b', str(s.get('run', ''))))]
        self.ok(not moves, 'R4 deploy step %s changes the checked out commit outside the rollback guard, so what is published is not what was checked.' % moves)
        w = st[ci].get('with') or {}
        try:
            depth = (render(w.get('fetch-depth', 1), Env(rb)), render(w.get('fetch-depth', 1), Env(push)))
            ref = (tostr(render(w.get('ref'), Env(rb))), tostr(render(w.get('ref'), Env(push))))
        except ExprError:
            depth, ref = (None, None), ('x', 'x')
        self.ok(depth[0] is not None and num(depth[0]) == 0 and depth[1] is not None and num(depth[1]) == 1,
                'R4 the deploy checkout fetches depth %s on a rollback and %s on a push. It must fetch the whole history on a rollback (0), which the guard resolves rollback_ref in, and one commit otherwise (1).' % (
                    tostr(depth[0]) or 'unset', tostr(depth[1]) or 'unset'))
        self.ok(ref == ('', ''),
                "R4 the deploy checkout takes ref %r. It must take none, the run's own commit: on a rollback the guard moves to the commit it verified, after verifying it." % (ref[0],))
        if all(k in idx for k in ('secrets', 'order', 'guard', 'install', 'deploy', 'confirm')):
            self.r4_walk(job, idx)

    def cf_reads(self, who, calls, acct, tok, most=None):
        """every read of Cloudflare names the production list and a page of at most 25, with the token"""
        bad = []
        for c in calls:
            urls = c.get('urls') or []
            u = urllib.parse.urlsplit(urls[0]) if len(urls) == 1 else None
            q = urllib.parse.parse_qs(u.query) if u else {}
            per = (q.get('per_page') or ['x'])[0]
            if not (u and (u.netloc, u.path) == ('api.cloudflare.com', CF_PATH % acct) and q.get('env') == ['production']
                    and per.isdigit() and 1 <= int(per) <= CF_PAGE and 'Authorization: Bearer ' + tok in c.get('headers', [])):
                bad.append(urls)
        self.ok(calls and not bad,
                'R4 %s reads Cloudflare at %s. Every read must be https://api.cloudflare.com%s?env=production with per_page at most %d, a size Cloudflare is known to honour, and Authorization: Bearer with the token.' % (
                    who, bad[0] if bad else 'nothing', CF_PATH % '$CF_ACCOUNT', CF_PAGE))
        if most is not None:
            self.ok(len(calls) <= most, 'R4 %s reads Cloudflare %d times; it must stop at %d pages.' % (who, len(calls), most))

    def r4_secrets(self, job, step):
        for tok, acct in (('t', 'a'), ('', 'a'), ('t', ''), ('', '')):
            r = self.script(job, step, ctx_for('push', MAIN, tok=tok, acct=acct), 'secrets')
            gone = [n for n, v in (('CLOUDFLARE_API_TOKEN', tok), ('CLOUDFLARE_ACCOUNT_ID', acct)) if not v]
            if not gone:
                self.ok(r.code == 0, 'R4 the deploy secrets check fails with both secrets set (%s).' % last(r.out))
            else:
                self.ok(r.code != 0 and all(n in r.out for n in gone),
                        'R4 the deploy secrets check, with %s not set, exits %d%s. It must fail the job and name the secret: a deploy that skips reads green with nothing published.' % (
                            ' and '.join(gone), r.code, '' if r.code else ' and the job reads green'))

    def order_run(self, job, step, tip):
        ctx = ctx_for('push', MAIN)
        head = ctx['github']['sha']
        extra = {'FAKE_TIP': {'same': head, 'newer': 'b' * 40, 'null': ''}.get(tip, '')}
        if tip == 'down':
            extra['FAKE_GH_FAIL'] = '1'
        return self.script(job, step, ctx, 'order ' + tip, extra=extra)

    def r4_order(self, job, step):
        for tip, want in (('same', 'true'), ('newer', 'false'), ('down', None), ('null', None)):
            r = self.order_run(job, step, tip)
            name = {'same': 'main still at this commit', 'newer': 'a newer commit on main',
                    'down': 'GitHub down', 'null': 'main read as null'}[tip]
            if want is None:
                self.ok(r.code != 0, 'R4 the order check, with %s, exits 0; it cannot tell whether this commit is the newest, so it must fail.' % name)
                continue
            self.ok(r.code == 0 and r.outputs.get('publish') == want,
                    'R4 the order check, with %s, exits %d and sets publish=%s; it must exit 0 and set publish=%s.' % (
                        name, r.code, r.outputs.get('publish', 'nothing'), want))
            if want == 'false':
                self.ok(NEWER in r.out, 'R4 the order check, with a newer commit on main, does not print "%s".' % NEWER)
            self.ok(any(c[:2] == ['api', 'repos/o/r/git/ref/heads/main'] for c in r.calls['gh']),
                    'R4 the order check does not read repos/$GITHUB_REPOSITORY/git/ref/heads/main.')

    def r4_guard(self, job, step):
        repo, sh, g = fixture()
        P, Q, OK = 'production', 'preview', 'success'
        live = cf_body([(sh['E'], P, OK), (sh['S'], P, OK), (sh['C'], Q, OK), (sh['B'], P, 'failure'), (sh['A'], P, OK)])
        dark = cf_body([(sh['E'], Q, OK), (sh['A'], P, OK)])
        staged = cf_body([(sh['A'], P, OK, 'build'), (sh['E'], P, OK)])
        deep = cf_body(filler(39) + [(sh['A'], P, OK)] + filler(20, 39))
        most = CF_PAGE * CF_PAGES
        past = cf_body(filler(most + 9) + [(sh['A'], P, OK)])
        short = cf_body(filler(30))
        cases = [
            # name, rollback_ref, dispatched on, token, account, Cloudflare, list, GitHub down, publishes, must say
            ('a full commit sha that was live', sh['A'], MAIN, 't', 'a', 'ok', live, False, 'A', None),
            ("main's tip by its full sha, live now", sh['E'], MAIN, 't', 'a', 'ok', live, False, 'E', None),
            ("main's tip by its full sha, never published to production", sh['E'], MAIN, 't', 'a', 'ok', dark, False, None, None),
            ('a commit 40 deep in the list, read a page at a time', sh['A'], MAIN, 't', 'a', 'ok', deep, False, 'A', None),
            ('a commit %d deep, past the %d pages read' % (most + 10, CF_PAGES), sh['A'], MAIN, 't', 'a', 'ok', past, False, None, str(most)),
            ('a commit never published, in a list of 30', sh['D'], MAIN, 't', 'a', 'ok', short, False, None, '30'),
            ('a commit whose last stage is build: success', sh['A'], MAIN, 't', 'a', 'ok', staged, False, None, None),
            ('a commit whose production deploy failed', sh['B'], MAIN, 't', 'a', 'ok', live, False, None, None),
            ('a commit published only as a preview', sh['C'], MAIN, 't', 'a', 'ok', live, False, None, None),
            ('a commit on main never published', sh['D'], MAIN, 't', 'a', 'ok', live, False, None, None),
            ('a commit off main that Cloudflare lists as production', sh['S'], MAIN, 't', 'a', 'ok', live, False, None, None),
            ('a short sha', sh['A'][:9], MAIN, 't', 'a', 'ok', live, False, None, FULL_SHA),
            ('a branch name', 'main', MAIN, 't', 'a', 'ok', live, False, None, FULL_SHA),
            ('a branch name with a slash', 'claude/some-branch', MAIN, 't', 'a', 'ok', live, False, None, FULL_SHA),
            ('a full sha with a trailing space', sh['A'] + ' ', MAIN, 't', 'a', 'ok', live, False, None, FULL_SHA),
            ('a full sha in capitals', sh['A'].upper(), MAIN, 't', 'a', 'ok', live, False, None, FULL_SHA),
            ('an option, not a commit', '--all', MAIN, 't', 'a', 'ok', live, False, None, FULL_SHA),
            ('a full sha that is no commit here', 'f' * 40, MAIN, 't', 'a', 'ok', live, False, None, FULL_SHA),
            ('a rollback dispatched off main', sh['A'], BRANCH, 't', 'a', 'ok', live, False, None, None),
            ('Cloudflare down', sh['A'], MAIN, 't', 'a', 'down', live, False, None, None),
            ('Cloudflare answering with a page that is not JSON', sh['A'], MAIN, 't', 'a', 'garbage', live, False, None, None),
            ('Cloudflare answering success: false', sh['A'], MAIN, 't', 'a', 'refused', live, False, None, None),
            ('no Cloudflare token', sh['A'], MAIN, '', 'a', 'ok', live, False, None, None),
            ('no Cloudflare account', sh['A'], MAIN, 't', '', 'ok', live, False, None, None),
            ('GitHub compare down', sh['A'], MAIN, 't', 'a', 'ok', live, True, None, None),
        ]
        reset = lambda: g('checkout', '-q', '--force', 'main')

        def here():
            """where the guard left the checkout and the tree it left, then back to main"""
            with open(os.path.join(repo, 'f.txt')) as f:
                seen = (g('rev-parse', 'HEAD'), f.read())
            reset()
            return seen
        for name, ref, on, tok, acct, mode, body, ghdown, pub, say in cases:
            ctx = ctx_for('workflow_dispatch', on, ref, tok=tok, acct=acct, sha=sh['E'])
            extra = {'FAKE_REPO': repo, 'FAKE_CF': mode, 'FAKE_CF_TOKEN': tok, 'FAKE_CF_ACCOUNT': acct}
            if ghdown:
                extra['FAKE_GH_FAIL'] = '1'
            r = self.script(job, step, ctx, 'guard ' + name, extra=extra, cwd=repo,
                            files={'cf.json': body}, before=reset, after=here)
            head, tree = r.calls['after'] or ('', '')
            self.ok(' '.join(STOPGAP.split()) in ' '.join(r.summary.split()),
                    'R4 the rollback guard, given %s, does not write to the run page: %s' % (name, STOPGAP))
            if say is not None:
                self.ok(say in r.out, 'R4 the rollback guard, given %s, does not say "%s". It said: %s' % (name, say, last(r.out)))
            if pub is None:
                self.ok(r.code != 0 and head == sh['E'] and 'sha' not in r.outputs,
                        'R4 the rollback guard, given %s, %s; it must refuse and leave the checkout where it was.' % (
                            name, 'exits 0' if r.code == 0 else 'moves the checkout to %s' % head[:9]))
                if r.calls['curl']:
                    self.cf_reads('the rollback guard, given %s,' % name, r.calls['curl'], acct, tok, CF_PAGES)
                continue
            want = sh[pub]
            if not self.ok(r.code == 0 and head == want and tree == pub and r.outputs.get('sha') == want,
                           'R4 the rollback guard, given %s, exits %d at %s; it must exit 0 with commit %s checked out and sha=%s in its outputs. It said: %s' % (
                               name, r.code, head[:9] or 'nothing', pub, want[:9], last(r.out))):
                continue
            self.ok(want in r.out, 'R4 the rollback guard does not print the commit id it matched (%s).' % want[:9])
            self.cf_reads('the rollback guard, given %s,' % name, r.calls['curl'], acct, tok, CF_PAGES)

    def r4_confirm(self, job, step):
        """after the upload: is the newest production deployment the commit just published?"""
        repo, sh, g = fixture()
        E, D, P, Q, OK = sh['E'], sh['D'], 'production', 'preview', 'success'
        b = lambda *e: cf_body(list(e))
        cases = [
            # name, Cloudflare's answer to each read in turn (the last repeats), confirms
            ('live at the first read', [b((E, P, OK), (D, P, OK))], True),
            ('live at the third read', [b((D, P, OK)), b((E, P, 'active'), (D, P, OK)), b((E, P, OK), (D, P, OK))], True),
            ('Cloudflare down, then live', ['down', b((E, P, OK), (D, P, OK))], True),
            ('still deploying when the wait runs out', [b((E, P, 'active'), (D, P, OK))], False),
            ('its last stage build: success', [b((E, P, OK, 'build'), (D, P, OK))], False),
            ('its production deploy failed', [b((E, P, 'failure'), (D, P, OK))], False),
            ('the upload went to a preview', [b((E, Q, OK), (D, P, OK))], False),
            ('this commit live once, another one newest', [b((D, P, OK), (E, P, OK))], False),
            ('Cloudflare down throughout', ['down'], False),
            ('Cloudflare answering with a page that is not JSON', ['garbage'], False),
        ]
        reset = lambda: g('checkout', '-q', '--force', 'main')
        for name, answers, good in cases:
            r = self.script(job, step, ctx_for('push', MAIN, sha=E), 'confirm ' + name,
                            extra={'FAKE_CF_TOKEN': 't', 'FAKE_CF_ACCOUNT': 'a'}, cwd=repo,
                            files={'cf.json': answers}, before=reset)
            waited = sum(r.calls['sleep'])
            if good:
                if self.ok(r.code == 0, 'R4 the production check, with %s, exits %d; it must pass. It said: %s' % (name, r.code, last(r.out))):
                    self.ok('dep-0' in r.out and 'https://1000.atuned.pages.dev' in r.out,
                            'R4 the production check, with %s, does not print the id and URL of the deployment it confirmed.' % name)
            else:
                self.ok(r.code != 0, 'R4 the production check, with %s, exits 0; it must fail the job, or its green says atuned.world changed when it did not.' % name)
            if name == 'still deploying when the wait runs out':
                self.ok(60 <= waited <= 180,
                        'R4 the production check waits %s seconds in all before it fails; it must keep reading for about two minutes, 60 to 180 seconds.' % waited)
            self.cf_reads('the production check, with %s,' % name, r.calls['curl'], 'a', 't')

    def r4_walk(self, job, idx):
        """the deploy job's steps in order, on every path into it"""
        st = steps_of(job)
        sid = {k: str(st[i].get('id', '')).lower() for k, i in idx.items()}
        paths = [
            # name, event, rollback_ref, token, account, main's tip, guard passes
            ('a push to main', 'push', None, 't', 'a', 'same', True),
            ('a push to main that a newer commit has overtaken', 'push', None, 't', 'a', 'newer', True),
            ('a push to main with no token', 'push', None, '', 'a', 'same', True),
            ('a push to main with no account', 'push', None, 't', '', 'same', True),
            ('a dispatch on main with no rollback_ref', 'workflow_dispatch', '', 't', 'a', 'same', True),
            ('a rollback the guard passes', 'workflow_dispatch', ROLLBACK, 't', 'a', 'same', True),
            ('a rollback the guard refuses', 'workflow_dispatch', ROLLBACK, 't', 'a', 'same', False),
            ('a rollback with no token', 'workflow_dispatch', ROLLBACK, '', 'a', 'same', True),
        ]
        for name, event, rb, tok, acct, tip, guard_ok in paths:
            ctx = ctx_for(event, MAIN, rb, tok=tok, acct=acct)
            try:
                env = self.step_env(job, {}, ctx)
            except ExprError:
                env = {}
            steps, ran, failed = {}, [], False
            for i, s in enumerate(st):
                c = dict(ctx, env=env, steps=steps)
                try:
                    go = condition(s.get('if'), Env(c, {'cancelled': False, 'needs_ok': not failed, 'needs_failed': failed}))
                except ExprError:
                    go = False
                outcome, outputs = 'skipped', {}
                if go:
                    ran.append(i)
                    outcome = 'success'
                    if i == idx['secrets']:
                        r = self.script(job, s, ctx_for('push', MAIN, tok=tok, acct=acct), 'secrets')
                        outcome = 'success' if r.code == 0 else 'failure'
                    elif i == idx['order']:
                        r = self.order_run(job, s, tip)
                        outcome, outputs = ('success' if r.code == 0 else 'failure'), r.outputs
                    elif i == idx['guard']:
                        outcome, outputs = ('success', {'sha': 'f' * 40}) if guard_ok else ('failure', {})
                    failed = failed or outcome == 'failure'
                if s.get('id'):
                    steps[str(s['id']).lower()] = {'outputs': outputs, 'outcome': outcome, 'conclusion': outcome}
            result = 'failure' if failed else 'success'
            published = idx['deploy'] in ran
            names = lambda ix: ', '.join(repr(st[i].get('name', st[i].get('uses', i))) for i in ix)
            if tip == 'newer':
                later = [i for i in ran if i > idx['order']]
                self.ok(not later and result == 'success',
                        'R4 on %s, %s run after the order check said a newer commit is on main; every later step must be skipped.' % (name, names(later) or 'the job fails'))
                continue
            if not (tok and acct):
                self.ok(not published and result == 'failure',
                        'R4 on %s, the deploy job %s; it must fail, so the run is red.' % (name, 'publishes' if published else 'reads %s with nothing published' % result))
                continue
            if rb and not guard_ok:
                self.ok(not published and result == 'failure',
                        'R4 on %s, the deploy job %s; it must fail and publish nothing.' % (name, 'publishes' if published else 'reads %s' % result))
                continue
            self.ok(published and idx['install'] in ran and result == 'success',
                    'R4 on %s, the deploy step %s; it must publish.' % (name, 'runs' if published else 'is skipped'))
            skipped = [i for i in range(len(st)) if i not in ran and i != (idx['order'] if rb else idx['guard'])]
            self.ok(not skipped, 'R4 on %s, %s skipped.' % (name, names(skipped)))
            if rb:
                self.ok(idx['order'] not in ran, 'R4 on %s, the order check runs; a rollback publishes an older commit on purpose.' % name)

    # R2, safety that is not any one requirement ----------------------------
    def r2_hygiene(self):
        perms = self.doc.get('permissions')
        self.ok(isinstance(perms, dict) and perms,
                'R2 no top level permissions, so the token a pull request runs with takes the repository default, which can be write.')
        allp = [perms] + [j.get('permissions') for j in self.jobs().values() if isinstance(j, dict)]
        self.ok(not any(p == 'write-all' or (isinstance(p, dict) and 'write' in map(str, p.values())) for p in allp),
                'R2 a permission is write; nothing in this workflow writes through the GitHub token.')
        for jid, job in self.jobs().items():
            if jid == 'deploy' or not isinstance(job, dict):
                continue
            self.ok(not any('secrets.' in s for s in strings(job)),
                    'R2 %s reads a secret, and a pull request runs its code in this job.' % jid)
        for jid, job in self.jobs().items():
            if not isinstance(job, dict):
                continue
            for s in steps_of(job):
                coe = s.get('continue-on-error', False)
                self.ok(coe is False or (isinstance(coe, str) and coe.strip().lower() == 'false'),
                        'R2 %s step %r may fail without failing its job (continue-on-error).' % (jid, s.get('name', s.get('uses', ''))))
                r = s.get('run')
                if jid != 'deploy' and isinstance(r, str):
                    self.ok(not re.search(r'\|\|\s*(?:true|:)\s*(?:$|[;)#])', r, re.M),
                            'R2 %s step %r swallows a failure with || true.' % (jid, s.get('name', r.split('\n')[0][:40])))
        conc = self.doc.get('concurrency')
        if isinstance(conc, dict):
            try:
                cip = render(conc.get('cancel-in-progress', False),
                             Env({'github': {'event_name': 'push', 'ref': MAIN}, 'inputs': {}, 'vars': {}}))
            except ExprError:
                cip = True
            self.ok(not truthy(cip), 'R2 the workflow concurrency cancels a run in progress on a push to main, which can cut a deploy off half way.')
        dflt = ((self.doc.get('defaults') or {}).get('run') or {}).get('shell')
        for jid, job in self.jobs().items():
            if not isinstance(job, dict):
                continue
            jdflt = ((job.get('defaults') or {}).get('run') or {}).get('shell')
            for s in steps_of(job):
                r = s.get('run')
                if not isinstance(r, str) or not re.search(r'(?<!\|)\|(?!\|)', r):
                    continue
                shell = s.get('shell') or jdflt or dflt
                self.ok(shell == 'bash' or re.search(r'\bset -[a-z]*o pipefail\b', r) or (shell and 'pipefail' in str(shell)),
                        'R5 %s step %r pipes under a shell with no pipefail, so a red gate piped into tee reads green.' % (jid, s.get('name', r.split('\n')[0][:40])))
        for jid, job in self.jobs().items():
            if not isinstance(job, dict):
                continue
            for s in steps_of(job):
                r = s.get('run')
                if isinstance(r, str) and re.search(r'\bgh\s+api\b', r):
                    e = dict(job.get('env') or {}, **(s.get('env') or {}))
                    self.ok(e.get('GH_TOKEN') == '${{ github.token }}',
                            'R2 %s step %r calls gh with no GH_TOKEN: ${{ github.token }}, and gh on a runner refuses to run without it.' % (jid, s.get('name', '')))

    def r2_paths_exist(self):
        for jid in ('gates-fast', 'gates-browser', 'gates-report', 'deploy'):
            job = self.job(jid)
            if not job:
                continue
            for leg in (legs(job) or [None]):
                for i, s, t in run_texts(job, leg):
                    for m in re.finditer(r'(?:\bnode|\bpython3)\s+((?:\./)?[\w./-]+\.(?:js|py))\b|(\./[\w./-]+\.sh)\b', t):
                        p = m.group(1) or m.group(2)
                        self.ok(os.path.isfile(os.path.join(self.root, p)),
                                'R2 %s runs %s, which does not exist.' % (jid, p))

    # R6 -------------------------------------------------------------------
    def r6_expressions(self):
        doc = self.doc
        wd = triggers(doc).get('workflow_dispatch') or {}
        inputs = {k.lower() for k in ((wd.get('inputs') if isinstance(wd, dict) else None) or {})}
        wenv = {str(k).lower() for k in (doc.get('env') or {})}
        jobs = self.jobs()
        C_TOP = ({'github', 'inputs', 'vars'}, set())
        C_TOP_ENV = ({'github', 'secrets', 'inputs', 'vars'}, set())
        C_JOB_IF = ({'github', 'needs', 'vars', 'inputs'}, STATUS)
        C_JOB = ({'github', 'needs', 'strategy', 'matrix', 'vars', 'inputs'}, set())
        C_JOB_STRAT = ({'github', 'needs', 'vars', 'inputs'}, set())
        C_JOB_ENV = (C_JOB[0] | {'secrets'}, set())
        C_STEP_IF = ({'github', 'needs', 'strategy', 'matrix', 'job', 'runner', 'env', 'vars', 'steps', 'inputs'}, STATUS | {'hashfiles'})
        C_STEP = (C_STEP_IF[0] | {'secrets'}, {'hashfiles'})

        def check(text, where, allowed, job=None, envs=(), earlier=()):
            try:
                tree = Parser(text).parse()
            except ExprError as e:
                self.ok(False, 'R6 %s: %r does not parse: %s.' % (where, text.strip(), e))
                return
            ctxs, funcs = allowed
            for n in nodes(tree):
                if n[0] == 'call':
                    name = n[1]
                    lo, hi = FUNCS.get(name, (0, 99))
                    self.ok(name in FUNCS, 'R6 %s: %s() is not a GitHub function.' % (where, name))
                    self.ok(name not in STATUS or name in funcs, 'R6 %s: %s() works only in an if.' % (where, name))
                    self.ok(name != 'hashfiles' or name in funcs, 'R6 %s: hashFiles() works only in a step.' % where)
                    self.ok(lo <= len(n[2]) <= hi, 'R6 %s: %s() given %d arguments.' % (where, name, len(n[2])))
                c = chain(n) if n[0] in ('ctx', 'prop', 'index') else None
                if not c:
                    continue
                root = c[0]
                if not self.ok(root in CONTEXTS, 'R6 %s: %s is not a GitHub context.' % (where, root)):
                    continue
                if not self.ok(root in ctxs, 'R6 %s: the %s context is not available here.' % (where, root)):
                    continue
                if len(c) < 2:
                    continue
                key = c[1]
                if root == 'needs':
                    self.ok(key in [x.lower() for x in needs_of(job or {})], 'R6 %s: needs.%s is not in this job\'s needs.' % (where, key))
                elif root == 'inputs':
                    self.ok(key in inputs, 'R6 %s: inputs.%s is not a workflow_dispatch input.' % (where, key))
                elif root == 'matrix':
                    ls = legs(job or {}) or []
                    self.ok(ls and all(key in [str(k).lower() for k in l] for l in ls),
                            'R6 %s: matrix.%s is not set in every matrix leg.' % (where, key))
                elif root == 'env':
                    jenv = {str(k).lower() for k in ((job or {}).get('env') or {})}
                    self.ok(key in wenv | jenv | set(envs), 'R6 %s: env.%s is never set, so it reads empty.' % (where, key))
                elif root == 'steps':
                    self.ok(key in earlier, 'R6 %s: steps.%s is not an earlier step id.' % (where, key))

        def inline(value, where, allowed, **kw):
            for s in strings(value):
                for m in INLINE.finditer(s):
                    check(m.group(1), where, allowed, **kw)

        def cond(value, where, allowed, **kw):
            try:
                src = cond_source(value)
            except ExprError as e:
                self.ok(False, 'R6 %s: %s.' % (where, e))
                return
            check(src, where, allowed, **kw)

        for k in ('name', 'run-name', 'concurrency'):
            if k in doc:
                inline(doc[k], k, C_TOP)
        inline(doc.get('env') or {}, 'env', C_TOP_ENV)
        for jid, job in jobs.items():
            if not isinstance(job, dict):
                continue
            for k, v in job.items():
                where = 'jobs.%s.%s' % (jid, k)
                if k == 'if':
                    cond(v, where, C_JOB_IF, job=job)
                elif k == 'steps':
                    continue
                elif k == 'strategy':
                    inline(v, where, C_JOB_STRAT, job=job)
                elif k == 'env':
                    inline(v, where, C_JOB_ENV, job=job)
                elif k in ('needs', 'permissions'):
                    self.ok(not any('${{' in s for s in strings(v)), 'R6 %s cannot hold an expression.' % where)
                else:
                    inline(v, where, C_JOB, job=job)
            earlier = set()
            for i, s in enumerate(steps_of(job)):
                senv = {str(k).lower() for k in (s.get('env') or {})}
                for k, v in s.items():
                    where = 'jobs.%s.steps[%d].%s' % (jid, i, k)
                    if k == 'if':
                        cond(v, where, C_STEP_IF, job=job, envs=senv, earlier=earlier)
                    elif k in ('uses', 'id'):
                        self.ok(not any('${{' in x for x in strings(v)), 'R6 %s cannot hold an expression.' % where)
                    else:
                        inline(v, where, C_STEP, job=job, envs=senv, earlier=earlier)
                if s.get('id'):
                    earlier.add(str(s['id']).lower())

    # R7 -------------------------------------------------------------------
    def r7_hardening(self):
        for jid, job in self.jobs().items():
            if not isinstance(job, dict):
                continue
            for leg in (legs(job) or [None]):
                try:
                    t = render(job.get('timeout-minutes'), static_env(leg))
                except ExprError:
                    t = None
                self.ok(t is not None and 1 <= num(t) <= 360,
                        'R7 %s%s has no timeout-minutes, so a hung step holds a runner for six hours.' % (jid, ' (%s)' % leg.get('gate') if leg else ''))
            uses = [('job', job['uses'])] if 'uses' in job else []
            for i, s in enumerate(steps_of(job)):
                where = '%s step %r' % (jid, s.get('name', s.get('uses', i)))
                if 'uses' in s:
                    uses.append((where, s['uses']))
                r = s.get('run')
                if not isinstance(r, str):
                    continue
                for m in INLINE.finditer(r):
                    try:
                        tree = Parser(m.group(1)).parse()
                    except ExprError:
                        continue
                    bad = [c for c in (chain(n) for n in nodes(tree) if n[0] in ('ctx', 'prop', 'index'))
                           if c and (c[0] == 'inputs' or c[:2] in UNTRUSTED)]
                    self.ok(not bad,
                            'R7 %s puts ${{ %s }} straight into its script, where a branch name or a pull request title becomes a command. Pass it through env: and quote it, "$NAME".' % (where, m.group(1).strip()))
            for where, u in uses:
                self.ok(str(u).startswith(ACTION_OWNERS),
                        'R7 %s uses %s, an action from outside actions/ and github/, which runs its own owner\'s code with this job\'s token.' % (where, u))

    def run(self, other_workflows=()):
        gone = [t for t in ('bash', 'git', 'jq') if not shutil.which(t)]
        self.ok(not gone, 'R4 %s not on PATH, so the scripts that decide what is published cannot be run here; every R4 line below is unproven until it is.' % ', '.join(gone))
        self.r1_triggers(other_workflows)
        self.r2_conditions()
        self.r2_pass_step()
        self.r2_fast()
        self.r2_matrix()
        self.r2_report_summary()
        self.r3_pages()
        self.r4_deploy()
        self.r2_hygiene()
        self.r2_paths_exist()
        self.r6_expressions()
        self.r7_hardening()
        return self


def load(path):
    try:
        import yaml
    except ImportError:
        return None, 'PyYAML is not installed (python3 -m pip install pyyaml), so the workflow cannot be read'
    try:
        with open(path) as f:
            doc = yaml.safe_load(f)
    except OSError as e:
        return None, '%s cannot be read: %s' % (path, e)
    except yaml.YAMLError as e:
        return None, '%s is not valid YAML: %s' % (path, str(e).replace('\n', ' '))
    if not isinstance(doc, dict):
        return None, '%s is not a workflow' % path
    return doc, None


def others(path):
    out = []
    here = os.path.dirname(os.path.abspath(path))
    for p in sorted(glob.glob(os.path.join(here, '*.yml')) + glob.glob(os.path.join(here, '*.yaml'))):
        if os.path.abspath(p) != os.path.abspath(path):
            d, err = load(p)
            if d is not None:
                out.append((os.path.relpath(p, ROOT), d))
    return out


def lint_file(path):
    doc, err = load(path)
    if err:
        print('FAIL ' + err)
        print('\n===== 0 passed, 1 failed =====')
        return 1
    with open(path) as f:
        text = f.read()
    L = Lint(doc, text=text).run(others(path))
    for f in L.fails:
        print('FAIL ' + f)
    print('\n===== %d passed, %d failed =====' % (L.passed, len(L.fails)))
    return 1 if L.fails else 0


# ---------------------------------------------------------------------------
# --self-test: each break below is a way this file has been, or could be,
# wrong. The lint must stay clean on the file as it is and fail on every one.
# ---------------------------------------------------------------------------

def _on(d):
    return d[on_key(d)]


def _job(d, j):
    return d['jobs'][j]


def _step(d, j, rx):
    for s in steps_of(_job(d, j)):
        if re.search(rx, str(s.get('run', ''))):
            return s
    raise KeyError(rx)


def _sub(d, j, rx, old, new):
    s = _step(d, j, rx)
    if old not in s['run']:
        raise KeyError(old)
    s['run'] = s['run'].replace(old, new)


def _legs(d, j):
    return _job(d, j)['strategy']['matrix']['include']


def _move(d, gate, src, dst):
    leg = [l for l in _legs(d, src) if l.get('gate') == gate][0]
    _legs(d, src).remove(leg)
    _legs(d, dst).append(leg)


def _checkout(d):
    return [s for s in steps_of(_job(d, 'deploy')) if str(s.get('uses', '')).startswith('actions/checkout@')][0]


GUARD = r'pages/projects/atuned/deployments'
CONFIRM = r'published="\$\(git rev-parse HEAD\)"'


def _drop(d, rx):
    st = _job(d, 'deploy')['steps']
    st.remove(_step(d, 'deploy', rx))


def _no_comments(text):
    return '\n'.join(l for l in text.split('\n') if not l.strip().startswith('#'))
ORDER = r'git/ref/heads/main'

BREAKS = [
    ('a paths filter on pull_request', lambda d: _on(d).__setitem__('pull_request', {'paths': ['atuned_src/**']})),
    ('pull_request_target added', lambda d: _on(d).__setitem__('pull_request_target', None)),
    ('a paths filter on push', lambda d: _on(d)['push'].__setitem__('paths', ['atuned_src/**', 'funnel/**'])),
    ('rollback_ref described with no word on an empty input', lambda d: _on(d)['workflow_dispatch']['inputs']['rollback_ref'].__setitem__('description', 'Rollback only: a full commit sha.')),
    ('no comment says a rollback lasts only until the next push', lambda d: None, _no_comments),
    ('rollback_ref made required', lambda d: _on(d)['workflow_dispatch']['inputs']['rollback_ref'].__setitem__('required', True)),
    ('deploy without needs', lambda d: _job(d, 'deploy').pop('needs')),
    ('deploy without concurrency', lambda d: _job(d, 'deploy').pop('concurrency')),
    ('deploy with if: always()', lambda d: _job(d, 'deploy').__setitem__('if', 'always()')),
    ('deploy with no if at all', lambda d: _job(d, 'deploy').pop('if')),
    ('gates-fast runs on a rollback', lambda d: _job(d, 'gates-fast').pop('if')),
    ('gates-pass without always()', lambda d: _job(d, 'gates-pass').__setitem__('if', "inputs.rollback_ref == ''")),
    ('gates-pass passes a skipped job', lambda d: _sub(d, 'gates-pass', r'exit 1', 'exit 1', 'exit 0')),
    ('gates-pass shows nothing on the run page', lambda d: _sub(d, 'gates-pass', r'exit 1', '"$GITHUB_STEP_SUMMARY"', '/dev/null')),
    ('gates-pass waits for gates-report', lambda d: _job(d, 'gates-pass')['needs'].append('gates-report')),
    ('gates-pass waits for gates-report-summary', lambda d: _job(d, 'gates-pass')['needs'].append('gates-report-summary')),
    ('deploy waits for gates-report-summary', lambda d: _job(d, 'deploy').__setitem__('needs', ['gates-pass', 'gates-report-summary'])),
    ('every required leg allowed to fail', lambda d: _job(d, 'gates-browser').__setitem__('continue-on-error', True)),
    ('the report legs made required', lambda d: _job(d, 'gates-report').__setitem__('continue-on-error', False)),
    ('boot moved to gates-report', lambda d: _move(d, 'boot', 'gates-browser', 'gates-report')),
    ('functional moved to gates-report', lambda d: _move(d, 'functional', 'gates-browser', 'gates-report')),
    ('design moved to gates-report', lambda d: _move(d, 'design', 'gates-browser', 'gates-report')),
    ('monitor moved to gates-report', lambda d: _move(d, 'monitor', 'gates-browser', 'gates-report')),
    ('storage moved to gates-report', lambda d: _move(d, 'storage', 'gates-browser', 'gates-report')),
    ('firstrelease moved to gates-report', lambda d: _move(d, 'firstrelease', 'gates-browser', 'gates-report')),
    ('journey2 moved to gates-report', lambda d: _move(d, 'journey2', 'gates-browser', 'gates-report')),
    ('onboarding2 moved to gates-report', lambda d: _move(d, 'onboarding2', 'gates-browser', 'gates-report')),
    ('release-screen moved to gates-report', lambda d: _move(d, 'release-screen', 'gates-browser', 'gates-report')),
    ('alpha-journey moved to gates-report', lambda d: _move(d, 'alpha-journey', 'gates-browser', 'gates-report')),
    ('a gate in both matrices', lambda d: _legs(d, 'gates-browser').append(dict(_legs(d, 'gates-report')[0]))),
    ('fail-fast left on', lambda d: _job(d, 'gates-browser')['strategy'].pop('fail-fast')),
    ('the report legs renamed', lambda d: _job(d, 'gates-report').__setitem__('name', 'report ${{ matrix.gate }}')),
    ('functional cut to a 20 minute timeout', lambda d: [l.update({'timeout': 20}) for j in MATRIX_JOBS for l in _legs(d, j) if l.get('gate') == 'functional']),
    ('the report summary only when every leg passed', lambda d: _job(d, 'gates-report-summary').__setitem__('if', "inputs.rollback_ref == ''")),
    ('the report warnings dropped', lambda d: _sub(d, 'gates-report-summary', r'gh api', WARN, '')),
    ('the report summary without actions: read', lambda d: _job(d, 'gates-report-summary').pop('permissions')),
    ('the report summary green when it read nothing', lambda d: _sub(d, 'gates-report-summary', r'gh api', 'exit 1', 'exit 0')),
    ('the engine gate step allowed to fail', lambda d: _step(d, 'gates-fast', r'tests/engine\.js').__setitem__('continue-on-error', True)),
    ('the voice check swallowed', lambda d: _sub(d, 'gates-fast', r'check\.py', '--objections', '--objections || true')),
    ('a workflow concurrency that cancels', lambda d: d.__setitem__('concurrency', {'group': 'x', 'cancel-in-progress': True})),
    ('chromium pointed at after the gate', lambda d: _job(d, 'gates-browser')['steps'].append(_job(d, 'gates-browser')['steps'].pop(4))),
    ('a browser gate dropped from the matrix', lambda d: _legs(d, 'gates-browser').pop(0)),
    ('the build order reversed', lambda d: _sub(d, 'gates-fast', r'BUILD-engine', './atuned_src/BUILD-engine.sh && ./atuned_src/BUILD.sh', './atuned_src/BUILD.sh && ./atuned_src/BUILD-engine.sh')),
    ('the deploy job builds BUILD.sh first', lambda d: _sub(d, 'deploy', r'BUILD-engine', './atuned_src/BUILD-engine.sh && ./atuned_src/BUILD.sh', './atuned_src/BUILD.sh && ./atuned_src/BUILD-engine.sh')),
    ('the engine gate not teed', lambda d: _sub(d, 'gates-fast', r'tests/engine\.js', 'engine.log', 'engine.txt')),
    ('no pipefail', lambda d: d['defaults']['run'].__setitem__('shell', 'sh')),
    ('the chrome-path step skipped when its file is gone', lambda d: _step(d, 'gates-fast', r'chrome-path').__setitem__('if', "hashFiles('tests/chrome-path.js') != ''")),
    ('the chrome-path step skipped on a pull request', lambda d: _step(d, 'gates-fast', r'chrome-path').__setitem__('if', "github.event_name == 'push'")),
    ('the FAQ not staged', lambda d: _sub(d, 'deploy', r'mkdir deploy', 'cp funnel/dist/atuned-faq.html deploy/\n', '')),
    ('the FAQ dropped from FUNNEL_PAGES', lambda d: d['env'].__setitem__('FUNNEL_PAGES', d['env']['FUNNEL_PAGES'].replace(' atuned-faq', ''))),
    ('a page list typed into the deploy check', lambda d: _sub(d, 'deploy', r'test -s', '$FUNNEL_PAGES; do', 'atuned-funnel atuned-quiz atuned-about atuned-buy atuned-faq; do')),
    ('an empty page list passing', lambda d: _sub(d, 'gates-fast', r'test -s', 'test -n "$FUNNEL_PAGES"', 'true')),
    ('the deploy command without --branch=main', lambda d: _sub(d, 'deploy', r'wrangler pages deploy', ' --branch=main', '')),
    ('the deploy command changed', lambda d: _sub(d, 'deploy', r'wrangler pages deploy', ' --commit-dirty=true', '')),
    ('a missing secret skips instead of failing', lambda d: _sub(d, 'deploy', r'CLOUDFLARE_ACCOUNT_ID', 'exit 1', 'exit 0')),
    ('the secrets check dropped for the old skip', lambda d: [_job(d, 'deploy')['steps'].pop(0)] + [
        s.__setitem__('if', "env.CF_TOKEN != '' && env.CF_ACCOUNT != ''") for s in steps_of(_job(d, 'deploy')) if 'wrangler' in str(s.get('run', ''))]),
    ('the order check publishes an older commit', lambda d: _sub(d, 'deploy', ORDER, 'publish=false', 'publish=true')),
    ('the order check green when it read nothing', lambda d: _sub(d, 'deploy', ORDER, 'exit 1', 'exit 0')),
    ('the deploy step ignores the order check', lambda d: _step(d, 'deploy', r'wrangler pages deploy').pop('if')),
    ('the rollback guard takes any commit on main', lambda d: _sub(d, 'deploy', GUARD, '[ -z "$match" ]', 'false')),
    ('the rollback guard takes a commit off main', lambda d: _sub(d, 'deploy', GUARD, 'identical|behind)', 'identical|behind|ahead|diverged)')),
    ('the rollback guard takes a failed deploy', lambda d: _sub(d, 'deploy', GUARD, ' and .latest_stage.status == "success"', '')),
    ('the rollback guard takes a stage that is not deploy', lambda d: _sub(d, 'deploy', GUARD, ' and .latest_stage.name == "deploy"', '')),
    ('the rollback guard reads one page only', lambda d: _sub(d, 'deploy', GUARD, 'page=$((page + 1))', 'break')),
    ('the rollback guard asks for 50 to a page', lambda d: _sub(d, 'deploy', GUARD, 'per_page=25', 'per_page=50')),
    ('the rollback guard reads every page there is', lambda d: _sub(d, 'deploy', GUARD, '[ "$page" -le 6 ]', 'true')),
    ('the rollback guard takes a branch name or a short sha', lambda d: _sub(d, 'deploy', GUARD, '[[ "$ROLLBACK_REF" =~ ^[0-9a-f]{40}$ ]]', 'true')),
    ('the rollback guard silent that the next push undoes it', lambda d: _sub(d, 'deploy', GUARD, '>> "$GITHUB_STEP_SUMMARY"', '> /dev/null')),
    ('the rollback guard takes a preview', lambda d: _sub(d, 'deploy', GUARD, '.environment == "production" and ', '')),
    ('the rollback guard ignores success: false', lambda d: _sub(d, 'deploy', GUARD, '!= true ]', '= nottrue ]')),
    ('the rollback guard runs off main', lambda d: _sub(d, 'deploy', GUARD, '!= refs/heads/main ]', '= refs/heads/nowhere ]')),
    ('the rollback guard publishes the dispatch commit', lambda d: _sub(d, 'deploy', GUARD, 'git checkout --quiet --force --detach "$sha"', ':')),
    ('a rollback checkout with no history', lambda d: _checkout(d).pop('with')),
    ('no production check after the upload', lambda d: _drop(d, CONFIRM)),
    ('the production check takes any commit', lambda d: _sub(d, 'deploy', CONFIRM, '[ "$commit" = "$published" ]', 'true')),
    ('the production check takes a stage that is not deploy', lambda d: _sub(d, 'deploy', CONFIRM, '[ "$stage" = deploy ]', 'true')),
    ('the production check reads once', lambda d: _sub(d, 'deploy', CONFIRM, 'for try in 1 2 3 4 5 6 7 8 9 10 11 12; do', 'for try in 1; do')),
    ('the production check waits ten minutes', lambda d: _sub(d, 'deploy', CONFIRM, 'sleep 10', 'sleep 60')),
    ('the production check reads previews too', lambda d: _sub(d, 'deploy', CONFIRM, 'env=production&', '')),
    ('the deploy checkout takes the rollback_ref unchecked', lambda d: _checkout(d)['with'].__setitem__('ref', '${{ inputs.rollback_ref }}')),
    ('a typo in a needs expression', lambda d: _step(d, 'gates-pass', r'.').__setitem__('env', {k: v.replace('gates-fast', 'gates-fat') for k, v in _step(d, 'gates-pass', r'.')['env'].items()})),
    ('an if that mixes ${{ }} with text', lambda d: _job(d, 'gates-fast').__setitem__('if', "${{ inputs.rollback_ref == '' }} && true")),
    ('a secret read in a gate job', lambda d: _job(d, 'gates-fast').__setitem__('env', {'T': '${{ secrets.CLOUDFLARE_API_TOKEN }}'})),
    ('write permission', lambda d: d.__setitem__('permissions', {'contents': 'write'})),
    ('a job with no timeout', lambda d: _job(d, 'gates-pass').pop('timeout-minutes')),
    ('rollback_ref interpolated into the guard', lambda d: _sub(d, 'deploy', GUARD, '"$ROLLBACK_REF^{commit}"', '"${{ inputs.rollback_ref }}^{commit}"')),
    ('a branch name interpolated into a run', lambda d: _job(d, 'gates-fast')['steps'].append({'name': 'x', 'run': 'echo "${{ github.head_ref }}"'})),
    ('github.ref_name interpolated into a run', lambda d: _job(d, 'gates-fast')['steps'].append({'name': 'x', 'run': 'echo "${{ github.ref_name }}"'})),
    ('github.base_ref interpolated into a run', lambda d: _job(d, 'gates-fast')['steps'].append({'name': 'x', 'run': 'echo "${{ github.base_ref }}"'})),
    ('a pull request title interpolated into a run', lambda d: _job(d, 'gates-fast')['steps'].append({'name': 'x', 'run': 'echo ${{ github.event.pull_request.title }}'})),
    ('an action from outside actions/ and github/', lambda d: _job(d, 'gates-fast')['steps'].append({'uses': 'someone/random-action@main'})),
    ('gh with no token', lambda d: _step(d, 'deploy', ORDER).pop('env')),
]


_SELF = []


def _worker(parent):
    """a self-test worker: its own scratch repository under the parent's, so
    two rollback guards never move the same checkout"""
    make_root(tempfile.mkdtemp(dir=parent))


def _judge_break(i):
    name, brk, *on_text = BREAKS[i]
    doc, text = _SELF
    d = copy.deepcopy(doc)
    try:
        brk(d)
        txt = on_text[0](text) if on_text else text
    except (KeyError, IndexError, TypeError, AttributeError) as e:
        return 'broken', '%s: %s' % (e.__class__.__name__, e)
    L = Lint(d, text=txt).run()
    return ('caught', L.fails[0]) if L.fails else ('passed', None)


def self_test(path):
    doc, err = load(path)
    if err:
        print('FAIL ' + err)
        return 1
    with open(path) as f:
        text = f.read()
    bad = 0
    base = Lint(copy.deepcopy(doc), text=text).run()
    if base.fails:
        bad += 1
        print('FAIL the unbroken file is not clean, so no break below can be judged:')
        for f in base.fails:
            print('     ' + f)
    else:
        print('  ok   the unbroken file: %d checks, none failed' % base.passed)
    _SELF[:] = [doc, text]
    try:
        import multiprocessing
        ctx = multiprocessing.get_context('fork')
        with ctx.Pool(min(4, os.cpu_count() or 1), initializer=_worker, initargs=(tmproot(),)) as pool:
            verdicts = pool.map(_judge_break, range(len(BREAKS)))
    except (ImportError, ValueError, OSError):
        verdicts = [_judge_break(i) for i in range(len(BREAKS))]
    for (name, *_), (kind, first) in zip(BREAKS, verdicts):
        if kind == 'caught':
            print('  ok   %s: caught, %s' % (name, first))
        else:
            bad += 1
            print('FAIL break %r could not be applied (%s); the file changed shape, update the break.' % (name, first)
                  if kind == 'broken' else 'FAIL %s: the lint passed it' % name)
    print('\n===== %d passed, %d failed =====' % (len(BREAKS) + 1 - bad, bad))
    return 1 if bad else 0


if __name__ == '__main__':
    args = [a for a in sys.argv[1:] if a != '--self-test']
    target = args[0] if args else WORKFLOW
    sys.exit(self_test(target) if '--self-test' in sys.argv[1:] else lint_file(target))
