#!/bin/sh
# ============================================================
# THE GOLDEN JOURNEY'S MUTANTS. A gate that passes a broken build is not a
# gate, so tests/golden.js is run here against copies of the BUILT
# source.html, each with one wire of the journey cut, and every copy must
# fail the walk on the check named for it. The unmutated build runs first,
# as the known good case, and must pass.
#
# It edits a copy in its own temp folder and never the sources or the root
# source.html. A cut that does not land exactly once in the build is
# reported as not applied and fails this script, so a renamed function
# cannot turn a mutant into a silent pass.
#
#   ./atuned_src/BUILD-engine.sh && ./atuned_src/BUILD.sh && ./funnel/BUILD-single.sh
#   mkdir -p /tmp/atuned-g0 && env NODE_PATH=/opt/node22/lib/node_modules \
#     PLAYWRIGHT_BROWSERS_PATH=$PW_DIR TMPDIR=/tmp/atuned-g0 tools/golden-mutants.sh [M1 M2 ...]
#
# PW_DIR is the Playwright browser folder HANDOFF-2026-10-09/HANDSHAKE.md
# section 4 names. Each walk takes the shared browser lock for itself, so the
# lock is not held between walks. Exits 0 only when the good build passes and
# every mutant named (all of them by default) fails on its own check.
# ============================================================
cd "$(dirname "$0")/.." || exit 2
exec node - "$@" <<'EOF'
'use strict';
const fs = require('fs'), path = require('path'), os = require('os');
const { spawnSync } = require('child_process');
const SRC = path.resolve('source.html');
if (!fs.existsSync(SRC)) { console.log('FAIL source.html is missing: build first'); process.exit(2); }
const OUT = fs.mkdtempSync(path.join(os.tmpdir(), 'golden-mutants-'));
/* Each cut is one or more exact replacements in the built file, and the check
   tests/golden.js must print as a FAIL line because of it. */
const MUT = [
  { k: 'M1', what: 'the answer to What changed is never written to the evidence',
    cut: [['var r=releaseVerify(CURP.practice||null,k,ids,{story_t:RUN.storyT});', 'var r={ok:true,ids:[],errs:[]};']],
    fail: /FAIL  and the answer to What changed, 0 rows/ },
  { k: 'M2', what: 'the app never reads the record in the link',
    cut: [['RECORD_LINK=recordLinkBoot();', 'RECORD_LINK=null;']],
    fail: /FAIL  the app opens on the link and loads the record/ },
  { k: 'M3', what: 'the first visit is never joined to an account made at the door (the fix reverted)',
    cut: [['function authFunnelJoin(){', 'function authFunnelJoin(){return Promise.resolve({ok:false,asked:false});']],
    fail: /FAIL  the app asked the server to join it to the account/ },
  { k: 'M4', what: 'the join is not asked again after a mark (half the fix: joined only when a screen reopens)',
    cut: [['    authFunnelJoin();\n    return {ok:true,session:r.body.session};', '    return {ok:true,session:r.body.session};']],
    fail: /FAIL  from the first mark on, the server holds the first visit on the account/ },
  { k: 'M5', what: 'the end card closes the first run without telling the server (the fix reverted)',
    cut: [["if(typeof authFunnelCheckpoint==='function')authFunnelCheckpoint({tutorialCompleted:true});\n  obClose('end'); return; }", "obClose('end'); return; }"]],
    fail: /FAIL  and that the first run was finished/ },
  { k: 'M6', what: 'a release never lifts the laws at its seat',
    cut: [['function releaseWork(p,keys){', 'function releaseWork(p,keys){var c=cqSum();return {laws:{},cq0:c,cq1:c,n:0};']],
    fail: /FAIL  the release lifted it/ },
  /* on paying, the welcome card's own save writes the plan too, so nothing is
     lost there and the walk says so; on cancelling no other save follows */
  { k: 'M7', what: 'a plan read back from Stripe is never saved by the read itself',
    cut: [['CURP.plan=v.profile.plan;\n var saved=pSave();', 'CURP.plan=v.profile.plan;\n var saved=true;']],
    fail: /FAIL  after a reload the saved record reads ended, and free is in force/ },
  { k: 'M8', what: 'Summary prints CQ cut down rather than rounded',
    cut: [["['coherence', r.darkB, r.CQ, String(Math.round(r.CQ))", "['coherence', r.darkB, r.CQ, String(Math.floor(r.CQ))"],
          ["+cr(r.darkB,r.CQ,{size:'lg',label:'Coherence',raw:String(Math.round(r.CQ))", "+cr(r.darkB,r.CQ,{size:'lg',label:'Coherence',raw:String(Math.floor(r.CQ))"]],
    fail: /FAIL  Summary prints it/ }];
const want = process.argv.slice(2);
const pick = want.length ? MUT.filter(m => want.indexOf(m.k) >= 0) : MUT;
if (want.length && pick.length !== want.length) { console.log('FAIL no such mutant: ' + want.filter(k => !MUT.some(m => m.k === k)).join(' ')); process.exit(2); }
const walk = (file, name) => {
  const r = spawnSync('flock', ['-o', '-w', '3600', '-E', '75', '/tmp/atuned-browser.lock', 'node', 'tests/golden.js'],
    { env: Object.assign({}, process.env, { ATUNED_FILE: file }), encoding: 'utf8', maxBuffer: 64 << 20 });
  const log = (r.stdout || '') + (r.stderr || '');
  fs.writeFileSync(path.join(OUT, name + '.log'), log);
  const sum = (log.match(/===== \d+ passed, \d+ failed, \d+ expected red =====/g) || []).pop() || 'no summary line';
  return { code: r.status, log, sum };
};
let bad = 0;
const html = fs.readFileSync(SRC, 'utf8');
console.log('known good: the unmutated build');
const g = walk(SRC, 'good');
const good = g.code === 0 && / 0 failed, /.test(g.sum);
console.log('  ' + (good ? 'ok    ' : 'FAIL  ') + 'it passes, ' + g.sum + (g.code === 75 ? ' (the browser lock never came free: NOT RUN)' : ''));
if (!good) bad++;
for (const m of pick) {
  let text = html, applied = true;
  for (const [a, b] of m.cut) {
    const n = text.split(a).length - 1;
    if (n !== 1) { applied = false; console.log(m.k + '  FAIL  the cut did not land exactly once (' + n + ' times): ' + JSON.stringify(a.slice(0, 60))); break; }
    text = text.replace(a, () => b);
  }
  if (!applied) { bad++; continue; }
  const file = path.join(OUT, m.k + '.html');
  fs.writeFileSync(file, text);
  const r = walk(file, m.k);
  const line = (r.log.split('\n').filter(l => m.fail.test(l))[0] || '').trim();
  const caught = r.code === 1 && !!line;
  if (!caught) bad++;
  /* a walk that never got the browser proved nothing either way: it fails
     this script, and says NOT RUN rather than that the check missed */
  const tag = caught ? 'ok      ' : r.code === 75 ? 'NOT RUN ' : 'FAIL    ';
  console.log(m.k + '  ' + tag + m.what);
  console.log('      ' + (r.code === 75 ? 'the browser lock never came free' : line || 'the named check did not fail') + '\n      ' + r.sum);
}
console.log('\nlogs in ' + OUT);
console.log('===== ' + (pick.length + 1 - bad) + ' passed, ' + bad + ' failed =====');
process.exit(bad ? 1 : 0);
EOF
