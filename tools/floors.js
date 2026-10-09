#!/usr/bin/env node
/* ============================================================
   FLOORS. A gate that loses its tests still exits 0.

   Every gate prints one summary line and exits non zero on a failure, which
   catches a red check and misses three other ways a gate can be wrong: it
   crashed before the summary under a shell that swallowed the exit code, it
   was skipped, or it quietly ran fewer checks than it did yesterday. This
   reads each gate's log, as CI tees it to $RUNNER_TEMP/gates/<gate>.log, and
   fails unless the summary line is there, reports no failure, and counts at
   least the floor tests/floors.json gives that gate.

   The summary lines it knows, each read off a real run:
     ===== N passed, M failed =====   boot, collide, design, functional
     ===== N passed, M failed, R expected red =====
                                      engine, since its CRISIS group, 9 October
       N passed, M failed             tests/funnel.js
     # pass N  and  # fail M          node --test, the funnel package
   A gate in "no_count" (monitor) prints no count; its exit code is the check,
   and here its log must carry the one line it prints when every surface
   rendered.

   It never writes a floor. Raising one is a deliberate edit to floors.json.

     node tools/floors.js [--dir DIR] [--floors FILE] [gate ...]
     node tools/floors.js --self-test

   DIR defaults to $RUNNER_TEMP/gates. With no gate named, every gate in the
   table is checked, so a missing log anywhere fails.
   ============================================================ */
'use strict';
const fs = require('fs'), path = require('path'), os = require('os');

const FLOORS = path.join(__dirname, '..', 'tests', 'floors.json');
// The expected red count is the gate's own and is carried into the line
// printed here as it stands. It is not a pass or a failure to this file.
const SUMMARY = [
  /^\s*=====\s*(\d+) passed, (\d+) failed(?:, (\d+) expected red)?\s*=====\s*$/,
  /^\s*(\d+) passed, (\d+) failed\s*$/,
];
const TAP_PASS = /^(?:#|\u2139) pass (\d+)\s*$/;   // tap, or the spec reporter's info mark
const TAP_FAIL = /^(?:#|\u2139) fail (\d+)\s*$/;
const has = (o, k) => !!o && Object.prototype.hasOwnProperty.call(o, k);

function lines(text) {
  return text.replace(/\x1b\[[0-9;]*m/g, '').split(/\r?\n/);
}

/* The last summary in the log, which is the one a gate prints on its way out. */
function summary(text) {
  let last = null, tp = null, tf = null;
  lines(text).forEach((l, i) => {
    for (const rx of SUMMARY) {
      const m = l.match(rx);
      if (m) { last = { pass: +m[1], fail: +m[2], red: m[3] === undefined ? null : +m[3], line: l.trim(), at: i }; break; }
    }
    let m = l.match(TAP_PASS);
    if (m) tp = { n: +m[1], at: i, line: l.trim() };
    m = l.match(TAP_FAIL);
    if (m) tf = { n: +m[1], at: i, line: l.trim() };
  });
  if (tp && tf && (!last || Math.min(tp.at, tf.at) > last.at))
    return { pass: tp.n, fail: tf.n, line: tp.line + ', ' + tf.line };
  return last;
}

function judge(gate, dir, table) {
  const fl = table.floors || {}, nc = table.no_count || {};
  if (!has(fl, gate) && !has(nc, gate))
    return [false, gate + ': no floor in tests/floors.json. Add one on purpose, read off a green run.'];
  const log = path.join(dir, gate + '.log');
  let text;
  try { text = fs.readFileSync(log, 'utf8'); }
  catch (e) { return [false, gate + ': no log at ' + log + '. The gate did not run, or crashed before it wrote a line.']; }
  if (has(nc, gate)) {
    const want = String(nc[gate]);
    return lines(text).some(l => l.trim() === want)
      ? [true, gate + ': "' + want + '". It prints no count, so its exit code and this line are the check.']
      : [false, gate + ': the line "' + want + '" is not in its log. It failed, crashed or was cut off.'];
  }
  const floor = fl[gate];
  if (!Number.isInteger(floor) || floor < 1)
    return [false, gate + ': its floor in tests/floors.json is ' + JSON.stringify(floor) + ', not a whole number above zero.'];
  const s = summary(text);
  if (!s) return [false, gate + ': no summary line in its log. It crashed, was cut off, or never reached its end.'];
  if (s.fail > 0) return [false, gate + ': ' + s.line + '. Any failure fails.'];
  if (s.pass < floor)
    return [false, gate + ': ' + s.pass + ' passed, below its floor of ' + floor + '. Checks were lost or did not run.'];
  return [true, gate + ': ' + s.pass + ' passed, 0 failed' + (s.red === null || s.red === undefined ? '' : ', ' + s.red + ' expected red') + ', floor ' + floor
    + (s.pass > floor ? '. ' + (s.pass - floor) + ' above it: raise the floor on purpose when that is the new normal.' : '.')];
}

function check(gates, dir, table) {
  const names = gates.length ? gates : Object.keys(table.floors || {}).concat(Object.keys(table.no_count || {}));
  let P = 0, F = 0;
  if (!names.length) { console.log('FAIL no gate to check: the table is empty and none was named.'); F++; }
  for (const g of names) {
    const [ok, msg] = judge(g, dir, table);
    console.log((ok ? '  ok   ' : 'FAIL ') + msg);
    if (ok) P++; else F++;
  }
  console.log('\n===== ' + P + ' passed, ' + F + ' failed =====');
  return F ? 1 : 0;
}

/* ---- --self-test: known bad logs must fail and known good ones pass ---- */
function selfTest() {
  const T = { floors: { g: 10, tap: 44, plain: 562, zero: 0, eng: 4689, nocap: 10, badcap: 10 },
              expected_red_max: { g: 10, eng: 10, badcap: 'ten' },
              no_count: { mon: 'all surfaces render' } };
  // [name, gate, log, passes, words its message must carry]: a case that
  // fails for some other reason than the one it names is not a pass.
  const CASES = [
    ['a summary at its floor', 'g', 'x\n===== 10 passed, 0 failed =====\n', true],
    ['a summary above its floor', 'g', '===== 12 passed, 0 failed =====', true],
    ['a summary below its floor', 'g', '===== 9 passed, 0 failed =====', false],
    ['a summary with a failure', 'g', '===== 10 passed, 1 failed =====', false],
    ['a crash, no summary line', 'g', 'starting\nTypeError: x is not a function\n', false],
    ['an empty log', 'g', '', false],
    ['no log at all, the gate was skipped', 'g', null, false],
    ['a gate with no floor recorded', 'nofloor', '===== 10 passed, 0 failed =====', false],
    ['a floor of zero reads floor not set', 'zero', '===== 5 passed, 0 failed =====', false, 'floor not set'],
    ['the last summary is the one read', 'g', '===== 100 passed, 0 failed =====\nmore\n===== 5 passed, 0 failed =====', false],
    ['a summary quoted inside a line', 'g', '  ok   prints "===== 10 passed, 0 failed =====" at the end', false],
    ['a summary in colour', 'g', '\x1b[32m===== 10 passed, 0 failed =====\x1b[0m', true],
    ['CRLF line ends', 'g', '===== 10 passed, 0 failed =====\r\n', true],
    ['node --test tap, good', 'tap', '1..44\n# tests 44\n# pass 44\n# fail 0\n', true],
    ['node --test tap, a failure', 'tap', '# pass 43\n# fail 1\n', false],
    ['node --test tap, no fail line', 'tap', '# pass 44\n', false],
    ['node --test tap, too few', 'tap', '# pass 40\n# fail 0\n', false],
    ['node --test spec reporter, good', 'tap', '\u2139 pass 44\n\u2139 fail 0\n', true],
    ['the funnel gate summary, no bars', 'plain', '\n  562 passed, 0 failed\n', true],
    ['the funnel gate summary, one short', 'plain', '\n  561 passed, 0 failed\n', false],
    ['a no count gate with its line', 'mon', '-----\n  all surfaces render\n', true],
    ['a no count gate that failed', 'mon', '-----\n  2 FAILING: a | b\n', false],
    ['a no count gate, empty log', 'mon', '', false],
    // tests/engine.js since its CRISIS group, 9 October: the reds it expects
    // are counted after the failures, inside the bars.
    ['the engine summary with expected reds', 'g', 'x\n===== 4689 passed, 0 failed, 10 expected red =====\n', true],
    ['expected reds at the floor', 'g', '===== 10 passed, 0 failed, 10 expected red =====', true],
    ['expected reds and a failure', 'g', '===== 4689 passed, 1 failed, 10 expected red =====', false, 'Any failure'],
    ['expected reds, below the floor', 'g', '===== 9 passed, 0 failed, 3 expected red =====', false, 'below its floor'],
    ['an expected red summary quoted inside a test line', 'g', '  ok   prints "===== 10 passed, 0 failed, 10 expected red =====" at the end\n', false],
    ['an expected red clause with no count', 'g', '===== 10 passed, 0 failed, expected red =====', false],
    // The ceiling on expected red, 9 October. eng stands for the engine with
    // its floor at a clean run's count and its ceiling at that run's reds.
    ['the CRISIS group deleted: fewer passes, 0 expected red', 'eng', '===== 4678 passed, 0 failed, 0 expected red =====', false, 'below its floor'],
    ['one expected red lost', 'eng', '===== 4688 passed, 0 failed, 9 expected red =====', false, 'below its floor'],
    ['11 expected red against a ceiling of 10', 'eng', '===== 4690 passed, 0 failed, 11 expected red =====', false, 'above its ceiling'],
    ['exactly 10 expected red, at the ceiling', 'eng', '===== 4689 passed, 0 failed, 10 expected red =====', true],
    ['the fix landed: 0 expected red, at the floor', 'eng', '===== 4689 passed, 0 failed, 0 expected red =====', true],
    ['the old shape, no clause, below the floor', 'eng', '===== 4678 passed, 0 failed =====', false, 'no expected red clause'],
    ['the old shape, no clause, at the floor', 'eng', '===== 4689 passed, 0 failed =====', true],
    ['an engine summary quoted inside test output', 'eng', '  ok   prints "===== 4689 passed, 0 failed, 10 expected red =====" at the end\n', false, 'no summary line'],
    ['expected reds and no ceiling set', 'nocap', '===== 10 passed, 0 failed, 2 expected red =====', false, 'no ceiling'],
    ['a ceiling that is not a whole number', 'badcap', '===== 10 passed, 0 failed, 2 expected red =====', false, 'ceiling'],
  ];
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'floors-'));
  let bad = 0;
  try {
    for (const [name, gate, text, want, says] of CASES) {
      const log = path.join(dir, gate + '.log');
      fs.rmSync(log, { force: true });
      if (text !== null) fs.writeFileSync(log, text);
      const [ok, msg] = judge(gate, dir, T);
      const said = !says || msg.includes(says);
      const right = ok === want && said;
      if (!right) bad++;
      console.log((right ? '  ok   ' : 'FAIL ') + name + ': ' + (ok ? 'passes' : 'fails')
        + (ok === want ? '' : ', expected it to ' + (want ? 'pass' : 'fail'))
        + (said ? '' : ', for another reason than "' + says + '"') + '. ' + msg);
    }
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
  let table = null;
  try { table = JSON.parse(fs.readFileSync(FLOORS, 'utf8')); } catch (e) { /* reported below */ }
  const fl = (table && table.floors) || {};
  const sound = table && Object.keys(fl).length && Object.values(fl).every(v => Number.isInteger(v) && v > 0);
  if (!sound) bad++;
  console.log((sound ? '  ok   ' : 'FAIL ') + 'tests/floors.json ' + (sound ? 'reads, and every floor is a whole number above zero' : 'is unreadable, empty, or holds a floor that is not a whole number above zero'));
  console.log('\n===== ' + (CASES.length + 1 - bad) + ' passed, ' + bad + ' failed =====');
  return bad ? 1 : 0;
}

function main(argv) {
  if (argv.includes('--self-test')) return selfTest();
  let dir = null, floors = FLOORS;
  const gates = [];
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--dir') dir = argv[++i] || null;
    else if (argv[i] === '--floors') floors = argv[++i] || FLOORS;
    else if (argv[i].startsWith('-')) { console.log('FAIL unknown option ' + argv[i]); return 1; }
    else gates.push(argv[i]);
  }
  if (!dir && process.env.RUNNER_TEMP) dir = path.join(process.env.RUNNER_TEMP, 'gates');
  if (!dir) { console.log('FAIL no log directory: pass --dir DIR, or set RUNNER_TEMP as CI does.'); return 1; }
  let table;
  try { table = JSON.parse(fs.readFileSync(floors, 'utf8')); }
  catch (e) { console.log('FAIL ' + floors + ' cannot be read: ' + e.message); return 1; }
  return check(gates, dir, table);
}

process.exit(main(process.argv.slice(2)));
