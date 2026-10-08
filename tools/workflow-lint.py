#!/usr/bin/env python3
"""Workflow lint: .github/workflows/deploy.yml held to the shape it was ruled.

GitHub Actions rejects a bad expression only when the workflow runs, and a
workflow that runs but gates the wrong thing is never rejected at all. On 8
October deploy.yml ran on a push to main only, ran the engine gate only, and
published atuned.world whatever else was red. This file holds it to block 1 of
the cleanup:

  R1  Triggers. pull_request with no paths filter, so a docs only pull request
      still gets the checks and a required check never sits pending. push to
      main keeping its paths filter. workflow_dispatch with an optional string
      input rollback_ref. Never pull_request_target, in any workflow here: it
      would publish a public preview of onboarding, the 2 October exposure,
      which only the owner can delete.
  R2  Jobs. gates-fast; gates-browser, a matrix with one job per browser gate;
      gates-pass, the one check branch protection will require; deploy, which
      needs gates-pass and publishes only from main, or on a rollback dispatch
      that skips every gate. One deploy at a time.
  R3  The FAQ page is staged for the live site (M48).
  R4  The deploy secrets guard and the deploy command are unchanged.
  R5  Every gate tees its log under $RUNNER_TEMP/gates, under pipefail, and
      tools/floors.js holds each count to its floor in tests/floors.json.
  R6  Every ${{ }} expression parses, uses only functions and contexts GitHub
      allows where it sits, and names only needs, inputs, matrix keys and env
      variables that exist.

The job conditions are not matched as text. A small evaluator of GitHub's
expression language, below, runs them against every event this workflow can
see, and the gates-pass step is run in bash against every combination of job
results. Checking what a condition does, not what it looks like.

    python3 tools/workflow-lint.py [path]      one FAIL line per broken check, exit 1
    python3 tools/workflow-lint.py --self-test break the file one way at a time,
                                               in memory, and prove each break fails
"""
import copy
import glob
import json
import math
import os
import re
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
WORKFLOW = os.path.join(ROOT, '.github', 'workflows', 'deploy.yml')

MAIN = 'refs/heads/main'
PR_REF = 'refs/pull/1/merge'
BRANCH = 'refs/heads/claude/some-branch'
ROLLBACK = '8f565af'

# The push paths filter as it stood at 8f565af. A path may be added. None may
# go: a change under a removed path would reach main and never deploy.
PUSH_PATHS = ['atuned_src/**', 'funnel/**', 'tests/**', 'tools/**',
              'functions/**', 'atuned_funnel_system/**',
              '.github/workflows/deploy.yml']

# gate: (command, required, timeout in minutes). Required legs hold back a
# deploy. The others report and do not, until the lead flips them.
BROWSER = {
    'boot':       ('node tests/boot.js',       True,  20),
    'collide':    ('node tests/collide.js',    True,  20),
    'funnel':     ('node tests/funnel.js',     True,  20),
    'functional': ('node tests/functional.js', False, 45),
    'design':     ('node tests/design.js',     False, 20),
    'monitor':    ('node tools/monitor.js',    False, 20),
}
GATE_JOBS = ['gates-fast', 'gates-browser']
BUILDS = [r'\./atuned_src/BUILD-engine\.sh\b', r'\./atuned_src/BUILD\.sh\b',
          r'\./funnel/BUILD-single\.sh\b']
FUNNEL_PAGES = ['atuned-funnel', 'atuned-quiz', 'atuned-about', 'atuned-buy',
                'atuned-faq']

# R4, exactly as they stood at 8f565af.
GUARD_INSTALL = "env.CF_TOKEN != '' && env.CF_ACCOUNT != ''"
GUARD_DEPLOY = "github.ref == 'refs/heads/main' && env.CF_TOKEN != '' && env.CF_ACCOUNT != ''"
INSTALL_CMD = 'npm install --no-audit --no-fund wrangler@4'
DEPLOY_CMD = 'npx wrangler pages deploy deploy --project-name=atuned --commit-dirty=true'
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
# The checks
# ---------------------------------------------------------------------------

class Lint:
    def __init__(self, doc, root=ROOT):
        self.doc, self.root = doc, root
        self.passed, self.fails = 0, []
        self.pass_cache = {}

    def ok(self, cond, msg):
        if cond:
            self.passed += 1
        else:
            self.fails.append(msg)
        return cond

    def jobs(self):
        j = self.doc.get('jobs')
        return j if isinstance(j, dict) else {}

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
            have = [str(p) for p in as_list(push.get('paths'))]
            lost = [p for p in PUSH_PATHS if p not in have]
            self.ok(not lost and 'paths-ignore' not in push,
                    'R1 the push paths filter lost %s, so a change there would reach main and never deploy.' % (', '.join(lost) or 'its shape (paths-ignore)'))
        wd = on.get('workflow_dispatch') if 'workflow_dispatch' in on else False
        if self.ok(wd is not False, 'R1 no workflow_dispatch trigger, so there is no rollback route.'):
            inp = ((wd or {}).get('inputs') or {}).get('rollback_ref')
            self.ok(isinstance(inp, dict) and inp.get('type') == 'string' and not inp.get('required')
                    and inp.get('default', '') == '',
                    'R1 workflow_dispatch has no optional string input rollback_ref with an empty default.')

    # R2, simulated ---------------------------------------------------------
    def simulate(self, event, ref, rollback, results, cancelled):
        jobs, out, pending = self.jobs(), {}, list(self.jobs())
        inputs = {'rollback_ref': rollback} if event == 'workflow_dispatch' else {}
        github = {'event_name': event, 'ref': ref, 'repository': 'o/r'}
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
                    out[jid] = self.run_pass(job, ctx, status, nres)
                else:
                    out[jid] = 'cancelled' if cancelled else results.get(jid, 'success')
        return out

    def run_pass(self, job, ctx, status, nres):
        st = steps_of(job)
        if len(st) != 1 or not isinstance(st[0].get('run'), str):
            # malformed, already failed below; judge it as an honest one would
            return 'success' if all(r == 'success' for r in nres.values()) else 'failure'
        env = Env(ctx, status)
        try:
            script = tostr(render(st[0]['run'], env))
            envs = {}
            for d in (self.doc.get('env') or {}, job.get('env') or {}, st[0].get('env') or {}):
                for k, v in d.items():
                    envs[str(k)] = tostr(render(v, env))
        except ExprError:
            return 'failure'
        key = (script, tuple(sorted(envs.items())))
        if key not in self.pass_cache:
            base = {'PATH': os.environ.get('PATH', '/usr/bin:/bin'),
                    'GITHUB_REF': ctx['github']['ref'], 'GITHUB_EVENT_NAME': ctx['github']['event_name']}
            try:
                p = subprocess.run(['bash', '--noprofile', '--norc', '-eo', 'pipefail', '-c', script],
                                   env=dict(base, **envs), capture_output=True, text=True, timeout=30)
                self.pass_cache[key] = 'success' if p.returncode == 0 else 'failure'
            except (OSError, subprocess.TimeoutExpired):
                self.pass_cache[key] = 'failure'
        return self.pass_cache[key]

    def r2_conditions(self):
        jobs = self.jobs()
        missing = [j for j in GATE_JOBS + ['gates-pass', 'deploy'] if j not in jobs]
        if not self.ok(not missing, 'R2 missing job%s %s, so the run conditions cannot be checked.' % ('s' if len(missing) > 1 else '', ', '.join(missing))):
            return
        OKR = {'gates-fast': 'success', 'gates-browser': 'success'}
        RED_F = {'gates-fast': 'failure', 'gates-browser': 'success'}
        RED_B = {'gates-fast': 'success', 'gates-browser': 'failure'}
        GONE_B = {'gates-fast': 'success', 'gates-browser': 'cancelled'}
        RAN = 'ran'
        scenarios = [
            ('a pull request', 'pull_request', PR_REF, None, OKR, False,
             {'gates-fast': RAN, 'gates-browser': RAN, 'gates-pass': 'success', 'deploy': 'skipped'}),
            ('a pull request with a red fast gate', 'pull_request', PR_REF, None, RED_F, False,
             {'gates-pass': 'failure', 'deploy': 'skipped'}),
            ('a pull request with a red browser gate', 'pull_request', PR_REF, None, RED_B, False,
             {'gates-pass': 'failure', 'deploy': 'skipped'}),
            ('a pull request, cancelled', 'pull_request', PR_REF, None, OKR, True,
             {'gates-pass': 'failure', 'deploy': 'skipped'}),
            ('a push to main', 'push', MAIN, None, OKR, False,
             {'gates-fast': RAN, 'gates-browser': RAN, 'gates-pass': 'success', 'deploy': RAN}),
            ('a push to main with a red fast gate', 'push', MAIN, None, RED_F, False,
             {'gates-pass': 'failure', 'deploy': 'skipped'}),
            ('a push to main with a red browser gate', 'push', MAIN, None, RED_B, False,
             {'gates-pass': 'failure', 'deploy': 'skipped'}),
            ('a push to main with a cancelled browser gate', 'push', MAIN, None, GONE_B, False,
             {'gates-pass': 'failure', 'deploy': 'skipped'}),
            ('a push to main, cancelled', 'push', MAIN, None, OKR, True,
             {'deploy': 'skipped'}),
            ('a push to a branch', 'push', BRANCH, None, OKR, False,
             {'deploy': 'skipped'}),
            ('a dispatch on main with no rollback_ref', 'workflow_dispatch', MAIN, '', OKR, False,
             {'gates-fast': RAN, 'gates-browser': RAN, 'gates-pass': 'success', 'deploy': RAN}),
            ('a dispatch on main with no rollback_ref and a red gate', 'workflow_dispatch', MAIN, '', RED_B, False,
             {'gates-pass': 'failure', 'deploy': 'skipped'}),
            ('a dispatch on a branch with no rollback_ref', 'workflow_dispatch', BRANCH, '', OKR, False,
             {'gates-fast': RAN, 'gates-pass': 'success', 'deploy': 'skipped'}),
            ('a rollback dispatch', 'workflow_dispatch', MAIN, ROLLBACK, OKR, False,
             {'gates-fast': 'skipped', 'gates-browser': 'skipped', 'gates-pass': 'skipped', 'deploy': RAN}),
            ('a rollback dispatch on a branch', 'workflow_dispatch', BRANCH, ROLLBACK, OKR, False,
             {'gates-fast': 'skipped', 'gates-browser': 'skipped', 'deploy': RAN}),
            ('a rollback dispatch, cancelled', 'workflow_dispatch', MAIN, ROLLBACK, OKR, True,
             {'deploy': 'skipped'}),
        ]
        for name, event, ref, rb, results, cancelled, expect in scenarios:
            got = self.simulate(event, ref, rb, results, cancelled)
            for jid, want in expect.items():
                g = got.get(jid, 'skipped')
                hit = (g != 'skipped') if want == RAN else (g == want)
                self.ok(hit, 'R2 on %s, %s is %s; it must be %s.' % (
                    name, jid, 'run' if g not in ('skipped',) and want in (RAN, 'skipped') else g,
                    'run' if want == RAN else want))

    # R2, gates-pass's own step against every combination of results --------
    def r2_pass_step(self):
        job = self.jobs().get('gates-pass')
        if not isinstance(job, dict):
            return
        nd = needs_of(job)
        self.ok(all(g in nd for g in GATE_JOBS), 'R2 gates-pass does not need %s.' % ', '.join(g for g in GATE_JOBS if g not in nd))
        self.ok(job.get('name') in (None, 'gates-pass'),
                'R2 gates-pass is renamed %r; branch protection will require the check by the name gates-pass.' % job.get('name'))
        st = steps_of(job)
        if not self.ok(len(st) == 1 and isinstance(st[0].get('run'), str) and 'uses' not in st[0],
                       'R2 gates-pass must be a single run step.'):
            return
        ctx = {'github': {'event_name': 'pull_request', 'ref': PR_REF}, 'inputs': {}, 'vars': {}}
        results = ['success', 'failure', 'cancelled', 'skipped']
        for a in results:
            for b in results:
                nres = {'gates-fast': a, 'gates-browser': b}
                for n in nd:
                    nres.setdefault(n, 'success')
                c = dict(ctx, needs={n: {'result': r, 'outputs': {}} for n, r in nres.items()})
                got = self.run_pass(job, c, {'cancelled': False, 'needs_ok': False, 'needs_failed': False}, nres)
                want = 'success' if a == b == 'success' else 'failure'
                self.ok(got == want, 'R2 the gates-pass step reads %s when gates-fast is %s and gates-browser is %s; a skipped or cancelled required job is a failure.' % (got, a, b))

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
        if not self.ok(p is not None, 'R2 %s does not run %s%s.' % (where, cmd_rx.replace('\\', ''), ' after the builds' if after else '')):
            return None
        line = m.string[m.start():].split('\n', 1)[0]
        self.ok(re.search(r'\|\s*tee\b[^\n]*\$\{?RUNNER_TEMP\}?/gates/' + re.escape(log) + r'\b', line) is not None,
                'R5 %s does not tee %s to $RUNNER_TEMP/gates/%s, so tools/floors.js has nothing to read.' % (where, cmd_rx.replace('\\', ''), log))
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
        job = self.jobs().get('gates-fast')
        if not isinstance(job, dict):
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
            try:
                absent = condition(s.get('if'), static_env(files=set()))
                present = condition(s.get('if'), static_env(files={'tests/chrome-path.js'}))
            except ExprError:
                absent, present = True, False
            self.ok(not absent and present,
                    "R2 the chrome-path step must run only when the file exists: if: hashFiles('tests/chrome-path.js') != ''.")
        fa = self.floors_args(texts)
        want = ['engine', 'funnel-package']
        hit = [a for a in fa if all(w in a[1] for w in want)]
        if self.ok(hit, 'R5 gates-fast does not run node tools/floors.js engine funnel-package.'):
            self.ok(pe is not None and hit[0][0] > pe, 'R5 gates-fast checks the floors before the gates have run.')
            self.floors_known('gates-fast', hit[0][1])
        self.ok(os.path.isfile(os.path.join(self.root, 'tools', 'floors.js')), 'R5 tools/floors.js does not exist.')
        p, m, s = find(texts, r'test -s\b')
        txt = s.get('run', '') if s else ''
        self.ok(p is not None and 'funnel/dist/' in txt and all(re.search(r'\b%s\b' % re.escape(f), txt) for f in FUNNEL_PAGES),
                'R2 gates-fast does not check that the funnel built all of %s, the FAQ page included.' % ', '.join(FUNNEL_PAGES))
        if p is not None and built is not None:
            self.ok(p > built, 'R2 gates-fast checks the funnel built before building it.')

    def r2_browser(self):
        job = self.jobs().get('gates-browser')
        if not isinstance(job, dict):
            return
        strat = job.get('strategy') or {}
        self.ok(strat.get('fail-fast') is False,
                'R2 gates-browser does not set fail-fast: false, so one red gate cancels the others and hides what else is red.')
        ls = legs(job)
        if not self.ok(ls, 'R2 gates-browser has no matrix.'):
            return
        names = [str(l.get('gate')) for l in ls]
        self.ok(sorted(names) == sorted(BROWSER),
                'R2 gates-browser runs %s; it must run each of %s once.' % (', '.join(names), ', '.join(BROWSER)))
        for leg in ls:
            g = str(leg.get('gate'))
            if g not in BROWSER:
                continue
            cmd, required, minutes = BROWSER[g]
            where = 'gates-browser (%s)' % g
            self.ok(leg.get('required') is required,
                    'R2 %s has required: %r; it must be %r.' % (where, leg.get('required'), required))
            env = static_env(leg)
            try:
                t = render(job.get('timeout-minutes'), env)
                coe = render(job.get('continue-on-error', False), env)
            except ExprError:
                t, coe = None, None
            self.ok(t is not None and num(t) == minutes,
                    'R2 %s has timeout-minutes %s; it must be %d.' % (where, tostr(t) or 'unset', minutes))
            self.ok(coe is not None and truthy(coe) == (not required),
                    'R2 %s has continue-on-error %s; it must be %s, which is continue-on-error: ${{ !matrix.required }}.' % (
                        where, tostr(coe), 'false' if required else 'true'))
            texts = run_texts(job, leg)
            built = self.common(where, job, texts, leg)
            self.ok(find(texts, r'npm install -g\b[^\n]*\bplaywright@1\.56\.1\b')[0] is not None,
                    'R2 %s does not install playwright@1.56.1 globally.' % where)
            self.ok(find(texts, r'npx playwright install --with-deps chromium\b')[0] is not None,
                    'R2 %s does not run npx playwright install --with-deps chromium.' % where)
            self.ok(any('NODE_PATH' in t and 'npm root -g' in t and 'GITHUB_ENV' in t for _, _, t in texts),
                    'R2 %s does not set NODE_PATH to $(npm root -g) through $GITHUB_ENV.' % where)
            self.ok(any(re.search(r'\bCHROME\b', t) and 'chromium.executablePath()' in t and 'GITHUB_ENV' in t for _, _, t in texts),
                    "R2 %s does not set CHROME to playwright's chromium.executablePath() through $GITHUB_ENV." % where)
            pg = self.teed(where, texts, re.escape(cmd) + r'\b', g + '.log', built)
            fa = [a for a in self.floors_args(texts) if g in a[1]]
            if self.ok(fa, 'R5 %s does not run node tools/floors.js %s.' % (where, g)):
                self.ok(pg is not None and fa[0][0] > pg, 'R5 %s checks its floor before the gate has run.' % where)
                self.floors_known(where, [g])

    # R2, R3, R4, the deploy job --------------------------------------------
    def r2_deploy(self):
        job = self.jobs().get('deploy')
        if not self.ok(isinstance(job, dict), 'R2 there is no deploy job.'):
            return
        self.ok('gates-pass' in needs_of(job), 'R2 deploy does not need gates-pass, so it can publish over a red gate.')
        self.ok(job.get('concurrency') == {'group': 'pages-prod', 'cancel-in-progress': False},
                'R2 deploy does not set concurrency { group: pages-prod, cancel-in-progress: false }, so two deploys can overlap and whichever finishes last stays live.')
        st = steps_of(job)
        co = [i for i, s in enumerate(st) if str(s.get('uses', '')).startswith('actions/checkout@')]
        if self.ok(len(co) == 1, 'R2 deploy must check out exactly once.'):
            ref = (st[co[0]].get('with') or {}).get('ref')
            try:
                on_rb = render(ref, Env({'inputs': {'rollback_ref': ROLLBACK}, 'github': {}}))
                on_push = render(ref, Env({'inputs': {}, 'github': {}}))
            except ExprError:
                on_rb, on_push = None, 'x'
            self.ok(tostr(on_rb) == ROLLBACK and tostr(on_push) == '',
                    'R2 the deploy checkout must take ref: ${{ inputs.rollback_ref }}, which is the rollback commit on a rollback and empty, so the pushed commit, otherwise.')
            guard = None
            for s in st[:co[0]]:
                try:
                    rb = condition(s.get('if'), Env({'inputs': {'rollback_ref': ROLLBACK}, 'github': {'ref': MAIN}}))
                    push = condition(s.get('if'), Env({'inputs': {}, 'github': {'ref': MAIN}}))
                except ExprError:
                    continue
                if rb and not push:
                    guard = s
            g = (guard or {}).get('run', '')
            self.ok(guard is not None and 'refs/heads/main' in g and 'compare/main...' in g and 'exit 1' in g,
                    'R2 deploy has no guard, before its checkout and on a rollback only, that refuses a rollback dispatched off main or to a commit not on main.')
        texts = run_texts(job)
        stage = [t for _, s, t in texts if 'mkdir deploy' in t]
        lines = [l.strip() for l in (stage[0] if stage else '').split('\n')]
        if self.ok(stage, 'R3 deploy has no staging step.'):
            self.ok(all(l in lines for l in STAGE_LINES),
                    'R3 the staging step lost %s.' % ', '.join(l for l in STAGE_LINES if l not in lines))
            self.ok(FAQ_LINE in lines,
                    'R3 the staging step does not run %s, and the FAQ is linked seven times from three live pages (M48).' % FAQ_LINE)
        env = job.get('env') or {}
        self.ok(env.get('CF_TOKEN') == '${{ secrets.CLOUDFLARE_API_TOKEN }}' and env.get('CF_ACCOUNT') == '${{ secrets.CLOUDFLARE_ACCOUNT_ID }}',
                'R4 the deploy job no longer maps CF_TOKEN and CF_ACCOUNT from the two Cloudflare secrets.')
        inst = [s for s in st if INSTALL_CMD in str(s.get('run', ''))]
        self.ok(len(inst) == 1 and str(inst[0].get('if', '')).strip() == GUARD_INSTALL,
                'R4 the wrangler install step is not guarded by exactly: %s' % GUARD_INSTALL)
        dep = [s for s in st if 'wrangler pages deploy' in str(s.get('run', ''))]
        if self.ok(len(dep) == 1, 'R4 deploy must run wrangler pages deploy in exactly one step.'):
            d = dep[0]
            self.ok(str(d.get('if', '')).strip() == GUARD_DEPLOY, 'R4 the deploy step is not guarded by exactly: %s' % GUARD_DEPLOY)
            self.ok(str(d.get('run', '')).strip() == DEPLOY_CMD, 'R4 the deploy command is not exactly: %s' % DEPLOY_CMD)
            de = d.get('env') or {}
            self.ok(de.get('CLOUDFLARE_API_TOKEN') == '${{ secrets.CLOUDFLARE_API_TOKEN }}' and de.get('CLOUDFLARE_ACCOUNT_ID') == '${{ secrets.CLOUDFLARE_ACCOUNT_ID }}',
                    'R4 the deploy step no longer passes the two Cloudflare secrets to wrangler.')
            for tok, acct, ref, want in (('t', 'a', MAIN, True), ('', 'a', MAIN, False), ('t', '', MAIN, False), ('t', 'a', BRANCH, False)):
                try:
                    got = condition(d.get('if'), Env({'env': {'CF_TOKEN': tok, 'CF_ACCOUNT': acct}, 'github': {'ref': ref}}))
                except ExprError:
                    got = None
                self.ok(got is want, 'R4 the deploy step %s with token %s, account %s, on %s.' % (
                    'runs' if got else 'does not run', 'set' if tok else 'unset', 'set' if acct else 'unset', ref))

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

    def r2_paths_exist(self):
        for jid in GATE_JOBS:
            job = self.jobs().get(jid)
            if not isinstance(job, dict):
                continue
            for leg in (legs(job) or [None]):
                for i, s, t in run_texts(job, leg):
                    cond = str(s.get('if', ''))
                    for m in re.finditer(r'(?:\bnode|\bpython3)\s+((?:\./)?[\w./-]+\.(?:js|py))\b|(\./[\w./-]+\.sh)\b', t):
                        p = m.group(1) or m.group(2)
                        if "hashFiles('%s')" % p.lstrip('./') in cond:
                            continue
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
            good = True
            for n in nodes(tree):
                if n[0] == 'call':
                    name = n[1]
                    lo, hi = FUNCS.get(name, (0, 99))
                    good &= self.ok(name in FUNCS, 'R6 %s: %s() is not a GitHub function.' % (where, name))
                    good &= self.ok(name not in STATUS or name in funcs, 'R6 %s: %s() works only in an if.' % (where, name))
                    good &= self.ok(name != 'hashfiles' or name in funcs, 'R6 %s: hashFiles() works only in a step.' % where)
                    good &= self.ok(lo <= len(n[2]) <= hi, 'R6 %s: %s() given %d arguments.' % (where, name, len(n[2])))
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

    def run(self, other_workflows=()):
        self.r1_triggers(other_workflows)
        self.r2_conditions()
        self.r2_pass_step()
        self.r2_fast()
        self.r2_browser()
        self.r2_deploy()
        self.r2_hygiene()
        self.r2_paths_exist()
        self.r6_expressions()
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
    L = Lint(doc).run(others(path))
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


BREAKS = [
    ('a paths filter on pull_request', lambda d: _on(d).__setitem__('pull_request', {'paths': ['atuned_src/**']})),
    ('pull_request_target added', lambda d: _on(d).__setitem__('pull_request_target', None)),
    ('the push paths filter dropped', lambda d: _on(d)['push'].pop('paths')),
    ('rollback_ref made required', lambda d: _on(d)['workflow_dispatch']['inputs']['rollback_ref'].__setitem__('required', True)),
    ('deploy without needs', lambda d: _job(d, 'deploy').pop('needs')),
    ('deploy without concurrency', lambda d: _job(d, 'deploy').pop('concurrency')),
    ('deploy with if: always()', lambda d: _job(d, 'deploy').__setitem__('if', 'always()')),
    ('deploy with no if at all', lambda d: _job(d, 'deploy').pop('if')),
    ('gates-fast runs on a rollback', lambda d: _job(d, 'gates-fast').pop('if')),
    ('gates-pass without always()', lambda d: _job(d, 'gates-pass').__setitem__('if', "inputs.rollback_ref == ''")),
    ('gates-pass passes a skipped job', lambda d: _sub(d, 'gates-pass', r'exit 1', 'exit 1', 'exit 0')),
    ('every browser leg allowed to fail', lambda d: _job(d, 'gates-browser').__setitem__('continue-on-error', True)),
    ('fail-fast left on', lambda d: _job(d, 'gates-browser')['strategy'].pop('fail-fast')),
    ('a browser gate dropped from the matrix', lambda d: _job(d, 'gates-browser')['strategy']['matrix']['include'].pop(0)),
    ('the build order reversed', lambda d: _sub(d, 'gates-fast', r'BUILD-engine', './atuned_src/BUILD-engine.sh && ./atuned_src/BUILD.sh', './atuned_src/BUILD.sh && ./atuned_src/BUILD-engine.sh')),
    ('the engine gate not teed', lambda d: _sub(d, 'gates-fast', r'tests/engine\.js', 'engine.log', 'engine.txt')),
    ('no pipefail', lambda d: d['defaults']['run'].__setitem__('shell', 'sh')),
    ('the chrome-path step run unconditionally', lambda d: _step(d, 'gates-fast', r'chrome-path').pop('if')),
    ('the FAQ not staged', lambda d: _sub(d, 'deploy', r'mkdir deploy', 'cp funnel/dist/atuned-faq.html deploy/\n', '')),
    ('the FAQ not checked', lambda d: _sub(d, 'gates-fast', r'test -s', ' atuned-faq', '')),
    ('the deploy command changed', lambda d: _sub(d, 'deploy', r'wrangler pages deploy', ' --commit-dirty=true', '')),
    ('the secrets guard dropped', lambda d: _step(d, 'deploy', r'wrangler pages deploy').__setitem__('if', "github.ref == 'refs/heads/main'")),
    ('the deploy checkout ignores rollback_ref', lambda d: [s.pop('with', None) for s in steps_of(_job(d, 'deploy')) if str(s.get('uses', '')).startswith('actions/checkout@')]),
    ('a typo in a needs expression', lambda d: _step(d, 'gates-pass', r'.').__setitem__('env', {k: v.replace('gates-fast', 'gates-fat') for k, v in _step(d, 'gates-pass', r'.')['env'].items()})),
    ('an if that mixes ${{ }} with text', lambda d: _job(d, 'gates-fast').__setitem__('if', "${{ inputs.rollback_ref == '' }} && true")),
    ('a secret read in a gate job', lambda d: _job(d, 'gates-fast').__setitem__('env', {'T': '${{ secrets.CLOUDFLARE_API_TOKEN }}'})),
    ('write permission', lambda d: d.__setitem__('permissions', {'contents': 'write'})),
]


def self_test(path):
    doc, err = load(path)
    if err:
        print('FAIL ' + err)
        return 1
    bad = 0
    base = Lint(copy.deepcopy(doc)).run()
    if base.fails:
        bad += 1
        print('FAIL the unbroken file is not clean, so no break below can be judged:')
        for f in base.fails:
            print('     ' + f)
    else:
        print('  ok   the unbroken file: %d checks, none failed' % base.passed)
    for name, brk in BREAKS:
        d = copy.deepcopy(doc)
        try:
            brk(d)
        except (KeyError, IndexError, TypeError, AttributeError) as e:
            bad += 1
            print('FAIL break %r could not be applied (%s: %s); the file changed shape, update the break.' % (name, e.__class__.__name__, e))
            continue
        L = Lint(d).run()
        if L.fails:
            print('  ok   %s: caught, %s' % (name, L.fails[0]))
        else:
            bad += 1
            print('FAIL %s: the lint passed it' % name)
    print('\n===== %d passed, %d failed =====' % (len(BREAKS) + 1 - bad, bad))
    return 1 if bad else 0


if __name__ == '__main__':
    args = [a for a in sys.argv[1:] if a != '--self-test']
    target = args[0] if args else WORKFLOW
    sys.exit(self_test(target) if '--self-test' in sys.argv[1:] else lint_file(target))
