#!/usr/bin/env node
/* ============================================================
   FLAKES. A flake is still a defect, in the gate, and it gets a record.

   Until 3 November a flaky check lived in pull request comments: station R
   of tests/golden.js failed sixteen times across the runs of two pull
   requests before anybody counted, and each red run was waved through on
   its own as "that one again". tests/flakes.json is the record, and this
   is the only thing that writes it.

   A failing check is the line a gate prints for it, `  FAIL <check>` as
   nearly every gate here prints, or `not ok N - <check>` from node --test,
   with colour stripped and every run of digits read as N, so the same check
   failing with a different count is one check. A summary line is not a
   check, and neither is a line quoting one.

     node tools/flakes.js                    print the ledger, the reopened first
     node tools/flakes.js lookup GATE LOG    say, for each failing check in LOG,
                                             whether it is a known entry. Writes nothing.
     node tools/flakes.js record GATE LOG [--run ID] [--commit SHA] [--where TEXT]
                                             count one sighting of each failing
                                             check in LOG: a known entry gains one,
                                             a resolved one is marked reopened,
                                             an unknown one is added as suspected
     node tools/flakes.js --self-test        known logs against a scratch ledger
     --ledger FILE                           another ledger (the self test uses it)

   A NEW FAILURE IS NOT A FLAKE. record adds it as suspected, never open: a
   first failure is a failure until it is shown not to reproduce on the same
   commit, three runs, and moving it to open is a deliberate edit. Nothing
   in CI calls record yet; wiring the nightly run's failures into it is the
   next step, and a separate change.
   ============================================================ */
'use strict';
const fs = require('fs'), path = require('path'), os = require('os'), cp = require('child_process');

const LEDGER = path.join(__dirname, '..', 'tests', 'flakes.json');
const STATUS = ['suspected', 'open', 'resolved', 'reopened'];
const ORDER = { reopened: 0, open: 1, suspected: 2, resolved: 3 };

// colour, a CRLF, and the timestamp GitHub puts before every line of a job's
// log (2026-11-01T16:01:40.1499347Z), which a downloaded CI log carries
const strip = (l) => l.replace(/\x1b\[[0-9;]*m/g, '').replace(/\r$/, '').replace(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d+)?Z ?/, '');
const keyOf = (text) => text.replace(/\d+/g, 'N').replace(/\s+/g, ' ').trim();

/* every failing check in a log, in order, once each */
function failures(text) {
  const out = [], seen = new Set();
  for (const raw of String(text).split('\n')) {
    const l = strip(raw);
    let m = /^\s*FAIL\b:?\s+(.*\S)\s*$/.exec(l) || /^\s*not ok \d+ - (.*\S)\s*$/.exec(l);
    if (!m) continue;
    const line = m[1];
    if (/^=+\s*\d+ passed/.test(line)) continue;
    const check = keyOf(line);
    if (!check || seen.has(check)) continue;
    seen.add(check);
    out.push({ check, example: line });
  }
  return out;
}

function validate(L) {
  const bad = [];
  if (!L || typeof L !== 'object' || !Array.isArray(L.flakes)) return ['the ledger has no flakes list'];
  const keys = new Set();
  L.flakes.forEach((f, i) => {
    const at = 'entry ' + i + (f && f.gate ? ' (' + f.gate + ')' : '');
    if (!f || typeof f !== 'object') { bad.push(at + ' is not an object'); return; }
    for (const k of ['gate', 'check', 'example']) if (typeof f[k] !== 'string' || !f[k]) bad.push(at + ' has no ' + k);
    if (!Number.isInteger(f.sightings) || f.sightings < 1) bad.push(at + ' sightings is ' + JSON.stringify(f.sightings) + ', not a whole number above zero');
    if (!STATUS.includes(f.status)) bad.push(at + ' status is ' + JSON.stringify(f.status) + ', not one of ' + STATUS.join(', '));
    for (const k of ['first_seen', 'last_seen'])
      if (!f[k] || typeof f[k].commit !== 'string' || typeof f[k].run !== 'string' || typeof f[k].date !== 'string') bad.push(at + ' ' + k + ' needs run, commit and date');
    if ((f.status === 'resolved' || f.status === 'reopened') && (!f.resolved || typeof f.resolved.commit !== 'string' || !f.resolved.commit))
      bad.push(at + ' is ' + f.status + ' and names no fix commit in resolved.commit');
    if (typeof f.check === 'string' && f.check !== keyOf(f.check)) bad.push(at + ' check is not in its key form: ' + JSON.stringify(keyOf(f.check)));
    const k = f.gate + '\u0000' + f.check;
    if (keys.has(k)) bad.push(at + ' repeats gate ' + f.gate + ' check ' + JSON.stringify(f.check));
    keys.add(k);
  });
  return bad;
}

function load(file) {
  const L = JSON.parse(fs.readFileSync(file, 'utf8'));
  const bad = validate(L);
  if (bad.length) throw new Error(file + ': ' + bad.join('; '));
  return L;
}

/* what a log means for the ledger, without changing it */
function match(L, gate, text) {
  return failures(text).map(f => {
    const e = L.flakes.find(x => x.gate === gate && x.check === f.check);
    return Object.assign(f, { entry: e || null });
  });
}

function record(L, gate, text, seen) {
  const out = [];
  for (const m of match(L, gate, text)) {
    if (m.entry) {
      m.entry.sightings++;
      m.entry.last_seen = seen;
      let note = 'known, ' + m.entry.status + ', now ' + m.entry.sightings + ' sightings';
      if (m.entry.status === 'resolved') { m.entry.status = 'reopened'; note = 'REOPENED: resolved by ' + m.entry.resolved.commit.slice(0, 8) + ' and failing again, ' + m.entry.sightings + ' sightings'; }
      out.push([m, note]);
    } else {
      L.flakes.push({ gate, check: m.check, example: m.example, first_seen: seen, last_seen: seen, sightings: 1, status: 'suspected' });
      out.push([m, 'new, added as suspected. A first failure is a failure until it is shown not to reproduce']);
    }
  }
  return out;
}

function printLedger(L) {
  const fl = L.flakes.slice().sort((a, b) => ORDER[a.status] - ORDER[b.status] || b.sightings - a.sightings);
  if (!fl.length) console.log('the ledger is empty');
  for (const f of fl) {
    console.log(f.status.toUpperCase().padEnd(10) + ' ' + f.gate + ': ' + f.check);
    console.log('           ' + f.sightings + ' sighting' + (f.sightings === 1 ? '' : 's') + ', first ' + f.first_seen.date + ' ' + f.first_seen.commit.slice(0, 8) + ' run ' + f.first_seen.run
      + ', last ' + f.last_seen.date + ' ' + f.last_seen.commit.slice(0, 8) + ' run ' + f.last_seen.run);
    if (f.resolved) console.log('           fixed by ' + f.resolved.commit.slice(0, 8) + ' on ' + f.resolved.date + (f.resolved.verified ? '; ' + f.resolved.verified : ''));
  }
  const n = s => L.flakes.filter(f => f.status === s).length;
  console.log('\n' + L.flakes.length + ' entries: ' + STATUS.map(s => n(s) + ' ' + s).join(', '));
}

function seenNow(opt) {
  let commit = opt.commit;
  if (!commit) { const r = cp.spawnSync('git', ['rev-parse', 'HEAD'], { cwd: path.join(__dirname, '..'), encoding: 'utf8' }); commit = r.status === 0 ? r.stdout.trim() : 'unknown'; }
  const s = { run: opt.run || process.env.GITHUB_RUN_ID || 'local', commit, date: new Date().toISOString().slice(0, 10) };
  if (opt.where) s.where = opt.where;
  return s;
}

/* ---- --self-test ---- */
function selfTest() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'flakes-'));
  const seen = { run: '1', commit: 'c'.repeat(40), date: '2026-11-03' };
  const base = () => ({ about: [], flakes: [
    { gate: 'golden', check: 'and coming back after an hour reads the plan once more: N reads', example: 'x: 2 reads',
      first_seen: seen, last_seen: seen, sightings: 16, status: 'resolved', resolved: { commit: 'f'.repeat(40), date: '2026-11-02' } },
    { gate: 'pct', check: 'the ring reads N%', example: 'the ring reads 40%', first_seen: seen, last_seen: seen, sightings: 2, status: 'open' }] });
  let bad = 0, ran = 0;
  const t = (name, cond, said) => { ran++; if (!cond) bad++; console.log((cond ? '  ok   ' : 'FAIL ') + name + (said ? ': ' + said : '')); };
  try {
    let L = base(), r;
    r = record(L, 'pct', '  ok   a\n  FAIL  the ring reads 41%\n===== 3 passed, 1 failed =====\n', seen);
    t('a known check with a different number is the known entry', r.length === 1 && r[0][0].entry === L.flakes[1] && L.flakes[1].sightings === 3, r.map(x => x[1]).join('; '));
    L = base();
    r = record(L, 'golden', '\x1b[31m  FAIL  and coming back after an hour reads the plan once more: 2 reads\x1b[0m\r\n', seen);
    t('a resolved check seen again is reopened, in colour and CRLF', L.flakes[0].status === 'reopened' && L.flakes[0].sightings === 17 && /REOPENED/.test(r[0][1]), r.map(x => x[1]).join('; '));
    L = base();
    r = record(L, 'pct', '  FAIL  a check nobody has seen fail\n', seen);
    t('an unknown check is added as suspected, never open', L.flakes.length === 3 && L.flakes[2].status === 'suspected' && L.flakes[2].sightings === 1);
    L = base();
    r = record(L, 'copy', '  FAIL  the ring reads 41%\n', seen);
    t('the same words on another gate are another entry', L.flakes.length === 3 && L.flakes[1].sightings === 2);
    L = base();
    r = record(L, 'pct', '  ok   prints "  FAIL  the ring reads 1%" in its help\n===== 10 passed, 0 failed =====\n', seen);
    t('a green log records nothing, and a FAIL quoted inside a line is not a check', r.length === 0 && L.flakes[1].sightings === 2);
    L = base();
    r = record(L, 'pct', '  FAIL  the ring reads 41%\n  FAIL  the ring reads 42%\n', seen);
    t('one log is one sighting of a check, however many lines repeat it', L.flakes[1].sightings === 3);
    // the line as GitHub's own job log for run 41321440234 carries it
    L = base();
    r = record(L, 'golden', '2026-11-01T16:01:40.1499347Z   FAIL  and coming back after an hour reads the plan once more: 2 reads\n', seen);
    t('a CI job log, timestamp first, matches the known entry', r.length === 1 && r[0][0].entry === L.flakes[0], r.map(x => x[1]).join('; '));
    t('node --test failures are read', failures('not ok 3 - the quiz scores a blank\n').map(f => f.check).join() === 'the quiz scores a blank');
    t('a FAIL summary from floors.js is not a check', failures('FAIL ===== 1 passed, 2 failed =====').length === 0);
    // validation, known bad ledgers
    const broken = [
      ['a sighting count of zero', L => { L.flakes[1].sightings = 0; }],
      ['a status nobody defined', L => { L.flakes[1].status = 'flaky'; }],
      ['a resolved entry with no fix commit', L => { delete L.flakes[0].resolved; }],
      ['two entries for one check', L => { L.flakes.push(JSON.parse(JSON.stringify(L.flakes[1]))); }],
      ['a check not in its key form', L => { L.flakes[1].check = 'the ring reads 40%'; }],
      ['no first_seen commit', L => { delete L.flakes[1].first_seen.commit; }],
    ];
    for (const [name, brk] of broken) { const B = JSON.parse(JSON.stringify(base())); brk(B); const v = validate(B); t('the ledger refuses ' + name, v.length > 0, v[0]); }
    t('the unbroken scratch ledger validates', validate(base()).length === 0);
    // record writes the file and only the file it was given
    const f = path.join(dir, 'l.json');
    fs.writeFileSync(f, JSON.stringify(base()));
    const log = path.join(dir, 'pct.log'); fs.writeFileSync(log, '  FAIL  the ring reads 7%\n');
    const res = cp.spawnSync(process.execPath, [__filename, 'record', 'pct', log, '--ledger', f, '--run', '9', '--commit', 'a'.repeat(40)], { encoding: 'utf8' });
    const after = JSON.parse(fs.readFileSync(f, 'utf8'));
    t('record on the command line writes the ledger it was given', res.status === 0 && after.flakes[1].sightings === 3 && after.flakes[1].last_seen.run === '9', (res.stdout || '').trim().split('\n').pop());
    const lk = cp.spawnSync(process.execPath, [__filename, 'lookup', 'pct', log, '--ledger', f], { encoding: 'utf8' });
    t('lookup writes nothing', lk.status === 0 && JSON.parse(fs.readFileSync(f, 'utf8')).flakes[1].sightings === 3);
    let real = null, why = '';
    try { real = load(LEDGER); } catch (e) { why = e.message; }
    t('tests/flakes.json reads and validates', !!real, why || real.flakes.length + ' entries');
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
  console.log('\n===== ' + (ran - bad) + ' passed, ' + bad + ' failed =====');
  return bad ? 1 : 0;
}

function main(argv) {
  if (argv.includes('--self-test')) return selfTest();
  const opt = { ledger: LEDGER }, pos = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--ledger') opt.ledger = argv[++i];
    else if (a === '--run') opt.run = argv[++i];
    else if (a === '--commit') opt.commit = argv[++i];
    else if (a === '--where') opt.where = argv[++i];
    else if (a.startsWith('-')) { console.log('FAIL unknown option ' + a); return 2; }
    else pos.push(a);
  }
  let L;
  try { L = load(opt.ledger); } catch (e) { console.log('FAIL ' + e.message); return 1; }
  const [cmd, gate, log] = pos;
  if (!cmd || cmd === 'print') { printLedger(L); return 0; }
  if (cmd !== 'lookup' && cmd !== 'record') { console.log('FAIL unknown command ' + cmd + '. See the header of tools/flakes.js.'); return 2; }
  if (!gate || !log) { console.log('FAIL ' + cmd + ' takes a gate name and a log file'); return 2; }
  let text;
  try { text = fs.readFileSync(log, 'utf8'); } catch (e) { console.log('FAIL ' + log + ' cannot be read: ' + e.message); return 1; }
  if (cmd === 'lookup') {
    const ms = match(L, gate, text);
    if (!ms.length) console.log('no failing check in ' + log);
    for (const m of ms) console.log((m.entry ? 'known ' + m.entry.status + ', ' + m.entry.sightings + ' sightings: ' : 'not in the ledger: ') + gate + ': ' + m.check);
    return 0;
  }
  const out = record(L, gate, text, seenNow(opt));
  if (!out.length) { console.log('no failing check in ' + log + ', nothing recorded'); return 0; }
  for (const [m, note] of out) console.log(gate + ': ' + m.check + '. ' + note);
  const bad = validate(L);
  if (bad.length) { console.log('FAIL the ledger would not validate after this, so it was not written: ' + bad.join('; ')); return 1; }
  fs.writeFileSync(opt.ledger, JSON.stringify(L, null, 2) + '\n');
  console.log('recorded ' + out.length + ' sighting' + (out.length === 1 ? '' : 's') + ' in ' + path.relative(process.cwd(), opt.ledger));
  return 0;
}

module.exports = { failures, keyOf, validate, match, record };
if (require.main === module) process.exit(main(process.argv.slice(2)));
