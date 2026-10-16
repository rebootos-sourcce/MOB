#!/usr/bin/env node
/* ============================================================
   ORPHANS. A gate that no workflow runs is not a gate.

   On 16 October the round 1 verification sweep found seven files under
   tests/ that no job in .github/workflows ran and no gate pulled in by
   require: honest.js, plan-selfgrant.js, becoming.js, dailyui.js, loopui.js,
   personas-tier.js and valuefeltui.js. Two of them were red on main and had
   been for days, one of them for eight, and nothing could see it, because a
   file that is never run is never red. honest.js holds the rule in
   CLAUDE.md that a control must never claim success before it has it.

   This check makes that state impossible to reach quietly. Every tests/*.js
   must be one of:

     run      named after `node` in a run line or matrix command of a
              workflow under .github/workflows, comments excluded, so a file
              mentioned only in a comment is still an orphan;
     pulled   reached by require from a file that is run, followed through
              tests/ and tools/ to any depth, so the helpers (net.js,
              seed.js, trace.js) and the families functional.js and
              engine.js load (flowtools.js, daily.js and the rest) count as
              run without being named twice;
     manual   listed in MANUAL below, with the reason it is run by hand.

   Anything else fails by name. The MANUAL list is held too: an entry whose
   file is gone, or that a workflow already runs, fails, so the list cannot
   rot into a place where files are parked and forgotten.

   Requires are read from code with comments blanked and strings kept, so a
   require written in a comment does not pull anything in. The forms read are
   require('./x.js'), require('../tests/x.js') and require(path.join(
   __dirname, ...)) or path.resolve with string parts, which are the forms
   this repository uses, read off it on 16 October.

     node tools/orphans.js              check this repository, exit 1 on any orphan
     node tools/orphans.js --self-test  plant known bad trees and prove each fails
     node tools/orphans.js --root DIR   check another tree (the self test uses it)
   ============================================================ */
'use strict';
const fs = require('fs'), path = require('path'), os = require('os');

/* Deliberately manual. Each entry is a file under tests/ that is not run by
   any workflow on purpose, and the reason, which is printed on every run.
   Empty means every test file is run by CI. Adding one is a decision a
   reviewer must be able to see, so it carries its reason here, not in a
   commit message. */
const PENDING = 'NOT MANUAL. Unrun on main as of 16 October (round 1 sweep, F3). Step 2 of the gates coverage change wires it into deploy.yml, and the stale entry rule below then fails until this line is deleted.';
const MANUAL = {
  'becoming.js': PENDING,
  'dailyui.js': PENDING,
  'honest.js': PENDING,
  'loopui.js': PENDING,
  'personas-tier.js': PENDING,
  'plan-selfgrant.js': PENDING,
  'valuefeltui.js': PENDING,
};

/* YAML and bash share `#` as a comment. A `#` opens one at the start of a
   line or after whitespace, outside quotes. ${{ }} never holds a bare `#`. */
function yamlCode(text) {
  return text.split('\n').map(line => {
    let q = null;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (q) { if (c === q) q = null; continue; }
      if (c === '"' || c === "'") { q = c; continue; }
      if (c === '#' && (i === 0 || /\s/.test(line[i - 1]))) return line.slice(0, i);
    }
    return line;
  }).join('\n');
}

/* Blank // and block comments in JavaScript, keep strings, so a require in a
   comment is not a call and a require('./x.js') keeps its argument. A slash
   opens a regex by the usual guess from the character before it; a regex is
   copied through untouched so its quotes do not open a string. */
function jsCode(src) {
  let out = '', i = 0, prev = '(';
  while (i < src.length) {
    const c = src[i], d = src[i + 1];
    if (c === '/' && d === '/') {
      let j = src.indexOf('\n', i); if (j < 0) j = src.length;
      out += ' '.repeat(j - i); i = j; continue;
    }
    if (c === '/' && d === '*') {
      let j = src.indexOf('*/', i + 2); j = j < 0 ? src.length : j + 2;
      out += src.slice(i, j).replace(/[^\n]/g, ' '); i = j; continue;
    }
    if (c === "'" || c === '"' || c === '`' || (c === '/' && !/[\w$)\]]/.test(prev))) {
      let j = i + 1, cls = false;
      while (j < src.length) {
        const x = src[j];
        if (x === '\\') { j += 2; continue; }
        if (x === '\n' && c !== '`') break;
        j++;
        if (c === '/') { if (x === '[') cls = true; else if (x === ']') cls = false; else if (x === '/' && !cls) break; }
        else if (x === c) break;
      }
      j = Math.min(j, src.length);
      out += src.slice(i, j); i = j; prev = 'a'; continue;
    }
    out += c; if (!/\s/.test(c)) prev = c; i++;
  }
  return out;
}

const RUN = /\bnode\s+(?:-[\w-]+(?:=\S+)?\s+)*((?:\.\/)?(?:tests|tools)\/[\w.-]+\.js)\b/g;
const REQ_REL = /\brequire\(\s*(['"])(\.{1,2}\/[^'"]+)\1\s*\)/g;
const REQ_PATH = /\brequire\(\s*path\.(?:join|resolve)\(\s*__dirname\s*((?:,\s*(['"])[^'"]*\2\s*)+)\)\s*\)/g;

function requires(file) {
  let code;
  try { code = jsCode(fs.readFileSync(file, 'utf8')); } catch (e) { return []; }
  const dir = path.dirname(file), out = [];
  const add = p => { const r = path.resolve(dir, p); out.push(/\.[cm]?js$/.test(r) ? r : r + '.js'); };
  for (const m of code.matchAll(REQ_REL)) add(m[2]);
  for (const m of code.matchAll(REQ_PATH)) {
    const parts = [...m[1].matchAll(/(['"])([^'"]*)\1/g)].map(x => x[2]);
    add(path.join(...parts));
  }
  return out;
}

function check(root, manual) {
  const tdir = path.join(root, 'tests'), wdir = path.join(root, '.github', 'workflows');
  const fails = [], notes = [];
  if (!fs.existsSync(tdir)) return { fails: ['tests/ is missing under ' + root + ', so nothing was checked'], notes };
  if (!fs.existsSync(wdir)) return { fails: ['.github/workflows is missing under ' + root + ', so no file can be run'], notes };
  const tests = fs.readdirSync(tdir).filter(n => /\.js$/.test(n) && fs.lstatSync(path.join(tdir, n)).isFile()).sort();
  const wfs = fs.readdirSync(wdir).filter(n => /\.ya?ml$/.test(n)).sort();
  if (!wfs.length) fails.push('no workflow file under .github/workflows');
  const ran = new Map();      // absolute path -> workflow that runs it
  for (const w of wfs) {
    const code = yamlCode(fs.readFileSync(path.join(wdir, w), 'utf8'));
    for (const m of code.matchAll(RUN)) {
      const p = path.resolve(root, m[1]);
      if (!ran.has(p)) ran.set(p, w);
    }
  }
  const reached = new Map();  // absolute path -> how it is reached
  const queue = [];
  for (const [p, w] of ran) { reached.set(p, 'run by ' + w); queue.push(p); }
  while (queue.length) {
    const f = queue.shift();
    for (const r of requires(f)) {
      if (reached.has(r) || !fs.existsSync(r)) continue;
      reached.set(r, 'pulled in by ' + path.relative(root, f));
      queue.push(r);
    }
  }
  let run = 0, pulled = 0, man = 0;
  for (const n of tests) {
    const p = path.join(tdir, n), how = reached.get(p);
    if (how) { if (how.startsWith('run')) run++; else pulled++; continue; }
    if (Object.prototype.hasOwnProperty.call(manual, n)) { man++; notes.push('manual  tests/' + n + ': ' + manual[n]); continue; }
    fails.push('tests/' + n + ' is run by no workflow job and pulled in by no file that is. Add it to a job in .github/workflows/deploy.yml, or to MANUAL in tools/orphans.js with the reason it is run by hand.');
  }
  for (const n of Object.keys(manual).sort()) {
    const p = path.join(tdir, n);
    if (!fs.existsSync(p)) fails.push('MANUAL names tests/' + n + ', which does not exist. Drop it from the list.');
    else if (reached.has(p)) fails.push('MANUAL names tests/' + n + ', which is ' + reached.get(p) + '. Drop it from the list, it is not manual.');
  }
  notes.unshift(tests.length + ' test files: ' + run + ' run by a workflow, ' + pulled + ' pulled in by one, ' + man + ' manual');
  return { fails, notes };
}

function report(r) {
  for (const n of r.notes) console.log('  ' + n);
  for (const f of r.fails) console.log('FAIL ' + f);
  console.log('orphans: ' + (r.fails.length ? r.fails.length + ' failing' : 'none'));
  return r.fails.length ? 1 : 0;
}

/* ---- --self-test: plant each known bad tree and prove it fails ---- */
function selfTest() {
  const WF = [
    'jobs:',
    '  g:',
    '    strategy:',
    '      matrix:',
    '        include:',
    '          - { gate: a, command: node tests/a.js }',
    '          - { gate: e, command: ATUNED_X=1 node tests/e.js }',
    '    steps:',
    '      # node tests/c.js is only in this comment',
    '      - run: node tools/t.js && echo "#not a comment" # node tests/c.js',
    '',
  ].join('\n');
  const FILES = {
    'tests/a.js': "require('./b.js');\n// require('./c.js') in a comment pulls nothing in\n",
    'tests/b.js': "const s = require('./h');\n",
    'tests/h.js': '',
    'tests/e.js': '',
    'tests/c.js': '',
    'tools/t.js': "require(path.join(__dirname, '..', 'tests', 'f.js'));\nrequire('../tests/g.js');\n",
    'tests/f.js': '',
    'tests/g.js': '',
  };
  const CASES = [
    // [name, change to the tree, manual list, should pass, words a failure must carry]
    ['the planted orphan c.js, named only in comments, fails', null, {}, false, 'tests/c.js is run by no workflow'],
    ['c.js listed as manual passes', null, { 'c.js': 'by hand' }, true],
    ['c.js removed, nothing orphaned', t => fs.rmSync(path.join(t, 'tests/c.js')), {}, true],
    ['a stale manual entry fails', t => fs.rmSync(path.join(t, 'tests/c.js')), { 'gone.js': 'x' }, false, 'does not exist'],
    ['a manual entry that a workflow runs fails', null, { 'c.js': 'x', 'a.js': 'x' }, false, 'tests/a.js, which is run by'],
    ['a manual entry pulled in by a run file fails', null, { 'c.js': 'x', 'h.js': 'x' }, false, 'pulled in by'],
    ['a file required only by an orphan is an orphan', t => fs.writeFileSync(path.join(t, 'tests/c.js'), "require('./k.js');\n") || fs.writeFileSync(path.join(t, 'tests/k.js'), ''), { 'c.js': 'x' }, false, 'tests/k.js is run by no workflow'],
    ['a gate dropped from the matrix becomes an orphan', t => fs.writeFileSync(path.join(t, '.github/workflows/w.yml'), WF.replace('          - { gate: e, command: ATUNED_X=1 node tests/e.js }\n', '')), { 'c.js': 'x' }, false, 'tests/e.js is run by no workflow'],
    ['no workflows directory fails', t => fs.rmSync(path.join(t, '.github'), { recursive: true }), { 'c.js': 'x' }, false, 'missing'],
  ];
  let bad = 0;
  for (const [name, change, manual, want, says] of CASES) {
    const t = fs.mkdtempSync(path.join(os.tmpdir(), 'orphans-'));
    try {
      fs.mkdirSync(path.join(t, '.github/workflows'), { recursive: true });
      fs.mkdirSync(path.join(t, 'tests')); fs.mkdirSync(path.join(t, 'tools'));
      fs.writeFileSync(path.join(t, '.github/workflows/w.yml'), WF);
      for (const [f, s] of Object.entries(FILES)) fs.writeFileSync(path.join(t, f), s);
      if (change) change(t);
      const r = check(t, manual), ok = !r.fails.length;
      const said = !says || r.fails.some(f => f.includes(says));
      const right = ok === want && said;
      if (!right) bad++;
      console.log((right ? '  ok   ' : 'FAIL ') + name + ': ' + (ok ? 'passes' : 'fails, ' + r.fails[0])
        + (ok === want ? '' : ', expected it to ' + (want ? 'pass' : 'fail'))
        + (said ? '' : ', for another reason than "' + says + '"'));
    } finally { fs.rmSync(t, { recursive: true, force: true }); }
  }
  console.log('\n===== ' + (CASES.length - bad) + ' passed, ' + bad + ' failed =====');
  return bad ? 1 : 0;
}

function main(argv) {
  if (argv.includes('--self-test')) return selfTest();
  let root = path.resolve(__dirname, '..');
  const i = argv.indexOf('--root');
  if (i >= 0) { if (!argv[i + 1]) { console.log('FAIL --root needs a directory'); return 1; } root = path.resolve(argv[i + 1]); }
  return report(check(root, MANUAL));
}

process.exit(main(process.argv.slice(2)));
