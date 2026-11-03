#!/usr/bin/env node
/* ============================================================
   GATES, REPEATED. A flake is found by running the gate again, many times,
   under load, which is how station R was found: one failure in fifteen solo
   runs, four in forty four way parallel (tests/flakes.json has the entry).

   One browser leg of .github/workflows/deploy.yml, by its gate name, run as
   CI runs it (its own gate step, which tees the log, then its floor step,
   both read out of deploy.yml by tools/gates.js's planner), N times one
   after another and then K copies at once, each copy with its own
   RUNNER_TEMP so no two share a log. The build must already be done; the
   nightly workflow does it in the step before.

     node tools/gates-repeat.js GATE [--solo 3] [--parallel 4] [--out FILE]
     node tools/gates-repeat.js --summary DIR   every result file in DIR, as
                                                one table, for the run page

   Each run is judged as CI judges the leg: the gate step exits 0 and its
   floor step passes. The counts are read off the gate's own summary line,
   and every failing check is listed by the words it printed, in the form
   tools/flakes.js keys them, so wiring the nightly into the ledger later is
   a matter of calling record on these. Exit 1 when any run failed, so the
   leg shows red in the run's job list.
   ============================================================ */
'use strict';
const fs = require('fs'), path = require('path'), os = require('os');
const G = require('./gates.js');
const { failures } = require('./flakes.js');

function counts(text) {
  let last = null;
  for (const raw of String(text).split('\n')) {
    const l = raw.replace(/\x1b\[[0-9;]*m/g, '');
    const m = /(\d+) passed, (\d+) failed(?:, (\d+) expected red)?/.exec(l) || null;
    if (m && /^\s*(=+\s*)?([A-Za-z][\w -]*:\s*)?\d+ passed/.test(l)) last = { passed: +m[1], failed: +m[2], red: m[3] == null ? null : +m[3] };
  }
  return last;
}

function findLeg(P, gate) {
  for (const J of P.jobs) for (const leg of (J.legs || [])) if (leg.gate === gate) return { J, leg };
  return null;
}

async function once(J, leg, label, root, mode) {
  const tmp = path.join(root, label);
  fs.mkdirSync(path.join(tmp, 'gates'), { recursive: true });
  const env = Object.assign({}, process.env, J.env, {
    RUNNER_TEMP: tmp, GITHUB_ENV: path.join(tmp, 'github-env'), GITHUB_OUTPUT: path.join(tmp, 'github-output'),
    GITHUB_STEP_SUMMARY: path.join(tmp, 'step-summary.md'),
  });
  const t0 = Date.now();
  const steps = J.perLeg.map(p => ({ name: G.fill(p.name, leg).out, c: G.classify(p.step, leg) }));
  const out = { label, mode, steps: [] };
  let dead = false;
  for (const s of steps) {
    if (dead) { out.steps.push({ name: s.name, status: 'skipped' }); continue; }
    if (s.c.kind !== 'run') { out.steps.push({ name: s.name, status: 'fail', note: 'cannot be run: ' + (s.c.why || s.c.kind) }); dead = true; continue; }
    const log = path.join(tmp, 'steps', G.fill(s.name, leg).out.replace(/[^\w]+/g, '-') + '.log');
    const x = await G.runScript(s.c.script, { env: Object.assign({}, env, s.c.env), cwd: s.c.cwd, log, tmp, timeoutMin: leg.timeout });
    out.steps.push({ name: s.name, status: x.code === 0 ? 'pass' : 'fail', exit: x.code, timedOut: x.timedOut, secs: x.secs });
    if (x.code !== 0) dead = true;
  }
  let text = '';
  try { text = fs.readFileSync(path.join(tmp, 'gates', leg.gate + '.log'), 'utf8'); } catch (e) { /* no log: it never ran */ }
  out.counts = counts(text);
  out.fails = failures(text).slice(0, 10).map(f => f.check);
  out.ok = out.steps.length > 0 && out.steps.every(s => s.status === 'pass');
  out.secs = (Date.now() - t0) / 1000;
  return out;
}

const cell = (r) => (r.ok ? 'pass' : 'FAIL') + (r.counts ? ' ' + r.counts.passed + '/' + r.counts.failed : ' no summary');

async function repeat(gate, solo, par, outFile) {
  const doc = G.loadYaml(G.WORKFLOW);
  const P = G.plan(doc, G.JOBS);
  const hit = findLeg(P, gate);
  if (!hit) { console.log('FAIL ' + gate + ' is not a leg of gates-browser or gates-report in deploy.yml'); return 1; }
  const { J, leg } = hit;
  const root = fs.mkdtempSync(path.join(process.env.RUNNER_TEMP || os.tmpdir(), 'repeat-' + gate + '-'));
  const runs = [];
  for (let i = 1; i <= solo; i++) {
    const r = await once(J, leg, 'solo-' + i, root, 'solo');
    runs.push(r); console.log((r.ok ? '  ok   ' : 'FAIL   ') + gate + ' solo ' + i + ': ' + cell(r) + ' ' + r.secs.toFixed(0) + 's' + (r.fails.length ? ' | ' + r.fails.join(' | ') : ''));
  }
  if (par > 0) {
    const batch = await Promise.all(Array.from({ length: par }, (_, k) => once(J, leg, 'parallel-' + (k + 1), root, 'parallel')));
    for (const r of batch) { runs.push(r); console.log((r.ok ? '  ok   ' : 'FAIL   ') + gate + ' ' + r.label + ': ' + cell(r) + ' ' + r.secs.toFixed(0) + 's' + (r.fails.length ? ' | ' + r.fails.join(' | ') : '')); }
  }
  const head = require('child_process').spawnSync('git', ['rev-parse', 'HEAD'], { cwd: G.ROOT, encoding: 'utf8' }).stdout.trim();
  const res = { gate, job: J.id, required: !J.report, commit: head, date: new Date().toISOString(), solo, parallel: par, runs };
  if (outFile) fs.writeFileSync(outFile, JSON.stringify(res, null, 2) + '\n');
  const bad = runs.filter(r => !r.ok).length;
  console.log('\n===== ' + (runs.length - bad) + ' passed, ' + bad + ' failed ===== ' + gate + ', ' + solo + ' solo and ' + par + ' at once, logs under ' + root);
  return bad ? 1 : 0;
}

function summary(dir) {
  let files = [];
  try { files = fs.readdirSync(dir).filter(f => f.endsWith('.json')).sort(); } catch (e) { /* no directory: no leg wrote a result, said below */ }
  const all = [];
  for (const f of files) { try { all.push(JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'))); } catch (e) { all.push({ gate: f, broken: e.message }); } }
  const L = [];
  L.push('### Nightly gates, every browser leg of deploy.yml repeated', '');
  if (!all.length) L.push('No result file was found. Every leg failed before it wrote one, or none ran.');
  const n = all.reduce((a, r) => a + (r.runs ? r.runs.length : 0), 0), nb = all.reduce((a, r) => a + (r.runs ? r.runs.filter(x => !x.ok).length : 0), 0);
  if (all.length) L.push(all.length + ' gates, ' + n + ' runs, ' + nb + ' failed. Each cell is pass or FAIL, then passed/failed as the gate printed them.', '');
  const maxRuns = Math.max(0, ...all.map(r => (r.runs || []).length));
  const labels = (all.find(r => r.runs && r.runs.length === maxRuns) || { runs: [] }).runs.map(r => r.label);
  L.push('| gate | job | ' + labels.join(' | ') + ' | failed | failing checks |', '|---|---|' + labels.map(() => '---|').join('') + '---|---|');
  for (const r of all.sort((a, b) => ((b.runs || []).filter(x => !x.ok).length - (a.runs || []).filter(x => !x.ok).length) || String(a.gate).localeCompare(String(b.gate)))) {
    if (r.broken) { L.push('| ' + r.gate + ' | | result file unreadable: ' + r.broken + ' |'); continue; }
    const byLabel = Object.fromEntries(r.runs.map(x => [x.label, x]));
    const fails = [...new Set(r.runs.flatMap(x => x.fails || []))].slice(0, 3).map(s => s.replace(/\|/g, '/').slice(0, 90));
    L.push('| ' + r.gate + ' | ' + (r.required ? 'required' : 'report') + ' | ' + labels.map(l => byLabel[l] ? cell(byLabel[l]) : '').join(' | ')
      + ' | ' + r.runs.filter(x => !x.ok).length + ' of ' + r.runs.length + ' | ' + fails.join('; ') + ' |');
  }
  const md = L.join('\n') + '\n';
  if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, md);
  process.stdout.write(md);
  return all.length ? 0 : 1;
}

async function main(argv) {
  if (argv[0] === '--summary') return argv[1] ? summary(argv[1]) : (console.log('FAIL --summary takes a directory'), 2);
  let gate = null, solo = 3, par = 4, out = null;
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--solo') solo = parseInt(argv[++i], 10);
    else if (argv[i] === '--parallel') par = parseInt(argv[++i], 10);
    else if (argv[i] === '--out') out = argv[++i];
    else if (argv[i].startsWith('-')) { console.log('FAIL unknown option ' + argv[i]); return 2; }
    else gate = argv[i];
  }
  if (!gate || !(solo >= 0) || !(par >= 0) || solo + par < 1) { console.log('FAIL give a gate name, and --solo and --parallel as whole numbers that are not both zero'); return 2; }
  return repeat(gate, solo, par, out);
}

if (require.main === module) main(process.argv.slice(2)).then(c => process.exit(c), e => { console.log('FAIL gates-repeat.js threw: ' + (e && e.stack || e)); process.exit(1); });
