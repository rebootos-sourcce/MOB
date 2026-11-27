#!/usr/bin/env node
/* ============================================================
   GATES. "Every gate passed", said by the run and not by the seat.

   CLAUDE.md carried a column of ten commands under "Before you commit",
   and .github/workflows/deploy.yml carried what CI actually runs. The two
   were written by hand and drifted: the column never had the chrome-path
   scan, the products check, the orphans check, the evidence ledger, the
   plan self grant watch or most of the browser gates, so a seat could run
   all ten, see green, and push a change CI then failed. On 2 November a
   tests/chrome-path.js failure went out exactly that way.

   This file reads deploy.yml itself, with PyYAML, the same reader
   tools/workflow-lint.py uses, and runs what it says, in the order CI runs
   it: every gates-fast step, then every gates-browser leg, then every
   gates-report leg, then tools/floors.js over the logs those runs wrote.
   Nothing about which gates exist is typed here. A gate added to the
   workflow is run here on the next run without an edit to this file.

   WHAT IT DOES NOT RUN, AND SAYS SO. A runner starts empty, so CI's jobs
   open with steps that put a checkout, node, python, PyYAML, typescript and
   playwright on the machine. Those are not gates, and running them here
   would reinstall packages globally on somebody's machine. Each is matched
   by its exact text in PROVIDED below and replaced by a check that the
   machine already has the thing, which is reported in the footer like any
   step. A step that is neither a gate this file can run nor a setup step it
   knows is UNRUNNABLE, and tools/workflow-lint.py fails on any unrunnable
   step, so a new step in deploy.yml that this file cannot run is red on the
   pull request that adds it. That is the drift this file exists to stop.

   HOW A STEP RUNS. Under bash --noprofile --norc -eo pipefail, which is
   what GitHub runs `shell: bash` as, from the repository root (or its
   working-directory), with the workflow's env, RUNNER_TEMP pointed at a
   fresh directory, and GITHUB_ENV, GITHUB_OUTPUT and GITHUB_STEP_SUMMARY
   pointed at files in it. A KEY=VALUE written to GITHUB_ENV reaches the
   later steps of the same job, as on a runner. A red step skips the rest of
   its job, as on a runner, and the other jobs still run, as on a runner.

   MATRIX JOBS. CI gives every leg its own runner, which builds again. Here
   the steps that do not name `matrix` run once per job, the build among
   them, and the steps that do run once per leg, in leg order. A leg's step
   sees ${{ matrix.gate }} and ${{ matrix.command }} filled from its leg.
   Legs run one at a time unless --jobs says otherwise: four browsers at
   once on one machine is a load CI never puts on a gate, and it is exactly
   the load that surfaced station R's clock race.

   REQUIRED AND REPORT ONLY. gates-report has continue-on-error, so CI's
   gates-pass never waits for it. Here the same: its legs run and are
   printed, and the exit code is 0 only when every gates-fast step, every
   gates-browser leg and the final floors pass, which is gates-pass's own
   rule.

   THE FOOTER is stamped: the commit, the md5 of source.html as this run
   built it, whether the tree was dirty before the run and after it, the
   time, and every step's result. The build rewrites source.html and the
   other products in the working tree, exactly as it does in CI's checkout,
   so "dirty after" is expected; "dirty before" is the line that says the
   commit named is not quite what was tested.

     node tools/gates.js                  everything CI runs, in CI's order
     node tools/gates.js --fast           gates-fast only, and the floors
     node tools/gates.js --jobs 4         run four matrix legs at once
     node tools/gates.js --keep DIR       logs in DIR, kept, instead of a temp dir
     node tools/gates.js --verbose        every step's output, as it runs
     node tools/gates.js --plan [--json]  what would run, and what cannot
     node tools/gates.js --list --json    every browser leg, for the nightly
     node tools/gates.js --workflow FILE  another workflow file (the self test)
     node tools/gates.js --workflow-json -  the workflow as JSON on stdin,
                                          which is how tools/workflow-lint.py
                                          hands it an in-memory break
   ============================================================ */
'use strict';
const fs = require('fs'), path = require('path'), os = require('os'), cp = require('child_process'), crypto = require('crypto');

const ROOT = path.join(__dirname, '..');
const WORKFLOW = path.join(ROOT, '.github', 'workflows', 'deploy.yml');
// The jobs this file runs, in CI's order. gates-pass, gates-report-summary
// and deploy read job results or publish; none of them is a gate.
const JOBS = ['gates-fast', 'gates-browser', 'gates-report'];
const FAST = ['gates-fast'];
// The one job condition a gate job carries: skip on a rollback. A local run
// is never a rollback. Any other condition is one this file cannot judge.
// what the three builds write; a tree dirty only in these was rebuilt by the run
const PRODUCTS = /^(source\.html|engine\.js|atuned-packed\.html|atuned-slim\.html|funnel\/tokens\.css|funnel\/dist\/.*)$/;
const JOB_IF_OK = new Set(["inputs.rollback_ref == ''"]);

/* Setup actions. A local checkout already is what each of these makes. */
const ENV_ACTIONS = {
  'actions/checkout': () => fs.existsSync(path.join(ROOT, '.git')) ? [true, 'this checkout']
    : [false, 'no .git at ' + ROOT],
  'actions/setup-node': (w) => {
    const want = String((w && w['node-version']) || '').split('.')[0];
    const have = process.versions.node.split('.')[0];
    return [true, 'node ' + process.versions.node + (want && want !== have ? ', CI pins ' + want + ': a difference to keep in mind' : '')];
  },
  'actions/setup-python': (w) => {
    const r = sh('python3', ['--version']);
    return r.ok ? [true, r.out.trim() + (w && w['python-version'] ? ' (CI pins ' + w['python-version'] + ')' : '')] : [false, 'python3 is not on PATH'];
  },
};

/* Install steps, matched by their whole text. A change to one of these lines
   in deploy.yml stops it matching, which makes it unrunnable, which fails the
   workflow lint, which is how this table is kept true. */
const PROVIDED = [
  { what: 'PyYAML', rx: /^python3 -m pip install\b[^\n]*\bpyyaml==([\d.]+)$/,
    check: (m) => { const r = sh('python3', ['-c', 'import yaml; print(yaml.__version__)']);
      return r.ok ? [true, 'PyYAML ' + r.out.trim() + (r.out.trim() !== m[1] ? ', CI pins ' + m[1] : '')] : [false, 'python3 cannot import yaml: python3 -m pip install pyyaml'] } },
  { what: 'typescript', rx: /^npm install --no-audit --no-fund --no-save typescript$/,
    check: () => { const r = sh('npx', ['--no-install', 'tsc', '-v']);
      return r.ok ? [true, 'tsc ' + r.out.trim().replace(/^Version\s*/, '') + ', found by npx --no-install as tools/slim.py asks']
        : [false, 'npx --no-install tsc finds no tsc, and tools/slim.py needs it: npm install --no-save typescript'] } },
  { what: 'playwright', rx: /^npm install -g --no-audit --no-fund playwright@([\d.]+)\nnpx playwright install --with-deps chromium$/,
    check: (m) => { const r = sh('bash', ['-c', 'NODE_PATH="$(npm root -g)" node -e "console.log(require(\'playwright/package.json\').version)"']);
      if (!r.ok) return [false, 'no playwright under npm root -g, where the next step looks: npm install -g playwright@' + m[1]];
      const v = r.out.trim();
      return v === m[1] ? [true, 'playwright ' + v] : [false, 'playwright ' + v + ' under npm root -g, and CI pins ' + m[1]] } },
];

function sh(cmd, args, opt) {
  const r = cp.spawnSync(cmd, args, Object.assign({ cwd: ROOT, encoding: 'utf8', maxBuffer: 16 << 20 }, opt || {}));
  return { ok: r.status === 0, out: (r.stdout || '') + (r.stderr || ''), status: r.status };
}

/* ---- reading the workflow ---- */
function loadYaml(file) {
  const r = cp.spawnSync('python3', ['-c',
    'import json, sys\ntry:\n    import yaml\nexcept ImportError:\n    sys.exit("PyYAML is not installed (python3 -m pip install pyyaml), so the workflow cannot be read")\n'
    + 'json.dump(yaml.safe_load(open(sys.argv[1])), sys.stdout, default=str)', file], { encoding: 'utf8', maxBuffer: 16 << 20 });
  if (r.error) throw new Error('python3 could not be started: ' + r.error.message);
  if (r.status !== 0) throw new Error((r.stderr || '').trim() || 'python3 exited ' + r.status + ' reading ' + file);
  return JSON.parse(r.stdout);
}

const EXPR = /\$\{\{\s*([^}]*?)\s*\}\}/g;
const strings = (v) => typeof v === 'string' ? [v] : Array.isArray(v) ? v.flatMap(strings)
  : v && typeof v === 'object' ? Object.values(v).flatMap(strings) : [];
const usesMatrix = (s) => strings(s).some(t => /\$\{\{[^}]*\bmatrix\./.test(t));
const stepName = (s, i) => String(s.name || s.uses || (typeof s.run === 'string' ? s.run.split('\n')[0] : 'step ' + i)).slice(0, 80);

function legsOf(job) {
  const m = job.strategy && job.strategy.matrix;
  if (!m) return null;
  if (typeof m === 'string' || Object.keys(m).some(k => k !== 'include') || !Array.isArray(m.include)) return 'bad';
  return m.include;
}

/* fill ${{ matrix.x }} from a leg; anything else left in ${{ }} is unrunnable */
function fill(text, leg) {
  let bad = null;
  const out = String(text).replace(EXPR, (all, e) => {
    const m = /^matrix\.([\w-]+)$/.exec(e);
    if (m && leg && Object.prototype.hasOwnProperty.call(leg, m[1])) return String(leg[m[1]]);
    bad = bad || all;
    return all;
  });
  return { out, bad };
}

/* One step: what this file will do with it. */
function classify(step, leg) {
  if (!step || typeof step !== 'object') return { kind: 'unrunnable', why: 'is not a step' };
  if ('if' in step) return { kind: 'unrunnable', why: 'has if: ' + JSON.stringify(step.if) + ', which gates.js does not evaluate' };
  if ('continue-on-error' in step) return { kind: 'unrunnable', why: 'has continue-on-error, which gates.js does not honour' };
  if (step.uses) {
    const base = String(step.uses).split('@')[0];
    if (ENV_ACTIONS[base]) return { kind: 'env', action: base, with: step.with || {} };
    return { kind: 'unrunnable', why: 'uses ' + step.uses + ', an action gates.js does not know how to stand in for' };
  }
  if (typeof step.run !== 'string') return { kind: 'unrunnable', why: 'has neither run nor uses' };
  if (step.shell && step.shell !== 'bash') return { kind: 'unrunnable', why: 'runs under shell ' + step.shell + ', and gates.js runs bash' };
  const env = {};
  for (const [k, v] of Object.entries(step.env || {})) {
    const f = fill(v, leg);
    if (f.bad) return { kind: 'unrunnable', why: 'sets env ' + k + ' from ' + f.bad + ', which gates.js cannot read locally' };
    env[k] = f.out;
  }
  const f = fill(step.run, leg);
  if (f.bad) return { kind: 'unrunnable', why: 'puts ' + f.bad + ' into its script, which gates.js cannot fill locally' };
  const text = f.out.trim();
  for (const p of PROVIDED) {
    const m = p.rx.exec(text);
    if (m) return { kind: 'provided', what: p.what, check: () => p.check(m) };
  }
  // an install PROVIDED does not know is never run on a person's machine:
  // it would change what is installed for everything else on it
  if (/(^|[\n;&|]\s*)(npm (install|i) [^\n]*(-g\b|--global\b)|(python3? -m )?pip3? install\b|npx playwright install\b|apt(-get)? install\b|sudo\b)/.test(text))
    return { kind: 'unrunnable', why: 'installs onto the machine with a line tools/gates.js PROVIDED does not match, so gates.js will not run it on a person\'s machine; add it to PROVIDED with a check' };
  let cwd = ROOT;
  if (step['working-directory']) {
    const w = fill(step['working-directory'], leg);
    if (w.bad) return { kind: 'unrunnable', why: 'has a working-directory gates.js cannot fill' };
    cwd = path.join(ROOT, w.out);
  }
  return { kind: 'run', script: f.out, env, cwd };
}

/* The whole plan, and every reason it cannot be run as CI runs it. */
function plan(doc, jobs) {
  const out = { jobs: [], problems: [] };
  const wenv = {};
  for (const [k, v] of Object.entries((doc && doc.env) || {})) {
    if (/\$\{\{/.test(String(v))) out.problems.push('the workflow env ' + k + ' holds an expression gates.js cannot read locally');
    else wenv[k] = String(v);
  }
  out.env = wenv;
  const dflt = (((doc || {}).defaults || {}).run || {}).shell;
  if (dflt && dflt !== 'bash') out.problems.push('the workflow default shell is ' + dflt + ', and gates.js runs bash');
  const all = (doc && doc.jobs) || {};
  for (const jid of jobs) {
    const job = all[jid];
    if (!job || typeof job !== 'object') { out.problems.push(jid + ' is not a job in the workflow, so gates.js has nothing to run for it'); continue; }
    const J = { id: jid, report: job['continue-on-error'] === true || String(job['continue-on-error']).trim() === 'true',
      timeout: job['timeout-minutes'], shared: [], perLeg: [], legs: null, envProblems: [] };
    if ('if' in job && !JOB_IF_OK.has(String(job.if).trim()))
      out.problems.push(jid + ' has if: ' + JSON.stringify(job.if) + ', which gates.js does not evaluate');
    for (const k of ['container', 'services', 'uses'])
      if (k in job) out.problems.push(jid + ' has ' + k + ':, which gates.js cannot stand up locally');
    const jsh = ((job.defaults || {}).run || {}).shell;
    if (jsh && jsh !== 'bash') out.problems.push(jid + ' runs under shell ' + jsh + ', and gates.js runs bash');
    J.env = {};
    for (const [k, v] of Object.entries(job.env || {})) {
      if (/\$\{\{/.test(String(v))) out.problems.push(jid + ' env ' + k + ' holds an expression gates.js cannot read locally');
      else J.env[k] = String(v);
    }
    const legs = legsOf(job);
    if (legs === 'bad') { out.problems.push(jid + ' has a matrix that is not one include list, which gates.js cannot expand'); continue; }
    J.legs = legs;
    const steps = Array.isArray(job.steps) ? job.steps : [];
    if (!steps.length) out.problems.push(jid + ' has no steps');
    let seenLeg = false;
    steps.forEach((s, i) => {
      const name = stepName(s, i);
      if (legs && usesMatrix(s)) {
        seenLeg = true;
        J.perLeg.push({ i, name, step: s });
        for (const leg of legs) {
          const c = classify(s, leg);
          if (c.kind === 'unrunnable') out.problems.push(jid + ' (' + (leg.gate || '?') + ') step ' + JSON.stringify(name) + ' ' + c.why);
        }
        return;
      }
      if (legs && seenLeg) out.problems.push(jid + ' step ' + JSON.stringify(name) + ' does not use the matrix and sits after one that does, so gates.js cannot run it once for the whole job');
      const c = classify(s, null);
      if (c.kind === 'unrunnable') out.problems.push(jid + ' step ' + JSON.stringify(name) + ' ' + c.why);
      J.shared.push({ i, name, step: s, c });
    });
    J.stepCount = steps.length;
    out.jobs.push(J);
  }
  return out;
}

/* the gates gates-fast's own floors step names, so the final floors run reads them */
function floorNames(J) {
  const names = [];
  for (const s of J.shared) {
    if (!s.c || s.c.kind !== 'run') continue;
    for (const m of s.c.script.matchAll(/node tools\/floors\.js\b([^\n;&|]*)/g)) {
      const a = m[1].split(/\s+/).filter(Boolean);
      if (!a.includes('--self-test')) names.push(...a.filter(x => !x.startsWith('-')));
    }
  }
  return names;
}

/* ---- running ---- */
const LIVE = new Set();
function killAll() { for (const ch of LIVE) { try { process.kill(-ch.pid, 'SIGKILL'); } catch (e) { /* gone */ } } }
process.on('SIGINT', () => { killAll(); process.exit(130); });
process.on('SIGTERM', () => { killAll(); process.exit(143); });

function readEnvFile(file) {
  const out = {};
  let text = '';
  try { text = fs.readFileSync(file, 'utf8'); } catch (e) { return out; }
  const L = text.split('\n');
  for (let i = 0; i < L.length; i++) {
    const h = /^([A-Za-z_][\w]*)<<(.+)$/.exec(L[i]);
    if (h) { const v = []; i++; while (i < L.length && L[i] !== h[2]) v.push(L[i++]); out[h[1]] = v.join('\n'); continue; }
    const m = /^([A-Za-z_][\w]*)=(.*)$/.exec(L[i]);
    if (m) out[m[1]] = m[2];
  }
  return out;
}

let SEQ = 0, LOGSEQ = 0;
function runScript(script, opt) {
  // opt: env, cwd, log, timeoutMin, verbose
  return new Promise(resolve => {
    const file = path.join(opt.tmp, 'scripts', (++SEQ) + '.sh');
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.mkdirSync(path.dirname(opt.log), { recursive: true });
    fs.writeFileSync(file, script);
    const fd = fs.openSync(opt.log, 'w');
    const t0 = Date.now();
    const ch = cp.spawn('bash', ['--noprofile', '--norc', '-eo', 'pipefail', file],
      { cwd: opt.cwd, env: opt.env, detached: true, stdio: ['ignore', 'pipe', 'pipe'] });
    LIVE.add(ch);
    const put = (b) => { fs.writeSync(fd, b); if (opt.verbose) process.stdout.write(b); };
    ch.stdout.on('data', put); ch.stderr.on('data', put);
    let timedOut = false;
    const tm = opt.timeoutMin ? setTimeout(() => { timedOut = true; try { process.kill(-ch.pid, 'SIGKILL'); } catch (e) { /* gone */ } }, opt.timeoutMin * 60000) : null;
    ch.on('close', (code, sig) => {
      LIVE.delete(ch); if (tm) clearTimeout(tm); fs.closeSync(fd);
      resolve({ code: code === null ? 1 : code, sig, timedOut, secs: (Date.now() - t0) / 1000 });
    });
  });
}

function tail(file, n) {
  try { return fs.readFileSync(file, 'utf8').replace(/\x1b\[[0-9;]*m/g, '').trimEnd().split('\n').slice(-n).join('\n'); } catch (e) { return ''; }
}
const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 48);

function show(r, opt) {
  const tag = r.status === 'pass' ? '  ok   ' : r.status === 'fail' ? 'FAIL   ' : r.status === 'report-fail' ? 'red    ' : '  --   ';
  const where = r.job + (r.leg ? ' (' + r.leg + ')' : '');
  console.log(tag + where + ': ' + r.name + (r.secs != null ? '  ' + r.secs.toFixed(1) + 's' : '') + (r.note ? '. ' + r.note : ''));
  if ((r.status === 'fail' || r.status === 'report-fail') && r.log && !opt.verbose) {
    const t = tail(r.log, 15);
    if (t) console.log(t.split('\n').map(l => '         | ' + l).join('\n'));
    console.log('         full log: ' + r.log);
  }
}

/* run one job's steps in order, a red step skipping the rest, as a runner does */
async function runSteps(items, ctx) {
  // items: [{name, c}], ctx: {job, leg, report, env, tmp, timeoutMin, results, opt}
  let dead = null;
  for (const it of items) {
    const base = { job: ctx.job, leg: ctx.leg, name: it.name, report: ctx.report };
    const bad = ctx.report ? 'report-fail' : 'fail';
    if (dead) { const r = Object.assign(base, { status: 'skipped', note: 'an earlier step failed: ' + dead }); ctx.results.push(r); show(r, ctx.opt); continue; }
    const c = it.c;
    let r;
    if (c.kind === 'unrunnable') r = Object.assign(base, { status: bad, note: 'cannot be run here: ' + c.why });
    else if (c.kind === 'env') { const [ok, note] = ENV_ACTIONS[c.action](c.with); r = Object.assign(base, { status: ok ? 'pass' : bad, note: 'stood in for: ' + note, provided: true }); }
    else if (c.kind === 'provided') { const [ok, note] = c.check(); r = Object.assign(base, { status: ok ? 'pass' : bad, note: 'not reinstalled: ' + note, provided: true }); }
    else {
      const log = path.join(ctx.tmp, 'steps', slug(ctx.job + (ctx.leg ? '-' + ctx.leg : '')) + '-' + String(++LOGSEQ).padStart(3, '0') + '-' + slug(it.name) + '.log');
      const env = Object.assign({}, ctx.env, c.env);
      fs.writeFileSync(env.GITHUB_ENV, '');
      const x = await runScript(c.script, { env, cwd: c.cwd, log, timeoutMin: ctx.timeoutMin, verbose: ctx.opt.verbose, tmp: ctx.tmp });
      Object.assign(ctx.env, readEnvFile(env.GITHUB_ENV));
      r = Object.assign(base, { status: x.code === 0 ? 'pass' : bad, secs: x.secs, log,
        note: x.timedOut ? 'killed at its ' + ctx.timeoutMin + ' minute timeout' : x.code === 0 ? '' : 'exit ' + x.code });
    }
    ctx.results.push(r); show(r, ctx.opt);
    if (r.status !== 'pass') dead = it.name;
  }
  return !dead;
}

function md5(file) { try { return crypto.createHash('md5').update(fs.readFileSync(file)).digest('hex'); } catch (e) { return 'unreadable (' + e.code + ')'; } }
function dirty() {
  const r = sh('git', ['status', '--porcelain', '--untracked-files=no']);
  if (!r.ok) return null;
  return r.out.split('\n').filter(Boolean);
}

function baseEnv(P, tmp) {
  const env = Object.assign({}, process.env, P.env, {
    RUNNER_TEMP: tmp, GITHUB_WORKSPACE: ROOT,
    GITHUB_ENV: path.join(tmp, 'github-env'), GITHUB_OUTPUT: path.join(tmp, 'github-output'),
    GITHUB_STEP_SUMMARY: path.join(tmp, 'step-summary.md'), GITHUB_PATH: path.join(tmp, 'github-path'),
  });
  for (const k of ['GITHUB_ENV', 'GITHUB_OUTPUT', 'GITHUB_STEP_SUMMARY', 'GITHUB_PATH']) fs.writeFileSync(env[k], '');
  return env;
}

async function runAll(P, opt) {
  const tmp = opt.keep ? path.resolve(opt.keep) : fs.mkdtempSync(path.join(os.tmpdir(), 'gates-'));
  fs.mkdirSync(path.join(tmp, 'gates'), { recursive: true });
  const before = dirty();
  const head = sh('git', ['rev-parse', 'HEAD']).out.trim();
  const branch = sh('git', ['rev-parse', '--abbrev-ref', 'HEAD']).out.trim();
  const started = new Date();
  console.log('gates.js: ' + (opt.fast ? 'gates-fast only' : JOBS.join(', ') + ', then the floors') + ', read off ' + path.relative(ROOT, opt.workflowFile || WORKFLOW) + '. Logs under ' + tmp + '\n');
  const results = [];
  const required = [];
  for (const J of P.jobs) {
    const timeoutMin = typeof J.timeout === 'number' ? J.timeout : null;
    const env = Object.assign(baseEnv(P, tmp), J.env);
    console.log('--- ' + J.id + (J.report ? ', report only' : '') + ' ---');
    const sharedOk = await runSteps(J.shared, { job: J.id, report: J.report, env, tmp, timeoutMin, results, opt });
    if (!J.legs) { if (!J.report) required.push(...floorNames(J)); continue; }
    if (!J.report) required.push(...J.legs.map(l => l.gate));
    const queue = J.legs.slice();
    const one = async (leg) => {
      const lt = typeof leg.timeout === 'number' ? leg.timeout : timeoutMin;
      const items = J.perLeg.map(p => ({ name: fill(p.name, leg).out, c: classify(p.step, leg) }));
      if (!sharedOk) {
        for (const it of items) { const r = { job: J.id, leg: leg.gate, name: it.name, report: J.report, status: 'skipped', note: 'the job\'s shared steps failed' }; results.push(r); show(r, opt); }
        return;
      }
      await runSteps(items, { job: J.id, leg: leg.gate, report: J.report, env: Object.assign({}, env), tmp, timeoutMin: lt, results, opt });
    };
    const workers = Array.from({ length: Math.max(1, Math.min(opt.jobs, queue.length)) }, async () => { while (queue.length) await one(queue.shift()); });
    await Promise.all(workers);
    console.log('');
  }
  // tools/floors.js over every required gate's log, as one run
  const names = [...new Set(required)];
  const fl = names.length
    ? await runScript('node tools/floors.js --dir "$RUNNER_TEMP/gates" ' + names.map(n => "'" + n + "'").join(' '),
      { env: baseEnv(P, tmp), cwd: ROOT, log: path.join(tmp, 'steps', 'final-floors.log'), tmp })
    : { code: 1, secs: 0 };
  const flr = { job: 'floors', name: 'tools/floors.js over ' + names.length + ' required gate logs', status: fl.code === 0 ? 'pass' : 'fail', secs: fl.secs,
    log: path.join(tmp, 'steps', 'final-floors.log'), note: names.length ? '' : 'no required gate named a floor' };
  results.push(flr); show(flr, opt);
  footer({ results, before, after: dirty(), head, branch, started, opt, tmp });
  const failed = results.filter(r => r.status === 'fail' || (r.status === 'skipped' && !r.report)).length;
  return failed ? 1 : 0;
}

function footer(F) {
  const R = F.results;
  const req = R.filter(r => !r.report), rep = R.filter(r => r.report);
  const n = (a, s) => a.filter(r => r.status === s).length;
  const reqFail = req.filter(r => r.status !== 'pass').length;
  const fmtDirty = (d) => d === null ? 'unknown, git status failed' : d.length ? 'dirty, ' + d.length + ' tracked path' + (d.length === 1 ? '' : 's') + ' changed: ' + d.slice(0, 6).map(l => l.slice(3)).join(', ') + (d.length > 6 ? ', ...' : '') : 'clean';
  const onlyProducts = (d) => d && d.length && d.every(l => PRODUCTS.test(l.slice(3)));
  console.log('\n===================== gates.js footer =====================');
  console.log('stamped        ' + new Date().toISOString() + ' (started ' + F.started.toISOString() + ')');
  console.log('commit         ' + (F.head || 'unknown') + ' on ' + (F.branch || 'unknown'));
  console.log('source.html    md5 ' + md5(path.join(ROOT, 'source.html')) + ', as this run built it');
  console.log('tree before    ' + fmtDirty(F.before) + (onlyProducts(F.before) ? '. Build products only, which this run rebuilt from the commit\'s own source.' : F.before && F.before.length ? '. The commit above is not exactly what was tested.' : ''));
  console.log('tree after     ' + fmtDirty(F.after) + (F.after && F.after.length ? '. The build rewrites its own products, as in CI\'s checkout.' : ''));
  const sparse = sh('git', ['config', '--bool', 'core.sparseCheckout']).out.trim() === 'true';
  if (sparse) console.log('checkout       SPARSE. CI checks out the whole tree, and gates read files outside a cone (vendor/, audio/, functions/), so a red here may be the checkout and not the code: git sparse-checkout disable');
  console.log('mode           ' + (F.opt.fast ? 'fast: gates-fast and the floors only, no browser gate ran' : 'full: every job CI gates on, in its order') + (F.opt.jobs > 1 ? ', ' + F.opt.jobs + ' legs at a time' : ''));
  console.log('logs           ' + F.tmp + (F.opt.keep ? '' : ' (temporary)'));
  console.log('');
  for (const r of R) {
    const s = r.status === 'pass' ? (r.provided ? 'have' : 'pass') : r.status === 'report-fail' ? 'red ' : r.status === 'skipped' ? 'skip' : 'FAIL';
    console.log('  ' + s + '  ' + (r.report ? '(report) ' : '') + r.job + (r.leg ? ' (' + r.leg + ')' : '') + ': ' + r.name);
  }
  console.log('');
  console.log('required       ' + n(req, 'pass') + ' passed, ' + n(req, 'fail') + ' failed, ' + n(req, 'skipped') + ' skipped');
  if (rep.length) console.log('report only    ' + n(rep, 'pass') + ' passed, ' + n(rep, 'report-fail') + ' red, ' + n(rep, 'skipped') + ' skipped. Nothing waits for these, as in CI.');
  console.log('verdict        ' + (reqFail ? 'NOT every required gate passed.' : F.opt.fast ? 'every gates-fast step passed. No browser gate ran: this is not "every gate passed".' : 'every required gate passed.'));
  console.log('\n===== ' + n(req, 'pass') + ' passed, ' + n(req, 'fail') + ' failed, ' + n(req, 'skipped') + ' skipped =====');
}

/* ---- the plan, printed ---- */
function printPlan(P, json) {
  if (json) {
    process.stdout.write(JSON.stringify({
      problems: P.problems,
      jobs: P.jobs.map(J => ({ id: J.id, report: J.report, steps: J.stepCount,
        shared: J.shared.map(s => ({ index: s.i, name: s.name, kind: s.c.kind, why: s.c.why })),
        perLeg: J.perLeg.map(s => ({ index: s.i, name: s.name })),
        legs: J.legs ? J.legs.map(l => l.gate) : null })),
    }) + '\n');
    return P.problems.length ? 1 : 0;
  }
  for (const J of P.jobs) {
    console.log(J.id + (J.report ? ' (report only)' : '') + ': ' + J.stepCount + ' steps');
    for (const s of J.shared) console.log('  ' + s.c.kind.padEnd(10) + ' ' + s.name + (s.c.why ? ': ' + s.c.why : ''));
    if (J.legs) {
      for (const s of J.perLeg) console.log('  per leg    ' + s.name);
      console.log('  legs       ' + J.legs.map(l => l.gate).join(', '));
    }
  }
  for (const p of P.problems) console.log('UNRUNNABLE ' + p);
  console.log('\n===== ' + P.jobs.length + ' jobs read, ' + P.problems.length + ' unrunnable =====');
  return P.problems.length ? 1 : 0;
}

/* every browser leg, for .github/workflows/nightly-gates.yml's matrix. The
   nightly runs each three times solo and four at once, so its timeout is
   the leg's own times the five lengths that takes, and never past six hours. */
function listLegs(P) {
  const out = [];
  for (const J of P.jobs) for (const l of (J.legs || []))
    out.push({ gate: l.gate, command: l.command, timeout: l.timeout, job: J.id, required: !J.report,
      nightly_timeout: Math.min(360, (typeof l.timeout === 'number' ? l.timeout : 20) * 5) });
  return out;
}

function readStdin() { return fs.readFileSync(0, 'utf8'); }

async function main(argv) {
  const opt = { fast: false, jobs: 1, keep: null, verbose: false, plan: false, json: false, list: false, workflowFile: null, workflowJson: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--fast') opt.fast = true;
    else if (a === '--jobs') { opt.jobs = parseInt(argv[++i], 10); if (!(opt.jobs >= 1)) { console.log('FAIL --jobs takes a whole number above zero'); return 2; } }
    else if (a === '--keep') opt.keep = argv[++i];
    else if (a === '--verbose') opt.verbose = true;
    else if (a === '--plan') opt.plan = true;
    else if (a === '--json') opt.json = true;
    else if (a === '--list') opt.list = true;
    else if (a === '--workflow') opt.workflowFile = argv[++i];
    else if (a === '--workflow-json') opt.workflowJson = argv[++i];
    else { console.log('FAIL unknown option ' + a + '. See the header of tools/gates.js.'); return 2; }
  }
  let doc;
  try {
    doc = opt.workflowJson ? JSON.parse(opt.workflowJson === '-' ? readStdin() : fs.readFileSync(opt.workflowJson, 'utf8'))
      : loadYaml(opt.workflowFile || WORKFLOW);
  } catch (e) { console.log('FAIL the workflow cannot be read: ' + e.message); return 1; }
  const P = plan(doc, opt.fast ? FAST : JOBS);
  if (opt.list) {
    const legs = listLegs(P);
    if (opt.json) process.stdout.write(JSON.stringify(legs) + '\n');
    else for (const l of legs) console.log(l.gate.padEnd(20) + (l.required ? 'required ' : 'report   ') + l.command);
    return legs.length ? 0 : 1;
  }
  if (opt.plan) return printPlan(P, opt.json);
  if (P.problems.length) {
    for (const p of P.problems) console.log('UNRUNNABLE ' + p);
    console.log('\nFAIL gates.js cannot run ' + P.problems.length + ' thing' + (P.problems.length === 1 ? '' : 's') + ' CI runs, so it would not be the run CI makes. tools/workflow-lint.py fails on the same.');
    console.log('\n===== 0 passed, ' + P.problems.length + ' failed =====');
    return 1;
  }
  return runAll(P, opt);
}

module.exports = { plan, classify, listLegs, loadYaml, fill, floorNames, runScript, readEnvFile, JOBS, FAST, ROOT, WORKFLOW };

if (require.main === module) main(process.argv.slice(2)).then(c => process.exit(c), e => { console.log('FAIL gates.js threw: ' + (e && e.stack || e)); process.exit(1); });
