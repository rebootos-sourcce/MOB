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
                                                one table, for the run page,
                                                and each failing check named
                                                NEW, SUSPECTED or KNOWN against
                                                tests/flakes.json
     node tools/gates-repeat.js --self-test     the verdicts, against fixtures
                                                and a scratch ledger

   Each run is judged as CI judges the leg: the gate step exits 0 and its
   floor step passes. The counts are read off the gate's own summary line,
   and every failing check is listed by the words it printed, in the form
   tools/flakes.js keys them. Exit 1 when any run failed, so the leg shows red
   in the run's job list.

   THE LEDGER IS READ, NEVER WRITTEN, HERE. 17 November. Fourteen nightly runs
   in a row failed and nobody read one, because the run page said which legs
   were red and not whether a red check was a flake already on record or a
   failure nobody had seen. The table job now prints, per failing check:
     NEW        not in tests/flakes.json. A first failure is a failure.
     SUSPECTED  in the ledger as suspected, so seen before, not yet shown to
                pass again on the same code.
     KNOWN      in the ledger as open, or resolved and failing again, which
                is the one to read first.
     UNNAMED    a run failed and printed no failing check line (it timed out,
                crashed, or a floor failed), so the ledger has nothing to match.
   A leg that failed also writes GATE.fail.log beside its result file, one
   `  FAIL  <line as printed>` per failing check, which is the form
   `node tools/flakes.js record GATE LOG` reads, and the summary prints that
   command for a person to run. CI holds contents: read and never commits.
   ============================================================ */
'use strict';
const fs = require('fs'), path = require('path'), os = require('os'), cp = require('child_process');
const G = require('./gates.js');
const { failures, match, load, LEDGER } = require('./flakes.js');

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
  const fl = failures(text);
  out.fails = fl.slice(0, 10).map(f => f.check);
  out.failLines = fl.slice(0, 40).map(f => f.example);   // as printed, for the ledger's example
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
  const head = cp.spawnSync('git', ['rev-parse', 'HEAD'], { cwd: G.ROOT, encoding: 'utf8' }).stdout.trim();
  const res = { gate, job: J.id, required: !J.report, commit: head, date: new Date().toISOString(), solo, parallel: par, runs };
  if (outFile) {
    fs.writeFileSync(outFile, JSON.stringify(res, null, 2) + '\n');
    const fl = failLog(res);
    if (fl) fs.writeFileSync(outFile.replace(/(\.json)?$/, '.fail.log'), fl);
  }
  const bad = runs.filter(r => !r.ok).length;
  console.log('\n===== ' + (runs.length - bad) + ' passed, ' + bad + ' failed ===== ' + gate + ', ' + solo + ' solo and ' + par + ' at once, logs under ' + root);
  return bad ? 1 : 0;
}

/* THE FAILING CHECKS OF ONE GATE'S RESULT, as `  FAIL  <line>` lines in the
   order they first failed, once each by key. This is the form tools/flakes.js
   record reads. A result file written before failLines existed carries only
   the keys, which read the same way and are used when that is all there is. */
function failedChecks(r) {
  const by = new Map();
  for (const run of (r.runs || [])) {
    if (run.ok) continue;
    for (const f of failures((run.failLines || run.fails || []).map(l => '  FAIL  ' + l).join('\n'))) {
      const e = by.get(f.check) || { check: f.check, example: f.example, runs: 0 };
      e.runs++; by.set(f.check, e);
    }
  }
  return [...by.values()];
}
function failLog(r) {
  const fc = failedChecks(r);
  return fc.length ? fc.map(f => '  FAIL  ' + f.example).join('\n') + '\n' : '';
}

function verdict(entry) {
  const n = entry ? entry.sightings + ' sighting' + (entry.sightings === 1 ? '' : 's') : '';
  if (!entry) return { word: 'NEW', note: 'not in the ledger. A first failure is a failure until three runs say otherwise' };
  if (entry.status === 'suspected') return { word: 'SUSPECTED', note: 'in the ledger, ' + n + ', not yet shown to pass again on the same code' };
  if (entry.status === 'resolved' || entry.status === 'reopened')
    return { word: 'KNOWN', note: 'FAILING AGAIN after its fix ' + (entry.resolved && entry.resolved.commit ? entry.resolved.commit.slice(0, 8) : '') + ', ' + n };
  return { word: 'KNOWN', note: 'an open flake, ' + n };
}

/* what the ledger says about every failure in every result, without changing
   it. One row per failing check per gate, and one UNNAMED row for a gate with
   a failed run that printed no failing check, so a failure is never dropped
   for having no name. */
function findings(L, results) {
  const out = [];
  for (const r of results) {
    if (!r.runs) continue;
    const fc = failedChecks(r);
    if (fc.length) {
      const by = new Map(fc.map(f => [f.check, f]));
      for (const m of match(L, r.gate, fc.map(f => '  FAIL  ' + f.example).join('\n')))
        out.push(Object.assign({ gate: r.gate, check: m.check, example: m.example, runs: by.get(m.check).runs, of: r.runs.length, entry: m.entry }, verdict(m.entry)));
    }
    const mute = r.runs.filter(x => !x.ok && !(x.failLines || x.fails || []).length);
    if (mute.length) {
      const why = [...new Set(mute.flatMap(x => (x.steps || []).filter(s => s.status === 'fail').map(s => s.name + (s.timedOut ? ' (timed out)' : ''))))].join('; ') || 'no step is named failed';
      out.push({ gate: r.gate, check: 'a failed run printed no failing check: ' + why, example: '', runs: mute.length, of: r.runs.length, entry: null, word: 'UNNAMED', note: 'nothing for the ledger to match' });
    }
  }
  return out;
}

/* the run page's markdown and the exit code, from the results and the ledger
   (or why there is none). Pure, so the self test reads it. */
function buildSummary(all, L, why, run) {
  const out = [];
  out.push('### Nightly gates, every browser leg of deploy.yml repeated', '');
  if (!all.length) out.push('No result file was found. Every leg failed before it wrote one, or none ran.');
  const n = all.reduce((a, r) => a + (r.runs ? r.runs.length : 0), 0), nb = all.reduce((a, r) => a + (r.runs ? r.runs.filter(x => !x.ok).length : 0), 0);
  if (all.length) out.push(all.length + ' gates, ' + n + ' runs, ' + nb + ' failed. Each cell is pass or FAIL, then passed/failed as the gate printed them.', '');
  const maxRuns = Math.max(0, ...all.map(r => (r.runs || []).length));
  const labels = (all.find(r => r.runs && r.runs.length === maxRuns) || { runs: [] }).runs.map(r => r.label);
  out.push('| gate | job | ' + labels.join(' | ') + ' | failed | failing checks |', '|---|---|' + labels.map(() => '---|').join('') + '---|---|');
  for (const r of all.slice().sort((a, b) => ((b.runs || []).filter(x => !x.ok).length - (a.runs || []).filter(x => !x.ok).length) || String(a.gate).localeCompare(String(b.gate)))) {
    if (r.broken) { out.push('| ' + r.gate + ' | | result file unreadable: ' + r.broken + ' |'); continue; }
    const byLabel = Object.fromEntries(r.runs.map(x => [x.label, x]));
    const fails = [...new Set(r.runs.flatMap(x => x.fails || []))].slice(0, 3).map(s => s.replace(/\|/g, '/').slice(0, 90));
    out.push('| ' + r.gate + ' | ' + (r.required ? 'required' : 'report') + ' | ' + labels.map(l => byLabel[l] ? cell(byLabel[l]) : '').join(' | ')
      + ' | ' + r.runs.filter(x => !x.ok).length + ' of ' + r.runs.length + ' | ' + fails.join('; ') + ' |');
  }
  let code = all.length ? 0 : 1;
  if (nb) {
    out.push('', '### Against the flake ledger (tests/flakes.json)', '');
    if (!L) {
      out.push('The flake ledger could not be read, so no failure below was checked against it: ' + why);
      code = 1;
    } else {
      const fd = findings(L, all);
      const c = w => fd.filter(f => f.word === w).length;
      out.push(fd.length + ' failing check' + (fd.length === 1 ? '' : 's') + ': ' + c('NEW') + ' new, ' + c('SUSPECTED') + ' suspected, ' + c('KNOWN') + ' known, ' + c('UNNAMED') + ' unnamed.', '');
      if (fd.length) {
        out.push('| verdict | gate | check | failed in | ledger |', '|---|---|---|---|---|');
        const rank = { NEW: 0, KNOWN: 1, SUSPECTED: 2, UNNAMED: 3 };
        const again = f => /FAILING AGAIN/.test(f.note) ? 1 : 0;
        for (const f of fd.slice().sort((a, b) => (again(b) - again(a)) || rank[a.word] - rank[b.word] || a.gate.localeCompare(b.gate)))
          out.push('| ' + f.word + ' | ' + f.gate + ' | ' + f.check.replace(/\|/g, '/').slice(0, 140) + ' | ' + f.runs + ' of ' + f.of + ' | ' + f.note + ' |');
        // a gate whose every failing check is already on record for this very run needs no line: recording it again counts it twice
        const onFile = f => !!(run && f.entry && f.entry.last_seen && String(f.entry.last_seen.run) === String(run));
        const rec = all.filter(r => r.runs && failLog(r) && !fd.filter(f => f.gate === r.gate).every(onFile));
        if (rec.length) {
          out.push('', 'To record a sighting of each failing check above (a new one is added as suspected, never open), from a checkout of that commit, with the leg\'s artifact nightly-GATE downloaded:', '');
          for (const r of rec) out.push('    node tools/flakes.js record ' + r.gate + ' ' + r.gate + '.fail.log --run ' + (run || 'RUN') + ' --commit ' + (r.commit || 'SHA')
            + ' --where "nightly-gates run ' + (run || 'RUN') + ', repeat (' + r.gate + ')"');
        }
      }
    }
  }
  return { md: out.join('\n') + '\n', code };
}

function summary(dir, ledgerFile) {
  let files = [];
  try { files = fs.readdirSync(dir).filter(f => f.endsWith('.json')).sort(); } catch (e) { /* no directory: no leg wrote a result, said below */ }
  const all = [];
  for (const f of files) { try { all.push(JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'))); } catch (e) { all.push({ gate: f, broken: e.message }); } }
  let L = null, why = '';
  try { L = load(ledgerFile || LEDGER); } catch (e) { why = e.message; }
  const { md, code } = buildSummary(all, L, why, process.env.GITHUB_RUN_ID);
  if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, md);
  process.stdout.write(md);
  return code;
}

/* ---- --self-test ---- */
function selfTest() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'repeat-self-'));
  let bad = 0, ran = 0;
  const t = (name, cond, said) => { ran++; if (!cond) bad++; console.log((cond ? '  ok   ' : 'FAIL ') + name + (said ? ': ' + said : '')); };
  const seen = { run: '1', commit: 'c'.repeat(40), date: '2026-11-17' };
  const ledger = { about: [], flakes: [
    { gate: 'boot', check: 'the overture clock reads Nms and Nms', example: 'the overture clock reads 12ms and 13ms', first_seen: seen, last_seen: seen, sightings: 2, status: 'suspected' },
    { gate: 'design', check: 'the ring reads N%', example: 'the ring reads 40%', first_seen: seen, last_seen: seen, sightings: 5, status: 'open' },
    { gate: 'golden', check: 'station R reads the plan N times', example: 'station R reads the plan 2 times', first_seen: seen, last_seen: seen, sightings: 16, status: 'resolved',
      resolved: { commit: 'f'.repeat(40), date: '2026-11-02' } }] };
  const lf = path.join(dir, 'ledger.json'); fs.writeFileSync(lf, JSON.stringify(ledger));
  const run = (label, ok, lines, steps) => ({ label, ok, counts: { passed: 10, failed: ok ? 0 : (lines || []).length, red: null }, fails: lines, failLines: lines, steps: steps || [] });
  const result = (gate, runs) => ({ gate, job: 'gates-browser', required: true, commit: 'a'.repeat(40), runs });
  try {
    // the counts line, as gates print it
    t('a summary line is read', JSON.stringify(counts('  ok   a\n===== 108 passed, 0 failed =====\n')) === '{"passed":108,"failed":0,"red":null}');
    t('a sentence that quotes one is not a summary line', counts('  ok   it prints 3 passed, 0 failed in a sentence\n') === null);
    // the four verdicts, each against the ledger above
    const L = load(lf);
    const load2 = o => { const f = path.join(dir, 'l2.json'); fs.writeFileSync(f, JSON.stringify(o)); return load(f); };
    const res = [
      result('boot', [run('solo-1', true, []), run('parallel-1', false, ['the overture clock reads 99ms and 100ms'])]),                    // SUSPECTED, other digits
      result('design', [run('solo-1', false, ['the ring reads 41%', 'a check nobody has seen fail'])]),                                  // KNOWN open, and NEW
      result('golden', [run('solo-1', false, ['station R reads the plan 3 times'])]),                                                    // KNOWN, resolved and failing again
      result('copy', [run('solo-1', true, []), run('solo-2', true, [])]),                                                               // green, nothing
      result('pct', [run('solo-1', false, [], [{ name: 'pct gate', status: 'fail', timedOut: true }, { name: 'floor', status: 'skipped' }])]), // UNNAMED
    ];
    const fd = findings(L, res), by = (g, w) => fd.filter(f => f.gate === g && f.word === w);
    t('a check on record as suspected is SUSPECTED, whatever the digits', by('boot', 'SUSPECTED').length === 1 && by('boot', 'SUSPECTED')[0].entry === L.flakes[0]);
    t('a check on record as open is KNOWN', by('design', 'KNOWN').length === 1 && /open flake, 5 sightings/.test(by('design', 'KNOWN')[0].note));
    t('a check nobody recorded is NEW', by('design', 'NEW').length === 1 && by('design', 'NEW')[0].entry === null);
    t('a resolved check failing again is KNOWN and says it failed after its fix', by('golden', 'KNOWN').length === 1 && /FAILING AGAIN after its fix ffffffff/.test(by('golden', 'KNOWN')[0].note));
    t('a green gate gives no finding', fd.filter(f => f.gate === 'copy').length === 0);
    t('a failed run that named no check is UNNAMED, with the step that failed', by('pct', 'UNNAMED').length === 1 && /pct gate \(timed out\)/.test(by('pct', 'UNNAMED')[0].check));
    t('the same check failing in two runs is one finding that counts both',
      findings(L, [result('boot', [run('a', false, ['the overture clock reads 1ms and 2ms']), run('b', false, ['the overture clock reads 3ms and 4ms'])])])[0].runs === 2);
    t('a result written before failLines existed reads from its keys',
      findings(L, [{ gate: 'boot', runs: [{ label: 'a', ok: false, fails: ['the overture clock reads Nms and Nms'] }] }])[0].word === 'SUSPECTED');
    // the run page
    const page = buildSummary(res, L, '', '777');
    t('the page names every verdict and prints the record line for a failed gate',
      /\| NEW \| design \|/.test(page.md) && /\| SUSPECTED \| boot \|/.test(page.md) && /\| KNOWN \| golden \|/.test(page.md) && /\| UNNAMED \| pct \|/.test(page.md)
      && /node tools\/flakes\.js record boot boot\.fail\.log --run 777 --commit a{40}/.test(page.md));
    const ledger2 = JSON.parse(JSON.stringify(ledger)); ledger2.flakes[0].last_seen = Object.assign({}, seen, { run: '777' });
    t('a gate whose every failing check is already recorded for this run is offered no record line again',
      !/record boot /.test(buildSummary(res, load2(ledger2), '', '777').md) && /record design /.test(buildSummary(res, load2(ledger2), '', '777').md));
    t('a resolved check failing again is listed before a new one', page.md.indexOf('| KNOWN | golden |') < page.md.indexOf('| NEW | design |'));
    t('a page of green gates has no ledger section', !/Against the flake ledger/.test(buildSummary([res[3]], L, '', '1').md) && buildSummary([res[3]], L, '', '1').code === 0);
    t('a ledger that cannot be read is said on the page, and the summary fails',
      /could not be read, so no failure below was checked against it: gone/.test(buildSummary(res, null, 'gone', '1').md) && buildSummary(res, null, 'gone', '1').code === 1);
    t('no result file at all fails the summary', buildSummary([], L, '', '1').code === 1);
    // the file a person records from is the form flakes.js record reads
    const fl = failLog(res[1]);
    t('the fail log is one FAIL line per failing check, as printed', fl === '  FAIL  the ring reads 41%\n  FAIL  a check nobody has seen fail\n');
    t('a green gate writes no fail log', failLog(res[3]) === '');
    const scratch = path.join(dir, 'recorded.json'); fs.writeFileSync(scratch, JSON.stringify(ledger));
    const lg = path.join(dir, 'design.fail.log'); fs.writeFileSync(lg, fl);
    const rec = cp.spawnSync(process.execPath, [path.join(__dirname, 'flakes.js'), 'record', 'design', lg, '--ledger', scratch, '--run', '777', '--commit', 'a'.repeat(40)], { encoding: 'utf8' });
    const after = JSON.parse(fs.readFileSync(scratch, 'utf8'));
    t('flakes.js record reads that file: the known one gains a sighting and the new one is added as suspected',
      rec.status === 0 && after.flakes[1].sightings === 6 && after.flakes.length === 4 && after.flakes[3].status === 'suspected', (rec.stdout || '').trim().split('\n').pop());
    t('and the same results read as SUSPECTED and KNOWN after it, not NEW',
      findings(load(scratch), [res[1]]).map(f => f.word).sort().join() === 'KNOWN,SUSPECTED');
    // the files, through the real entry point
    fs.mkdirSync(path.join(dir, 'results'));
    for (const r of res) fs.writeFileSync(path.join(dir, 'results', r.gate + '.json'), JSON.stringify(r));
    fs.writeFileSync(path.join(dir, 'results', 'broken.json'), '{ not json');
    const sum = cp.spawnSync(process.execPath, [__filename, '--summary', path.join(dir, 'results')], { encoding: 'utf8', env: Object.assign({}, process.env, { GITHUB_STEP_SUMMARY: '', GITHUB_RUN_ID: '42' }) });
    t('--summary reads a directory of results and the real ledger, and names a broken file',
      /result file unreadable/.test(sum.stdout) && /Against the flake ledger/.test(sum.stdout) && /--run 42 /.test(sum.stdout), 'exit ' + sum.status);
    let real = null, whyNot = '';
    try { real = load(LEDGER); } catch (e) { whyNot = e.message; }
    t('tests/flakes.json reads and validates', !!real, whyNot || 'ledger loaded');
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
  console.log('\n===== ' + (ran - bad) + ' passed, ' + bad + ' failed =====');
  return bad ? 1 : 0;
}

async function main(argv) {
  if (argv[0] === '--self-test') return selfTest();
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

module.exports = { counts, failedChecks, failLog, verdict, findings, buildSummary };
if (require.main === module) main(process.argv.slice(2)).then(c => process.exit(c), e => { console.log('FAIL gates-repeat.js threw: ' + (e && e.stack || e)); process.exit(1); });
